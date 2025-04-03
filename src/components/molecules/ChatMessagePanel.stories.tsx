import type { Meta, StoryObj } from '@storybook/react';
import { ChatMessagePanel } from './ChatMessagePanel';
import { ThemeProvider } from '@/context/ThemeContext';
import { Box, useMediaQuery, useTheme } from '@mui/material';

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
      description: 'Array of Message objects to display in the panel',
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
      description: 'Whether the panel is in a loading state (affects auto-scrolling behavior)',
    }
  }
};

export default meta;

type Story = StoryObj<typeof ChatMessagePanel>;

// Create message helpers
const createUserMessage = (id: string, content: string, timestamp = '12:30 PM') => ({
  id,
  content,
  role: 'user' as const,
  timestamp,
});

const createAssistantMessage = (id: string, content: string, timestamp = '12:31 PM', agentName?: string) => ({
  id,
  content,
  role: 'assistant' as const,
  timestamp,
  ...(agentName ? { agentName } : {}),
});

export const Empty: Story = {
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

export const StandardConversation: Story = {
  args: {
    messages: [
      createAssistantMessage('1', "Hello! I'm an assistant. How can I help you today?", '12:30 PM'),
      createUserMessage('2', "I'm trying to understand how to connect to the multi-agent endpoint.", '12:31 PM'),
      createAssistantMessage('3', "The multi-agent endpoint works similarly to the standard endpoint, but it distributes your query across multiple specialized agents for a more comprehensive response. To connect to it, you'll use the /multi-agent path instead of the standard /chat path, but with the same request format.", '12:32 PM'),
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Standard conversation between user and assistant with multiple messages',
      },
    },
  },
};

export const WithLongMessages: Story = {
  args: {
    messages: [
      createUserMessage('1', "Can you explain how quantum computing works? I'm interested in understanding the basic principles and how they differ from classical computing.", '12:30 PM'),
      createAssistantMessage('2', "Quantum computing is based on the principles of quantum mechanics, which operates at the subatomic level. Unlike classical computers that use bits (0s and 1s), quantum computers use quantum bits or 'qubits'. The key difference is that qubits can exist in multiple states simultaneously due to a property called superposition, not just 0 or 1. Additionally, qubits can be 'entangled' with each other, meaning the state of one qubit can depend on the state of another, regardless of the distance between them. These properties allow quantum computers to process a vast number of possibilities simultaneously, making them potentially much more powerful than classical computers for certain types of problems like factoring large numbers, search algorithms, and simulating quantum systems. However, quantum computers are extremely difficult to build and maintain because qubits are very fragile and susceptible to environmental interference, requiring specialized cooling and isolation systems.", '12:31 PM'),
      createUserMessage('3', "That's fascinating! What are some practical applications of quantum computing that we might see in the next decade?", '12:32 PM'),
      createAssistantMessage('4', "In the next decade, we might see practical applications of quantum computing in several fields:\n\n1. Cryptography: Quantum computers could break many current encryption methods, but also enable new, more secure quantum encryption.\n\n2. Drug discovery and materials science: Simulating molecular interactions to accelerate the development of new medicines and materials.\n\n3. Optimization problems: Solving complex logistics, supply chain, and traffic flow problems more efficiently.\n\n4. Machine learning: Enhancing certain AI algorithms with quantum speedups.\n\n5. Financial modeling: Better portfolio optimization and risk assessment.\n\n6. Climate modeling: More accurate weather forecasting and climate change predictions.\n\nHowever, these applications will likely first appear as hybrid solutions where classical computers work together with quantum processors for specific computational tasks rather than as standalone quantum computers replacing classical systems entirely.", '12:33 PM'),
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Conversation with long, detailed messages to demonstrate text wrapping and scrolling',
      },
    },
  },
};

export const MultiAgentConversation: Story = {
  args: {
    messages: [
      createUserMessage('1', "What are the pros and cons of electric vehicles compared to internal combustion engines?", '12:30 PM'),
      createAssistantMessage('2', "Electric vehicles produce zero direct emissions, reducing air pollution in urban areas and greenhouse gas emissions when powered by renewable energy sources.", '12:31 PM', "EnvironmentalExpert"),
      createAssistantMessage('3', "From an engineering perspective, EVs have fewer moving parts, which generally means lower maintenance costs and potentially longer vehicle lifespans.", '12:31 PM', "EngineeringExpert"),
      createAssistantMessage('4', "Economically, EVs typically have higher upfront costs but lower operating costs over time. The total cost of ownership depends on electricity prices, driving habits, and available incentives.", '12:32 PM', "EconomicsExpert"),
      createUserMessage('5', "What about the limitations of electric vehicles?", '12:33 PM'),
      createAssistantMessage('6', "The primary limitations include limited driving range compared to gasoline vehicles, though this is improving with newer battery technology.", '12:34 PM', "TechnologyExpert"),
      createAssistantMessage('7', "Charging infrastructure remains insufficient in many areas, making long-distance travel challenging in some regions.", '12:34 PM', "InfrastructureExpert"),
      createAssistantMessage('8', "The environmental impact of battery production and disposal is significant, including mining for materials like lithium and cobalt.", '12:35 PM', "EnvironmentalExpert"),
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'Multi-agent conversation with different agents providing specialized responses on the same topic',
      },
    },
  },
};

export const LoadingState: Story = {
  args: {
    messages: [
      createUserMessage('1', "What's the capital of France?", '12:30 PM'),
      createAssistantMessage('2', "The capital of France is Paris. It's one of the most populous cities in Europe and a global center for art, fashion, gastronomy, and culture.", '12:31 PM'),
      createUserMessage('3', "And what's the capital of Italy?", '12:32 PM'),
    ],
    isLoading: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Conversation in loading state, demonstrating how the panel behaves while waiting for a response',
      },
    },
  },
};

export const ResponsiveLayout: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the chat panel adapts to different screen sizes',
      },
    },
  },
  render: () => {
    // This is a render function component that can use hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    const messages = [
      createUserMessage('1', "How does the layout change on different devices?", '12:30 PM'),
      createAssistantMessage('2', "The ChatMessagePanel uses responsive design to adapt to different screen sizes. On mobile devices, it has reduced padding and spacing to maximize the available area for messages.", '12:31 PM'),
      createUserMessage('3', "What other responsive features does it have?", '12:32 PM'),
      createAssistantMessage('4', "The panel also adjusts font sizes, avatar sizes, and message bubble widths based on the screen size. It maintains proper readability and touch targets on small screens while providing more comfortable spacing on larger displays.", '12:33 PM'),
    ];
    
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ 
          textAlign: 'center', 
          p: 1, 
          bgcolor: 'rgba(0, 0, 0, 0.05)', 
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
          fontSize: '14px'
        }}>
          Current viewport: {isMobile ? 'Mobile' : 'Desktop/Tablet'}
        </Box>
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          <ChatMessagePanel messages={messages} />
        </Box>
      </Box>
    );
  }
}; 