import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import { Send, Save, ArrowRight, Loader2 } from 'lucide-react';
import { ThemeProvider } from '../providers/ThemeProvider';
import React from 'react';
import { userEvent, within, expect } from '@storybook/test'; // Import testing utilities

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Button', // Group under 'Atoms' in Storybook hierarchy
  component: Button,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    // Optional parameter to center the component in the Canvas.
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component using MUI\'s LoadingButton with custom styling and theme support.',
      },
    },
  },
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['contained', 'outlined', 'text'],
      description: 'Button variant',
    },
    color: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'info', 'warning', 'error', 'success', 'inherit'],
      description: 'Button color based on theme palette',
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Button size',
    },
    children: {
      control: 'text',
      description: 'Button content (node or text)',
    },
    onClick: { action: 'clicked', description: 'Click handler' },
    disabled: { control: 'boolean', description: 'Disable the button' },
    loading: { control: 'boolean', description: 'Show loading indicator' },
    startIcon: { control: 'object', description: 'Icon at the start' },
    endIcon: { control: 'object', description: 'Icon at the end' },
    fullWidth: { control: 'boolean', description: 'Span full width' },
    className: { control: 'text', description: 'Additional CSS classes' },
    sx: { control: 'object', description: 'MUI sx prop for style overrides' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

// Primary Button Story
export const Primary: Story = {
  args: {
    variant: 'contained',
    color: 'primary',
    size: 'medium',
    children: 'Button',
    disabled: false,
    loading: false,
    fullWidth: false,
  },
  // Add play function for interaction testing
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    // Get the button element
    const button = canvas.getByRole('button', { name: /Button/i });
    
    // Simulate user click
    await userEvent.click(button);
    
    // Assertion: Check if the onClick handler was called (if provided)
    // Note: Storybook's action logger implicitly checks this when `onClick` is defined in argTypes
    // We can add more explicit checks if needed, e.g., asserting element state changes
    // Example: If clicking toggled a state, we could check for that change.
    // await expect(button).toHaveAttribute('data-clicked', 'true'); // Example assertion
  },
};

// Secondary Button Story
export const SecondaryColor: Story = {
  args: {
    ...Primary.args,
    color: 'secondary',
    children: 'Secondary Color',
  },
};

export const SuccessColor: Story = {
  args: {
    ...Primary.args,
    color: 'success',
    children: 'Success Color',
  },
};

export const ErrorColor: Story = {
  args: {
    ...Primary.args,
    color: 'error',
    children: 'Error Color',
  },
};

// Outlined Button Story
export const Outlined: Story = {
  args: {
    ...Primary.args,
    variant: 'outlined',
    children: 'Outlined Button',
  },
};

export const Text: Story = {
  args: {
    ...Primary.args,
    variant: 'text',
    children: 'Text Button',
  },
};

// Button Size Variants
export const Small: Story = {
  args: {
    ...Primary.args,
    size: 'small',
    children: 'Small Button',
  },
};

export const Large: Story = {
  args: {
    ...Primary.args,
    size: 'large',
    children: 'Large Button',
  },
};

// State Variants
export const Disabled: Story = {
  args: {
    ...Primary.args,
    children: 'Disabled Button',
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    ...Primary.args,
    children: 'Loading...',
    loading: true,
  },
};

// Button with Icons
export const WithStartIcon: Story = {
  args: {
    ...Primary.args,
    children: 'Send',
    startIcon: <Send size={16} />,
  },
};

export const WithEndIcon: Story = {
  args: {
    ...Primary.args,
    color: 'secondary',
    children: 'Next',
    endIcon: <ArrowRight size={16} />,
  },
};

export const LoadingWithIcon: Story = {
  args: {
    ...Primary.args,
    children: 'Saving',
    loading: true,
    loadingPosition: 'start',
    startIcon: <Save size={16} />,
  },
};

// Responsive Example
export const FullWidthResponsive: Story = {
  args: {
    ...Primary.args,
    children: 'Full Width (Resize Viewport)',
    fullWidth: true,
  },
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
  render: (args) => (
    <div style={{ width: '100%', border: '1px dashed grey', padding: '10px' }}>
      <Button {...args} />
    </div>
  ),
};

// Theme Color Integration Example
export const ThemeColorIntegration: Story = {
  args: {
    ...Primary.args,
    children: 'Theme Integration',
  },
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Primary Variant</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="contained" color="primary">Normal</Button>
          <Button variant="contained" color="primary" disabled>Disabled</Button>
          <Button variant="contained" color="primary">Contained Primary</Button>
          <Button variant="contained" color="primary" disabled>Contained Disabled</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Secondary Variant</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="contained" color="secondary">Contained Secondary</Button>
          <Button variant="contained" color="secondary" disabled>Contained Disabled</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Outlined Variant</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outlined" color="primary">Outlined Primary</Button>
          <Button variant="outlined" color="primary" disabled>Outlined Disabled</Button>
        </div>
      </div>
    </div>
  ),
};