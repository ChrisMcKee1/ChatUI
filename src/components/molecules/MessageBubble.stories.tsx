import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import { MessageBubble } from './MessageBubble';
import { Message } from './ChatMessagePanel';

// No custom decorator needed - the Storybook theme provider will handle themes
const meta: Meta<typeof MessageBubble> = {
  component: MessageBubble,
  title: 'Molecules/MessageBubble',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Message bubble component that displays chat messages with proper styling based on the sender (user or assistant). Supports multi-agent messages with distinct colors per agent.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      description: 'The complete Message object with content, role, and other properties',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
};

export default meta;

type Story = StoryObj<typeof MessageBubble>;

// Create message object helpers
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

export const UserMessage: Story = {
  args: {
    message: createUserMessage('This is a user message. It should display on the right side with a user-themed background.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A message sent by the user, displayed on the right side with user theme colors.',
      },
    },
  },
};

export const AssistantMessage: Story = {
  args: {
    message: createAssistantMessage('This is a response from the assistant. It shows on the left side with an assistant-themed background.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'A message from the AI assistant, displayed on the left side with assistant theme colors.',
      },
    },
  },
};

export const LongMessage: Story = {
  args: {
    message: createAssistantMessage('This is a much longer message that demonstrates how the bubble handles multiple lines of text. It should wrap appropriately and maintain readability. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the message bubble handles long text with proper wrapping.',
      },
    },
  },
};

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
        story: 'Message with no timestamp displayed.',
      },
    },
  },
};

export const AgentMessage: Story = {
  args: {
    message: createAssistantMessage('This message is from a specific agent and uses a distinct color based on the agent name.', '12:36 PM', 'ResearchAgent'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Message from a specific agent with a distinct color based on the agent name.',
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
        story: 'Shows how the message bubble adapts to smaller mobile screens.',
      },
    },
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: '320px' }}>
      <MessageBubble 
        message={createUserMessage('This is how a message looks on mobile screens with reduced padding and smaller avatar.')} 
      />
    </Box>
  ),
};

// Multi-agent conversation
export const MultiAgentConversation: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a conversation with multiple agents, each with a distinct color.',
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
        story: 'Shows how a conversation adapts to different screen sizes.',
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