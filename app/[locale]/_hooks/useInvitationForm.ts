'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { generateWeddingInvitationPhotos, type PhotoStyle } from '@/app/actions/generate';
import { getDefaultPalette, type WeddingPalette } from '@/app/constants/weddingPalettes';
import type { InvitationConfig, TemplateId } from '@/app/types/invitation';
import type { PhotoItem } from '@/app/components/ui';

export interface UseInvitationFormReturn {
  // Form state
  photos: PhotoItem[];
  photoStyle: string;
  partner1: string;
  partner2: string;
  weddingDate: string;
  weddingDateFormatted: string;
  venue: string;
  receptionVenue: string;
  hasSeparateReceptionVenue: boolean;
  selectedTemplate: TemplateId;
  selectedPalette: WeddingPalette;
  customGreeting: string;
  customStory: string;
  customClosing: string;

  // UI state
  generatedImage: string | null;
  showTemplatePreview: boolean;
  isLoading: boolean;
  error: string | null;

  // Computed
  invitationConfig: InvitationConfig;
  locale: string;

  // Setters
  setPartner1: (value: string) => void;
  setPartner2: (value: string) => void;
  setVenue: (value: string) => void;
  setReceptionVenue: (value: string) => void;
  setHasSeparateReceptionVenue: (value: boolean) => void;
  setSelectedTemplate: (value: TemplateId) => void;
  setCustomGreeting: (value: string) => void;
  setCustomStory: (value: string) => void;
  setCustomClosing: (value: string) => void;
  setShowTemplatePreview: (value: boolean) => void;

  // Handlers
  handleDateChange: (date: string, formatted: string) => void;
  handlePaletteSelect: (palette: WeddingPalette) => void;
  handlePhotosChange: (photos: PhotoItem[]) => void;
  handlePhotoStyleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleGenerate: (e: React.FormEvent) => Promise<void>;
  handleDownload: () => void;
  openVenueInMaps: () => void;
}

export function useInvitationForm(): UseInvitationFormReturn {
  const t = useTranslations();
  const locale = useLocale();

  // Form state - Multiple photos support
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [photoStyle, setPhotoStyle] = useState<PhotoStyle>('romantic');
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingDateFormatted, setWeddingDateFormatted] = useState('');
  const [venue, setVenue] = useState('');
  const [receptionVenue, setReceptionVenue] = useState('');
  const [hasSeparateReceptionVenue, setHasSeparateReceptionVenue] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('classic');
  const [selectedPalette, setSelectedPalette] = useState<WeddingPalette>(getDefaultPalette());

  // AI-generated custom texts
  const [customGreeting, setCustomGreeting] = useState('');
  const [customStory, setCustomStory] = useState('');
  const [customClosing, setCustomClosing] = useState('');

  // UI state
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showTemplatePreview, setShowTemplatePreview] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const handlePhotosChange = useCallback((newPhotos: PhotoItem[]) => {
    setPhotos(newPhotos);
  }, []);

  const handlePhotoStyleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPhotoStyle(e.target.value as PhotoStyle);
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least one photo has been uploaded
    const hasPhotos = photos.some(photo => photo.file !== null);
    if (!hasPhotos) {
      setError(t('errors.photoRequired'));
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      // Use first photo's base64 for AI generation
      const result = await generateWeddingInvitationPhotos(
        photos[0].base64,
        photoStyle
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

  // Default placeholder photos for empty slots
  const defaultPhotos = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800',
  ];

  // Computed: Invitation config based on form data
  const invitationConfig = useMemo<InvitationConfig>(() => {
    // Build photoUrls array: use uploaded photos first, then fill with defaults
    const photoUrls: [string, string, string] = [
      photos[0]?.preview || defaultPhotos[0],
      photos[1]?.preview || defaultPhotos[1],
      photos[2]?.preview || defaultPhotos[2],
    ];

    return {
      id: `inv_preview_${Date.now()}`,
      templateId: selectedTemplate,
      content: {
        partner1Name: partner1 || t('invitation.defaultPartner1'),
        partner2Name: partner2 || t('invitation.defaultPartner2'),
        weddingDate: weddingDateFormatted || t('invitation.defaultDate'),
        venue: venue || t('invitation.defaultVenue'),
        receptionVenue: hasSeparateReceptionVenue ? receptionVenue : undefined,
        photoUrls,
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
  }, [partner1, partner2, weddingDateFormatted, venue, receptionVenue, hasSeparateReceptionVenue, selectedTemplate, photos, selectedPalette, customGreeting, customStory, customClosing, t]);

  return {
    // Form state
    photos,
    photoStyle,
    partner1,
    partner2,
    weddingDate,
    weddingDateFormatted,
    venue,
    receptionVenue,
    hasSeparateReceptionVenue,
    selectedTemplate,
    selectedPalette,
    customGreeting,
    customStory,
    customClosing,

    // UI state
    generatedImage,
    showTemplatePreview,
    isLoading,
    error,

    // Computed
    invitationConfig,
    locale,

    // Setters
    setPartner1,
    setPartner2,
    setVenue,
    setReceptionVenue,
    setHasSeparateReceptionVenue,
    setSelectedTemplate,
    setCustomGreeting,
    setCustomStory,
    setCustomClosing,
    setShowTemplatePreview,

    // Handlers
    handleDateChange,
    handlePaletteSelect,
    handlePhotosChange,
    handlePhotoStyleChange,
    handleGenerate,
    handleDownload,
    openVenueInMaps,
  };
}
