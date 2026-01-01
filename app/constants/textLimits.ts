export type TextType = 'greeting' | 'story' | 'closing';

// Maximum characters per text type
export const MAX_CHARACTERS: Record<TextType, number> = {
  greeting: 150,
  story: 300,
  closing: 150,
};
