import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { IChatService, ChatMessage } from './IChatService';
import { trackApiCall } from '@/utils/telemetry';

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

interface ApiResponseItem {
  $type: string;
  Text: string;
}

interface ApiResponseRole {
  Label: string;
}

interface ApiResponseMetadata {
  Id: string;
  CreatedAt: string;
  // Other metadata fields omitted for brevity
}

interface MultiAgentResponseBody {
  AuthorName: string;
  Role: ApiResponseRole;
  Items: ApiResponseItem[];
  ModelId: string;
  Metadata: ApiResponseMetadata;
}

interface StandardResponseBody {
  Role: ApiResponseRole;
  Items: ApiResponseItem[];
  ModelId: string;
  Metadata: ApiResponseMetadata;
}

/**
 * Implementation of IChatService that makes actual API calls
 * Uses environment variables for API endpoints
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
    // Use trackApiCall to add telemetry to the API call
    return trackApiCall(
      agentMode === 'standard' ? 'standard_chat' : 'multi_agent_chat',
      async () => {
        // Create a new abort controller for this request
        this.abortController = new AbortController();
        const signal = this.abortController.signal;
        
        // Create a timeout that will abort the request if it takes too long
        const timeoutId = setTimeout(() => {
          if (this.abortController) {
            this.abortController.abort();
          }
        }, this.timeoutMs);
        
        try {
          // Determine which API endpoint to use based on the agent mode
          const apiUrl = agentMode === 'standard' ? this.standardChatApiUrl : this.multiAgentChatApiUrl;
          
          // Prepare the request payload - same for both modes
          const payload = {
            messages: messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
          };
          
          if (agentMode === 'standard') {
            return await this.handleStandardMode(apiUrl, payload, signal);
          } else {
            return await this.handleMultiAgentMode(apiUrl, payload, signal);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              // Check if this was a timeout abort or a user-initiated abort
              if (timeoutId) {
                throw new TimeoutError();
              } else {
                throw new Error('Request was cancelled.');
              }
            } else if (error instanceof ChatApiError) {
              // Rethrow API errors
              throw error;
            } else if ('message' in error && typeof error.message === 'string' && 
                      (error.message.includes('network') || error.message.includes('fetch'))) {
              throw new NetworkError('Network error. Please check your connection and try again.');
            }
          }
          
          // Log the error and rethrow with a friendly message
          console.error('API call error:', error);
          throw new Error('An unexpected error occurred. Please try again later.');
        } finally {
          clearTimeout(timeoutId);
          this.abortController = null;
        }
      },
      {
        'agent.mode': agentMode,
        'messages.count': messages.length,
        'timeout.ms': this.timeoutMs
      }
    );
  }
  
  /**
   * Handles standard mode API calls
   */
  private async handleStandardMode(apiUrl: string, payload: any, signal: AbortSignal): Promise<Message> {
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
      
      // Handle non-successful responses
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details available');
        
        // Handle specific status codes
        switch (response.status) {
          case 400:
            throw new ChatApiError(`Bad request: ${errorText}`, response.status);
          case 401:
            throw new ChatApiError('Authentication failed. Please sign in again.', response.status);
          case 403:
            throw new ChatApiError('You do not have permission to access this resource.', response.status);
          case 404:
            throw new ChatApiError('The requested resource was not found.', response.status);
          case 429:
            throw new ChatApiError('Too many requests. Please try again later.', response.status);
          case 500:
          case 502:
          case 503:
          case 504:
            throw new ChatApiError('The server encountered an error. Please try again later.', response.status);
          default:
            throw new ChatApiError(`API call failed with status: ${response.status}`, response.status);
        }
      }
      
      // Parse the response data
      const data = await response.json().catch(error => {
        throw new ChatApiError('Failed to parse API response. Please try again.', response.status);
      });
      
      // Process standard response format - an array with one object
      if (Array.isArray(data) && data.length > 0) {
        const responseItem = data[0] as StandardResponseBody;
        
        // Extract text content from the first text item
        const textContent = responseItem.Items
          .filter(item => !item.$type || item.$type === "TextContent")
          .map(item => item.Text)
          .join('\n');
        
        return {
          id: responseItem.Metadata?.Id || uuidv4(),
          content: textContent,
          role: 'assistant',
          timestamp: this.formatTimestamp(),
        };
      } else {
        // Fallback if the response format is unexpected
        console.warn('Unexpected response format for standard mode:', data);
        return {
          id: uuidv4(),
          content: 'Received response in an unexpected format.',
          role: 'assistant',
          timestamp: this.formatTimestamp(),
        };
      }
    } catch (error) {
      if (error instanceof ChatApiError) {
        throw error;
      }
      
      // Rethrow with more context
      console.error('Standard chat API error:', error);
      throw new ChatApiError('Failed to process standard chat request.', 0);
    }
  }
  
  /**
   * Handles multi-agent mode with streaming responses
   */
  private async handleMultiAgentMode(apiUrl: string, payload: any, signal: AbortSignal): Promise<Message[]> {
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
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'No error details available');
        
        // Handle specific status codes
        switch (response.status) {
          case 400:
            throw new ChatApiError(`Bad request: ${errorText}`, response.status);
          case 401:
            throw new ChatApiError('Authentication failed. Please sign in again.', response.status);
          case 403:
            throw new ChatApiError('You do not have permission to access this resource.', response.status);
          case 404:
            throw new ChatApiError('The requested resource was not found.', response.status);
          case 429:
            throw new ChatApiError('Too many requests. Please try again later.', response.status);
          case 500:
          case 502:
          case 503:
          case 504:
            throw new ChatApiError('The server encountered an error. Please try again later.', response.status);
          default:
            throw new ChatApiError(`API call failed with status: ${response.status}`, response.status);
        }
      }
      
      // Process the response based on mode
      if (responseMode === 'stream' && response.body) {
        // Process streaming response
        return await this.processMultiAgentStream(response.body, signal);
      } else {
        // Process batch response
        const data = await response.json().catch(error => {
          throw new ChatApiError('Failed to parse API response. Please try again.', response.status);
        });
        return this.processMultiAgentResponse(data);
      }
    } catch (error) {
      if (error instanceof ChatApiError) {
        throw error;
      }
      
      // Rethrow with more context
      console.error('Multi-agent chat API error:', error);
      throw new ChatApiError('Failed to process multi-agent chat request.', 0);
    }
  }
  
  /**
   * Process a multi-agent streaming response
   */
  private async processMultiAgentStream(body: ReadableStream<Uint8Array>, signal: AbortSignal): Promise<Message[]> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    const messages: Message[] = [];
    
    try {
      while (true) {
        const { value, done } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Check if the request was aborted
        if (signal.aborted) {
          throw new Error('Stream processing was aborted');
        }
        
        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true });
        
        // Process the SSE chunk
        if (chunk.trim().startsWith('data:')) {
          try {
            // Extract the data part of the SSE event
            const dataString = chunk.replace(/^data: /, '').trim();
            
            // Skip heartbeat messages
            if (dataString === '[HEARTBEAT]') {
              continue;
            }
            
            // Parse the JSON data
            const data = JSON.parse(dataString) as MultiAgentResponseBody;
            
            // Extract text content from items
            const textContent = data.Items
              .filter(item => !item.$type || item.$type === "TextContent")
              .map(item => item.Text)
              .join('\n');
            
            // Create a message for this agent's response
            if (textContent.trim()) {
              messages.push({
                id: data.Metadata.Id || uuidv4(),
                content: textContent,
                role: 'assistant',
                agentName: data.AuthorName, // Include agent name for multi-agent responses
                timestamp: this.formatTimestamp(),
              });
            }
          } catch (error) {
            console.error('Error processing SSE event:', error, chunk);
            // Continue processing other events even if one fails
          }
        }
      }
      
      return messages;
    } catch (error) {
      // Handle errors during stream processing
      if (signal.aborted) {
        throw new Error('Stream processing was aborted');
      }
      
      console.error('Error processing multi-agent stream:', error);
      
      if (messages.length > 0) {
        // Return any messages we've already processed
        return messages;
      }
      
      throw new ChatApiError('Error processing streaming response.', 0);
    } finally {
      // Ensure the reader is released
      reader.releaseLock();
    }
  }
  
  /**
   * Process a multi-agent batch response
   */
  private processMultiAgentResponse(data: any): Message[] {
    try {
      if (!Array.isArray(data)) {
        console.warn('Unexpected response format for multi-agent mode:', data);
        // Fallback for unexpected format
        return [{
          id: uuidv4(),
          content: 'Received response in an unexpected format.',
          role: 'assistant',
          timestamp: this.formatTimestamp(),
        }];
      }
      
      // Process the array of responses
      return data.map((agentResponse: MultiAgentResponseBody) => {
        // Extract text content from items
        const textContent = agentResponse.Items
          .filter(item => !item.$type || item.$type === "TextContent")
          .map(item => item.Text)
          .join('\n');
        
        return {
          id: agentResponse.Metadata?.Id || uuidv4(),
          content: textContent,
          role: 'assistant',
          agentName: agentResponse.AuthorName, // Include agent name for multi-agent responses
          timestamp: this.formatTimestamp(),
        };
      });
    } catch (error) {
      console.error('Error processing multi-agent response:', error);
      throw new ChatApiError('Failed to process multi-agent response data.', 0);
    }
  }
  
  /**
   * Aborts the current request if one is in progress
   */
  abortRequest(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }
  
  /**
   * Helper to format current timestamp for messages
   */
  private formatTimestamp(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
} 