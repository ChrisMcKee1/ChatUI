import React from 'react';
import '../../styles/theme.css';

interface IconProps {
  // Using string content for testing instead of component references
  name: 'message' | 'robot';
  size?: number;
  className?: string;
  disabled?: boolean;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ 
  name,
  size = 24,
  className = '',
  disabled = false,
  color,
}) => {
  const icons = {
    message: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16v12H5.17L4 17.17V4zm0-2c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H4z" fill="currentColor"/>
      </svg>
    ),
    robot: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zm-2 10H6V7h12v12zm-9-6c-.83 0-1.5-.67-1.5-1.5S8.17 10 9 10s1.5.67 1.5 1.5S9.83 13 9 13zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="currentColor"/>
      </svg>
    )
  };

  const iconStyle = {
    color: disabled 
      ? 'var(--color-disabledText)' 
      : color || 'var(--color-primary)',
  };

  return (
    <span 
      className={`
        inline-flex
        items-center
        justify-center
        transition-all
        duration-200
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-110'}
        ${className}
      `}
      style={iconStyle}
    >
      {icons[name]}
    </span>
  );
}; 