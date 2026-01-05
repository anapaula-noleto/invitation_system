'use client';

export interface ErrorMessageProps {
  message: string | null | undefined;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="error-message" role="alert" aria-live="polite">
      <span className="error-text">{message}</span>
    </div>
  );
}
