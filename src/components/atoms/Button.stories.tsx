import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
  title: 'Atoms/Button', // Group under 'Atoms' in Storybook hierarchy
  component: Button,
  parameters: {
    // Optional parameter to center the component in the Canvas.
    layout: 'centered',
  },
  // This component will have an automatically generated Autodocs entry:
  // https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  // More on argTypes: https://storybook.js.org/docs/api/argtypes
  argTypes: {
    variant: {
      control: { type: 'select' }, // Use select control for variants
      options: ['primary', 'secondary'],
    },
    onClick: { action: 'clicked' }, // Log actions in the Storybook UI
    children: {
      control: 'text', // Allow editing button text
      defaultValue: 'Button Text',
    }
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

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

// Example of using className prop
export const WithCustomClass: Story = {
  args: {
    variant: 'primary',
    children: 'Custom Class Button',
    className: 'bg-green-500 hover:bg-green-700', // Override default primary styles
  },
}; 