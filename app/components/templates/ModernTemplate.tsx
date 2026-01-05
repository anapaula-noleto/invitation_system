'use client';

import type { InvitationConfig } from '@/app/types/invitation';
import { useInvitationTranslations } from '@/app/context/InvitationTranslationsContext';
import { VenueMap } from './VenueMap';
import './invitation.css';

interface ModernTemplateProps {
  config: InvitationConfig;
}

/**
 * Modern Template - Bold & Contemporary
 * 
 * A striking wedding landing page featuring:
 * - Bold sans-serif typography with dramatic sizing
 * - Dark, sophisticated color palette
 * - Asymmetric layouts and gradient effects
 * - Full-bleed photography
 * - Dynamic hover interactions
 */
export function ModernTemplate({ config }: ModernTemplateProps) {
  const { content, theme } = config;
  const t = useInvitationTranslations();

  // Convert hex to RGB for CSS variables
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '201, 169, 97';
  };

  const accentRgb = hexToRgb(theme.primaryColor);
  const bgRgb = hexToRgb(theme.backgroundColor);
  const textRgb = hexToRgb(theme.textColor);

  return (
    <div 
      className="invitation-scope"
      style={{
        '--inv-accent': theme.primaryColor,
        '--inv-accent-rgb': accentRgb,
        '--inv-secondary': theme.secondaryColor,
        '--inv-bg': theme.backgroundColor,
        '--inv-bg-rgb': bgRgb,
        '--inv-text': theme.textColor,
        '--inv-text-rgb': textRgb,
        '--inv-text-muted': `rgba(${textRgb}, 0.6)`,
      } as React.CSSProperties}
    >
      <div className="inv-modern">
        {/* Hero Section - Split Layout */}
        <section className="inv-modern-hero">
          {/* Image Side */}
          <div className="inv-modern-hero-image">
            {content.photoUrls[0] ? (
              <img
                src={content.photoUrls[0]}
                alt={`${content.partner1Name} & ${content.partner2Name}`}
              />
            ) : (
              <div className="inv-photo-placeholder" style={{ height: '100%' }}>
                Main Photo
              </div>
            )}
          </div>

          {/* Content Side */}
          <div className="inv-modern-hero-content">
            {/* Intro Badge - Custom Greeting or Default */}
            <span className="inv-modern-intro inv-animate-fade-in">
              {content.customGreeting || t.invitationBadge}
            </span>

            {/* Names */}
            <div className="inv-modern-names">
              <span className="inv-modern-name inv-animate-fade-in inv-animate-delay-1">
                {content.partner1Name}
              </span>
              <span className="inv-modern-ampersand inv-animate-fade-in inv-animate-delay-2">
                &
              </span>
              <span className="inv-modern-name inv-animate-fade-in inv-animate-delay-2">
                {content.partner2Name}
              </span>
            </div>

            {/* Details */}
            <div className="inv-modern-details inv-animate-fade-in inv-animate-delay-3">
              <div className="inv-modern-detail">
                <span className="inv-modern-detail-icon">📅</span>
                <div className="inv-modern-detail-text">
                  <strong>{t.saveDate}</strong>
                  {content.weddingDate}
                </div>
              </div>

              <div className="inv-modern-detail">
                <span className="inv-modern-detail-icon">📍</span>
                <div className="inv-modern-detail-text">
                  <strong>{t.location}</strong>
                  {content.venue}
                </div>
              </div>

              {content.receptionVenue && (
                <div className="inv-modern-detail">
                  <span className="inv-modern-detail-icon">🍾</span>
                  <div className="inv-modern-detail-text">
                    <strong>{t.receptionVenue}</strong>
                    {content.receptionVenue}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Our Story Section - Only shows if customStory exists */}
        {content.customStory && (
          <section className="inv-modern-story">
            <h2 className="inv-modern-story-title">{t.ourStory}</h2>
            <p className="inv-modern-story-text">{content.customStory}</p>
          </section>
        )}

        {/* Gallery Section */}
        <section className="inv-modern-gallery">
          <h2 className="inv-modern-gallery-title">{content.customStory ? '' : t.ourStory}</h2>
          <div className="inv-modern-gallery-grid">
            {content.photoUrls.map((url, index) => (
              <div key={index} className="inv-modern-photo">
                {url ? (
                  <img
                    src={url}
                    alt={`Photo ${index + 1}`}
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

        {/* Venue Map */}
        <VenueMap venue={content.venue} />

        {/* Footer */}
        <footer className="inv-modern-footer">
          <p className="inv-modern-footer-text">
            {content.customClosing || t.footerText}
          </p>
        </footer>
      </div>
    </div>
  );
}
