'use client';

import { useTranslations } from 'next-intl';
import { Heart, Camera, Palette, PenLine, Wand2, Sparkles, Edit3 } from 'lucide-react';
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
import type { GenerationMode, CoupleDetails } from '@/app/actions/generate';
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
  generationMode: GenerationMode;
  coupleDetails: CoupleDetails;
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
  onPhotoStyleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onGenerationModeChange: (mode: GenerationMode) => void;
  onCoupleDetailsChange: (field: keyof CoupleDetails, value: string) => void;
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
  photoStyle,
  generationMode,
  coupleDetails,
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
  onPhotoStyleChange,
  onGenerationModeChange,
  onCoupleDetailsChange,
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

  // Check if at least one photo has been uploaded
  const hasPhotos = photos.some(photo => photo.file !== null);

  // For generate mode, also check if couple details are filled
  const canGenerate = generationMode === 'retouch' 
    ? hasPhotos 
    : hasPhotos && coupleDetails.partner1Description && coupleDetails.partner2Description;

  // Get photo style options with translations
  const photoStyleOptions = [
    { value: 'romantic', label: t('form.photo.styles.romantic') },
    { value: 'classic', label: t('form.photo.styles.classic') },
    { value: 'modern', label: t('form.photo.styles.modern') },
    { value: 'artistic', label: t('form.photo.styles.artistic') },
  ];

  // Outfit style options
  const outfitStyleOptions = [
    { value: 'formal', label: t('form.photo.coupleDetails.outfitStyle.options.formal') },
    { value: 'casual', label: t('form.photo.coupleDetails.outfitStyle.options.casual') },
    { value: 'traditional', label: t('form.photo.coupleDetails.outfitStyle.options.traditional') },
    { value: 'bohemian', label: t('form.photo.coupleDetails.outfitStyle.options.bohemian') },
  ];

  // Setting options
  const settingOptions = [
    { value: 'beach_sunset', label: t('form.photo.coupleDetails.setting.options.beach_sunset') },
    { value: 'garden', label: t('form.photo.coupleDetails.setting.options.garden') },
    { value: 'forest', label: t('form.photo.coupleDetails.setting.options.forest') },
    { value: 'city', label: t('form.photo.coupleDetails.setting.options.city') },
    { value: 'vineyard', label: t('form.photo.coupleDetails.setting.options.vineyard') },
    { value: 'mountain', label: t('form.photo.coupleDetails.setting.options.mountain') },
    { value: 'castle', label: t('form.photo.coupleDetails.setting.options.castle') },
    { value: 'studio', label: t('form.photo.coupleDetails.setting.options.studio') },
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

              {/* Generation Mode Toggle */}
              <div className="form-group">
                <label className="form-label">{t('form.photo.generationMode.label')}</label>
                <div className="generation-mode-toggle">
                  <button
                    type="button"
                    className={`mode-option ${generationMode === 'retouch' ? 'active' : ''}`}
                    onClick={() => onGenerationModeChange('retouch')}
                  >
                    <Edit3 size={18} />
                    <span>{t('form.photo.generationMode.retouch')}</span>
                  </button>
                  <button
                    type="button"
                    className={`mode-option ${generationMode === 'generate' ? 'active' : ''}`}
                    onClick={() => onGenerationModeChange('generate')}
                  >
                    <Sparkles size={18} />
                    <span>{t('form.photo.generationMode.generate')}</span>
                  </button>
                </div>
              </div>

              <PhotosSection
                photos={photos}
                onPhotosChange={onPhotosChange}
                hint={t('form.photo.hint')}
                addPhotoLabel={t('form.photo.addPhoto')}
              />

              {/* Couple Details (only for generate mode) */}
              {generationMode === 'generate' && (
                <div className="couple-details-section">
                  <div className="section-header">
                    <h4 className="section-title">{t('form.photo.coupleDetails.title')}</h4>
                    <p className="section-subtitle">{t('form.photo.coupleDetails.subtitle')}</p>
                  </div>

                  <div className="form-group">
                    <FormInput
                      label={t('form.photo.coupleDetails.partner1Description.label')}
                      value={coupleDetails.partner1Description}
                      onChange={(e) => onCoupleDetailsChange('partner1Description', e.target.value)}
                      placeholder={t('form.photo.coupleDetails.partner1Description.placeholder')}
                    />
                  </div>

                  <div className="form-group">
                    <FormInput
                      label={t('form.photo.coupleDetails.partner2Description.label')}
                      value={coupleDetails.partner2Description}
                      onChange={(e) => onCoupleDetailsChange('partner2Description', e.target.value)}
                      placeholder={t('form.photo.coupleDetails.partner2Description.placeholder')}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <FormSelect
                        label={t('form.photo.coupleDetails.outfitStyle.label')}
                        value={coupleDetails.outfitStyle}
                        onChange={(e) => onCoupleDetailsChange('outfitStyle', e.target.value)}
                        options={outfitStyleOptions}
                      />
                    </div>
                    <div className="form-group">
                      <FormSelect
                        label={t('form.photo.coupleDetails.setting.label')}
                        value={coupleDetails.setting}
                        onChange={(e) => onCoupleDetailsChange('setting', e.target.value)}
                        options={settingOptions}
                      />
                    </div>
                  </div>
                </div>
              )}
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
              disabled={!canGenerate}
              leftIcon={!isLoading ? (generationMode === 'retouch' ? <Wand2 size={18} /> : <Sparkles size={18} />) : undefined}
              className="generate-button"
            >
              {isLoading ? t('form.submit.loading') : t('form.submit.default')}
            </Button>
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
