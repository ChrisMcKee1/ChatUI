import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import { Send, Save, ArrowRight } from 'lucide-react';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Button', // Group under 'Atoms' in Storybook hierarchy
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas.
    layout: 'centered',
    docs: {
      description: {
        component: 'Button component using Material UI with custom theming support. Supports primary, secondary, and outlined variants.',
      },
    },
  },
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: { type: 'select' }, // Use select control for variants
      options: ['primary', 'secondary', 'outlined'],
      description: 'Button variant - primary (pink), secondary (blue), or outlined',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Button size - small, medium, or large',
    },
    children: {
      control: 'text', // Allow editing button text
      description: 'Button content',
    },
    onClick: { 
      action: 'clicked',
      description: 'Function to call when button is clicked',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the button',
    },
    startIcon: {
      description: 'Icon to display at the start of the button',
    },
    endIcon: {
      description: 'Icon to display at the end of the button',
    },
    fullWidth: {
      control: 'boolean',
      description: 'Make the button take the full width of its container',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args

// Primary Button Story
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// Secondary Button Story
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// Outlined Button Story
export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: 'Outlined Button',
  },
};

// Button Size Variants
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'sm',
    children: 'Small Button',
  },
};

export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'md',
    children: 'Medium Button',
  },
};

export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Large Button',
  },
};

// State Variants
export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Disabled Button',
    disabled: true,
  },
};

// Button with Icons
export const WithStartIcon: Story = {
  args: {
    variant: 'primary',
    children: 'Send Message',
    startIcon: <Send size={16} />,
  },
};

export const WithEndIcon: Story = {
  args: {
    variant: 'secondary',
    children: 'Next Step',
    endIcon: <ArrowRight size={16} />,
  },
};

export const IconOnly: Story = {
  args: {
    variant: 'primary',
    children: <Save size={20} />,
    size: 'sm',
  },
};

// Responsive Example
export const FullWidth: Story = {
  args: {
    variant: 'primary',
    children: 'Full Width Button',
    fullWidth: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: (args) => (
    <div style={{ width: '100%', maxWidth: '300px' }}>
      <Button {...args} />
    </div>
  ),
};

// Theme Color Integration Example
export const ThemeColorIntegration: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Primary Variant</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="primary">Normal</Button>
          <Button variant="primary" disabled>Disabled</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Secondary Variant</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary">Normal</Button>
          <Button variant="secondary" disabled>Disabled</Button>
        </div>
      </div>
      <div>
        <h3 style={{ marginBottom: '8px' }}>Outlined Variant</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="outlined">Normal</Button>
          <Button variant="outlined" disabled>Disabled</Button>
        </div>
      </div>
    </div>
  ),
}; 