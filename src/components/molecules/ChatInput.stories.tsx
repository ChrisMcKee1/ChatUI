import type { Meta, StoryObj } from '@storybook/react';
import { ChatInput } from './ChatInput';
import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { ThemeProvider } from '../providers/ThemeProvider';

const meta = {
  title: 'Molecules/ChatInput',
  component: ChatInput,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Chat input component with Material UI integration, multiline support, and theming. This molecule composes atomic components like TextField and Button to create a cohesive input experience. Features keyboard shortcuts, responsive design, and state management.',
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
      description: 'Additional CSS class names for styling customization',
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
        story: 'Default chat input with standard width and placeholder text. Shows the basic composition of TextField and Send button.',
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
        story: 'Disabled chat input shown during loading states. Both the input field and button are disabled, with appropriate visual styling.',
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
        story: 'Mobile view of the chat input component. Shows responsive adaptations for smaller screens including adjusted spacing and proportions.',
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
        story: 'Chat input with custom placeholder text. Demonstrates how the component can be customized to fit different contexts and use cases.',
      },
    },
  },
};

// Interactive example showing multiline capabilities and internal state
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
      action('sendMessage')(message);
    };
    
    return (
      <Box sx={{ width: '500px', maxWidth: '100%' }}>
        <Typography variant="body2" sx={{ mb: 2, opacity: 0.7 }}>
          Try typing a long message with line breaks (Shift+Enter)
        </Typography>
        
        {messages.length > 0 && (
          <Paper sx={{ 
            mb: 2, 
            p: 2, 
            borderRadius: 1,
            maxHeight: '150px',
            overflow: 'auto'
          }} elevation={1}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Sent messages:</Typography>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ whiteSpace: 'pre-wrap', mb: 1, fontSize: '0.875rem' }}>
                {index + 1}. {msg}
              </Box>
            ))}
          </Paper>
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
        story: 'Demonstrates the multiline capabilities and internal state management of the chat input. Try using Shift+Enter to create line breaks. Shows how the component handles state changes and event propagation.',
      },
    },
  },
};

// Theme integration demonstration
export const ThemeVariations: Story = {
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
      
      <Typography variant="subtitle2" sx={{ mt: 2 }}>With pre-filled content (simulated):</Typography>
      <Box sx={{ border: '1px dashed rgba(128, 128, 128, 0.3)', p: 1, borderRadius: 1 }}>
        <Typography variant="caption" sx={{ mb: 1, display: 'block', opacity: 0.7 }}>
          Note: This is just a visual demonstration, as ChatInput doesn't support initialValue prop
        </Typography>
        <ChatInput 
          onSendMessage={action('sendMessage')}
          placeholder="Type your message..."
        />
      </Box>
      
      <Box sx={{ fontSize: '0.8rem', opacity: 0.7, textAlign: 'center', mt: 2 }}>
        Try toggling the theme in Storybook to see how the component adapts
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows how the component adapts to the current theme in various states. Demonstrates the theme integration capabilities of the component across different modes and states.',
      },
    },
  },
};

// Interaction patterns demonstration
export const InteractionPatterns: Story = {
  args: {
    onSendMessage: action('sendMessage'),
    placeholder: 'Type to test interactions...',
    disabled: false,
  },
  render: () => {
    // @ts-ignore - useState is not recognized in static Story type
    const [inputMessage, setInputMessage] = useState<string>('');
    // @ts-ignore - useState is not recognized in static Story type
    const [events, setEvents] = useState<{type: string, value: string}[]>([]);
    
    const logEvent = (type: string, value: string) => {
      setEvents(prev => [...prev.slice(-4), {type, value}]);
      action(`${type}`)(value);
    };
    
    const handleSendMessage = (message: string) => {
      logEvent('sendMessage', message);
      setInputMessage('');
    };
    
    return (
      <Box sx={{ width: '500px', maxWidth: '100%' }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          This example demonstrates various interaction patterns and event handling:
        </Typography>
        
        <ul style={{ marginBottom: '16px', fontSize: '14px' }}>
          <li>Press Enter to send</li>
          <li>Press Shift+Enter for line breaks</li>
          <li>Click the send button</li>
          <li>Try with empty input (send button disables)</li>
        </ul>
        
        {events.length > 0 && (
          <Paper sx={{ 
            mb: 2, 
            p: 2, 
            borderRadius: 1,
            maxHeight: '150px',
            overflow: 'auto'
          }} elevation={1}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>Event log:</Typography>
            {events.map((event, index) => (
              <Box key={index} sx={{ whiteSpace: 'pre-wrap', mb: 0.5, fontSize: '0.875rem' }}>
                {event.type}: {event.value.substring(0, 30)}{event.value.length > 30 ? '...' : ''}
              </Box>
            ))}
          </Paper>
        )}
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          placeholder="Type to test interactions..."
        />
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates various interaction patterns including keyboard shortcuts, event handling, and user interaction flows. Shows how events propagate from the component to parent components.',
      },
    },
  },
}; 