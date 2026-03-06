import { NextResponse } from 'next/server';
import { removeBackground } from '@imgly/background-removal';

export const runtime = 'nodejs';

// Allow larger payloads for images
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { image } = await request.json();

    if (!image || typeof image !== 'string') {
      return NextResponse.json(
        { error: 'image is required as a base64 data URL string' },
        { status: 400 },
      );
    }

    // Convert data URL to Blob
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const blob = new Blob([buffer], { type: 'image/png' });

    // Remove background using @imgly/background-removal
    const resultBlob = await removeBackground(blob, {
      output: { format: 'image/png', quality: 1 },
    });

    // Convert result back to base64 data URL
    const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());
    const resultBase64 = `data:image/png;base64,${resultBuffer.toString('base64')}`;

    return NextResponse.json({ image: resultBase64 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Background removal failed';
    console.error('[Remove BG API] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
