'use client';

import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FormSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  fullWidth?: boolean;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      hint,
      options,
      placeholder,
      fullWidth = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || `select-${Math.random().toString(36).slice(2, 9)}`;

    return (
      <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
        {label && (
          <label htmlFor={selectId} className="form-label">
            {label}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={`form-input form-select ${error ? 'has-error' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>

        {hint && !error && (
          <span id={`${selectId}-hint`} className="form-hint">
            {hint}
          </span>
        )}

        {error && (
          <span id={`${selectId}-error`} className="form-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormSelect.displayName = 'FormSelect';
