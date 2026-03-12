import React, { useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = true,
}: FormFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-semibold mb-2 text-slate-100">
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`input-field ${error ? 'border-red-500' : ''}`}
          required={required}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <div className="mt-2 flex items-center text-red-400 text-sm">
          <AlertCircle size={16} className="mr-1" />
          {error}
        </div>
      )}
    </div>
  );
}
