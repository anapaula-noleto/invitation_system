import type {
  InvitationConfig,
  TemplateMetadata,
  TemplateId,
} from '../types/invitation';

/**
 * Templates disponíveis no sistema
 */
export const AVAILABLE_TEMPLATES: TemplateMetadata[] = [
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Design elegante e atemporal com tipografia serifada e ornamentos dourados',
    previewImageUrl: '/templates/classic-preview.jpg',
    defaultTheme: {
      primaryColor: '#c9a961',
      secondaryColor: '#2c2c2c',
      backgroundColor: '#fdfbf7',
      textColor: '#2c2c2c',
      fontFamily: 'playfair',
    },
  },
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Linhas limpas e minimalistas com tipografia sans-serif contemporânea',
    previewImageUrl: '/templates/modern-preview.jpg',
    defaultTheme: {
      primaryColor: '#1a1a1a',
      secondaryColor: '#d4b978',
      backgroundColor: '#0a0a0a',
      textColor: '#ffffff',
      fontFamily: 'montserrat',
    },
  },
  {
    id: 'rustic',
    name: 'Rústico',
    description: 'Inspirado na natureza com tons terrosos e elementos botânicos',
    previewImageUrl: '/templates/rustic-preview.jpg',
    defaultTheme: {
      primaryColor: '#5d4e37',
      secondaryColor: '#8b9a6b',
      backgroundColor: '#f5f1e8',
      textColor: '#3a3a3a',
      fontFamily: 'lora',
    },
  },
  {
    id: 'minimal',
    name: 'Minimalista',
    description: 'Espaço em branco generoso com foco na tipografia e simplicidade',
    previewImageUrl: '/templates/minimal-preview.jpg',
    defaultTheme: {
      primaryColor: '#333333',
      secondaryColor: '#999999',
      backgroundColor: '#ffffff',
      textColor: '#333333',
      fontFamily: 'josefin',
    },
  },
  {
    id: 'romantic',
    name: 'Romântico',
    description: 'Tons suaves de rosa e elementos florais delicados',
    previewImageUrl: '/templates/romantic-preview.jpg',
    defaultTheme: {
      primaryColor: '#b76e79',
      secondaryColor: '#f5d0c5',
      backgroundColor: '#fff5f7',
      textColor: '#5a4a4a',
      fontFamily: 'cormorant',
    },
  },
];

/**
 * Convite mock para testes
 */
export const MOCK_INVITATION: InvitationConfig = {
  id: 'inv_mock_001',
  templateId: 'classic',
  content: {
    partner1Name: 'Maria Clara',
    partner2Name: 'João Pedro',
    weddingDate: 'Sábado, 15 de Junho de 2025',
    venue: 'Fazenda Santa Helena, Campinas - SP',
    photoUrls: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
      'https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=800',
    ],
  },
  theme: {
    primaryColor: '#c9a961',
    secondaryColor: '#2c2c2c',
    backgroundColor: '#fdfbf7',
    textColor: '#2c2c2c',
    fontFamily: 'playfair',
  },
  createdAt: new Date('2025-01-15T10:00:00'),
  updatedAt: new Date('2025-01-15T10:00:00'),
};

/**
 * Segundo convite mock para demonstrar variação
 */
export const MOCK_INVITATION_MODERN: InvitationConfig = {
  id: 'inv_mock_002',
  templateId: 'modern',
  content: {
    partner1Name: 'Ana Beatriz',
    partner2Name: 'Lucas Gabriel',
    weddingDate: 'Domingo, 22 de Setembro de 2025',
    venue: 'Espaço Gardens, São Paulo - SP',
    photoUrls: [
      'https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=800',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800',
    ],
  },
  theme: {
    primaryColor: '#1a1a1a',
    secondaryColor: '#d4b978',
    backgroundColor: '#0a0a0a',
    textColor: '#ffffff',
    fontFamily: 'montserrat',
  },
  createdAt: new Date('2025-01-20T14:30:00'),
  updatedAt: new Date('2025-01-20T14:30:00'),
};

/**
 * Helper para buscar um template por ID
 */
export function getTemplateById(id: TemplateId): TemplateMetadata | undefined {
  return AVAILABLE_TEMPLATES.find((template) => template.id === id);
}

/**
 * Helper para criar um novo convite com valores padrão
 */
export function createEmptyInvitation(templateId: TemplateId): InvitationConfig {
  const template = getTemplateById(templateId);
  const now = new Date();

  return {
    id: `inv_${Date.now()}`,
    templateId,
    content: {
      partner1Name: '',
      partner2Name: '',
      weddingDate: '',
      venue: '',
      photoUrls: ['', '', ''],
    },
    theme: template?.defaultTheme ?? {
      primaryColor: '#c9a961',
      secondaryColor: '#2c2c2c',
      backgroundColor: '#fdfbf7',
      textColor: '#2c2c2c',
      fontFamily: 'playfair',
    },
    createdAt: now,
    updatedAt: now,
  };
}
