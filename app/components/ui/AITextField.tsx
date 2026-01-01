'use client';

import { useState, useCallback } from 'react';
import { enhanceInvitationText } from '@/app/actions/generate-text';
import { MAX_CHARACTERS, type TextType, type ToneType } from '@/app/constants/textLimits';

interface AITextFieldProps {
  textType: TextType;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder: string;
  enhanceLabel: string;
  enhancingLabel: string;
  clearLabel: string;
  locale: string;
  tone: ToneType;
  characterCountLabel?: string;
}

export function AITextField({
  textType,
  value,
  onChange,
  label,
  placeholder,
  enhanceLabel,
  enhancingLabel,
  clearLabel,
  locale,
  tone,
}: AITextFieldProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const maxChars = MAX_CHARACTERS[textType];
  const currentLength = value.length;
  const isOverLimit = currentLength > maxChars;
  const canEnhance = value.trim().length >= 5;

  const handleEnhance = useCallback(async () => {
    if (!canEnhance) return;
    
    setIsEnhancing(true);
    setError(null);

    try {
      const result = await enhanceInvitationText(textType, value, locale, tone);

      if (result.success && result.text) {
        onChange(result.text);
      } else {
        setError(result.error || 'Failed to enhance text');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  }, [textType, value, locale, tone, onChange, canEnhance]);

  const handleClear = useCallback(() => {
    onChange('');
    setError(null);
  }, [onChange]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    // Allow typing but show warning if over limit
    onChange(newValue);
    setError(null);
  }, [onChange]);

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
            className="ai-text-enhance-btn"
            onClick={handleEnhance}
            disabled={isEnhancing || !canEnhance}
            title={!canEnhance ? 'Write at least 5 characters' : ''}
          >
            {isEnhancing ? (
              <>
                <span className="ai-text-spinner" />
                {enhancingLabel}
              </>
            ) : (
              <>
                <span className="ai-text-icon">✨</span>
                {enhanceLabel}
              </>
            )}
          </button>
        </div>
      </div>
      
      <textarea
        className={`form-input ai-text-textarea ${value ? 'has-value' : ''} ${isOverLimit ? 'has-error' : ''}`}
        value={value}
        onChange={handleTextChange}
        placeholder={placeholder}
        rows={3}
        maxLength={maxChars + 50} // Allow slight overage for editing
      />
      
      <div className="ai-text-footer">
        <span className={`ai-text-char-count ${isOverLimit ? 'over-limit' : ''}`}>
          {currentLength} / {maxChars}
        </span>
        {error && (
          <span className="ai-text-error">{error}</span>
        )}
      </div>
    </div>
  );
}
