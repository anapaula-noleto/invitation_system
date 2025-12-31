'use client';

import { useTranslations } from 'next-intl';
import { WEDDING_PALETTES, type WeddingPalette } from '@/app/constants/weddingPalettes';

interface PaletteSelectorProps {
  value?: string;
  onSelect: (palette: WeddingPalette) => void;
  className?: string;
}

/**
 * PaletteSelector - Visual color palette picker
 * 
 * Displays available wedding palettes as clickable color swatches
 * with labels. Allows users to preview and select their preferred
 * color scheme for their invitation.
 */
export function PaletteSelector({ value, onSelect, className = '' }: PaletteSelectorProps) {
  const t = useTranslations('palettes');
  
  return (
    <div className={`palette-selector ${className}`}>
      <div className="palette-grid">
        {WEDDING_PALETTES.map((palette) => {
          const label = t(palette.id);
          return (
            <button
              key={palette.id}
              type="button"
              className={`palette-item ${value === palette.id ? 'selected' : ''}`}
              onClick={() => onSelect(palette)}
              aria-pressed={value === palette.id}
              aria-label={`Select ${label} palette`}
            >
              {/* Single Color Swatch - Primary color only */}
              <div className="palette-swatch-container">
                <div
                  className="palette-swatch"
                  style={{ backgroundColor: palette.colors.primary }}
                />
              </div>

              {/* Label */}
              <span className="palette-label">{label}</span>

              {/* Selection indicator */}
              {value === palette.id && (
                <span className="palette-check" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
