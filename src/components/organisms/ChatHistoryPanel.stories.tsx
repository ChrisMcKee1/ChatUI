import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Box, Button, Typography, Grid, useMediaQuery, useTheme as useMuiTheme } from '@mui/material';
import { ChatHistoryPanel, ChatHistory } from './ChatHistoryPanel';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/context/ThemeContext';

interface StatefulChatHistoryPanelProps {
  initialOpen?: boolean;
  variant?: 'permanent' | 'persistent' | 'temporary';
  chatHistories?: ChatHistory[];
  drawerWidth?: number;
}

// Create a stateful wrapper for Storybook interactions
const StatefulChatHistoryPanel = ({ 
  initialOpen = true,
  variant = 'persistent',
  chatHistories = [],
  drawerWidth = 280
}: StatefulChatHistoryPanelProps) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [activeChatId, setActiveChatId] = useState<string | undefined>(
    chatHistories.length > 0 ? chatHistories[0].id : undefined
  );
  
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };
  
  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    console.log(`Selected chat: ${chatId}`);
  };
  
  return (
    <Box sx={{ 
      height: '600px', 
      width: '100%',
      position: 'relative',
      bgcolor: 'background.default',
      overflow: 'hidden'
    }}>
      <ChatHistoryPanel 
        chatHistories={chatHistories}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        isOpen={isOpen}
        onToggle={toggleDrawer}
        variant={variant}
        drawerWidth={drawerWidth}
      />
      <Box sx={{ 
        ml: isOpen && variant !== 'temporary' ? `${drawerWidth}px` : 0,
        p: 2,
        transition: 'margin 225ms cubic-bezier(0.0, 0, 0.2, 1) 0ms',
        height: '100%',
        overflow: 'auto'
      }}>
        <Button
          variant="outlined"
          onClick={toggleDrawer}
          sx={{ mb: 2 }}
        >
          {isOpen ? 'Close Drawer' : 'Open Drawer'}
        </Button>
        <Box sx={{ p: 2, border: '1px dashed grey', borderRadius: 1 }}>
          <Typography variant="body1">
            Main content area
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            Active Chat: {activeChatId ? 
              chatHistories.find(chat => chat.id === activeChatId)?.title : 
              'None selected'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

// Component to demonstrate theme integration
const ThemeAwareHistoryPanel = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const muiTheme = useMuiTheme();
  
  return (
    <Box sx={{ height: '600px', width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={toggleTheme}>
          Switch to {isDarkMode ? 'Light' : 'Dark'} Theme
        </Button>
      </Box>
      <StatefulChatHistoryPanel 
        initialOpen={true}
        chatHistories={sampleChatHistories} 
      />
    </Box>
  );
};

const meta: Meta<typeof ChatHistoryPanel> = {
  component: ChatHistoryPanel,
  title: 'Organisms/ChatHistoryPanel',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A responsive drawer panel that displays chat history. Includes support for different drawer variants, responsive sizing, and theme integration. The panel adapts to different screen sizes and can be toggled between open and closed states.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Box style={{ height: '600px' }}>
          <Story />
        </Box>
      </ThemeProvider>
    ),
  ],
  argTypes: {
    chatHistories: {
      description: 'Array of chat history items to display in the panel',
    },
    activeChatId: {
      description: 'ID of the currently active/selected chat',
    },
    onSelectChat: { 
      action: 'chat selected',
      description: 'Callback function when a chat is selected',
    },
    onToggle: { 
      action: 'drawer toggled', 
      description: 'Callback function when the drawer is toggled',
    },
    isOpen: {
      control: 'boolean',
      description: 'Whether the drawer is open',
    },
    variant: {
      control: 'radio',
      options: ['permanent', 'persistent', 'temporary'],
      description: 'Type of drawer behavior',
    },
    drawerWidth: {
      control: 'number',
      description: 'Width of the drawer in pixels',
    },
    className: {
      description: 'Additional CSS class name',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChatHistoryPanel>;

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
  {
    id: '5',
    title: 'Very Long Chat Title That Should Truncate Properly In The UI Element',
    lastMessage: 'This is an extremely long message that should demonstrate how text wrapping and truncation work in the history panel UI component. It should be cut off at a certain point...',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messageCount: 25,
    mode: 'multiAgent',
  },
];

// Empty state story
export const Empty: Story = {
  args: {
    chatHistories: [],
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no chat histories are available.',
      },
    },
  },
};

// With chat histories
export const WithHistories: Story = {
  args: {
    chatHistories: sampleChatHistories,
    activeChatId: '2',
    isOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatHistoryPanel populated with sample chat histories and an active selection.',
      },
    },
  },
};

// Closed drawer
export const ClosedDrawer: Story = {
  args: {
    chatHistories: sampleChatHistories,
    activeChatId: '2',
    isOpen: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatHistoryPanel in its closed state.',
      },
    },
  },
};

// Interactive story that maintains state
export const Interactive: Story = {
  render: () => (
    <StatefulChatHistoryPanel 
      initialOpen={true}
      chatHistories={sampleChatHistories}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Interactive ChatHistoryPanel that allows toggling the drawer open/closed and selecting chats.',
      },
    },
  },
};

// Different drawer variants
export const PersistentVariant: Story = {
  render: () => (
    <StatefulChatHistoryPanel 
      initialOpen={true}
      variant="persistent"
      chatHistories={sampleChatHistories}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Persistent drawer variant that pushes content aside when open.',
      },
    },
  },
};

export const TemporaryVariant: Story = {
  render: () => (
    <StatefulChatHistoryPanel 
      initialOpen={false}
      variant="temporary"
      chatHistories={sampleChatHistories}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'Temporary drawer variant that overlays content when open.',
      },
    },
  },
};

// Theme integration story
export const ThemeIntegration: Story = {
  render: () => <ThemeAwareHistoryPanel />,
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates theme integration with the ability to toggle between light and dark themes.',
      },
    },
  },
};

// Custom drawer width
export const CustomDrawerWidth: Story = {
  render: () => (
    <StatefulChatHistoryPanel 
      initialOpen={true}
      chatHistories={sampleChatHistories}
      drawerWidth={350}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: 'ChatHistoryPanel with a custom drawer width of 350px.',
      },
    },
  },
};

// Mobile view story
export const MobileView: Story = {
  render: () => (
    <StatefulChatHistoryPanel 
      initialOpen={false}
      variant="temporary"
      chatHistories={sampleChatHistories}
    />
  ),
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'ChatHistoryPanel optimized for mobile view with temporary drawer.',
      },
    },
  },
};

// Responsive variations
export const ResponsiveVariations: Story = {
  render: () => {
    const muiTheme = useMuiTheme();
    const isSmallScreen = useMediaQuery(muiTheme.breakpoints.down('sm'));
    const isMediumScreen = useMediaQuery(muiTheme.breakpoints.between('sm', 'md'));
    
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Current breakpoint: {
            isSmallScreen ? 'Small (xs)' : 
            isMediumScreen ? 'Medium (sm)' : 'Large (md+)'
          }
        </Typography>
        
        <StatefulChatHistoryPanel 
          initialOpen={!isSmallScreen}
          variant={isSmallScreen ? 'temporary' : 'persistent'}
          chatHistories={sampleChatHistories}
          drawerWidth={isSmallScreen ? 240 : isMediumScreen ? 280 : 320}
        />
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the ChatHistoryPanel adapts to different screen sizes, changing drawer behavior and width.',
      },
    },
  },
}; 