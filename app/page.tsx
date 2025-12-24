'use client'

import { useState, useCallback, useEffect } from 'react'
import { generateNewYearCard } from './actions/generate'
import { Card3DPreview } from './components/Card3DPreview'

type Status = 'idle' | 'uploading' | 'generating' | 'done' | 'error'

interface City {
  id: string
  name: string
  country: string
  icon: string
  landmark: string
}

const CITIES: City[] = [
  { id: 'new-york', name: 'New York', country: 'USA', icon: '🗽', landmark: 'Times Square & Statue of Liberty' },
  { id: 'london', name: 'London', country: 'UK', icon: '🎡', landmark: 'Big Ben & London Eye' },
  { id: 'paris', name: 'Paris', country: 'France', icon: '🗼', landmark: 'Eiffel Tower & Champs-Élysées' },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', icon: '🏯', landmark: 'Tokyo Tower & Shibuya Crossing' },
  { id: 'dubai', name: 'Dubai', country: 'UAE', icon: '🏙️', landmark: 'Burj Khalifa & Dubai Frame' },
  { id: 'sydney', name: 'Sydney', country: 'Australia', icon: '🌉', landmark: 'Opera House & Harbour Bridge' },
  { id: 'san-francisco', name: 'San Francisco', country: 'USA', icon: '🌁', landmark: 'Golden Gate Bridge' },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', icon: '🦁', landmark: 'Marina Bay Sands' },
  { id: 'hong-kong', name: 'Hong Kong', country: 'China', icon: '🌃', landmark: 'Victoria Harbour' },
]

// Floating confetti for celebration atmosphere
function FloatingConfetti() {
  const [confetti, setConfetti] = useState<Array<{
    id: number
    left: number
    delay: number
    duration: number
    color: string
    size: number
    rotation: number
  }>>([])

  useEffect(() => {
    const colors = ['#d4af37', '#f7e7ce', '#4169e1', '#e8c4b8', '#ffd700', '#c0c0c0']
    const items = Array.from({ length: 35 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 6 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 6 + Math.random() * 8,
      rotation: Math.random() * 360,
    }))
    setConfetti(items)
  }, [])

  return (
    <div className="fireworks-container">
      {confetti.map((item) => (
        <span
          key={item.id}
          className="confetti"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            backgroundColor: item.color,
            transform: `rotate(${item.rotation}deg)`,
            opacity: 0.7,
          }}
        />
      ))}
    </div>
  )
}

