'use client';

import { MultiPhotoUpload } from '@/app/components/ui';
import type { PhotoItem } from '@/app/components/ui';

interface PhotosSectionProps {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  title: string;
  subtitle: string;
  hint: string;
  addPhotoLabel: string;
}

export function PhotosSection({
  photos,
  onPhotosChange,
  title,
  subtitle,
  hint,
  addPhotoLabel,
}: PhotosSectionProps) {
  return (
    <div className="photos-section">
      <div className="photos-section-header">
        <h3 className="photos-section-title">{title}</h3>
        <p className="photos-section-subtitle">{subtitle}</p>
      </div>

      <MultiPhotoUpload
        value={photos}
        onChange={onPhotosChange}
        maxPhotos={3}
        hint={hint}
        addPhotoLabel={addPhotoLabel}
      />
    </div>
  );
}
