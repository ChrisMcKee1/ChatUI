import { v4 as uuidv4 } from 'uuid';
import { Message, ToolCall } from '@/components/molecules/ChatMessagePanel';
import { Role } from '@/components/molecules/MessageBubble';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { IChatService, ChatMessage } from './IChatService';

// Define error types for better error handling
export class ChatApiError extends Error {
  status?: number;
  
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ChatApiError';
    this.status = status;
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends Error {
  constructor() {
    super('Request timed out. Please try again.');
    this.name = 'TimeoutError';
  }
}

// --- Interface for Actual API Response ---
interface ApiResponseContent {
  // Primary content field
  content?: string; 
  
  // Role information (e.g., "ASSISTANT", "USER", "TOOL")
  authorRole?: string; 

  // Author Name (Required for multi-agent, location may vary)
  authorName?: string; // Check root level first

  // Metadata object (Optional, may contain authorName or other data)
  metadata?: { 
    id?: string; // Add id for tool calls
    authorName?: string; // Check metadata second
    [key: string]: any; // Allow other metadata fields
  };

  // Tool call information (Optional, for ASSISTANT messages)
  toolCall?: ToolCall[];

  // Allow other potential top-level fields from the API
  [key: string]: any; 
}

/**
 * Implementation of IChatService that makes actual API calls.
 * Parses responses inspired by Semantic Kernel's ChatMessageContent structure.
 * Uses environment variables for API endpoints.
 */
export class ApiChatService implements IChatService {
  private abortController: AbortController | null = null;
  private standardChatApiUrl: string;
  private multiAgentChatApiUrl: string;
  private multiAgentResponseMode: string;
  private timeoutMs: number = 30000; // 30 seconds timeout

  constructor() {
    // Get API endpoints from environment variables
    this.standardChatApiUrl = process.env.NEXT_PUBLIC_STANDARD_CHAT_API_URL || 'https://api.example.com/chat';
    this.multiAgentChatApiUrl = process.env.NEXT_PUBLIC_MULTI_AGENT_CHAT_API_URL || 'https://api.example.com/multi-agent-chat';
    this.multiAgentResponseMode = process.env.NEXT_PUBLIC_MULTI_AGENT_RESPONSE_MODE || 'stream';
  }
  
