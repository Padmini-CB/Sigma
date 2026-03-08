import { CanvasElement } from './types';

// Helper to create unique IDs
let _idCounter = 0;
function uid(): string {
  return `el_${Date.now()}_${++_idCounter}`;
}

// ─── Element Factories ──────────────────────────────────────────────────────

function makeText(opts: {
  x: number; y: number; width: number; height: number;
  content: string; fontSize: number; fontWeight?: number;
  color?: string; fontFamily?: string; textAlign?: 'left' | 'center' | 'right';
  textTransform?: 'none' | 'uppercase'; scaleX?: number;
  letterSpacing?: number; lineHeight?: number;
  zIndex?: number; opacity?: number;
  fontStyle?: 'normal' | 'italic';
}): CanvasElement {
  return {
    id: uid(),
    type: 'text',
    x: opts.x, y: opts.y,
    width: opts.width, height: opts.height,
    rotation: 0, opacity: opts.opacity ?? 1, zIndex: opts.zIndex ?? 10,
    locked: false, visible: true,
    content: opts.content,
    textStyle: {
      fontFamily: opts.fontFamily ?? 'Poppins',
      fontSize: opts.fontSize,
      fontWeight: opts.fontWeight ?? 900,
      fontStyle: opts.fontStyle ?? 'normal',
      color: opts.color ?? '#FFFFFF',
      textAlign: opts.textAlign ?? 'left',
      letterSpacing: opts.letterSpacing ?? -1,
      lineHeight: opts.lineHeight ?? 0.92,
      textTransform: opts.textTransform ?? 'uppercase',
      scaleX: opts.scaleX ?? 0.74,
    },
  };
}

function makeImage(opts: {
  x: number; y: number; width: number; height: number;
  src: string; maskType?: 'radial' | 'linear' | 'none'; maskParams?: string;
  zIndex?: number; opacity?: number; glowColor?: string;
  objectFit?: 'cover' | 'contain';
}): CanvasElement {
  return {
    id: uid(),
    type: 'image',
    x: opts.x, y: opts.y,
    width: opts.width, height: opts.height,
    rotation: 0, opacity: opts.opacity ?? 1, zIndex: opts.zIndex ?? 5,
    locked: false, visible: true,
    content: opts.src,
    glowColor: opts.glowColor,
    imageStyle: {
      objectFit: opts.objectFit ?? 'contain',
      borderRadius: 0,
      maskType: opts.maskType ?? 'none',
      maskParams: opts.maskParams,
    },
  };
}

function makeButton(opts: {
  x: number; y: number; width: number; height: number;
  content: string; bgColor: string; textColor: string;
  fontSize?: number; borderRadius?: number; zIndex?: number;
  borderColor?: string; borderWidth?: number;
}): CanvasElement {
  return {
    id: uid(),
    type: 'button',
    x: opts.x, y: opts.y,
    width: opts.width, height: opts.height,
    rotation: 0, opacity: 1, zIndex: opts.zIndex ?? 20,
    locked: false, visible: true,
    content: opts.content,
    buttonStyle: {
      backgroundColor: opts.bgColor,
      textColor: opts.textColor,
      fontFamily: 'Poppins',
      fontSize: opts.fontSize ?? 22,
      fontWeight: 700,
      borderRadius: opts.borderRadius ?? 8,
      paddingX: 36, paddingY: 14,
      borderColor: opts.borderColor,
      borderWidth: opts.borderWidth,
    },
  };
}

function makeBadge(opts: {
  x: number; y: number; width: number; height: number;
  content: string; bgColor: string; textColor: string;
  fontSize?: number; borderRadius?: number; zIndex?: number;
  borderColor?: string; borderWidth?: number; icon?: string;
}): CanvasElement {
  return {
    id: uid(),
    type: 'badge',
    x: opts.x, y: opts.y,
    width: opts.width, height: opts.height,
    rotation: 0, opacity: 1, zIndex: opts.zIndex ?? 15,
    locked: false, visible: true,
    content: opts.content,
    badgeStyle: {
      backgroundColor: opts.bgColor,
      textColor: opts.textColor,
      fontFamily: 'Poppins',
      fontSize: opts.fontSize ?? 14,
      fontWeight: 600,
      borderRadius: opts.borderRadius ?? 9999,
      paddingX: 16, paddingY: 8,
      borderColor: opts.borderColor,
      borderWidth: opts.borderWidth,
      icon: opts.icon,
    },
  };
}

function makeStrip(opts: {
  x: number; y: number; width: number; height: number;
  content: string; bgColor: string; textColor: string;
  fontSize?: number; zIndex?: number;
  borderTopColor?: string;
}): CanvasElement {
  return {
    id: uid(),
    type: 'strip',
    x: opts.x, y: opts.y,
    width: opts.width, height: opts.height,
    rotation: 0, opacity: 1, zIndex: opts.zIndex ?? 25,
    locked: false, visible: true,
    content: opts.content,
    stripStyle: {
      backgroundColor: opts.bgColor,
      textColor: opts.textColor,
      fontFamily: 'Poppins',
      fontSize: opts.fontSize ?? 16,
      fontWeight: 600,
      paddingX: 20, paddingY: 10,
    },
  };
}

function makeShape(opts: {
  x: number; y: number; width: number; height: number;
  bgColor: string; borderRadius: number; borderColor?: string; borderWidth?: number;
  zIndex?: number;
}): CanvasElement {
  return {
    id: uid(),
    type: 'shape',
    x: opts.x, y: opts.y,
    width: opts.width, height: opts.height,
    rotation: 0, opacity: 1, zIndex: opts.zIndex ?? 7,
    locked: false, visible: true,
    content: '',
    shapeStyle: {
      backgroundColor: opts.bgColor,
      borderColor: opts.borderColor ?? 'transparent',
      borderWidth: opts.borderWidth ?? 0,
      borderRadius: opts.borderRadius,
    },
  };
}

// ─── Shared Elements ────────────────────────────────────────────────────────

function makeLogo(x = 36, y = 32, zIndex = 30): CanvasElement {
  return makeImage({ x, y, width: 120, height: 48, src: '/logos/codebasics-white.svg', zIndex, maskType: 'none', objectFit: 'contain' });
}

function makeSubscriberBadge(x = 720, y = 32, zIndex = 30): CanvasElement {
  return makeBadge({ x, y, width: 320, height: 38, content: '1.4M+ Subscribers · 4.9★', bgColor: 'rgba(255,255,255,0.08)', textColor: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 500, borderRadius: 9999, zIndex, borderColor: 'rgba(255,255,255,0.12)', borderWidth: 1 } as any);
}

function makeBottomStrip(content: string, zIndex = 25): CanvasElement {
  return makeStrip({ x: 0, y: 1028, width: 1080, height: 52, content, bgColor: 'rgba(13,17,23,0.95)', textColor: '#20C997', fontSize: 16, zIndex });
}

// ─── DA Bootcamp Common Elements ─────────────────────────────────────────
// Brand: Navy #181830 bg, Blue #3B82F6 primary, Lime #D7EF3F accent (one per template)
// Headlines: Saira Condensed 900, Body: Manrope

function makeDACommon(): CanvasElement[] {
  return [
    // Codebasics logo (top-left)
    makeImage({ x: 40, y: 32, width: 120, height: 48, src: '/logos/codebasics-white.svg', zIndex: 30, maskType: 'none', objectFit: 'contain' }),
    // YouTube badge (top-right)
    makeBadge({ x: 760, y: 35, width: 280, height: 30, content: '1 Million+ Subscribers · 4.9 Rating', bgColor: 'rgba(255,255,255,0.03)', textColor: 'rgba(255,255,255,0.4)', fontSize: 10, borderRadius: 7, zIndex: 30, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1 }),
    // Bottom bar
    makeText({ x: 0, y: 1030, width: 1080, height: 24, content: 'Data Analytics Bootcamp 5.0 · Lifetime Version Access · 100% Refund Policy · Free Portfolio Website', fontSize: 9, fontWeight: 500, color: 'rgba(255,255,255,0.25)', textAlign: 'center', scaleX: 1, letterSpacing: 0.5, lineHeight: 1.2, textTransform: 'none', zIndex: 25 }),
  ];
}

/** Creates a hero drop-zone placeholder (dashed border, label text). User replaces with uploaded image. */
function makeDAHeroDropZone(opts: {
  x: number; y: number; width: number; height: number;
  label?: string; zIndex?: number;
}): CanvasElement[] {
  return [
    makeShape({ x: opts.x, y: opts.y, width: opts.width, height: opts.height, bgColor: 'rgba(59,130,246,0.04)', borderRadius: 12, borderColor: 'rgba(59,130,246,0.25)', borderWidth: 2, zIndex: opts.zIndex ?? 4 }),
    makeText({ x: opts.x, y: opts.y + opts.height / 2 - 12, width: opts.width, height: 24, content: opts.label ?? 'Drop hero image here', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.2)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: (opts.zIndex ?? 4) + 1 }),
  ];
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Template Definitions — Matching reference PNGs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface TemplateInfo {
  id: string;
  filename: string;
  label: string;
  shortLabel: string;
  description: string;
  group: 'standalone' | 'carousel' | 'banner' | 'da-standalone';
  /** Bootcamp tag for filtering in the template gallery */
  bootcamp?: 'ai-engineering-1.0' | 'data-analytics-5.0';
  thumbnailBg: string;
  thumbnailAccent: string;
  thumbnailHeadline: string;
  thumbnailImage?: string;
  htmlPath?: string;
  /** When set, selecting this template auto-switches to the matching canvas size */
  targetSize?: { width: number; height: number };
  createElements: () => CanvasElement[];
}

