# Wedding Invitation Generator 💒

A beautiful AI-powered wedding invitation generator that transforms your couple photos into elegant wedding invitations using Google's Gemini Nano Banana image generation.

## Features

- 📷 **Photo Upload** - Upload your favorite couple photo
- ✨ **AI-Powered Generation** - Uses Gemini 2.5 Flash Image to create elegant invitations
- 🎨 **Elegant Design** - Romantic, wedding-themed interface
- 📥 **Download Ready** - Save your generated invitation as PNG

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and add your Gemini API key:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://makersuite.google.com/app/apikey

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

1. **Upload** - Select a photo of the couple
2. **Enter Details** - Fill in names, date, and venue
3. **Generate** - Click the button to create your invitation
4. **Download** - Save the generated invitation

## Tech Stack

- **Next.js 15** - React framework with App Router
- **AI SDK** - Vercel AI SDK for Gemini integration
- **Gemini 2.5 Flash Image** - Google's fast image generation model
- **TypeScript** - Type-safe development

## Project Structure

```
├── app/
│   ├── actions/
│   │   └── generate.ts    # Server action for image generation
│   ├── globals.css        # Elegant wedding-themed styles
│   ├── layout.tsx         # Root layout with fonts
│   └── page.tsx           # Main page with upload form
├── .env.example           # Environment variable template
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## Notes

- The app uses `gemini-2.5-flash-image` for fast generation (~5-10 seconds)
- Images are returned as base64 data URLs (MVP approach)
- For production, consider storing images in Vercel Blob or S3

## License

MIT
