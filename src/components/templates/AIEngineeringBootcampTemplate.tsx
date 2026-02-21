import { BRAND } from '@/styles/brand-constants';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';
import DraggableTemplateElement, {
  type AIEngElementId,
  type ElementLayout,
  type ElementOverrides,
  DEFAULT_ELEMENT_LAYOUT,
} from '@/components/DraggableTemplateElement';

interface AIEngineeringBootcampTemplateProps {
  /** Line 1 of headline */
  headlineLine1?: string;
  /** Line 2 prefix (e.g. "BOOTCAMP") */
  headlineLine2?: string;
  /** Version badge text (e.g. "1.0") */
  versionBadge?: string;
  /** Line 3 small text */
  headlineLine3?: string;
  /** Line 4 big accent text */
  headlineLine4?: string;
  /** USP items for bottom strip */
  uspItems?: string[];
  /** PRESENTS text next to logo */
  presentsText?: string;
  /** Top-right badge text */
  badgeText?: string;
  /** Whether to show the badge */
  showBadge?: boolean;
  /** Hero image path */
  heroImage?: string;
  /** Canvas width */
  width?: number;
  /** Canvas height */
  height?: number;
  /** Interactive mode: enables dragging & resizing of elements */
  isInteractive?: boolean;
  /** Canvas scale factor for interactive mode (viewport scale) */
  canvasScale?: number;
  /** Per-element layout overrides */
  elementOverrides?: ElementOverrides;
  /** Callback when an element is moved/resized */
  onElementUpdate?: (id: AIEngElementId, updates: Partial<ElementLayout>) => void;
  /** Currently selected element */
  selectedElement?: AIEngElementId | null;
  /** Callback to select/deselect an element */
  onElementSelect?: (id: AIEngElementId | null) => void;
}

/** Helper: get layout for an element, falling back to defaults */
function getLayout(overrides: ElementOverrides | undefined, id: AIEngElementId): ElementLayout {
  return overrides?.[id] ?? DEFAULT_ELEMENT_LAYOUT;
}

