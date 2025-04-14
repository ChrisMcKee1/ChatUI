import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Box, Button, Typography, Grid, useMediaQuery, useTheme as useMuiTheme, Paper, Stack, Divider, List, ListItem, ListItemButton, ListItemText, IconButton } from '@mui/material';
import { ChatHistoryPanel, ChatHistory } from './ChatHistoryPanel';
import { ThemeProvider } from '@/context/ThemeContext';
import { useTheme } from '@/context/ThemeContext';
import { History, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatMode } from '@/services/IHistoryService'; // Import ChatMode

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
  
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const finalVariant = isMobile ? 'temporary' : variant;
  const finalWidth = isMobile ? drawerWidth * 0.9 : drawerWidth; // Adjust width slightly for mobile if needed

  return (
    <Box sx={{ 
      height: '600px', 
      width: '100%',
      position: 'relative',
      bgcolor: 'background.default',
      overflow: 'hidden',
      display: 'flex'
    }}>
      <ChatHistoryPanel 
        chatHistories={chatHistories}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        isOpen={isOpen}
        onToggle={toggleDrawer}
        variant={finalVariant}
        drawerWidth={finalWidth}
      />
      <Box sx={{ 
        flexGrow: 1,
        // Adjust margin based on drawer state and variant ONLY if not temporary
        ml: isOpen && finalVariant !== 'temporary' ? `${finalWidth}px` : 0,
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
        component: 'A responsive drawer panel organism that displays chat history. It composes list item components and drawer controls. Includes support for different drawer variants (permanent, persistent, temporary), responsive sizing based on screen width, and theme integration. The panel adapts to different screen sizes and can be toggled between open and closed states.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        {/* Use a container that simulates page layout for persistent drawers */}
        <Box sx={{ display: 'flex', height: '600px', width: '100%', position: 'relative', overflow: 'hidden' }}>
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
      description: 'Type of drawer behavior (automatically switches to temporary on mobile)',
    },
    drawerWidth: {
      control: 'number',
      description: 'Width of the drawer in pixels (adjusted slightly on mobile)',
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
    mode: 'standard' as ChatMode,
  },
  {
    id: '2',
    title: 'Project Planning & Brainstorming Session',
    lastMessage: 'Let me outline the steps for your project, including potential roadblocks and solutions we discussed earlier.',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    messageCount: 8,
    mode: 'standard' as ChatMode,
  },
  {
    id: '3',
    title: 'Code Review Session (Multi-Agent)',
    lastMessage: 'Engineer: I recommend refactoring this function. Designer: The alignment looks good.',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    messageCount: 15,
    mode: 'multiAgent' as ChatMode,
  },
  {
    id: '4',
    title: 'Urgent Bug Troubleshooting - Login Issue',
    lastMessage: "The error might be caused by the recent authentication library update. Let's check the logs.", // Escaped apostrophe
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    messageCount: 10,
    mode: 'standard' as ChatMode,
  },
  {
    id: '5',
    title: 'Very Long Chat Title That Should Truncate Properly In The UI Element To Avoid Layout Issues On Smaller Screens',
    lastMessage: 'This is an extremely long message that should demonstrate how text wrapping and truncation work within the history panel UI component. It should be cut off at a certain point to prevent overflow and maintain a clean appearance, especially on mobile devices where space is limited. The full message should be visible on hover or through other means if necessary.',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    messageCount: 25,
    mode: 'multiAgent' as ChatMode,
  },
  {
    id: '6',
    title: 'Quick Question',
    lastMessage: 'Thanks!',
    lastUpdated: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    messageCount: 2,
    mode: 'standard' as ChatMode,
  },
];

// Basic states
export const Empty: Story = {
  args: {
    chatHistories: [],
    isOpen: true,
    variant: 'persistent',
  },
  render: (args) => <StatefulChatHistoryPanel {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Empty state when no chat histories are available. Shows a helpful message and icon guiding the user.',
      },
    },
    // Add a placeholder for the main content area specifically for this story
    decorators: [
      (Story) => (
        <ThemeProvider>
          <Box sx={{ display: 'flex', height: '600px', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <Story />
            <Box sx={{ ml: '280px', p: 2, flexGrow: 1 }}> {/* Adjust margin based on default open state */}
              <Paper sx={{ p: 2, border: '1px dashed grey', height: '100%' }}>
                <Typography>Main Content Area</Typography>
              </Paper>
            </Box>
          </Box>
        </ThemeProvider>
      ),
    ],
  },
};

export const WithHistories: Story = {
  args: {
    chatHistories: sampleChatHistories,
    activeChatId: '2',
    isOpen: true,
    variant: 'persistent',
  },
  render: (args) => <StatefulChatHistoryPanel {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'ChatHistoryPanel populated with sample chat histories and an active selection. Demonstrates the default appearance with multiple items.',
      },
    },
    // Add a placeholder for the main content area specifically for this story
    decorators: [
      (Story) => (
        <ThemeProvider>
          <Box sx={{ display: 'flex', height: '600px', width: '100%', position: 'relative', overflow: 'hidden' }}>
            <Story />
            <Box sx={{ ml: '280px', p: 2, flexGrow: 1 }}> {/* Adjust margin based on default open state */}
              <Paper sx={{ p: 2, border: '1px dashed grey', height: '100%' }}>
                <Typography>Main Content Area</Typography>
              </Paper>
            </Box>
          </Box>
        </ThemeProvider>
      ),
    ],
  },
};

