'use client';

import { FormInput, FormRow, FormSelect, PhotoUpload } from '@/app/components/ui';
import { ElegantDatePicker } from '@/app/components/ElegantDatePicker';
import type { TemplateId } from '@/app/types/invitation';

interface BasicInfoFieldsProps {
  photoPreview: string | null;
  onPhotoChange: (file: File, preview: string, base64: string) => void;
  onPhotoClear: () => void;
  photoLabel: string;
  photoHint: string;
  
  partner1: string;
  onPartner1Change: (value: string) => void;
  partner1Label: string;
  partner1Placeholder: string;
  
  partner2: string;
  onPartner2Change: (value: string) => void;
  partner2Label: string;
  partner2Placeholder: string;
  
  weddingDate: string;
  onDateChange: (date: string, formatted: string) => void;
  dateLabel: string;
  datePlaceholder: string;
  minDate?: string;
  months: string[];
  weekdays: string[];
  weekdaysFull: string[];
  todayLabel: string;
  
  selectedTemplate: TemplateId;
  onTemplateChange: (value: TemplateId) => void;
  templateLabel: string;
  templateOptions: Array<{ value: TemplateId; label: string }>;
}

export function BasicInfoFields({
  photoPreview,
  onPhotoChange,
  onPhotoClear,
  photoLabel,
  photoHint,
  partner1,
  onPartner1Change,
  partner1Label,
  partner1Placeholder,
  partner2,
  onPartner2Change,
  partner2Label,
  partner2Placeholder,
  weddingDate,
  onDateChange,
  dateLabel,
  datePlaceholder,
  minDate,
  months,
  weekdays,
  weekdaysFull,
  todayLabel,
  selectedTemplate,
  onTemplateChange,
  templateLabel,
  templateOptions,
}: BasicInfoFieldsProps) {
  return (
    <>
      {/* Photo Upload */}
      <PhotoUpload
        value={photoPreview}
        onChange={onPhotoChange}
        onClear={onPhotoClear}
        label={photoLabel}
        hint={photoHint}
      />

      {/* Names */}
      <FormRow columns={2}>
        <FormInput
          label={partner1Label}
          value={partner1}
          onChange={(e) => onPartner1Change(e.target.value)}
          placeholder={partner1Placeholder}
        />
        <FormInput
          label={partner2Label}
          value={partner2}
          onChange={(e) => onPartner2Change(e.target.value)}
          placeholder={partner2Placeholder}
        />
      </FormRow>

      {/* Date */}
      <div className="form-group">
        <label className="form-label">{dateLabel}</label>
        <ElegantDatePicker
          value={weddingDate}
          onChange={onDateChange}
          minDate={minDate || new Date().toISOString().split('T')[0]}
          placeholder={datePlaceholder}
          months={months}
          weekdays={weekdays}
          weekdaysFull={weekdaysFull}
          todayLabel={todayLabel}
        />
      </div>

      {/* Template Selection */}
      <FormSelect
        label={templateLabel}
        value={selectedTemplate}
        onChange={(e) => onTemplateChange(e.target.value as TemplateId)}
        options={templateOptions}
      />
    </>
  );
}
