import React, { useEffect } from 'react';
import type { Preview } from '@storybook/react';
import '../src/app/globals.css';
import './tailwind.css';
import '../src/styles/theme.css';
import { ThemeProvider } from '../src/components/providers/ThemeProvider';
import darkTheme from '../Monokai Pro Dark theme.json';
import lightTheme from '../Monokai Pro Light theme.json';

// Default values for fallbacks
const defaultFontFamily = 'system-ui, sans-serif';
const defaultFontSize = '16px';
const defaultDarkBackground = '#2d2a2e';
const defaultLightBackground = '#fafafa';
const defaultDarkText = '#fcfcfa';
const defaultLightText = '#2c292d';

// Initialize theme CSS variables at startup
function initializeThemeVariables() {
  try {
    // Apply initial theme colors from Monokai Pro Dark
    if (darkTheme.colors) {
      Object.entries(darkTheme.colors).forEach(([key, value]) => {
        document.documentElement.style.setProperty(`--color-${key}`, value);
      });
    }
    
    // Apply typography settings with safe fallbacks
    document.documentElement.style.setProperty('--font-family', defaultFontFamily);
    document.documentElement.style.setProperty('--font-size', defaultFontSize);
    
    // Set dark mode by default for Storybook
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } catch (error) {
    console.error('Error initializing theme variables:', error);
  }
}

// ThemeWrapper allows for controlled theme toggle in storybook
const ThemeWrapper = ({ children, mode }: { children: React.ReactNode, mode: 'dark' | 'light' }) => {
  useEffect(() => {
    try {
      const themeData = mode === 'dark' ? darkTheme : lightTheme;
      
      // Apply theme colors from Monokai Pro
      if (themeData.colors) {
        Object.entries(themeData.colors).forEach(([key, value]) => {
          document.documentElement.style.setProperty(`--color-${key}`, value);
        });
      }
      
      // Set appropriate class
      if (mode === 'dark') {
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
      } else {
        document.body.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
      }
    } catch (error) {
      console.error('Error updating theme:', error);
    }
  }, [mode]);

  return <>{children}</>;
};

// Call initialization
try {
  if (typeof window !== 'undefined') {
    initializeThemeVariables();
  }
} catch (error) {
  console.error('Failed to initialize theme:', error);
}

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
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: darkTheme.colors?.["editor.background"] || defaultDarkBackground },
        { name: 'light', value: lightTheme.colors?.["editor.background"] || defaultLightBackground },
      ],
    },
    // More accessible theme toggle that's always visible and easy to switch
    theme: {
      default: 'dark',
      selector: 'body',
      onChange: (theme) => {
        try {
          if (theme.class === 'dark') {
            if (darkTheme.colors) {
              Object.entries(darkTheme.colors).forEach(([key, value]) => {
                document.documentElement.style.setProperty(`--color-${key}`, value);
              });
            }
            document.body.classList.add('dark-mode');
            document.body.classList.remove('light-mode');
          } else {
            if (lightTheme.colors) {
              Object.entries(lightTheme.colors).forEach(([key, value]) => {
                document.documentElement.style.setProperty(`--color-${key}`, value);
              });
            }
            document.body.classList.add('light-mode');
            document.body.classList.remove('dark-mode');
          }
        } catch (error) {
          console.error('Error changing theme:', error);
        }
      },
      list: [
        { name: 'Dark', class: 'dark', color: darkTheme.colors?.["editor.background"] || defaultDarkBackground },
        { name: 'Light', class: 'light', color: lightTheme.colors?.["editor.background"] || defaultLightBackground },
      ],
    },
  },
  // This decorator ensures the theme provider is available for all stories
  decorators: [
    (Story, context) => {
      const isDarkMode = context.globals.theme?.class !== 'light';
      return (
        <ThemeWrapper mode={isDarkMode ? 'dark' : 'light'}>
          <ThemeProvider>
            <div className="p-4" style={{ 
              backgroundColor: isDarkMode 
                ? (darkTheme.colors?.["editor.background"] || defaultDarkBackground) 
                : (lightTheme.colors?.["editor.background"] || defaultLightBackground),
              color: isDarkMode 
                ? (darkTheme.colors?.["foreground"] || defaultDarkText) 
                : (lightTheme.colors?.["foreground"] || defaultLightText),
            }}>
              <Story />
            </div>
          </ThemeProvider>
        </ThemeWrapper>
      );
    },
  ],
  // Make the theme toggle tool always visible in the toolbar
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        icon: 'paintbrush',
        items: [
          { value: 'dark', icon: 'circle', title: 'Dark' },
          { value: 'light', icon: 'circlehollow', title: 'Light' },
        ],
        showName: true,
      },
    },
  },
};

export default preview; 