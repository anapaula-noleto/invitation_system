'use client';

import { useTranslations } from 'next-intl';
import {
  Button,
  FormSelect,
  ErrorMessage,
  PaletteSelector,
  Icon,
  Sparkles,
} from '@/app/components/ui';
import type { PhotoItem } from '@/app/components/ui';
import { AVAILABLE_TEMPLATES } from '@/app/data/mock-invitations';
import type { WeddingPalette } from '@/app/constants/weddingPalettes';
import type { TemplateId } from '@/app/types/invitation';
import {
  BasicInfoFields,
  VenueField,
  ReceptionVenueField,
  CustomTextsSection,
  PhotosSection,
} from './_formComponents';

interface InvitationFormSectionProps {
  // Form values
  photos: PhotoItem[];
  partner1: string;
  partner2: string;
  weddingDate: string;
  venue: string;
  receptionVenue: string;
  hasSeparateReceptionVenue: boolean;
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
  onPhotosChange: (photos: PhotoItem[]) => void;
  onPartner1Change: (value: string) => void;
  onPartner2Change: (value: string) => void;
  onDateChange: (date: string, formatted: string) => void;
  onVenueChange: (value: string) => void;
  onReceptionVenueChange: (value: string) => void;
  onHasSeparateReceptionVenueChange: (value: boolean) => void;
  onTemplateChange: (value: TemplateId) => void;
  onPaletteSelect: (palette: WeddingPalette) => void;
  onCustomGreetingChange: (value: string) => void;
  onCustomStoryChange: (value: string) => void;
  onCustomClosingChange: (value: string) => void;
  onVenueMapClick: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function InvitationFormSection({
  photos,
  partner1,
  partner2,
  weddingDate,
  venue,
  receptionVenue,
  hasSeparateReceptionVenue,
  selectedTemplate,
  selectedPalette,
  customGreeting,
  customStory,
  customClosing,
  locale,
  isLoading,
  error,
  onPhotosChange,
  onPartner1Change,
  onPartner2Change,
  onDateChange,
  onVenueChange,
  onReceptionVenueChange,
  onHasSeparateReceptionVenueChange,
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
        {/* Basic Information: Names, Date, Template */}
        <BasicInfoFields
          partner1={partner1}
          onPartner1Change={onPartner1Change}
          partner1Label={t('form.partner1.label')}
          partner1Placeholder={t('form.partner1.placeholder')}
          partner2={partner2}
          onPartner2Change={onPartner2Change}
          partner2Label={t('form.partner2.label')}
          partner2Placeholder={t('form.partner2.placeholder')}
          weddingDate={weddingDate}
          onDateChange={onDateChange}
          dateLabel={t('form.date.label')}
          datePlaceholder={t('form.date.placeholder')}
          minDate={new Date().toISOString().split('T')[0]}
          months={t.raw('datepicker.months') as string[]}
          weekdays={t.raw('datepicker.weekdays') as string[]}
          weekdaysFull={t.raw('datepicker.weekdaysFull') as string[]}
          todayLabel={t('datepicker.today')}
          selectedTemplate={selectedTemplate}
          onTemplateChange={onTemplateChange}
          templateLabel={t('form.template.label')}
          templateOptions={templateOptions}
        />

        {/* Ceremony Venue */}
        <VenueField
          label={t('form.venue.label')}
          value={venue}
          onChange={onVenueChange}
          placeholder={t('form.venue.placeholder')}
          viewOnMapsLabel={t('form.venue.viewOnMaps')}
          onMapClick={onVenueMapClick}
        />

        {/* Reception Venue with Checkbox Toggle */}
        <ReceptionVenueField
          checkboxLabel={t('form.reception.hasSeparateLocation')}
          isChecked={hasSeparateReceptionVenue}
          onCheckChange={onHasSeparateReceptionVenueChange}
          venueLabel={t('form.reception.label')}
          venueValue={receptionVenue}
          onVenueChange={onReceptionVenueChange}
          venuePlaceholder={t('form.reception.placeholder')}
        />

        {/* Color Palette Selection */}
        <div className="form-group">
          <label className="form-label">{t('form.palette.label')}</label>
          <PaletteSelector
            value={selectedPalette.id}
            onSelect={onPaletteSelect}
          />
        </div>

        {/* Photos Section */}
        <PhotosSection
          photos={photos}
          onPhotosChange={onPhotosChange}
          title={t('form.photos.title')}
          subtitle={t('form.photos.subtitle')}
          hint={t('form.photo.hint')}
          addPhotoLabel={t('form.photo.addPhoto')}
        />

        {/* Custom Texts with AI Enhancement */}
        <CustomTextsSection
          greeting={{
            value: customGreeting,
            onChange: onCustomGreetingChange,
            label: t('form.customTexts.greeting.label'),
            enhanceLabel: t('form.customTexts.greeting.enhance'),
            enhancingLabel: t('form.customTexts.enhancing'),
            clearLabel: t('form.customTexts.clear'),
          }}
          story={{
            value: customStory,
            onChange: onCustomStoryChange,
            label: t('form.customTexts.story.label'),
            enhanceLabel: t('form.customTexts.story.enhance'),
            enhancingLabel: t('form.customTexts.enhancing'),
            clearLabel: t('form.customTexts.clear'),
          }}
          closing={{
            value: customClosing,
            onChange: onCustomClosingChange,
            label: t('form.customTexts.closing.label'),
            enhanceLabel: t('form.customTexts.closing.enhance'),
            enhancingLabel: t('form.customTexts.enhancing'),
            clearLabel: t('form.customTexts.clear'),
          }}
          title={t('form.customTexts.title')}
          subtitle={t('form.customTexts.subtitle')}
          locale={locale}
        />

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
