import { AssetSection, CanvasElement } from './types';

let _assetId = 0;
function aid(): string {
  return `asset_${++_assetId}`;
}

export const ASSET_SECTIONS: AssetSection[] = [
  {
    id: 'ai-engineering',
    label: 'AI Engineering Bootcamp',
    expanded: true,
    subsections: [
      {
        id: 'heroes',
        label: 'Heroes',
        items: [
          {
            id: aid(), type: 'hero', label: 'Dhaval',
            thumbnail: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png',
            element: {
              type: 'image', width: 500, height: 700, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '/images/bootcamps/ai-engineering/heroes/dhaval-superhero.png',
              glowColor: '#3b82f6',
              imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'radial', maskParams: 'ellipse 60% 55% at center 35%, black 20%, transparent 90%' },
            },
          },
          {
            id: aid(), type: 'hero', label: 'Hemanand',
            thumbnail: '/images/bootcamps/ai-engineering/heroes/hemanand-superhero.png',
            element: {
              type: 'image', width: 500, height: 700, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '/images/bootcamps/ai-engineering/heroes/hemanand-superhero.png',
              glowColor: '#D7EF3F',
              imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'radial' },
            },
          },
          {
            id: aid(), type: 'hero', label: 'Siddhant',
            thumbnail: '/images/bootcamps/ai-engineering/heroes/siddhant-superhero.png',
            element: {
              type: 'image', width: 500, height: 700, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '/images/bootcamps/ai-engineering/heroes/siddhant-superhero.png',
              glowColor: '#20C997',
              imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'radial' },
            },
          },
          {
            id: aid(), type: 'hero', label: 'Trio',
            thumbnail: '/images/bootcamps/ai-engineering/heroes/superhero-trio.png',
            element: {
              type: 'image', width: 800, height: 540, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '/images/bootcamps/ai-engineering/heroes/superhero-trio.png',
              glowColor: '#3b82f6',
              imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'radial' },
            },
          },
        ],
      },
      {
        id: 'buttons',
        label: 'Buttons',
        items: [
          {
            id: aid(), type: 'button', label: 'Primary Blue',
            element: {
              type: 'button', width: 280, height: 52, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'Enroll Now \u2192',
              buttonStyle: { backgroundColor: '#3B82F6', textColor: '#FFFFFF', fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, borderRadius: 8, paddingX: 36, paddingY: 14 },
            },
          },
          {
            id: aid(), type: 'button', label: 'Green CTA',
            element: {
              type: 'button', width: 300, height: 52, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'Start Building \u2192',
              buttonStyle: { backgroundColor: '#20C997', textColor: '#0D1117', fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, borderRadius: 8, paddingX: 36, paddingY: 14 },
            },
          },
          {
            id: aid(), type: 'button', label: 'Yellow CTA',
            element: {
              type: 'button', width: 260, height: 52, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'Level Up \u2192',
              buttonStyle: { backgroundColor: '#b8c820', textColor: '#0D1117', fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, borderRadius: 8, paddingX: 36, paddingY: 14 },
            },
          },
          {
            id: aid(), type: 'button', label: 'Outline Blue',
            element: {
              type: 'button', width: 280, height: 52, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'Learn More \u2192',
              buttonStyle: { backgroundColor: 'transparent', textColor: '#3B82F6', fontFamily: 'Poppins', fontSize: 22, fontWeight: 700, borderRadius: 8, paddingX: 36, paddingY: 14, borderColor: '#3B82F6', borderWidth: 2 },
            },
          },
        ],
      },
      {
        id: 'title-cards',
        label: 'Title Cards',
        items: [
          {
            id: aid(), type: 'html-component', label: 'Bootcamp Title Card',
            htmlSnippet: '<div class="sigma-element" data-sigma data-type="title-card" style="position:absolute;z-index:100;font-family:Poppins,sans-serif;"><div style="font-size:64px;font-weight:900;color:#FFFFFF;text-transform:uppercase;letter-spacing:-1px;line-height:0.95;transform:scaleX(0.76);transform-origin:left;">AI ENGINEERING<br>BOOTCAMP <span style="color:#3b82f6;font-size:50px;font-weight:900;">1.0</span></div><div style="font-size:20px;font-weight:400;color:rgba(255,255,255,0.55);font-style:italic;margin-top:12px;">Built Exclusively for</div><div style="font-size:72px;font-weight:900;color:#20C997;text-transform:uppercase;letter-spacing:-1px;line-height:0.92;transform:scaleX(0.76);transform-origin:left;margin-top:8px;">SOFTWARE<br>ENGINEERS</div></div>',
            element: {
              type: 'text', width: 600, height: 350, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'AI ENGINEERING\nBOOTCAMP 1.0\nSOFTWARE ENGINEERS',
              textStyle: { fontFamily: 'Poppins', fontSize: 64, fontWeight: 900, fontStyle: 'normal', color: '#ffffff', textAlign: 'left', letterSpacing: -1, lineHeight: 0.95, textTransform: 'uppercase', scaleX: 0.76 },
            },
          },
        ],
      },
      {
        id: 'badges',
        label: 'Badges',
        items: [
          {
            id: aid(), type: 'html-component', label: 'Bootcamp Badge',
            htmlSnippet: '<div class="bootcamp-badge" data-sigma style="display:inline-flex;flex-direction:column;align-items:center;gap:6px;position:absolute;z-index:100;"><div style="display:inline-flex;align-items:center;gap:10px;padding:10px 22px;background:linear-gradient(135deg,rgba(59,130,246,0.15),rgba(32,201,151,0.1));border:1.5px solid rgba(59,130,246,0.4);border-radius:50px;"><div style="width:8px;height:8px;border-radius:50%;background:#20C997;box-shadow:0 0 8px rgba(32,201,151,0.6);"></div><span style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.95);letter-spacing:0.5px;text-transform:uppercase;font-family:Poppins,sans-serif;">AI Engineering Bootcamp <span style="color:#3b82f6;font-weight:700;">1.0</span></span></div><span style="font-size:11px;font-weight:500;color:rgba(255,255,255,0.45);letter-spacing:1.5px;text-transform:uppercase;font-family:Poppins,sans-serif;">Designed for Software Engineers</span></div>',
            element: {
              type: 'badge', width: 360, height: 60, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'AI Engineering Bootcamp 1.0',
              badgeStyle: { backgroundColor: 'rgba(59,130,246,0.15)', textColor: 'rgba(255,255,255,0.95)', fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, borderRadius: 50, paddingX: 22, paddingY: 10, borderColor: 'rgba(59,130,246,0.4)', borderWidth: 1.5 },
            },
          },
          {
            id: aid(), type: 'badge', label: 'SW Engineer',
            element: {
              type: 'badge', width: 480, height: 38, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '\u26a1 Built exclusively for Software Engineers (2+ yrs)',
              badgeStyle: { backgroundColor: 'rgba(255,255,255,0.06)', textColor: 'rgba(255,255,255,0.6)', fontFamily: 'Poppins', fontSize: 14, fontWeight: 500, borderRadius: 9999, paddingX: 16, paddingY: 8 },
            },
          },
          {
            id: aid(), type: 'badge', label: 'Subscribers',
            element: {
              type: 'badge', width: 340, height: 38, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '1.4M+ Subscribers \u00b7 4.9\u2605',
              badgeStyle: { backgroundColor: 'rgba(255,255,255,0.08)', textColor: 'rgba(255,255,255,0.7)', fontFamily: 'Poppins', fontSize: 14, fontWeight: 500, borderRadius: 9999, paddingX: 16, paddingY: 8 },
            },
          },
          {
            id: aid(), type: 'badge', label: 'Module Pill (Blue)',
            element: {
              type: 'badge', width: 180, height: 32, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'MODULES 1\u20138',
              badgeStyle: { backgroundColor: 'rgba(59,130,246,0.15)', textColor: '#3b82f6', fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, borderRadius: 8, paddingX: 16, paddingY: 8, borderColor: '#3b82f6', borderWidth: 1 },
            },
          },
          {
            id: aid(), type: 'badge', label: 'Module Pill (Yellow)',
            element: {
              type: 'badge', width: 200, height: 32, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'MODULES 9\u201310',
              badgeStyle: { backgroundColor: 'rgba(215,239,63,0.15)', textColor: '#D7EF3F', fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, borderRadius: 8, paddingX: 16, paddingY: 8, borderColor: '#D7EF3F', borderWidth: 1 },
            },
          },
          {
            id: aid(), type: 'badge', label: 'Module Pill (Green)',
            element: {
              type: 'badge', width: 210, height: 32, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'MODULES 11\u201312',
              badgeStyle: { backgroundColor: 'rgba(32,201,151,0.15)', textColor: '#20C997', fontFamily: 'Poppins', fontSize: 14, fontWeight: 600, borderRadius: 8, paddingX: 16, paddingY: 8, borderColor: '#20C997', borderWidth: 1 },
            },
          },
          {
            id: aid(), type: 'badge', label: 'Free Badge',
            element: {
              type: 'badge', width: 200, height: 40, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'INCLUDED FREE',
              badgeStyle: { backgroundColor: '#20C997', textColor: '#0D1117', fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, borderRadius: 8, paddingX: 16, paddingY: 10 },
            },
          },
          {
            id: aid(), type: 'badge', label: 'NEW LAUNCH',
            element: {
              type: 'badge', width: 180, height: 36, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'NEW LAUNCH',
              badgeStyle: { backgroundColor: '#D7EF3F', textColor: '#181830', fontFamily: 'Poppins', fontSize: 14, fontWeight: 700, borderRadius: 8, paddingX: 16, paddingY: 8 },
            },
          },
          {
            id: aid(), type: 'html-component', label: 'Audience Badge',
            htmlSnippet: '<div class="sigma-element" data-sigma data-type="audience-badge" style="position:absolute;z-index:100;font-family:Poppins,sans-serif;display:inline-flex;flex-direction:column;align-items:center;gap:4px;"><div style="padding:8px 20px;background:rgba(32,201,151,0.1);border:1px solid rgba(32,201,151,0.3);border-radius:8px;"><span style="font-size:16px;font-weight:600;color:rgba(255,255,255,0.9);">Built Exclusively for</span><span style="font-size:16px;font-weight:800;color:#20C997;"> Software Engineers</span></div><span style="font-size:11px;font-weight:500;color:rgba(255,255,255,0.4);">2+ Years Experience Required</span></div>',
            element: {
              type: 'badge', width: 340, height: 60, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'Built Exclusively for Software Engineers',
              badgeStyle: { backgroundColor: 'rgba(32,201,151,0.1)', textColor: 'rgba(255,255,255,0.9)', fontFamily: 'Poppins', fontSize: 16, fontWeight: 600, borderRadius: 8, paddingX: 20, paddingY: 8, borderColor: 'rgba(32,201,151,0.3)', borderWidth: 1 },
            },
          },
        ],
      },
      {
        id: 'price-cards',
        label: 'Price Cards',
        items: [
          {
            id: aid(), type: 'html-component', label: 'Price Card',
            htmlSnippet: '<div class="sigma-element" data-sigma data-type="price-card" style="position:absolute;z-index:100;display:flex;flex-direction:column;align-items:center;gap:12px;padding:28px 40px;background:linear-gradient(180deg,rgba(59,130,246,0.08),rgba(13,17,23,0.95));border:1px solid rgba(59,130,246,0.25);border-radius:16px;min-width:340px;font-family:Poppins,sans-serif;"><span style="font-size:11px;font-weight:600;color:#3b82f6;letter-spacing:2.5px;text-transform:uppercase;">Investment</span><div style="display:flex;align-items:baseline;gap:2px;"><span style="font-size:28px;font-weight:800;color:rgba(255,255,255,0.7);">\u20B9</span><span style="font-size:56px;font-weight:900;color:#fff;letter-spacing:-2px;line-height:1;">36,000</span></div><span style="font-size:13px;font-weight:500;color:#20C997;">+ Gen AI &amp; DS Bootcamp Included for Free</span><div style="display:flex;flex-direction:column;gap:6px;width:100%;margin-top:4px;"><div style="font-size:13.5px;color:rgba(255,255,255,0.65);"><span style="color:#20C997;font-weight:700;">\u2714</span> 75 days \u00b7 Live cohorts \u00b7 March 7</div><div style="font-size:13.5px;color:rgba(255,255,255,0.65);"><span style="color:#20C997;font-weight:700;">\u2714</span> 8+ production projects</div><div style="font-size:13.5px;color:rgba(255,255,255,0.65);"><span style="color:#20C997;font-weight:700;">\u2714</span> 500 seats only</div><div style="font-size:13.5px;color:rgba(255,255,255,0.65);"><span style="color:#20C997;font-weight:700;">\u2714</span> Full refund before March 14</div></div><div style="margin-top:8px;padding:14px 40px;background:#3b82f6;border-radius:8px;font-size:16px;font-weight:700;color:#fff;text-transform:uppercase;width:100%;text-align:center;">ENROLL NOW \u2014 \u20B936,000 \u2192</div><div style="display:flex;gap:16px;margin-top:2px;"><span style="font-size:11px;color:rgba(255,255,255,0.4);">EMI Available \u00b7 No-Risk Refund</span></div></div>',
            element: {
              type: 'badge', width: 380, height: 340, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '\u20B936,000 \u2014 Investment',
              badgeStyle: { backgroundColor: 'rgba(59,130,246,0.08)', textColor: '#ffffff', fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, borderRadius: 16, paddingX: 40, paddingY: 28, borderColor: 'rgba(59,130,246,0.25)', borderWidth: 1 },
            },
          },
        ],
      },
      {
        id: 'strips',
        label: 'Bottom Strips',
        items: [
          {
            id: aid(), type: 'strip', label: 'Tag Strip',
            element: {
              type: 'strip', width: 1080, height: 60, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '\u2714 Live Sessions \u00b7 \u2714 8+ Projects \u00b7 \u2714 75 Days \u00b7 \u2714 500 Seats \u00b7 March 7',
              stripStyle: { backgroundColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.5)', fontFamily: 'Poppins', fontSize: 15, fontWeight: 600, paddingX: 20, paddingY: 10 },
            },
          },
          {
            id: aid(), type: 'strip', label: 'Stats Bar',
            element: {
              type: 'strip', width: 1080, height: 60, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '500 Seats  /  75 Days  /  8+ Projects  /  March 7',
              stripStyle: { backgroundColor: 'rgba(59,130,246,0.1)', textColor: '#3b82f6', fontFamily: 'Poppins', fontSize: 16, fontWeight: 700, paddingX: 20, paddingY: 10 },
            },
          },
        ],
      },
      {
        id: 'logos',
        label: 'Logos',
        items: [
          {
            id: aid(), type: 'logo', label: 'Codebasics (Blue)',
            thumbnail: '/logos/codebasics-primary.svg',
            element: {
              type: 'image', width: 160, height: 48, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '/logos/codebasics-primary.svg',
              imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'none' },
            },
          },
          {
            id: aid(), type: 'logo', label: 'Codebasics (White)',
            thumbnail: '/logos/codebasics-white.svg',
            element: {
              type: 'image', width: 160, height: 48, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '/logos/codebasics-white.svg',
              imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'none' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'common',
    label: 'Common',
    expanded: false,
    subsections: [
      {
        id: 'common-logos',
        label: 'Logos',
        items: [
          {
            id: aid(), type: 'logo', label: 'Codebasics Logo',
            thumbnail: '/logos/codebasics-white.svg',
            element: {
              type: 'image', width: 160, height: 48, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '/logos/codebasics-white.svg',
              imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'none' },
            },
          },
          {
            id: aid(), type: 'badge', label: 'YouTube Badge',
            element: {
              type: 'badge', width: 360, height: 38, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '1 Million+ Subscribers \u00b7 4.9 Rating',
              badgeStyle: { backgroundColor: 'rgba(255,255,255,0.08)', textColor: 'rgba(255,255,255,0.7)', fontFamily: 'Poppins', fontSize: 14, fontWeight: 500, borderRadius: 9999, paddingX: 16, paddingY: 8 },
            },
          },
        ],
      },
      {
        id: 'common-trust',
        label: 'Trust Signals',
        items: [
          {
            id: aid(), type: 'strip', label: 'Trust Strip',
            element: {
              type: 'strip', width: 1080, height: 50, rotation: 0, opacity: 1, locked: false, visible: true,
              content: 'Lifetime Version Access \u2022 100% Refund Policy \u2022 Free Portfolio Website',
              stripStyle: { backgroundColor: 'rgba(255,255,255,0.04)', textColor: 'rgba(255,255,255,0.5)', fontFamily: 'Poppins', fontSize: 14, fontWeight: 500, paddingX: 20, paddingY: 10 },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'data-analytics',
    label: 'Data Analytics Bootcamp',
    expanded: false,
    subsections: [
      {
        id: 'da-heroes',
        label: 'Heroes',
        items: [
          {
            id: aid(), type: 'hero', label: 'Dhaval DA',
            thumbnail: '/images/bootcamps/data-analytics/heroes/dhaval-da-superhero.png',
            element: {
              type: 'image', width: 500, height: 700, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '/images/bootcamps/data-analytics/heroes/dhaval-da-superhero.png',
              glowColor: '#E8A030',
              imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'radial', maskParams: 'ellipse 80% 80% at 50% 42%, black 35%, transparent 70%' },
            },
          },
          {
            id: aid(), type: 'hero', label: 'Hemanand DA',
            thumbnail: '/images/bootcamps/data-analytics/heroes/hemanand-da-superhero.png',
            element: {
              type: 'image', width: 500, height: 700, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '/images/bootcamps/data-analytics/heroes/hemanand-da-superhero.png',
              glowColor: '#E8A030',
              imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'radial', maskParams: 'ellipse 80% 80% at 50% 42%, black 35%, transparent 70%' },
            },
          },
          {
            id: aid(), type: 'hero', label: 'DA Superhero Duo',
            thumbnail: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png',
            element: {
              type: 'image', width: 800, height: 540, rotation: 0, opacity: 1, locked: false, visible: true,
              content: '/images/bootcamps/data-analytics/heroes/both-da-superheroes.png',
              glowColor: '#E8A030',
              imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'radial', maskParams: 'ellipse 80% 80% at 50% 42%, black 35%, transparent 70%' },
            },
          },
        ],
      },
    ],
  },
  {
    id: 'genai',
    label: 'Gen AI Bootcamp',
    expanded: false,
    subsections: [],
  },
  {
    id: 'data-science',
    label: 'Data Science Bootcamp',
    expanded: false,
    subsections: [],
  },
  {
    id: 'data-engineering',
    label: 'Data Engineering Bootcamp',
    expanded: false,
    subsections: [],
  },
];

// Helper to create a new canvas element from an asset item at a drop position
export function createElementFromAsset(
  asset: { element: Omit<CanvasElement, 'id' | 'x' | 'y' | 'zIndex'> },
  x: number,
  y: number,
  maxZIndex: number,
): CanvasElement {
  return {
    ...asset.element,
    id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    x,
    y,
    zIndex: maxZIndex + 1,
  } as CanvasElement;
}
