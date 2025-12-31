'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'primary';
}

const sizeClasses = {
  sm: 'icon-btn-sm',
  md: 'icon-btn-md',
  lg: 'icon-btn-lg',
};

const variantClasses = {
  default: 'icon-btn-default',
  ghost: 'icon-btn-ghost',
  primary: 'icon-btn-primary',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, size = 'md', variant = 'default', className = '', ...props }, ref) => {
    const classes = ['icon-btn', sizeClasses[size], variantClasses[variant], className]
      .filter(Boolean)
      .join(' ');

    return (
      <button ref={ref} className={classes} title={label} aria-label={label} {...props}>
        {icon}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
