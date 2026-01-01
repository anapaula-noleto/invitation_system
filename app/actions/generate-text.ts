'use server'

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'
import { type TextType, MAX_CHARACTERS } from '@/app/constants/textLimits'

interface EnhanceTextResult {
  success: boolean
  text?: string
  error?: string
}

export async function enhanceInvitationText(
  textType: TextType,
  userText: string,
  locale: string = 'en'
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

    const systemPrompt = `You are an expert wedding invitation editor.
${localeInstructions[locale] || localeInstructions.en}
${textTypeContext[textType]}

Rules:
1. PRESERVE the original tone and style of the user's text (formal, casual, humorous, religious, etc.).
2. Fix grammar and spelling errors.
3. Make it slightly more elegant while keeping the user's voice and personality.
4. Do NOT change the tone - if they wrote something funny, keep it funny. If religious, keep it religious.
5. Do NOT use quotation marks.
6. Return ONLY the enhanced text.
7. It must have complete meaning and proper sentence structure.
8. Maximum ${maxChars} characters.`

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      prompt: userText,
      maxTokens: 2048,
      temperature: 0.5, // Lower temperature to preserve user's style
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