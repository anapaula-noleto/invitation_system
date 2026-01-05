'use client';

import { useTranslations } from 'next-intl';
import { InvitationRenderer } from '@/app/components/InvitationRenderer';
import { Button, ToggleButtonGroup } from '@/app/components/ui';
import type { InvitationConfig } from '@/app/types/invitation';

interface PreviewSectionProps {
  invitationConfig: InvitationConfig;
  generatedImage: string | null;
  showTemplatePreview: boolean;
  onTogglePreview: (showTemplate: boolean) => void;
  onDownload: () => void;
  onView3D: () => void;
}

export function PreviewSection({
  invitationConfig,
  generatedImage,
  showTemplatePreview,
  onTogglePreview,
  onDownload,
  onView3D,
}: PreviewSectionProps) {
  const t = useTranslations();

  return (
    <section className="preview-section">
      <div className="preview-card">
        {/* Toggle between template preview and generated image */}
        <ToggleButtonGroup
          value={showTemplatePreview ? 'template' : 'generated'}
          onChange={(v) => onTogglePreview(v === 'template')}
          options={[
            { value: 'template', label: t('preview.tabs.template'), icon: '📋' },
            { value: 'generated', label: t('preview.tabs.generated'), icon: '🎨' },
          ]}
        />

        {showTemplatePreview ? (
          /* Real-time template preview */
          <div className="template-preview-container">
            <InvitationRenderer config={invitationConfig} />
          </div>
        ) : generatedImage ? (
          <>
            <img 
              src={generatedImage} 
              alt="Generated wedding invitation" 
              className="generated-image"
            />
            <div className="button-group">
              <Button onClick={onDownload} variant="secondary" leftIcon="⬇️">
                {t('preview.actions.download')}
              </Button>
              <Button 
                onClick={onView3D} 
                variant="secondary"
                leftIcon="🎴"
              >
                {t('preview.actions.view3d')}
              </Button>
            </div>
          </>
        ) : (
          <div className="preview-placeholder">
            <div className="placeholder-frame">
              <span className="placeholder-icon">💒</span>
              <p className="placeholder-text">{t('preview.placeholder.text')}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
