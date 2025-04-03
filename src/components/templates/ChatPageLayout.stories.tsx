import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ChatPageLayout } from './ChatPageLayout';
import { ThemeProvider } from '@/context/ThemeContext';
import { ChatHistory } from '@/components/organisms/ChatHistoryPanel';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { Message } from '@/components/molecules/ChatMessagePanel';
import { Box } from '@mui/material';
import { ChatProvider } from '@/context/ChatContext';
import { ServiceProvider } from '@/services/ServiceProvider';

// Mock message data
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I help you today?',
    role: 'assistant',
    timestamp: '12:34 PM',
  },
  {
    id: '2',
    content: 'I need help with the multi-agent system integration.',
    role: 'user',
    timestamp: '12:35 PM',
  },
  {
    id: '3',
    content: 'I can certainly help with that. The multi-agent system integration requires configuring several components. What specific part are you struggling with?',
    role: 'assistant',
    timestamp: '12:36 PM',
  },
];

// Sample chat histories for the drawer
const sampleChatHistories: ChatHistory[] = [
  {
    id: '1',
    title: 'API Integration Discussion',
    lastMessage: 'Here are the API endpoints you requested...',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    messageCount: 12,
    mode: 'standard',
  },
  {
    id: '2',
    title: 'Project Planning',
    lastMessage: 'Let me outline the steps for your project...',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    messageCount: 8,
    mode: 'standard',
  },
  {
    id: '3',
    title: 'Code Review Session',
    lastMessage: 'I recommend refactoring this function to...',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messageCount: 15,
    mode: 'multiAgent',
  },
  {
    id: '4',
    title: 'Bug Troubleshooting',
    lastMessage: 'The error might be caused by this line...',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    messageCount: 10,
    mode: 'standard',
  },
];

// Using a mock object for each state rather than trying to extend the component props
const mockStateCases = {
  empty: {
    messages: [],
    chatHistories: [],
    activeChatId: null,
    agentMode: 'standard' as AgentMode,
    isLoading: false,
  },
  withMessages: {
    messages: mockMessages,
    chatHistories: [],
    activeChatId: null,
    agentMode: 'standard' as AgentMode,
    isLoading: false,
  },
  withHistory: {
    messages: [],
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[0].id,
    agentMode: 'standard' as AgentMode,
    isLoading: false,
  },
  full: {
    messages: mockMessages,
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[0].id,
    agentMode: 'standard' as AgentMode,
    isLoading: false,
  },
  loading: {
    messages: mockMessages,
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[0].id,
    agentMode: 'standard' as AgentMode,
    isLoading: true,
  },
  multiAgent: {
    messages: mockMessages,
    chatHistories: sampleChatHistories,
    activeChatId: sampleChatHistories[2].id,
    agentMode: 'multiAgent' as AgentMode,
    isLoading: false,
  },
};

type MockStateKey = keyof typeof mockStateCases;

// Create wrapper components for each state to avoid TypeScript issues
const EmptyStateWrapper = () => (
  <MockChatProvider mockState="empty">
    <ChatPageLayout />
  </MockChatProvider>
);

const WithMessagesWrapper = () => (
  <MockChatProvider mockState="withMessages">
    <ChatPageLayout />
  </MockChatProvider>
);

const WithHistoryWrapper = () => (
  <MockChatProvider mockState="withHistory">
    <ChatPageLayout />
  </MockChatProvider>
);

const FullExampleWrapper = () => (
  <MockChatProvider mockState="full">
    <ChatPageLayout />
  </MockChatProvider>
);

const LoadingStateWrapper = () => (
  <MockChatProvider mockState="loading">
    <ChatPageLayout />
  </MockChatProvider>
);

const MultiAgentModeWrapper = () => (
  <MockChatProvider mockState="multiAgent">
    <ChatPageLayout />
  </MockChatProvider>
);

const MobileViewWrapper = () => (
  <MockChatProvider mockState="full">
    <ChatPageLayout />
  </MockChatProvider>
);

const TabletViewWrapper = () => (
  <MockChatProvider mockState="full">
    <ChatPageLayout />
  </MockChatProvider>
);

// Create a mock provider that wraps the children with proper context
const MockChatProvider = ({ 
  mockState, 
  children 
}: { 
  mockState: MockStateKey, 
  children: React.ReactNode 
}) => {
  // Get the mock state data
  const stateData = mockStateCases[mockState];

  // Create a value object that matches ChatContextType
  const mockContextValue = {
    // Spread the state data from our mock cases
    ...stateData,
    // Add mock functions with the right return types
    sendMessage: async (content: string) => {
      console.log('Message sent:', content);
      return Promise.resolve();
    },
    createNewChat: async (title?: string) => {
      console.log('New chat created:', title);
      return Promise.resolve('new-chat-id');
    },
    selectChat: async (chatId: string) => {
      console.log('Chat selected:', chatId);
      return Promise.resolve();
    },
    deleteChat: async (chatId: string) => {
      console.log('Chat deleted:', chatId);
      return Promise.resolve();
    },
    setAgentMode: (mode: AgentMode) => {
      console.log('Agent mode set:', mode);
    },
    abortRequest: () => {
      console.log('Request aborted');
    },
    clearMessages: () => {
      console.log('Messages cleared');
    },
  };

  return (
    <ThemeProvider>
      <ServiceProvider>
        <ChatProvider>
          {children}
        </ChatProvider>
      </ServiceProvider>
    </ThemeProvider>
  );
};

// Using a mock wrapper component to provide proper context
const ChatProviderDecorator = (Story: React.ComponentType) => (
  <ThemeProvider>
    <ServiceProvider>
      <ChatProvider>
        <Story />
      </ChatProvider>
    </ServiceProvider>
  </ThemeProvider>
);

const meta: Meta<typeof ChatPageLayout> = {
  component: ChatPageLayout,
  title: 'Templates/ChatPageLayout',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Main layout template for the chat application. Combines all organism components into a complete chat interface with header, message panel, input area, and chat history drawer. Features responsive behavior for different screen sizes.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [ChatProviderDecorator],
};

export default meta;

type Story = StoryObj<typeof ChatPageLayout>;

export const EmptyChat: Story = {
  render: () => <ChatPageLayout />,
  parameters: {
    docs: {
      description: {
        story: 'Empty state of the chat layout without any messages or history.'
      },
    },
  },
};

export const Empty: Story = {
  render: () => <EmptyStateWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Empty chat page with no messages or history.',
      },
    },
  },
};

export const WithExistingConversation: Story = {
  render: () => <WithMessagesWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Chat page with an existing conversation but no history.',
      },
    },
  },
};

export const WithChatHistory: Story = {
  render: () => <WithHistoryWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Chat page with history but no active messages.',
      },
    },
  },
};

export const FullExample: Story = {
  render: () => <FullExampleWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Complete chat page with messages and history.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => <LoadingStateWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Chat page in loading state while waiting for a response.',
      },
    },
  },
};

export const MultiAgentMode: Story = {
  render: () => <MultiAgentModeWrapper />,
  parameters: {
    docs: {
      description: {
        story: 'Chat page in multi-agent mode.',
      },
    },
  },
};

export const MobileView: Story = {
  render: () => <MobileViewWrapper />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Chat page optimized for mobile view.',
      },
    },
  },
};

export const TabletView: Story = {
  render: () => <TabletViewWrapper />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story: 'Chat page optimized for tablet view.',
      },
    },
  },
}; 