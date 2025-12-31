'use client';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'spinner-sm',
  md: 'spinner-md',
  lg: 'spinner-lg',
};

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const classes = ['spinner', sizeClasses[size], className].filter(Boolean).join(' ');

  return <span className={classes} role="status" aria-label="Loading" />;
}
