import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import { useTheme } from '@/context/ThemeContext';
import '../../styles/theme.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outlined';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  onClick,
  disabled = false,
  size = 'md',
  startIcon,
  endIcon,
  fullWidth = false
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Get theme colors with fallbacks
  const primaryColor = theme?.colors?.primary || '#ff6188'; // Pink
  const secondaryColor = theme?.colors?.secondary || '#78dce8'; // Blue
  const warningColor = theme?.colors?.warning || '#ffd866'; // Yellow
  
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
  const muiSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium';
  
  // Helper function to convert hex to rgb
  function hexToRgb(hex: string) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Parse the hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    // Return as comma-separated string for rgba()
    return `${r}, ${g}, ${b}`;
  }
  
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