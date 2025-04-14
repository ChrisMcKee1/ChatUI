import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Box, Typography, useMediaQuery, useTheme, Paper, Stack, Divider } from '@mui/material';
import { AgentToggle, AgentMode } from './AgentToggle';
import { ThemeProvider } from '../providers/ThemeProvider';
import { MessageSquare, Bot } from 'lucide-react';
import { action } from '@storybook/addon-actions';

// Create a stateful wrapper for Storybook interactions
const StatefulAgentToggle = ({ initialMode = 'standard', compact = false, onModeChange = null }: { initialMode?: AgentMode, compact?: boolean, onModeChange?: ((mode: AgentMode) => void) | null }) => {
  const [mode, setMode] = useState<AgentMode>(initialMode);
  
  const handleToggle = (newMode: AgentMode) => {
    setMode(newMode);
    if (onModeChange) onModeChange(newMode);
    action('mode changed')(newMode);
  };
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <AgentToggle 
        mode={mode} 
        onToggle={handleToggle} 
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
        component: 'Toggle component for switching between standard chat and multi-agent chat modes. This molecule composes atomic components like Buttons, Icons, and Typography elements to create an interactive toggle with visual feedback. Features responsive design with compact mode for mobile screens and integrates with the theme system.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['standard', 'multiAgent'],
      description: 'Current chat mode (standard or multiAgent). Controls which option is selected.',
    },
    onToggle: {
      action: 'toggled',
      description: 'Function called when the toggle is clicked with the new mode as parameter.',
    },
    compact: {
      control: 'boolean',
      description: 'Whether to show the toggle in compact mode (smaller size for mobile screens).',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names for styling customization.',
    },
  },
} satisfies Meta<typeof AgentToggle>;

export default meta;

type Story = StoryObj<typeof meta>;

// Basic examples with interactive state
export const StandardSelected: Story = {
  args: {
    mode: 'standard',
    onToggle: action('toggled'),
  },
  render: () => <StatefulAgentToggle initialMode="standard" />,
  parameters: {
    docs: {
      description: {
        story: 'AgentToggle with the standard chat mode selected. Shows the default appearance and behavior with the standard chat option active.',
      },
    },
  },
};

export const MultiAgentSelected: Story = {
  args: {
    mode: 'multiAgent',
    onToggle: action('toggled'),
  },
  render: () => <StatefulAgentToggle initialMode="multiAgent" />,
  parameters: {
    docs: {
      description: {
        story: 'AgentToggle with the multi-agent chat mode selected. Demonstrates how the toggle looks when the multi-agent option is active.',
      },
    },
  },
};

// Compact mode examples (mobile)
export const CompactStandardSelected: Story = {
  args: {
    mode: 'standard',
    onToggle: action('toggled'),
    compact: true,
  },
  render: () => <StatefulAgentToggle initialMode="standard" compact={true} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Compact version of the toggle for mobile devices with standard mode selected. Shows the responsive adaptation with smaller text and spacing.',
      },
    },
  },
};

export const CompactMultiAgentSelected: Story = {
  args: {
    mode: 'multiAgent',
    onToggle: action('toggled'),
    compact: true,
  },
  render: () => <StatefulAgentToggle initialMode="multiAgent" compact={true} />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Compact version of the toggle for mobile devices with multi-agent mode selected. Demonstrates the space-efficient layout for small screens.',
      },
    },
  },
};

// Component composition demonstration
export const ComponentComposition: Story = {
  args: {
    mode: 'standard',
    onToggle: action('toggled'),
  },
  render: () => (
    <Box sx={{ width: '100%', maxWidth: '500px' }}>
      <Typography variant="subtitle2" gutterBottom>Component Composition</Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="body2" paragraph>
            The AgentToggle molecule is composed of these atomic components:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2, fontSize: '0.875rem' }}>
            <li>MUI Button components - Provide interactive behavior and styling</li>
            <li>Lucide icon components (MessageSquare/Bot) - Visual indicators of each mode</li>
            <li>MUI Typography - Text labels for each option</li>
            <li>MUI Box - Container and layout components</li>
            <li>MUI Tooltip - Accessibility enhancement with descriptive text</li>
          </Box>
        </Paper>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', minWidth: '80px' }} elevation={1}>
            <MessageSquare size={18} />
          </Paper>
          <Typography variant="caption">Standard Icon</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', minWidth: '80px'  }} elevation={1}>
            <Bot size={18} />
          </Paper>
          <Typography variant="caption">Multi-Agent Icon</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <AgentToggle 
            mode="standard" 
            onToggle={() => {}} 
          />
          <Typography variant="caption">Complete Toggle</Typography>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the AgentToggle is composed of smaller atomic components. Shows the individual parts and how they come together to form the complete molecule.',
      },
    },
  },
};

