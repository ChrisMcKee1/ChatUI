import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '../providers/ThemeProvider';
import { Box, Typography, useMediaQuery, useTheme, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

const meta: Meta<typeof ThemeToggle> = {
  component: ThemeToggle,
  title: 'Molecules/ThemeToggle',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Theme toggle button that switches between light and dark modes. This molecule component composes atomic elements like IconButton and icon components to create an interactive toggle with visual feedback. It maintains its own state through context integration and adapts to different screen sizes.',
      },
    },
  },
  tags: ['autodocs'],
  // Wrap the component with ThemeProvider for Storybook
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS class names for styling customization',
    },
    compact: {
      control: 'boolean',
      description: 'Whether to display in compact mode (smaller size) for mobile screens',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'Default theme toggle button that changes icon and color based on the current theme. Shows the standard size suitable for desktop and tablet views.',
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'p-2 bg-gray-100 rounded-lg',
  },
  parameters: {
    docs: {
      description: {
        story: 'Theme toggle with custom CSS class applied. Demonstrates how the component can be styled externally.',
      },
    },
  },
};

export const Compact: Story = {
  args: {
    compact: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story: 'Smaller version of the theme toggle button designed for mobile devices and compact layouts. Reduces the icon and button size for better mobile UI density.',
      },
    },
  },
};

// Show both states side by side
export const ThemeVariations: Story = {
  args: {},
  render: () => (
    <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Paper sx={{ 
          p: 2, 
          bgcolor: 'rgba(0, 0, 0, 0.8)', 
          borderRadius: 1, 
          display: 'flex', 
          justifyContent: 'center'
        }} elevation={3}>
          <ThemeToggle />
        </Paper>
        <Typography variant="caption">Dark Mode View</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Paper sx={{ 
          p: 2, 
          bgcolor: 'white', 
          borderRadius: 1, 
          display: 'flex', 
          justifyContent: 'center',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }} elevation={1}>
          <ThemeToggle />
        </Paper>
        <Typography variant="caption">Light Mode View</Typography>
      </Box>
      
      <Box sx={{ fontSize: '0.8rem', opacity: 0.7, position: 'absolute', bottom: -40, textAlign: 'center' }}>
        Try toggling the theme in Storybook to see actual theme changes
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows how the toggle appears in both light and dark modes. This simulated view demonstrates the visual differences, while the actual component will respond to the theme context.',
      },
    },
  },
};

// Component composition demonstration
export const ComponentComposition: Story = {
  render: () => (
    <Box sx={{ width: '100%', maxWidth: '500px' }}>
      <Typography variant="subtitle2" gutterBottom>Component Composition</Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="body2" paragraph>
            The ThemeToggle molecule is composed of these atomic components:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2, fontSize: '0.875rem' }}>
            <li>MUI IconButton - Provides the button behavior and styling</li>
            <li>Lucide icon components (Sun/Moon) - Visual indicators of theme state</li>
          </Box>
        </Paper>
        
        <Paper sx={{ p: 2 }} elevation={1}>
          <Typography variant="body2" paragraph>
            It also integrates with these services:
          </Typography>
          
          <Box component="ul" sx={{ pl: 2, fontSize: '0.875rem' }}>
            <li>ThemeContext - Provides theme state and toggle functionality</li>
            <li>MUI Theme - Uses theme colors for icon styling</li>
          </Box>
        </Paper>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', mt: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center' }} elevation={1}>
            <Sun size={20} color="#ffd866" />
          </Paper>
          <Typography variant="caption">Sun Icon (Light Mode)</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center' }} elevation={1}>
            <Moon size={20} color="#78dce8" />
          </Paper>
          <Typography variant="caption">Moon Icon (Dark Mode)</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <ThemeToggle />
          <Typography variant="caption">Complete Toggle</Typography>
        </Box>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the ThemeToggle is composed of smaller atomic components. Shows the individual parts and how they come together to form the complete molecule.',
      },
    },
  },
};

// Responsive toggle example with interactive feedback
export const ResponsiveToggle: Story = {
  args: {},
  render: () => {
    // This is a render function component that can use hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    // @ts-ignore - useState is not recognized in static Story type
    const [toggleCount, setToggleCount] = useState(0);
    // @ts-ignore - useState is not recognized in static Story type
    const [currentTheme, setCurrentTheme] = useState<string>('');
    const { isDarkMode } = useTheme();
    
    // Update the current theme display
    // @ts-ignore - useEffect is not recognized in static Story type
    useEffect(() => {
      setCurrentTheme(isDarkMode ? 'Dark' : 'Light');
    }, [isDarkMode]);
    
    // Custom theme toggle that tracks clicks
    const handleToggleWithTracking = () => {
      setToggleCount(prev => prev + 1);
    };
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" sx={{ mb: 1 }}>
          Current viewport: <strong>{isMobile ? 'Mobile' : 'Desktop/Tablet'}</strong>
        </Typography>
        
        <Box onClick={handleToggleWithTracking}>
          <ThemeToggle compact={isMobile} />
        </Box>
        
        {toggleCount > 0 && (
          <Paper sx={{ p: 1.5, mt: 1, width: '100%', maxWidth: '250px' }} elevation={1}>
            <Typography variant="caption" component="div" sx={{ textAlign: 'center' }}>
              Toggle clicked: <strong>{toggleCount}</strong> times
            </Typography>
            <Typography variant="caption" component="div" sx={{ textAlign: 'center' }}>
              Current theme: <strong>{currentTheme}</strong>
            </Typography>
          </Paper>
        )}
        
        <Typography variant="caption" sx={{ fontSize: '0.75rem', opacity: 0.7, mt: 1 }}>
          The toggle automatically switches to compact mode on small screens.<br />
          Try resizing the viewport to see the difference.
        </Typography>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the toggle adapts to different screen sizes and provides interaction feedback. Shows responsive design in action with state tracking.',
      },
    },
  },
}; 