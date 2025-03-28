import React, { createContext, useContext, useState, useEffect } from 'react';
import darkTheme from '../../Monokai Pro Dark theme.json';
import lightTheme from '../../Monokai Pro Light theme.json';

// Define theme type based on our theme files
type Theme = typeof darkTheme;

type ThemeContextType = {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState<Theme>(darkTheme);

  // Toggle between dark and light modes
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Update theme when isDarkMode changes
  useEffect(() => {
    setTheme(isDarkMode ? darkTheme : lightTheme);
    
    // Apply theme colors to CSS variables
    Object.entries(theme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--color-${key}`, value);
    });

    // Apply other theme properties
    document.documentElement.style.setProperty('--font-family', theme.typography.fontFamily);
    document.documentElement.style.setProperty('--font-size', theme.typography.fontSize);
    
    // Add dark mode class to body
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode, theme]);

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 