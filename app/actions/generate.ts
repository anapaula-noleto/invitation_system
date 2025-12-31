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
    const prompt = `You are a professional wedding invitation designer tasked with creating an ultra-high-end fold-out card design.

I'm providing a photo of a couple. Create a FOLD-OUT WEDDING INVITATION with TWO PANELS side by side in a single image.

CRITICAL LAYOUT REQUIREMENT:
The final image must be a HORIZONTAL composition with TWO EQUAL PANELS side by side:
- LEFT PANEL (Front Cover): This is the OUTSIDE of the card when folded
- RIGHT PANEL (Inside): This is revealed when the card opens

The panels should have a subtle vertical dividing line or fold indicator in the center.

PHASE 1: PHOTO TRANSFORMATION & RETOUCHING
First, transform the raw input photo into a world-class studio portrait.
- Lighting & Atmosphere: Apply flattering, warm softbox studio lighting.
- Background Replacement: Replace with a gently blurred, luxurious studio setting.
- Facial & Smile Enhancement: Perform photorealistic retouching with natural-looking improvements.

PHASE 2: FOLD-OUT CARD DESIGN

LEFT PANEL (Front Cover - seen when card is closed):
- Feature an elegant, sophisticated cover design
- Include the couple's names "${names.partner1} & ${names.partner2}" in beautiful script
- Add decorative floral/botanical elements framing the design
- Use a luxurious, romantic aesthetic (ivory, blush, gold accents)
- Keep this panel more minimal and intriguing

RIGHT PANEL (Inside - revealed when opened):
- Place the transformed couple's portrait as the centerpiece
- Frame the photo elegantly within the design
- Include the full invitation text beautifully arranged:
  - "Request the pleasure of your company"
  - "at their wedding celebration"
  - "${weddingDate}"
  - "${venue}"
- Continue the floral/botanical theme from the cover
- More detailed and informative than the cover

IMPORTANT: Both panels must have matching aesthetics, color palette, and design elements that flow together as one cohesive piece. The image should be suitable for UV-mapping onto a 3D fold-out card.`;

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
            aspectRatio: '16:9', // Wide aspect ratio for two-panel fold-out
            imageSize: '2K',
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
