import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessagePanel } from './ChatMessagePanel';
import { ThemeProvider } from '@/context/ThemeContext';
import { Box, useMediaQuery, useTheme, Typography } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { Role } from './MessageBubble';

const meta: Meta<typeof ChatMessagePanel> = {
  component: ChatMessagePanel,
  title: 'Molecules/ChatMessagePanel',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Container for displaying chat messages with responsive layout and empty state handling. Supports auto-scrolling and multi-agent conversations.',
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
        story: 'Empty state showing a message prompting the user to start a conversation',
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
};

// Panel showing different text sizes
export const TextSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem' }}>
      <div>
        <h3>Small Text Size</h3>
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
              content: markdownContent,
              role: 'assistant',
              timestamp: 'Just now',
              // @ts-ignore - Adding custom property to set text size
              textSize: 'small',
            },
          ]}
        />
      </div>
      <div>
        <h3>Medium Text Size (Default)</h3>
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
              content: markdownContent,
              role: 'assistant',
              timestamp: 'Just now',
              // @ts-ignore - Adding custom property to set text size
              textSize: 'medium',
            },
          ]}
        />
      </div>
      <div>
        <h3>Large Text Size</h3>
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
              content: markdownContent,
              role: 'assistant',
              timestamp: 'Just now',
              // @ts-ignore - Adding custom property to set text size
              textSize: 'large',
            },
          ]}
        />
      </div>
    </div>
  ),
};

export const Responsive: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
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
        }}
      >
        <ChatMessagePanel messages={messages} />
        <Typography 
          sx={{ 
            position: 'absolute', 
            bottom: '10px', 
            right: '10px', 
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
          }}
        >
          Current viewport: {isMobile ? 'Mobile' : 'Desktop'}
        </Typography>
      </Box>
    );
  },
}; 