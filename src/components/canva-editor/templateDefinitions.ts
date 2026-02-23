import { CanvasElement } from './types';

// Helper to create unique IDs
let _idCounter = 0;
function uid(): string {
  return `el_${Date.now()}_${++_idCounter}`;
}

// Common element factories
function makeText(opts: {
  x: number; y: number; width: number; height: number;
  content: string; fontSize: number; fontWeight?: number;
  color?: string; fontFamily?: string; textAlign?: 'left' | 'center' | 'right';
  textTransform?: 'none' | 'uppercase'; scaleX?: number;
  letterSpacing?: number; lineHeight?: number;
  zIndex?: number; opacity?: number;
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
      fontStyle: 'normal',
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
      fontSize: opts.fontSize ?? 15,
      fontWeight: 600,
      paddingX: 20, paddingY: 10,
    },
  };
}

// Shared elements that appear in most templates
function makeLogo(x = 40, y = 35, zIndex = 30): CanvasElement {
  return makeImage({ x, y, width: 120, height: 48, src: '/logos/codebasics-white.svg', zIndex, maskType: 'none', objectFit: 'contain' });
}

function makeSubscriberBadge(x = 700, y = 35, zIndex = 30): CanvasElement {
  return makeBadge({ x, y, width: 340, height: 38, content: '1.4M+ Subscribers \u00b7 4.9\u2605', bgColor: 'rgba(255,255,255,0.08)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 9999, zIndex });
}

function makeSWEngineerBadge(x = 200, y = 900, zIndex = 22): CanvasElement {
  return makeBadge({ x, y, width: 500, height: 38, content: '\u26a1 Built exclusively for Software Engineers (2+ yrs)', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.6)', fontSize: 14, borderRadius: 9999, zIndex });
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Template Definitions
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
  createElements: () => CanvasElement[];
}

export const TEMPLATES: TemplateInfo[] = [
  // ── Standalone Ads ──
  {
    id: 'concept-a',
    filename: 'concept-a.html',
    label: 'A \u2014 TODOs Don\'t Ship',
    shortLabel: 'TODOs Don\'t Ship',
    description: 'Dhaval hero, headline "YOUR TODOs DON\'T SHIP", code mockup',
    group: 'standalone',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#f85149',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 580, y: 100, width: 500, height: 750, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', glowColor: '#3b82f6', zIndex: 5 }),
      makeText({ x: 40, y: 200, width: 550, height: 200, content: 'YOUR TODOs\nDON\'T SHIP.', fontSize: 130, color: '#FFFFFF', zIndex: 10 }),
      // Code mockup area
      makeShape({ x: 40, y: 450, width: 480, height: 180, bgColor: 'rgba(255,255,255,0.04)', borderRadius: 12, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1, zIndex: 8 }),
      makeText({ x: 60, y: 470, width: 440, height: 140, content: '// TODO: implement auth\n// TODO: add caching\n// TODO: write tests\n\u2192 LIVE: production-ready code', fontSize: 16, fontWeight: 500, color: '#8b949e', fontFamily: 'monospace', textTransform: 'none', scaleX: 1, letterSpacing: 0, lineHeight: 1.6, zIndex: 9 }),
      makeSWEngineerBadge(180, 910),
      makeButton({ x: 40, y: 960, width: 380, height: 56, content: 'Start Building Live \u2192', bgColor: '#20C997', textColor: '#0D1117', zIndex: 20 }),
      makeStrip({ x: 0, y: 1020, width: 1080, height: 60, content: '\u2714 Live Sessions \u00b7 \u2714 8+ Projects \u00b7 \u2714 75 Days \u00b7 \u2714 500 Seats \u00b7 March 7', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.5)', fontSize: 14, zIndex: 25 }),
    ],
  },
  {
    id: 'concept-b',
    filename: 'concept-b.html',
    label: 'B \u2014 Skip the Basics',
    shortLabel: 'Skip the Basics',
    description: 'Dhaval hero, headline "WE SKIP THE BASICS."',
    group: 'standalone',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 580, y: 100, width: 500, height: 750, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', glowColor: '#3b82f6', zIndex: 5 }),
      makeText({ x: 40, y: 250, width: 600, height: 240, content: 'WE SKIP\nTHE BASICS.', fontSize: 140, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 520, width: 500, height: 40, content: 'This is not a beginner course.', fontSize: 22, fontWeight: 400, color: 'rgba(255,255,255,0.6)', textTransform: 'none', scaleX: 1, lineHeight: 1.4, zIndex: 11 }),
      makeSWEngineerBadge(180, 910),
      makeButton({ x: 40, y: 960, width: 420, height: 56, content: 'Join the March 7 Batch \u2192', bgColor: '#3b82f6', textColor: '#FFFFFF', zIndex: 20 }),
      makeStrip({ x: 0, y: 1020, width: 1080, height: 60, content: '\u2714 Live Sessions \u00b7 \u2714 8+ Projects \u00b7 \u2714 75 Days \u00b7 \u2714 500 Seats \u00b7 March 7', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.5)', fontSize: 14, zIndex: 25 }),
    ],
  },
  {
    id: 'concept-c',
    filename: 'concept-c.html',
    label: 'C \u2014 Three Pillars',
    shortLabel: 'Three Pillars',
    description: 'Trio image, pillar labels (BUILD/ORCHESTRATE/DISTRIBUTE)',
    group: 'standalone',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 0, y: 0, width: 1080, height: 540, src: '/images/bootcamps/ai-engineering/heroes/superhero-trio.png', maskType: 'linear', maskParams: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 65%, rgba(0,0,0,0) 100%)', zIndex: 3 }),
      // Pillar labels
      makeBadge({ x: 100, y: 540, width: 200, height: 40, content: 'BUILD', bgColor: 'rgba(59,130,246,0.15)', textColor: '#3b82f6', fontSize: 16, borderRadius: 8, borderColor: '#3b82f6', borderWidth: 1, zIndex: 15 }),
      makeBadge({ x: 430, y: 540, width: 240, height: 40, content: 'ORCHESTRATE', bgColor: 'rgba(215,239,63,0.15)', textColor: '#D7EF3F', fontSize: 16, borderRadius: 8, borderColor: '#D7EF3F', borderWidth: 1, zIndex: 15 }),
      makeBadge({ x: 780, y: 540, width: 220, height: 40, content: 'DISTRIBUTE', bgColor: 'rgba(32,201,151,0.15)', textColor: '#20C997', fontSize: 16, borderRadius: 8, borderColor: '#20C997', borderWidth: 1, zIndex: 15 }),
      // Red wave divider
      makeShape({ x: 0, y: 600, width: 1080, height: 4, bgColor: '#f85149', borderRadius: 0, zIndex: 14 }),
      makeText({ x: 40, y: 640, width: 1000, height: 180, content: 'MOST BOOTCAMPS TEACH\nYOU TO BUILD.\nWE TEACH ALL THREE.', fontSize: 72, color: '#FFFFFF', textAlign: 'center', zIndex: 10 }),
      makeSWEngineerBadge(180, 870),
      makeButton({ x: 300, y: 920, width: 420, height: 56, content: 'Start Building \u2192', bgColor: '#3b82f6', textColor: '#FFFFFF', zIndex: 20 }),
      makeStrip({ x: 0, y: 1020, width: 1080, height: 60, content: '\u2714 Live Sessions \u00b7 \u2714 8+ Projects \u00b7 \u2714 75 Days \u00b7 \u2714 500 Seats \u00b7 March 7', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.5)', fontSize: 14, zIndex: 25 }),
    ],
  },
  {
    id: 'concept-d',
    filename: 'concept-d.html',
    label: 'D \u2014 500 Seats',
    shortLabel: '500 Seats',
    description: '500 SEATS. THEN WE CLOSE. Founder quote, stats bar.',
    group: 'standalone',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#f85149',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 580, y: 100, width: 500, height: 750, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', glowColor: '#3b82f6', zIndex: 5 }),
      makeText({ x: 40, y: 200, width: 550, height: 120, content: '500 SEATS.', fontSize: 120, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 330, width: 550, height: 120, content: 'THEN WE CLOSE.', fontSize: 100, color: '#f85149', zIndex: 10 }),
      makeText({ x: 40, y: 480, width: 500, height: 80, content: '"We keep it small so every engineer gets direct access to instructors."', fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.6)', textTransform: 'none', scaleX: 1, lineHeight: 1.5, zIndex: 11 }),
      makeSWEngineerBadge(180, 870),
      makeButton({ x: 40, y: 920, width: 380, height: 56, content: 'Claim Your Seat \u2192', bgColor: '#3b82f6', textColor: '#FFFFFF', zIndex: 20 }),
      // Stats bar
      makeStrip({ x: 0, y: 1020, width: 1080, height: 60, content: '500 Seats  /  75 Days  /  8+ Projects  /  March 7', bgColor: 'rgba(59,130,246,0.1)', textColor: '#3b82f6', fontSize: 16, zIndex: 25 }),
    ],
  },
  {
    id: 'concept-h',
    filename: 'concept-h.html',
    label: 'H \u2014 500 Engineers One Room',
    shortLabel: '500 Engineers',
    description: '500 ENGINEERS. ONE ROOM. Quote, stats bar.',
    group: 'standalone',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 580, y: 100, width: 500, height: 750, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', glowColor: '#3b82f6', zIndex: 5 }),
      makeText({ x: 40, y: 200, width: 550, height: 120, content: '500 ENGINEERS.', fontSize: 110, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 330, width: 550, height: 120, content: 'ONE ROOM.', fontSize: 110, color: '#3b82f6', zIndex: 10 }),
      makeText({ x: 40, y: 480, width: 500, height: 80, content: '"The best engineers don\'t just learn alone. They build together."', fontSize: 18, fontWeight: 400, color: 'rgba(255,255,255,0.6)', textTransform: 'none', scaleX: 1, lineHeight: 1.5, zIndex: 11 }),
      makeSWEngineerBadge(180, 870),
      makeButton({ x: 40, y: 920, width: 420, height: 56, content: 'Join the Inner Circle \u2192', bgColor: '#3b82f6', textColor: '#FFFFFF', zIndex: 20 }),
      makeStrip({ x: 0, y: 1020, width: 1080, height: 60, content: '500 Seats  /  75 Days  /  8+ Projects  /  March 7', bgColor: 'rgba(59,130,246,0.1)', textColor: '#3b82f6', fontSize: 16, zIndex: 25 }),
    ],
  },
  {
    id: 'concept-h2',
    filename: 'concept-h2.html',
    label: 'H2 \u2014 Not a Lecture Hall',
    shortLabel: 'Not a Lecture Hall',
    description: 'NOT A LECTURE HALL. A LAB.',
    group: 'standalone',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 580, y: 100, width: 500, height: 750, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', glowColor: '#20C997', zIndex: 5 }),
      makeText({ x: 40, y: 200, width: 550, height: 120, content: 'NOT A\nLECTURE HALL.', fontSize: 110, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 380, width: 550, height: 100, content: 'A LAB.', fontSize: 130, color: '#20C997', zIndex: 10 }),
      makeText({ x: 40, y: 510, width: 500, height: 60, content: 'Build. Break. Debug. Ship. Repeat.', fontSize: 20, fontWeight: 400, color: 'rgba(255,255,255,0.6)', textTransform: 'none', scaleX: 1, lineHeight: 1.5, zIndex: 11 }),
      makeSWEngineerBadge(180, 870),
      makeButton({ x: 40, y: 920, width: 380, height: 56, content: 'Start Building \u2192', bgColor: '#3b82f6', textColor: '#FFFFFF', zIndex: 20 }),
      makeStrip({ x: 0, y: 1020, width: 1080, height: 60, content: '500 Seats  /  75 Days  /  8+ Projects  /  March 7', bgColor: 'rgba(59,130,246,0.1)', textColor: '#3b82f6', fontSize: 16, zIndex: 25 }),
    ],
  },
  {
    id: 'concept-i',
    filename: 'concept-i.html',
    label: 'I \u2014 Two Bootcamps',
    shortLabel: 'Two Bootcamps',
    description: 'TWO BOOTCAMPS. ONE PRICE. Side-by-side cards.',
    group: 'standalone',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeText({ x: 80, y: 120, width: 920, height: 100, content: 'TWO BOOTCAMPS.', fontSize: 100, color: '#FFFFFF', textAlign: 'center', zIndex: 10 }),
      makeText({ x: 80, y: 230, width: 920, height: 100, content: 'ONE PRICE.', fontSize: 100, color: '#20C997', textAlign: 'center', zIndex: 10 }),
      // Left card
      makeShape({ x: 60, y: 380, width: 460, height: 320, bgColor: 'rgba(59,130,246,0.08)', borderRadius: 16, borderColor: 'rgba(59,130,246,0.3)', borderWidth: 1, zIndex: 8 }),
      makeText({ x: 80, y: 400, width: 420, height: 40, content: 'AI ENGINEERING BOOTCAMP', fontSize: 20, fontWeight: 700, color: '#3b82f6', scaleX: 1, zIndex: 9 }),
      makeText({ x: 80, y: 460, width: 420, height: 60, content: '\u20b936,000', fontSize: 48, fontWeight: 900, color: '#FFFFFF', scaleX: 1, zIndex: 9 }),
      // Right card
      makeShape({ x: 560, y: 380, width: 460, height: 320, bgColor: 'rgba(32,201,151,0.08)', borderRadius: 16, borderColor: 'rgba(32,201,151,0.3)', borderWidth: 1, zIndex: 8 }),
      makeText({ x: 580, y: 400, width: 420, height: 40, content: 'GEN AI BOOTCAMP', fontSize: 20, fontWeight: 700, color: '#20C997', scaleX: 1, zIndex: 9 }),
      makeBadge({ x: 580, y: 460, width: 200, height: 44, content: 'INCLUDED FREE', bgColor: '#20C997', textColor: '#0D1117', fontSize: 18, borderRadius: 8, zIndex: 10 }),
      makeButton({ x: 260, y: 780, width: 560, height: 56, content: 'Get Both Bootcamps \u2192', bgColor: '#20C997', textColor: '#0D1117', zIndex: 20 }),
      makeSWEngineerBadge(180, 870),
    ],
  },
  {
    id: 'concept-j',
    filename: 'concept-j.html',
    label: 'J \u2014 75 Days Price Card',
    shortLabel: '75 Days',
    description: '75 DAYS TO BECOME AN AI ENGINEER. Feature checkmarks, price CTA.',
    group: 'standalone',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 580, y: 100, width: 500, height: 750, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', opacity: 0.4, glowColor: '#20C997', zIndex: 3 }),
      makeText({ x: 40, y: 180, width: 700, height: 100, content: '75 DAYS TO BECOME', fontSize: 80, color: '#FFFFFF', zIndex: 10 }),
      makeText({ x: 40, y: 280, width: 700, height: 100, content: 'AN AI ENGINEER.', fontSize: 80, color: '#20C997', zIndex: 10 }),
      // Feature checkmarks
      makeText({ x: 60, y: 420, width: 600, height: 30, content: '\u2713  8+ real-world projects from scratch', fontSize: 20, fontWeight: 500, color: 'rgba(255,255,255,0.8)', textTransform: 'none', scaleX: 1, lineHeight: 1.4, zIndex: 11 }),
      makeText({ x: 60, y: 460, width: 600, height: 30, content: '\u2713  LLMs, RAG, Agents, Orchestration, Deployment', fontSize: 20, fontWeight: 500, color: 'rgba(255,255,255,0.8)', textTransform: 'none', scaleX: 1, lineHeight: 1.4, zIndex: 11 }),
      makeText({ x: 60, y: 500, width: 600, height: 30, content: '\u2713  24 live sessions / year with instructors', fontSize: 20, fontWeight: 500, color: 'rgba(255,255,255,0.8)', textTransform: 'none', scaleX: 1, lineHeight: 1.4, zIndex: 11 }),
      makeText({ x: 60, y: 540, width: 600, height: 30, content: '\u2713  Gen AI Bootcamp included FREE', fontSize: 20, fontWeight: 500, color: 'rgba(255,255,255,0.8)', textTransform: 'none', scaleX: 1, lineHeight: 1.4, zIndex: 11 }),
      // Bonus badge
      makeBadge({ x: 60, y: 600, width: 360, height: 40, content: '\ud83c\udf81 Gen AI Bootcamp \u2014 INCLUDED FREE', bgColor: 'rgba(32,201,151,0.15)', textColor: '#20C997', fontSize: 14, borderRadius: 8, borderColor: '#20C997', borderWidth: 1, zIndex: 15 }),
      makeButton({ x: 40, y: 720, width: 440, height: 60, content: 'Enroll Now \u2014 \u20b936,000 \u2192', bgColor: '#20C997', textColor: '#0D1117', fontSize: 24, zIndex: 20 }),
      makeText({ x: 40, y: 800, width: 500, height: 30, content: '100% refund within 14 days \u2014 no questions asked.', fontSize: 14, fontWeight: 400, color: 'rgba(255,255,255,0.4)', textTransform: 'none', scaleX: 1, lineHeight: 1.4, zIndex: 11 }),
      makeSWEngineerBadge(180, 870),
    ],
  },

  // ── Carousel Ads ──
  {
    id: 'concept-e0',
    filename: 'concept-e0-cover.html',
    label: 'E0 \u2014 Carousel Cover',
    shortLabel: 'Carousel Cover',
    description: 'Trio image, "AI ENGINEERING BOOTCAMP 1.0", pillar pills, swipe hint.',
    group: 'carousel',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 0, y: 0, width: 1080, height: 600, src: '/images/bootcamps/ai-engineering/heroes/superhero-trio.png', maskType: 'radial', glowColor: '#3b82f6', zIndex: 3 }),
      makeText({ x: 80, y: 500, width: 920, height: 120, content: 'AI ENGINEERING\nBOOTCAMP 1.0', fontSize: 90, color: '#FFFFFF', textAlign: 'center', zIndex: 10 }),
      makeText({ x: 80, y: 640, width: 920, height: 40, content: 'Three pillars. One transformation.', fontSize: 22, fontWeight: 400, color: 'rgba(255,255,255,0.6)', textAlign: 'center', textTransform: 'none', scaleX: 1, lineHeight: 1.4, zIndex: 11 }),
      // Pillar pills
      makeBadge({ x: 180, y: 720, width: 160, height: 36, content: 'BUILD', bgColor: 'rgba(59,130,246,0.15)', textColor: '#3b82f6', fontSize: 14, borderRadius: 8, borderColor: '#3b82f6', borderWidth: 1, zIndex: 15 }),
      makeBadge({ x: 410, y: 720, width: 220, height: 36, content: 'ORCHESTRATE', bgColor: 'rgba(215,239,63,0.15)', textColor: '#D7EF3F', fontSize: 14, borderRadius: 8, borderColor: '#D7EF3F', borderWidth: 1, zIndex: 15 }),
      makeBadge({ x: 700, y: 720, width: 200, height: 36, content: 'DISTRIBUTE', bgColor: 'rgba(32,201,151,0.15)', textColor: '#20C997', fontSize: 14, borderRadius: 8, borderColor: '#20C997', borderWidth: 1, zIndex: 15 }),
      makeButton({ x: 300, y: 820, width: 420, height: 56, content: 'Start Building \u2192', bgColor: '#3b82f6', textColor: '#FFFFFF', zIndex: 20 }),
      makeText({ x: 400, y: 920, width: 280, height: 30, content: 'Swipe \u2192', fontSize: 18, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textAlign: 'center', textTransform: 'none', scaleX: 1, zIndex: 11 }),
      makeStrip({ x: 0, y: 1020, width: 1080, height: 60, content: '\u2714 Live Sessions \u00b7 \u2714 8+ Projects \u00b7 \u2714 75 Days \u00b7 \u2714 500 Seats', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.5)', fontSize: 14, zIndex: 25 }),
    ],
  },
  {
    id: 'concept-e',
    filename: 'concept-e.html',
    label: 'E \u2014 Build',
    shortLabel: 'Build',
    description: 'Dhaval hero, MODULES 1\u20138, headline "BUILD.", topic tags.',
    group: 'carousel',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#3b82f6',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 580, y: 50, width: 500, height: 800, src: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png', maskType: 'radial', glowColor: '#3b82f6', zIndex: 5 }),
      makeText({ x: 40, y: 120, width: 400, height: 30, content: 'DHAVAL PATEL', fontSize: 22, fontWeight: 700, color: '#3b82f6', scaleX: 1, zIndex: 11 }),
      makeBadge({ x: 40, y: 170, width: 180, height: 32, content: 'MODULES 1\u20138', bgColor: 'rgba(59,130,246,0.15)', textColor: '#3b82f6', fontSize: 14, borderRadius: 8, borderColor: '#3b82f6', borderWidth: 1, zIndex: 15 }),
      makeText({ x: 40, y: 240, width: 500, height: 200, content: 'BUILD.', fontSize: 180, color: '#3b82f6', zIndex: 10 }),
      // Topic tags
      makeBadge({ x: 40, y: 500, width: 100, height: 32, content: 'LLMs', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeBadge({ x: 160, y: 500, width: 90, height: 32, content: 'RAG', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeBadge({ x: 270, y: 500, width: 120, height: 32, content: 'Agents', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeBadge({ x: 40, y: 545, width: 160, height: 32, content: 'Fine-tuning', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeBadge({ x: 220, y: 545, width: 180, height: 32, content: 'Evaluation', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeButton({ x: 40, y: 660, width: 380, height: 56, content: 'Start Building \u2192', bgColor: '#3b82f6', textColor: '#FFFFFF', zIndex: 20 }),
      // Carousel dots
      makeText({ x: 380, y: 980, width: 320, height: 20, content: '\u25cb \u25cf \u25cb \u25cb', fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.4)', textAlign: 'center', textTransform: 'none', scaleX: 1, zIndex: 30 }),
      makeStrip({ x: 0, y: 1020, width: 1080, height: 60, content: '\u2714 Live Sessions \u00b7 \u2714 8+ Projects \u00b7 \u2714 75 Days \u00b7 \u2714 500 Seats', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.5)', fontSize: 14, zIndex: 25 }),
    ],
  },
  {
    id: 'concept-f',
    filename: 'concept-f.html',
    label: 'F \u2014 Orchestrate',
    shortLabel: 'Orchestrate',
    description: 'Hemanand hero, MODULES 9\u201310, headline "ORCHESTRATE."',
    group: 'carousel',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#D7EF3F',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 580, y: 50, width: 500, height: 800, src: '/images/bootcamps/ai-engineering/heroes/hemanand-superhero.png', maskType: 'radial', glowColor: '#D7EF3F', zIndex: 5 }),
      makeText({ x: 40, y: 120, width: 400, height: 30, content: 'HEMANAND VADIVEL', fontSize: 22, fontWeight: 700, color: '#D7EF3F', scaleX: 1, zIndex: 11 }),
      makeBadge({ x: 40, y: 170, width: 200, height: 32, content: 'MODULES 9\u201310', bgColor: 'rgba(215,239,63,0.15)', textColor: '#D7EF3F', fontSize: 14, borderRadius: 8, borderColor: '#D7EF3F', borderWidth: 1, zIndex: 15 }),
      makeText({ x: 20, y: 240, width: 540, height: 200, content: 'ORCHESTRATE.', fontSize: 130, color: '#D7EF3F', zIndex: 10 }),
      // Topic tags
      makeBadge({ x: 40, y: 500, width: 180, height: 32, content: 'Kubernetes', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeBadge({ x: 240, y: 500, width: 140, height: 32, content: 'Docker', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeBadge({ x: 40, y: 545, width: 200, height: 32, content: 'CI/CD Pipelines', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeBadge({ x: 260, y: 545, width: 180, height: 32, content: 'Monitoring', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeButton({ x: 40, y: 660, width: 380, height: 56, content: 'Start Building \u2192', bgColor: '#D7EF3F', textColor: '#0D1117', zIndex: 20 }),
      // Carousel dots
      makeText({ x: 380, y: 980, width: 320, height: 20, content: '\u25cb \u25cb \u25cf \u25cb', fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.4)', textAlign: 'center', textTransform: 'none', scaleX: 1, zIndex: 30 }),
      makeStrip({ x: 0, y: 1020, width: 1080, height: 60, content: '\u2714 Live Sessions \u00b7 \u2714 8+ Projects \u00b7 \u2714 75 Days \u00b7 \u2714 500 Seats', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.5)', fontSize: 14, zIndex: 25 }),
    ],
  },
  {
    id: 'concept-g',
    filename: 'concept-g.html',
    label: 'G \u2014 Distribute',
    shortLabel: 'Distribute',
    description: 'Siddhant hero, MODULES 11\u201312, headline "DISTRIBUTE."',
    group: 'carousel',
    thumbnailBg: '#0D1117',
    thumbnailAccent: '#20C997',
    createElements: () => [
      makeLogo(),
      makeSubscriberBadge(),
      makeImage({ x: 580, y: 50, width: 500, height: 800, src: '/images/bootcamps/ai-engineering/heroes/siddhant-superhero.png', maskType: 'radial', glowColor: '#20C997', zIndex: 5 }),
      makeText({ x: 40, y: 120, width: 400, height: 30, content: 'SIDDHANT MAHESHWARI', fontSize: 22, fontWeight: 700, color: '#20C997', scaleX: 1, zIndex: 11 }),
      makeBadge({ x: 40, y: 170, width: 210, height: 32, content: 'MODULES 11\u201312', bgColor: 'rgba(32,201,151,0.15)', textColor: '#20C997', fontSize: 14, borderRadius: 8, borderColor: '#20C997', borderWidth: 1, zIndex: 15 }),
      makeText({ x: 20, y: 240, width: 540, height: 200, content: 'DISTRIBUTE.', fontSize: 140, color: '#20C997', zIndex: 10 }),
      // Topic tags
      makeBadge({ x: 40, y: 500, width: 180, height: 32, content: 'Deployment', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeBadge({ x: 240, y: 500, width: 140, height: 32, content: 'Scaling', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeBadge({ x: 40, y: 545, width: 160, height: 32, content: 'Edge AI', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeBadge({ x: 220, y: 545, width: 200, height: 32, content: 'Production MLOps', bgColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.7)', fontSize: 14, borderRadius: 8, zIndex: 15 }),
      makeButton({ x: 40, y: 660, width: 380, height: 56, content: 'Start Building \u2192', bgColor: '#20C997', textColor: '#0D1117', zIndex: 20 }),
      // Carousel dots
      makeText({ x: 380, y: 980, width: 320, height: 20, content: '\u25cb \u25cb \u25cb \u25cf', fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,0.4)', textAlign: 'center', textTransform: 'none', scaleX: 1, zIndex: 30 }),
      makeStrip({ x: 0, y: 1020, width: 1080, height: 60, content: '\u2714 Live Sessions \u00b7 \u2714 8+ Projects \u00b7 \u2714 75 Days \u00b7 \u2714 500 Seats', bgColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.5)', fontSize: 14, zIndex: 25 }),
    ],
  },
];

// Helper function used in template definitions
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

export function getStandaloneTemplates(): TemplateInfo[] {
  return TEMPLATES.filter(t => t.group === 'standalone');
}

export function getCarouselTemplates(): TemplateInfo[] {
  return TEMPLATES.filter(t => t.group === 'carousel');
}
