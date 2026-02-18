import { NextResponse } from 'next/server';
import { generateImage, generateBackground } from '@/lib/gemini';

function errorStatus(message: string): number {
  if (message.includes('not configured') || message.includes('invalid')) return 401;
  if (message.includes('Too many requests') || message.includes('Rate limit')) return 429;
  if (message.includes('not available')) return 404;
  return 500;
}

export async function POST(request: Request) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'prompt is required and must be a string' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('[Gemini API] GEMINI_API_KEY environment variable is not set. Add it to .env.local');
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 401 },
      );
    }

    console.log(`[Gemini API] Request: type=${type}, prompt=${prompt.slice(0, 80)}...`);

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
        } catch (bgErr) {
          const bgMsg = bgErr instanceof Error ? bgErr.message : '';
          // Only fall back to custom prompt for unknown style errors
          if (bgMsg.includes('Unknown background style')) {
            const bgPrompt = [
              prompt,
              'Image size: 1080x1080.',
              'Dark navy #181830 base.',
              'Brand accent colors: #3B82F6 (blue), #6F53C1 (purple).',
              'No text, no logos.',
            ].join(' ');
            image = await generateImage(bgPrompt);
          } else {
            throw bgErr;
          }
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

    console.log(`[Gemini API] Success: type=${type}`);
    return NextResponse.json({ image });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Image generation failed';
    console.error('[Gemini API] Generation error:', message);
    return NextResponse.json({ error: message }, { status: errorStatus(message) });
  }
}
