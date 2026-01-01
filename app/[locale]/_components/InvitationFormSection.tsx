'use client';

import { useTranslations } from 'next-intl';
import { ElegantDatePicker } from '@/app/components/ElegantDatePicker';
import {
  Button,
  FormInput,
  FormSelect,
  PhotoUpload,
  IconButton,
  ErrorMessage,
  FormRow,
  PaletteSelector,
  AITextField,
} from '@/app/components/ui';
import { AVAILABLE_TEMPLATES } from '@/app/data/mock-invitations';
import type { WeddingPalette } from '@/app/constants/weddingPalettes';
import type { TemplateId } from '@/app/types/invitation';

interface InvitationFormSectionProps {
  // Form values
  photoPreview: string | null;
  partner1: string;
  partner2: string;
  weddingDate: string;
  venue: string;
  selectedTemplate: TemplateId;
  selectedPalette: WeddingPalette;
  customGreeting: string;
  customStory: string;
  customClosing: string;
  locale: string;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  
  // Handlers
  onPhotoChange: (file: File, preview: string, base64: string) => void;
  onPhotoClear: () => void;
  onPartner1Change: (value: string) => void;
  onPartner2Change: (value: string) => void;
  onDateChange: (date: string, formatted: string) => void;
  onVenueChange: (value: string) => void;
  onTemplateChange: (value: TemplateId) => void;
  onPaletteSelect: (palette: WeddingPalette) => void;
  onCustomGreetingChange: (value: string) => void;
  onCustomStoryChange: (value: string) => void;
  onCustomClosingChange: (value: string) => void;
  onVenueMapClick: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function InvitationFormSection({
  photoPreview,
  partner1,
  partner2,
  weddingDate,
  venue,
  selectedTemplate,
  selectedPalette,
  customGreeting,
  customStory,
  customClosing,
  locale,
  isLoading,
  error,
  onPhotoChange,
  onPhotoClear,
  onPartner1Change,
  onPartner2Change,
  onDateChange,
  onVenueChange,
  onTemplateChange,
  onPaletteSelect,
  onCustomGreetingChange,
  onCustomStoryChange,
  onCustomClosingChange,
  onVenueMapClick,
  onSubmit,
}: InvitationFormSectionProps) {
  const t = useTranslations();

  // Get template options with translations
  const templateOptions = AVAILABLE_TEMPLATES
    .filter(tmpl => tmpl.id === 'classic' || tmpl.id === 'modern')
    .map((tmpl) => ({
      value: tmpl.id,
      label: `${t(`templates.${tmpl.id}.name`)} — ${t(`templates.${tmpl.id}.description`)}`,
    }));

  return (
    <section className="form-section">
      <h2 className="form-section-title">{t('form.title')}</h2>
      <form onSubmit={onSubmit} className="invitation-form">
        {/* Photo Upload */}
        <PhotoUpload
          value={photoPreview}
          onChange={onPhotoChange}
          onClear={onPhotoClear}
          label={t('form.photo.label')}
          hint={t('form.photo.hint')}
        />

        {/* Names */}
        <FormRow columns={2}>
          <FormInput
            label={t('form.partner1.label')}
            value={partner1}
            onChange={(e) => onPartner1Change(e.target.value)}
            placeholder={t('form.partner1.placeholder')}
          />
          <FormInput
            label={t('form.partner2.label')}
            value={partner2}
            onChange={(e) => onPartner2Change(e.target.value)}
            placeholder={t('form.partner2.placeholder')}
          />
        </FormRow>

        {/* Date */}
        <div className="form-group">
          <label className="form-label">{t('form.date.label')}</label>
          <ElegantDatePicker
            value={weddingDate}
            onChange={onDateChange}
            minDate={new Date().toISOString().split('T')[0]}
            placeholder={t('form.date.placeholder')}
            months={t.raw('datepicker.months') as string[]}
            weekdays={t.raw('datepicker.weekdays') as string[]}
            weekdaysFull={t.raw('datepicker.weekdaysFull') as string[]}
            todayLabel={t('datepicker.today')}
          />
        </div>

        {/* Venue */}
        <FormInput
          label={t('form.venue.label')}
          value={venue}
          onChange={(e) => onVenueChange(e.target.value)}
          placeholder={t('form.venue.placeholder')}
          rightAddon={
            venue ? (
              <IconButton
                icon="📍"
                label={t('form.venue.viewOnMaps')}
                onClick={onVenueMapClick}
                size="sm"
                type="button"
              />
            ) : undefined
          }
        />

        {/* Template Selection */}
        <FormSelect
          label={t('form.template.label')}
          value={selectedTemplate}
          onChange={(e) => onTemplateChange(e.target.value as TemplateId)}
          options={templateOptions}
        />

        {/* Color Palette Selection */}
        <div className="form-group">
          <label className="form-label">{t('form.palette.label')}</label>
          <PaletteSelector
            value={selectedPalette.id}
            onSelect={onPaletteSelect}
          />
        </div>

        {/* AI-Generated Custom Texts */}
        <div className="ai-text-section">
          <div className="ai-text-section-header">
            <h3 className="ai-text-section-title">{t('form.customTexts.title')}</h3>
            <p className="ai-text-section-subtitle">{t('form.customTexts.subtitle')}</p>
          </div>

          <AITextField
            textType="greeting"
            value={customGreeting}
            onChange={onCustomGreetingChange}
            label={t('form.customTexts.greeting.label')}
            placeholder={t('form.customTexts.greeting.placeholder')}
            generateLabel={t('form.customTexts.greeting.generate')}
            generatingLabel={t('form.customTexts.generating')}
            clearLabel={t('form.customTexts.clear')}
            names={{ partner1, partner2 }}
            locale={locale}
          />

          <AITextField
            textType="story"
            value={customStory}
            onChange={onCustomStoryChange}
            label={t('form.customTexts.story.label')}
            placeholder={t('form.customTexts.story.placeholder')}
            generateLabel={t('form.customTexts.story.generate')}
            generatingLabel={t('form.customTexts.generating')}
            clearLabel={t('form.customTexts.clear')}
            names={{ partner1, partner2 }}
            locale={locale}
          />

          <AITextField
            textType="closing"
            value={customClosing}
            onChange={onCustomClosingChange}
            label={t('form.customTexts.closing.label')}
            placeholder={t('form.customTexts.closing.placeholder')}
            generateLabel={t('form.customTexts.closing.generate')}
            generatingLabel={t('form.customTexts.generating')}
            clearLabel={t('form.customTexts.clear')}
            names={{ partner1, partner2 }}
            locale={locale}
          />
        </div>

        {/* Error Message */}
        <ErrorMessage message={error} />

        {/* Generate Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          leftIcon={!isLoading ? '✨' : undefined}
          className="generate-button"
        >
          {isLoading ? t('form.submit.loading') : t('form.submit.default')}
        </Button>
      </form>
    </section>
  );
}
