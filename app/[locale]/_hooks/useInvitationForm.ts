'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { generatePhotos, retouchPhotos, type PhotoStyle, type GenerationMode, type CoupleDetails } from '@/app/actions/generate';
import { getDefaultPalette, type WeddingPalette } from '@/app/constants/weddingPalettes';
import type { InvitationConfig, TemplateId } from '@/app/types/invitation';
import type { PhotoItem } from '@/app/components/ui';

export interface UseInvitationFormReturn {
  // Form state
  photos: PhotoItem[];
  partner1Photos: PhotoItem[];
  partner2Photos: PhotoItem[];
  photoStyle: string;
  generationMode: GenerationMode;
  coupleDetails: CoupleDetails;
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
  generatedImages: string[];
  enhancedPhotosForInvitation: string[];
  activePreviewTab: string;
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

  // Handlers
  handleDateChange: (date: string, formatted: string) => void;
  handlePaletteSelect: (palette: WeddingPalette) => void;
  handlePhotosChange: (photos: PhotoItem[]) => void;
  handlePartner1PhotosChange: (photos: PhotoItem[]) => void;
  handlePartner2PhotosChange: (photos: PhotoItem[]) => void;
  handlePhotoStyleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleGenerationModeChange: (mode: GenerationMode) => void;
  handleCoupleDetailsChange: (field: keyof CoupleDetails, value: string) => void;
  handlePreviewTabChange: (tabId: string) => void;
  handleGenerate: (e: React.FormEvent) => Promise<void>;
  handleDownload: () => void;
  handleUsePhotos: () => void;
  openVenueInMaps: () => void;
}

export function useInvitationForm(): UseInvitationFormReturn {
  const t = useTranslations();
  const locale = useLocale();

  // Form state - Multiple photos support
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  // Partner reference photos for "generate" mode
  const [partner1Photos, setPartner1Photos] = useState<PhotoItem[]>([]);
  const [partner2Photos, setPartner2Photos] = useState<PhotoItem[]>([]);
  const [photoStyle, setPhotoStyle] = useState<PhotoStyle>('romantic');
  const [generationMode, setGenerationMode] = useState<GenerationMode>('retouch');
  const [coupleDetails, setCoupleDetails] = useState<CoupleDetails>({
    partner1Description: '',
    partner2Description: '',
    outfitStyle: 'formal',
    setting: 'garden',
  });
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
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [enhancedPhotosForInvitation, setEnhancedPhotosForInvitation] = useState<string[]>([]);
  const [activePreviewTab, setActivePreviewTab] = useState('template');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  const handleDateChange = useCallback((date: string, formatted: string) => {
    setWeddingDate(date);
    setWeddingDateFormatted(formatted);
  }, []);

  const handlePreviewTabChange = useCallback((tabId: string) => {
    setActivePreviewTab(tabId);
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

  const handlePartner1PhotosChange = useCallback((newPhotos: PhotoItem[]) => {
    setPartner1Photos(newPhotos);
  }, []);

  const handlePartner2PhotosChange = useCallback((newPhotos: PhotoItem[]) => {
    setPartner2Photos(newPhotos);
  }, []);

  const handlePhotoStyleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setPhotoStyle(e.target.value as PhotoStyle);
  }, []);

  const handleGenerationModeChange = useCallback((mode: GenerationMode) => {
    setGenerationMode(mode);
  }, []);

  const handleCoupleDetailsChange = useCallback((field: keyof CoupleDetails, value: string) => {
    setCoupleDetails(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check photos based on generation mode
    if (generationMode === 'retouch') {
      // For retouch mode, need at least one photo to enhance
      const uploadedPhotos = photos.filter(photo => photo.file !== null);
      if (uploadedPhotos.length === 0) {
        setError(t('errors.photoRequired'));
        return;
      }
    } else {
      // For generate mode, need reference photos for both partners
      const uploadedPartner1Photos = partner1Photos.filter(photo => photo.file !== null);
      const uploadedPartner2Photos = partner2Photos.filter(photo => photo.file !== null);

      if (uploadedPartner1Photos.length === 0 || uploadedPartner2Photos.length === 0) {
        setError(t('errors.partnerPhotosRequired'));
        return;
      }
    }

    // For generate mode, validate couple details
    if (generationMode === 'generate') {
      if (!coupleDetails.partner1Description || !coupleDetails.partner2Description) {
        setError(t('errors.coupleDetailsRequired'));
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);

    try {
      let result;
      if (generationMode === 'retouch') {
        // Original retouch functionality
        const uploadedPhotos = photos.filter(photo => photo.file !== null);
        const photosBase64 = uploadedPhotos.map(photo => photo.base64);
        result = await generatePhotos(photosBase64, photoStyle);
      } else {
        // Generate completely new images with separate partner photos
        const partner1Base64 = partner1Photos
          .filter(photo => photo.file !== null)
          .map(photo => photo.base64);
        const partner2Base64 = partner2Photos
          .filter(photo => photo.file !== null)
          .map(photo => photo.base64);

        result = await retouchPhotos(
          partner1Base64,
          partner2Base64,
          photoStyle,
          coupleDetails,
          3 // Generate 3 new images
        );
      }

      if (result.success && result.imageUrls && result.imageUrls.length > 0) {
        setGeneratedImages(result.imageUrls);
        // Switch to generated tab after successful generation
        setActivePreviewTab('generated');
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
    if (generatedImages.length === 0) return;

    // Download all generated images with a small delay between each
    generatedImages.forEach((imageUrl, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `wedding-photo-enhanced-${index + 1}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500); // 500ms delay between each download
    });
  }, [generatedImages]);

  const handleUsePhotos = useCallback(() => {
    // Use generated photos in the invitation (without replacing original uploads)
    if (generatedImages.length > 0) {
      setEnhancedPhotosForInvitation(generatedImages);
      // Switch to template tab to show the invitation with enhanced photos
      setActivePreviewTab('template');
    }
  }, [generatedImages]);

  // Default placeholder photos for empty slots
  const defaultPhotos = [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
    'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800',
  ];

  // Computed: Invitation config based on form data
  const invitationConfig = useMemo<InvitationConfig>(() => {
    // Build photoUrls array: prefer enhanced photos, then uploaded photos, then defaults
    const photoUrls: [string, string, string] = [
      enhancedPhotosForInvitation[0] || photos[0]?.preview || defaultPhotos[0],
      enhancedPhotosForInvitation[1] || photos[1]?.preview || defaultPhotos[1],
      enhancedPhotosForInvitation[2] || photos[2]?.preview || defaultPhotos[2],
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
  }, [partner1, partner2, weddingDateFormatted, venue, receptionVenue, hasSeparateReceptionVenue, selectedTemplate, photos, enhancedPhotosForInvitation, selectedPalette, customGreeting, customStory, customClosing, t]);

  return {
    // Form state
    photos,
    partner1Photos,
    partner2Photos,
    photoStyle,
    generationMode,
    coupleDetails,
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
    generatedImages,
    enhancedPhotosForInvitation,
    activePreviewTab,
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

    // Handlers
    handleDateChange,
    handlePaletteSelect,
    handlePhotosChange,
    handlePartner1PhotosChange,
    handlePartner2PhotosChange,
    handlePhotoStyleChange,
    handleGenerationModeChange,
    handleCoupleDetailsChange,
    handlePreviewTabChange,
    handleGenerate,
    handleDownload,
    handleUsePhotos,
    openVenueInMaps,
  };
}
