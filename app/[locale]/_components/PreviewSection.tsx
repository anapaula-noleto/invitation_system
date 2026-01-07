'use client';

import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';
import { InvitationRenderer } from '@/app/components/InvitationRenderer';
import type { InvitationConfig } from '@/app/types/invitation';

interface PreviewSectionProps {
  invitationConfig: InvitationConfig;
}

export function PreviewSection({ invitationConfig }: PreviewSectionProps) {
  const t = useTranslations();

  return (
    <section className="preview-section">
      <div className="preview-card">
        <div className="preview-header">
          <FileText size={20} />
          <h3>{t('preview.tabs.template')}</h3>
        </div>
        <div className="template-preview-container">
          <InvitationRenderer config={invitationConfig} />
        </div>
      </div>
    </section>
  );
}
