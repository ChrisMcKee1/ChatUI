import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessagePanel } from './ChatMessagePanel';
import { ThemeProvider } from '@/context/ThemeContext';
import { Box, useMediaQuery, useTheme, Typography, Paper, Stack, Divider, IconButton } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './MessageBubble';
import { MessageSquare, Type } from 'lucide-react';

const meta: Meta<typeof ChatMessagePanel> = {
  component: ChatMessagePanel,
  title: 'Molecules/ChatMessagePanel',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Container for displaying chat messages with responsive layout and empty state handling. This molecule composes atomic components to create a complete chat interface with features like auto-scrolling, multi-agent conversations, text size controls, and responsive design adaptations.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    messages: {
      control: 'object',
      description: 'Array of message objects to display',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    sx: {
      description: 'Material UI system props for additional styling',
    },
    isLoading: {
      control: 'boolean',
      description: 'Whether the panel is in a loading state',
    },
  }
};

export default meta;

type Story = StoryObj<typeof ChatMessagePanel>;

// Sample markdown content
const markdownContent = `
# Heading 1
## Heading 2

This is a paragraph with **bold** and *italic* text.

* List item 1
* List item 2
  * Nested item 2.1
  * Nested item 2.2
* List item 3

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Hello, \${name}!\`;
}
\`\`\`

> This is a blockquote

| Name | Role | Department |
|------|------|------------|
| John | Developer | Engineering |
| Lisa | Designer | Design |

[Link to example.com](https://example.com)
`;

// Empty panel with no messages
export const EmptyPanel: Story = {
  args: {
    messages: [],
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state showing a message prompting the user to start a conversation. This provides a helpful initial state with clear guidance for users.',
      },
    },
  },
};

// Panel with a user message
export const WithUserMessage: Story = {
  args: {
    messages: [
      {
        id: uuidv4(),
        content: 'Hello! How can you help me?',
        role: 'user',
        timestamp: 'Just now',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows the appearance of a single user message with timestamp. Demonstrates message alignment and styling for user messages.',
      },
    },
  },
};

// Panel with a user message and assistant response
export const WithUserAndAssistantMessages: Story = {
  args: {
    messages: [
      {
        id: uuidv4(),
        content: 'Hello! How can you help me?',
        role: 'user',
        timestamp: '1m ago',
      },
      {
        id: uuidv4(),
        content: "I'm an AI assistant, and I can help you with various tasks such as answering questions, generating content, providing recommendations, and more. Just let me know what you need!",
        role: 'assistant',
        timestamp: 'Just now',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic conversation with one user message and an assistant response. Shows the message bubble alignment and styling differences between user and assistant messages.',
      },
    },
  },
};

// Panel with multiple messages as a conversation
export const Conversation: Story = {
  args: {
    messages: [
      {
        id: uuidv4(),
        content: 'Hello! I have a question about JavaScript.',
        role: 'user',
        timestamp: '5m ago',
      },
      {
        id: uuidv4(),
        content: "Sure, I'd be happy to help with JavaScript. What would you like to know?",
        role: 'assistant',
        timestamp: '4m ago',
      },
      {
        id: uuidv4(),
        content: 'How do I create a Promise in JavaScript?',
        role: 'user',
        timestamp: '3m ago',
      },
      {
        id: uuidv4(),
        content: 'In JavaScript, you can create a Promise using the Promise constructor. Here\'s an example:\n\n```javascript\nconst myPromise = new Promise((resolve, reject) => {\n  // Asynchronous operation\n  const success = true;\n  \n  if (success) {\n    resolve("Operation completed successfully");\n  } else {\n    reject("Operation failed");\n  }\n});\n\n// Using the Promise\nmyPromise\n  .then(result => console.log(result))\n  .catch(error => console.error(error));\n```\n\nThe Promise constructor takes a function with two parameters: resolve and reject. You call resolve when the asynchronous operation is successful, and reject when it fails.',
        role: 'assistant',
        timestamp: '2m ago',
      },
      {
        id: uuidv4(),
        content: 'Thank you! That was very helpful.',
        role: 'user',
        timestamp: '1m ago',
      },
      {
        id: uuidv4(),
        content: "You're welcome! If you have any more questions about JavaScript or anything else, feel free to ask.",
        role: 'assistant',
        timestamp: 'Just now',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Complete conversation flow with multiple back-and-forth messages. Demonstrates the auto-scrolling behavior, message spacing, and code formatting within messages.',
      },
    },
  },
};

