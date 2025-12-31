'use client';

import { forwardRef, type InputHTMLAttributes, type ReactNode, useId } from 'react';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  fullWidth?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      hint,
      leftAddon,
      rightAddon,
      fullWidth = true,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const hasAddon = leftAddon || rightAddon;

    return (
      <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        
        {hasAddon ? (
          <div className="input-wrapper">
            {leftAddon && (
              <span className="input-addon input-addon-left">{leftAddon}</span>
            )}
            <input
              ref={ref}
              id={inputId}
              className={`form-input ${leftAddon ? 'has-left-addon' : ''} ${rightAddon ? 'has-right-addon' : ''} ${error ? 'has-error' : ''} ${className}`}
              aria-invalid={!!error}
              aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
              {...props}
            />
            {rightAddon && (
              <span className="input-addon input-addon-right">{rightAddon}</span>
            )}
          </div>
        ) : (
          <input
            ref={ref}
            id={inputId}
            className={`form-input ${error ? 'has-error' : ''} ${className}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
        )}

        {hint && !error && (
          <span id={`${inputId}-hint`} className="form-hint">
            {hint}
          </span>
        )}

        {error && (
          <span id={`${inputId}-error`} className="form-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
