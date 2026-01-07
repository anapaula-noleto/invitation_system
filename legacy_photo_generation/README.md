# Legacy Photo Generation - Archived Code

## Overview

This folder contains the **Photo Generation** functionality that was removed from the main application. The app now focuses exclusively on **Photo Enhancement/Retouching** of existing photos.

## What Was Removed

The "Generate New Photos" mode allowed users to upload reference photos of two partners and have AI generate completely new pre-wedding photoshoot images. This feature has been archived to simplify the application.

## Archived Components

### Functions (`/functions/`)

- **retouchPhotos.ts**: The main server action that generated new photos from partner reference images
  - Accepted separate photo arrays for each partner
  - Used Gemini AI to create new couple photos
  - Supported different styles and settings

### Types (`/types/`)

- **GenerationMode**: `'retouch' | 'generate'` - Determined which mode the app was in
- **CoupleDetails**: Interface for partner descriptions, outfit styles, and settings

### Components (`/components/`)

- **ReferenceInstructions.tsx**: Visual "Do's and Don'ts" component showing users how to take good reference photos
  - Used icons and visual cards
  - Showed good vs bad photo examples

### UI Elements Removed

- Generation mode toggle (retouch/generate selector)
- Partner 1 and Partner 2 separate photo upload areas
- Couple details form (partner descriptions, outfit style, setting)
- Reference instructions with visual examples
- Contextual tips in empty upload states

### CSS Styles Removed

- `.generation-mode-toggle` and variants
- `.couple-details-section`
- `.partner-photos-section`, `.partner-upload-area`, `.partner-label`
- `.dos-donts-grid`, `.dos-donts-card`, `.do-card`, `.dont-card`
- `.upload-contextual-tip`
- Partner-specific media queries

### Translation Keys Removed

From `en.json`, `pt.json`, `es.json`:

- `form.photo.generationMode.*`
- `form.photo.coupleDetails.*`
- `form.photos.partner1Photos`, `partner2Photos`
- `form.photos.partner1Hint`, `partner2Hint`
- `form.photos.contextualTip`
- `form.photos.referenceInstructions.*`
- `errors.partnerPhotosRequired`

## How It Worked

### User Flow (Before Removal)

1. User selected between "Enhance Photos" or "Generate New Photos"
2. If "Generate New Photos":
   - Upload 1-2 reference photos of Partner 1
   - Upload 1-2 reference photos of Partner 2
   - Fill in descriptions of each partner
   - Select outfit style and setting
   - Click generate
3. AI analyzed reference photos and generated 3 new couple photos

### Technical Flow

1. `useInvitationForm` hook managed `partner1Photos`, `partner2Photos`, and `coupleDetails` states
2. `InvitationFormSection` showed different UI based on `generationMode`
3. On submit, `retouchPhotos()` was called with separate partner photo arrays
4. Gemini AI received instructions to identify each partner and create new photos

## How to Restore

If you need to restore this functionality:

### 1. Restore Types

Copy from `types/photoGeneration.ts` to `app/actions/generate.ts`:

```typescript
export type GenerationMode = 'retouch' | 'generate';
export interface CoupleDetails { ... }
```

### 2. Restore Function

Copy `retouchPhotos()` from `functions/retouchPhotos.ts` to `app/actions/generate.ts`

### 3. Restore Component

Copy `ReferenceInstructions.tsx` to `app/[locale]/_components/_formComponents/`
Add export in index.ts

### 4. Restore Hook States

In `useInvitationForm.ts`, add:

```typescript
const [generationMode, setGenerationMode] = useState<GenerationMode>('retouch');
const [partner1Photos, setPartner1Photos] = useState<PhotoItem[]>([]);
const [partner2Photos, setPartner2Photos] = useState<PhotoItem[]>([]);
const [coupleDetails, setCoupleDetails] = useState<CoupleDetails>({...});
```

### 5. Restore UI

In `InvitationFormSection.tsx`, add back:

- Generation mode toggle
- Conditional rendering for partner photo sections
- Couple details form

### 6. Restore Translations

Restore all removed translation keys from the archived translations folder

### 7. Restore CSS

Copy CSS styles from archived stylesheets

## Why Was It Removed?

- **Simplification**: Focus on one clear use case (photo enhancement)
- **User Experience**: Simpler flow with fewer decisions
- **Maintenance**: Less code to maintain and test
- **Clarity**: Single purpose makes the app easier to understand

## Changelog

**2026-01-07**: Removed photo generation mode

- Archived all generation-related code
- Simplified app to photo enhancement only
- Maintained all code in legacy folder for future use

---

**Note**: All original functionality is preserved here and can be restored if needed.
