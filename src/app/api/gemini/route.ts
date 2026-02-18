import { NextResponse } from 'next/server';
import { generateImage, generateBackground } from '@/lib/gemini';

export async function POST(request: Request) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt is required and must be a string' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('[Gemini API] GEMINI_API_KEY environment variable is not set. Add it to .env.local');
      return NextResponse.json(
        { error: 'GEMINI_API_KEY not configured. Add GEMINI_API_KEY=your-key to .env.local' },
        { status: 500 },
      );
    }

    let image: string;

    switch (type) {
      case 'icon': {
        const iconPrompt = [
          prompt,
          'Style: flat design icon, clean vector-like look.',
          'Transparent background, no text, no labels.',
          'White/light colors suitable for display on dark navy #181830 backgrounds.',
          'Centered, 64x64 logical size.',
        ].join(' ');
        image = await generateImage(iconPrompt);
        break;
      }

      case 'background': {
        // If prompt matches a preset style name, use the preset
        try {
          image = await generateBackground(prompt);
        } catch {
          // Not a preset – use as custom background prompt
          const bgPrompt = [
            prompt,
            'Image size: 1080x1080.',
            'Dark navy #181830 base.',
            'Brand accent colors: #3B82F6 (blue), #6F53C1 (purple).',
            'No text, no logos.',
          ].join(' ');
          image = await generateImage(bgPrompt);
        }
        break;
      }

      case 'custom': {
        image = await generateImage(prompt);
        break;
      }

      default:
        return NextResponse.json(
          { error: 'type must be "icon", "background", or "custom"' },
          { status: 400 },
        );
    }

    return NextResponse.json({ image });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Image generation failed';
    console.error('[Gemini API] Generation error:', message);
    const status = message.includes('Rate limit') ? 429 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
