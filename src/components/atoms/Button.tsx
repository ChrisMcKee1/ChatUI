import React from 'react';
import '../../styles/theme.css';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
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
  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-5 text-base',
    lg: 'py-3 px-8 text-lg'
  };
  
  // Base classes with modern styling
  const baseClasses = `
    ${sizeClasses[size]}
    font-medium
    rounded-md
    transition-all
    duration-200
    shadow-sm
    focus:outline-none 
    focus:ring-2
    focus:ring-offset-2
    transform
    hover:translate-y-[-1px]
    active:translate-y-[0px]
  `;
  
  // Variant-specific classes
  const variantClasses = {
    primary: `
      bg-[var(--color-primary)]
      text-white
      focus:ring-[var(--color-primary)]
      hover:bg-[color-mix(in_srgb,var(--color-primary),#ffffff_10%)]
      hover:shadow-md
    `,
    secondary: `
      bg-[var(--color-secondary)]
      text-[color-mix(in_srgb,var(--color-background),#000000_50%)]
      focus:ring-[var(--color-secondary)]
      hover:bg-[color-mix(in_srgb,var(--color-secondary),#ffffff_15%)]
      hover:shadow-md
    `,
  };
  
  // Disabled styling
  const disabledClasses = disabled 
    ? `
      opacity-60
      cursor-not-allowed
      pointer-events-none
      bg-[var(--color-disabledBackground)]
      text-[var(--color-disabledText)]
      shadow-none
    ` 
    : '';
  
  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}; 