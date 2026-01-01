'use server'

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { type TextType, type ToneType, MAX_CHARACTERS } from '@/app/constants/textLimits'

interface EnhanceTextResult {
  success: boolean
  text?: string
  error?: string
}

export async function enhanceInvitationText(
  textType: TextType,
  userText: string,
  locale: string = 'en',
  tone: ToneType = 'classic'
): Promise<EnhanceTextResult> {
  try {
    if (!userText || userText.trim().length < 5) {
      return {
        success: false,
        error: 'Please write at least a few words.',
      }
    }

    const maxChars = MAX_CHARACTERS[textType]

    // Instruções de idioma
    const localeInstructions: Record<string, string> = {
      pt: `Output Language: Portuguese (Brazil). Context: Wedding invitation.`,
      es: `Output Language: Spanish. Context: Wedding invitation.`,
      en: `Output Language: English. Context: Wedding invitation.`,
    }

    // Contexto do tipo de texto
    const textTypeContext: Record<TextType, string> = {
      greeting: 'Context: Opening greeting.',
      story: "Context: Couple's love story.",
      closing: 'Context: Closing message.',
    }

    // Instruções de tom
    const toneInstructions: Record<ToneType, string> = {
      classic: `Tone: Classic and timeless. Use elegant, formal language with refined expressions. Think traditional wedding invitations with graceful prose.`,
      modern: `Tone: Modern and fresh. Use contemporary language that feels personal and authentic. Keep it warm but not overly formal.`,
      biblical: `Tone: Biblical and spiritual. Incorporate subtle religious references and blessings. Use reverent, sacred language that reflects faith and divine love.`,
      humorous: `Tone: Lighthearted and witty. Add gentle humor and playful expressions while maintaining warmth. Keep it fun but still appropriate for a wedding.`,
    }

    const systemPrompt = `You are an expert wedding invitation editor.
${localeInstructions[locale] || localeInstructions.en}
${textTypeContext[textType]}
${toneInstructions[tone]}

Rules:
1. Maintain the original meaning.
2. Fix grammar/spelling.
3. Elevate the text according to the specified tone.
4. Do NOT use quotation marks.
5. Return ONLY the enhanced text.
6. It must have complete meaning and proper sentence structure.
7. Maximum ${maxChars} characters.`

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      prompt: userText,
      maxTokens: 2048,
      temperature: 0.7,
    })

    const text = result.text?.trim()

    if (!text) {
      throw new Error('No text generated')
    }

    // Limpeza
    let cleanText = text
      .replace(/^["']|["']$/g, '')
      .replace(/^Enhanced text:\s*/i, '')
      .trim()

    return {
      success: true,
      text: cleanText,
    }
  } catch (error) {
    console.error('Error enhancing invitation text:', error)
    return {
      success: false,
      error: 'Failed to enhance text. Please try again.',
    }
  }
}