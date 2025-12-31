'use client';

import type { InvitationConfig } from '@/app/types/invitation';
import { ClassicTemplate, ModernTemplate } from './templates';

interface InvitationRendererProps {
  config: InvitationConfig;
}

/**
 * Componente responsável por renderizar o template correto
 * baseado no templateId da configuração
 */
export function InvitationRenderer({ config }: InvitationRendererProps) {
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
}
