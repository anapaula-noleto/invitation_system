'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { X, ChevronLeft, ChevronRight, Download, Sparkles } from 'lucide-react';
import { BeforeAfterSlider } from '../BeforeAfterSlider';
import { Button } from '../Button';

export interface PhotoComparison {
  originalUrl: string;
  enhancedUrl: string;
  index: number;
}

interface BeforeAfterModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PhotoComparison[];
  initialIndex: number;
}

export function BeforeAfterModal({
  isOpen,
  onClose,
  photos,
  initialIndex,
}: BeforeAfterModalProps) {
  const t = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isClosing, setIsClosing] = useState(false);

  // Reset current index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsClosing(false);
    }
  }, [isOpen, initialIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200); // Match animation duration
  }, [onClose]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose]
  );

  const handlePrevious = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(photos.length - 1, prev + 1));
  }, [photos.length]);

  const handleDownload = useCallback(() => {
    const currentPhoto = photos[currentIndex];
    if (!currentPhoto) return;

    const link = document.createElement('a');
    link.href = currentPhoto.enhancedUrl;
    link.download = `wedding-photo-enhanced-${currentIndex + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [photos, currentIndex]);

  // Arrow key navigation
  useEffect(() => {
    const handleKeyNav = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyNav);
    return () => document.removeEventListener('keydown', handleKeyNav);
  }, [isOpen, handlePrevious, handleNext]);

  if (!isOpen) return null;

  const currentPhoto = photos[currentIndex];
  if (!currentPhoto) return null;

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  return (
    <div
      className={`modal-backdrop ${isClosing ? 'closing' : ''}`}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-modal-title"
    >
      <div className={`comparison-modal ${isClosing ? 'closing' : ''}`}>
        {/* Header */}
        <div className="comparison-modal-header">
          <h2 id="comparison-modal-title" className="comparison-modal-title">
            <Sparkles size={20} />
            {t('comparison.title')}
          </h2>

          <div className="comparison-modal-nav">
            <span className="photo-counter">
              {t('comparison.photoCount', {
                current: currentIndex + 1,
                total: photos.length,
              })}
            </span>

            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="nav-button"
              aria-label={t('comparison.previous')}
              type="button"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="nav-button"
              aria-label={t('comparison.next')}
              type="button"
            >
              <ChevronRight size={20} />
            </button>

            <button
              onClick={handleClose}
              className="close-button"
              aria-label={t('comparison.close')}
              type="button"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="comparison-modal-body">
          {/* Before/After Slider */}
          <BeforeAfterSlider
            beforeImage={currentPhoto.originalUrl}
            afterImage={currentPhoto.enhancedUrl}
            beforeLabel={t('comparison.before')}
            afterLabel={t('comparison.after')}
          />

          {/* Improvements Section */}
          <div className="improvements-section">
            <h3 className="improvements-title">
              📊 {t('comparison.improvements.title')}
            </h3>
            <ul className="improvements-list">
              <li>{t('comparison.improvements.lighting')}</li>
              <li>{t('comparison.improvements.skin')}</li>
              <li>{t('comparison.improvements.details')}</li>
              <li>{t('comparison.improvements.colors')}</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="comparison-modal-footer">
          <Button
            onClick={handleDownload}
            variant="primary"
            leftIcon={<Download size={16} />}
            type="button"
          >
            {t('comparison.download')}
          </Button>

          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              variant="secondary"
              leftIcon={<ChevronLeft size={16} />}
              type="button"
            >
              {t('comparison.previous')}
            </Button>

            <Button
              onClick={handleNext}
              disabled={!hasNext}
              variant="secondary"
              rightIcon={<ChevronRight size={16} />}
              type="button"
            >
              {t('comparison.next')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
