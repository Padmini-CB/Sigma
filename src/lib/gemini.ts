import { GoogleGenerativeAI } from '@google/generative-ai';

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

// ---------------------------------------------------------------------------
// Rate limiter – max 10 requests per minute (sliding window)
// ---------------------------------------------------------------------------
const requestTimestamps: number[] = [];
const MAX_REQUESTS_PER_MINUTE = 10;

function checkRateLimit(): void {
  const now = Date.now();
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] > 60_000) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Too many requests — wait a moment');
  }
  requestTimestamps.push(now);
}

// ---------------------------------------------------------------------------
// API key verification – quick text gen to confirm the key works
// ---------------------------------------------------------------------------
let apiKeyVerified: boolean | null = null;

async function verifyApiKey(): Promise<void> {
  if (apiKeyVerified === true) return;
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent('Say "ok"');
    const text = result.response.text();
    if (text) {
      apiKeyVerified = true;
      console.log('[Gemini] API key verified successfully');
    }
  } catch (err) {
    apiKeyVerified = false;
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Gemini] API key verification failed:', msg);
    if (msg.includes('API_KEY_INVALID') || msg.includes('401') || msg.includes('403')) {
      throw new Error('Gemini API key is invalid — check GEMINI_API_KEY in .env.local');
    }
    throw new Error(`Gemini API connection failed: ${msg}`);
  }
}

// ---------------------------------------------------------------------------
// REST API fallback – calls Gemini endpoint directly, bypassing SDK
// ---------------------------------------------------------------------------
async function generateImageViaRest(prompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  console.log('[Gemini REST] Attempting image generation via REST API');

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { responseModalities: ['image', 'text'] },
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    console.error('[Gemini REST] Error response:', response.status, errBody);
    if (response.status === 404) {
      throw new Error('Image generation model not available — try custom prompt with text model');
    }
    if (response.status === 429) {
      throw new Error('Too many requests — wait a moment');
    }
    throw new Error(`Gemini API error: HTTP ${response.status}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts ?? [];

  for (const part of parts) {
    if (part.inlineData?.data) {
      console.log('[Gemini REST] Image generated successfully');
      return part.inlineData.data;
    }
  }

  console.error('[Gemini REST] No image data in response. Parts:', JSON.stringify(parts).slice(0, 500));
  throw new Error('No image data returned from Gemini');
}

// ---------------------------------------------------------------------------
// generateImage – tries SDK first, falls back to REST API
// ---------------------------------------------------------------------------
export async function generateImage(prompt: string): Promise<string> {
  checkRateLimit();
  await verifyApiKey();

  // ── Attempt 1: SDK ──
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      // @ts-expect-error -- responseModalities is supported by Gemini 2.0 but not yet in SDK types
      generationConfig: { responseModalities: ['image', 'text'] },
    });

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts ?? [];

    for (const part of parts) {
      const inlineData = (part as unknown as { inlineData?: { data: string; mimeType: string } }).inlineData;
      if (inlineData?.data) {
        console.log('[Gemini SDK] Image generated successfully');
        return inlineData.data; // base64 encoded image
      }
    }

    // SDK returned response but no image data — fall through to REST
    console.warn('[Gemini SDK] No image data in response, trying REST API fallback');
  } catch (sdkErr) {
    const msg = sdkErr instanceof Error ? sdkErr.message : String(sdkErr);
    console.warn('[Gemini SDK] Image generation failed, trying REST API fallback:', msg);

    // Don't retry on auth or rate-limit errors
    if (msg.includes('API_KEY_INVALID') || msg.includes('Too many requests')) {
      throw sdkErr;
    }
  }

  // ── Attempt 2: Direct REST API ──
  return generateImageViaRest(prompt);
}

// ---------------------------------------------------------------------------
// Background style prompts
// ---------------------------------------------------------------------------
const BACKGROUND_PROMPTS: Record<string, string> = {
  'tech-grid': [
    'Generate a 1080x1080 dark background image.',
    'Base color: dark navy #181830.',
    'Subtle grid pattern with thin lines in #3B82F6 (blue) at 20% opacity.',
    'Scattered small code/data symbols (curly braces, angle brackets, 0s and 1s) in #6F53C1 (purple) at 15% opacity.',
    'No text, no logos. Abstract, minimal, professional.',
  ].join(' '),

  'gradient-mesh': [
    'Generate a 1080x1080 abstract background image.',
    'Dark navy #181830 base with a flowing gradient mesh.',
    'Mesh colors: #3B82F6 (blue) and #6F53C1 (purple) blended softly.',
    'Smooth, organic shapes. No text, no logos. Premium feel.',
  ].join(' '),

  'circuit': [
    'Generate a 1080x1080 dark background image.',
    'Base: dark navy #181830.',
    'Subtle circuit board trace pattern in #3B82F6 (blue) at 25% opacity.',
    'Small glowing nodes at intersections in #6F53C1 (purple).',
    'Technical, professional. No text, no logos.',
  ].join(' '),

  'data-flow': [
    'Generate a 1080x1080 abstract dark background.',
    'Base: #181830 dark navy.',
    'Abstract flowing data streams – thin curved lines and dots in #3B82F6 (blue) and #6F53C1 (purple).',
    'Suggests data pipelines and visualization. No text, no logos.',
  ].join(' '),

  'geometric': [
    'Generate a 1080x1080 abstract dark background.',
    'Base: #181830 dark navy.',
    'Low-poly geometric triangles and hexagons in #3B82F6 (blue) and #6F53C1 (purple) at varying opacity.',
    'Modern, tech-forward aesthetic. No text, no logos.',
  ].join(' '),

  'code-rain': [
    'Generate a 1080x1080 dark background image.',
    'Base: #181830 dark navy.',
    'Matrix-style falling code rain effect with columns of characters (0s, 1s, brackets, semicolons) in #3B82F6 (blue) at 30% opacity.',
    'Some highlighted streams in #D7EF3F (lime yellow) at 15% opacity.',
    'Digital, hacker aesthetic. No text, no logos.',
  ].join(' '),
};

// ---------------------------------------------------------------------------
// generateBackground – pre-built background generation
// ---------------------------------------------------------------------------
export async function generateBackground(style: string): Promise<string> {
  const prompt = BACKGROUND_PROMPTS[style];
  if (!prompt) {
    const validStyles = Object.keys(BACKGROUND_PROMPTS).join(', ');
    throw new Error(`Unknown background style "${style}". Valid styles: ${validStyles}`);
  }
  return generateImage(prompt);
}
