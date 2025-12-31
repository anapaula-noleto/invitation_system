'use client'

import { useState, useCallback, useMemo } from 'react'
import { generateWeddingInvitation } from './actions/generate'
import { Card3DPreview } from './components/Card3DPreview'
import { InvitationRenderer } from './components/InvitationRenderer'
import { ElegantDatePicker } from './components/ElegantDatePicker'
import {
  Button,
  FormInput,
  FormSelect,
  PhotoUpload,
  IconButton,
  ErrorMessage,
  ToggleButtonGroup,
  FormRow,
} from './components/ui'
import { AVAILABLE_TEMPLATES, getTemplateById } from './data/mock-invitations'
import type { InvitationConfig, TemplateId } from './types/invitation'

export default function Home() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoBase64, setPhotoBase64] = useState<string>('')
  const [partner1, setPartner1] = useState('')
  const [partner2, setPartner2] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [weddingDateFormatted, setWeddingDateFormatted] = useState('')
  const [venue, setVenue] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic')
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

  // Cria a configuração do convite baseada nos dados do formulário
  const invitationConfig = useMemo<InvitationConfig>(() => {
    const template = getTemplateById(selectedTemplate)
    return {
      id: `inv_preview_${Date.now()}`,
      templateId: selectedTemplate,
      content: {
        partner1Name: partner1 || 'Seu Nome',
        partner2Name: partner2 || 'Nome do Par',
        weddingDate: weddingDateFormatted || 'Data do Casamento',
        venue: venue || 'Local da Cerimônia',
        photoUrls: [
          photoPreview || 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
          'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
          'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800',
        ],
      },
      theme: template?.defaultTheme ?? {
        primaryColor: '#c9a961',
        secondaryColor: '#2c2c2c',
        fontFamily: 'playfair',
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }, [partner1, partner2, weddingDateFormatted, venue, selectedTemplate, photoPreview])

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
      setError('Please upload a photo first')
      return
    }

    if (!partner1 || !partner2 || !weddingDate || !venue) {
      setError('Please fill in all fields')
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
        setError(result.error || 'Failed to generate invitation')
      }
    } catch (err) {
      setError('An unexpected error occurred')
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
        {/* Header */}
        <header className="header">
          <span className="brand-mark">Évora Studio</span>
          <h1 className="title">
            <span className="title-accent">Timeless</span> Invitations
          </h1>
          <p className="subtitle">crafted by AI, inspired by love</p>
          <div className="decorative-line">
            <span className="line"></span>
            <span className="ornament">✦</span>
            <span className="line"></span>
          </div>
          <p className="tagline">Transform your cherished photos into elegant wedding announcements</p>
        </header>

        <div className="main-content">
          {/* Form Section */}
          <section className="form-section">
            <h2 className="form-section-title">Your Details</h2>
            <form onSubmit={handleGenerate} className="invitation-form">
              {/* Photo Upload */}
              <PhotoUpload
                value={photoPreview}
                onChange={handlePhotoChange}
                onClear={handlePhotoClear}
                label="Your Photo Together"
                hint="JPG, PNG up to 10MB"
              />

              {/* Names */}
              <FormRow columns={2}>
                <FormInput
                  label="Partner 1"
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  placeholder="First name"
                />
                <FormInput
                  label="Partner 2"
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  placeholder="First name"
                />
              </FormRow>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">Wedding Date</label>
                <ElegantDatePicker
                  value={weddingDate}
                  onChange={handleDateChange}
                  minDate={new Date().toISOString().split('T')[0]}
                  placeholder="Select your wedding date"
                />
              </div>

              {/* Venue */}
              <FormInput
                label="Venue"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g., The Grand Ballroom, New York"
                rightAddon={
                  venue ? (
                    <IconButton
                      icon="📍"
                      label="View on Google Maps"
                      onClick={openVenueInMaps}
                      size="sm"
                      type="button"
                    />
                  ) : undefined
                }
              />

              {/* Template Selection */}
              <FormSelect
                label="Template Style"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value as TemplateId)}
                options={AVAILABLE_TEMPLATES
                  .filter(t => t.id === 'classic' || t.id === 'modern')
                  .map((template) => ({
                    value: template.id,
                    label: `${template.name} — ${template.description}`,
                  }))}
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
                {isLoading ? 'Creating your invitation...' : 'Generate Invitation'}
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
                  { value: 'generated', label: 'AI Generated', icon: '🎨' },
                  { value: 'template', label: 'Template Preview', icon: '📋' },
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
                      Download Invitation
                    </Button>
                    <Button 
                      onClick={() => setShow3DPreview(true)} 
                      variant="secondary"
                      leftIcon="🎴"
                    >
                      View 3D Card
                    </Button>
                  </div>
                </>
              ) : (
                <div className="preview-placeholder">
                  <div className="placeholder-frame">
                    <span className="placeholder-icon">💒</span>
                    <p className="placeholder-text">Your beautiful invitation will appear here</p>
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
