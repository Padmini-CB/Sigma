export interface AdSize {
  id: string;
  label: string;
  width: number;
  height: number;
}

export const AD_SIZES: AdSize[] = [
  { id: 'meta-feed',     label: 'Meta Feed',      width: 1080, height: 1080 },
  { id: 'portrait',      label: 'Portrait',        width: 1080, height: 1350 },
  { id: 'story',         label: 'Story',            width: 1080, height: 1920 },
  { id: 'landscape',     label: 'Landscape',        width: 1200, height: 628  },
  { id: 'youtube-thumb', label: 'YouTube Thumb',    width: 1280, height: 720  },
];

export const DEFAULT_AD_SIZE = AD_SIZES[0];
