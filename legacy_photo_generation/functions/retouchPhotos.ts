// LEGACY CODE - Photo Generation Functionality (Removed from main app)
// This file contains the retouchPhotos() function that was used to generate
// completely new pre-wedding photos based on partner reference photos.
// Preserved for potential future restoration.

import { google } from '@ai-sdk/google'
import { generateText } from 'ai'

interface EnhancePhotoResult {
  success: boolean
  imageUrls?: string[]
  error?: string
}

type PhotoStyle = 'romantic' | 'classic' | 'modern' | 'artistic';

interface CoupleDetails {
  partner1Description: string;
  partner2Description: string;
  outfitStyle: string;
  setting: string;
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

// Generate completely new pre-wedding images based on reference photos
export async function retouchPhotos(
  partner1PhotosBase64: string[],
  partner2PhotosBase64: string[],
  style: PhotoStyle = 'romantic',
  coupleDetails: CoupleDetails,
  numberOfImages: number = 3
): Promise<EnhancePhotoResult> {
  try {
    const styleInstructions = stylePrompts[style] || stylePrompts.romantic;

    const prompt = `You are a world-class professional wedding photographer creating stunning pre-wedding photoshoot images.

IMPORTANT: You are provided with reference photos of TWO DIFFERENT people who are a couple. Study their faces, body types, and features SEPARATELY and carefully.
- The first set of images shows Partner 1
- The second set of images shows Partner 2

The generated images MUST feature BOTH of these exact people together as a couple with accurate likeness for each person.

COUPLE DESCRIPTION (for reference):
- Partner 1: ${coupleDetails.partner1Description}
- Partner 2: ${coupleDetails.partner2Description}
- Outfit Style: ${coupleDetails.outfitStyle}
- Setting/Location: ${coupleDetails.setting}

PHOTO STYLE REQUIREMENTS:
${styleInstructions}

GENERATION GUIDELINES:
- Create a completely NEW professional pre-wedding photograph
- Partner 1 must look EXACTLY like in their reference photos (same face, same person)
- Partner 2 must look EXACTLY like in their reference photos (same face, same person)
- Place the couple TOGETHER in the specified setting: ${coupleDetails.setting}
- Dress them in ${coupleDetails.outfitStyle} attire appropriate for a pre-wedding photoshoot
- Create natural, loving poses that showcase their connection as a couple
- Apply professional lighting and composition
- Make the image look like it was taken by a high-end wedding photographer
- Ensure magazine-quality results suitable for wedding invitations

OUTPUT: A beautiful, professionally shot pre-wedding photograph featuring this exact couple together in the specified setting.`;

    const allReferencePhotos = [
      ...partner1PhotosBase64.map((photoBase64) => ({
        type: 'image' as const,
        image: photoBase64,
      })),
      ...partner2PhotosBase64.map((photoBase64) => ({
        type: 'image' as const,
        image: photoBase64,
      })),
    ];

    const generatedPhotos: (string | null)[] = [];

    for (let i = 0; i < numberOfImages; i++) {
      const result = await generateText({
        model: google('gemini-3-pro-image-preview'),
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text' as const,
                text: `Here are reference photos. The first ${partner1PhotosBase64.length} photo(s) show Partner 1. The remaining ${partner2PhotosBase64.length} photo(s) show Partner 2.`,
              },
              ...allReferencePhotos,
              {
                type: 'text' as const,
                text: prompt + `\n\nGenerate image variation ${i + 1} with a unique pose and angle.`,
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
      if (imageFile?.base64) {
        generatedPhotos.push(`data:image/png;base64,${imageFile.base64}`);
      } else {
        generatedPhotos.push(null);
      }
    }

    const successfulPhotos = generatedPhotos.filter((url): url is string => url !== null);

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
    console.error('Error generating new photos:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate new photos',
    };
  }
}
