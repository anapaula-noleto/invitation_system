'use server'

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

export type TextType = 'greeting' | 'story' | 'closing'

interface GenerateTextResult {
  success: boolean
  text?: string
  error?: string
}

const TEXT_PROMPTS: Record<TextType, (names: { partner1: string; partner2: string }, locale: string) => string> = {
  greeting: (names, locale) => {
    const localeInstructions: Record<string, string> = {
      pt: 'Escreva em português brasileiro formal e elegante.',
      es: 'Escribe en español elegante y formal.',
      en: 'Write in elegant, formal English.',
    }
    return `You are a romantic wedding invitation writer. Create an elegant, heartfelt opening greeting for a wedding invitation.

The couple's names are: ${names.partner1} & ${names.partner2}

Requirements:
- ${localeInstructions[locale] || localeInstructions.en}
- Keep it SHORT: maximum 2 sentences (under 30 words)
- Romantic and sophisticated tone
- Do NOT include the names in the text (they will be shown separately)
- Do NOT use quotation marks
- Just write the greeting text directly

Example style: "Together with their families, we joyfully invite you to celebrate our union in love."`
  },

  story: (names, locale) => {
    const localeInstructions: Record<string, string> = {
      pt: 'Escreva em português brasileiro poético e romântico.',
      es: 'Escribe en español poético y romántico.',
      en: 'Write in poetic, romantic English.',
    }
    return `You are a romantic wedding invitation writer. Create a brief, poetic "Our Story" paragraph for a wedding invitation.

The couple's names are: ${names.partner1} & ${names.partner2}

Requirements:
- ${localeInstructions[locale] || localeInstructions.en}
- Keep it SHORT: 2-3 sentences (under 50 words)
- Evoke emotions about love, destiny, and the journey together
- Generic enough to apply to any couple
- Do NOT include specific details or dates
- Do NOT use quotation marks
- Just write the story text directly

Example style: "From the moment our paths crossed, we knew our souls were meant to dance together. Every shared smile and whispered dream has led us to this beautiful beginning."`
  },

  closing: (names, locale) => {
    const localeInstructions: Record<string, string> = {
      pt: 'Escreva em português brasileiro elegante e caloroso.',
      es: 'Escribe en español elegante y cálido.',
      en: 'Write in elegant, warm English.',
    }
    return `You are a romantic wedding invitation writer. Create an elegant closing message for a wedding invitation.

The couple's names are: ${names.partner1} & ${names.partner2}

Requirements:
- ${localeInstructions[locale] || localeInstructions.en}
- Keep it SHORT: 1-2 sentences (under 25 words)
- Warm invitation to join the celebration
- Express gratitude and excitement
- Do NOT use quotation marks
- Just write the closing text directly

Example style: "Your presence would make our special day complete. We can't wait to celebrate with you."`
  },
}

export async function generateInvitationText(
  textType: TextType,
  names: { partner1: string; partner2: string },
  locale: string = 'en'
): Promise<GenerateTextResult> {
  try {
    if (!names.partner1 || !names.partner2) {
      return {
        success: false,
        error: 'Please enter both partners\' names first.',
      }
    }

    const prompt = TEXT_PROMPTS[textType](names, locale)

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
      maxTokens: 100,
      temperature: 0.8,
    })

    const text = result.text?.trim()

    if (!text) {
      return {
        success: false,
        error: 'No text was generated. Please try again.',
      }
    }

    // Remove quotation marks if present
    const cleanText = text.replace(/^["']|["']$/g, '').trim()

    return {
      success: true,
      text: cleanText,
    }
  } catch (error) {
    console.error('Error generating invitation text:', error)
    return {
      success: false,
      error: 'Failed to generate text. Please try again.',
    }
  }
}
