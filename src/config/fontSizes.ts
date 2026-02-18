// Centralized font size configuration for SIGMA ad creatives
// These sizes are MOBILE-OPTIMIZED (larger than the brand deck's 1080x1080 baseline)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FontSizeConfig = {
  headline: number;
  subheadline: number;
  body: number;
  cardTitle: number;
  label: number;
  statNumber: number;
  cta: number;
  bottomBar: number;
};

export type PresetMode = "desktop" | "balanced" | "mobile" | "bold";

export type PresetMeta = {
  name: string;
  icon: string;
  description: string;
  sizes: FontSizeConfig;
};

// ---------------------------------------------------------------------------
// Font Size Presets
// ---------------------------------------------------------------------------

export const FONT_SIZE_PRESETS: Record<PresetMode, PresetMeta> = {
  desktop: {
    name: "Desktop / Web",
    icon: "\uD83D\uDDA5\uFE0F",
    description: "Optimized for desktop web banners and large screens",
    sizes: {
      headline: 52,
      subheadline: 26,
      body: 18,
      cardTitle: 20,
      label: 14,
      statNumber: 32,
      cta: 20,
      bottomBar: 13,
    },
  },
  balanced: {
    name: "Balanced / Multi-platform",
    icon: "\u2696\uFE0F",
    description: "Middle ground that works across desktop and mobile",
    sizes: {
      headline: 64,
      subheadline: 32,
      body: 24,
      cardTitle: 24,
      label: 20,
      statNumber: 38,
      cta: 26,
      bottomBar: 16,
    },
  },
  mobile: {
    name: "Mobile / Instagram",
    icon: "\uD83D\uDCF1",
    description: "Large text optimized for mobile feeds and Instagram",
    sizes: {
      headline: 76,
      subheadline: 38,
      body: 30,
      cardTitle: 28,
      label: 26,
      statNumber: 46,
      cta: 34,
      bottomBar: 20,
    },
  },
  bold: {
    name: "Bold / Maximum Impact",
    icon: "\uD83D\uDCA5",
    description: "Extra-large text for high-impact story ads and reels",
    sizes: {
      headline: 92,
      subheadline: 46,
      body: 34,
      cardTitle: 32,
      label: 28,
      statNumber: 54,
      cta: 40,
      bottomBar: 22,
    },
  },
} as const;

export const DEFAULT_PRESET: PresetMode = "mobile";

// ---------------------------------------------------------------------------
// Per-Size Font Sizes — each ad size can have its own independent font config
// ---------------------------------------------------------------------------

/** Map from AdSize.id to its own FontSizeConfig */
export type PerSizeFontConfig = Record<string, FontSizeConfig>;

/** Scale multipliers applied to the "mobile" preset to create smart defaults per size */
const PER_SIZE_SCALE: Record<string, { preset: PresetMode; scale: number }> = {
  "meta-feed":    { preset: "mobile", scale: 1.0 },
  "portrait":     { preset: "mobile", scale: 1.05 },
  "story":        { preset: "mobile", scale: 1.15 },
  "landscape":    { preset: "mobile", scale: 0.85 },
  "youtube-thumb":{ preset: "bold",   scale: 1.0 },
};

function scaleSizes(base: FontSizeConfig, factor: number): FontSizeConfig {
  return {
    headline: Math.round(base.headline * factor),
    subheadline: Math.round(base.subheadline * factor),
    body: Math.round(base.body * factor),
    cardTitle: Math.round(base.cardTitle * factor),
    label: Math.round(base.label * factor),
    statNumber: Math.round(base.statNumber * factor),
    cta: Math.round(base.cta * factor),
    bottomBar: Math.round(base.bottomBar * factor),
  };
}

/** Build initial per-size font config with smart defaults for each ad size */
export function buildDefaultPerSizeFonts(sizeIds: string[]): PerSizeFontConfig {
  const result: PerSizeFontConfig = {};
  for (const id of sizeIds) {
    const entry = PER_SIZE_SCALE[id] ?? { preset: "mobile" as PresetMode, scale: 1.0 };
    const base = FONT_SIZE_PRESETS[entry.preset].sizes;
    result[id] = scaleSizes(base, entry.scale);
  }
  return result;
}

// ---------------------------------------------------------------------------
// Font Family & Weight Config
// ---------------------------------------------------------------------------

export const FONT_CONFIG: Record<
  keyof FontSizeConfig,
  { font: string; weight: number }
> = {
  headline: { font: "Saira Condensed", weight: 900 },
  subheadline: { font: "Kanit", weight: 300 },
  body: { font: "Kanit", weight: 300 },
  cardTitle: { font: "Saira Condensed", weight: 700 },
  label: { font: "Kanit", weight: 500 },
  statNumber: { font: "Saira Condensed", weight: 800 },
  cta: { font: "Saira Condensed", weight: 800 },
  bottomBar: { font: "Kanit", weight: 300 },
} as const;

// ---------------------------------------------------------------------------
// Font Colors (per element)
// ---------------------------------------------------------------------------

export const FONT_COLORS = {
  headline: "#FFFFFF",
  headlineAccent: "#D7EF3F",
  subheadline: "#FFFFFF",
  body: "#3B82F6",
  cardTitle: "#FFFFFF",
  label: "#3B82F6",
  statNumber: "#D7EF3F",
  cta: "#181830",
  ctaBackground: "#D7EF3F",
  bottomBar: "rgba(255,255,255,0.5)",
} as const;

// ---------------------------------------------------------------------------
// Brand Colors
// ---------------------------------------------------------------------------

export const BRAND_COLORS = {
  brandBlue: "#3B82F6",
  brandPurple: "#6F53C1",
  slateBlue: "#3F4C78",
  deepNavy: "#181830",
  white: "#FFFFFF",
  limeYellow: "#D7EF3F",
  tealGreen: "#20C997",
  orange: "#FD7E15",
  pink: "#D63384",
  lightLavender: "#E1E3FA",
  adGradient:
    "linear-gradient(170deg, #0c1630 0%, #151040 35%, #1a1545 55%, #12103a 80%, #0c1630 100%)",
} as const;
