/**
 * Wedding Color Palettes
 * 
 * Curated color palettes for wedding invitations.
 * Each palette includes:
 * - primary: Main accent color (buttons, headers, decorative elements)
 * - secondary: Supporting accent color (subtle highlights, borders)
 * - background: Page background color
 * - text: Main text color for readability
 */

export interface WeddingPalette {
  id: string;
  label: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
}

export const WEDDING_PALETTES: WeddingPalette[] = [
  {
    id: 'olive',
    label: 'Verde Oliva (Natureza)',
    colors: {
      primary: '#556B2F', // O verde do envelope e botões
      secondary: '#8F9779', // Verde suave para detalhes
      background: '#F9F8F4', // Creme off-white (papel)
      text: '#2F3325', // Verde quase preto (leitura)
    },
  },
  {
    id: 'terracotta',
    label: 'Terracota (Boho)',
    colors: {
      primary: '#C05832',
      secondary: '#D98E73',
      background: '#FAF3F0',
      text: '#4A2C25',
    },
  },
  {
    id: 'serenity',
    label: 'Azul Serenity (Clássico)',
    colors: {
      primary: '#91A8D0',
      secondary: '#B8C9E6',
      background: '#F5F7FA',
      text: '#2C3E50',
    },
  },
  {
    id: 'marsala',
    label: 'Marsala (Romântico)',
    colors: {
      primary: '#955251',
      secondary: '#C78B8B',
      background: '#FFF5F5',
      text: '#421C1C',
    },
  },
  {
    id: 'classic_gold',
    label: 'Dourado & Branco (Luxo)',
    colors: {
      primary: '#C5A059', // Dourado fosco
      secondary: '#E5D3B3',
      background: '#FFFFFF',
      text: '#333333',
    },
  },
];

/**
 * Get a palette by its ID
 */
export function getPaletteById(id: string): WeddingPalette | undefined {
  return WEDDING_PALETTES.find((p) => p.id === id);
}

/**
 * Get the default palette (classic gold)
 */
export function getDefaultPalette(): WeddingPalette {
  return WEDDING_PALETTES.find((p) => p.id === 'classic_gold') || WEDDING_PALETTES[0];
}