export const ClosedDrawer: Story = {
  args: {
    chatHistories: sampleChatHistories,
    activeChatId: '2',
    isOpen: false,
    variant: 'persistent',
  },
  render: (args) => <StatefulChatHistoryPanel {...args} initialOpen={false} />,
  parameters: {
    docs: {
      description: {
        story: 'ChatHistoryPanel in its closed state. The toggle button should be visible to reopen it.',
      },
    },
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => <StatefulChatHistoryPanel chatHistories={sampleChatHistories} />,
  parameters: {
    docs: {
      description: {
        story: 'An interactive version where you can toggle the drawer and select different chat histories. Demonstrates the state management and interaction patterns.',
      },
    },
  },
};

// Drawer Variants
export const PersistentDrawer: Story = {
  args: {
    chatHistories: sampleChatHistories,
    activeChatId: '1',
    isOpen: true,
    variant: 'persistent',
  },
  render: (args) => <StatefulChatHistoryPanel {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Using the \`persistent\` variant. The drawer stays open alongside the main content until explicitly closed.',
      },
    },
  },
};

export const TemporaryDrawer: Story = {
  args: {
    chatHistories: sampleChatHistories,
    activeChatId: '1',
    isOpen: true,
    variant: 'temporary',
  },
  render: (args) => <StatefulChatHistoryPanel {...args} />,
  parameters: {
    docs: {
      description: {
        story: 'Using the \`temporary\` variant. The drawer opens over the main content and closes when clicking outside or selecting an item (behavior depends on implementation). This is the default on mobile.',
      },
    },
  },
};

// Responsive Behavior
export const MobileView: Story = {
  render: () => <StatefulChatHistoryPanel chatHistories={sampleChatHistories} variant="persistent" />,
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story: 'Demonstrates responsive behavior on a mobile viewport. The drawer should automatically switch to the \`temporary\` variant, and font sizes/padding are adjusted.',
      },
    },
  },
};

export const VerySmallMobileView: Story = {
  render: () => <StatefulChatHistoryPanel chatHistories={sampleChatHistories} variant="persistent" />,
  parameters: {
    viewport: { defaultViewport: 'mobile2' }, // Represents very small screens
    docs: {
      description: {
        story: 'Demonstrates responsive behavior on a very small mobile viewport (e.g., iPhone SE). Further adjustments to font sizes, padding, and drawer width are applied.',
      },
    },
  },
};

// Component Composition
export const ComponentComposition: Story = {
  render: () => (
    <Box sx={{ p: 3, maxWidth: '800px' }}>
      <Typography variant="h6" gutterBottom>ChatHistoryPanel Composition</Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" paragraph>
          The ChatHistoryPanel organism is composed primarily of MUI Drawer and List components, along with custom styling and logic:
        </Typography>
        
        <Box component="ul" sx={{ pl: 2, mb: 3 }}>
          <li>MUI Drawer - Provides the sliding panel mechanism</li>
          <li>MUI List, ListItem, ListItemButton, ListItemText - Used to display the chat history items</li>
          <li>MUI Typography - For titles, messages, and timestamps</li>
          <li>MUI IconButton (with ChevronLeft/Right icons) - For toggling the drawer</li>
          <li>History icon - Used in the empty state</li>
          <li>Box components - For layout and structure</li>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Stack spacing={2}>
          <Typography variant="subtitle2" gutterBottom>Key Features:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Displays a list of past chat conversations</li>
            <li>Highlights the currently active chat</li>
            <li>Allows selection of different chats</li>
            <li>Supports multiple drawer variants (persistent, temporary)</li>
            <li>Responsive design adapts drawer variant and styling for mobile</li>
            <li>Handles empty state gracefully</li>
            <li>Integrates with the application theme</li>
          </Box>
        </Stack>
      </Paper>
      
      <Stack spacing={3}>
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Example List Item:</Typography>
          <List disablePadding>
            <ListItem disablePadding divider>
              <ListItemButton selected sx={{ borderLeft: 4, borderColor: 'primary.main', bgcolor: 'action.selected' }}>
                <ListItemText 
                  primary="Sample Chat Title" 
                  secondary="Last message preview... • 2h ago"
                  primaryTypographyProps={{ fontWeight: 'medium' }}
                  secondaryTypographyProps={{ noWrap: true, variant: 'caption' }}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Paper>
        
        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} elevation={1}>
          <Typography>Toggle Control:</Typography>
          <Box>
            <IconButton><ChevronLeft /></IconButton>
            <IconButton><ChevronRight /></IconButton>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, textAlign: 'center' }} elevation={1}>
            <Typography variant="subtitle2" gutterBottom>Empty State Example:</Typography>
            <History size={24} style={{ opacity: 0.6, marginBottom: '8px' }} />
            <Typography variant="caption" display="block">
                No chat history yet.
            </Typography>
        </Paper>
      </Stack>
    </Box>
  ),
  parameters: {
    layout: 'centered', // Use centered layout for composition
    docs: {
      description: {
        story: 'Demonstrates the internal composition of the ChatHistoryPanel, showing how MUI components like Drawer, List, and ListItemButton are used to construct the panel.',
      },
    },
    // Remove the default fullscreen decorator for this story
    decorators: [
        (Story) => (
          <ThemeProvider>
             <Story />
          </ThemeProvider>
        ),
    ],
  },
};

// Theme Integration
export const ThemeVariations: Story = {
  render: () => {
    const { isDarkMode, toggleTheme } = useTheme();
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>Theme Integration</Typography>
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
           <Typography variant="body2" paragraph>
             The ChatHistoryPanel adapts its appearance based on the selected theme (light or dark). Background colors, text colors, divider colors, and selection highlights adjust automatically.
           </Typography>
           <Button variant="outlined" onClick={toggleTheme} sx={{ mb: 2 }}>
             Switch to {isDarkMode ? 'Light' : 'Dark'} Theme
           </Button>
        </Paper>
        {/* Ensure the wrapper Box has correct display and height */}
        <Box sx={{ display: 'flex', height: '480px' }}> {/* Adjust height as needed */}
           {/* Pass sample histories to the stateful panel */}
           <StatefulChatHistoryPanel chatHistories={sampleChatHistories} />
        </Box>
      </Box>
    );
  },
  parameters: {
    layout: 'padded', // Use padded layout for this story
    docs: {
      description: {
        story: 'Demonstrates how the ChatHistoryPanel adapts to light and dark themes. Use the button to toggle the theme and observe the changes in background, text, and selection colors.',
      },
    },
     // Remove the default fullscreen decorator for this story
    decorators: [
        (Story) => (
          <ThemeProvider>
             <Story />
          </ThemeProvider>
        ),
    ],
  },
}; 