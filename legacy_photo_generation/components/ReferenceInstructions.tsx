'use client';

import { useTranslations } from 'next-intl';
import { Check, X } from 'lucide-react';

export function ReferenceInstructions() {
  const t = useTranslations('form.photos.referenceInstructions');

  return (
    <div className="reference-instructions">
      <div className="dos-donts-grid">
        {/* Good Example - Do */}
        <div className="dos-donts-card do-card">
          <div className="dos-donts-icon do-icon">
            <Check size={16} strokeWidth={3} />
          </div>
          <div className="dos-donts-visual">
            <div className="example-face good-example">
              <svg viewBox="0 0 48 48" className="face-icon">
                <circle cx="24" cy="20" r="12" fill="currentColor" opacity="0.3"/>
                <circle cx="24" cy="44" r="16" fill="currentColor" opacity="0.2"/>
                <circle cx="20" cy="18" r="1.5" fill="currentColor"/>
                <circle cx="28" cy="18" r="1.5" fill="currentColor"/>
                <path d="M20 24 Q24 27 28 24" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
              <div className="light-indicator">☀️</div>
            </div>
          </div>
          <span className="dos-donts-label">{t('doLabel')}</span>
        </div>

        {/* Bad Example - Don't */}
        <div className="dos-donts-card dont-card">
          <div className="dos-donts-icon dont-icon">
            <X size={16} strokeWidth={3} />
          </div>
          <div className="dos-donts-visual">
            <div className="example-face bad-example">
              <svg viewBox="0 0 48 48" className="face-icon">
                <circle cx="24" cy="20" r="12" fill="currentColor" opacity="0.3"/>
                <circle cx="24" cy="44" r="16" fill="currentColor" opacity="0.2"/>
                {/* Sunglasses */}
                <rect x="14" y="15" width="9" height="6" rx="1" fill="currentColor" opacity="0.8"/>
                <rect x="25" y="15" width="9" height="6" rx="1" fill="currentColor" opacity="0.8"/>
                <line x1="23" y1="18" x2="25" y2="18" stroke="currentColor" strokeWidth="1"/>
              </svg>
              <div className="shadow-overlay"></div>
            </div>
          </div>
          <span className="dos-donts-label">{t('dontLabel')}</span>
        </div>
      </div>
    </div>
  );
}
