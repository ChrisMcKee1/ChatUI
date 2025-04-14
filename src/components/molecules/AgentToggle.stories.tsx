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
        story: 'AgentToggle with the standard chat mode selected. Shows the default appearance and behavior with the standard chat option active. The toggle maintains state internally and provides visual feedback on the current selection.',
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
        story: 'AgentToggle with the multi-agent chat mode selected. Demonstrates how the toggle looks when the multi-agent option is active. The toggle uses color and visual weight to indicate the active selection.',
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
        story: 'Compact version of the toggle for mobile devices with standard mode selected. Shows the responsive adaptation with smaller text and spacing to fit on mobile screens while maintaining usability.',
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
        story: 'Compact version of the toggle for mobile devices with multi-agent mode selected. Demonstrates the space-efficient layout for small screens with the multi-agent option active.',
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
      <Typography variant="h6" gutterBottom>AgentToggle Composition</Typography>
      
      <Paper sx={{ p: 3, mb: 3 }} elevation={2}>
        <Typography variant="body2" paragraph>
          The AgentToggle molecule is composed of these atomic components:
        </Typography>
        
        <Box component="ul" sx={{ pl: 2, fontSize: '0.875rem', mb: 3 }}>
          <li>MUI Button components - Provide interactive behavior and styling</li>
          <li>Lucide icon components (MessageSquare/Bot) - Visual indicators of each mode</li>
          <li>MUI Typography - Text labels for each option</li>
          <li>MUI Box - Container and layout components</li>
          <li>MUI Tooltip - Accessibility enhancement with descriptive text</li>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Stack spacing={2}>
          <Typography variant="subtitle2" gutterBottom>Key Features:</Typography>
          <Box component="ul" sx={{ pl: 2, fontSize: '0.875rem' }}>
            <li>Interactive state management</li>
            <li>Visual feedback for selected state</li>
            <li>Responsive design with compact mode</li>
            <li>Accessible with keyboard navigation</li>
            <li>Theme integration with light/dark mode support</li>
            <li>Tooltip descriptions for better usability</li>
          </Box>
        </Stack>
      </Paper>
      
      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', minWidth: '80px' }} elevation={1}>
            <MessageSquare size={18} />
          </Paper>
          <Typography variant="caption">Standard Chat Icon</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center', minWidth: '80px'  }} elevation={1}>
            <Bot size={18} />
          </Paper>
          <Typography variant="caption">Multi-Agent Chat Icon</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center' }} elevation={1}>
            <AgentToggle 
              mode="standard" 
              onToggle={() => {}} 
            />
          </Paper>
          <Typography variant="caption">Complete Toggle</Typography>
        </Box>
      </Box>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1" gutterBottom>State Transitions:</Typography>
        <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Standard → Multi-Agent:</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <AgentToggle mode="standard" onToggle={() => {}} />
                <Typography variant="body2" sx={{ mx: 1 }}>→</Typography>
                <AgentToggle mode="multiAgent" onToggle={() => {}} />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Multi-Agent → Standard:</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <AgentToggle mode="multiAgent" onToggle={() => {}} />
                <Typography variant="body2" sx={{ mx: 1 }}>→</Typography>
                <AgentToggle mode="standard" onToggle={() => {}} />
              </Box>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the AgentToggle is composed of smaller atomic components. Shows the individual parts and how they come together to form the complete molecule, along with state transitions between modes.',
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: '100%', maxWidth: '400px' }}>
        <Paper sx={{ p: 3, width: '100%' }} elevation={1}>
          <Typography variant="subtitle1" gutterBottom>Responsive Behavior Demo</Typography>
          <Typography variant="caption" sx={{ mb: 2, display: 'block' }}>
          Current viewport: <strong>{isMobile ? 'Mobile' : 'Desktop/Tablet'}</strong>
        </Typography>
        
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <StatefulAgentToggle initialMode="standard" compact={isMobile} onModeChange={handleModeChange} />
          </Box>
          
          <Divider sx={{ my: 2 }} />
          
          {modeChanges.length > 0 && (
            <Paper sx={{ p: 1.5, mt: 1, width: '100%' }} elevation={1}>
              <Typography variant="caption" component="div" sx={{ mb: 1, fontWeight: 'medium' }}>
                Mode change history:
              </Typography>
              {modeChanges.map((change, idx) => (
                <Typography key={idx} variant="caption" component="div" sx={{ fontSize: '0.75rem' }}>
                  {change.timestamp}: Changed to <strong>{change.mode}</strong> mode
                </Typography>
              ))}
            </Paper>
          )}
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ fontSize: '0.75rem', opacity: 0.7, display: 'block', textAlign: 'center' }}>
              The toggle automatically switches to compact mode on small screens.<br/>
              Try clicking between modes and resizing the viewport.
            </Typography>
          </Box>
        </Paper>
        
        <Paper sx={{ p: 2, width: '100%' }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Key Responsive Features:</Typography>
          <Box component="ul" sx={{ pl: 2, fontSize: '0.75rem', m: 0 }}>
            <li>Automatically adapts to viewport size</li>
            <li>Compact mode for mobile screens (smaller text and padding)</li>
            <li>Maintains touch-friendly target sizes</li>
            <li>Preserves visual distinction between options</li>
            <li>Consistent state management across form factors</li>
          </Box>
        </Paper>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the toggle adapts to different screen sizes using the compact prop and tracks interaction state. Shows responsive design in action with state management that persists across viewport changes.',
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
      <Typography variant="h6" gutterBottom>Theme Integration</Typography>
      
      <Paper sx={{ p: 3 }} elevation={2}>
        <Typography variant="body2" paragraph>
          The AgentToggle integrates with the application's theme system and adapts its appearance to both light and dark modes. Colors, contrasts, and visual treatment are optimized for each theme variant.
        </Typography>
        
        <Stack spacing={2}>
          <Typography variant="subtitle2" gutterBottom>Key Theme Integration Features:</Typography>
          <Box component="ul" sx={{ pl: 2, fontSize: '0.875rem' }}>
            <li>Automatic adaptation to light/dark mode</li>
            <li>Maintains proper contrast ratios in both themes</li>
            <li>Uses theme-defined colors for consistency</li>
            <li>Optimized shadows and elevation for each theme</li>
            <li>Accessible in both light and dark environments</li>
          </Box>
        </Stack>
      </Paper>
      
      <Box sx={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
          <Paper sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.9)', borderRadius: 2, width: '100%', display: 'flex', justifyContent: 'center' }} elevation={3}>
            <AgentToggle mode="standard" onToggle={() => {}} />
          </Paper>
          <Typography variant="caption" sx={{ fontWeight: 'medium' }}>Dark Theme</Typography>
          <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'center' }}>
            Higher contrast with lighter text
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, flex: 1 }}>
          <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: 2, width: '100%', display: 'flex', justifyContent: 'center', border: '1px solid rgba(0, 0, 0, 0.1)' }} elevation={1}>
        <AgentToggle mode="standard" onToggle={() => {}} />
          </Paper>
          <Typography variant="caption" sx={{ fontWeight: 'medium' }}>Light Theme</Typography>
          <Typography variant="caption" sx={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'center' }}>
            Subtle shadows with darker text
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 1 }} />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Mode Variants:</Typography>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Standard Mode:</Typography>
              <AgentToggle mode="standard" onToggle={() => {}} />
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="body2">Multi-Agent Mode:</Typography>
        <AgentToggle mode="multiAgent" onToggle={() => {}} />
            </Box>
          </Stack>
        </Paper>
        
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="subtitle2" gutterBottom>Compact Variants:</Typography>
          <Stack direction="row" spacing={4} justifyContent="center">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <AgentToggle mode="standard" onToggle={() => {}} compact />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Standard</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <AgentToggle mode="multiAgent" onToggle={() => {}} compact />
              <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>Multi-Agent</Typography>
            </Box>
          </Stack>
        </Paper>
      </Box>
      
      <Box sx={{ fontSize: '0.8rem', opacity: 0.7, textAlign: 'center', mt: 2 }}>
        Try toggling the theme in Storybook to see how the component adapts
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the toggle\'s theme integration capabilities with various modes and sizes in both light and dark themes. Shows how the component maintains proper contrast, visual hierarchy, and accessibility across theme variants.',
      },
    },
  },
}; 