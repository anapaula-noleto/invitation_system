'use client';

import type { ReactNode } from 'react';

export interface ErrorMessageProps {
  message: string | null | undefined;
  icon?: ReactNode;
}

export function ErrorMessage({ message, icon = '⚠️' }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert" aria-live="polite">
      {icon && <span className="error-icon" aria-hidden="true">{icon}</span>}
      <span className="error-text">{message}</span>
    </div>
  );
}
