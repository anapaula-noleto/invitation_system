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
    const prompt = `You are a professional wedding invitation designer. 
    
I'm providing a photo of a couple. Create an elegant, romantic wedding invitation that:
1. Naturally integrates this couple's photo into a beautiful wedding invitation layout
2. Features an elegant floral or botanical border design
3. Includes decorative elements like delicate script typography styling
4. Uses a soft, romantic color palette (ivory, blush, gold accents)
5. Has space for the following text (render it beautifully):
   - "${names.partner1} & ${names.partner2}"
   - "Request the pleasure of your company"
   - "at their wedding celebration"
   - "${weddingDate}"
   - "${venue}"

Make it look like a premium, professionally designed wedding invitation that someone would actually send. 
The couple's photo should be the centerpiece, elegantly framed within the invitation design.
Use classic wedding invitation typography and elegant decorative flourishes.`

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
            aspectRatio: '3:4', // Portrait orientation for invitation
            imageSize: '2K',     // Pro model supports 2K resolution
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
