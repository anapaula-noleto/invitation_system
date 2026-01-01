'use client'

import { useState, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { generateWeddingInvitation } from '@/app/actions/generate'
import { Card3DPreview } from '@/app/components/Card3DPreview'
import { InvitationRenderer } from '@/app/components/InvitationRenderer'
import { ElegantDatePicker } from '@/app/components/ElegantDatePicker'
import {
  Button,
  FormInput,
  FormSelect,
  PhotoUpload,
  IconButton,
  ErrorMessage,
  ToggleButtonGroup,
  FormRow,
  PaletteSelector,
  LanguageSelector,
} from '@/app/components/ui'
import { AVAILABLE_TEMPLATES } from '@/app/data/mock-invitations'
import { getDefaultPalette, type WeddingPalette } from '@/app/constants/weddingPalettes'
import type { InvitationConfig, TemplateId } from '@/app/types/invitation'

export default function Home() {
  const t = useTranslations()
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoBase64, setPhotoBase64] = useState<string>('')
  const [partner1, setPartner1] = useState('')
  const [partner2, setPartner2] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [weddingDateFormatted, setWeddingDateFormatted] = useState('')
  const [venue, setVenue] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic')
  const [selectedPalette, setSelectedPalette] = useState<WeddingPalette>(getDefaultPalette())
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [showTemplatePreview, setShowTemplatePreview] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [show3DPreview, setShow3DPreview] = useState(false)

  // Handler para o ElegantDatePicker
  const handleDateChange = useCallback((date: string, formatted: string) => {
    setWeddingDate(date)
    setWeddingDateFormatted(formatted)
  }, [])

  // Abre o Google Maps com o endereço do venue
  const openVenueInMaps = useCallback(() => {
    if (venue) {
      const encodedVenue = encodeURIComponent(venue)
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedVenue}`, '_blank')
    }
  }, [venue])

  // Handler para o PaletteSelector
  const handlePaletteSelect = useCallback((palette: WeddingPalette) => {
    setSelectedPalette(palette)
  }, [])

  // Cria a configuração do convite baseada nos dados do formulário
  const invitationConfig = useMemo<InvitationConfig>(() => {
    return {
      id: `inv_preview_${Date.now()}`,
      templateId: selectedTemplate,
      content: {
        partner1Name: partner1 || t('invitation.defaultPartner1'),
        partner2Name: partner2 || t('invitation.defaultPartner2'),
        weddingDate: weddingDateFormatted || t('invitation.defaultDate'),
        venue: venue || t('invitation.defaultVenue'),
        photoUrls: [
          photoPreview || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
          'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
          'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800',
        ],
      },
      theme: {
        primaryColor: selectedPalette.colors.primary,
        secondaryColor: selectedPalette.colors.secondary,
        backgroundColor: selectedPalette.colors.background,
        textColor: selectedPalette.colors.text,
        fontFamily: 'playfair',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }, [partner1, partner2, weddingDateFormatted, venue, selectedTemplate, photoPreview, selectedPalette, t])

  // Handler para o PhotoUpload
  const handlePhotoChange = useCallback((_file: File, preview: string, base64: string) => {
    setPhotoPreview(preview)
    setPhotoBase64(base64)
  }, [])

  const handlePhotoClear = useCallback(() => {
    setPhotoPreview(null)
    setPhotoBase64('')
  }, [])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!photoBase64) {
      setError(t('errors.photoRequired'))
      return
    }

    if (!partner1 || !partner2 || !weddingDate || !venue) {
      setError(t('errors.fieldsRequired'))
      return
    }

    setIsLoading(true)
    setError(null)
    setGeneratedImage(null)

    try {
      const result = await generateWeddingInvitation(
        photoBase64,
        { partner1, partner2 },
        weddingDate,
        venue
      )

      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl)
      } else {
        setError(result.error || t('errors.generationFailed'))
      }
    } catch (err) {
      setError(t('errors.unexpected'))
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `wedding-invitation-${partner1}-${partner2}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Traduz os templates dinamicamente
  const templateOptions = AVAILABLE_TEMPLATES
    .filter(tmpl => tmpl.id === 'classic' || tmpl.id === 'modern')
    .map((tmpl) => ({
      value: tmpl.id,
      label: `${t(`templates.${tmpl.id}.name`)} — ${t(`templates.${tmpl.id}.description`)}`,
    }))

  return (
    <main className="main-container">
      {/* Decorative background elements */}
      <div className="bg-decoration">
        <div className="floral-corner top-left"></div>
        <div className="floral-corner top-right"></div>
        <div className="floral-corner bottom-left"></div>
        <div className="floral-corner bottom-right"></div>
      </div>
      
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true"></div>

      <div className="content-wrapper">
        {/* Language Selector */}
        <LanguageSelector />
        
        {/* Header */}
        <header className="header">
          <span className="brand-mark">{t('header.brand')}</span>
          <h1 className="title">
            <span className="title-accent">{t('header.titleAccent')}</span> {t('header.titleSuffix')}
          </h1>
          <p className="subtitle">{t('header.subtitle')}</p>
          <div className="decorative-line">
            <span className="line"></span>
            <span className="ornament">✦</span>
            <span className="line"></span>
          </div>
          <p className="tagline">{t('header.tagline')}</p>
        </header>

        <div className="main-content">
          {/* Form Section */}
          <section className="form-section">
            <h2 className="form-section-title">{t('form.title')}</h2>
            <form onSubmit={handleGenerate} className="invitation-form">
              {/* Photo Upload */}
              <PhotoUpload
                value={photoPreview}
                onChange={handlePhotoChange}
                onClear={handlePhotoClear}
                label={t('form.photo.label')}
                hint={t('form.photo.hint')}
              />

              {/* Names */}
              <FormRow columns={2}>
                <FormInput
                  label={t('form.partner1.label')}
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  placeholder={t('form.partner1.placeholder')}
                />
                <FormInput
                  label={t('form.partner2.label')}
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  placeholder={t('form.partner2.placeholder')}
                />
              </FormRow>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">{t('form.date.label')}</label>
                <ElegantDatePicker
                  value={weddingDate}
                  onChange={handleDateChange}
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
                onChange={(e) => setVenue(e.target.value)}
                placeholder={t('form.venue.placeholder')}
                rightAddon={
                  venue ? (
                    <IconButton
                      icon="📍"
                      label={t('form.venue.viewOnMaps')}
                      onClick={openVenueInMaps}
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
                onChange={(e) => setSelectedTemplate(e.target.value as TemplateId)}
                options={templateOptions}
              />

              {/* Color Palette Selection */}
              <div className="form-group">
                <label className="form-label">{t('form.palette.label')}</label>
                <PaletteSelector
                  value={selectedPalette.id}
                  onSelect={handlePaletteSelect}
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

          {/* Preview Section */}
          <section className="preview-section">
            <div className="preview-card">
              {/* Toggle entre preview de template e imagem gerada */}
              <ToggleButtonGroup
                value={showTemplatePreview ? 'template' : 'generated'}
                onChange={(v) => setShowTemplatePreview(v === 'template')}
                options={[
                  { value: 'generated', label: t('preview.tabs.generated'), icon: '🎨' },
                  { value: 'template', label: t('preview.tabs.template'), icon: '📋' },
                ]}
              />

              {showTemplatePreview ? (
                /* Novo: Preview do template em tempo real */
                <div className="template-preview-container">
                  <InvitationRenderer config={invitationConfig} />
                </div>
              ) : generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    alt="Generated wedding invitation" 
                    className="generated-image"
                  />
                  <div className="button-group">
                    <Button onClick={handleDownload} variant="secondary" leftIcon="⬇️">
                      {t('preview.actions.download')}
                    </Button>
                    <Button 
                      onClick={() => setShow3DPreview(true)} 
                      variant="secondary"
                      leftIcon="🎴"
                    >
                      {t('preview.actions.view3d')}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="preview-placeholder">
                  <div className="placeholder-frame">
                    <span className="placeholder-icon">💒</span>
                    <p className="placeholder-text">{t('preview.placeholder.text')}</p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {/* 3D Preview Modal */}
      {show3DPreview && generatedImage && (
        <Card3DPreview 
          imageUrl={generatedImage} 
          onClose={() => setShow3DPreview(false)} 
        />
      )}
    </main>
  )
}
