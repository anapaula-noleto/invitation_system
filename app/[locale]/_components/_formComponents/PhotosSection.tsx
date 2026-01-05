'use client';

import { MultiPhotoUpload } from '@/app/components/ui';
import type { PhotoItem } from '@/app/components/ui';

interface PhotosSectionProps {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  hint: string;
  addPhotoLabel: string;
}

export function PhotosSection({
  photos,
  onPhotosChange,
  hint,
  addPhotoLabel,
}: PhotosSectionProps) {
  return (
    <MultiPhotoUpload
      value={photos}
      onChange={onPhotosChange}
      maxPhotos={3}
      hint={hint}
      addPhotoLabel={addPhotoLabel}
    />
  );
}
