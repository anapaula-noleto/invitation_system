'use server'

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

interface GenerateInvitationResult {
  success: boolean
  imageUrl?: string
  error?: string
}

export async function generateWeddingInvitation(
  couplePhotoBase64: string,
  names: { partner1: string; partner2: string },
  weddingDate: string,
  venue: string
): Promise<GenerateInvitationResult> {
  try {
    const prompt = `You are a professional wedding invitation designer tasked with creating an ultra-high-end masterpiece.

I'm providing a photo of a couple. You must execute a two-phase process to achieve a flawless result.

PHASE 1: PHOTO TRANSFORMATION & RETOUCHING
First, transform the raw input photo into a world-class studio portrait.
- Lighting & Atmosphere: Apply flattering, warm softbox studio lighting that creates gentle shadows and highlights, giving depth to the subjects.
- Background Replacement: Replace the original background with a gently blurred, luxurious studio setting (e.g., an textured architectural wall, opulent soft drapes, with warm bokeh lights).
- Facial & Smile Enhancement (CRITICAL): Perform photorealistic, high-end retouching. Specifically focus on ensuring smiles appear natural, genuine, and relaxed. Apply subtle, natural-looking whitening to teeth, correcting any yellowness while maintaining realistic texture so they don't look artificial. Ensure skin texture looks healthy but real.

PHASE 2: INVITATION DESIGN
Then, using this newly generated, flawless studio portrait, create an elegant, romantic wedding invitation.
1. Integration: Naturally integrate the new professional studio portrait as the absolute centerpiece, elegantly framed within the design.
2. Aesthetics: Feature a sophisticated floral or botanical border design with elegant decorative flourishes.
3. Typography: Use classic wedding typography, combining delicate script for names/headers with clean serif fonts for details.
4. Color Palette: Use a soft, luxurious romantic palette (ivory, blush, champagne gold accents).
5. Text Content: Beautifully render the following text with appropriate spacing and hierarchy:
   - "${names.partner1} & ${names.partner2}"
   - "Request the pleasure of your company"
   - "at their wedding celebration"
   - "${weddingDate}"
   - "${venue}"

The final image must look like a premium, professionally printed wedding invitation of the highest possible quality.`;

    const result = await generateText({
      model: google('gemini-3-pro-image-preview'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              image: couplePhotoBase64,
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      providerOptions: {
        google: {
          responseModalities: ['IMAGE'],
          imageConfig: {
            aspectRatio: '3:4', // Retrato é perfeito para convites
            imageSize: '4K',     // Mantém a solicitação de resolução máxima
          },
        },
      },
    })


    const imageFile = result.files?.[0]

    if (!imageFile?.base64) {
      return {
        success: false,
        error: 'No image was generated. Please try again.',
      }
    }

    const imageUrl = `data:image/png;base64,${imageFile.base64}`

    return {
      success: true,
      imageUrl,
    }
  } catch (error) {
    console.error('Error generating invitation:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate invitation',
    }
  }
}
