import type { TextType } from './textLimits';

type Locale = 'pt' | 'en' | 'es';

interface SuggestionChip {
  id: string;
  label: string; // Short label for the chip button
  text: string;  // Full text to insert
}

interface TextTypeConfig {
  placeholder: string;
  suggestions: SuggestionChip[];
}

interface LocaleUXConfig {
  textTypes: Record<TextType, TextTypeConfig>;
}

export const UX_CONFIG: Record<Locale, LocaleUXConfig> = {
  // ============================================
  // PORTUGUÊS (BRASIL)
  // ============================================
  pt: {
    textTypes: {
      greeting: {
        placeholder: 'Ex: "Com imensa alegria, convidamos você para celebrar..."',
        suggestions: [
          {
            id: 'greeting-formal',
            label: '✨ Formal',
            text: 'Com imensa alegria e gratidão a Deus, temos a honra de convidar você para celebrar conosco o início de nossa vida a dois.',
          },
          {
            id: 'greeting-casual',
            label: '💕 Descontraído',
            text: 'Finalmente chegou o grande dia! Queremos você com a gente para celebrar nosso amor e comer muito bolo!',
          },
          {
            id: 'greeting-short',
            label: '📝 Curto',
            text: 'Venha celebrar o nosso amor! Sua presença tornará este dia ainda mais especial.',
          },
        ],
      },
      story: {
        placeholder: 'Ex: "Nos conhecemos em 2019 quando..."',
        suggestions: [
          {
            id: 'story-romantic',
            label: '💑 Romântico',
            text: 'Nos conhecemos por acaso, em um momento que mudou nossas vidas para sempre. O que começou com um simples olhar se transformou em um amor que cresce a cada dia.',
          },
          {
            id: 'story-funny',
            label: '😄 Divertido',
            text: 'Ele disse que foi amor à primeira vista. Ela disse que ele era insistente demais. Três anos depois, cá estamos nós provando que a persistência vence!',
          },
          {
            id: 'story-simple',
            label: '📝 Simples',
            text: 'Nossa história começou com uma amizade que floresceu em amor. Hoje, com corações cheios de gratidão, damos o próximo passo juntos.',
          },
        ],
      },
      closing: {
        placeholder: 'Ex: "Contamos com sua presença para abençoar..."',
        suggestions: [
          {
            id: 'closing-formal',
            label: '✨ Formal',
            text: 'Será uma honra tê-lo conosco neste momento tão especial. Aguardamos ansiosamente sua presença para abençoar nossa união.',
          },
          {
            id: 'closing-casual',
            label: '💕 Descontraído',
            text: 'Não esqueça o lenço para as lágrimas de emoção e o sapato confortável para dançar a noite toda. Te esperamos!',
          },
          {
            id: 'closing-short',
            label: '📝 Curto',
            text: 'Com amor e carinho, esperamos por você!',
          },
        ],
      },
    },
  },

  // ============================================
  // ENGLISH
  // ============================================
  en: {
    textTypes: {
      greeting: {
        placeholder: 'Ex: "With great joy, we invite you to celebrate..."',
        suggestions: [
          {
            id: 'greeting-formal',
            label: '✨ Formal',
            text: 'With immense joy and gratitude, we have the honor of inviting you to celebrate with us the beginning of our life together.',
          },
          {
            id: 'greeting-casual',
            label: '💕 Casual',
            text: 'The big day has finally arrived! We want you there to celebrate our love and eat way too much cake!',
          },
          {
            id: 'greeting-short',
            label: '📝 Short',
            text: 'Come celebrate our love! Your presence will make this day even more special.',
          },
        ],
      },
      story: {
        placeholder: 'Ex: "We met in 2019 when..."',
        suggestions: [
          {
            id: 'story-romantic',
            label: '💑 Romantic',
            text: 'We met by chance, in a moment that changed our lives forever. What started with a simple glance turned into a love that grows stronger every day.',
          },
          {
            id: 'story-funny',
            label: '😄 Funny',
            text: 'He said it was love at first sight. She said he was too persistent. Three years later, here we are proving that persistence pays off!',
          },
          {
            id: 'story-simple',
            label: '📝 Simple',
            text: 'Our story began with a friendship that blossomed into love. Today, with hearts full of gratitude, we take the next step together.',
          },
        ],
      },
      closing: {
        placeholder: 'Ex: "We look forward to celebrating with you..."',
        suggestions: [
          {
            id: 'closing-formal',
            label: '✨ Formal',
            text: 'It will be an honor to have you with us on this special day. We eagerly await your presence to bless our union.',
          },
          {
            id: 'closing-casual',
            label: '💕 Casual',
            text: "Don't forget tissues for the happy tears and comfortable shoes to dance the night away. See you there!",
          },
          {
            id: 'closing-short',
            label: '📝 Short',
            text: 'With love, we look forward to seeing you!',
          },
        ],
      },
    },
  },

  // ============================================
  // ESPAÑOL
  // ============================================
  es: {
    textTypes: {
      greeting: {
        placeholder: 'Ej: "Con inmensa alegría, los invitamos a celebrar..."',
        suggestions: [
          {
            id: 'greeting-formal',
            label: '✨ Formal',
            text: 'Con inmensa alegría y gratitud a Dios, tenemos el honor de invitarlos a celebrar con nosotros el inicio de nuestra vida juntos.',
          },
          {
            id: 'greeting-casual',
            label: '💕 Informal',
            text: '¡Por fin llegó el gran día! Los queremos con nosotros para celebrar nuestro amor y comer mucho pastel.',
          },
          {
            id: 'greeting-short',
            label: '📝 Corto',
            text: '¡Vengan a celebrar nuestro amor! Su presencia hará este día aún más especial.',
          },
        ],
      },
      story: {
        placeholder: 'Ej: "Nos conocimos en 2019 cuando..."',
        suggestions: [
          {
            id: 'story-romantic',
            label: '💑 Romántico',
            text: 'Nos conocimos por casualidad, en un momento que cambió nuestras vidas para siempre. Lo que comenzó con una simple mirada se transformó en un amor que crece cada día.',
          },
          {
            id: 'story-funny',
            label: '😄 Divertido',
            text: 'Él dijo que fue amor a primera vista. Ella dijo que era demasiado insistente. Tres años después, ¡aquí estamos demostrando que la persistencia funciona!',
          },
          {
            id: 'story-simple',
            label: '📝 Simple',
            text: 'Nuestra historia comenzó con una amistad que floreció en amor. Hoy, con corazones llenos de gratitud, damos el siguiente paso juntos.',
          },
        ],
      },
      closing: {
        placeholder: 'Ej: "Esperamos contar con su presencia..."',
        suggestions: [
          {
            id: 'closing-formal',
            label: '✨ Formal',
            text: 'Será un honor tenerlos con nosotros en este día tan especial. Esperamos ansiosamente su presencia para bendecir nuestra unión.',
          },
          {
            id: 'closing-casual',
            label: '💕 Informal',
            text: 'No olviden los pañuelos para las lágrimas de emoción y zapatos cómodos para bailar toda la noche. ¡Los esperamos!',
          },
          {
            id: 'closing-short',
            label: '📝 Corto',
            text: 'Con cariño, ¡los esperamos!',
          },
        ],
      },
    },
  },
};

// Helper function to get config for a specific locale
export function getUXConfig(locale: string): LocaleUXConfig {
  const validLocale = (locale in UX_CONFIG ? locale : 'en') as Locale;
  return UX_CONFIG[validLocale];
}

// Helper to get suggestions for a specific text type
export function getSuggestions(locale: string, textType: TextType): SuggestionChip[] {
  return getUXConfig(locale).textTypes[textType].suggestions;
}

// Helper to get placeholder for a specific text type
export function getPlaceholder(locale: string, textType: TextType): string {
  return getUXConfig(locale).textTypes[textType].placeholder;
}

// Export types for use in components
export type { SuggestionChip, TextTypeConfig, LocaleUXConfig };
