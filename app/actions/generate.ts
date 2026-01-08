'use server'

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

// Check if we're in mock mode (for testing without API calls)
const IS_MOCK_MODE = process.env.NEXT_PUBLIC_MOCK_IMAGE_API === 'true';

interface EnhancePhotoResult {
  success: boolean
  imageUrls?: string[]
  error?: string
}

type PhotoStyle = 'romantic' | 'classic' | 'modern' | 'artistic';

export type { PhotoStyle };

// Mock function that returns the same images after a delay (simulates API)
async function mockGeneratePhotos(photosBase64: string[]): Promise<EnhancePhotoResult> {
  // Simulate API delay (1-2 seconds per photo)
  await new Promise(resolve => setTimeout(resolve, 1500 * photosBase64.length));

  console.log('[MOCK MODE] Returning original photos as "enhanced" images');

  // Return the same photos as if they were enhanced
  const mockEnhancedPhotos = photosBase64.map(base64 => {
    // If the base64 already has the data URI prefix, use it as-is
    if (base64.startsWith('data:image')) {
      return base64;
    }
    // Otherwise, add the prefix
    return `data:image/jpeg;base64,${base64}`;
  });

  return {
    success: true,
    imageUrls: mockEnhancedPhotos,
  };
}

const stylePrompts: Record<PhotoStyle, string> = {
  romantic: `
    - Apply soft, dreamy lighting with warm golden tones
    - Add subtle bokeh effect in the background
    - Enhance skin tones for a natural, healthy glow
    - Create an intimate, romantic atmosphere
    - Use soft focus on edges while keeping subjects sharp
    - Add gentle lens flare effects
  `,
  classic: `
    - Apply timeless, elegant lighting with neutral tones
    - Create a clean, sophisticated background
    - Professional skin retouching while maintaining natural look
    - Balanced exposure with refined contrast
    - Classic portrait composition enhancements
    - Subtle vignette for focus on subjects
  `,
  modern: `
    - Apply contemporary, clean lighting with crisp tones
    - Create a minimalist, refined background
    - Sleek, natural skin enhancement
    - High contrast with sharp details
    - Modern color grading with subtle desaturation
    - Strong compositional balance
  `,
  artistic: `
    - Apply dramatic, cinematic lighting
    - Create visually striking background with depth
    - Artistic skin enhancement with painterly quality
    - Bold contrast and rich shadows
    - Creative color grading with mood enhancement
    - Fine art aesthetic with editorial quality
  `,
};

// Retouch existing photos (original functionality)
export async function generatePhotos(
  photosBase64: string[],
  style: PhotoStyle = 'romantic'
): Promise<EnhancePhotoResult> {
  // Use mock mode if enabled (for testing without API costs)
  if (IS_MOCK_MODE) {
    return mockGeneratePhotos(photosBase64);
  }

  try {
    const styleInstructions = stylePrompts[style] || stylePrompts.romantic;

    const prompt = `You are a world-class professional wedding photographer and photo retoucher specializing in pre-wedding photoshoots.

Your task is to transform this image into a stunning, professional pre-wedding photograph with the following requirements:

PHOTO ENHANCEMENT REQUIREMENTS:
${styleInstructions}

GENERAL RETOUCHING GUIDELINES:
- Enhance the photo to look like it was taken by a professional wedding photographer
- Improve lighting, composition, and overall visual appeal
- Make the couple look their best while maintaining their natural features
- Ensure the final image has a cohesive, polished look suitable for wedding invitations
- Keep the couple as the main focus of the image
- Maintain the original aspect ratio and composition intent

OUTPUT: A single, beautifully enhanced pre-wedding photograph that captures the love and connection between the couple.`;

    // Process all photos in parallel
    const enhancedPhotos = await Promise.all(
      photosBase64.map(async (photoBase64) => {
        const result = await generateText({
          model: google('gemini-3-pro-image-preview'),
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image',
                  image: photoBase64,
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
                aspectRatio: '4:3',
                imageSize: '2K',
              },
            },
          },
        });

        const imageFile = result.files?.[0];
        if (!imageFile?.base64) {
          return null;
        }
        return `data:image/png;base64,${imageFile.base64}`;
      })
    );

    // Filter out failed generations
    const successfulPhotos = enhancedPhotos.filter((url): url is string => url !== null);

    if (successfulPhotos.length === 0) {
      return {
        success: false,
        error: 'No images were generated. Please try again.',
      };
    }

    return {
      success: true,
      imageUrls: successfulPhotos,
    };
  } catch (error) {
    console.error('Error generating photos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to enhance photos',
    };
  }
}