export const TEMPLATES: TemplateInfo[] = [
  // ── A — "YOUR TODOS DON'T SHIP." ──
  {
    id: 'concept-a',
    filename: 'concept-a.html',
    htmlPath: '/ads/bootcamp-ai-engineering/concept-a.html',
    label: 'A — YOUR TODOs DON\'T SHIP.',
    shortLabel: 'TODOs Don\'t Ship',
    description: 'Dhaval hero right, code mockup left, green CTA',
    group: 'standalone',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    thumbnailHeadline: "YOUR TODOs DON'T SHIP",
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero — right side, tighter mask to avoid square border, blue glow
      makeImage({ x: 460, y: 40, width: 620, height: 780, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'none', glowColor: '#3b82f6', zIndex: 5 }),
      // Name + title near hero
      makeText({ x: 580, y: 520, width: 400, height: 30, content: 'Dhaval Patel', fontSize: 20, fontWeight: 700, color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 12 }),
      makeText({ x: 580, y: 555, width: 400, height: 24, content: 'Founder, Codebasics · Ex-NVIDIA', fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 12 }),
      // Headline
      makeText({ x: 40, y: 300, width: 600, height: 130, content: 'YOUR TODOS', fontSize: 110, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 420, width: 600, height: 130, content: 'DON\'T SHIP.', fontSize: 110, color: '#20C997', zIndex: 10 }),
      // Code mockup card
      makeShape({ x: 40, y: 580, width: 460, height: 180, bgColor: 'rgba(255,255,255,0.04)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, zIndex: 8 }),
      makeText({ x: 52, y: 590, width: 440, height: 20, content: 'my_learning.py', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, zIndex: 9 }),
      makeText({ x: 52, y: 620, width: 440, height: 28, content: '// TODO: watch that AI tutorial late...', fontSize: 15, fontWeight: 500, color: '#f85149', fontFamily: 'monospace', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.5, zIndex: 9 }),
      makeText({ x: 52, y: 660, width: 440, height: 28, content: '● LIVE: building RAG pipeline now', fontSize: 15, fontWeight: 500, color: '#20C997', fontFamily: 'monospace', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.5, zIndex: 9 }),
      // CTA
      makeButton({ x: 300, y: 840, width: 440, height: 58, content: 'START BUILDING LIVE →', bgColor: '#20C997', textColor: '#0D1117', fontSize: 22, zIndex: 20 }),
      // Bottom strip
      makeBottomStrip('✔ Live 2x/Week  ·  ✔ 8+ Projects  ·  ✔ 500 Seats  ·  ✔ March 7'),
    ],
  },

  // ── B — "WE SKIP THE BASICS." ──
  {
    id: 'concept-b',
    filename: 'concept-b.html',
    htmlPath: '/ads/bootcamp-ai-engineering/concept-b.html',
    label: 'B — WE SKIP THE BASICS.',
    shortLabel: 'Skip the Basics',
    description: 'Dhaval hero, blue accent headline, italic subtext',
    group: 'standalone',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: 'WE SKIP THE BASICS',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero — tighter mask
      makeImage({ x: 460, y: 40, width: 620, height: 780, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'none', glowColor: '#3b82f6', zIndex: 5 }),
      // Headline
      makeText({ x: 40, y: 300, width: 700, height: 150, content: 'WE SKIP', fontSize: 130, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 440, width: 700, height: 150, content: 'THE BASICS.', fontSize: 130, color: '#3b82f6', zIndex: 10 }),
      // Subtext (italic)
      makeText({ x: 40, y: 600, width: 500, height: 40, content: 'This is not a beginner course.', fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.55)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, fontStyle: 'italic', zIndex: 11 }),
      // CTA
      makeButton({ x: 300, y: 840, width: 440, height: 58, content: 'JOIN THE MARCH 7 BATCH →', bgColor: '#3b82f6', textColor: '#FFFFFF', fontSize: 20, zIndex: 20 }),
      // Bottom strip
      makeBottomStrip('✔ 2+ Yrs Coding Required  ·  ✔ Live Cohorts  ·  ✔ 75 Days  ·  ✔ March 7'),
    ],
  },

  // ── C — "THREE PILLARS" ──
  {
    id: 'concept-c',
    filename: 'concept-c.html',
    htmlPath: '/ads/bootcamp-ai-engineering/concept-c.html',
    label: 'C — THREE PILLARS',
    shortLabel: 'Three Pillars',
    description: 'Trio image, BUILD/ORCHESTRATE/DISTRIBUTE pillars',
    group: 'standalone',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    thumbnailHeadline: 'BUILD. ORCHESTRATE. DISTRIBUTE.',
    createElements: () => [
      // Trio image — top ~50%, linear mask, blue glow
      makeImage({ x: 0, y: 0, width: 1080, height: 560, src: '/images/bootcamps/ai-engineering/heroes/superhero-trio.png', maskType: 'none', glowColor: '#3b82f6', zIndex: 3 }),
      makeLogo(36, 32, 30),
      makeSubscriberBadge(),
      // Pillar labels overlaid near bottom of trio
      makeText({ x: 80, y: 470, width: 240, height: 36, content: 'BUILD', fontSize: 22, fontWeight: 700, color: '#3b82f6', scaleX: 1, letterSpacing: 1, lineHeight: 1, zIndex: 15 }),
      makeText({ x: 80, y: 500, width: 300, height: 24, content: 'Dhaval · Ex-NVIDIA', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 15 }),
      makeText({ x: 410, y: 470, width: 280, height: 36, content: 'ORCHESTRATE', fontSize: 22, fontWeight: 700, color: '#D7EF3F', scaleX: 1, letterSpacing: 1, lineHeight: 1, textAlign: 'center', zIndex: 15 }),
      makeText({ x: 410, y: 500, width: 280, height: 24, content: 'Hemanand · Ex-Edgewell', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, textAlign: 'center', zIndex: 15 }),
      makeText({ x: 770, y: 470, width: 240, height: 36, content: 'DISTRIBUTE', fontSize: 22, fontWeight: 700, color: '#20C997', scaleX: 1, letterSpacing: 1, lineHeight: 1, textAlign: 'right', zIndex: 15 }),
      makeText({ x: 770, y: 500, width: 240, height: 24, content: 'Siddhant · AI Engineer', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, textAlign: 'right', zIndex: 15 }),
      // Headline block (centered)
      makeText({ x: 40, y: 560, width: 1000, height: 60, content: 'MOST BOOTCAMPS TEACH YOU TO', fontSize: 65, color: '#FFFFFF', textAlign: 'center', scaleX: 0.76, zIndex: 10 }),
      makeText({ x: 40, y: 630, width: 1000, height: 60, content: 'BUILD.', fontSize: 65, color: '#3b82f6', textAlign: 'center', scaleX: 0.76, zIndex: 10 }),
      makeText({ x: 40, y: 700, width: 1000, height: 60, content: 'WE TEACH ALL THREE.', fontSize: 65, color: '#FFFFFF', textAlign: 'center', scaleX: 0.76, zIndex: 10 }),
      // CTA
      makeButton({ x: 340, y: 820, width: 400, height: 56, content: 'GET ALL THREE →', bgColor: 'rgba(255,255,255,0.08)', textColor: '#FFFFFF', fontSize: 20, borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1, zIndex: 20 }),
      // Bottom strip
      makeBottomStrip('✔ Live Sessions  ·  ✔ 8+ Projects  ·  ✔ 75 Days  ·  ✔ 500 Seats  ·  March 7'),
    ],
  },

  // ── D — "500 SEATS. THEN WE CLOSE." ──
  {
    id: 'concept-d',
    filename: 'concept-d.html',
    htmlPath: '/ads/bootcamp-ai-engineering/concept-d.html',
    label: 'D — 500 SEATS. THEN WE CLOSE.',
    shortLabel: '500 Seats',
    description: 'Dhaval hero, scarcity headline, founder quote',
    group: 'standalone',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: '500 SEATS. THEN WE CLOSE.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero — tighter mask
      makeImage({ x: 460, y: 40, width: 620, height: 780, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'none', glowColor: '#3b82f6', zIndex: 5 }),
      // Headline
      makeText({ x: 40, y: 280, width: 600, height: 130, content: '500 SEATS.', fontSize: 120, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 400, width: 700, height: 130, content: 'THEN WE CLOSE.', fontSize: 120, color: '#3b82f6', zIndex: 10 }),
      // Quote
      makeText({ x: 40, y: 560, width: 500, height: 40, content: '"We intentionally keep the cohort small."', fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.5, fontStyle: 'italic', zIndex: 11 }),
      // Info line
      makeText({ x: 40, y: 610, width: 600, height: 24, content: 'AI Engineering Bootcamp · Built for Software Engineers · March 7', fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 11 }),
      // CTA
      makeButton({ x: 300, y: 840, width: 420, height: 58, content: 'CLAIM YOUR SEAT →', bgColor: '#3b82f6', textColor: '#FFFFFF', fontSize: 22, zIndex: 20 }),
      // Bottom strip
      makeBottomStrip('✔ Live Cohorts  ·  ✔ 8+ Production Projects  ·  ✔ 75 Days'),
    ],
  },

  // ── E — "BUILD." ──
  {
    id: 'concept-e',
    filename: 'concept-e.html',
    htmlPath: '/ads/bootcamp-ai-engineering/concept-e.html',
    label: 'E — BUILD.',
    shortLabel: 'Build',
    description: 'Dhaval hero centered, MODULE 1-8 badge, massive BUILD headline',
    group: 'standalone',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: 'BUILD.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Module badge
      makeBadge({ x: 860, y: 90, width: 170, height: 36, content: 'MODULE 1-8', bgColor: 'rgba(32,201,151,0.12)', textColor: '#20C997', fontSize: 14, borderRadius: 9999, borderColor: 'rgba(32,201,151,0.3)', borderWidth: 1, zIndex: 30 }),
      // Dhaval hero — centered, upper 55%, tighter mask
      makeImage({ x: 190, y: 60, width: 700, height: 560, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'none', glowColor: '#3b82f6', zIndex: 5 }),
      // Instructor line
      makeText({ x: 140, y: 600, width: 800, height: 28, content: 'Dhaval Patel · Founder, Codebasics · Ex-NVIDIA', fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.55)', textAlign: 'center', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 12 }),
      // Massive headline
      makeText({ x: 40, y: 650, width: 1000, height: 180, content: 'BUILD.', fontSize: 180, color: '#3b82f6', textAlign: 'center', scaleX: 0.72, zIndex: 10 }),
      // Topics
      makeText({ x: 140, y: 830, width: 800, height: 30, content: 'LLMs · RAG · Agents · Multi-Agent · Cloud Deploy', fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.6)', textAlign: 'center', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 11 }),
      // CTA
      makeButton({ x: 340, y: 900, width: 400, height: 56, content: 'START BUILDING →', bgColor: 'rgba(255,255,255,0.08)', textColor: '#FFFFFF', fontSize: 20, borderColor: 'rgba(255,255,255,0.2)', borderWidth: 1, zIndex: 20 }),
      // Bottom strip
      makeBottomStrip('✔ Live Sessions  ·  ✔ 8+ Projects  ·  ✔ 75 Days  ·  ✔ March 7'),
    ],
  },

  // ── F — "ORCHESTRATE." ──
  {
    id: 'concept-f',
    filename: 'concept-f.html',
    htmlPath: '/ads/bootcamp-ai-engineering/concept-f.html',
    label: 'F — ORCHESTRATE.',
    shortLabel: 'Orchestrate',
    description: 'Hemanand hero, MODULES 9-10, gold/yellow theme',
    group: 'standalone',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#D7EF3F',
    thumbnailHeadline: 'ORCHESTRATE.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Module badge
      makeBadge({ x: 840, y: 90, width: 190, height: 36, content: 'MODULES 9-10', bgColor: 'rgba(32,201,151,0.12)', textColor: '#20C997', fontSize: 14, borderRadius: 9999, borderColor: 'rgba(32,201,151,0.3)', borderWidth: 1, zIndex: 30 }),
      // Hemanand hero — centered, gold glow
      makeImage({ x: 190, y: 60, width: 700, height: 560, src: '/images/bootcamps/ai-engineering/heroes/hemanand-superhero.png', maskType: 'none', glowColor: '#D7EF3F', zIndex: 5 }),
      // Instructor line
      makeText({ x: 140, y: 600, width: 800, height: 28, content: 'Hemanand Vadivel · Co-founder · Ex-Edgewell', fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.55)', textAlign: 'center', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 12 }),
      // Massive headline
      makeText({ x: 40, y: 650, width: 1000, height: 150, content: 'ORCHESTRATE.', fontSize: 130, color: '#D7EF3F', textAlign: 'center', scaleX: 0.72, zIndex: 10 }),
      // Topics
      makeText({ x: 140, y: 830, width: 800, height: 30, content: 'Productivity · Stakeholders · Mindset · Wellness', fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.6)', textAlign: 'center', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 11 }),
      // CTA
      makeButton({ x: 300, y: 900, width: 480, height: 56, content: 'LEVEL UP YOUR CAREER →', bgColor: '#D7EF3F', textColor: '#0D1117', fontSize: 20, zIndex: 20 }),
      // Bottom strip
      makeBottomStrip('✔ Soft Skills That Ship  ·  ✔ Live Cohorts  ·  ✔ 75 Days  ·  ✔ March 7'),
    ],
  },

  // ── G — "DISTRIBUTE." ──
  {
    id: 'concept-g',
    filename: 'concept-g.html',
    htmlPath: '/ads/bootcamp-ai-engineering/concept-g.html',
    label: 'G — DISTRIBUTE.',
    shortLabel: 'Distribute',
    description: 'Siddhant hero, MODULES 11-12, green theme',
    group: 'standalone',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    thumbnailHeadline: 'DISTRIBUTE.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Module badge
      makeBadge({ x: 830, y: 90, width: 200, height: 36, content: 'MODULES 11-12', bgColor: 'rgba(32,201,151,0.12)', textColor: '#20C997', fontSize: 14, borderRadius: 9999, borderColor: 'rgba(32,201,151,0.3)', borderWidth: 1, zIndex: 30 }),
      // Siddhant hero — green glow
      makeImage({ x: 190, y: 60, width: 700, height: 560, src: '/images/bootcamps/ai-engineering/heroes/siddhant-superhero.png', maskType: 'none', glowColor: '#20C997', zIndex: 5 }),
      // Instructor line
      makeText({ x: 140, y: 600, width: 800, height: 28, content: 'Siddhant Pandey · AI Research Engineer', fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.55)', textAlign: 'center', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 12 }),
      // Massive headline
      makeText({ x: 40, y: 650, width: 1000, height: 160, content: 'DISTRIBUTE.', fontSize: 140, color: '#20C997', textAlign: 'center', scaleX: 0.72, zIndex: 10 }),
      // Topics
      makeText({ x: 140, y: 830, width: 800, height: 30, content: 'LinkedIn · GitHub · Portfolio · Personal Branding', fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.6)', textAlign: 'center', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 11 }),
      // CTA
      makeButton({ x: 370, y: 900, width: 340, height: 56, content: 'GET VISIBLE →', bgColor: '#20C997', textColor: '#0D1117', fontSize: 20, zIndex: 20 }),
      // Bottom strip
      makeBottomStrip('✔ Be Seen, Get Hired  ·  ✔ Live Cohorts  ·  ✔ 75 Days  ·  ✔ March 7'),
    ],
  },

  // ── H — "500 ENGINEERS. ONE ROOM." ──
  {
    id: 'concept-h',
    filename: 'concept-h.html',
    htmlPath: '/ads/bootcamp-ai-engineering/concept-h.html',
    label: 'H — 500 ENGINEERS. ONE ROOM.',
    shortLabel: '500 Engineers',
    description: 'Dhaval hero, personal connection theme',
    group: 'standalone',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: '500 ENGINEERS. ONE ROOM.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero — tighter mask
      makeImage({ x: 460, y: 40, width: 620, height: 780, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'none', glowColor: '#3b82f6', zIndex: 5 }),
      // Quote above headline
      makeText({ x: 40, y: 260, width: 500, height: 40, content: '"We intentionally keep the cohort small."', fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.5, fontStyle: 'italic', zIndex: 11 }),
      // Headline
      makeText({ x: 40, y: 320, width: 700, height: 130, content: '500 ENGINEERS.', fontSize: 110, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 440, width: 600, height: 130, content: 'ONE ROOM.', fontSize: 110, color: '#3b82f6', zIndex: 10 }),
      // CTA
      makeButton({ x: 300, y: 840, width: 460, height: 58, content: 'JOIN THE INNER CIRCLE →', bgColor: '#3b82f6', textColor: '#FFFFFF', fontSize: 20, zIndex: 20 }),
      // Bottom strip
      makeBottomStrip('✔ Live 2x/Week  ·  ✔ Discord Community  ·  ✔ March 7'),
    ],
  },

  // ── I — "TWO BOOTCAMPS. ONE PRICE." ──
  {
    id: 'concept-i',
    filename: 'concept-i.html',
    htmlPath: '/ads/bootcamp-ai-engineering/concept-i.html',
    label: 'I — TWO BOOTCAMPS. ONE PRICE.',
    shortLabel: 'Two Bootcamps',
    description: 'Dhaval hero with two comparison cards',
    group: 'standalone',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    thumbnailHeadline: 'TWO BOOTCAMPS. ONE PRICE.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero — right side, tighter mask
      makeImage({ x: 560, y: 40, width: 520, height: 600, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'none', glowColor: '#3b82f6', zIndex: 4 }),
      // Left card — "YOU ENROLL IN"
      makeShape({ x: 50, y: 130, width: 470, height: 280, bgColor: 'rgba(32,201,151,0.06)', borderRadius: 16, borderColor: 'rgba(32,201,151,0.25)', borderWidth: 1, zIndex: 8 }),
      makeText({ x: 70, y: 145, width: 200, height: 20, content: 'YOU ENROLL IN', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)', scaleX: 1, letterSpacing: 2, lineHeight: 1.2, zIndex: 9 }),
      makeText({ x: 70, y: 175, width: 420, height: 32, content: 'AI Engineering Bootcamp 1.0', fontSize: 22, fontWeight: 700, color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 9 }),
      makeText({ x: 70, y: 218, width: 420, height: 24, content: '75 days · Live cohorts · 8+ projects', fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.55)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 9 }),
      makeText({ x: 70, y: 260, width: 200, height: 44, content: '₹36,000', fontSize: 36, fontWeight: 900, color: '#20C997', scaleX: 1, lineHeight: 1, zIndex: 9 }),
      // Right card — "YOU ALSO GET"
      makeShape({ x: 560, y: 130, width: 470, height: 280, bgColor: 'rgba(32,201,151,0.06)', borderRadius: 16, borderColor: 'rgba(32,201,151,0.25)', borderWidth: 1, zIndex: 8 }),
      makeText({ x: 580, y: 145, width: 200, height: 20, content: 'YOU ALSO GET', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)', scaleX: 1, letterSpacing: 2, lineHeight: 1.2, zIndex: 9 }),
      makeText({ x: 580, y: 175, width: 420, height: 32, content: 'Gen AI & Data Science Bootcamp 3.0', fontSize: 20, fontWeight: 700, color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 9 }),
      makeText({ x: 580, y: 218, width: 420, height: 24, content: 'Job assistance · Resume · Interviews', fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.55)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 9 }),
      makeText({ x: 580, y: 260, width: 200, height: 30, content: 'Worth ₹24,500', fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, lineHeight: 1, zIndex: 9 }),
      // "Included for Free" badge
      makeBadge({ x: 580, y: 300, width: 180, height: 34, content: 'Included for Free', bgColor: '#E8795A', textColor: '#FFFFFF', fontSize: 14, borderRadius: 8, zIndex: 10 }),
      // Headline
      makeText({ x: 40, y: 500, width: 1000, height: 110, content: 'TWO BOOTCAMPS.', fontSize: 100, color: '#FFFFFF', textAlign: 'center', zIndex: 10 }),
      makeText({ x: 40, y: 610, width: 1000, height: 110, content: 'ONE PRICE.', fontSize: 100, color: '#20C997', textAlign: 'center', zIndex: 10 }),
      // CTA
      makeButton({ x: 280, y: 780, width: 520, height: 58, content: 'GET BOTH BOOTCAMPS →', bgColor: '#20C997', textColor: '#0D1117', fontSize: 22, zIndex: 20 }),
      // Bottom strip
      makeBottomStrip('✔ Complete AI Career Stack  ·  ✔ 500 Seats  ·  ✔ March 7'),
    ],
  },

  // ── J — "₹36,000 / 75 DAYS TO BECOME AN AI ENGINEER." ──
  {
    id: 'concept-j',
    filename: 'concept-j.html',
    htmlPath: '/ads/bootcamp-ai-engineering/concept-j.html',
    label: 'J — ₹36,000 / 75 DAYS',
    shortLabel: '₹36,000 / 75 Days',
    description: 'Price card with feature checklist, Dhaval background hero',
    group: 'standalone',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: '₹36,000 — 75 DAYS',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero — right side, faded, tighter mask
      makeImage({ x: 500, y: 100, width: 580, height: 700, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', maskParams: 'ellipse 60% 55% at center 40%, black 20%, transparent 90%', opacity: 0.5, glowColor: '#3b82f6', zIndex: 3 }),
      // "INVESTMENT" label
      makeText({ x: 40, y: 120, width: 200, height: 20, content: 'INVESTMENT', fontSize: 14, fontWeight: 600, color: '#3b82f6', scaleX: 1, letterSpacing: 2, lineHeight: 1.2, zIndex: 11 }),
      // Price
      makeText({ x: 40, y: 155, width: 500, height: 100, content: '₹36,000', fontSize: 100, color: '#FFFFFF', zIndex: 10 }),
      // Free bonus
      makeText({ x: 40, y: 265, width: 600, height: 28, content: '+ Gen AI & DS Bootcamp Included for Free', fontSize: 18, fontWeight: 500, color: '#20C997', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 11 }),
      // "75 DAYS TO BECOME / AN AI ENGINEER."
      makeText({ x: 40, y: 330, width: 700, height: 55, content: '75 DAYS TO BECOME', fontSize: 50, color: '#FFFFFF', scaleX: 0.76, zIndex: 10 }),
      makeText({ x: 40, y: 390, width: 700, height: 55, content: 'AN AI ENGINEER.', fontSize: 50, color: '#3b82f6', scaleX: 0.76, zIndex: 10 }),
      // Feature checklist
      makeText({ x: 60, y: 480, width: 600, height: 28, content: '✔  Live sessions 2x/week', fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.75)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, zIndex: 11 }),
      makeText({ x: 60, y: 516, width: 600, height: 28, content: '✔  8+ production projects you deploy', fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.75)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, zIndex: 11 }),
      makeText({ x: 60, y: 552, width: 600, height: 28, content: '✔  500 seats only · March 7 batch', fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.75)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, zIndex: 11 }),
      makeText({ x: 60, y: 588, width: 600, height: 28, content: '✔  Full refund before March 14', fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.75)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, zIndex: 11 }),
      // CTA
      makeButton({ x: 300, y: 840, width: 480, height: 60, content: 'ENROLL NOW — ₹36,000 →', bgColor: '#3b82f6', textColor: '#FFFFFF', fontSize: 22, zIndex: 20 }),
      // Bottom strip
      makeBottomStrip('✔ EMI Available  ·  ✔ No-Risk Refund  ·  ✔ March 7'),
    ],
  },

  // ── Homepage Banner — SWE to AI Engineer (1920×680) ──
  {
    id: 'homepage-banner-swe-to-ai',
    filename: 'homepage-banner.html',
    label: 'Homepage Banner — SWE to AI Engineer',
    shortLabel: 'SWE → AI Engineer',
    description: 'Full-width 1920×680 banner with superhero trio, gradient headline, three pillars',
    group: 'banner',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0A0E14',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: 'SWE → AI ENGINEER',
    targetSize: { width: 1920, height: 680 },
    createElements: () => [
      // ── Background ambient glows (decorative, low z-index) ──
      makeShape({ x: 1100, y: 50, width: 700, height: 500, bgColor: 'rgba(59,130,246,0.12)', borderRadius: 999, zIndex: 1 }),
      makeShape({ x: 300, y: 150, width: 500, height: 400, bgColor: 'rgba(245,158,11,0.08)', borderRadius: 999, zIndex: 1 }),
      makeShape({ x: 1500, y: 200, width: 400, height: 350, bgColor: 'rgba(32,201,151,0.08)', borderRadius: 999, zIndex: 1 }),

      // ── Element 16: Codebasics Logo (top-left) ──
      makeImage({ x: 90, y: 28, width: 120, height: 40, src: '/logos/codebasics-white.svg', zIndex: 30, maskType: 'none', objectFit: 'contain' }),

      // ── Element 15: YouTube Badge (top-right) ──
      makeBadge({ x: 1720, y: 28, width: 210, height: 32, content: '▶ 1.4M+ Subscribers · 4.9★', bgColor: 'rgba(255,255,255,0.03)', textColor: 'rgba(255,255,255,0.65)', fontSize: 11, borderRadius: 8, zIndex: 30, borderColor: 'rgba(255,255,255,0.12)', borderWidth: 1 }),

      // ── Element 1: Launch Badge (top-left) ──
      makeBadge({ x: 90, y: 80, width: 250, height: 28, content: '● NEW LAUNCH · LIVE COHORT', bgColor: 'rgba(59,130,246,0.1)', textColor: '#3b82f6', fontSize: 11, borderRadius: 100, zIndex: 25, borderColor: 'rgba(59,130,246,0.2)', borderWidth: 1 }),

      // ── Element 2: Bootcamp Title Label ──
      makeText({ x: 90, y: 130, width: 500, height: 20, content: 'AI ENGINEERING BOOTCAMP 1.0', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: 5, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),

      // ── Element 3: "Go From" text ──
      makeText({ x: 90, y: 160, width: 200, height: 32, content: 'Go From', fontSize: 26, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── Element 4: "Software Engineer" headline ──
      makeText({ x: 90, y: 190, width: 700, height: 85, content: 'Software Engineer', fontSize: 78, fontWeight: 900, color: '#FFFFFF', letterSpacing: -2, scaleX: 1, lineHeight: 1.0, zIndex: 10 }),

      // ── Element 5: "to" connector text ──
      makeText({ x: 90, y: 275, width: 100, height: 32, content: 'to', fontSize: 26, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── Element 6: "AI Engineer" headline (blue) ──
      makeText({ x: 90, y: 300, width: 600, height: 85, content: 'AI Engineer', fontSize: 78, fontWeight: 900, color: '#3b82f6', letterSpacing: -2, scaleX: 1, lineHeight: 1.0, zIndex: 10 }),

      // ── Element 7: "in" part ──
      makeText({ x: 90, y: 385, width: 40, height: 36, content: 'in', fontSize: 28, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),
      // ── Element 7b: "75 Days." part (lime yellow) ──
      makeText({ x: 130, y: 385, width: 200, height: 36, content: '75 Days.', fontSize: 28, fontWeight: 800, color: '#D7EF3F', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── Element 8: BUILD pillar ──
      makeText({ x: 90, y: 440, width: 120, height: 28, content: 'BUILD', fontSize: 20, fontWeight: 900, color: '#3b82f6', letterSpacing: 4, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      // Divider line between BUILD and ORCHESTRATE
      makeShape({ x: 215, y: 440, width: 2, height: 28, bgColor: 'rgba(255,255,255,0.15)', borderRadius: 0, zIndex: 10 }),
      // ── Element 9: ORCHESTRATE pillar ──
      makeText({ x: 230, y: 440, width: 220, height: 28, content: 'ORCHESTRATE', fontSize: 20, fontWeight: 900, color: '#D7EF3F', letterSpacing: 4, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      // Divider line between ORCHESTRATE and DISTRIBUTE
      makeShape({ x: 455, y: 440, width: 2, height: 28, bgColor: 'rgba(255,255,255,0.15)', borderRadius: 0, zIndex: 10 }),
      // ── Element 10: DISTRIBUTE pillar ──
      makeText({ x: 470, y: 440, width: 210, height: 28, content: 'DISTRIBUTE', fontSize: 20, fontWeight: 900, color: '#20C997', letterSpacing: 4, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),

      // ── Element 11: CTA Button ──
      makeButton({ x: 90, y: 500, width: 230, height: 50, content: 'Explore Bootcamp →', bgColor: '#3b82f6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 12, zIndex: 20 }),

      // ── Element 12: "Starts" meta ──
      makeText({ x: 340, y: 500, width: 130, height: 20, content: 'STARTS', fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      makeText({ x: 340, y: 520, width: 130, height: 24, content: 'March 7, 2026', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── Element 13: "Format" meta ──
      makeText({ x: 500, y: 500, width: 130, height: 20, content: 'FORMAT', fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      makeText({ x: 500, y: 520, width: 130, height: 24, content: 'Live Sessions', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── Element 14: Superhero Trio Image ──
      makeImage({ x: 1200, y: -30, width: 720, height: 720, src: '/images/bootcamps/ai-engineering/heroes/superhero-trio-soft.png', maskType: 'radial', maskParams: 'ellipse 85% 85% at 50% 45%, black 40%, transparent 75%', glowColor: '#3b82f6', zIndex: 5 }),
    ],
  },

  // ── Homepage Banner — SWE to AI Engineer (1300×500) ──
  {
    id: 'homepage-banner-large-swe-to-ai',
    filename: 'homepage-banner-large.html',
    label: 'Homepage Large — SWE to AI Engineer',
    shortLabel: 'SWE → AI (Large)',
    description: '1300×500 banner with superhero trio, headline, three pillars',
    group: 'banner',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0A0E14',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: 'SWE → AI ENGINEER',
    targetSize: { width: 1300, height: 500 },
    createElements: () => [
      // ── Ambient glows (scaled from 1920×680) ──
      makeShape({ x: 745, y: 37, width: 474, height: 368, bgColor: 'rgba(59,130,246,0.12)', borderRadius: 999, zIndex: 1 }),
      makeShape({ x: 203, y: 110, width: 339, height: 294, bgColor: 'rgba(245,158,11,0.08)', borderRadius: 999, zIndex: 1 }),
      makeShape({ x: 1016, y: 147, width: 271, height: 257, bgColor: 'rgba(32,201,151,0.08)', borderRadius: 999, zIndex: 1 }),

      // ── Logo (top-left) ──
      makeImage({ x: 61, y: 21, width: 84, height: 30, src: '/logos/codebasics-white.svg', zIndex: 30, maskType: 'none', objectFit: 'contain' }),

      // ── YouTube Badge (top-right) ──
      makeBadge({ x: 1090, y: 21, width: 180, height: 26, content: '▶ 1.4M+ Subscribers · 4.9★', bgColor: 'rgba(255,255,255,0.03)', textColor: 'rgba(255,255,255,0.65)', fontSize: 9, borderRadius: 6, zIndex: 30, borderColor: 'rgba(255,255,255,0.12)', borderWidth: 1 }),

      // ── Launch Badge ──
      makeBadge({ x: 61, y: 59, width: 200, height: 22, content: '● NEW LAUNCH · LIVE COHORT', bgColor: 'rgba(59,130,246,0.1)', textColor: '#3b82f6', fontSize: 9, borderRadius: 100, zIndex: 25, borderColor: 'rgba(59,130,246,0.2)', borderWidth: 1 }),

      // ── Bootcamp Title ──
      makeText({ x: 61, y: 96, width: 339, height: 15, content: 'AI ENGINEERING BOOTCAMP 1.0', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: 3, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),

      // ── "Go From" ──
      makeText({ x: 61, y: 118, width: 135, height: 24, content: 'Go From', fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── "Software Engineer" headline ──
      makeText({ x: 61, y: 140, width: 474, height: 63, content: 'Software Engineer', fontSize: 55, fontWeight: 900, color: '#FFFFFF', letterSpacing: -1, scaleX: 1, lineHeight: 1.0, zIndex: 10 }),

      // ── "to" connector ──
      makeText({ x: 61, y: 202, width: 68, height: 24, content: 'to', fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── "AI Engineer" headline (blue) ──
      makeText({ x: 61, y: 221, width: 406, height: 63, content: 'AI Engineer', fontSize: 55, fontWeight: 900, color: '#3b82f6', letterSpacing: -1, scaleX: 1, lineHeight: 1.0, zIndex: 10 }),

      // ── "in" ──
      makeText({ x: 61, y: 283, width: 27, height: 26, content: 'in', fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),
      // ── "75 Days." (lime yellow) ──
      makeText({ x: 88, y: 283, width: 135, height: 26, content: '75 Days.', fontSize: 20, fontWeight: 800, color: '#D7EF3F', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── BUILD pillar ──
      makeText({ x: 61, y: 324, width: 81, height: 21, content: 'BUILD', fontSize: 14, fontWeight: 900, color: '#3b82f6', letterSpacing: 3, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      makeShape({ x: 146, y: 324, width: 2, height: 21, bgColor: 'rgba(255,255,255,0.15)', borderRadius: 0, zIndex: 10 }),
      // ── ORCHESTRATE pillar ──
      makeText({ x: 156, y: 324, width: 149, height: 21, content: 'ORCHESTRATE', fontSize: 14, fontWeight: 900, color: '#D7EF3F', letterSpacing: 3, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      makeShape({ x: 308, y: 324, width: 2, height: 21, bgColor: 'rgba(255,255,255,0.15)', borderRadius: 0, zIndex: 10 }),
      // ── DISTRIBUTE pillar ──
      makeText({ x: 318, y: 324, width: 142, height: 21, content: 'DISTRIBUTE', fontSize: 14, fontWeight: 900, color: '#20C997', letterSpacing: 3, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),

      // ── CTA Button ──
      makeButton({ x: 61, y: 368, width: 180, height: 38, content: 'Explore Bootcamp →', bgColor: '#3b82f6', textColor: '#FFFFFF', fontSize: 12, borderRadius: 10, zIndex: 20 }),

      // ── "Starts" meta ──
      makeText({ x: 260, y: 368, width: 100, height: 15, content: 'STARTS', fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      makeText({ x: 260, y: 383, width: 100, height: 18, content: 'March 7, 2026', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── "Format" meta ──
      makeText({ x: 390, y: 368, width: 100, height: 15, content: 'FORMAT', fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: 1.5, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      makeText({ x: 390, y: 383, width: 100, height: 18, content: 'Live Sessions', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── Superhero Trio Image ──
      makeImage({ x: 812, y: -22, width: 488, height: 530, src: '/images/bootcamps/ai-engineering/heroes/superhero-trio-soft.png', maskType: 'radial', maskParams: 'ellipse 85% 85% at 50% 45%, black 40%, transparent 75%', glowColor: '#3b82f6', zIndex: 5 }),
    ],
  },

  // ── Homepage Banner — SWE to AI Engineer (800×283) ──
  {
    id: 'homepage-banner-small-swe-to-ai',
    filename: 'homepage-banner-small.html',
    label: 'Homepage Small — SWE to AI Engineer',
    shortLabel: 'SWE → AI (Small)',
    description: '800×283 compact banner with superhero trio, headline, CTA',
    group: 'banner',
    bootcamp: 'ai-engineering-1.0',
    thumbnailBg: '#0A0E14',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: 'SWE → AI ENGINEER',
    targetSize: { width: 800, height: 283 },
    createElements: () => [
      // ── Single ambient glow ──
      makeShape({ x: 460, y: 20, width: 300, height: 220, bgColor: 'rgba(59,130,246,0.12)', borderRadius: 999, zIndex: 1 }),

      // ── "Go From" ──
      makeText({ x: 30, y: 20, width: 80, height: 16, content: 'Go From', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── "Software Engineer" headline ──
      makeText({ x: 30, y: 36, width: 320, height: 40, content: 'Software Engineer', fontSize: 36, fontWeight: 900, color: '#FFFFFF', letterSpacing: -1, scaleX: 1, lineHeight: 1.0, zIndex: 10 }),

      // ── "to" connector ──
      makeText({ x: 30, y: 76, width: 40, height: 16, content: 'to', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.65)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── "AI Engineer" headline (blue) ──
      makeText({ x: 30, y: 92, width: 280, height: 40, content: 'AI Engineer', fontSize: 36, fontWeight: 900, color: '#3b82f6', letterSpacing: -1, scaleX: 1, lineHeight: 1.0, zIndex: 10 }),

      // ── "in" ──
      makeText({ x: 30, y: 135, width: 30, height: 18, content: 'in', fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),
      // ── "75 Days." (lime yellow) ──
      makeText({ x: 60, y: 135, width: 100, height: 18, content: '75 Days.', fontSize: 14, fontWeight: 800, color: '#D7EF3F', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 10 }),

      // ── BUILD pillar ──
      makeText({ x: 30, y: 165, width: 55, height: 14, content: 'BUILD', fontSize: 9, fontWeight: 900, color: '#3b82f6', letterSpacing: 2, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      makeShape({ x: 88, y: 165, width: 2, height: 14, bgColor: 'rgba(255,255,255,0.15)', borderRadius: 0, zIndex: 10 }),
      // ── ORCHESTRATE pillar ──
      makeText({ x: 96, y: 165, width: 95, height: 14, content: 'ORCHESTRATE', fontSize: 9, fontWeight: 900, color: '#D7EF3F', letterSpacing: 2, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      makeShape({ x: 195, y: 165, width: 2, height: 14, bgColor: 'rgba(255,255,255,0.15)', borderRadius: 0, zIndex: 10 }),
      // ── DISTRIBUTE pillar ──
      makeText({ x: 203, y: 165, width: 90, height: 14, content: 'DISTRIBUTE', fontSize: 9, fontWeight: 900, color: '#20C997', letterSpacing: 2, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),

      // ── CTA Button ──
      makeButton({ x: 30, y: 200, width: 160, height: 32, content: 'Explore Bootcamp →', bgColor: '#3b82f6', textColor: '#FFFFFF', fontSize: 10, borderRadius: 8, zIndex: 20 }),

      // ── Compact meta (next to CTA) ──
      makeText({ x: 210, y: 202, width: 120, height: 13, content: 'STARTS MARCH 7', fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: 1, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      makeText({ x: 210, y: 217, width: 120, height: 13, content: 'LIVE SESSIONS', fontSize: 8, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: 1, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),

      // ── Superhero Trio Image (right side, bleeds off edge) ──
      makeImage({ x: 480, y: -15, width: 340, height: 310, src: '/images/bootcamps/ai-engineering/heroes/superhero-trio-soft.png', maskType: 'radial', maskParams: 'ellipse 85% 85% at 50% 45%, black 40%, transparent 75%', glowColor: '#3b82f6', zIndex: 5 }),
    ],
  },

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // Data Analytics Bootcamp 5.0 Templates
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ── DA-01: The Roadmap ──
  {
    id: 'da-concept-01',
    filename: 'da-01-roadmap.html',
    label: 'DA-01 — The Roadmap',
    shortLabel: 'DA-01 Roadmap',
    description: '5-step career roadmap with tool circles',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: 'YOUR DA CAREER IN 5 STEPS',
    createElements: () => [
      ...makeDACommon(),
      // Headline — Saira Condensed 900
      makeText({ x: 70, y: 100, width: 900, height: 50, content: 'YOUR DATA ANALYTICS CAREER', fontSize: 42, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', scaleX: 0.78, letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 70, y: 155, width: 700, height: 50, content: 'IN 5 CLEAR STEPS.', fontSize: 42, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', scaleX: 0.78, letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // Vertical line connecting steps
      makeShape({ x: 105, y: 250, width: 2, height: 520, bgColor: 'rgba(59,130,246,0.25)', borderRadius: 0, zIndex: 6 }),
      // Step 1 — blue dot + text
      makeShape({ x: 94, y: 260, width: 24, height: 24, bgColor: '#3B82F6', borderRadius: 12, zIndex: 8 }),
      makeText({ x: 96, y: 262, width: 20, height: 20, content: '1', fontSize: 11, fontWeight: 800, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.6, textTransform: 'none', zIndex: 9 }),
      makeText({ x: 140, y: 260, width: 500, height: 24, content: 'Learn SQL & Excel', fontSize: 18, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 9 }),
      // Step 2
      makeShape({ x: 94, y: 370, width: 24, height: 24, bgColor: '#3B82F6', borderRadius: 12, zIndex: 8 }),
      makeText({ x: 96, y: 372, width: 20, height: 20, content: '2', fontSize: 11, fontWeight: 800, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.6, textTransform: 'none', zIndex: 9 }),
      makeText({ x: 140, y: 370, width: 500, height: 24, content: 'Master Power BI & Tableau', fontSize: 18, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 9 }),
      // Step 3
      makeShape({ x: 94, y: 480, width: 24, height: 24, bgColor: '#3B82F6', borderRadius: 12, zIndex: 8 }),
      makeText({ x: 96, y: 482, width: 20, height: 20, content: '3', fontSize: 11, fontWeight: 800, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.6, textTransform: 'none', zIndex: 9 }),
      makeText({ x: 140, y: 480, width: 500, height: 24, content: 'Python for Analytics', fontSize: 18, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 9 }),
      // Step 4
      makeShape({ x: 94, y: 590, width: 24, height: 24, bgColor: '#3B82F6', borderRadius: 12, zIndex: 8 }),
      makeText({ x: 96, y: 592, width: 20, height: 20, content: '4', fontSize: 11, fontWeight: 800, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.6, textTransform: 'none', zIndex: 9 }),
      makeText({ x: 140, y: 590, width: 500, height: 24, content: 'Build Your Portfolio — 18 projects', fontSize: 18, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 9 }),
      // Step 5
      makeShape({ x: 94, y: 700, width: 24, height: 24, bgColor: '#D7EF3F', borderRadius: 12, zIndex: 8 }),
      makeText({ x: 96, y: 702, width: 20, height: 20, content: '5', fontSize: 11, fontWeight: 800, fontFamily: 'Manrope', color: '#181830', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.6, textTransform: 'none', zIndex: 9 }),
      makeText({ x: 140, y: 700, width: 500, height: 24, content: 'Get Hired', fontSize: 18, fontWeight: 700, fontFamily: 'Manrope', color: '#D7EF3F', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 9 }),
      // Hero — both instructors (right side)
      makeImage({ x: 550, y: 250, width: 500, height: 550, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
      // CTA
      makeButton({ x: 140, y: 780, width: 220, height: 44, content: 'Start Your Journey →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
    ],
  },

  // ── DA-02: The Placement Wall ──
  {
    id: 'da-concept-02',
    filename: 'da-02-placements.html',
    label: 'DA-02 — The Placement Wall',
    shortLabel: 'DA-02 Placements',
    description: '300+ placements with screenshot placeholder',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: '300+ PLACEMENTS',
    createElements: () => [
      ...makeDACommon(),
      // Headlines — Saira Condensed 900
      makeText({ x: 70, y: 100, width: 550, height: 60, content: '300+ PLACEMENTS', fontSize: 52, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', scaleX: 0.78, letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 70, y: 165, width: 550, height: 42, content: 'IN THE LAST 3 MONTHS.', fontSize: 36, fontWeight: 700, fontFamily: 'Saira Condensed', color: '#D7EF3F', scaleX: 1, letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // DA hero image — right side
      makeImage({ x: 550, y: 80, width: 500, height: 650, src: '/images/bootcamps/data-analytics/heroes/dhaval-da-superhero.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 55% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
      // 3 stat pills bottom
      makeBadge({ x: 70, y: 800, width: 280, height: 40, content: '₹8L+ Avg Package', bgColor: 'rgba(59,130,246,0.08)', textColor: '#FFFFFF', fontSize: 13, borderRadius: 8, zIndex: 9, borderColor: 'rgba(59,130,246,0.2)', borderWidth: 1 }),
      makeBadge({ x: 390, y: 800, width: 240, height: 40, content: '4.9★ Rating', bgColor: 'rgba(59,130,246,0.08)', textColor: '#FFFFFF', fontSize: 13, borderRadius: 8, zIndex: 9, borderColor: 'rgba(59,130,246,0.2)', borderWidth: 1 }),
      makeBadge({ x: 670, y: 800, width: 260, height: 40, content: '1M+ Learners', bgColor: 'rgba(59,130,246,0.08)', textColor: '#FFFFFF', fontSize: 13, borderRadius: 8, zIndex: 9, borderColor: 'rgba(59,130,246,0.2)', borderWidth: 1 }),
      // CTA
      makeButton({ x: 70, y: 900, width: 260, height: 44, content: 'See All Success Stories →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
    ],
  },

  // ── DA-03: The Non-Tech Entry Point ──
  {
    id: 'da-concept-03',
    filename: 'da-03-no-cs-degree.html',
    label: 'DA-03 — No CS Degree',
    shortLabel: 'DA-03 No CS Degree',
    description: 'Dhaval hero drop-zone, non-tech audience messaging',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: 'NO CS DEGREE? NO PROBLEM.',
    createElements: () => [
      ...makeDACommon(),
      // Headlines — Saira Condensed 900
      makeText({ x: 0, y: 120, width: 1080, height: 55, content: 'NO CS DEGREE? NO CODING BACKGROUND?', fontSize: 44, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 190, width: 1080, height: 55, content: 'NO PROBLEM.', fontSize: 48, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // Red cross ✕ items
      makeShape({ x: 120, y: 310, width: 240, height: 70, bgColor: 'rgba(239,68,68,0.08)', borderRadius: 12, borderColor: 'rgba(239,68,68,0.2)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 120, y: 325, width: 240, height: 40, content: '✕ No CS Degree', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#EF4444', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeShape({ x: 420, y: 310, width: 240, height: 70, bgColor: 'rgba(239,68,68,0.08)', borderRadius: 12, borderColor: 'rgba(239,68,68,0.2)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 420, y: 325, width: 240, height: 40, content: '✕ No Coding', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#EF4444', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeShape({ x: 720, y: 310, width: 240, height: 70, bgColor: 'rgba(239,68,68,0.08)', borderRadius: 12, borderColor: 'rgba(239,68,68,0.2)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 720, y: 325, width: 240, height: 40, content: '✕ No Experience', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#EF4444', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // Lime green ✓ row
      makeShape({ x: 120, y: 420, width: 840, height: 70, bgColor: 'rgba(215,239,63,0.08)', borderRadius: 12, borderColor: 'rgba(215,239,63,0.25)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 120, y: 435, width: 840, height: 40, content: '✓ Just the drive to build a data career', fontSize: 18, fontWeight: 700, fontFamily: 'Manrope', color: '#D7EF3F', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // CTA
      makeButton({ x: 390, y: 550, width: 300, height: 44, content: 'Explore Bootcamp →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
      // Hero — both instructors
      makeImage({ x: 150, y: 620, width: 780, height: 380, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
    ],
  },

  // ── DA-04: The Tool Stack ──
  {
    id: 'da-concept-04',
    filename: 'da-04-skills.html',
    label: 'DA-04 — The Tool Stack',
    shortLabel: 'DA-04 Skills',
    description: '4 tool icons + AI badge, skills headline',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: '4 SKILLS. 18 PROJECTS.',
    createElements: () => [
      ...makeDACommon(),
      // Headlines — Saira Condensed 900
      makeText({ x: 0, y: 110, width: 1080, height: 60, content: '4 SKILLS. 18 PROJECTS.', fontSize: 52, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 180, width: 1080, height: 60, content: '1 CAREER CHANGE.', fontSize: 52, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // Skill chips row
      makeBadge({ x: 100, y: 290, width: 80, height: 34, content: 'SQL', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.7)', fontSize: 12, borderRadius: 8, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      makeBadge({ x: 200, y: 290, width: 80, height: 34, content: 'Excel', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.7)', fontSize: 12, borderRadius: 8, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      makeBadge({ x: 300, y: 290, width: 110, height: 34, content: 'Power BI', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.7)', fontSize: 12, borderRadius: 8, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      makeBadge({ x: 430, y: 290, width: 110, height: 34, content: 'Tableau', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.7)', fontSize: 12, borderRadius: 8, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      makeBadge({ x: 560, y: 290, width: 100, height: 34, content: 'Python', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.7)', fontSize: 12, borderRadius: 8, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      makeBadge({ x: 680, y: 290, width: 120, height: 34, content: 'Statistics', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.7)', fontSize: 12, borderRadius: 8, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      // 3 metric numbers
      makeText({ x: 140, y: 390, width: 200, height: 50, content: '18', fontSize: 44, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 10 }),
      makeText({ x: 140, y: 440, width: 200, height: 20, content: 'Projects', fontSize: 13, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 10 }),
      makeShape({ x: 380, y: 395, width: 1, height: 60, bgColor: 'rgba(255,255,255,0.08)', borderRadius: 0, zIndex: 8 }),
      makeText({ x: 420, y: 390, width: 200, height: 50, content: '4', fontSize: 44, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 10 }),
      makeText({ x: 420, y: 440, width: 200, height: 20, content: 'Skills', fontSize: 13, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 10 }),
      makeShape({ x: 660, y: 395, width: 1, height: 60, bgColor: 'rgba(255,255,255,0.08)', borderRadius: 0, zIndex: 8 }),
      makeText({ x: 700, y: 390, width: 200, height: 50, content: '1', fontSize: 44, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 10 }),
      makeText({ x: 700, y: 440, width: 200, height: 20, content: 'Career Change', fontSize: 13, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 10 }),
      // CTA
      makeButton({ x: 430, y: 510, width: 220, height: 44, content: 'Enroll Now →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
      // Hero — both instructors
      makeImage({ x: 150, y: 560, width: 780, height: 420, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
    ],
  },

  // ── DA-05: The 5.0 Legacy ──
  {
    id: 'da-concept-05',
    filename: 'da-05-social-proof.html',
    label: 'DA-05 — The 5.0 Legacy',
    shortLabel: 'DA-05 Social Proof',
    description: 'Massive 5.0 with stars and review count',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: 'VERSION 5.0',
    createElements: () => [
      ...makeDACommon(),
      // Headline — Saira Condensed
      makeText({ x: 0, y: 100, width: 1080, height: 40, content: 'VERSION 5.0 /', fontSize: 28, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: 2, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      makeText({ x: 0, y: 145, width: 1080, height: 40, content: '4,803 VERIFIED REVIEWS', fontSize: 28, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: 2, scaleX: 1, lineHeight: 1.2, zIndex: 10 }),
      // Lime on "4,803"
      makeText({ x: 280, y: 145, width: 120, height: 40, content: '4,803', fontSize: 28, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: 2, scaleX: 1, lineHeight: 1.2, zIndex: 11 }),
      // Large faded "5.0" background text
      makeText({ x: 200, y: 200, width: 680, height: 280, content: '5.0', fontSize: 250, fontWeight: 900, fontFamily: 'Saira Condensed', color: 'rgba(59,130,246,0.06)', textAlign: 'center', scaleX: 1, letterSpacing: -6, lineHeight: 0.92, zIndex: 3 }),
      // 5 lime stars
      makeText({ x: 0, y: 480, width: 1080, height: 40, content: '★★★★★', fontSize: 32, fontWeight: 400, color: '#D7EF3F', textAlign: 'center', scaleX: 1, letterSpacing: 6, lineHeight: 1.0, textTransform: 'none', zIndex: 10 }),
      // 2x2 proof grid
      makeShape({ x: 140, y: 570, width: 360, height: 80, bgColor: 'rgba(255,255,255,0.03)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 140, y: 585, width: 360, height: 24, content: '1M+', fontSize: 22, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 140, y: 615, width: 360, height: 18, content: 'Learners', fontSize: 11, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeShape({ x: 580, y: 570, width: 360, height: 80, bgColor: 'rgba(255,255,255,0.03)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 580, y: 585, width: 360, height: 24, content: '4.9★', fontSize: 22, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 580, y: 615, width: 360, height: 18, content: 'Rating', fontSize: 11, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeShape({ x: 140, y: 670, width: 360, height: 80, bgColor: 'rgba(255,255,255,0.03)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 140, y: 685, width: 360, height: 24, content: '300+', fontSize: 22, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 140, y: 715, width: 360, height: 18, content: 'Placements', fontSize: 11, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeShape({ x: 580, y: 670, width: 360, height: 80, bgColor: 'rgba(255,255,255,0.03)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 580, y: 685, width: 360, height: 24, content: '5th', fontSize: 22, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 580, y: 715, width: 360, height: 18, content: 'Version', fontSize: 11, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // CTA
      makeButton({ x: 430, y: 810, width: 220, height: 44, content: 'See Why →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
    ],
  },

  // ── DA-06: The Simple Promise ──
  {
    id: 'da-concept-06',
    filename: 'da-06-promise.html',
    label: 'DA-06 — The Simple Promise',
    shortLabel: 'DA-06 Promise',
    description: 'Hemanand hero drop-zone, Learn Data / Build Dashboards / Get Promoted',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: 'LEARN. BUILD. GET PROMOTED.',
    createElements: () => [
      ...makeDACommon(),
      // Headlines — Saira Condensed 900
      makeText({ x: 0, y: 100, width: 1080, height: 55, content: 'LEARN DATA. BUILD', fontSize: 48, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 160, width: 1080, height: 55, content: 'DASHBOARDS.', fontSize: 48, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 220, width: 1080, height: 55, content: 'GET PROMOTED.', fontSize: 48, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // 3 arrow steps
      // Step 1
      makeShape({ x: 60, y: 340, width: 290, height: 140, bgColor: 'rgba(59,130,246,0.06)', borderRadius: 12, borderColor: 'rgba(59,130,246,0.15)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 60, y: 355, width: 290, height: 30, content: '📊', fontSize: 24, fontWeight: 400, textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 60, y: 395, width: 290, height: 24, content: 'Learn SQL Python', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 60, y: 420, width: 290, height: 20, content: '& BI Tools', fontSize: 12, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // Arrow →
      makeText({ x: 360, y: 395, width: 30, height: 30, content: '→', fontSize: 20, fontWeight: 700, color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 8 }),
      // Step 2
      makeShape({ x: 395, y: 340, width: 290, height: 140, bgColor: 'rgba(59,130,246,0.06)', borderRadius: 12, borderColor: 'rgba(59,130,246,0.15)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 395, y: 355, width: 290, height: 30, content: '🎯', fontSize: 24, fontWeight: 400, textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 395, y: 395, width: 290, height: 24, content: 'Build 18 Real-World', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 395, y: 420, width: 290, height: 20, content: 'Dashboards', fontSize: 12, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // Arrow →
      makeText({ x: 695, y: 395, width: 30, height: 30, content: '→', fontSize: 20, fontWeight: 700, color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 8 }),
      // Step 3
      makeShape({ x: 730, y: 340, width: 290, height: 140, bgColor: 'rgba(59,130,246,0.06)', borderRadius: 12, borderColor: 'rgba(59,130,246,0.15)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 730, y: 355, width: 290, height: 30, content: '🚀', fontSize: 24, fontWeight: 400, textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 730, y: 395, width: 290, height: 24, content: 'Get Hired with', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 730, y: 420, width: 290, height: 20, content: 'Job Support', fontSize: 12, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // CTA
      makeButton({ x: 430, y: 540, width: 220, height: 44, content: 'Start Learning →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
      // Hero — both instructors
      makeImage({ x: 150, y: 600, width: 780, height: 400, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
    ],
  },

  // ── DA-07: The Credibility Template ──
  {
    id: 'da-concept-07',
    filename: 'da-07-instructors.html',
    label: 'DA-07 — Instructors',
    shortLabel: 'DA-07 Instructors',
    description: 'Both instructors side by side with credentials',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: 'LEARN FROM THE BEST',
    createElements: () => [
      ...makeDACommon(),
      // Headline — Saira Condensed 900; "THE BEST" in lime
      makeText({ x: 0, y: 80, width: 540, height: 45, content: 'LEARN FROM', fontSize: 38, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'right', scaleX: 0.80, letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 540, y: 80, width: 260, height: 45, content: ' THE BEST', fontSize: 38, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'left', scaleX: 0.80, letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 760, y: 80, width: 250, height: 45, content: ' IN DATA.', fontSize: 38, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'left', scaleX: 0.80, letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // Dhaval hero drop-zone — left
      makeImage({ x: 0, y: 200, width: 540, height: 650, src: '/images/bootcamps/data-analytics/heroes/dhaval-da-superhero.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 55% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
      // Hemanand hero — right
      makeImage({ x: 540, y: 200, width: 540, height: 650, src: '/images/bootcamps/data-analytics/heroes/hemanand-da-superhero.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 45% 40%, black 35%, transparent 70%', glowColor: '#D7EF3F', zIndex: 4 }),
      // Centered name tag — Manrope
      makeText({ x: 0, y: 830, width: 1080, height: 24, content: 'Dhaval & Hemanand · Codebasics Founders', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 12 }),
      // CTA — Blue with borderRadius 16
      makeButton({ x: 390, y: 900, width: 300, height: 44, content: 'Explore Bootcamp →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
    ],
  },

  // ── DA-08: The AI Urgency ──
  {
    id: 'da-concept-08',
    filename: 'da-08-ai-ready.html',
    label: 'DA-08 — AI Urgency',
    shortLabel: 'DA-08 AI Ready',
    description: 'Dhaval hero drop-zone, AI urgency messaging',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: 'EVERY ANALYST WILL BE AI-ENABLED',
    createElements: () => [
      ...makeDACommon(),
      // Headlines — Saira Condensed 900
      makeText({ x: 0, y: 120, width: 1080, height: 55, content: 'EVERY ANALYST IN 2026', fontSize: 46, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 185, width: 1080, height: 55, content: 'WILL BE AI-ENABLED.', fontSize: 46, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // Lime on AI-ENABLED
      makeText({ x: 320, y: 185, width: 350, height: 55, content: 'AI-ENABLED.', fontSize: 46, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 11 }),
      makeText({ x: 0, y: 255, width: 1080, height: 40, content: 'WILL YOU BE ONE OF THEM?', fontSize: 28, fontWeight: 900, fontFamily: 'Saira Condensed', color: 'rgba(255,255,255,0.5)', textAlign: 'center', letterSpacing: 1, lineHeight: 0.92, zIndex: 10 }),
      // "2026 IS HERE" lime badge
      makeBadge({ x: 440, y: 330, width: 200, height: 36, content: '2026 IS HERE', bgColor: '#D7EF3F', textColor: '#181830', fontSize: 12, borderRadius: 8, zIndex: 12 }),
      // Tool chips — center
      makeBadge({ x: 120, y: 420, width: 110, height: 32, content: 'ChatGPT', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.6)', fontSize: 11, borderRadius: 6, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      makeBadge({ x: 250, y: 420, width: 100, height: 32, content: 'Copilot', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.6)', fontSize: 11, borderRadius: 6, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      makeBadge({ x: 370, y: 420, width: 120, height: 32, content: 'Python AI', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.6)', fontSize: 11, borderRadius: 6, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      makeBadge({ x: 510, y: 420, width: 150, height: 32, content: 'Power BI + AI', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.6)', fontSize: 11, borderRadius: 6, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      makeBadge({ x: 680, y: 420, width: 110, height: 32, content: 'AutoML', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.6)', fontSize: 11, borderRadius: 6, zIndex: 9, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }),
      // Blue radial glow center
      makeShape({ x: 340, y: 470, width: 400, height: 400, bgColor: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 70%)', borderRadius: 200, zIndex: 3 }),
      // CTA
      makeButton({ x: 430, y: 530, width: 220, height: 44, content: 'Get AI-Ready →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
      // Hero — both instructors
      makeImage({ x: 150, y: 600, width: 780, height: 400, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
    ],
  },

  // ── DA-09: The Job Support System ──
  {
    id: 'da-concept-09',
    filename: 'da-09-job-support.html',
    label: 'DA-09 — Job Support',
    shortLabel: 'DA-09 Job Support',
    description: '4 job support pillars with both heroes',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: 'WE HELP YOU GET HIRED',
    createElements: () => [
      ...makeDACommon(),
      // Headlines — Saira Condensed 900
      makeText({ x: 0, y: 120, width: 1080, height: 50, content: "WE DON'T JUST TEACH.", fontSize: 44, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 185, width: 1080, height: 50, content: 'WE HELP YOU GET HIRED.', fontSize: 44, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // Blue-to-lime gradient top border strip
      makeShape({ x: 80, y: 280, width: 920, height: 3, bgColor: 'linear-gradient(to right, #3B82F6, #D7EF3F)', borderRadius: 2, zIndex: 8 }),
      // Pillar 1 — Resume Builder
      makeShape({ x: 80, y: 300, width: 440, height: 120, bgColor: 'rgba(255,255,255,0.03)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 100, y: 325, width: 400, height: 24, content: '📄 Resume Builder', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 100, y: 355, width: 400, height: 18, content: 'AI-powered automated builder', fontSize: 12, fontWeight: 400, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, textTransform: 'none', zIndex: 7 }),
      // Pillar 2 — Mock Interviews
      makeShape({ x: 560, y: 300, width: 440, height: 120, bgColor: 'rgba(255,255,255,0.03)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 580, y: 325, width: 400, height: 24, content: '🎤 Mock Interviews', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 580, y: 355, width: 400, height: 18, content: 'With industry experts', fontSize: 12, fontWeight: 400, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, textTransform: 'none', zIndex: 7 }),
      // Pillar 3 — LinkedIn Optimizer
      makeShape({ x: 80, y: 440, width: 440, height: 120, bgColor: 'rgba(255,255,255,0.03)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 100, y: 465, width: 400, height: 24, content: '💼 LinkedIn Optimizer', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 100, y: 495, width: 400, height: 18, content: 'Profile + credibility building', fontSize: 12, fontWeight: 400, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, textTransform: 'none', zIndex: 7 }),
      // Pillar 4 — Job Leads
      makeShape({ x: 560, y: 440, width: 440, height: 120, bgColor: 'rgba(255,255,255,0.03)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 580, y: 465, width: 400, height: 24, content: '🎯 Job Leads', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 580, y: 495, width: 400, height: 18, content: 'Direct referrals to recruiters', fontSize: 12, fontWeight: 400, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, textTransform: 'none', zIndex: 7 }),
      // CTA — Blue with borderRadius 16
      makeButton({ x: 380, y: 680, width: 320, height: 44, content: 'Join 21K+ Learners →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
      // Hero — both instructors
      makeImage({ x: 150, y: 730, width: 780, height: 300, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
    ],
  },

  // ── DA-10: The Every-Career Template ──
  {
    id: 'da-concept-10',
    filename: 'da-10-careers.html',
    label: 'DA-10 — Every Career',
    shortLabel: 'DA-10 Careers',
    description: 'Career grid, stats row, both heroes',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: "NOT JUST FOR TECH PEOPLE",
    createElements: () => [
      ...makeDACommon(),
      // Headlines — Saira Condensed 900
      makeText({ x: 0, y: 100, width: 1080, height: 50, content: "DATA ANALYTICS ISN'T", fontSize: 44, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 160, width: 1080, height: 50, content: 'JUST FOR TECH PEOPLE.', fontSize: 44, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // 8 career cells — 4x2 grid; Marketing Analyst with lime highlight
      // Row 1
      makeShape({ x: 70, y: 260, width: 220, height: 60, bgColor: 'rgba(59,130,246,0.06)', borderRadius: 8, borderColor: 'rgba(59,130,246,0.12)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 70, y: 275, width: 220, height: 30, content: 'Data Analyst', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeShape({ x: 310, y: 260, width: 220, height: 60, bgColor: 'rgba(59,130,246,0.06)', borderRadius: 8, borderColor: 'rgba(59,130,246,0.12)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 310, y: 275, width: 220, height: 30, content: 'Finance Analyst', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // Marketing Analyst — lime highlight
      makeShape({ x: 550, y: 260, width: 220, height: 60, bgColor: 'rgba(215,239,63,0.1)', borderRadius: 8, borderColor: 'rgba(215,239,63,0.3)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 550, y: 275, width: 220, height: 30, content: 'Marketing Analyst', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#D7EF3F', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeShape({ x: 790, y: 260, width: 220, height: 60, bgColor: 'rgba(59,130,246,0.06)', borderRadius: 8, borderColor: 'rgba(59,130,246,0.12)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 790, y: 275, width: 220, height: 30, content: 'Healthcare', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // Row 2
      makeShape({ x: 70, y: 340, width: 220, height: 60, bgColor: 'rgba(59,130,246,0.06)', borderRadius: 8, borderColor: 'rgba(59,130,246,0.12)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 70, y: 355, width: 220, height: 30, content: 'Retail & E-comm', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeShape({ x: 310, y: 340, width: 220, height: 60, bgColor: 'rgba(59,130,246,0.06)', borderRadius: 8, borderColor: 'rgba(59,130,246,0.12)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 310, y: 355, width: 220, height: 30, content: 'Operations', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeShape({ x: 550, y: 340, width: 220, height: 60, bgColor: 'rgba(59,130,246,0.06)', borderRadius: 8, borderColor: 'rgba(59,130,246,0.12)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 550, y: 355, width: 220, height: 30, content: 'EdTech', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeShape({ x: 790, y: 340, width: 220, height: 60, bgColor: 'rgba(59,130,246,0.06)', borderRadius: 8, borderColor: 'rgba(59,130,246,0.12)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 790, y: 355, width: 220, height: 30, content: 'Banking', fontSize: 14, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // CTA — Blue with borderRadius 16
      makeButton({ x: 390, y: 580, width: 300, height: 44, content: 'Explore Bootcamp →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
      // Hero — both instructors
      makeImage({ x: 100, y: 600, width: 880, height: 380, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
    ],
  },

  // ── DA-11: Caterpillar / Butterfly ──
  {
    id: 'da-concept-11',
    filename: 'da-11-transformation.html',
    label: 'DA-11 — Caterpillar / Butterfly',
    shortLabel: 'DA-11 Transform',
    description: 'Split screen before/after transformation',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: 'EVERY EXPERT WAS ONCE A BEGINNER',
    createElements: () => [
      ...makeDACommon(),
      // Headline — Saira Condensed 900
      makeText({ x: 0, y: 100, width: 1080, height: 55, content: 'EVERY EXPERT WAS ONCE A', fontSize: 46, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 165, width: 1080, height: 55, content: 'BEGINNER.', fontSize: 46, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // Split screen — Left (grey/before)
      makeShape({ x: 60, y: 280, width: 440, height: 340, bgColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 60, y: 300, width: 440, height: 40, content: '🐛', fontSize: 32, fontWeight: 400, textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 80, y: 360, width: 400, height: 24, content: 'Stuck in Excel.', fontSize: 16, fontWeight: 600, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.5)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 80, y: 395, width: 400, height: 24, content: 'No career growth.', fontSize: 16, fontWeight: 600, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.5)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 80, y: 430, width: 400, height: 24, content: 'Undervalued.', fontSize: 16, fontWeight: 600, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.5)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, textTransform: 'none', zIndex: 7 }),
      // Blue arrow in center
      makeText({ x: 505, y: 420, width: 70, height: 40, content: '→', fontSize: 32, fontWeight: 900, color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 8 }),
      // Right (lime/after)
      makeShape({ x: 580, y: 280, width: 440, height: 340, bgColor: 'rgba(215,239,63,0.05)', borderRadius: 16, borderColor: 'rgba(215,239,63,0.15)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 580, y: 300, width: 440, height: 40, content: '🦋', fontSize: 32, fontWeight: 400, textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 600, y: 360, width: 400, height: 24, content: 'Data Analyst.', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#D7EF3F', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 600, y: 395, width: 400, height: 24, content: '₹8L+ package.', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#D7EF3F', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 600, y: 430, width: 400, height: 24, content: 'Hired in 90 days.', fontSize: 16, fontWeight: 700, fontFamily: 'Manrope', color: '#D7EF3F', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, textTransform: 'none', zIndex: 7 }),
      // Transformation subtext
      makeText({ x: 0, y: 660, width: 1080, height: 24, content: 'Your transformation starts with one decision.', fontSize: 15, fontWeight: 400, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.4)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, textTransform: 'none', zIndex: 10 }),
      // CTA
      makeButton({ x: 390, y: 720, width: 300, height: 44, content: 'Start Your Transformation →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
      // Hero — both instructors
      makeImage({ x: 150, y: 780, width: 780, height: 250, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
    ],
  },

  // ── DA-12: Salary Transformation ──
  {
    id: 'da-concept-12',
    filename: 'da-12-salary.html',
    label: 'DA-12 — Salary Transformation',
    shortLabel: 'DA-12 Salary',
    description: 'Before/after salary cards with arrow',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: 'WHAT ONE YEAR CAN DO',
    createElements: () => [
      ...makeDACommon(),
      // Headline — Saira Condensed 900
      makeText({ x: 0, y: 100, width: 1080, height: 55, content: 'THIS IS WHAT ONE YEAR CAN', fontSize: 44, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 165, width: 1080, height: 55, content: 'DO TO YOUR SALARY.', fontSize: 44, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // Before card (muted)
      makeShape({ x: 100, y: 290, width: 380, height: 250, bgColor: 'rgba(255,255,255,0.03)', borderRadius: 16, borderColor: 'rgba(255,255,255,0.06)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 100, y: 310, width: 380, height: 24, content: 'BEFORE', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.3)', textAlign: 'center', letterSpacing: 2, scaleX: 1, lineHeight: 1.2, zIndex: 7 }),
      makeText({ x: 100, y: 360, width: 380, height: 50, content: 'Support Executive', fontSize: 22, fontWeight: 700, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.5)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 100, y: 420, width: 380, height: 60, content: '₹3.2L', fontSize: 48, fontWeight: 900, fontFamily: 'Saira Condensed', color: 'rgba(255,255,255,0.3)', textAlign: 'center', scaleX: 1, letterSpacing: -1, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      // Arrow between cards
      makeText({ x: 490, y: 390, width: 100, height: 50, content: '→', fontSize: 40, fontWeight: 900, color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.0, textTransform: 'none', zIndex: 8 }),
      // After card (lime accent, top border)
      makeShape({ x: 600, y: 286, width: 380, height: 4, bgColor: '#D7EF3F', borderRadius: 2, zIndex: 8 }),
      makeShape({ x: 600, y: 290, width: 380, height: 250, bgColor: 'rgba(215,239,63,0.04)', borderRadius: 16, borderColor: 'rgba(215,239,63,0.15)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 600, y: 310, width: 380, height: 24, content: 'AFTER', fontSize: 12, fontWeight: 700, fontFamily: 'Manrope', color: '#D7EF3F', textAlign: 'center', letterSpacing: 2, scaleX: 1, lineHeight: 1.2, zIndex: 7 }),
      makeText({ x: 600, y: 360, width: 380, height: 50, content: 'Data Analyst', fontSize: 22, fontWeight: 700, fontFamily: 'Manrope', color: '#FFFFFF', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 600, y: 420, width: 380, height: 60, content: '₹9.5L', fontSize: 48, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', scaleX: 1, letterSpacing: -1, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      // CTA
      makeButton({ x: 390, y: 600, width: 300, height: 44, content: 'Transform Your Career →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
      // Hero — both instructors
      makeImage({ x: 150, y: 670, width: 780, height: 340, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
    ],
  },

  // ── DA-13: Stuck in Spreadsheets ──
  {
    id: 'da-concept-13',
    filename: 'da-13-spreadsheets.html',
    label: 'DA-13 — Stuck in Spreadsheets',
    shortLabel: 'DA-13 Spreadsheets',
    description: 'Pain box with solution, spreadsheets in 2026',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: 'STILL DROWNING IN SPREADSHEETS?',
    createElements: () => [
      ...makeDACommon(),
      // Headline — Saira Condensed 900
      makeText({ x: 0, y: 100, width: 1080, height: 55, content: 'STILL DROWNING IN SPREADSHEETS IN', fontSize: 42, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 165, width: 1080, height: 55, content: '2026?', fontSize: 52, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // Red-tinted pain box
      makeShape({ x: 100, y: 280, width: 880, height: 220, bgColor: 'rgba(239,68,68,0.04)', borderRadius: 16, borderColor: 'rgba(239,68,68,0.15)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 140, y: 310, width: 800, height: 24, content: '• Hours wasted formatting the same report every week', fontSize: 15, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.55)', scaleX: 1, letterSpacing: 0, lineHeight: 1.5, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 140, y: 345, width: 800, height: 24, content: '• No idea how to automate anything', fontSize: 15, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.55)', scaleX: 1, letterSpacing: 0, lineHeight: 1.5, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 140, y: 380, width: 800, height: 24, content: '• Watching juniors get promoted past you', fontSize: 15, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.55)', scaleX: 1, letterSpacing: 0, lineHeight: 1.5, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 140, y: 415, width: 800, height: 24, content: '• "Data-driven" is a buzzword you can\'t back up', fontSize: 15, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.55)', scaleX: 1, letterSpacing: 0, lineHeight: 1.5, textTransform: 'none', zIndex: 7 }),
      // Lime solution box
      makeShape({ x: 100, y: 530, width: 880, height: 120, bgColor: 'rgba(215,239,63,0.06)', borderRadius: 16, borderColor: 'rgba(215,239,63,0.2)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 140, y: 555, width: 800, height: 28, content: "There's a smarter way.", fontSize: 20, fontWeight: 800, fontFamily: 'Manrope', color: '#D7EF3F', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 140, y: 590, width: 800, height: 20, content: 'DA Bootcamp 5.0 changes all of this.', fontSize: 14, fontWeight: 500, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.5)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // CTA
      makeButton({ x: 390, y: 700, width: 300, height: 44, content: 'Escape the Spreadsheets →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
      // Hero — both instructors
      makeImage({ x: 150, y: 770, width: 780, height: 260, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
    ],
  },

  // ── DA-14: The Numbers Don't Lie ──
  {
    id: 'da-concept-14',
    filename: 'da-14-numbers.html',
    label: 'DA-14 — The Numbers Don\'t Lie',
    shortLabel: 'DA-14 Numbers',
    description: '2x2 big stat grid with social proof',
    group: 'da-standalone',
    bootcamp: 'data-analytics-5.0',
    thumbnailBg: '#181830',
    thumbnailAccent: '#3B82F6',
    thumbnailHeadline: "THE NUMBERS DON'T LIE",
    createElements: () => [
      ...makeDACommon(),
      // Headline — Saira Condensed 900
      makeText({ x: 0, y: 100, width: 1080, height: 55, content: "THE NUMBERS", fontSize: 48, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#FFFFFF', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      makeText({ x: 0, y: 165, width: 1080, height: 55, content: "DON'T LIE.", fontSize: 48, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', letterSpacing: -1, lineHeight: 0.92, zIndex: 10 }),
      // 2x2 stat grid
      // Stat 1 — 1M+ Students
      makeShape({ x: 100, y: 290, width: 420, height: 180, bgColor: 'rgba(59,130,246,0.04)', borderRadius: 16, borderColor: 'rgba(59,130,246,0.12)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 100, y: 320, width: 420, height: 60, content: '1M+', fontSize: 52, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: -1, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 100, y: 390, width: 420, height: 24, content: 'Students', fontSize: 16, fontWeight: 600, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.5)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // Stat 2 — 4,803 Reviews (lime highlight)
      makeShape({ x: 560, y: 290, width: 420, height: 180, bgColor: 'rgba(215,239,63,0.05)', borderRadius: 16, borderColor: 'rgba(215,239,63,0.2)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 560, y: 320, width: 420, height: 60, content: '4,803', fontSize: 52, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#D7EF3F', textAlign: 'center', scaleX: 1, letterSpacing: -1, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 560, y: 390, width: 420, height: 24, content: 'Reviews', fontSize: 16, fontWeight: 600, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.5)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // Stat 3 — 300+ Placements
      makeShape({ x: 100, y: 500, width: 420, height: 180, bgColor: 'rgba(59,130,246,0.04)', borderRadius: 16, borderColor: 'rgba(59,130,246,0.12)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 100, y: 530, width: 420, height: 60, content: '300+', fontSize: 52, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: -1, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 100, y: 600, width: 420, height: 24, content: 'Placements', fontSize: 16, fontWeight: 600, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.5)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // Stat 4 — 4.9★ Rating
      makeShape({ x: 560, y: 500, width: 420, height: 180, bgColor: 'rgba(59,130,246,0.04)', borderRadius: 16, borderColor: 'rgba(59,130,246,0.12)', borderWidth: 1, zIndex: 6 }),
      makeText({ x: 560, y: 530, width: 420, height: 60, content: '4.9★', fontSize: 52, fontWeight: 900, fontFamily: 'Saira Condensed', color: '#3B82F6', textAlign: 'center', scaleX: 1, letterSpacing: -1, lineHeight: 1.0, textTransform: 'none', zIndex: 7 }),
      makeText({ x: 560, y: 600, width: 420, height: 24, content: 'Rating', fontSize: 16, fontWeight: 600, fontFamily: 'Manrope', color: 'rgba(255,255,255,0.5)', textAlign: 'center', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, textTransform: 'none', zIndex: 7 }),
      // CTA
      makeButton({ x: 390, y: 740, width: 300, height: 44, content: 'Join the Numbers →', bgColor: '#3B82F6', textColor: '#FFFFFF', fontSize: 15, borderRadius: 16, zIndex: 20 }),
      // Hero — both instructors
      makeImage({ x: 150, y: 810, width: 780, height: 220, src: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png', maskType: 'radial', maskParams: 'ellipse 80% 85% at 50% 40%, black 35%, transparent 70%', glowColor: '#3B82F6', zIndex: 4 }),
    ],
  },
];

export function getStandaloneTemplates(): TemplateInfo[] {
  return TEMPLATES.filter(t => t.group === 'standalone');
}

export function getCarouselTemplates(): TemplateInfo[] {
  return TEMPLATES.filter(t => t.group === 'carousel');
}

export function getBannerTemplates(): TemplateInfo[] {
  return TEMPLATES.filter(t => t.group === 'banner');
}

export function getDAStandaloneTemplates(): TemplateInfo[] {
  return TEMPLATES.filter(t => t.group === 'da-standalone');
}

export function getTemplatesByBootcamp(bootcamp: string): TemplateInfo[] {
  return TEMPLATES.filter(t => t.bootcamp === bootcamp);
}
