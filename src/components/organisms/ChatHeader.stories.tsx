import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ThemeProvider } from '@/context/ThemeContext';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { Box, Typography, Paper, Stack, Divider } from '@mui/material';
import { AgentToggle } from '@/components/molecules/AgentToggle';
import { ThemeToggle } from '@/components/molecules/ThemeToggle';
import Button from '@/components/atoms/Button';
import { Plus } from 'lucide-react';

// Create a stateful wrapper for Storybook interactions
const StatefulChatHeader = ({ 
  initialMode = 'standard',
  isSmallScreen = false,
  isExtraSmallScreen = false
}: { 
  initialMode?: AgentMode,
  isSmallScreen?: boolean,
  isExtraSmallScreen?: boolean
}) => {
  const [mode, setMode] = useState<AgentMode>(initialMode);
  
  return (
    <ChatHeader 
      agentMode={mode}
      onAgentModeToggle={(newMode) => {
        setMode(newMode);
        console.log(`Mode toggled to: ${newMode}`);
      }}
      onNewChat={() => console.log('New chat requested')}
      isSmallScreen={isSmallScreen}
      isExtraSmallScreen={isExtraSmallScreen}
    />
  );
};

const meta: Meta<typeof ChatHeader> = {
  component: ChatHeader,
  title: 'Organisms/ChatHeader',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Header component for the chat application. This organism composes the AgentToggle, ThemeToggle, and New Chat button molecules/atoms to provide top-level controls and application branding. It features responsive design with adaptations for small and very small screens.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    agentMode: {
      control: 'radio',
      options: ['standard', 'multiAgent'],
      description: 'The current agent mode (standard or multiAgent)',
    },
    onAgentModeToggle: { 
      action: 'agent mode toggled',
      description: 'Function called when the agent mode is toggled',
    },
    onNewChat: {
      action: 'new chat',
      description: 'Function called when the new chat button is clicked',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    drawerOpen: {
      control: 'boolean',
      description: 'Whether the drawer is open (for layout adjustments)',
    },
    drawerWidth: {
      control: 'number',
      description: 'Width of the drawer in pixels (for layout adjustments)',
    },
    isSmallScreen: {
      control: 'boolean',
      description: 'Whether the screen is small (tablet) - triggers compact mode for components',
    },
    isExtraSmallScreen: {
      control: 'boolean',
      description: 'Whether the screen is very small (mobile) - further spacing optimization',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ChatHeader>;

// Basic examples
export const StandardMode: Story = {
  args: {
    agentMode: 'standard',
    onAgentModeToggle: (mode) => console.log(`Mode toggled to: ${mode}`),
    onNewChat: () => console.log('New chat requested'),
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatHeader with standard chat mode selected. Shows the default state with standard mode active in the AgentToggle.',
      },
    },
  },
};

export const MultiAgentMode: Story = {
  args: {
    agentMode: 'multiAgent',
    onAgentModeToggle: (mode) => console.log(`Mode toggled to: ${mode}`),
    onNewChat: () => console.log('New chat requested'),
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatHeader with multi-agent chat mode selected. Demonstrates the appearance when multi-agent mode is active.',
      },
    },
  },
};

// Interactive story that maintains state
export const Interactive: Story = {
  args: {},
  render: () => <StatefulChatHeader initialMode="standard" />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive ChatHeader that maintains state when toggling between modes. Demonstrates the internal state management of the AgentToggle via the stateful wrapper.',
      },
    },
  },
};

// Responsive variations
export const MobileView: Story = {
  args: {
    agentMode: 'standard',
    onAgentModeToggle: (mode) => console.log(`Mode toggled to: ${mode}`),
    onNewChat: () => console.log('New chat requested'),
    isSmallScreen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'ChatHeader optimized for mobile devices (isSmallScreen=true). Shows compact versions of AgentToggle and ThemeToggle, and reduced spacing.',
      },
    },
  },
};

export const VerySmallMobileView: Story = {
  args: {
    agentMode: 'standard',
    onAgentModeToggle: (mode) => console.log(`Mode toggled to: ${mode}`),
    onNewChat: () => console.log('New chat requested'),
    isSmallScreen: true,
    isExtraSmallScreen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
    docs: {
      description: {
        story: 'ChatHeader optimized for very small mobile devices (isSmallScreen=true, isExtraSmallScreen=true). Shows further spacing reductions for extremely narrow viewports.',
      },
    },
  },
};

// Component composition story
export const ComponentComposition: Story = {
  render: () => (
    <Box sx={{ p: 3, maxWidth: '800px' }}>
      <Typography variant="h6" gutterBottom>ChatHeader Composition</Typography>
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body2" paragraph>
          The ChatHeader organism is composed of these molecule/atom components:
        </Typography>
        
        <Box component="ul" sx={{ pl: 2, mb: 3 }}>
          <li>AgentToggle molecule - For switching chat modes</li>
          <li>ThemeToggle molecule - For switching between light/dark themes</li>
          <li>IconButton atom (with Plus icon) - For starting a new chat</li>
          <li>Typography component - For displaying the application title</li>
          <li>AppBar and Toolbar components - For layout and structure</li>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Stack spacing={2}>
          <Typography variant="subtitle2" gutterBottom>Key Features:</Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <li>Consolidated top-level controls (Mode, Theme, New Chat)</li>
            <li>Application branding display</li>
            <li>Responsive design with automatic adaptations</li>
            <li>Theme integration via child components</li>
            <li>Clear separation of concerns using composed components</li>
          </Box>
        </Stack>
      </Paper>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} elevation={1}>
          <Typography variant="body2">Agent Toggle:</Typography>
          <AgentToggle mode="standard" onToggle={() => {}} />
        </Paper>
        
        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} elevation={1}>
          <Typography variant="body2">Theme Toggle:</Typography>
          <ThemeToggle />
        </Paper>
        
        <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} elevation={1}>
          <Typography variant="body2">New Chat Button:</Typography>
          <Button variant="contained" startIcon={<Plus size={16} />} onClick={() => {}}>
            New Chat
          </Button>
        </Paper>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom>Full Header Example:</Typography>
        <ChatHeader 
          agentMode="standard" 
          onAgentModeToggle={() => {}} 
          onNewChat={() => {}} 
        />
      </Box>
    </Box>
  ),
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        story: 'Demonstrates how the ChatHeader is composed of molecule and atom components. Shows the individual parts (AgentToggle, ThemeToggle, Button) and how they are assembled within the header structure.',
      },
    },
  },
}; 