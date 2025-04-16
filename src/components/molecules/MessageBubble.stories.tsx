import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MessageBubble } from './MessageBubble';
import { Message, ToolCall } from './ChatMessagePanel';
import { ThemeProvider } from '../providers/ThemeProvider';
import { ChatProvider, ChatContextType } from '@/context/ChatContext';
import { actions } from '@storybook/addon-actions';

// Helper to create a wrapper that provides ChatContext with specific values
const withChatContext = (Story: React.FC, contextValue: Partial<ChatContextType>) => (
  <ThemeProvider>
    <ChatProvider>
      {/* Override context values for the story */}
      {/* @ts-ignore We are intentionally overriding parts of the context */}
      <ChatContext.Provider value={{ ...useContext(ChatContext), ...contextValue }}>
        <Story />
      {/* @ts-ignore */}
      </ChatContext.Provider>
    </ChatProvider>
  </ThemeProvider>
);

// This story uses ThemeProvider decorator to handle proper theme context
const meta: Meta<typeof MessageBubble> = {
  component: MessageBubble,
  title: 'Molecules/MessageBubble',
  decorators: [
    (Story) => (
      <ThemeProvider>
        <ChatProvider>
          <Story />
        </ChatProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Message bubble component that displays chat messages with proper styling based on the sender (user or assistant). Supports multi-agent messages with distinct colors per agent. This molecule component composes atoms together to create a complete message display with avatar, content area, and timestamp.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      description: 'The complete Message object with content, role, timestamp, and optional agent information',
      control: 'object',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names for styling customization',
    },
  },
};

export default meta;

type Story = StoryObj<typeof MessageBubble>;

// Helper functions to create message objects for consistent story usage
const createUserMessage = (content: string, timestamp = '12:34 PM'): Message => ({
  id: 'user-msg-' + Date.now(),
  content,
  role: 'user',
  timestamp,
});

const createAssistantMessage = (content: string, timestamp = '12:35 PM', agentName?: string): Message => ({
  id: 'assistant-msg-' + Date.now(),
  content,
  role: 'assistant',
  timestamp,
  ...(agentName && { agentName }),
});

// Basic user message story
export const UserMessage: Story = {
  args: {
    message: createUserMessage('This is a user message. It should display on the right side with a user-themed background.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A message sent by the user, displayed on the right side with user theme colors. Shows composition of avatar, message bubble, and timestamp elements.',
      },
    },
  },
};

// Basic assistant message story
export const AssistantMessage: Story = {
  args: {
    message: createAssistantMessage('This is a response from the assistant. It shows on the left side with an assistant-themed background.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A message from the AI assistant, displayed on the left side with assistant theme colors. Shows the standard layout for assistant responses.',
      },
    },
  },
};

// Demonstrate markdown support in messages
export const WithMarkdownContent: Story = {
  args: {
    message: createAssistantMessage('# Markdown Support\n\nThe MessageBubble supports **rich** *formatting* through markdown:\n\n- Lists\n- **Bold text**\n- *Italic text*\n- `Code snippets`\n\n```javascript\nconst hello = "world";\nconsole.log(hello);\n```\n\n> Blockquotes are also supported'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the MessageBubble\'s markdown rendering capabilities, showcasing how it composes with the MarkdownRenderer atom component.',
      },
    },
  },
};

// Demonstrate long message handling
export const LongMessage: Story = {
  args: {
    message: createAssistantMessage('This is a much longer message that demonstrates how the bubble handles multiple lines of text. It should wrap appropriately and maintain readability. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the message bubble handles long text with proper wrapping. Tests edge case handling and overflow management.',
      },
    },
  },
};

// Demonstrate empty state
export const WithoutTimestamp: Story = {
  args: {
    message: {
      ...createUserMessage('This message has no timestamp displayed.'),
      timestamp: '', // Empty timestamp
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Message with no timestamp displayed, showing how the component handles optional elements gracefully.',
      },
    },
  },
};

// Demonstrate agent-specific styling
export const AgentMessage: Story = {
  args: {
    message: createAssistantMessage('This message is from a specific agent and uses a distinct color based on the agent name.', '12:36 PM', 'ResearchAgent'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Message from a specific agent with a distinct color based on the agent name. Shows how the component manages different visual styles for various agents.',
      },
    },
  },
};

