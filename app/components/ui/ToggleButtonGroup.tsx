'use client';

import type { ReactNode } from 'react';

export interface ToggleButtonGroupProps<T extends string> {
  options: Array<{
    value: T;
    label: ReactNode;
    icon?: ReactNode;
  }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ToggleButtonGroup<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: ToggleButtonGroupProps<T>) {
  return (
    <div className={`toggle-group ${className}`} role="group">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`toggle-button ${value === option.value ? 'active' : ''}`}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.icon && <span className="toggle-icon" aria-hidden="true">{option.icon}</span>}
          <span className="toggle-label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
