'use client';

import { useMemo, useState } from 'react';

interface VenueMapProps {
  venue: string;
  className?: string;
}

/**
 * VenueMap - Displays a Google Maps embed for the wedding venue
 * 
 * - If Google Maps Embed API is properly configured, shows an interactive map
 * - If not configured or API key is missing, shows an elegant fallback with a direct link
 * - Falls back gracefully if the venue is not provided
 */
export function VenueMap({ venue, className = '' }: VenueMapProps) {
  const [mapError, setMapError] = useState(false);
  
  const encodedVenue = useMemo(() => {
    return encodeURIComponent(venue);
  }, [venue]);

  const hasApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!venue) {
    return null;
  }

  // Show fallback if no API key or map failed to load
  if (!hasApiKey || mapError) {
    return (
      <div className={`inv-map-section ${className}`}>
        <div className="inv-map-fallback">
          <div className="inv-map-fallback-icon">📍</div>
          <h3 className="inv-map-fallback-title">Our Wedding Location</h3>
          <p className="inv-map-fallback-venue">{venue}</p>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodedVenue}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inv-map-link"
          >
            <span className="inv-map-link-icon">📍</span>
            <span className="inv-map-link-text">Open in Google Maps</span>
            <span className="inv-map-link-arrow">→</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className={`inv-map-section ${className}`}>
      <div className="inv-map-container">
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=${hasApiKey}&q=${encodedVenue}&zoom=15`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Location: ${venue}`}
          onError={() => setMapError(true)}
        />
      </div>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodedVenue}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inv-map-link"
      >
        <span className="inv-map-link-icon">📍</span>
        <span className="inv-map-link-text">{venue}</span>
        <span className="inv-map-link-arrow">→</span>
      </a>
    </div>
  );
}
