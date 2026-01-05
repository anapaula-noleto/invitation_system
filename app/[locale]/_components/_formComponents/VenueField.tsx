'use client';

import { IconButton, PlacesAutocomplete } from '@/app/components/ui';

interface VenueFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  viewOnMapsLabel?: string;
  onMapClick?: () => void;
}

export function VenueField({
  label,
  value,
  onChange,
  placeholder,
  viewOnMapsLabel,
  onMapClick,
}: VenueFieldProps) {
  return (
    <PlacesAutocomplete
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rightAddon={
        value && onMapClick ? (
          <IconButton
            icon="📍"
            label={viewOnMapsLabel || 'View on Maps'}
            onClick={onMapClick}
            size="sm"
            type="button"
          />
        ) : undefined
      }
    />
  );
}
