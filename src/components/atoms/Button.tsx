import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';
import '../../styles/theme.css';

// Add missing color constants
const DEFAULT_LIGHT_PRIMARY = '#1976d2';
const DEFAULT_DARK_PRIMARY = '#90caf9';
const DEFAULT_LIGHT_SECONDARY = '#9c27b0';
const DEFAULT_DARK_SECONDARY = '#ce93d8';
const DEFAULT_LIGHT_ERROR = '#d32f2f';
const DEFAULT_DARK_ERROR = '#f44336';
const DEFAULT_LIGHT_SUCCESS = '#2e7d32';
const DEFAULT_DARK_SUCCESS = '#66bb6a';
const DEFAULT_LIGHT_INFO = '#0288d1';
const DEFAULT_DARK_INFO = '#29b6f6';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  children,
  fullWidth = false,
  onClick,
  startIcon,
  endIcon,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
}) => {
  const { isDarkMode } = useTheme();
  const primaryColor = isDarkMode ? DEFAULT_DARK_PRIMARY : DEFAULT_LIGHT_PRIMARY;
  const secondaryColor = isDarkMode ? DEFAULT_DARK_SECONDARY : DEFAULT_LIGHT_SECONDARY;
  const errorColor = isDarkMode ? DEFAULT_DARK_ERROR : DEFAULT_LIGHT_ERROR;
  const successColor = isDarkMode ? DEFAULT_DARK_SUCCESS : DEFAULT_LIGHT_SUCCESS;
  const infoColor = isDarkMode ? DEFAULT_DARK_INFO : DEFAULT_LIGHT_INFO;
  
  // Map our variant to MUI variants
  let muiVariant: MuiButtonProps['variant'] = 'contained';
  let muiColor: MuiButtonProps['color'] = 'secondary';
  
  // Custom colors based on our theme
  let customBgColor = '';
  let customHoverBgColor = '';
  let customTextColor = '';
  
  if (variant === 'outlined') {
    muiVariant = 'outlined';
    muiColor = 'secondary';
  } else if (variant === 'primary') {
    customBgColor = primaryColor;
    customHoverBgColor = isDarkMode ? 'rgba(255, 97, 136, 0.8)' : 'rgba(255, 97, 136, 0.9)';
    customTextColor = 'white';
  } else if (variant === 'secondary') {
    customBgColor = secondaryColor;
    customHoverBgColor = isDarkMode ? 'rgba(120, 220, 232, 0.8)' : 'rgba(120, 220, 232, 0.9)';
    customTextColor = '#222222';
  }
  
  // Map our sizes to MUI sizes
  const muiSize = size === 'small' ? 'small' : size === 'large' ? 'large' : 'medium';
  
  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      size={muiSize}
      className={className}
      onClick={onClick}
      disabled={disabled}
      startIcon={startIcon}
      endIcon={endIcon}
      fullWidth={fullWidth}
      sx={{
        borderRadius: '6px',
        textTransform: 'none',
        boxShadow: variant === 'outlined' ? 0 : 2,
        backgroundColor: customBgColor || undefined,
        color: customTextColor || undefined,
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: variant === 'outlined' ? 1 : 3,
          backgroundColor: customHoverBgColor || undefined,
        },
        '&:active': {
          transform: 'translateY(0px)',
        }
      }}
    >
      {children}
    </MuiButton>
  );
};

export default Button; 