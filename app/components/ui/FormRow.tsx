'use client';

import type { ReactNode } from 'react';

export interface FormRowProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const gapClasses = {
  sm: 'form-row-gap-sm',
  md: 'form-row-gap-md',
  lg: 'form-row-gap-lg',
};

export function FormRow({ children, columns = 2, gap = 'md', className = '' }: FormRowProps) {
  const classes = ['form-row', `form-row-cols-${columns}`, gapClasses[gap], className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
}
