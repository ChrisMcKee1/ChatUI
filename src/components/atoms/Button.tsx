import React from 'react';
import '../../styles/theme.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  className = '', 
  variant = 'primary', 
  onClick,
  disabled = false
}) => {
  const baseClasses = "py-2 px-4 rounded font-bold transition-colors duration-200";
  
  // Use themed button classes
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
  };
  
  const disabledClasses = disabled 
    ? "opacity-50 cursor-not-allowed pointer-events-none" 
    : "";
  
  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? 'var(--color-disabledBackground)' : undefined,
        color: disabled ? 'var(--color-disabledText)' : undefined,
      }}
    >
      {children}
    </button>
  );
}; 