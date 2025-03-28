import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';

const meta = {
  title: 'Atoms/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: { type: 'select' },
      options: ['message', 'robot'],
    },
    size: {
      control: { type: 'number' },
      defaultValue: 24,
    },
    color: {
      control: 'color',
    },
    className: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof Icon>;

export const Message: Story = {
  args: {
    name: 'message',
    size: 36,
  },
};

export const Robot: Story = {
  args: {
    name: 'robot',
    size: 36,
  },
};

export const Small: Story = {
  args: {
    name: 'robot',
    size: 20,
  },
};

export const Medium: Story = {
  args: {
    name: 'robot',
    size: 36,
  },
};

export const Large: Story = {
  args: {
    name: 'robot',
    size: 64,
  },
};

export const CustomColor: Story = {
  args: {
    name: 'message',
    size: 36,
    color: '#00FF00',
  },
};

export const Disabled: Story = {
  args: {
    name: 'robot',
    size: 36,
    disabled: true,
  },
}; 