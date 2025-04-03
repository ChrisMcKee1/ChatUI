import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ThemeProvider } from '@/context/ThemeContext';
import { AgentMode } from '@/components/molecules/AgentToggle';
import { Box, Typography } from '@mui/material';

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
        component: 'Header component for the chat application with app title, agent mode toggle, new chat button, and theme toggle. Features responsive design with adaptations for small and very small screens.',
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

// Standard mode story
export const StandardMode: Story = {
  args: {
    agentMode: 'standard',
    onAgentModeToggle: (mode) => console.log(`Mode toggled to: ${mode}`),
    onNewChat: () => console.log('New chat requested'),
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatHeader with standard chat mode selected',
      },
    },
  },
};

// Multi-agent mode story
export const MultiAgentMode: Story = {
  args: {
    agentMode: 'multiAgent',
    onAgentModeToggle: (mode) => console.log(`Mode toggled to: ${mode}`),
    onNewChat: () => console.log('New chat requested'),
  },
  parameters: {
    docs: {
      description: {
        story: 'ChatHeader with multi-agent chat mode selected',
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
        story: 'Interactive ChatHeader that maintains state when toggling between modes',
      },
    },
  },
};

// Mobile view story
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
        story: 'ChatHeader optimized for mobile devices with compact components',
      },
    },
  },
};

// Very small mobile view story
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
        story: 'ChatHeader optimized for very small mobile devices with further spacing optimizations',
      },
    },
  },
};

// Responsive variations story
export const ResponsiveVariations: Story = {
  args: {},
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="h6" sx={{ mb: 1, pl: 2 }}>Desktop View</Typography>
        <StatefulChatHeader initialMode="standard" />
      </Box>
      
      <Box>
        <Typography variant="h6" sx={{ mb: 1, pl: 2 }}>Tablet View (isSmallScreen=true)</Typography>
        <StatefulChatHeader initialMode="standard" isSmallScreen={true} />
      </Box>
      
      <Box>
        <Typography variant="h6" sx={{ mb: 1, pl: 2 }}>Mobile View (isSmallScreen=true, isExtraSmallScreen=true)</Typography>
        <StatefulChatHeader initialMode="standard" isSmallScreen={true} isExtraSmallScreen={true} />
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the header adapts to different screen sizes',
      },
    },
  },
}; 