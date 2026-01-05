'use client';

import { useCallback, useRef, type ChangeEvent, type DragEvent, useState } from 'react';
import { Icon, Camera } from './Icon';

export interface PhotoUploadProps {
  value: string | null;
  onChange: (file: File, preview: string, base64: string) => void;
  onClear?: () => void;
  label?: string;
  hint?: string;
  accept?: string;
  maxSizeMB?: number;
  error?: string;
}

export function PhotoUpload({
  value,
  onChange,
  onClear,
  label = 'Upload Photo',
  hint = 'JPG, PNG up to 10MB',
  accept = 'image/*',
  maxSizeMB = 10,
  error,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = useCallback(
    (file: File) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        console.error(`File too large. Max size: ${maxSizeMB}MB`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        onChange(file, result, base64);
      };
      reader.readAsDataURL(file);
    },
    [onChange, maxSizeMB]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
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

      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith('image/')) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      onClear?.();
    },
    [onClear]
  );

  return (
    <div className="form-group photo-upload-group">
      {label && <label className="form-label">{label}</label>}

      <div
        className={`photo-upload-area ${value ? 'has-photo' : ''} ${isDragging ? 'dragging' : ''} ${error ? 'has-error' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        aria-label={label}
      >
        {value ? (
          <>
            <img src={value} alt="Uploaded preview" className="photo-preview" />
            {onClear && (
              <button
                type="button"
                className="photo-clear-btn"
                onClick={handleClear}
                aria-label="Remove photo"
              >
                ✕
              </button>
            )}
          </>
        ) : (
          <div className="upload-placeholder">
            <span className="upload-icon" aria-hidden="true">
              <Icon icon={Camera} size="xl" className="icon-gold" />
            </span>
            <span className="upload-text">Click to upload your photo</span>
            <span className="upload-hint">{hint}</span>
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
      />

      {error && (
        <span className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
