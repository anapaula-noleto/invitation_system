'use client';

import { PlacesAutocomplete } from '@/app/components/ui';
import { MapPin } from '@/app/components/ui/Icon';

interface VenueFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function VenueField({
  label,
  value,
  onChange,
  placeholder,
}: VenueFieldProps) {
  return (
    <PlacesAutocomplete
      label={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rightAddon={
        <span className="input-icon-gold">
          <MapPin size={18} />
        </span>
      }
    />
  );
}
