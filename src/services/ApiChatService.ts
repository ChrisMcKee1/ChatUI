import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { Role } from '@/components/molecules/MessageBubble';
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

// --- Interface for Potential API Response (Inspired by ChatMessageContent) ---

// Represents potential content items within the response
interface ApiResponseContentItem {
  $type?: string; // Type identifier (e.g., "TextContent")
  Text?: string;  // Text content (C# uses 'Text')
  // Add other potential item types if needed (e.g., ImageContent)
}

// Represents the structure of a single object within the API response array
// Combines fields from C#, Java, Python ChatMessageContent relevant to the UI
interface ApiResponseContent {
  // Role Information
  Role: { Label: string } | string; // Can be object (C# style) or string (simpler)

  // Author Information (optional, required for multi-agent)
  AuthorName?: string; // C# style
  name?: string;       // Python style

  // Content Information (prioritize Content, fallback to Items)
  Content?: string;    // C# convenience property
  Items?: ApiResponseContentItem[]; // Standard container for content items

  // Optional API-specific fields
  ConversationId?: string; 

  // Allow other potential fields from the full ChatMessageContent
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
    // Use trackApiCall to add telemetry to the API call
    return trackApiCall(
      agentMode === 'standard' ? 'standard_chat' : 'multi_agent_chat',
      async () => {
        // Create a new abort controller for this request
        this.abortController = new AbortController();
        const signal = this.abortController.signal;
        
        // Create a timeout that will abort the request if it takes too long
        let timeoutId: NodeJS.Timeout | null = setTimeout(() => {
          this.abortController?.abort();
          timeoutId = null; // Clear timeoutId when timeout occurs
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
          // Centralized error checking
          if (error instanceof Error) {
            if (error.name === 'AbortError') {
              // Use !!timeoutId to check if it was a timeout or manual abort
              if (timeoutId) { // If timeoutId still exists, it was a manual abort
                throw new Error('Request was cancelled.');
              } else { // If timeoutId is null, the timeout occurred
                throw new TimeoutError();
              }
            } else if (error instanceof ChatApiError || error instanceof NetworkError) {
              throw error; // Rethrow known API/Network error types
            } else if (error.message.includes('fetch') || error.message.includes('network')) {
              // Catch generic fetch/network errors
              throw new NetworkError('Network error. Please check your connection.');
            }
          }
          
          // Log and throw generic error for anything else
          console.error('Unexpected API call error:', error);
          throw new Error('An unexpected error occurred. Please try again later.');
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
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
  private async handleStandardMode(apiUrl: string, payload: Record<string, unknown>, signal: AbortSignal): Promise<Message> {
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
      
      // Parse the response data (expecting an array with one item)
      const data: ApiResponseContent[] = await response.json().catch(() => {
        throw new ChatApiError('Failed to parse API response JSON.', response.status);
      });
      
      // Validate the expected structure (array with one item)
      if (!Array.isArray(data) || data.length !== 1 || !data[0]) {
        console.warn('Unexpected response format for standard mode (expected array with one object):', data);
        throw new ChatApiError('Received response in an unexpected format.', response.status);
      }
      
      // Convert the first (and only) response object to a UI Message
      const message = this.convertToMessage(data[0]);
      if (!message.content) {
         console.error('Failed to extract content from standard mode response:', data[0]);
         throw new ChatApiError('Could not extract message content from API response.', response.status);
      }
      return message;

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
   */
  private async processMultiAgentStream(body: ReadableStream<Uint8Array>, signal: AbortSignal): Promise<Message[]> {
    const reader = body.getReader();
    const decoder = new TextDecoder();
    const messages: Message[] = [];
    let buffer = '';
    
    try {
      while (true) {
        // Abort check before read
        if (signal.aborted) throw new Error('Stream processing was aborted');
        const { value, done } = await reader.read();
        if (done) break;
        // Abort check after read
        if (signal.aborted) throw new Error('Stream processing was aborted');
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process buffer line by line for SSE events
        let boundary = buffer.indexOf('\n\n');
        while (boundary !== -1) {
          const eventString = buffer.substring(0, boundary);
          buffer = buffer.substring(boundary + 2);
          
          if (eventString.trim().startsWith('data:')) {
            const dataString = eventString.replace(/^data: /, '').trim();
            if (dataString === '[HEARTBEAT]') continue; // Skip heartbeats
            
            try {
              const apiResponse: ApiResponseContent = JSON.parse(dataString);
              const message = this.convertToMessage(apiResponse);

              // Validate required fields for multi-agent (AuthorName/name and content)
              if (message.content && message.agentName) { 
                messages.push(message);
              } else {
                console.warn('Skipping invalid SSE data object (missing content or author):', apiResponse);
              }
            } catch (e) {
              console.error('Error parsing SSE data JSON:', e, dataString);
            }
          }
          boundary = buffer.indexOf('\n\n');
        }
      }
      
      // Process any remaining buffer content if needed (usually not necessary for SSE)
      return messages;
    } catch (error) {
      // AbortError is handled in sendMessage
      if (error instanceof ChatApiError) {
        throw error;
      }
      console.error('Error processing multi-agent stream:', error);
      // Return any messages processed so far, or throw if none
      if (messages.length > 0) return messages;
      // Don't re-wrap ChatApiError
      throw new ChatApiError('Error processing streaming response.', (error instanceof ChatApiError) ? error.status : 0);
    } finally {
      // Ensure the reader is released
      reader.releaseLock();
    }
  }
  
  /**
   * Process a multi-agent batch response
   */
  private processMultiAgentBatchResponse(data: ApiResponseContent[]): Message[] {
    if (!Array.isArray(data)) {
      console.warn('Unexpected non-array response format for multi-agent batch mode:', data);
      // Pass status 0 for non-HTTP errors during processing
      throw new ChatApiError('Received response in an unexpected format.', 0);
    }
    
    return data
      .map(apiResponse => this.convertToMessage(apiResponse)) // Convert first
      .filter(message => {
        // Validate required fields for multi-agent (AuthorName/name and content)
        const isValid = message.content && message.agentName;
        if(!isValid) console.warn('Skipping invalid object in batch response (missing content or author):', message); // Log the converted message for easier debug
        return isValid;
      });
  }
  
  /**
   * Converts a potential API response object (inspired by ChatMessageContent) 
   * into a UI Message object, extracting the essential fields.
   */
  private convertToMessage(apiResponse: ApiResponseContent): Message {
     // --- Extract Role ---
     // Role should always be 'assistant' from the API perspective for UI display
     const role: Role = 'assistant'; 

     // --- Extract Author Name ---
     // Check C# 'AuthorName' first, then Python 'name'
     const agentName = apiResponse.AuthorName || apiResponse.name; 

     // --- Extract Content ---
     let content = '';
     // 1. Prioritize direct 'Content' property (common in C# ChatMessageContent)
     if (typeof apiResponse.Content === 'string' && apiResponse.Content.trim() !== '') {
       content = apiResponse.Content;
     } 
     // 2. Fallback to finding the first text item in the 'Items' array
     else if (Array.isArray(apiResponse.Items)) {
       // Find the first item that has a 'Text' property with a non-empty string value
       const textItem = apiResponse.Items.find(
         item => item && typeof item.Text === 'string' && item.Text.trim() !== ''
       );
       if (textItem && textItem.Text) {
         content = textItem.Text;
       } else {
         // Log if Items exist but no suitable TextContent found
         console.warn("No suitable text content found in API response items:", apiResponse.Items);
       }
     } else {
       // Log if neither Content nor Items could provide text
       console.warn("Could not extract text content from API response:", apiResponse);
     }

     // --- Extract Conversation ID (Optional) ---
     // const conversationId = apiResponse.ConversationId; // Can be stored if needed elsewhere

     return {
       id: uuidv4(), // Generate ID client-side
       content: content.trim(), // Ensure content is trimmed
       role: role, 
       agentName: agentName, // Use extracted AuthorName/name if present
       timestamp: this.formatTimestamp(), // Generate timestamp client-side
       // conversationId: conversationId 
     };
   }
  
  /**
   * Centralized check for non-OK HTTP responses.
   */
  private async handleErrorResponse(response: Response): Promise<void> {
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Failed to read error details.');
      let errorMessage = `API call failed with status ${response.status}: ${errorText}`;

      // Provide more user-friendly messages for common statuses
      switch (response.status) {
        case 400: errorMessage = `Bad request: ${errorText}`; break;
        case 401: errorMessage = 'Authentication failed. Please check credentials.'; break;
        case 403: errorMessage = 'Permission denied to access the resource.'; break;
        case 404: errorMessage = 'API endpoint not found.'; break;
        case 429: errorMessage = 'Too many requests. Please try again later.'; break;
        case 500: case 502: case 503: case 504:
          errorMessage = `Server error (${response.status}). Please try again later.`; break;
      }
      throw new ChatApiError(errorMessage, response.status);
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