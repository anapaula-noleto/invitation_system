'use client';

import { useTranslations } from 'next-intl';
import { FileText, Sparkles } from 'lucide-react';
import { InvitationRenderer } from '@/app/components/InvitationRenderer';
import { Button, Tabs, TabList, Tab, TabPanel } from '@/app/components/ui';
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
        <Tabs defaultTab="template">
          <TabList>
            <Tab id="template" icon={<FileText size={16} />}>
              {t('preview.tabs.template')}
            </Tab>
            <Tab id="generated" icon={<Sparkles size={16} />}>
              {t('preview.tabs.generated')}
            </Tab>
          </TabList>

          {/* Real-time template preview */}
          <TabPanel id="template">
            <div className="template-preview-container">
              <InvitationRenderer config={invitationConfig} />
            </div>
          </TabPanel>

          {/* Generated image */}
          <TabPanel id="generated">
            {generatedImage ? (
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
          </TabPanel>
        </Tabs>
      </div>
    </section>
  );
}