// Mobile view for responsive design
export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Shows how the message bubble adapts to smaller mobile screens. The component uses responsive design to adjust padding, font size, and avatar size based on screen width.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: '320px' }}>
      <MessageBubble 
        message={createUserMessage('This is how a message looks on mobile screens with reduced padding and smaller avatar.')} 
      />
      <Box mt={2}>
        <MessageBubble 
          message={createAssistantMessage('The assistant response also adapts to the smaller screen size.')} 
        />
      </Box>
    </Box>
  ),
};

// Multi-agent conversation to demonstrate color assignment
export const MultiAgentConversation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a conversation with multiple agents, each with a distinct color. Shows how the component maintains consistent color assignments throughout a conversation.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: '600px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
      {[
        createUserMessage('Can you help me understand quantum computing?', '10:00 AM'),
        createAssistantMessage('Quantum computing uses quantum bits or qubits which can exist in multiple states simultaneously, unlike classical bits.', '10:01 AM', 'PhysicsExpert'),
        createAssistantMessage('This allows quantum computers to perform certain calculations much faster than classical computers.', '10:02 AM', 'ComputerScientist'),
        createUserMessage('What are some practical applications of quantum computing?', '10:03 AM'),
        createAssistantMessage('Quantum computing shows promise for cryptography, drug discovery, and optimization problems.', '10:04 AM', 'ApplicationsExpert'),
        createAssistantMessage('For example, it could significantly speed up the simulation of molecular interactions for new medicines.', '10:05 AM', 'MedicalExpert'),
      ].map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
        />
      ))}
    </Box>
  )
};

// Responsive conversation example showing different sizes
export const ResponsiveConversation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Shows how a conversation adapts to different screen sizes. Demonstrates the responsive behavior across mobile, tablet, and desktop viewports.',
      },
    },
  },
  render: () => {
    // This is a render function component that can use hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
    
    return (
      <Box sx={{ 
        width: '100%', 
        maxWidth: isMobile ? '300px' : isTablet ? '450px' : '600px',
        mx: 'auto', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: isMobile ? 2 : 4 
      }}>
        {[
          createUserMessage('Hello! How does this look on different devices?', '10:00 AM'),
          createAssistantMessage('The MessageBubble component is fully responsive. On mobile devices, it uses smaller font sizes, reduced padding, and smaller avatars.', '10:01 AM'),
          createUserMessage('That\'s great! What about tablets?', '10:02 AM'),
          createAssistantMessage('On tablets, the component adjusts to provide a balanced experience between mobile and desktop views.', '10:03 AM'),
          createUserMessage('And on desktop?', '10:04 AM'),
          createAssistantMessage('Desktop views have optimal spacing and sizing for comfortable reading. The component also handles window resizing smoothly.', '10:05 AM'),
        ].map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
          />
        ))}
        <Box mt={2} sx={{ fontSize: '14px', textAlign: 'center', opacity: 0.7 }}>
          Current viewport: {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
        </Box>
      </Box>
    );
  }
};

// Theme variation demonstration
export const ThemeVariations: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the MessageBubble appears in both light and dark themes. The story uses the ThemeProvider to show the component adapting to theme changes.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <MessageBubble 
          message={createUserMessage('This is how user messages look with the current theme.')} 
        />
      </Box>
      <Box>
        <MessageBubble 
          message={createAssistantMessage('Assistant messages adjust their colors based on the theme mode.')} 
        />
      </Box>
      <Box>
        <MessageBubble 
          message={createAssistantMessage('Each agent has a distinct color that is visible in both light and dark modes.', '12:40 PM', 'AnalyticsAgent')} 
        />
      </Box>
      <Box>
        <MessageBubble 
          message={createAssistantMessage('The colors ensure good contrast and readability regardless of theme.', '12:41 PM', 'DesignAgent')} 
        />
      </Box>
      <Box sx={{ fontSize: '0.8rem', opacity: 0.7, textAlign: 'center', mt: 2 }}>
        Try toggling the theme in Storybook to see how the components adapt
      </Box>
    </Box>
  ),
};

