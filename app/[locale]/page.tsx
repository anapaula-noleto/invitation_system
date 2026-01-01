'use client';

import { Card3DPreview } from '@/app/components/Card3DPreview';
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
            photoPreview={form.photoPreview}
            partner1={form.partner1}
            partner2={form.partner2}
            weddingDate={form.weddingDate}
            venue={form.venue}
            selectedTemplate={form.selectedTemplate}
            selectedPalette={form.selectedPalette}
            customGreeting={form.customGreeting}
            customStory={form.customStory}
            customClosing={form.customClosing}
            locale={form.locale}
            isLoading={form.isLoading}
            error={form.error}
            onPhotoChange={form.handlePhotoChange}
            onPhotoClear={form.handlePhotoClear}
            onPartner1Change={form.setPartner1}
            onPartner2Change={form.setPartner2}
            onDateChange={form.handleDateChange}
            onVenueChange={form.setVenue}
            onTemplateChange={form.setSelectedTemplate}
            onPaletteSelect={form.handlePaletteSelect}
            onCustomGreetingChange={form.setCustomGreeting}
            onCustomStoryChange={form.setCustomStory}
            onCustomClosingChange={form.setCustomClosing}
            onVenueMapClick={form.openVenueInMaps}
            onSubmit={form.handleGenerate}
          />

          {/* Preview Section */}
          <PreviewSection
            invitationConfig={form.invitationConfig}
            generatedImage={form.generatedImage}
            showTemplatePreview={form.showTemplatePreview}
            onTogglePreview={form.setShowTemplatePreview}
            onDownload={form.handleDownload}
            onView3D={() => form.setShow3DPreview(true)}
          />
        </div>
      </div>

      {/* 3D Preview Modal */}
      {form.show3DPreview && form.generatedImage && (
        <Card3DPreview 
          imageUrl={form.generatedImage} 
          onClose={() => form.setShow3DPreview(false)} 
        />
      )}
    </main>
  );
}
