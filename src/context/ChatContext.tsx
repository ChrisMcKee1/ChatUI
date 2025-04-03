'use client';

import React, { createContext, useContext, ReactNode, useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { Role } from '@/components/molecules/MessageBubble';
import { ChatHistory } from '@/components/organisms/ChatHistoryPanel';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { useServices } from '@/services/ServiceProvider';
import { ChatMessage } from '@/services/IChatService';
import { ChatMode } from '@/services/IHistoryService';
import { trackUserAction } from '@/utils/telemetry';

// Map AgentMode to ChatMode
const mapAgentModeToChatMode = (agentMode: AgentMode): ChatMode => {
  return agentMode === 'standard' ? 'standard' : 'multiAgent';
};

interface ChatState {
  messages: Message[];
  chatHistories: ChatHistory[];
  activeChatId: string | null;
  agentMode: AgentMode;
  isLoading: boolean;
}

interface ChatContextType extends ChatState {
  sendMessage: (content: string) => Promise<void>;
  createNewChat: (title?: string) => Promise<string>;
  selectChat: (chatId: string) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  setAgentMode: (mode: AgentMode) => void;
  abortRequest: () => void;
  clearMessages: () => void;
}

const initialState: ChatState = {
  messages: [],
  chatHistories: [],
  activeChatId: null,
  agentMode: 'standard',
  isLoading: false,
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Get services from ServiceProvider
  const { chatService, historyService } = useServices();
  
  // Initialize state
  const [state, setState] = useState<ChatState>(initialState);
  const [isMounted, setIsMounted] = useState(false);
  
  // Set mounted state to true only on the client after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Helper function to format timestamps
  const formatTimestamp = useCallback(() => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);
  
  // Load chat histories only after component is mounted and when agent mode changes
  useEffect(() => {
    // Prevent execution during SSR or before client mount
    if (!isMounted) {
      return;
    }

    const loadChatHistories = async () => {
      try {
        // Convert agent mode to chat mode
        const chatMode = mapAgentModeToChatMode(state.agentMode);
        
        // Get histories for current mode
        // Now uses the potentially updated historyService from ServiceProvider
        const histories = await historyService.getChatHistories(chatMode);
        
        setState(prevState => ({
          ...prevState,
          chatHistories: histories,
          // Clear active chat when switching modes or initially loading
          activeChatId: null,
          messages: []
        }));
        
        // If there are histories, select the most recent one
        if (histories.length > 0) {
          // Pass histories directly to avoid potential state closure issues
          selectChat(histories[0].id, histories);
        }
      } catch (error) {
        console.error('Failed to load chat histories:', error);
      }
    };
    
    loadChatHistories();
  // Depend on isMounted and agentMode
  }, [isMounted, state.agentMode, historyService]); // Add historyService dependency if it can change
  
  // Convert app Message to the ChatMessage format used for API
  const convertToChatMessage = useCallback((message: Message): ChatMessage => {
    return {
      role: message.role,
      content: message.content,
    };
  }, []);
  
  // Create a new chat
  const createNewChat = useCallback(async (title?: string): Promise<string> => {
    // Ensure this only runs client-side if it modifies localStorage indirectly via service
    if (!isMounted) throw new Error("Cannot create chat before client mount");
    try {
      // Convert agent mode to chat mode
      const chatMode = mapAgentModeToChatMode(state.agentMode);
      
      // Create chat with current mode
      const newChat = await historyService.createChat(chatMode, title);
      
      setState(prevState => ({
        ...prevState,
        // Ensure histories are updated based on the latest state before this update
        chatHistories: [newChat, ...(prevState.chatHistories.filter(h => h.id !== newChat.id))], 
        activeChatId: newChat.id,
        messages: [],
      }));
      
      return newChat.id;
    } catch (error) {
      console.error('Failed to create new chat:', error);
      throw error;
    }
  }, [historyService, state.agentMode, isMounted]); // Add isMounted dependency
  
  // Select a chat and load its messages
  // Modify selectChat to optionally accept histories to avoid race conditions
  const selectChat = useCallback(async (chatId: string, currentHistories?: ChatHistory[]) => {
     if (!isMounted) return; // Ensure runs client-side
    try {
      // If already the active chat, do nothing
      if (state.activeChatId === chatId) return;
      
      const messages = await historyService.getChatMessages(chatId);
      
      setState(prevState => ({
        ...prevState,
         // Use provided histories if available, otherwise use state
        chatHistories: currentHistories ?? prevState.chatHistories,
        activeChatId: chatId,
        messages,
      }));
    } catch (error) {
      console.error('Failed to select chat:', error);
    }
  // Add isMounted and state.activeChatId dependencies
  }, [historyService, isMounted, state.activeChatId]);
  
  // Delete a chat
  const deleteChat = useCallback(async (chatId: string) => {
    if (!isMounted) return; // Ensure runs client-side
    try {
      // Convert agent mode to chat mode
      const chatMode = mapAgentModeToChatMode(state.agentMode);
      
      // Delete chat with current mode
      await historyService.deleteChat(chatId, chatMode);
      
      let newActiveChatId: string | null = null;
      let messagesToLoad: Message[] = [];
      let updatedHistoriesList: ChatHistory[] = [];

      setState(prevState => {
        updatedHistoriesList = prevState.chatHistories.filter(chat => chat.id !== chatId);
        
        // If deleting the active chat, select the next available chat
        if (prevState.activeChatId === chatId) {
          newActiveChatId = updatedHistoriesList.length > 0 ? updatedHistoriesList[0].id : null;
          messagesToLoad = []; // Messages will be loaded in selectChat if newActiveChatId is set
        } else {
          // If deleting non-active chat, keep current selection
          newActiveChatId = prevState.activeChatId;
          messagesToLoad = prevState.messages;
        }
          
        return {
          ...prevState,
          chatHistories: updatedHistoriesList,
          activeChatId: newActiveChatId,
          messages: messagesToLoad, // Set messages directly, or empty if new chat will be selected
        };
      });
      
      // If a new chat needs to be selected, call selectChat *after* state update
      if (state.activeChatId === chatId && newActiveChatId) {
         await selectChat(newActiveChatId, updatedHistoriesList);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  // Add isMounted dependency
  }, [historyService, selectChat, state.activeChatId, state.chatHistories, state.agentMode, isMounted]);
  
  // Send a new message
  const sendMessage = useCallback(async (content: string) => {
     if (!isMounted) return; // Ensure runs client-side
    
    // Track this user action
    trackUserAction('send_message', {
      'agent_mode': state.agentMode,
      'has_active_chat': state.activeChatId ? true : false,
      'content_length': content.length
    });
     
    let currentActiveChatId = state.activeChatId;

    // --- Phase 1: Create new chat if needed --- 
    if (!currentActiveChatId) {
      try {
        currentActiveChatId = await createNewChat('New Chat');
        // Set the new active chat ID immediately, messages are still empty
        setState(prevState => ({ ...prevState, activeChatId: currentActiveChatId, messages: [] }));
      } catch (error) {
        console.error("Failed to create chat before sending message:", error);
        // Show error message in UI
        const errorMsg: Message = { id: uuidv4(), content: `Error creating chat: ${error instanceof Error ? error.message : 'Unknown error'}`, role: 'system', timestamp: formatTimestamp() };
        setState(prevState => ({ ...prevState, messages: [errorMsg], isLoading: false }));
        return; // Stop execution
      }
    }

    // --- Phase 2: Add user message and set loading state --- 
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role: 'user',
      timestamp: formatTimestamp(),
    };
    
    // Add user message optimistically and set loading
    setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, userMessage], 
      isLoading: true,
    }));

    // --- Phase 3: Call API and handle response --- 
    try {
      // Prepare messages for API using the state *after* user message was added
      // Need to get the latest messages state *before* calling the API
      let messagesForApi: Message[] = [];
      setState(prevState => { 
        messagesForApi = prevState.messages; // Capture the up-to-date messages
        return prevState; // No actual state change here, just capturing
      });

      if (!messagesForApi.length) {
         // If messagesForApi is somehow empty, use the user message directly
         // This might happen if setState above hasn't flushed?
         // Fallback to ensure user message is included.
         messagesForApi = [userMessage]; 
      }
      
      const chatMessages = messagesForApi.map(convertToChatMessage);
      const response = await chatService.sendMessage(chatMessages, state.agentMode);
      const newAssistantMessages = Array.isArray(response) ? response : [response];
      
      // --- Phase 4: Update state with assistant response & update history ---
      setState(prevState => ({
        ...prevState,
        // Replace previous messages with the list including the user message + new assistant messages
        messages: [...messagesForApi, ...newAssistantMessages],
        isLoading: false,
      }));
      
      // Update history *after* successful response
      if (currentActiveChatId) {
        const finalMessagesForHistory = [...messagesForApi, ...newAssistantMessages];
        await historyService.updateChat(currentActiveChatId, finalMessagesForHistory);
        
        // Update chat histories list (optional, could rely on load on mode change)
        const chatMode = mapAgentModeToChatMode(state.agentMode);
        const histories = await historyService.getChatHistories(chatMode);
        setState(prevState => ({
          ...prevState,
          chatHistories: histories,
        }));
      }
    } catch (error) {
      // --- Phase 5: Handle API error --- 
      console.error('Failed to send message:', error);
      
      // Create a user-friendly error message based on error type
      let errorContent = '';
      let errorRole: Role = 'system';
      
      if (error instanceof Error) {
        // Check for our custom error types
        if (error.name === 'ChatApiError') {
          errorContent = `API Error: ${error.message}`;
        } else if (error.name === 'NetworkError') {
          errorContent = error.message;
        } else if (error.name === 'TimeoutError') {
          errorContent = error.message;
        } else {
          errorContent = `Error: ${error.message}`;
        }
      } else {
        errorContent = 'An unexpected error occurred. Please try again.';
      }

      const errorMessage: Message = {
        id: uuidv4(),
        content: errorContent,
        role: errorRole,
        timestamp: formatTimestamp(),
      };

      // Use functional update for error state, ensuring user message remains
      setState(prevState => ({
        ...prevState,
        // Add error message *after* the user message that triggered it
        messages: [...prevState.messages.filter(m => m.id !== userMessage.id), userMessage, errorMessage],
        isLoading: false,
      }));
    }
  }, [
    state.activeChatId, 
    state.agentMode,
    createNewChat, 
    formatTimestamp,
    historyService,
    chatService,
    convertToChatMessage,
    isMounted, 
  ]);
  
  // Set the agent mode (doesn't directly cause hydration issues)
  const setAgentMode = useCallback((mode: AgentMode) => {
    // Track this user action
    trackUserAction('change_agent_mode', {
      'previous_mode': state.agentMode,
      'new_mode': mode
    });
    
    setState(prevState => ({
      ...prevState,
      agentMode: mode,
      // Clear active chat and messages when switching modes
      activeChatId: null, 
      messages: [],
      chatHistories: [] // Clear histories, they will be reloaded by useEffect
    }));
  }, [state.agentMode]);
  
  // Clear all messages in the current chat
  const clearMessages = useCallback(() => {
     if (!isMounted) return; // Should ideally only be callable client-side
    setState(prevState => ({
      ...prevState,
      messages: [],
      activeChatId: null, 
    }));
    // If clearing messages should also clear history association:
    // Optionally, call createNewChat() here or handle differently
  }, [isMounted]);
  
  // Abort an ongoing request (doesn't directly cause hydration issues)
  const abortRequest = useCallback(() => {
    chatService.abortRequest();
    setState(prevState => ({
      ...prevState,
      isLoading: false,
    }));
  }, [chatService]);
  
  // Create the context value
  const contextValue: ChatContextType = {
    ...state,
    sendMessage,
    createNewChat,
    selectChat,
    deleteChat,
    setAgentMode,
    abortRequest,
    clearMessages,
  };
  
  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}; 