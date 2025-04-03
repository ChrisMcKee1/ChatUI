import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './ThemeToggle';
import { ThemeProvider } from '@/context/ThemeContext';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const meta: Meta<typeof ThemeToggle> = {
  component: ThemeToggle,
  title: 'Molecules/ThemeToggle',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Theme toggle button that switches between light and dark modes. Shows either a sun or moon icon based on the current theme.',
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
      description: 'Additional CSS class names',
    },
    compact: {
      control: 'boolean',
      description: 'Whether to display in compact mode (smaller size)',
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
        story: 'Default theme toggle button that changes icon and color based on the current theme',
      },
    },
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'p-2 bg-gray-100 rounded-lg',
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
        story: 'Smaller version of the theme toggle button for mobile devices',
      },
    },
  },
};

// Show both states side by side
export const BothStates: Story = {
  args: {},
  render: () => (
    <Box sx={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box sx={{ 
          p: 2, 
          bgcolor: 'rgba(0, 0, 0, 0.8)', 
          borderRadius: 1, 
          display: 'flex', 
          justifyContent: 'center'
        }}>
          <ThemeToggle />
        </Box>
        <Typography variant="caption">Dark Mode View</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Box sx={{ 
          p: 2, 
          bgcolor: 'white', 
          borderRadius: 1, 
          display: 'flex', 
          justifyContent: 'center',
          border: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <ThemeToggle />
        </Box>
        <Typography variant="caption">Light Mode View</Typography>
      </Box>
    </Box>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows how the toggle looks in both light and dark modes (approximate visualization)',
      },
    },
  },
};

// Responsive toggle example
export const ResponsiveToggle: Story = {
  args: {},
  render: () => {
    // This is a render function component that can use hooks
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography variant="caption" sx={{ mb: 1 }}>
          Current viewport: <strong>{isMobile ? 'Mobile' : 'Desktop/Tablet'}</strong>
        </Typography>
        
        <ThemeToggle compact={isMobile} />
        
        <Typography variant="caption" sx={{ fontSize: '0.75rem', opacity: 0.7, mt: 1 }}>
          The toggle automatically switches to compact mode on small screens
        </Typography>
      </Box>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how the toggle adapts to different screen sizes',
      },
    },
  },
}; 