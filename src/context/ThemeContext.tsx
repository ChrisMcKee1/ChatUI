import React, { createContext, useContext, useState, useEffect } from 'react';
import darkThemeVSCode from '../../Monokai Pro Dark theme.json';
import lightThemeVSCode from '../../Monokai Pro Light theme.json';

// Default fallback colors if the theme import fails
const DEFAULT_THEME = {
  colors: {
    primary: '#ff6188',
    secondary: '#78dce8',
    success: '#a9dc76',
    info: '#78dce8',
    warning: '#ffd866',
    danger: '#fc9867',
    background: '#2d2a2e',
    surfaceBackground: '#221f22',
    surfaceForeground: '#fcfcfa',
    textPrimary: '#fcfcfa',
    textSecondary: '#939293',
    borderColor: '#727072',
    disabledBackground: '#403e41',
    disabledText: '#727072',
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    fontSize: '16px',
    fontWeight: {
      normal: '400',
      bold: '600'
    }
  }
};

// Create a simplified theme that maps VS Code theme colors to our application's needs
type SimplifiedTheme = typeof DEFAULT_THEME;

// Map VS Code theme to our simplified theme
const mapVSCodeThemeToSimplified = (vsCodeTheme: typeof darkThemeVSCode): SimplifiedTheme => {
  try {
    const colors = vsCodeTheme.colors || {};
    
    return {
      colors: {
        primary: colors["badge.background"] || DEFAULT_THEME.colors.primary,
        secondary: colors["editorBracketHighlight.foreground5"] || DEFAULT_THEME.colors.secondary,
        success: colors["editorGutter.addedBackground"] || DEFAULT_THEME.colors.success,
        info: colors["editorGutter.modifiedBackground"] || DEFAULT_THEME.colors.info,
        warning: colors["editorWarning.foreground"] || DEFAULT_THEME.colors.warning,
        danger: colors["editorError.foreground"] || DEFAULT_THEME.colors.danger,
        background: colors["editor.background"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.background : '#fafafa'),
        surfaceBackground: colors["sideBar.background"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.surfaceBackground : '#ffffff'),
        surfaceForeground: colors["foreground"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.surfaceForeground : '#2c292d'),
        textPrimary: colors["foreground"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.textPrimary : '#2c292d'),
        textSecondary: colors["descriptionForeground"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.textSecondary : '#727072'),
        borderColor: colors["activityBar.border"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.borderColor : '#cccccc'),
        disabledBackground: colors["editorWidget.background"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.disabledBackground : '#e6e6e6'),
        disabledText: colors["editorWhitespace.foreground"] || (vsCodeTheme.type === 'dark' ? DEFAULT_THEME.colors.disabledText : '#a0a0a0'),
      },
      typography: DEFAULT_THEME.typography
    };
  } catch (error) {
    console.error('Error mapping VS Code theme:', error);
    return DEFAULT_THEME;
  }
};

// Safely create the dark and light themes
let darkTheme: SimplifiedTheme;
let lightTheme: SimplifiedTheme;

try {
  darkTheme = mapVSCodeThemeToSimplified(darkThemeVSCode);
  lightTheme = mapVSCodeThemeToSimplified(lightThemeVSCode);
} catch (error) {
  console.error('Error creating themes:', error);
  darkTheme = DEFAULT_THEME;
  lightTheme = { 
    ...DEFAULT_THEME,
    colors: {
      ...DEFAULT_THEME.colors,
      background: '#fafafa',
      surfaceBackground: '#ffffff',
      surfaceForeground: '#2c292d',
      textPrimary: '#2c292d',
      textSecondary: '#727072',
      borderColor: '#cccccc',
      disabledBackground: '#e6e6e6',
      disabledText: '#a0a0a0',
    }
  };
}

// Create theme context type
type ThemeContextType = {
  theme: SimplifiedTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [theme, setTheme] = useState<SimplifiedTheme>(darkTheme);

  // Toggle between dark and light modes
  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Update theme when isDarkMode changes
  useEffect(() => {
    setTheme(isDarkMode ? darkTheme : lightTheme);
    
    try {
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
    } catch (error) {
      console.error('Error applying theme:', error);
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