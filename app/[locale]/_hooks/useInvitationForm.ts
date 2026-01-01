'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { generateWeddingInvitation } from '@/app/actions/generate';
import { getDefaultPalette, type WeddingPalette } from '@/app/constants/weddingPalettes';
import type { ToneType } from '@/app/constants/textLimits';
import type { InvitationConfig, TemplateId } from '@/app/types/invitation';

export interface UseInvitationFormReturn {
  // Form state
  photoPreview: string | null;
  photoBase64: string;
  partner1: string;
  partner2: string;
  weddingDate: string;
  weddingDateFormatted: string;
  venue: string;
  selectedTemplate: TemplateId;
  selectedPalette: WeddingPalette;
  selectedTone: ToneType;
  customGreeting: string;
  customStory: string;
  customClosing: string;

  // UI state
  generatedImage: string | null;
  showTemplatePreview: boolean;
  isLoading: boolean;
  error: string | null;
  show3DPreview: boolean;

  // Computed
  invitationConfig: InvitationConfig;
  locale: string;

  // Setters
  setPartner1: (value: string) => void;
  setPartner2: (value: string) => void;
  setVenue: (value: string) => void;
  setSelectedTemplate: (value: TemplateId) => void;
  setSelectedTone: (value: ToneType) => void;
  setCustomGreeting: (value: string) => void;
  setCustomStory: (value: string) => void;
  setCustomClosing: (value: string) => void;
  setShowTemplatePreview: (value: boolean) => void;
  setShow3DPreview: (value: boolean) => void;

  // Handlers
  handleDateChange: (date: string, formatted: string) => void;
  handlePaletteSelect: (palette: WeddingPalette) => void;
  handlePhotoChange: (file: File, preview: string, base64: string) => void;
  handlePhotoClear: () => void;
  handleGenerate: (e: React.FormEvent) => Promise<void>;
  handleDownload: () => void;
  openVenueInMaps: () => void;
}

export function useInvitationForm(): UseInvitationFormReturn {
  const t = useTranslations();
  const locale = useLocale();

  // Form state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string>('');
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingDateFormatted, setWeddingDateFormatted] = useState('');
  const [venue, setVenue] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic');
  const [selectedPalette, setSelectedPalette] = useState<WeddingPalette>(getDefaultPalette());
  const [selectedTone, setSelectedTone] = useState<ToneType>('classic');

  // AI-generated custom texts
  const [customGreeting, setCustomGreeting] = useState('');
  const [customStory, setCustomStory] = useState('');
  const [customClosing, setCustomClosing] = useState('');

  // UI state
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [show3DPreview, setShow3DPreview] = useState(false);

  // Handlers
  const handleDateChange = useCallback((date: string, formatted: string) => {
    setWeddingDate(date);
    setWeddingDateFormatted(formatted);
  }, []);

  const openVenueInMaps = useCallback(() => {
    if (venue) {
      const encodedVenue = encodeURIComponent(venue);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedVenue}`, '_blank');
    }
  }, [venue]);

  const handlePaletteSelect = useCallback((palette: WeddingPalette) => {
    setSelectedPalette(palette);
  }, []);

  const handlePhotoChange = useCallback((_file: File, preview: string, base64: string) => {
    setPhotoPreview(preview);
    setPhotoBase64(base64);
  }, []);

  const handlePhotoClear = useCallback(() => {
    setPhotoPreview(null);
    setPhotoBase64('');
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!photoBase64) {
      setError(t('errors.photoRequired'));
      return;
    }

    if (!partner1 || !partner2 || !weddingDate || !venue) {
      setError(t('errors.fieldsRequired'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateWeddingInvitation(
        photoBase64,
        { partner1, partner2 },
        weddingDate,
        venue
      );

      if (result.success && result.imageUrl) {
        setGeneratedImage(result.imageUrl);
      } else {
        setError(result.error || t('errors.generationFailed'));
      }
    } catch (err) {
      setError(t('errors.unexpected'));
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `wedding-invitation-${partner1}-${partner2}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage, partner1, partner2]);

  // Computed: Invitation config based on form data
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
        customGreeting: customGreeting || undefined,
        customStory: customStory || undefined,
        customClosing: customClosing || undefined,
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
    };
  }, [partner1, partner2, weddingDateFormatted, venue, selectedTemplate, photoPreview, selectedPalette, customGreeting, customStory, customClosing, t]);

  return {
    // Form state
    photoPreview,
    photoBase64,
    partner1,
    partner2,
    weddingDate,
    weddingDateFormatted,
    venue,
    selectedTemplate,
    selectedPalette,
    selectedTone,
    customGreeting,
    customStory,
    customClosing,

    // UI state
    generatedImage,
    showTemplatePreview,
    isLoading,
    error,
    show3DPreview,

    // Computed
    invitationConfig,
    locale,

    // Setters
    setPartner1,
    setPartner2,
    setVenue,
    setSelectedTemplate,
    setSelectedTone,
    setCustomGreeting,
    setCustomStory,
    setCustomClosing,
    setShowTemplatePreview,
    setShow3DPreview,

    // Handlers
    handleDateChange,
    handlePaletteSelect,
    handlePhotoChange,
    handlePhotoClear,
    handleGenerate,
    handleDownload,
    openVenueInMaps,
  };
}
