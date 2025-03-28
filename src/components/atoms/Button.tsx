import React from 'react';
import { Button as MuiButton, ButtonProps as MuiButtonProps } from '@mui/material';
import '../../styles/theme.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outlined';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  onClick,
  disabled = false,
  size = 'md'
}) => {
  // Map our variant to MUI variants
  let muiVariant: MuiButtonProps['variant'] = 'contained';
  let muiColor: MuiButtonProps['color'] = 'secondary';
  
  if (variant === 'outlined') {
    muiVariant = 'outlined';
    muiColor = 'secondary';
  } else if (variant === 'primary') {
    muiVariant = 'contained';
    muiColor = 'primary';
  }
  
  // Map our sizes to MUI sizes
  const muiSize = size === 'sm' ? 'small' : size === 'lg' ? 'large' : 'medium';
  
  return (
    <MuiButton
      variant={muiVariant}
      color={muiColor}
      size={muiSize}
      className={className}
      onClick={onClick}
      disabled={disabled}
      sx={{
        borderRadius: '6px',
        textTransform: 'none',
        boxShadow: variant === 'outlined' ? 0 : 2,
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: variant === 'outlined' ? 1 : 3,
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