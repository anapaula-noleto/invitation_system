'use client';

import type { InvitationConfig } from '@/app/types/invitation';
import './invitation.css';

interface ClassicTemplateProps {
  config: InvitationConfig;
}

/**
 * Classic Template - Timeless Elegance
 * 
 * A sophisticated wedding landing page featuring:
 * - Elegant serif typography with refined spacing
 * - Decorative ornaments and frames
 * - Warm, cream-toned color palette
 * - Professional photo gallery
 * - Subtle animations on scroll
 */
export function ClassicTemplate({ config }: ClassicTemplateProps) {
  const { content, theme } = config;

  // Convert hex to RGB for CSS variables
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '201, 169, 97';
  };

  const accentRgb = hexToRgb(theme.primaryColor);

  return (
    <div 
      className="invitation-scope"
      style={{
        '--inv-accent': theme.primaryColor,
        '--inv-accent-rgb': accentRgb,
        '--inv-text': theme.secondaryColor,
        '--inv-text-muted': `${theme.secondaryColor}99`,
      } as React.CSSProperties}
    >
      <div className="inv-classic">
        {/* Hero Section */}
        <header className="inv-classic-header">
          {/* Decorative Frame */}
          <div className="inv-classic-frame" />

          {/* Ornament */}
          <div className="inv-ornament inv-animate-fade-in">
            ❧ ❧ ❧
          </div>

          {/* Introduction */}
          <p className="inv-intro inv-animate-fade-in inv-animate-delay-1">
            Together with their families
          </p>

          {/* Names */}
          <div className="inv-names">
            <h1 className="inv-name inv-animate-fade-in inv-animate-delay-2">
              {content.partner1Name}
            </h1>
            <span className="inv-ampersand inv-animate-fade-in inv-animate-delay-3">
              &
            </span>
            <h1 className="inv-name inv-animate-fade-in inv-animate-delay-3">
              {content.partner2Name}
            </h1>
          </div>

          {/* Divider */}
          <div className="inv-divider inv-animate-fade-in inv-animate-delay-4">
            <div className="inv-divider-line" />
            <span className="inv-divider-icon">✦</span>
            <div className="inv-divider-line" />
          </div>

          {/* Date and Venue */}
          <div className="inv-details inv-animate-fade-in inv-animate-delay-5">
            <p className="inv-date">{content.weddingDate}</p>
            <p className="inv-venue">{content.venue}</p>
          </div>

          {/* Bottom Ornament */}
          <div 
            className="inv-ornament inv-animate-fade-in inv-animate-delay-5" 
            style={{ marginTop: 'var(--inv-space-12)' }}
          >
            ✦
          </div>
        </header>

        {/* Photo Gallery Section */}
        <section className="inv-gallery">
          <div className="inv-gallery-grid">
            {content.photoUrls.map((url, index) => (
              <div key={index} className="inv-photo">
                {url ? (
                  <img
                    src={url}
                    alt={`${content.partner1Name} & ${content.partner2Name} - Photo ${index + 1}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="inv-photo-placeholder">
                    Photo {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="inv-footer">
          <div className="inv-ornament" style={{ fontSize: '1.5rem', marginBottom: 'var(--inv-space-6)' }}>
            ❧
          </div>
          <p className="inv-footer-text">
            We look forward to celebrating with you
          </p>
        </footer>
      </div>
    </div>
  );
}
