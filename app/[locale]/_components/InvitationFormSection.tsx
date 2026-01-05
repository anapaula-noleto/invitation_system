'use client';

import { useTranslations } from 'next-intl';
import {
  Button,
  FormSelect,
  ErrorMessage,
  PaletteSelector,
  Tabs,
  TabList,
  Tab,
  TabPanel,
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
      <form onSubmit={onSubmit} className="invitation-form">
        <Tabs defaultTab="info">
          <TabList>
            <Tab id="info">{t('form.tabs.basicInfo')}</Tab>
            <Tab id="photos">{t('form.tabs.photos')}</Tab>
            <Tab id="customization">{t('form.tabs.customization')}</Tab>
            <Tab id="texts">{t('form.tabs.texts')}</Tab>
          </TabList>

          {/* Tab 1: Informações Básicas */}
          <TabPanel id="info">
            <div className="tab-content">
              <div className="tab-header">
                <h3 className="tab-title">{t('form.tabs.basicInfoTitle')}</h3>
                <p className="tab-subtitle">{t('form.tabs.basicInfoSubtitle')}</p>
              </div>
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

              <VenueField
                label={t('form.venue.label')}
                value={venue}
                onChange={onVenueChange}
                placeholder={t('form.venue.placeholder')}
              />

              <ReceptionVenueField
                checkboxLabel={t('form.reception.hasSeparateLocation')}
                isChecked={hasSeparateReceptionVenue}
                onCheckChange={onHasSeparateReceptionVenueChange}
                venueLabel={t('form.reception.label')}
                venueValue={receptionVenue}
                onVenueChange={onReceptionVenueChange}
                venuePlaceholder={t('form.reception.placeholder')}
              />
            </div>
          </TabPanel>

          {/* Tab 2: Fotos do Casal */}
          <TabPanel id="photos">
            <div className="tab-content">
              <div className="tab-header">
                <h3 className="tab-title">{t('form.tabs.photosTitle')}</h3>
                <p className="tab-subtitle">{t('form.tabs.photosSubtitle')}</p>
              </div>
              <PhotosSection
                photos={photos}
                onPhotosChange={onPhotosChange}
                hint={t('form.photo.hint')}
                addPhotoLabel={t('form.photo.addPhoto')}
              />
            </div>
          </TabPanel>

          {/* Tab 3: Personalização (Paleta de Cores) */}
          <TabPanel id="customization">
            <div className="tab-content">
              <div className="tab-header">
                <h3 className="tab-title">{t('form.tabs.customizationTitle')}</h3>
                <p className="tab-subtitle">{t('form.tabs.customizationSubtitle')}</p>
              </div>
              <div className="form-group">
                <label className="form-label">{t('form.palette.label')}</label>
                <PaletteSelector
                  value={selectedPalette.id}
                  onSelect={onPaletteSelect}
                />
              </div>
            </div>
          </TabPanel>

          {/* Tab 4: Textos Personalizados */}
          <TabPanel id="texts">
            <div className="tab-content">
              <div className="tab-header">
                <h3 className="tab-title">{t('form.tabs.textsTitle')}</h3>
                <p className="tab-subtitle">{t('form.tabs.textsSubtitle')}</p>
              </div>
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
                locale={locale}
              />
            </div>
          </TabPanel>
        </Tabs>

        {/* Error Message */}
        <ErrorMessage message={error} />

        {/* Generate Button */}
        {/* <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          leftIcon={!isLoading ? '✨' : undefined}
          className="generate-button"
        >
          {isLoading ? t('form.submit.loading') : t('form.submit.default')}
        </Button> */}
      </form>
    </section>
  );
}
