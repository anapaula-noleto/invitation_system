'use client';

import { useState } from 'react';
import { generateInvitationText, type TextType } from '@/app/actions/generate-text';

interface AITextFieldProps {
  textType: TextType;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  generateLabel: string;
  generatingLabel: string;
  clearLabel: string;
  names: { partner1: string; partner2: string };
  locale: string;
}

export function AITextField({
  textType,
  value,
  onChange,
  label,
  placeholder,
  generateLabel,
  generatingLabel,
  clearLabel,
  names,
  locale,
}: AITextFieldProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateInvitationText(textType, names, locale);

      if (result.success && result.text) {
        onChange(result.text);
      } else {
        setError(result.error || 'Failed to generate text');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClear = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="ai-text-field">
      <div className="ai-text-field-header">
        <label className="form-label">{label}</label>
        <div className="ai-text-field-actions">
          {value && (
            <button
              type="button"
              className="ai-text-clear-btn"
              onClick={handleClear}
              aria-label={clearLabel}
            >
              {clearLabel}
            </button>
          )}
          <button
            type="button"
            className="ai-text-generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating || !names.partner1 || !names.partner2}
          >
            {isGenerating ? (
              <>
                <span className="ai-text-spinner" />
                {generatingLabel}
              </>
            ) : (
              <>
                <span className="ai-text-icon">✨</span>
                {generateLabel}
              </>
            )}
          </button>
        </div>
      </div>
      
      <textarea
        className={`form-input ai-text-textarea ${value ? 'has-value' : ''}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
      
      {error && (
        <p className="ai-text-error">{error}</p>
      )}
    </div>
  );
}