// Panel with a multi-agent conversation
export const MultiAgentConversation: Story = {
  args: {
    messages: [
      {
        id: uuidv4(),
        content: 'Hello! I need help with a project that requires both coding and design advice.',
        role: 'user',
        timestamp: '5m ago',
      },
      {
        id: uuidv4(),
        content: "I'm Engineer, and I can help with the technical aspects of your project. What kind of coding help do you need?",
        role: 'assistant',
        agentName: 'Engineer',
        timestamp: '4m ago',
      },
      {
        id: uuidv4(),
        content: "I'm Designer, and I can provide guidance on the visual and UX aspects. What's the design context for this project?",
        role: 'assistant',
        agentName: 'Designer',
        timestamp: '4m ago',
      },
      {
        id: uuidv4(),
        content: "I'm building a portfolio website and I need help with responsive layout coding and a clean design.",
        role: 'user',
        timestamp: '3m ago',
      },
      {
        id: uuidv4(),
        content: "For responsive layouts, I recommend using a CSS Grid or Flexbox approach rather than older methods. Here's a basic structure you could use:\n\n```css\n.portfolio-container {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));\n  gap: 2rem;\n}\n\n@media (max-width: 768px) {\n  .portfolio-container {\n    grid-template-columns: 1fr;\n  }\n}\n```\n\nThis will create a multi-column layout that adjusts to a single column on smaller screens.",
        role: 'assistant',
        agentName: 'Engineer',
        timestamp: '2m ago',
      },
      {
        id: uuidv4(),
        content: "For a portfolio design, I recommend:\n\n1. **Consistent white space** - Use padding and margins consistently (try a 8px or 16px base unit)\n2. **Limited color palette** - 2-3 primary colors plus 1-2 accent colors\n3. **Typography hierarchy** - 2 fonts maximum (one for headings, one for body text)\n4. **High-quality images** - Optimize all portfolio images for web (compress without losing quality)\n\nMinimalism works well for portfolios as it lets your work be the focus rather than the site design itself.",
        role: 'assistant',
        agentName: 'Designer',
        timestamp: '2m ago',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-agent conversation with color-coded messages for different agents. Shows how agent names are displayed and how message styling adapts to create visual distinction between different assistants.',
      },
    },
  },
};

// Panel in loading state
export const Loading: Story = {
  args: {
    messages: [
      {
        id: uuidv4(),
        content: 'Can you help me understand quantum computing?',
        role: 'user',
        timestamp: 'Just now',
      },
    ],
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Panel in loading state, ready to receive an assistant response. This demonstrates how the auto-scrolling behavior is optimized for streaming responses.',
      },
    },
  },
};

// Panel with markdown content
export const WithMarkdownContent: Story = {
  args: {
    messages: [
      {
        id: uuidv4(),
        content: 'Can you show me how markdown works in this chat?',
        role: 'user',
        timestamp: '1m ago',
      },
      {
        id: uuidv4(),
        content: markdownContent,
        role: 'assistant',
        timestamp: 'Just now',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows markdown rendering capabilities including headings, lists, code blocks, tables, and blockquotes. Demonstrates how complex formatted content is displayed in messages.',
      },
    },
  },
};