// Responsive toggle example with interaction tracking
export const ResponsiveToggle: Story = {
  args: {
    mode: 'standard',
    onToggle: action('toggled'),
  },
  render: () => {
    // This is a render function component that can use hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // @ts-ignore - useState is not recognized in static Story type
    const [modeChanges, setModeChanges] = useState<{mode: string, timestamp: string}[]>([]);
    
    const handleModeChange = (newMode: AgentMode) => {
      const now = new Date();
      const timestamp = now.toLocaleTimeString();
      setModeChanges(prev => [...prev.slice(-3), { mode: newMode, timestamp }]);
      action('mode changed')(newMode);
    };
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" sx={{ mb: 1 }}>
          Current viewport: <strong>{isMobile ? 'Mobile' : 'Desktop/Tablet'}</strong>
        </Typography>
        
        <StatefulAgentToggle initialMode="standard" compact={isMobile} onModeChange={handleModeChange} />
        
        {modeChanges.length > 0 && (
          <Paper sx={{ p: 1.5, mt: 1, width: '100%', maxWidth: '300px' }} elevation={1}>
            <Typography variant="caption" component="div" sx={{ mb: 1 }}>
              Mode change history:
            </Typography>
            {modeChanges.map((change, idx) => (
              <Typography key={idx} variant="caption" component="div" sx={{ fontSize: '0.75rem' }}>
                {change.timestamp}: Changed to <strong>{change.mode}</strong> mode
              </Typography>
            ))}
          </Paper>
        )}
        
        <Typography variant="caption" sx={{ fontSize: '0.75rem', opacity: 0.7, mt: 1 }}>
          The toggle automatically switches to compact mode on small screens.<br/>
          Try clicking between modes and resizing the viewport.
        </Typography>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the toggle adapts to different screen sizes using the compact prop and tracks interaction state. Shows responsive design in action with state management.',
      },
    },
  },
};

// Theme variation demonstration
export const ThemeVariations: Story = {
  args: {
    mode: 'standard',
    onToggle: action('toggled'),
  },
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '500px' }}>
      <Typography variant="subtitle2" gutterBottom>Theme Integration</Typography>
      
      <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.9)', borderRadius: 2 }} elevation={3}>
            <AgentToggle mode="standard" onToggle={() => {}} />
          </Paper>
          <Typography variant="caption">Dark Theme</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid rgba(0, 0, 0, 0.1)' }} elevation={1}>
            <AgentToggle mode="standard" onToggle={() => {}} />
          </Paper>
          <Typography variant="caption">Light Theme</Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Stack spacing={2}>
        <Typography variant="subtitle2">Standard Mode:</Typography>
        <AgentToggle mode="standard" onToggle={() => {}} />
        
        <Typography variant="subtitle2">Multi-Agent Mode:</Typography>
        <AgentToggle mode="multiAgent" onToggle={() => {}} />
        
        <Typography variant="subtitle2">Compact Modes:</Typography>
        <Stack direction="row" spacing={2} justifyContent="center">
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <AgentToggle mode="standard" onToggle={() => {}} compact />
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Standard</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <AgentToggle mode="multiAgent" onToggle={() => {}} compact />
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Multi-Agent</Typography>
          </Box>
        </Stack>
      </Stack>
      
      <Box sx={{ fontSize: '0.8rem', opacity: 0.7, textAlign: 'center', mt: 2 }}>
        Try toggling the theme in Storybook to see how the component adapts
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows how the toggle adapts to the current theme in different modes and sizes. Demonstrates theme integration with colors and styles that adjust based on light/dark mode.',
      },
    },
  },
}; 