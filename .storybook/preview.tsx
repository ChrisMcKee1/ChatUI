import React from 'react';
import type { Preview } from '@storybook/react';
import '../src/app/globals.css';
import './tailwind.css';
import '../src/styles/theme.css';
import { ThemeProvider } from '../src/context/ThemeContext';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    layout: 'centered',
    nextjs: {
      appDirectory: true,
    },
    themes: {
      default: 'dark',
      list: [
        { name: 'dark', class: 'dark-mode', color: '#2d2a2e' },
        { name: 'light', class: 'light-mode', color: '#ffffff' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="p-4">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview; 