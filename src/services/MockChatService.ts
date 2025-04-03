import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { IChatService, ChatMessage } from './IChatService';

export class MockChatService implements IChatService {
  private abortController: AbortController | null = null;
  
  /**
   * Simulates sending a message to an API endpoint and receiving a response
   */
  async sendMessage(messages: ChatMessage[], agentMode: AgentMode): Promise<Message | Message[]> {
    // Create a new abort controller for this request
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    
    try {
      // Get the last user message (most recent one from the user)
      const lastUserMessageIndex = [...messages].reverse().findIndex(msg => msg.role === 'user');
      const lastMessage = lastUserMessageIndex >= 0 
        ? messages[messages.length - 1 - lastUserMessageIndex] 
        : messages[messages.length - 1];
      
      // Simulate network delay
      const delay = agentMode === 'standard' ? 1000 : 2000; // Multi-agent is slower
      await this.delay(delay, signal);
      
      // Generate response based on agent mode
      if (agentMode === 'standard') {
        const responseContent = this.generateStandardResponse(lastMessage.content);
        const assistantMessage: Message = {
          id: uuidv4(),
          content: responseContent,
          role: 'assistant',
          timestamp: this.formatTimestamp(),
        };
        return assistantMessage;
      } else {
        const multiAgentResponseString = this.generateMultiAgentResponseString(lastMessage.content);
        const assistantMessages = this.parseMultiAgentResponse(multiAgentResponseString);
        return assistantMessages;
      }
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request was aborted');
      }
      throw error;
    } finally {
      this.abortController = null;
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
   * Generates a standard chat response
   */
  private generateStandardResponse(userMessage: string): string {
    const responses = [
      `Thank you for your message: "${userMessage}". I'll help you with that.`,
      `I understand you're asking about "${userMessage}". Here's my response...`,
      `Regarding "${userMessage}", I'd suggest the following approach...`,
      `I've processed your request about "${userMessage}" and here's what I found...`,
      `Based on your message about "${userMessage}", I can provide these insights...`,
    ];
    
    return this.getRandomResponse(responses);
  }
  
  /**
   * Generates a multi-agent chat response string that appears to combine multiple perspectives
   */
  private generateMultiAgentResponseString(userMessage: string): string {
    const responses = [
      `[Research Agent] I've analyzed "${userMessage}" and found several peer-reviewed sources.\n\n[Code Agent] Based on this research, here's an implementation approach...\n\n[Planning Agent] Let me integrate these insights into a cohesive strategy for you.`,
      `[Technical Agent] Regarding "${userMessage}", the technical considerations are...\n\n[UX Agent] From a user experience perspective, we should consider...\n\n[Project Agent] Combining these insights, I recommend...`,
      `[Data Agent] I've analyzed the data related to "${userMessage}".\n\n[Domain Agent] In this specific domain, these patterns are significant...\n\n[Strategy Agent] Let me synthesize a comprehensive approach based on these findings.`,
      `[Analysis Agent] Your question about "${userMessage}" can be broken down into...\n\n[Solution Agent] Here are multiple approaches to address this...\n\n[Evaluation Agent] After evaluating all options, I recommend...`,
      `[Framework Agent] For "${userMessage}", relevant frameworks include...\n\n[Implementation Agent] Here's how you might implement this...\n\n[Review Agent] My overall assessment and recommendation is...`,
    ];
    
    return this.getRandomResponse(responses);
  }
  
  /**
   * Parses the multi-agent response string into individual Message objects
   */
  private parseMultiAgentResponse(responseString: string): Message[] {
    const agentMessages: Message[] = [];
    const lines = responseString.split('\n\n'); // Split by double newline
    
    lines.forEach((line) => {
      const match = line.match(/^\[(.*?) Agent\]\s*(.*)/);
      if (match) {
        const agentIdentifier = match[1]; // e.g., "Technical"
        const content = match[2]; // The actual message content
        
        agentMessages.push({
          id: uuidv4(),
          content: content, // Store only the actual content without the prefix
          role: 'assistant',
          timestamp: this.formatTimestamp(),
          agentIdentifier: agentIdentifier,
        });
      }
    });
    
    return agentMessages;
  }
  
  /**
   * Returns a random response from the provided array
   */
  private getRandomResponse(responses: string[]): string {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }
  
  /**
   * Creates a delay that can be aborted
   */
  private delay(ms: number, signal?: AbortSignal): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        resolve();
      }, ms);
      
      if (signal) {
        signal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new DOMException('Aborted', 'AbortError'));
        });
      }
    });
  }
  
  /**
   * Formats the current time as HH:MM
   */
  private formatTimestamp(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
} 