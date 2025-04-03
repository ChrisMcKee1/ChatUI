import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from './ChatInput';
import { action } from '@storybook/addon-actions';
import { useState } from 'react';
import { Box, Typography } from '@mui/material';

const meta = {
  title: 'Molecules/ChatInput',
  component: ChatInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Chat input component with Material UI integration, multiline support, and theming. Features a TextField for message input and a Send button.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onSendMessage: { 
      action: 'sendMessage',
      description: 'Function called when a message is sent (on button click or Enter key)',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown in the input field when empty',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input field and send button',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
} satisfies Meta<typeof ChatInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Type your message...',
    disabled: false,
  },
  render: (args) => (
    <div style={{ width: '500px', maxWidth: '100%' }}>
      <ChatInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Default chat input with standard width and placeholder text',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Waiting for response...',
    disabled: true,
  },
  render: (args) => (
    <div style={{ width: '500px', maxWidth: '100%' }}>
      <ChatInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Disabled chat input shown during loading states',
      },
    },
  },
};

export const Mobile: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Type your message...',
    disabled: false,
  },
  render: (args) => (
    <div style={{ width: '300px', maxWidth: '100%' }}>
      <ChatInput {...args} />
    </div>
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Mobile view of the chat input component',
      },
    },
  },
};

export const CustomPlaceholder: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Ask a question...',
    disabled: false,
  },
  render: (args) => (
    <div style={{ width: '500px', maxWidth: '100%' }}>
      <ChatInput {...args} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chat input with custom placeholder text',
      },
    },
  },
};

// Interactive example showing multiline capabilities
export const MultilineSupport: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Type a multiline message...',
    disabled: false,
  },
  render: () => {
    // @ts-ignore - useState is not recognized in static Story type
    const [messages, setMessages] = useState<string[]>([]);
    
    const handleSendMessage = (message: string) => {
      setMessages((prev) => [...prev, message]);
    };
    
    return (
      <Box sx={{ width: '500px', maxWidth: '100%' }}>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          Try typing a long message with line breaks (Shift+Enter)
        </Typography>
        
        {messages.length > 0 && (
          <Box sx={{ 
            mb: 2, 
            p: 2, 
            bgcolor: 'rgba(0, 0, 0, 0.05)', 
            borderRadius: 1,
            maxHeight: '150px',
            overflow: 'auto'
          }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Sent messages:</Typography>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ whiteSpace: 'pre-wrap', mb: 1, fontSize: '0.875rem' }}>
                {index + 1}. {msg}
              </Box>
            ))}
          </Box>
        )}
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          placeholder="Type a multiline message (use Shift+Enter for line breaks)..."
        />
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the multiline capabilities of the chat input. Try using Shift+Enter to create line breaks.',
      },
    },
  },
};

// Theme integration
export const ThemeIntegration: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Type your message...',
    disabled: false,
  },
  render: () => (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '500px',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="subtitle2">Regular state:</Typography>
      <ChatInput 
        onSendMessage={action('sendMessage')}
        placeholder="Type your message..."
      />
      
      <Typography variant="subtitle2" sx={{ mt: 2 }}>Disabled state:</Typography>
      <ChatInput 
        onSendMessage={action('sendMessage')}
        placeholder="Waiting for response..."
        disabled
      />
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows how the component adapts to the current theme in both enabled and disabled states',
      },
    },
  },
}; 