  /**
   * Sends a conversation history to the appropriate chat API endpoint based on agent mode
   * 
   * @param messages The complete conversation history
   * @param agentMode The current agent mode (standard or multi-agent)
   * @returns Promise resolving to the assistant response message(s)
   * @throws {ChatApiError} When the API returns an error response
   * @throws {NetworkError} When there's a network error
   * @throws {TimeoutError} When the request times out
   * @throws {Error} For other unexpected errors
   */
  async sendMessage(messages: ChatMessage[], agentMode: AgentMode): Promise<Message | Message[]> {
    this.abortController = new AbortController();
    const { signal } = this.abortController;

    // Determine the correct API endpoint based on agent mode
    const endpoint = agentMode === 'standard' 
      ? process.env.NEXT_PUBLIC_STANDARD_CHAT_API_URL
      : process.env.NEXT_PUBLIC_MULTI_AGENT_CHAT_API_URL;

    if (!endpoint) {
      throw new ChatApiError('API endpoint is not configured. Please check environment variables.', 500);
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
        signal, // Pass the signal to the fetch request
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        console.error('API Error:', response.status, errorBody);
        throw new ChatApiError(errorBody.message || `HTTP error! status: ${response.status}`, response.status);
      }

      const data = await response.json();
      return data.messages;

    } catch (error) {
      if (error instanceof ChatApiError) {
        throw error; // Re-throw ChatApiError directly
      }
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Request aborted by user');
        throw new Error('Request aborted'); // Or handle as needed
      }
      // Handle network errors or other unexpected errors
      console.error('Network or unexpected error:', error);
      throw new Error('Network error or unexpected issue occurred.');
    }
  }
  
  /**
   * Handles standard mode API calls
   */
  private async handleStandardMode(apiUrl: string, payload: Record<string, unknown>, signal: AbortSignal): Promise<Message | Message[]> {
    try {
      // Make the API call
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal,
      });
      
      await this.handleErrorResponse(response); // Centralized error handling
      
      // Parse the response data (expecting an array)
      const data: ApiResponseContent[] = await response.json().catch(() => {
        throw new ChatApiError('Failed to parse API response JSON.', response.status);
      });
      
      // Validate the expected structure (array)
      if (!Array.isArray(data)) { 
        console.error('Unexpected response format for standard mode (expected array):', data);
        throw new ChatApiError('Received response in an unexpected format.', response.status);
      }
      
      // Convert the response objects to UI Messages
      const messages = data.map(item => this.convertToMessage(item)).filter(msg => !!msg.content || msg.role === 'tool' || msg.toolCall); // Changed 'TOOL' to 'tool'
      
      if (messages.length === 0) {
          console.error('Failed to extract any valid messages from standard mode response:', data);
          throw new ChatApiError('Could not extract any valid messages from API response.', response.status);
      }
      
      // Standard mode *might* return multiple messages now (user, tool_call, tool_response, final_assistant)
      return messages;

    } catch (error) {
      // AbortError is handled in sendMessage
      if (error instanceof ChatApiError || error instanceof TimeoutError || error instanceof NetworkError) {
        throw error; // Rethrow known errors
      }
      
      // Wrap unexpected errors from this scope
      console.error('Standard chat API processing error:', error);
      throw new ChatApiError('Failed to process standard chat request.', (error instanceof ChatApiError) ? error.status : 0);
    }
  }
  
  /**
   * Handles multi-agent mode API calls
   */
  private async handleMultiAgentMode(apiUrl: string, payload: Record<string, unknown>, signal: AbortSignal): Promise<Message[]> {
    try {
      // Determine whether to use streaming or batch mode
      const responseMode = this.multiAgentResponseMode;
      const endpoint = `${apiUrl}${responseMode === 'stream' ? '/stream' : '/batch'}`;
      
      // Set headers based on response mode
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // For streaming mode, add the Accept header for Server-Sent Events
      if (responseMode === 'stream') {
        headers['Accept'] = 'text/event-stream';
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal,
      });
      
      await this.handleErrorResponse(response); // Centralized error handling
      
      // Process the response based on mode
      if (responseMode === 'stream' && response.body) {
        // Process streaming response
        return await this.processMultiAgentStream(response.body, signal);
      } else {
        // Process batch response
        const data: ApiResponseContent[] = await response.json().catch(() => {
          throw new ChatApiError('Failed to parse API response JSON.', response.status);
        });
        return this.processMultiAgentBatchResponse(data);
      }
    } catch (error) {
      // AbortError is handled in sendMessage
      if (error instanceof ChatApiError || error instanceof TimeoutError || error instanceof NetworkError) {
        throw error; // Rethrow known errors
      }
      
      // Wrap unexpected errors from this scope
      console.error('Multi-agent chat API processing error:', error);
      throw new ChatApiError('Failed to process multi-agent chat request.', (error instanceof ChatApiError) ? error.status : 0);
    }
  }
  
  /**
   * Process a multi-agent streaming response
   * NOTE: This assumes the stream sends complete JSON objects per event for tool calls/results,
   * similar to the batch response structure. If the stream sends partial tool data,
   * this parsing logic will need significant adjustments.
   */
  private async processMultiAgentStream(body: ReadableStream<Uint8Array>, signal: AbortSignal): Promise<Message[]> {
    const messages: Message[] = [];
    const reader = body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done || signal.aborted) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process buffer line by line for SSE events
        let eolIndex;
        while ((eolIndex = buffer.indexOf('\n\n')) >= 0) {
          const eventBlock = buffer.substring(0, eolIndex);
          buffer = buffer.substring(eolIndex + 2);
          
          const lines = eventBlock.split('\n');
          let eventData = '';
          for (const line of lines) {
            if (line.startsWith('data:')) {
              eventData += line.substring(5).trim();
            }
          }

          if (eventData) {
            try {
              const parsedData: ApiResponseContent = JSON.parse(eventData);
              const message = this.convertToMessage(parsedData);
              // Only add messages with content or tool-related info
              if (message.content || message.role === 'tool' || message.toolCall) { // Changed 'TOOL' to 'tool'
                messages.push(message);
              }
            } catch (parseError) {
              console.error('Failed to parse stream event data:', eventData, parseError);
              // Decide how to handle parse errors - skip, throw, etc.
            }
          }
        }
      }
    } catch (streamError) {
        console.error('Error reading stream:', streamError);
        throw new NetworkError('Error processing streamed response.');
    } finally {
        reader.releaseLock();
    }

    if (signal.aborted) {
        throw new Error('Stream processing aborted.');
    }
    
    return messages;
  }
  
  /**
   * Process a multi-agent batch response
   */
  private processMultiAgentBatchResponse(data: ApiResponseContent[]): Message[] {
    if (!Array.isArray(data)) {
      console.warn('Unexpected response format for multi-agent batch (expected array):', data);
      throw new ChatApiError('Received multi-agent response in an unexpected format.', 0);
    }
    return data.map(item => this.convertToMessage(item)).filter(msg => !!msg.content || msg.role === 'tool' || msg.toolCall); // Changed 'TOOL' to 'tool'
  }
  
  /**
   * Converts the raw API response content into the UI Message format.
   * Handles different roles and extracts necessary fields.
   */
  private convertToMessage(apiResponse: ApiResponseContent): Message {
    let role: Role | 'tool' = 'assistant'; // Default to assistant
    const upperCaseRole = apiResponse.authorRole?.toUpperCase();

    if (upperCaseRole === 'USER') {
      role = 'user';
    } else if (upperCaseRole === 'ASSISTANT') {
      role = 'assistant';
    } else if (upperCaseRole === 'TOOL') {
      role = 'tool';
    } 
    // Add handling for 'SYSTEM' if needed in the future
    
    // Extract agent name (prefer root, fallback to metadata)
    const agentName = apiResponse.authorName || apiResponse.metadata?.authorName;
    
    // Extract content (handle potential non-string content for TOOL role)
    let content = '';
    if (typeof apiResponse.content === 'string') {
      content = apiResponse.content;
    } else if (role === 'tool' && apiResponse.content !== null && apiResponse.content !== undefined) {
      // If it's a TOOL message and content is not null/undefined, stringify it
      try {
        content = JSON.stringify(apiResponse.content, null, 2); // Pretty print JSON
      } catch (e) {
        console.error("Failed to stringify TOOL content:", apiResponse.content);
        content = String(apiResponse.content); // Fallback to simple string conversion
      }
    }

    return {
      id: uuidv4(),
      role: role,
      content: content,
      timestamp: this.formatTimestamp(),
      agentName: role === 'assistant' || role === 'tool' ? agentName : undefined,
      agentIdentifier: role === 'assistant' || role === 'tool' ? agentName : undefined,
      toolCall: role === 'assistant' ? apiResponse.toolCall : undefined,
      toolCallId: role === 'tool' ? apiResponse.metadata?.id : undefined,
    };
  }
  
  /**
   * Centralized check for non-OK HTTP responses.
   */
  private async handleErrorResponse(response: Response): Promise<void> {
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
      console.error('API Error:', response.status, errorBody);
      throw new ChatApiError(errorBody.message || `HTTP error! status: ${response.status}`, response.status);
    }
  }
  
  /**
   * Aborts the current request if one is in progress
   */
  abortRequest(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
      console.log('API request aborted.');
    }
  }
  
  /**
   * Helper to format current timestamp for messages
   */
  private formatTimestamp(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
} 