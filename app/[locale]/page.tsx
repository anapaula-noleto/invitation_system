'use client';

import { LanguageSelector } from '@/app/components/ui';
import { useInvitationForm } from './_hooks';
import {
  BackgroundDecoration,
  PageHeader,
  InvitationFormSection,
  PreviewSection,
} from './_components';

/**
 * Home Page - Wedding Invitation Generator
 * 
 * This page composes all the main sections of the invitation generator.
 * State management is handled by the useInvitationForm hook.
 */
export default function Home() {
  const form = useInvitationForm();

  return (
    <main className="main-container">
      <BackgroundDecoration />

      <div className="content-wrapper">
        {/* Language Selector */}
        <LanguageSelector />
        
        {/* Header */}
        <PageHeader />

        <div className="main-content">
          {/* Form Section */}
          <InvitationFormSection
            photos={form.photos}
            photoStyle={form.photoStyle}
            partner1={form.partner1}
            partner2={form.partner2}
            weddingDate={form.weddingDate}
            venue={form.venue}
            receptionVenue={form.receptionVenue}
            hasSeparateReceptionVenue={form.hasSeparateReceptionVenue}
            selectedTemplate={form.selectedTemplate}
            selectedPalette={form.selectedPalette}
            customGreeting={form.customGreeting}
            customStory={form.customStory}
            customClosing={form.customClosing}
            locale={form.locale}
            isLoading={form.isLoading}
            error={form.error}
            generatedImages={form.generatedImages}
            onPhotosChange={form.handlePhotosChange}
            onPhotoStyleChange={form.handlePhotoStyleChange}
            onPartner1Change={form.setPartner1}
            onPartner2Change={form.setPartner2}
            onDateChange={form.handleDateChange}
            onVenueChange={form.setVenue}
            onReceptionVenueChange={form.setReceptionVenue}
            onHasSeparateReceptionVenueChange={form.setHasSeparateReceptionVenue}
            onTemplateChange={form.setSelectedTemplate}
            onPaletteSelect={form.handlePaletteSelect}
            onCustomGreetingChange={form.setCustomGreeting}
            onCustomStoryChange={form.setCustomStory}
            onCustomClosingChange={form.setCustomClosing}
            onSubmit={form.handleGenerate}
            onDownload={form.handleDownload}
            onUsePhotos={form.handleUsePhotos}
          />

          {/* Preview Section */}
          <PreviewSection
            invitationConfig={form.invitationConfig}
          />
        </div>
      </div>
    </main>
  );
}
