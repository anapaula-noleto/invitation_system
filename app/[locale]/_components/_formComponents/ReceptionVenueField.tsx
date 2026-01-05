'use client';

import { PlacesAutocomplete } from '@/app/components/ui';
import { FormCheckbox } from './FormCheckbox';

interface ReceptionVenueFieldProps {
  checkboxLabel: string;
  isChecked: boolean;
  onCheckChange: (checked: boolean) => void;
  venueLabel: string;
  venueValue: string;
  onVenueChange: (value: string) => void;
  venuePlaceholder: string;
}

export function ReceptionVenueField({
  checkboxLabel,
  isChecked,
  onCheckChange,
  venueLabel,
  venueValue,
  onVenueChange,
  venuePlaceholder,
}: ReceptionVenueFieldProps) {
  return (
    <>
      <FormCheckbox
        checked={isChecked}
        onChange={onCheckChange}
        label={checkboxLabel}
      />

      {/* Reception Venue Input - Only shows if checkbox is checked */}
      {isChecked && (
        <PlacesAutocomplete
          label={venueLabel}
          value={venueValue}
          onChange={onVenueChange}
          placeholder={venuePlaceholder}
        />
      )}
    </>
  );
}
