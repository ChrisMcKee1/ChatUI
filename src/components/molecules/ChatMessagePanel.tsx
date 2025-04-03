'use client';

import { Box, Typography, SxProps, Theme } from '@mui/material';
import { MessageBubble, Role } from '@/components/molecules/MessageBubble';
import { MessageSquare } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useRef } from 'react';

export interface Message {
  id: string;
  content: string;
  role: Role;
  timestamp?: string;
  agentIdentifier?: string;
  agentName?: string;
}

export interface ChatMessagePanelProps {
  messages: Message[];
  className?: string;
  sx?: SxProps<Theme>;
  isLoading?: boolean;
}

export const ChatMessagePanel = ({
  messages,
  className = '',
  sx = {},
  isLoading = false,
}: ChatMessagePanelProps) => {
  const { theme, isDarkMode } = useTheme();
  // Create a ref for the messages container to enable auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Filter messages to only show user and assistant messages
  // System and tool messages are not displayed
  const visibleMessages = messages.filter(message => 
    message.role === 'user' || message.role === 'assistant'
  ).map(message => {
    // If it's an assistant message with agentIdentifier or agentName, ensure content doesn't start with [Agent]
    if (message.role === 'assistant') {
      const agentId = message.agentName || message.agentIdentifier;
      if (agentId) {
        // Check if the content starts with [AgentName Agent] and remove it if it does
        const agentPrefix = `[${agentId} Agent] `;
        if (message.content.startsWith(agentPrefix)) {
          return {
            ...message,
            content: message.content.substring(agentPrefix.length)
          };
        }
      }
    }
    return message;
  });
  
  // Function to scroll to the bottom of the chat
  const scrollToBottom = (immediate = false) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: immediate || isLoading ? 'auto' : 'smooth',
        block: 'end'
      });
    }
  };

  // Auto-scroll when messages change or during loading state
  useEffect(() => {
    if (visibleMessages.length > 0) {
      // Use immediate scrolling during loading (streaming) for a better experience
      scrollToBottom(isLoading);
    }
  }, [visibleMessages.length, messages, isLoading]);

  // Also check if we should auto-scroll when window is resized
  useEffect(() => {
    const handleResize = () => {
      if (visibleMessages.length > 0) {
        scrollToBottom(true); // Immediate scrolling on resize
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visibleMessages.length]);

  // Add a MutationObserver to detect when new message content is added to the DOM
  // This is particularly helpful for streaming responses where the content changes incrementally
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new MutationObserver(() => {
      if (isLoading) {
        scrollToBottom(true);
      }
    });

    observer.observe(containerRef.current, { 
      childList: true, 
      subtree: true, 
      characterData: true 
    });

    return () => observer.disconnect();
  }, [isLoading]);
  
  return (
    <Box
      ref={containerRef}
      className={className}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        height: '100%',
        width: '100%',
        bgcolor: isDarkMode ? 'grey.900' : 'grey.50',
        overflow: 'auto',
        ...sx
      }}
    >
      {visibleMessages.length === 0 ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 3,
            width: '100%',
            height: '100%'
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
              transform: 'translateY(-10%)',
              mx: 'auto'
            }}
          >
            <Box
              sx={{
                height: 80,
                width: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
                opacity: 0.6,
              }}
            >
              <MessageSquare 
                size={48} 
                color={isDarkMode ? '#888' : '#555'} 
                strokeWidth={1.5}
              />
            </Box>
            <Typography variant="h6" sx={{ mb: 2, color: isDarkMode ? 'white' : 'grey.900' }}>
              No messages yet
            </Typography>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'grey.400' : 'grey.600' }}>
              Start the conversation by typing a message below.
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 6, 
            p: 6,
            overflow: 'auto',
            width: '100%', 
            height: '100%',
            maxWidth: '1200px', 
            mx: 'auto',
          }}
        >
          {visibleMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
            />
          ))}
          {/* Invisible element for scrolling to the end of messages */}
          <div ref={messagesEndRef} />
        </Box>
      )}
    </Box>
  );
}; 