// Component composition story
export const ComponentComposition: Story = {
  render: () => (
    <Box sx={{ p: 3, maxWidth: '800px' }}>
      <Typography variant="h6" gutterBottom>ChatMessagePanel Composition</Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" paragraph>
          The ChatMessagePanel molecule is composed of these components:
        </Typography>
        
        <Box component="ul" sx={{ pl: 2, mb: 3 }}>
          <li>MessageBubble components - Display individual chat messages</li>
          <li>Typography components - Empty state text and labels</li>
          <li>IconButton with Type icon - Text size adjustment control</li>
          <li>Menu and MenuItem components - Text size selection dropdown</li>
          <li>MessageSquare icon - Empty state illustration</li>
          <li>Box components - Layout containers and scrollable area</li>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle2" gutterBottom>Key Features:</Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <li>Auto-scrolling behavior for new messages</li>
              <li>Responsive layout with mobile optimizations</li>
              <li>Adjustable text size with persistent preferences</li>
              <li>Multi-agent conversation support with color coding</li>
              <li>Empty state with clear user guidance</li>
              <li>Markdown rendering for rich content</li>
            </Box>
          </Box>
          
          <Box>
            <Typography variant="subtitle2" gutterBottom>Internal Components:</Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: 110 }}>
                <MessageSquare size={24} />
                <Typography variant="caption">Empty State Icon</Typography>
              </Paper>
              
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: 110 }}>
                <Type size={24} />
                <Typography variant="caption">Text Size Control</Typography>
              </Paper>
              
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, width: 110 }}>
                <Box sx={{ height: 24, width: 24, bgcolor: 'rgba(120, 220, 232, 0.3)', borderRadius: '4px' }} />
                <Typography variant="caption">Message Bubble</Typography>
              </Paper>
            </Stack>
          </Box>
        </Stack>
      </Paper>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>Sample Empty State:</Typography>
        <Box sx={{ height: 200, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1, overflow: 'hidden' }}>
          <ChatMessagePanel messages={[]} />
        </Box>
      </Box>
      
      <Box>
        <Typography variant="subtitle1" gutterBottom>Sample Conversation:</Typography>
        <Box sx={{ height: 300, border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1, overflow: 'hidden' }}>
          <ChatMessagePanel
            messages={[
              {
                id: uuidv4(),
                content: 'Hello! How does this component work?',
                role: 'user',
                timestamp: '1m ago',
              },
              {
                id: uuidv4(),
                content: "The ChatMessagePanel is a molecule component that handles the display of chat messages. It manages message layout, scrolling, and styling.",
                role: 'assistant',
                timestamp: 'Just now',
              },
            ]}
          />
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the ChatMessagePanel is composed of smaller atomic components and the key features it provides. Shows the internal structure and composition of the molecule.',
      },
    },
  },
};

