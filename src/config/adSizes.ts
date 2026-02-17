export type LayoutMode = 'square' | 'portrait' | 'story' | 'landscape' | 'youtube-thumb';

export interface AdSize {
  id: string;
  label: string;
  width: number;
  height: number;
  /** Multiplier applied on top of base font sizes for this ad size */
  fontScale: number;
  layoutMode: LayoutMode;
}

export const AD_SIZES: AdSize[] = [
  { id: 'meta-feed',     label: 'Meta Feed',      width: 1080, height: 1080, fontScale: 1.0,  layoutMode: 'square' },
  { id: 'portrait',      label: 'Portrait',        width: 1080, height: 1350, fontScale: 1.0,  layoutMode: 'portrait' },
  { id: 'story',         label: 'Story',            width: 1080, height: 1920, fontScale: 1.1,  layoutMode: 'story' },
  { id: 'landscape',     label: 'Landscape',        width: 1200, height: 628,  fontScale: 0.85, layoutMode: 'landscape' },
  { id: 'youtube-thumb', label: 'YouTube Thumb',    width: 1280, height: 720,  fontScale: 1.3,  layoutMode: 'youtube-thumb' },
];

export const DEFAULT_AD_SIZE = AD_SIZES[0];

/** Look up fontScale + layoutMode for given dimensions. Falls back to aspect-ratio heuristics. */
export function getAdSizeConfig(width: number, height: number): { fontScale: number; layoutMode: LayoutMode } {
  const match = AD_SIZES.find(s => s.width === width && s.height === height);
  if (match) return { fontScale: match.fontScale, layoutMode: match.layoutMode };

  // Fallback: derive from aspect ratio
  const ratio = width / height;
  if (ratio <= 0.65) return { fontScale: 1.1, layoutMode: 'story' };
  if (ratio <= 0.9)  return { fontScale: 1.0, layoutMode: 'portrait' };
  if (ratio <= 1.1)  return { fontScale: 1.0, layoutMode: 'square' };
  if (ratio <= 1.6)  return { fontScale: 1.3, layoutMode: 'youtube-thumb' };
  return { fontScale: 0.85, layoutMode: 'landscape' };
}
