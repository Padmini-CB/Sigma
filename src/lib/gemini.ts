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
  // Remove timestamps older than 60 seconds
  while (requestTimestamps.length > 0 && now - requestTimestamps[0] > 60_000) {
    requestTimestamps.shift();
  }
  if (requestTimestamps.length >= MAX_REQUESTS_PER_MINUTE) {
    throw new Error('Rate limit exceeded – max 10 requests per minute. Please wait and try again.');
  }
  requestTimestamps.push(now);
}

// ---------------------------------------------------------------------------
// generateImage – generic image generation via Gemini 2.0 Flash
// ---------------------------------------------------------------------------
export async function generateImage(prompt: string): Promise<string> {
  checkRateLimit();

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      // @ts-expect-error -- responseModalities is supported by Gemini 2.0 but not yet in SDK types
      generationConfig: { responseModalities: ['image', 'text'] },
    });

    const response = result.response;
    const parts = response.candidates?.[0]?.content?.parts ?? [];

    for (const part of parts) {
      // Gemini returns inline_data for generated images
      const inlineData = (part as unknown as { inlineData?: { data: string; mimeType: string } }).inlineData;
      if (inlineData?.data) {
        return inlineData.data; // base64 encoded image
      }
    }

    throw new Error('No image data returned from Gemini');
  } finally {
    clearTimeout(timeout);
  }
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
