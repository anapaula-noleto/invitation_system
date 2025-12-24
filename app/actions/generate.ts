'use server'

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

export async function generateNewYearCard(
  imageBase64: string,
  mediaType: string,
  cityId: string,
  landmark: string
): Promise<{ success: boolean; image?: string; error?: string }> {
  try {
    const cityDetails: Record<string, { skyline: string; vibe: string; colors: string }> = {
      'new-york': {
        skyline: 'Manhattan skyline with Empire State Building, One World Trade Center, Times Square ball drop',
        vibe: 'electric energy, bright lights, urban glamour',
        colors: 'electric blues, bright whites, champagne gold',
      },
      'london': {
        skyline: 'Big Ben, London Eye, Tower Bridge with fireworks over the Thames',
        vibe: 'elegant, historic, sophisticated',
        colors: 'deep navy, warm gold, royal purple',
      },
      'paris': {
        skyline: 'Eiffel Tower sparkling with lights, Champs-Élysées, Arc de Triomphe',
        vibe: 'romantic, magical, luminous',
        colors: 'champagne gold, rose pink, midnight blue',
      },
      'tokyo': {
        skyline: 'Tokyo Tower, Rainbow Bridge, Shibuya Crossing with neon lights',
        vibe: 'futuristic, vibrant, dynamic',
        colors: 'neon pink, electric cyan, bright white',
      },
      'dubai': {
        skyline: 'Burj Khalifa with spectacular fireworks show, Dubai Frame, Palm Jumeirah',
        vibe: 'luxurious, spectacular, grandiose',
        colors: 'gold, silver, deep blue',
      },
      'sydney': {
        skyline: 'Sydney Opera House, Harbour Bridge with iconic fireworks display over the harbour',
        vibe: 'festive, colorful, celebratory',
        colors: 'ocean blue, sunset orange, bright gold',
      },
      'san-francisco': {
        skyline: 'Golden Gate Bridge, Transamerica Pyramid, city lights on the hills',
        vibe: 'iconic, misty, artistic',
        colors: 'fog grey, golden orange, deep teal',
      },
      'singapore': {
        skyline: 'Marina Bay Sands, Gardens by the Bay Supertrees, Singapore Flyer',
        vibe: 'modern, garden city, innovative',
        colors: 'emerald green, futuristic silver, warm gold',
      },
      'hong-kong': {
        skyline: 'Victoria Harbour, Bank of China Tower, Symphony of Lights show',
        vibe: 'dazzling, metropolitan, energetic',
        colors: 'neon rainbow, midnight blue, bright gold',
      },
    }

    const city = cityDetails[cityId] || cityDetails['new-york']

    const result = await generateText({
      model: google('gemini-3-pro-image-preview'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Create a FLAT Happy New Year 2026 celebration card texture using this person's face.

Generate a FLAT, 2D wide image with TWO SIDE-BY-SIDE PANELS (no 3D effects, no perspective, no folding appearance):

LEFT HALF: New Year's Eve celebration scene featuring the person celebrating in ${landmark}. Show the iconic ${city.skyline} in the background with spectacular fireworks exploding in the night sky. Include "HAPPY NEW YEAR" and "2026" text prominently displayed in elegant typography. The person should look joyful and celebratory. Atmosphere: ${city.vibe}.

RIGHT HALF: Complementary festive scene of the ${landmark} cityscape at midnight with more fireworks, champagne glasses toasting, confetti, sparklers, and party atmosphere. Include celebratory elements like countdown clock at midnight, party decorations.

COLOR PALETTE: ${city.colors}. The overall feel should be glamorous, celebratory, and magical.

CRITICAL REQUIREMENTS:
- This must be a completely FLAT image like a texture or print layout
- NO 3D perspective, NO shadows suggesting depth, NO fold lines, NO book-like appearance
- Just two flat rectangular panels side by side
- The image will be mapped onto a 3D model later
- FILL THE ENTIRE 16:9 CANVAS EDGE TO EDGE - NO white space, NO margins, NO padding at top/bottom/sides
- The festive content must extend to all four edges of the image
- NO blank or white areas anywhere in the image
- Night sky setting with fireworks and city lights
- Keep the person's face clearly recognizable and place them prominently in the scene`,
            },
            {
              type: 'image',
              image: imageBase64,
              mimeType: mediaType,
            },
          ],
        },
      ],
      providerOptions: {
        google: {
          responseModalities: ['IMAGE'],
          imageConfig: {
            aspectRatio: '16:9',
          },
        },
      },
    })

    const generatedImage = result.files?.[0]
    if (generatedImage?.base64) {
      return {
        success: true,
        image: `data:${generatedImage.mimeType};base64,${generatedImage.base64}`,
      }
    }

    return { success: false, error: 'No image was generated' }
  } catch (error) {
    console.error('Generation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate image',
    }
  }
}
