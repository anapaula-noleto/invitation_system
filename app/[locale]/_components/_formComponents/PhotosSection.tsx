'use client';

import { MultiPhotoUpload } from '@/app/components/ui';
import type { PhotoItem } from '@/app/components/ui';

interface PhotosSectionProps {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  hint: string;
  addPhotoLabel: string;
  maxPhotos?: number;
}

export function PhotosSection({
  photos,
  onPhotosChange,
  hint,
  addPhotoLabel,
  maxPhotos = 3,
}: PhotosSectionProps) {
  return (
    <MultiPhotoUpload
      value={photos}
      onChange={onPhotosChange}
      maxPhotos={maxPhotos}
      hint={hint}
      addPhotoLabel={addPhotoLabel}
    />
  );
}
