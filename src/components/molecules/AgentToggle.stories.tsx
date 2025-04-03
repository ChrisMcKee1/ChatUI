import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AgentToggle, AgentMode } from './AgentToggle';

// Create a stateful wrapper for Storybook interactions
const StatefulAgentToggle = ({ initialMode = 'standard', compact = false }: { initialMode?: AgentMode, compact?: boolean }) => {
  const [mode, setMode] = useState<AgentMode>(initialMode);
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <AgentToggle 
        mode={mode} 
        onToggle={setMode} 
        compact={compact}
      />
      <Typography variant="caption" sx={{ opacity: 0.7 }}>
        Current mode: <strong>{mode === 'standard' ? 'Standard Chat' : 'Multi-Agent Chat'}</strong>
      </Typography>
    </Box>
  );
};

const meta = {
  title: 'Molecules/AgentToggle',
  component: AgentToggle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toggle component for switching between standard chat and multi-agent chat modes. Features responsive design with compact mode for mobile screens.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['standard', 'multiAgent'],
      description: 'Current chat mode (standard or multiAgent)',
    },
    onToggle: {
      action: 'toggled',
      description: 'Function called when the toggle is clicked with the new mode',
    },
    compact: {
      control: 'boolean',
      description: 'Whether to show the toggle in compact mode (smaller size for mobile)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
  },
} satisfies Meta<typeof AgentToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

// Basic examples with interactive state
export const StandardSelected: Story = {
  args: {
    mode: 'standard',
    onToggle: () => {},
  },
  render: () => <StatefulAgentToggle initialMode="standard" />,
  parameters: {
    docs: {
      description: {
        story: 'AgentToggle with the standard chat mode selected',
      },
    },
  },
};

export const MultiAgentSelected: Story = {
  args: {
    mode: 'multiAgent',
    onToggle: () => {},
  },
  render: () => <StatefulAgentToggle initialMode="multiAgent" />,
  parameters: {
    docs: {
      description: {
        story: 'AgentToggle with the multi-agent chat mode selected',
      },
    },
  },
};

// Compact mode examples (mobile)
export const CompactStandardSelected: Story = {
  args: {
    mode: 'standard',
    onToggle: () => {},
    compact: true,
  },
  render: () => <StatefulAgentToggle initialMode="standard" compact={true} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Compact version of the toggle for mobile devices with standard mode selected',
      },
    },
  },
};

export const CompactMultiAgentSelected: Story = {
  args: {
    mode: 'multiAgent',
    onToggle: () => {},
    compact: true,
  },
  render: () => <StatefulAgentToggle initialMode="multiAgent" compact={true} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Compact version of the toggle for mobile devices with multi-agent mode selected',
      },
    },
  },
};

// Responsive toggle example
export const ResponsiveToggle: Story = {
  args: {
    mode: 'standard',
    onToggle: () => {},
  },
  render: () => {
    // This is a render function component that can use hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" sx={{ mb: 1 }}>
          Current viewport: <strong>{isMobile ? 'Mobile' : 'Desktop/Tablet'}</strong>
        </Typography>
        
        <StatefulAgentToggle initialMode="standard" compact={isMobile} />
        
        <Typography variant="caption" sx={{ fontSize: '0.75rem', opacity: 0.7, mt: 1 }}>
          The toggle automatically switches to compact mode on small screens
        </Typography>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the toggle adapts to different screen sizes using the compact prop',
      },
    },
  },
};

// Theme integration example
export const ThemeIntegration: Story = {
  args: {
    mode: 'standard',
    onToggle: () => {},
  },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Standard Mode Selected:</Typography>
        <AgentToggle mode="standard" onToggle={() => {}} />
      </Box>
      
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Multi-Agent Mode Selected:</Typography>
        <AgentToggle mode="multiAgent" onToggle={() => {}} />
      </Box>
      
      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Compact Versions:</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <AgentToggle mode="standard" onToggle={() => {}} compact />
          <AgentToggle mode="multiAgent" onToggle={() => {}} compact />
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows how the toggle adapts to the current theme in different modes and sizes',
      },
    },
  },
}; 