'use client';

import { useTranslations } from 'next-intl';
import { FileText, Sparkles, Download, Image } from 'lucide-react';
import { InvitationRenderer } from '@/app/components/InvitationRenderer';
import { Button, Tabs, TabList, Tab, TabPanel } from '@/app/components/ui';
import type { InvitationConfig } from '@/app/types/invitation';

interface PreviewSectionProps {
  invitationConfig: InvitationConfig;
  generatedImage: string | null;
  activePreviewTab: string;
  onPreviewTabChange: (tabId: string) => void;
  onDownload: () => void;
  onUsePhotos: () => void;
}

export function PreviewSection({
  invitationConfig,
  generatedImage,
  activePreviewTab,
  onPreviewTabChange,
  onDownload,
  onUsePhotos,
}: PreviewSectionProps) {
  const t = useTranslations();

  return (
    <section className="preview-section">
      <div className="preview-card">
        <Tabs defaultTab="template" activeTab={activePreviewTab} onTabChange={onPreviewTabChange}>
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
                  <Button onClick={onDownload} variant="secondary" leftIcon={<Download size={16} />}>
                    {t('preview.actions.download')}
                  </Button>
                  <Button onClick={onUsePhotos} variant="primary" leftIcon={<Image size={16} />}>
                    {t('preview.actions.usePhotos')}
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
