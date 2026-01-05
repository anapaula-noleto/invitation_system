'use client';

import { useTranslations } from 'next-intl';
import type { InvitationConfig } from '@/app/types/invitation';
import { ClassicTemplate, ModernTemplate } from './templates';
import { InvitationTranslationsProvider, type InvitationTranslations } from '@/app/context/InvitationTranslationsContext';

interface InvitationRendererProps {
  config: InvitationConfig;
}

/**
 * Componente responsável por renderizar o template correto
 * baseado no templateId da configuração
 */
export function InvitationRenderer({ config }: InvitationRendererProps) {
  const t = useTranslations('invitation');
  
  const invitationTranslations: InvitationTranslations = {
    together: t('together'),
    saveDate: t('saveDate'),
    location: t('where'),
    receptionVenue: t('receptionVenue'),
    ourStory: t('ourStory'),
    footerText: t('joinUs'),
    invitationBadge: t('requestHonor'),
  };

  const TemplateComponent = () => {
    switch (config.templateId) {
      case 'classic':
        return <ClassicTemplate config={config} />;
      case 'modern':
        return <ModernTemplate config={config} />;
      case 'rustic':
        // TODO: Implementar RusticTemplate
        return <ClassicTemplate config={config} />;
      case 'minimal':
        // TODO: Implementar MinimalTemplate
        return <ModernTemplate config={config} />;
      case 'romantic':
        // TODO: Implementar RomanticTemplate
        return <ClassicTemplate config={config} />;
      default:
        // Fallback para o template clássico
        return <ClassicTemplate config={config} />;
    }
  };

  return (
    <InvitationTranslationsProvider translations={invitationTranslations}>
      <TemplateComponent />
    </InvitationTranslationsProvider>
  );
}
