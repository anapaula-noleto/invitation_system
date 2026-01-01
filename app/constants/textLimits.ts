export type TextType = 'greeting' | 'story' | 'closing';

export type ToneType = 'classic' | 'modern' | 'biblical' | 'humorous';

// Maximum characters per text type
export const MAX_CHARACTERS: Record<TextType, number> = {
  greeting: 150,
  story: 300,
  closing: 150,
};
