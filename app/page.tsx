'use client'

import { useState, useCallback } from 'react'
import { generateWeddingInvitation } from './actions/generate'
import { Card3DPreview } from './components/Card3DPreview'

export default function Home() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoBase64, setPhotoBase64] = useState<string>('')
  const [partner1, setPartner1] = useState('')
  const [partner2, setPartner2] = useState('')
  const [weddingDate, setWeddingDate] = useState('')
  const [venue, setVenue] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [show3DPreview, setShow3DPreview] = useState(false)

  const handlePhotoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPhotoPreview(result)
      // Extract base64 without the data URL prefix
      const base64 = result.split(',')[1]
      setPhotoBase64(base64)
    }
    reader.readAsDataURL(file)
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
              <div className="form-group photo-upload-group">
                <label className="form-label">Your Photo Together</label>
                <div 
                  className={`photo-upload-area ${photoPreview ? 'has-photo' : ''}`}
                  onClick={() => document.getElementById('photo-input')?.click()}
                >
                  {photoPreview ? (
                    <img src={photoPreview} alt="Couple preview" className="photo-preview" />
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">📷</span>
                      <span className="upload-text">Click to upload your photo</span>
                      <span className="upload-hint">JPG, PNG up to 10MB</span>
                    </div>
                  )}
                </div>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden-input"
                />
              </div>

              {/* Names */}
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Partner 1</label>
                  <input
                    type="text"
                    value={partner1}
                    onChange={(e) => setPartner1(e.target.value)}
                    placeholder="First name"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Partner 2</label>
                  <input
                    type="text"
                    value={partner2}
                    onChange={(e) => setPartner2(e.target.value)}
                    placeholder="First name"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Date */}
              <div className="form-group">
                <label className="form-label">Wedding Date</label>
                <input
                  type="text"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  placeholder="e.g., Saturday, June 15th, 2025"
                  className="form-input"
                />
              </div>

              {/* Venue */}
              <div className="form-group">
                <label className="form-label">Venue</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g., The Grand Ballroom, New York"
                  className="form-input"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="generate-button"
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Creating your invitation...
                  </>
                ) : (
                  <>✨ Generate Invitation</>
                )}
              </button>
            </form>
          </section>

          {/* Preview Section */}
          <section className="preview-section">
            <div className="preview-card">
              {generatedImage ? (
                <>
                  <img 
                    src={generatedImage} 
                    alt="Generated wedding invitation" 
                    className="generated-image"
                  />
                  <div className="button-group">
                    <button onClick={handleDownload} className="download-button">
                      ⬇️ Download Invitation
                    </button>
                    <button 
                      onClick={() => setShow3DPreview(true)} 
                      className="preview-3d-button"
                    >
                      🎴 View 3D Card
                    </button>
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
