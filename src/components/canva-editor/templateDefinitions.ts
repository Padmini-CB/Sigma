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
      maskType: opts.maskType ?? 'radial',
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Template Definitions — Matching reference PNGs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export interface TemplateInfo {
  id: string;
  filename: string;
  label: string;
  shortLabel: string;
  description: string;
  group: 'standalone' | 'carousel';
  thumbnailBg: string;
  thumbnailAccent: string;
  thumbnailHeadline: string;
  thumbnailImage?: string;
  htmlPath?: string;
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
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    thumbnailHeadline: "YOUR TODOs DON'T SHIP",
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero — right side, seamless mask, blue glow
      makeImage({ x: 460, y: 40, width: 620, height: 780, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', maskParams: 'ellipse 70% 65% at center 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%', glowColor: '#3b82f6', zIndex: 5 }),
      // Name + title near hero
      makeText({ x: 580, y: 520, width: 400, height: 30, content: 'Dhaval Patel', fontSize: 20, fontWeight: 700, color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 12 }),
      makeText({ x: 580, y: 555, width: 400, height: 24, content: 'Founder, Codebasics · Ex-NVIDIA', fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.5)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 12 }),
      // Headline
      makeText({ x: 40, y: 300, width: 600, height: 130, content: 'YOUR TODOS', fontSize: 110, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 420, width: 600, height: 130, content: 'DON\'T SHIP.', fontSize: 110, color: '#20C997', zIndex: 10 }),
      // Code mockup card
      makeShape({ x: 40, y: 580, width: 460, height: 180, bgColor: 'rgba(255,255,255,0.04)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, zIndex: 8 }),
      makeText({ x: 52, y: 590, width: 440, height: 20, content: 'my_learning.py', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.4)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.4, zIndex: 9 }),
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
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: 'WE SKIP THE BASICS',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero
      makeImage({ x: 460, y: 40, width: 620, height: 780, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', maskParams: 'ellipse 70% 65% at center 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%', glowColor: '#3b82f6', zIndex: 5 }),
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
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    thumbnailHeadline: 'BUILD. ORCHESTRATE. DISTRIBUTE.',
    createElements: () => [
      // Trio image — top ~50%, linear mask
      makeImage({ x: 0, y: 0, width: 1080, height: 560, src: '/images/bootcamps/ai-engineering/heroes/superhero-trio.png', maskType: 'linear', maskParams: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 5%, rgba(0,0,0,1) 15%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)', zIndex: 3 }),
      makeLogo(36, 32, 30),
      makeSubscriberBadge(),
      // Pillar labels overlaid near bottom of trio
      makeText({ x: 80, y: 470, width: 240, height: 36, content: 'BUILD', fontSize: 22, fontWeight: 700, color: '#3b82f6', scaleX: 1, letterSpacing: 1, lineHeight: 1, zIndex: 15 }),
      makeText({ x: 80, y: 500, width: 300, height: 24, content: 'Dhaval · Ex-NVIDIA', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 15 }),
      makeText({ x: 410, y: 470, width: 280, height: 36, content: 'ORCHESTRATE', fontSize: 22, fontWeight: 700, color: '#D7EF3F', scaleX: 1, letterSpacing: 1, lineHeight: 1, textAlign: 'center', zIndex: 15 }),
      makeText({ x: 410, y: 500, width: 280, height: 24, content: 'Hemanand · Ex-Edgewell', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, textAlign: 'center', zIndex: 15 }),
      makeText({ x: 770, y: 470, width: 240, height: 36, content: 'DISTRIBUTE', fontSize: 22, fontWeight: 700, color: '#20C997', scaleX: 1, letterSpacing: 1, lineHeight: 1, textAlign: 'right', zIndex: 15 }),
      makeText({ x: 770, y: 500, width: 240, height: 24, content: 'Siddhant · AI Engineer', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.5)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, textAlign: 'right', zIndex: 15 }),
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
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: '500 SEATS. THEN WE CLOSE.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero
      makeImage({ x: 460, y: 40, width: 620, height: 780, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', maskParams: 'ellipse 70% 65% at center 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%', glowColor: '#3b82f6', zIndex: 5 }),
      // Headline
      makeText({ x: 40, y: 280, width: 600, height: 130, content: '500 SEATS.', fontSize: 120, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 400, width: 700, height: 130, content: 'THEN WE CLOSE.', fontSize: 120, color: '#3b82f6', zIndex: 10 }),
      // Quote
      makeText({ x: 40, y: 560, width: 500, height: 40, content: '"We intentionally keep the cohort small."', fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.5)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.5, fontStyle: 'italic', zIndex: 11 }),
      // Info line
      makeText({ x: 40, y: 610, width: 600, height: 24, content: 'AI Engineering Bootcamp · Built for Software Engineers · March 7', fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.45)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 11 }),
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
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: 'BUILD.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Module badge
      makeBadge({ x: 860, y: 90, width: 170, height: 36, content: 'MODULE 1-8', bgColor: 'rgba(32,201,151,0.12)', textColor: '#20C997', fontSize: 14, borderRadius: 9999, borderColor: 'rgba(32,201,151,0.3)', borderWidth: 1, zIndex: 30 }),
      // Dhaval hero — centered, upper 55%
      makeImage({ x: 190, y: 60, width: 700, height: 560, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', maskParams: 'ellipse 70% 65% at center 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%', glowColor: '#3b82f6', zIndex: 5 }),
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
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#D7EF3F',
    thumbnailHeadline: 'ORCHESTRATE.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Module badge
      makeBadge({ x: 840, y: 90, width: 190, height: 36, content: 'MODULES 9-10', bgColor: 'rgba(32,201,151,0.12)', textColor: '#20C997', fontSize: 14, borderRadius: 9999, borderColor: 'rgba(32,201,151,0.3)', borderWidth: 1, zIndex: 30 }),
      // Hemanand hero — centered, gold glow
      makeImage({ x: 190, y: 60, width: 700, height: 560, src: '/images/bootcamps/ai-engineering/heroes/hemanand-superhero.png', maskType: 'radial', maskParams: 'ellipse 70% 65% at center 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%', glowColor: '#D7EF3F', zIndex: 5 }),
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
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    thumbnailHeadline: 'DISTRIBUTE.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Module badge
      makeBadge({ x: 830, y: 90, width: 200, height: 36, content: 'MODULES 11-12', bgColor: 'rgba(32,201,151,0.12)', textColor: '#20C997', fontSize: 14, borderRadius: 9999, borderColor: 'rgba(32,201,151,0.3)', borderWidth: 1, zIndex: 30 }),
      // Siddhant hero — green glow
      makeImage({ x: 190, y: 60, width: 700, height: 560, src: '/images/bootcamps/ai-engineering/heroes/siddhant-superhero.png', maskType: 'radial', maskParams: 'ellipse 70% 65% at center 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%', glowColor: '#20C997', zIndex: 5 }),
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
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: '500 ENGINEERS. ONE ROOM.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero
      makeImage({ x: 460, y: 40, width: 620, height: 780, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', maskParams: 'ellipse 70% 65% at center 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%', glowColor: '#3b82f6', zIndex: 5 }),
      // Quote above headline
      makeText({ x: 40, y: 260, width: 500, height: 40, content: '"We intentionally keep the cohort small."', fontSize: 17, fontWeight: 400, color: 'rgba(255,255,255,0.5)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.5, fontStyle: 'italic', zIndex: 11 }),
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
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    thumbnailHeadline: 'TWO BOOTCAMPS. ONE PRICE.',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero — right side
      makeImage({ x: 560, y: 40, width: 520, height: 600, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', maskParams: 'ellipse 70% 65% at center 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%', glowColor: '#3b82f6', zIndex: 4 }),
      // Left card — "YOU ENROLL IN"
      makeShape({ x: 50, y: 130, width: 470, height: 280, bgColor: 'rgba(32,201,151,0.06)', borderRadius: 16, borderColor: 'rgba(32,201,151,0.25)', borderWidth: 1, zIndex: 8 }),
      makeText({ x: 70, y: 145, width: 200, height: 20, content: 'YOU ENROLL IN', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', scaleX: 1, letterSpacing: 2, lineHeight: 1.2, zIndex: 9 }),
      makeText({ x: 70, y: 175, width: 420, height: 32, content: 'AI Engineering Bootcamp 1.0', fontSize: 22, fontWeight: 700, color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 9 }),
      makeText({ x: 70, y: 218, width: 420, height: 24, content: '75 days · Live cohorts · 8+ projects', fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.55)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 9 }),
      makeText({ x: 70, y: 260, width: 200, height: 44, content: '₹36,000', fontSize: 36, fontWeight: 900, color: '#20C997', scaleX: 1, lineHeight: 1, zIndex: 9 }),
      // Right card — "YOU ALSO GET"
      makeShape({ x: 560, y: 130, width: 470, height: 280, bgColor: 'rgba(32,201,151,0.06)', borderRadius: 16, borderColor: 'rgba(32,201,151,0.25)', borderWidth: 1, zIndex: 8 }),
      makeText({ x: 580, y: 145, width: 200, height: 20, content: 'YOU ALSO GET', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)', scaleX: 1, letterSpacing: 2, lineHeight: 1.2, zIndex: 9 }),
      makeText({ x: 580, y: 175, width: 420, height: 32, content: 'Gen AI & Data Science Bootcamp 3.0', fontSize: 20, fontWeight: 700, color: '#FFFFFF', scaleX: 1, letterSpacing: 0, lineHeight: 1.2, zIndex: 9 }),
      makeText({ x: 580, y: 218, width: 420, height: 24, content: 'Job assistance · Resume · Interviews', fontSize: 15, fontWeight: 400, color: 'rgba(255,255,255,0.55)', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.3, zIndex: 9 }),
      makeText({ x: 580, y: 260, width: 200, height: 30, content: 'Worth ₹24,500', fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'none', scaleX: 1, lineHeight: 1, zIndex: 9 }),
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
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    thumbnailHeadline: '₹36,000 — 75 DAYS',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      // Dhaval hero — right side, faded
      makeImage({ x: 500, y: 100, width: 580, height: 700, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', maskParams: 'ellipse 70% 65% at center 40%, rgba(0,0,0,1) 30%, rgba(0,0,0,0) 100%', opacity: 0.5, glowColor: '#3b82f6', zIndex: 3 }),
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
];

export function getStandaloneTemplates(): TemplateInfo[] {
  return TEMPLATES.filter(t => t.group === 'standalone');
}

export function getCarouselTemplates(): TemplateInfo[] {
  return TEMPLATES.filter(t => t.group === 'carousel');
}
