/**
 * Sistema de Templates de Convites
 * Define a estrutura de configuração para convites de casamento
 */

/** Identificadores de templates disponíveis */
export type TemplateId = 'classic' | 'modern' | 'rustic' | 'minimal' | 'romantic';

/** Conteúdo do convite */
export interface InvitationContent {
  /** Nome do primeiro parceiro */
  partner1Name: string;
  /** Nome do segundo parceiro */
  partner2Name: string;
  /** Data do casamento (formato legível, ex: "Sábado, 15 de Junho de 2025") */
  weddingDate: string;
  /** Local da cerimônia/festa */
  venue: string;
  /** URLs das 3 fotos do casal */
  photoUrls: [string, string, string];
}

/** Tema visual do convite */
export interface InvitationTheme {
  /** Cor primária (hex) - usada em títulos e elementos principais */
  primaryColor: string;
  /** Cor secundária (hex) - usada em detalhes e acentos */
  secondaryColor: string;
  /** Família tipográfica para o convite */
  fontFamily: 'playfair' | 'cormorant' | 'montserrat' | 'lora' | 'josefin';
}

/** Configuração completa de um convite */
export interface InvitationConfig {
  /** Identificador único do convite */
  id: string;
  /** Template selecionado */
  templateId: TemplateId;
  /** Conteúdo textual e fotos */
  content: InvitationContent;
  /** Configurações visuais */
  theme: InvitationTheme;
  /** Data de criação */
  createdAt: Date;
  /** Data da última atualização */
  updatedAt: Date;
}

/** Metadados de um template disponível */
export interface TemplateMetadata {
  id: TemplateId;
  name: string;
  description: string;
  previewImageUrl: string;
  defaultTheme: InvitationTheme;
}
