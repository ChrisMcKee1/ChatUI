import React from 'react';
import '../../styles/theme.css';

interface InputProps {
  label?: string;
  id?: string;
  className?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  className = '',
  type = 'text',
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
}) => {
  // Automatically generate id if not provided, for label association
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="mb-4">
      {label && (
        <label 
          className={`block font-bold mb-2 label-themed ${disabled ? 'disabled' : ''}`} 
          htmlFor={inputId}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full py-2 px-3 border rounded input-themed ${className}`}
      />
    </div>
  );
}; 