// Panel showing different text sizes
export const TextSizeControl: Story = {
  render: () => (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Text Size Control Feature</Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" paragraph>
          The ChatMessagePanel includes a text size control feature that allows users to adjust the size of text in messages. This enhances accessibility and user preference customization.
        </Typography>
        
        <Stack direction="row" spacing={3} alignItems="center" mb={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton sx={{ bgcolor: 'rgba(0,0,0,0.05)', p: 1.5, borderRadius: 1 }}>
              <Type size={24} />
            </IconButton>
            <Typography variant="caption">Text Size Control</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Size Options:</Typography>
            <Typography variant="caption">• Small (0.875rem)</Typography>
            <Typography variant="caption">• Medium (1rem) - Default</Typography>
            <Typography variant="caption">• Large (1.125rem)</Typography>
          </Box>
        </Stack>
        
        <Box sx={{ fontSize: '0.875rem', opacity: 0.7, mb: 2 }}>
          User preference is stored in localStorage as "chatui-text-size" and persists between sessions.
        </Box>
      </Paper>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <Typography variant="subtitle2" gutterBottom>Small Text Size</Typography>
          <Paper elevation={1} sx={{ overflow: 'hidden', height: 200 }}>
            <ChatMessagePanel
              messages={[
                {
                  id: uuidv4(),
                  content: 'This is a user message with small text size',
                  role: 'user',
                  timestamp: '1m ago',
                  // @ts-ignore - Adding custom property to set text size
                  textSize: 'small',
                },
                {
                  id: uuidv4(),
                  content: 'This is an assistant response with small text size. Small text is useful for dense information displays and when screen space is limited.',
                  role: 'assistant',
                  timestamp: 'Just now',
                  // @ts-ignore - Adding custom property to set text size
                  textSize: 'small',
                },
              ]}
            />
          </Paper>
        </div>
        
        <div>
          <Typography variant="subtitle2" gutterBottom>Medium Text Size (Default)</Typography>
          <Paper elevation={1} sx={{ overflow: 'hidden', height: 200 }}>
            <ChatMessagePanel
              messages={[
                {
                  id: uuidv4(),
                  content: 'This is a user message with medium text size',
                  role: 'user',
                  timestamp: '1m ago',
                  // @ts-ignore - Adding custom property to set text size
                  textSize: 'medium',
                },
                {
                  id: uuidv4(),
                  content: 'This is an assistant response with medium text size. Medium text provides a balanced reading experience for most users.',
                  role: 'assistant',
                  timestamp: 'Just now',
                  // @ts-ignore - Adding custom property to set text size
                  textSize: 'medium',
                },
              ]}
            />
          </Paper>
        </div>
        
        <div>
          <Typography variant="subtitle2" gutterBottom>Large Text Size</Typography>
          <Paper elevation={1} sx={{ overflow: 'hidden', height: 200 }}>
            <ChatMessagePanel
              messages={[
                {
                  id: uuidv4(),
                  content: 'This is a user message with large text size',
                  role: 'user',
                  timestamp: '1m ago',
                  // @ts-ignore - Adding custom property to set text size
                  textSize: 'large',
                },
                {
                  id: uuidv4(),
                  content: 'This is an assistant response with large text size. Large text improves readability for users who prefer or need larger text.',
                  role: 'assistant',
                  timestamp: 'Just now',
                  // @ts-ignore - Adding custom property to set text size
                  textSize: 'large',
                },
              ]}
            />
          </Paper>
        </div>
      </div>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the text size adjustment feature with examples of small, medium, and large text sizes. Shows how the component adapts to different text density preferences.',
      },
    },
  },
};

export const Responsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Shows how the ChatMessagePanel adapts to different screen sizes. The component adjusts padding, font sizes, and spacing to optimize the layout for mobile devices.',
      },
    },
  },
  render: (args) => {
    const isMobile = useMediaQuery(useTheme().breakpoints.down('sm'));
    
    const messages = [
      {
        id: uuidv4(),
        content: "How does the layout change on different devices?",
        role: 'user' as Role,
        timestamp: '12:30 PM',
      },
      {
        id: uuidv4(),
        content: "The ChatMessagePanel uses responsive design to adapt to different screen sizes. On mobile devices, it has reduced padding and spacing to maximize the available area for messages.",
        role: 'assistant' as Role,
        timestamp: '12:31 PM',
      },
      {
        id: uuidv4(),
        content: "What other responsive features does it have?",
        role: 'user' as Role,
        timestamp: '12:32 PM',
      },
      {
        id: uuidv4(),
        content: "The panel also adjusts font sizes, avatar sizes, and message bubble widths based on the screen size. It maintains proper readability and touch targets on small screens while providing more comfortable spacing on larger displays.",
        role: 'assistant' as Role,
        timestamp: '12:33 PM',
      },
    ];
    
    return (
      <Box
        sx={{
          border: '1px dashed grey',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <ChatMessagePanel messages={messages} />
        <Paper
          sx={{ 
            position: 'absolute', 
            bottom: '10px', 
            right: '10px', 
            bgcolor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '12px',
            zIndex: 10,
          }}
        >
          <Typography variant="caption" sx={{ fontSize: '12px', fontWeight: 'bold' }}>
            Current viewport: {isMobile ? 'Mobile' : 'Desktop'}
          </Typography>
          <Typography variant="caption" component="div" sx={{ fontSize: '10px', opacity: 0.8 }}>
            Key Responsive Adaptations:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '10px', opacity: 0.8 }}>
            <li>Reduced padding and margins</li>
            <li>Smaller avatar sizes</li>
            <li>Adjusted font sizes</li>
            <li>Wider message bubbles</li>
          </Box>
        </Paper>
      </Box>
    );
  },
}; 