// --- Mock Data --- 
const mockToolCall: ToolCall = {
  id: 'tool-call-123',
  pluginName: 'WeatherPlugin',
  functionName: 'getWeather',
  arguments: { location: 'Austin, TX', unit: 'F' }
};

const mockToolResponseMessage: Message = {
  id: 'tool-response-456',
  role: 'tool',
  content: JSON.stringify({ temperature: 75, condition: 'Sunny' }, null, 2),
  timestamp: '01:10 PM',
  toolCallId: 'tool-call-123'
};

const mockAssistantMessageWithToolCall: Message = {
  id: 'assistant-tool-call-789',
  role: 'assistant',
  content: 'Okay, let me check the weather for you.',
  timestamp: '01:09 PM',
  toolCall: [mockToolCall]
};

const mockAssistantFinalMessage: Message = {
  id: 'assistant-final-101',
  role: 'assistant',
  content: 'The weather in Austin is 75°F and sunny.',
  timestamp: '01:11 PM',
};

// --- New Stories for Tool Messages --- 

export const AssistantWithToolCallHidden: Story = {
  args: {
    message: mockAssistantMessageWithToolCall,
  },
  decorators: [
    (Story) => withChatContext(Story, { showToolMessages: false }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Assistant message that made a tool call, but the tool call indicator is HIDDEN because `showToolMessages` context is false.',
      },
    },
  },
};

export const AssistantWithToolCallVisible: Story = {
  args: {
    message: mockAssistantMessageWithToolCall,
  },
  decorators: [
    (Story) => withChatContext(Story, { showToolMessages: true }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Assistant message that made a tool call. The tool call indicator is VISIBLE because `showToolMessages` context is true.',
      },
    },
  },
};

export const ToolResponseMessageHidden: Story = {
  args: {
    message: mockToolResponseMessage,
  },
  decorators: [
    (Story) => withChatContext(Story, { showToolMessages: false }),
  ],
  render: (args) => (
    // This story should render nothing, as the bubble hides itself
    // Add a note indicating this is expected behavior
    <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1, textAlign: 'center' }}>
      <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
        This story should render nothing because the Tool message is hidden when showToolMessages is false.
      </Typography>
      {/* Render the component anyway to ensure it returns null */}
      <MessageBubble {...args} /> 
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'A tool response message that should be HIDDEN because `showToolMessages` context is false. The component itself returns null.',
      },
    },
  },
};

export const ToolResponseMessageVisible: Story = {
  args: {
    message: mockToolResponseMessage,
  },
  decorators: [
    (Story) => withChatContext(Story, { showToolMessages: true }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'A tool response message that is VISIBLE because `showToolMessages` context is true. Note the distinct neutral background, label, and Terminal icon.',
      },
    },
  },
};

// --- Story demonstrating the full flow --- 
export const FullToolFlowVisible: Story = {
  decorators: [
    (Story) => withChatContext(Story, { showToolMessages: true }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows the sequence: Assistant preparing tool call (visible indicator), Tool response (visible), Final Assistant message. `showToolMessages` is true.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: '600px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <MessageBubble message={mockAssistantMessageWithToolCall} />
      <MessageBubble message={mockToolResponseMessage} />
      <MessageBubble message={mockAssistantFinalMessage} />
    </Box>
  )
};

export const FullToolFlowHidden: Story = {
  decorators: [
    (Story) => withChatContext(Story, { showToolMessages: false }),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Shows the sequence: Assistant preparing tool call (indicator hidden), Tool response (hidden), Final Assistant message. `showToolMessages` is false.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: '600px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <MessageBubble message={mockAssistantMessageWithToolCall} />
      <MessageBubble message={mockToolResponseMessage} /> 
      <MessageBubble message={mockAssistantFinalMessage} />
       <Typography variant="caption" sx={{ fontStyle: 'italic', textAlign: 'center', mt: 1, opacity: 0.7 }}>
        (Note: The middle 'Tool Response' bubble is correctly hidden here)
      </Typography>
    </Box>
  )
};