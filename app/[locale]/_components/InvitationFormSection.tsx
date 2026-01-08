'use client';

import { useTranslations } from 'next-intl';
import { Heart, Camera, Palette, PenLine, Wand2, Download, Image, Eye } from 'lucide-react';
import {
  Button,
  FormSelect,
  FormInput,
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
  photoStyle: string;
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
  generatedImages: string[];
  
  // Handlers
  onPhotosChange: (photos: PhotoItem[]) => void;
  onPhotoStyleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
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
  onDownload: () => void;
  onUsePhotos: () => void;
  onOpenComparison: (index: number) => void;
}

export function InvitationFormSection({
  photos,
  photoStyle,
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
  generatedImages,
  onPhotosChange,
  onPhotoStyleChange,
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
  onDownload,
  onUsePhotos,
  onOpenComparison,
}: InvitationFormSectionProps) {
  const t = useTranslations();

  // Check if at least one photo has been uploaded
  const hasPhotos = photos.some(photo => photo.file !== null);

  // Get photo style options with translations
  const photoStyleOptions = [
    { value: 'romantic', label: t('form.photo.styles.romantic') },
    { value: 'classic', label: t('form.photo.styles.classic') },
    { value: 'modern', label: t('form.photo.styles.modern') },
    { value: 'artistic', label: t('form.photo.styles.artistic') },
  ];

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
            <Tab id="info" icon={<Heart size={16} />}>{t('form.tabs.basicInfo')}</Tab>
            <Tab id="photos" icon={<Camera size={16} />}>{t('form.tabs.photos')}</Tab>
            <Tab id="customization" icon={<Palette size={16} />}>{t('form.tabs.customization')}</Tab>
            <Tab id="texts" icon={<PenLine size={16} />}>{t('form.tabs.texts')}</Tab>
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

              {/* Photo Upload Section */}
              <PhotosSection
                photos={photos}
                onPhotosChange={onPhotosChange}
                hint={t('form.photos.retouchHint')}
                addPhotoLabel={t('form.photo.addPhoto')}
              />
            </div>

              {/* Photo Style Select */}
              <div className="form-group">
                <FormSelect
                  label={t('form.photo.styleLabel')}
                  value={photoStyle}
                  onChange={onPhotoStyleChange}
                  options={photoStyleOptions}
                />
              </div>

              

            {/* Generate images Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              disabled={!hasPhotos}
              leftIcon={!isLoading ? <Wand2 size={18} /> : undefined}
              className="generate-button"
            >
              {isLoading ? t('form.submit.loading') : t('form.submit.default')}
            </Button>

            {/* Generated Images Section */}
            {generatedImages.length > 0 && (
              <div className="generated-images-section">
                <div className="generated-section-header">
                  <h4 className="generated-section-title">
                    {t('form.photos.generatedTitle')}
                  </h4>
                  <p className="generated-section-subtitle">
                    {t('form.photos.generatedSubtitle')}
                  </p>
                </div>
                <div className="generated-images-grid">
                  {generatedImages.map((imageUrl, index) => (
                    <div
                      key={index}
                      className="generated-image-wrapper"
                      onClick={() => onOpenComparison(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && onOpenComparison(index)}
                      aria-label={`${t('comparison.viewComparison')} ${index + 1}`}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`Enhanced wedding photo ${index + 1}`} 
                        className="generated-image"
                      />
                      <div className="image-overlay">
                        <Eye size={24} />
                        <span>{t('comparison.viewComparison')}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="generated-actions">
                  <Button 
                    type="button"
                    onClick={onDownload} 
                    variant="secondary" 
                    leftIcon={<Download size={16} />}
                  >
                    {t('preview.actions.download')}
                  </Button>
                  <Button 
                    type="button"
                    onClick={onUsePhotos} 
                    variant="primary" 
                    leftIcon={<Image size={16} />}
                  >
                    {t('preview.actions.usePhotos')}
                  </Button>
                </div>
              </div>
            )}
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
      </form>
    </section>
  );
}
