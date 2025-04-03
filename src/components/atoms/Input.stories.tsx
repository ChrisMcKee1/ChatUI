import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { useState } from 'react';

const meta = {
  title: 'Atoms/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input component with custom theming support. Displays a text input field with optional label and error message. Supports various input types and sizes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Optional label text displayed above the input',
    },
    id: {
      control: 'text',
      description: 'HTML ID attribute (auto-generated from label if not provided)',
    },
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    type: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'search', 'tel', 'url'],
      description: 'HTML input type attribute',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Input field size - small, medium, or large',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text displayed when the input is empty',
    },
    value: {
      control: 'text',
      description: 'Current input value (controlled component)',
    },
    onChange: { 
      action: 'changed',
      description: 'Function called when input value changes',
    },
    onKeyDown: {
      action: 'key pressed',
      description: 'Function called on keydown events',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input field',
    },
    error: {
      control: 'text',
      description: 'Error message displayed below the input (shows red border when present)',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

// Basic examples
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic input field without a label',
      },
    },
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Your Name',
    placeholder: 'John Doe',
    id: 'name-input',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input field with an associated label',
      },
    },
  },
};

// Size variations
export const Small: Story = {
  args: {
    label: 'Small Input',
    placeholder: 'Small size input',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Input',
    placeholder: 'Medium size input',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Input',
    placeholder: 'Large size input',
    size: 'lg',
  },
};

// State variations
export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter your email',
    value: 'invalid-email',
    error: 'Please enter a valid email address',
  },
  parameters: {
    docs: {
      description: {
        story: 'Input with an error message and red border indicating validation failure',
      },
    },
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'This input is disabled',
    disabled: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Disabled input that cannot be interacted with',
      },
    },
  },
};

// Input type variations
export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: '********',
  },
};

export const Email: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
  },
};

export const Number: Story = {
  args: {
    label: 'Quantity',
    type: 'number',
    placeholder: '0',
  },
};

// Interactive example
export const Interactive: Story = {
  render: () => {
    // @ts-ignore - useState is not recognized in static Story type
    const [value, setValue] = useState('');
    // @ts-ignore - useState is not recognized in static Story type
    const [error, setError] = useState('');
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      
      // Simple validation example
      if (newValue.length > 0 && newValue.length < 3) {
        setError('Input must be at least 3 characters');
      } else {
        setError('');
      }
    };
    
    return (
      <div style={{ width: '300px' }}>
        <Input
          label="Interactive Input"
          placeholder="Type to see validation"
          value={value}
          onChange={handleChange}
          error={error}
        />
        <div style={{ marginTop: '8px', fontSize: '14px' }}>
          Current value: {value || '<empty>'}
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example showing live validation as you type',
      },
    },
  },
};

// Theme integration
export const ThemeIntegration: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '300px' }}>
      <Input label="Default Input" placeholder="Regular input" />
      <Input label="With Error" placeholder="Error state" error="Something went wrong" />
      <Input label="Disabled Input" placeholder="Disabled state" disabled />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how inputs adapt to the current theme',
      },
    },
  },
}; 