export default function Home() {
  const [status, setStatus] = useState<Status>('idle')
  const [selectedCity, setSelectedCity] = useState<City>(CITIES[0])
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [generatedCard, setGeneratedCard] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [show3DPreview, setShow3DPreview] = useState(false)

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setStatus('uploading')
    setError(null)
    setGeneratedCard(null)

    const reader = new FileReader()
    reader.onload = async () => {
      const dataUrl = reader.result as string
      setUploadedImage(dataUrl)

      const [header, base64] = dataUrl.split(',')
      const mediaType = header.match(/data:(.*?);/)?.[1] || 'image/jpeg'

      setStatus('generating')

      const result = await generateNewYearCard(base64, mediaType, selectedCity.id, selectedCity.landmark)

      if (result.success && result.image) {
        setGeneratedCard(result.image)
        setStatus('done')
      } else {
        setError(result.error || 'Something went wrong')
        setStatus('error')
      }
    }
    reader.onerror = () => {
      setError('Failed to read file')
      setStatus('error')
    }
    reader.readAsDataURL(file)
  }, [selectedCity])

  const reset = () => {
    setStatus('idle')
    setUploadedImage(null)
    setGeneratedCard(null)
    setError(null)
  }

  return (
    <>
      <FloatingConfetti />
      <main className="min-h-screen flex flex-col items-center justify-center p-6 py-12">
        <div className="max-w-2xl w-full">
          {/* Header */}
          <div className="text-center mb-10">
            {/* Celebration badge */}
            <div className="flex justify-center mb-6">
              <span className="celebration-badge">
                <span className="animate-pulse-glow">✨</span>
                <span className="font-heading uppercase tracking-widest text-xs">Celebrate the New Year</span>
                <span className="animate-pulse-glow">✨</span>
              </span>
            </div>

            {/* Main title */}
            <h1 className="font-display text-5xl md:text-7xl font-bold text-shimmer mb-3 tracking-tight">
              Happy New Year
            </h1>
            <p className="font-display text-6xl md:text-8xl font-black year-text text-shimmer mb-6">
              2026
            </p>
            <p className="font-body text-lg md:text-xl text-champagne-400/90 max-w-md mx-auto leading-relaxed">
              Create a personalized celebration card featuring iconic city skylines from around the world
            </p>

            {/* Decorative sparkles */}
            <div className="flex justify-center gap-4 mt-5 text-2xl">
              <span className="animate-pulse-glow" style={{ animationDelay: '0s' }}>🎆</span>
              <span className="animate-pulse-glow" style={{ animationDelay: '0.3s' }}>🥂</span>
              <span className="animate-pulse-glow" style={{ animationDelay: '0.6s' }}>🎇</span>
            </div>
          </div>

          {/* Main Card */}
          <div className="glass-card ornate-corner rounded-2xl p-8">
            {status === 'idle' && (
              <div className="space-y-8">
                {/* City Selector */}
                <div>
                  <label className="block font-heading text-lg text-champagne-300 mb-4 tracking-wide">
                    Choose Your City
                  </label>
                  <div className="city-selector p-3">
                    <div className="grid grid-cols-3 gap-2">
                      {CITIES.map((city) => (
                        <button
                          key={city.id}
                          onClick={() => setSelectedCity(city)}
                          className={`city-option flex flex-col items-center gap-1 py-3 ${
                            selectedCity.id === city.id ? 'selected' : ''
                          }`}
                        >
                          <span className="city-icon text-2xl">{city.icon}</span>
                          <span className="font-heading text-sm text-champagne-300">{city.name}</span>
                          <span className="text-xs text-champagne-500/60">{city.country}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 text-center text-sm text-champagne-500/70">
                    {selectedCity.landmark}
                  </p>
                </div>

                {/* Upload Zone */}
                <label className="upload-zone flex flex-col items-center justify-center h-52 rounded-xl cursor-pointer">
                  <div className="flex flex-col items-center">
                    {/* Upload icon */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-electric-500/20 to-champagne-700/20 flex items-center justify-center mb-5 border border-champagne-700/40">
                      <svg className="w-10 h-10 text-champagne-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="font-heading text-xl text-champagne-200 mb-2">
                      Upload Your Photo
                    </span>
                    <span className="font-body text-champagne-500/70 text-sm">
                      JPG, PNG or WebP up to 10MB
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {(status === 'uploading' || status === 'generating') && (
              <div className="flex flex-col items-center justify-center h-72">
                <div className="relative">
                  <div className="w-20 h-20 border-3 spinner-gold rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl">{selectedCity.icon}</span>
                  </div>
                </div>
                <p className="font-heading text-xl text-champagne-200 mt-6">
                  {status === 'uploading' ? 'Reading image...' : `Creating your ${selectedCity.name} celebration card...`}
                </p>
                <p className="font-body text-champagne-500/70 text-sm mt-2">
                  This may take 20-30 seconds
                </p>
                {/* Progress sparkles */}
                <div className="flex gap-3 mt-5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="text-xl"
                      style={{
                        animation: 'sparkle 1.5s ease-in-out infinite',
                        animationDelay: `${i * 0.3}s`,
                      }}
                    >
                      ✨
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status === 'done' && generatedCard && (
              <div className="space-y-6">
                {/* Original photo thumbnail */}
                {uploadedImage && (
                  <div className="flex items-center gap-4 p-3 bg-midnight-900/50 rounded-xl border border-champagne-700/20">
                    <img
                      src={uploadedImage}
                      alt="Original photo"
                      className="w-12 h-12 rounded-lg object-cover border border-champagne-700/30"
                    />
                    <div className="flex-1">
                      <span className="font-body text-champagne-300 text-sm">Your photo in</span>
                      <span className="font-heading text-champagne-400 ml-2">{selectedCity.name} {selectedCity.icon}</span>
                    </div>
                  </div>
                )}

                {/* Generated card */}
                <div className="image-frame">
                  <p className="font-body text-champagne-500 text-xs mb-3 text-center tracking-widest uppercase font-semibold">
                    Your New Year 2026 Card
                  </p>
                  <img
                    src={generatedCard}
                    alt="New Year 2026 card"
                    className="w-full rounded-lg"
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={reset}
                    className="btn-ghost py-3 px-5 rounded-xl font-body text-sm"
                  >
                    Try Another
                  </button>
                  <button
                    onClick={() => setShow3DPreview(true)}
                    className="btn-blue flex-1 py-3 px-5 rounded-xl font-body text-sm flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                    3D Preview
                  </button>
                  <a
                    href={generatedCard}
                    download={`new-year-2026-${selectedCity.id}.png`}
                    className="btn-gold py-3 px-5 rounded-xl font-body text-sm text-center"
                  >
                    Download
                  </a>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center justify-center h-72">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mb-4 border border-rose-400/40">
                  <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p className="font-heading text-xl text-champagne-200">Something went wrong</p>
                <p className="font-body text-champagne-500/70 text-sm text-center mt-2 max-w-xs">{error}</p>
                <button
                  onClick={reset}
                  className="btn-ghost mt-6 py-3 px-8 rounded-xl font-body text-sm"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="divider-ornate mb-4">
              <span className="text-champagne-600/80 text-lg font-display italic">Cheers to 2026</span>
            </div>
            <p className="font-body text-champagne-600/50 text-sm">
              Powered by Gemini Nano Banana Pro
            </p>
          </div>
        </div>

        {/* 3D Preview Modal */}
        {show3DPreview && generatedCard && (
          <Card3DPreview
            imageUrl={generatedCard}
            onClose={() => setShow3DPreview(false)}
          />
        )}
      </main>
    </>
  )
}
