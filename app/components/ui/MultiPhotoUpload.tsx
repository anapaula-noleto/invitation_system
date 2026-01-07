'use client';

import { useCallback, useRef, type ChangeEvent, type DragEvent, useState } from 'react';
import { Icon, Camera, Trash2, Plus } from './Icon';

export interface PhotoItem {
  id: string;
  file?: File;
  preview: string;
  base64: string;
}

export interface MultiPhotoUploadProps {
  value: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
  maxPhotos?: number;
  label?: string;
  hint?: string;
  contextualTip?: string;
  accept?: string;
  maxSizeMB?: number;
  error?: string;
  addPhotoLabel?: string;
}

export function MultiPhotoUpload({
  value = [],
  onChange,
  maxPhotos = 3,
  label = 'Upload Photos',
  hint = 'JPG, PNG up to 10MB each',
  contextualTip,
  accept = 'image/*',
  maxSizeMB = 10,
  error,
  addPhotoLabel = 'Add photo',
}: MultiPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const generateId = () => Math.random().toString(36).slice(2, 11);

  const processFile = useCallback(
    (file: File) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        console.error(`File too large. Max size: ${maxSizeMB}MB`);
        return;
      }

      if (value.length >= maxPhotos) {
        console.error(`Maximum ${maxPhotos} photos allowed`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        const newPhoto: PhotoItem = {
          id: generateId(),
          file,
          preview: result,
          base64,
        };
        onChange([...value, newPhoto]);
      };
      reader.readAsDataURL(file);
    },
    [onChange, maxSizeMB, maxPhotos, value]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const remainingSlots = maxPhotos - value.length;
      
      files.slice(0, remainingSlots).forEach((file) => {
        if (file.type.startsWith('image/')) {
          processFile(file);
        }
      });

      // Reset input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
    [processFile, maxPhotos, value.length]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files || []);
      const remainingSlots = maxPhotos - value.length;
      
      files.slice(0, remainingSlots).forEach((file) => {
        if (file.type.startsWith('image/')) {
          processFile(file);
        }
      });
    },
    [processFile, maxPhotos, value.length]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleRemove = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(value.filter((photo) => photo.id !== id));
    },
    [onChange, value]
  );

  const canAddMore = value.length < maxPhotos;

  return (
    <div className="form-group multi-photo-upload-group">
      {label && (
        <label className="form-label">
          {label} ({value.length}/{maxPhotos})
        </label>
      )}

      <div className="multi-photo-grid">
        {/* Existing Photos */}
        {value.map((photo, index) => (
          <div key={photo.id} className="multi-photo-item">
            <img
              src={photo.preview}
              alt={`Photo ${index + 1}`}
              className="multi-photo-preview"
            />
            <button
              type="button"
              className="multi-photo-remove"
              onClick={(e) => handleRemove(photo.id, e)}
              aria-label="Remove photo"
            >
              <Icon icon={Trash2} size="sm" />
            </button>
            <span className="multi-photo-number">{index + 1}</span>
          </div>
        ))}

        {/* Add Photo Button */}
        {canAddMore && (
          <div
            className={`multi-photo-add ${isDragging ? 'dragging' : ''} ${error ? 'has-error' : ''}`}
            onClick={handleClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
            aria-label={addPhotoLabel}
          >
            {value.length === 0 ? (
              <>
                <span className="upload-icon" aria-hidden="true">
                  <Icon icon={Camera} size="xl" className="icon-gold" />
                </span>
                <span className="upload-text">Click to upload photos</span>
                {contextualTip && (
                  <span className="upload-contextual-tip">{contextualTip}</span>
                )}
                <span className="upload-hint">{hint}</span>
              </>
            ) : (
              <>
                <Icon icon={Plus} size="lg" className="icon-gold" />
                <span className="multi-photo-add-text">{addPhotoLabel}</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden-input"
        aria-hidden="true"
        multiple
      />

      {error && (
        <span className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
