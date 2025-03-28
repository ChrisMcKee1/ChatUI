import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // Add any custom props here, e.g., label, error message
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
  const baseStyles =
    'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';

  // Automatically generate id if not provided, for label association
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`${baseStyles} ${className || ''}`}
        {...props}
      />
      {/* Potential placeholder for error messages */}
    </div>
  );
}; 