export function AIEngineeringBootcampTemplate({
  headlineLine1 = 'AI ENGINEERING',
  headlineLine2 = 'BOOTCAMP',
  versionBadge = '1.0',
  headlineLine3 = 'Built Exclusively for',
  headlineLine4 = 'SOFTWARE ENGINEERS',
  uspItems = ['75 Days Intensive', 'Live Sessions', '8+ Projects'],
  presentsText = 'PRESENTS',
  badgeText = 'NEW LAUNCH',
  showBadge = true,
  heroImage = '/images/bootcamps/ai-engineering/heroes/superhero-trio.png',
  width = 1000,
  height = 563,
  isInteractive = false,
  canvasScale = 1,
  elementOverrides,
  onElementUpdate,
  selectedElement,
  onElementSelect,
}: AIEngineeringBootcampTemplateProps) {
  const scale = Math.min(width, height) / 563;
  const isWide = width / height > 1.2;
  const isSquare = Math.abs(width / height - 1) < 0.15;
  const isTall = height / width > 1.1;

  // Shared colors
  const LIME = '#D7EF3F';
  const BLUE = '#3B82F6';
  const NAVY = '#0c1630';
  const TEAL = '#20C997';

  // Background gradient
  const background = 'linear-gradient(170deg, #0c1630 0%, #151040 35%, #1a1545 55%, #12103a 80%, #0c1630 100%)';

  // Grid texture overlay
  const gridTexture = `
    linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
  `;

  // Hero image dimensions & positioning (responsive)
  const defaultHeroWidth = isWide ? width * 0.62 : isSquare ? width * 0.55 : width * 0.5;
  const defaultHeroHeight = isTall ? height * 0.45 : isSquare ? height * 0.75 : height + Math.round(10 * scale) + Math.round(40 * scale);

  // Font sizes scaled proportionally
  const fonts = {
    line1: Math.round(62 * scale * (isTall ? 0.75 : isSquare ? 0.85 : 1)),
    line2: Math.round(62 * scale * (isTall ? 0.75 : isSquare ? 0.85 : 1)),
    version: Math.round(40 * scale * (isTall ? 0.75 : isSquare ? 0.85 : 1)),
    line3: Math.round(20 * scale * (isTall ? 0.8 : isSquare ? 0.85 : 1)),
    line4: Math.round(78 * scale * (isTall ? 0.6 : isSquare ? 0.7 : 1)),
    presents: Math.round(13 * scale),
    badge: Math.round(14 * scale),
    usp: Math.round(15 * scale),
    checkmark: Math.round(15 * scale),
  };

  // Padding
  const pad = Math.round(28 * scale);

  // Element layouts (with overrides applied)
  const heroLayout = getLayout(elementOverrides, 'heroImage');
  const headlineLayout = getLayout(elementOverrides, 'headline');
  const subtitleLayout = getLayout(elementOverrides, 'subtitle');
  const targetLayout = getLayout(elementOverrides, 'targetAudience');
  const badgeLayout = getLayout(elementOverrides, 'badge');
  const logoLayout = getLayout(elementOverrides, 'logo');
  const uspLayout = getLayout(elementOverrides, 'uspStrip');

  // Override sizes
  const heroW = heroLayout.width ?? defaultHeroWidth;
  const heroH = heroLayout.height ?? defaultHeroHeight;
  const line1Size = headlineLayout.fontSize ?? fonts.line1;
  const line2Size = headlineLayout.fontSize ?? fonts.line2;
  const versionSize = headlineLayout.fontSize ? Math.round(headlineLayout.fontSize * 0.65) : fonts.version;
  const line3Size = subtitleLayout.fontSize ?? fonts.line3;
  const line4Size = targetLayout.fontSize ?? fonts.line4;
  const uspFontSize = uspLayout.fontSize ?? fonts.usp;
  const badgeScale = badgeLayout.scale ?? 1;
  const logoScale = logoLayout.scale ?? 1;

  // Noop handlers for non-interactive mode
  const handleUpdate = onElementUpdate ?? (() => {});
  const handleSelect = onElementSelect ?? (() => {});

  // ── Helper: wrap element in DraggableTemplateElement when interactive ──
  const wrap = (
    id: AIEngElementId,
    type: 'image' | 'text' | 'badge',
    layout: ElementLayout,
    defaults: { width?: number; height?: number; fontSize?: number },
    children: React.ReactNode,
    extraStyle?: React.CSSProperties,
    extraClass?: string,
  ) => {
    if (isInteractive) {
      return (
        <DraggableTemplateElement
          elementId={id}
          isInteractive
          canvasScale={canvasScale}
          layout={layout}
          type={type}
          onUpdate={handleUpdate}
          onSelect={handleSelect}
          isSelected={selectedElement === id}
          defaultWidth={defaults.width}
          defaultHeight={defaults.height}
          defaultFontSize={defaults.fontSize}
          style={extraStyle}
          className={extraClass}
        >
          {children}
        </DraggableTemplateElement>
      );
    }
    // Static: apply offsets
    return (
      <div
        style={{
          ...extraStyle,
          transform: layout.offsetX || layout.offsetY
            ? `translate(${layout.offsetX}px, ${layout.offsetY}px)`
            : undefined,
          position: 'relative',
        }}
        className={extraClass}
      >
        {children}
      </div>
    );
  };

  // ── USP strip content ──
  const uspContent = (
    <>
      {uspItems.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(6 * scale) }}>
          {i > 0 && (
            <span
              style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: uspFontSize,
                fontFamily: BRAND.fonts.body,
                marginRight: Math.round(2 * scale),
              }}
            >
              ·
            </span>
          )}
          <span style={{ color: TEAL, fontSize: uspFontSize, lineHeight: 1 }}>✔</span>
          <span
            style={{
              color: '#ffffff',
              fontSize: uspFontSize,
              fontFamily: BRAND.fonts.body,
              fontWeight: 400,
              whiteSpace: 'nowrap',
            }}
          >
            {item}
          </span>
        </span>
      ))}
    </>
  );

  // ── Logo + PRESENTS content ──
  const logoContent = (
    <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(10 * scale), transform: `scale(${logoScale})`, transformOrigin: 'left center' }}>
      <PadminiLogo />
      <span
        style={{
          fontFamily: BRAND.fonts.body,
          fontWeight: 300,
          fontSize: fonts.presents,
          letterSpacing: 3.5,
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
        }}
      >
        {presentsText}
      </span>
    </div>
  );

  // ── Badge content ──
  const badgeContent = showBadge ? (
    <div
      style={{
        background: LIME,
        color: NAVY,
        fontFamily: BRAND.fonts.heading,
        fontWeight: 800,
        fontSize: fonts.badge,
        textTransform: 'uppercase',
        padding: `${Math.round(5 * scale)}px ${Math.round(16 * scale)}px`,
        borderRadius: Math.round(4 * scale),
        letterSpacing: 0.5,
        transform: `scale(${badgeScale})`,
        transformOrigin: 'right center',
      }}
    >
      {badgeText}
    </div>
  ) : null;

  // ── Headline content (lines 1 + 2) ──
  const headlineContent = (
    <>
      <h1
        style={{
          margin: 0,
          fontFamily: BRAND.fonts.heading,
          fontWeight: 900,
          fontSize: line1Size,
          color: '#ffffff',
          lineHeight: 1.0,
          textTransform: 'uppercase',
        }}
      >
        {headlineLine1}
      </h1>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: Math.round(8 * scale) }}>
        <span
          style={{
            fontFamily: BRAND.fonts.heading,
            fontWeight: 900,
            fontSize: line2Size,
            color: '#ffffff',
            lineHeight: 1.0,
            textTransform: 'uppercase',
          }}
        >
          {headlineLine2}
        </span>
        <span
          style={{
            fontFamily: BRAND.fonts.heading,
            fontWeight: 900,
            fontSize: versionSize,
            color: LIME,
            lineHeight: 1.0,
          }}
        >
          {versionBadge}
        </span>
      </div>
    </>
  );

  // ── Subtitle content (line 3) ──
  const subtitleContent = (
    <p
      style={{
        margin: 0,
        marginTop: Math.round(6 * scale),
        fontFamily: BRAND.fonts.body,
        fontWeight: 300,
        fontSize: line3Size,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 1.3,
      }}
    >
      {headlineLine3}
    </p>
  );

  // ── Target audience content (line 4) ──
  const targetContent = (
    <h2
      style={{
        margin: 0,
        fontFamily: BRAND.fonts.heading,
        fontWeight: 900,
        fontSize: line4Size,
        color: BLUE,
        lineHeight: 1.0,
        textTransform: 'uppercase',
      }}
    >
      {headlineLine4}
    </h2>
  );

  // ── Hero image with blend mode + mask ──
  const heroImgStyle = (maskDir: 'right' | 'top'): React.CSSProperties => {
    const mask = maskDir === 'top'
      ? 'linear-gradient(to top, transparent 0%, black 15%)'
      : 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 30%, black 50%)';
    return {
      width: '100%',
      height: '100%',
      objectFit: 'contain' as const,
      objectPosition: maskDir === 'top' ? 'bottom center' : 'bottom right',
      mixBlendMode: 'lighten' as const,
      maskImage: mask,
      WebkitMaskImage: mask,
    };
  };

  // ── Background layers (shared across all layouts) ──
  const bgLayers = (glowTop: string, glowRight: string, glowW: number, glowH: number) => (
    <>
      {/* Grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: gridTexture,
          backgroundSize: '40px 40px',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: glowTop,
          right: glowRight,
          width: glowW,
          height: glowH,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(111,83,193,0.08) 40%, transparent 70%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
    </>
  );

  // ══════════════════════════════════════════════════════
  // TALL / PORTRAIT LAYOUT
  // ══════════════════════════════════════════════════════
  if (isTall) {
    return (
      <div
        style={{
          width,
          height,
          background,
          fontFamily: BRAND.fonts.body,
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {bgLayers('30%', '10%', width * 0.7, width * 0.7)}

        {/* Content */}
        <div style={{ padding: pad, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 3, flexShrink: 0 }}>
          {/* Top bar: logo + badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            {wrap('logo', 'badge', logoLayout, {}, logoContent)}
            {badgeContent && wrap('badge', 'badge', badgeLayout, {}, badgeContent)}
          </div>

          {/* Headline block */}
          <div style={{ marginTop: Math.round(20 * scale), display: 'flex', flexDirection: 'column', gap: Math.round(2 * scale), zIndex: 5 }}>
            {wrap('headline', 'text', headlineLayout, { fontSize: fonts.line1 }, headlineContent)}
            {wrap('subtitle', 'text', subtitleLayout, { fontSize: fonts.line3 }, subtitleContent)}
            {wrap('targetAudience', 'text', targetLayout, { fontSize: fonts.line4 }, targetContent)}
          </div>
        </div>

        {/* Hero image in center area */}
        {wrap('heroImage', 'image', heroLayout, { width: defaultHeroWidth, height: defaultHeroHeight },
          <div
            style={{
              flex: 1,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              zIndex: 3,
              minHeight: 0,
              width: heroW,
              height: heroH,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt="AI Engineering Bootcamp Heroes"
              style={heroImgStyle('top')}
            />
          </div>,
          { flex: 1, zIndex: 3, minHeight: 0 },
        )}

        {/* USP strip */}
        {wrap('uspStrip', 'text', uspLayout, { fontSize: fonts.usp },
          <div
            style={{
              zIndex: 10,
              background: 'rgba(12,16,36,0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: `${Math.round(12 * scale)}px ${pad}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Math.round(8 * scale),
            }}
          >
            {uspContent}
          </div>,
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // SQUARE LAYOUT
  // ══════════════════════════════════════════════════════
  if (isSquare) {
    return (
      <div
        style={{
          width,
          height,
          background,
          fontFamily: BRAND.fonts.body,
          position: 'relative',
          overflow: 'hidden',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {bgLayers('15%', '-5%', width * 0.65, width * 0.65)}

        {/* Hero image - right side (absolutely positioned) */}
        {wrap('heroImage', 'image', heroLayout, { width: defaultHeroWidth, height: defaultHeroHeight },
          <div
            style={{
              width: heroW,
              height: heroH,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heroImage}
              alt="AI Engineering Bootcamp Heroes"
              style={heroImgStyle('right')}
            />
          </div>,
          {
            position: 'absolute',
            right: 0,
            bottom: Math.round(40 * scale),
            zIndex: 3,
          },
        )}

        {/* Content */}
        <div
          style={{
            padding: pad,
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            position: 'relative',
            zIndex: 5,
            justifyContent: 'space-between',
          }}
        >
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
            {wrap('logo', 'badge', logoLayout, {}, logoContent)}
            {badgeContent && wrap('badge', 'badge', badgeLayout, {}, badgeContent)}
          </div>

          {/* Headline block */}
          <div style={{ maxWidth: '55%', display: 'flex', flexDirection: 'column', gap: Math.round(2 * scale), zIndex: 5 }}>
            {wrap('headline', 'text', headlineLayout, { fontSize: fonts.line1 }, headlineContent)}
            {wrap('subtitle', 'text', subtitleLayout, { fontSize: fonts.line3 }, subtitleContent)}
            {wrap('targetAudience', 'text', targetLayout, { fontSize: fonts.line4 }, targetContent)}
          </div>

          {/* Spacer above USP */}
          <div />
        </div>

        {/* USP strip */}
        {wrap('uspStrip', 'text', uspLayout, { fontSize: fonts.usp },
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              background: 'rgba(12,16,36,0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              padding: `${Math.round(12 * scale)}px ${pad}px`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: Math.round(8 * scale),
            }}
          >
            {uspContent}
          </div>,
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // WIDE / LANDSCAPE LAYOUT (YouTube Thumb, Facebook, etc.)
  // ══════════════════════════════════════════════════════
  return (
    <div
      style={{
        width,
        height,
        background,
        fontFamily: BRAND.fonts.body,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {bgLayers('-10%', '10%', width * 0.6, height * 1.2)}

      {/* Hero image — right side */}
      {wrap('heroImage', 'image', heroLayout, { width: defaultHeroWidth, height: defaultHeroHeight },
        <div
          style={{
            width: heroW,
            height: heroH,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="AI Engineering Bootcamp Heroes"
            style={{
              ...heroImgStyle('right'),
              height: '110%',
              width: undefined,
            }}
          />
        </div>,
        {
          position: 'absolute',
          right: 0,
          top: Math.round(-10 * scale),
          bottom: Math.round(40 * scale),
          zIndex: 3,
        },
      )}

      {/* Content Layer */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: pad,
          boxSizing: 'border-box',
        }}
      >
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          {wrap('logo', 'badge', logoLayout, {}, logoContent)}
          {badgeContent && wrap('badge', 'badge', badgeLayout, {}, badgeContent)}
        </div>

        {/* Main headline — left side, vertically centered */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            maxWidth: isWide ? '48%' : '55%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: Math.round(2 * scale), zIndex: 5 }}>
            {wrap('headline', 'text', headlineLayout, { fontSize: fonts.line1 }, headlineContent)}
            {wrap('subtitle', 'text', subtitleLayout, { fontSize: fonts.line3 }, subtitleContent)}
            {wrap('targetAudience', 'text', targetLayout, { fontSize: fonts.line4 }, targetContent)}
          </div>
        </div>
      </div>

      {/* Bottom USP strip */}
      {wrap('uspStrip', 'text', uspLayout, { fontSize: fonts.usp },
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            background: 'rgba(12,16,36,0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: `${Math.round(12 * scale)}px ${pad}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: Math.round(8 * scale),
          }}
        >
          {uspContent}
        </div>,
      )}
    </div>
  );
}
