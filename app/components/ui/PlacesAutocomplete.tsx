'use client';

import { useRef, useEffect, useState, useId, useCallback } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';

const libraries: ('places')[] = ['places'];

export interface PlaceResult {
  address: string;
  placeId?: string;
  lat?: number;
  lng?: number;
}

export interface PlacesAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onPlaceSelect?: (place: PlaceResult) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  hint?: string;
  rightAddon?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  className?: string;
}

export function PlacesAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  label,
  placeholder,
  error,
  hint,
  rightAddon,
  disabled = false,
  id,
  className = '',
}: PlacesAutocompleteProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState(value);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  });

  // Sync external value with internal state
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handlePlaceChanged = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.formatted_address) {
        const result: PlaceResult = {
          address: place.formatted_address,
          placeId: place.place_id,
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        };
        
        setInputValue(result.address);
        onChange(result.address);
        onPlaceSelect?.(result);
      }
    }
  }, [onChange, onPlaceSelect]);

  const handleLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  // If loading failed or API key is not provided, fall back to regular input
  if (loadError || !process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className={`form-group full-width ${className}`}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <div className="input-wrapper">
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`form-input ${rightAddon ? 'has-right-addon' : ''} ${error ? 'has-error' : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          />
          {rightAddon && (
            <span className="input-addon input-addon-right">{rightAddon}</span>
          )}
        </div>
        {hint && !error && (
          <span id={`${inputId}-hint`} className="form-hint">
            {hint}
          </span>
        )}
        {error && (
          <span id={`${inputId}-error`} className="form-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }

  // Show loading state
  if (!isLoaded) {
    return (
      <div className={`form-group full-width ${className}`}>
        {label && (
          <label htmlFor={inputId} className="form-label">
            {label}
          </label>
        )}
        <div className="input-wrapper">
          <input
            id={inputId}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled
            className={`form-input ${rightAddon ? 'has-right-addon' : ''}`}
          />
          {rightAddon && (
            <span className="input-addon input-addon-right">{rightAddon}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`form-group full-width ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div className="input-wrapper">
        <Autocomplete
          onLoad={handleLoad}
          onPlaceChanged={handlePlaceChanged}
          options={{
            types: ['establishment', 'geocode'],
            fields: ['formatted_address', 'place_id', 'geometry'],
          }}
          className="places-autocomplete-wrapper"
        >
          <input
            ref={inputRef}
            id={inputId}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`form-input ${rightAddon ? 'has-right-addon' : ''} ${error ? 'has-error' : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          />
        </Autocomplete>
        {rightAddon && (
          <span className="input-addon input-addon-right">{rightAddon}</span>
        )}
      </div>
      {hint && !error && (
        <span id={`${inputId}-hint`} className="form-hint">
          {hint}
        </span>
      )}
      {error && (
        <span id={`${inputId}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
