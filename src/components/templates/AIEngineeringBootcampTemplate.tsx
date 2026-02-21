import { BRAND } from '@/styles/brand-constants';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

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
}: AIEngineeringBootcampTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 563; // base scale from YouTube thumbnail height
  const isWide = width / height > 1.2;
  const isSquare = Math.abs(width / height - 1) < 0.15;
  const isTall = height / width > 1.1;

  // Shared colors
  const LIME = '#D7EF3F';
  const BLUE = '#3B82F6';
  const NAVY = '#0c1630';
  const TEAL = '#20C997';

  // Background gradient from the original HTML source
  const background = 'linear-gradient(170deg, #0c1630 0%, #151040 35%, #1a1545 55%, #12103a 80%, #0c1630 100%)';

  // Grid texture overlay
  const gridTexture = `
    linear-gradient(rgba(59,130,246,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59,130,246,0.03) 1px, transparent 1px)
  `;

  // Hero image dimensions & positioning (responsive)
  const heroWidth = isWide ? width * 0.62 : isSquare ? width * 0.55 : width * 0.5;
  const heroRight = 0;

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

  // USP strip
  const uspStrip = (
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
      {uspItems.map((item, i) => (
        <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: Math.round(6 * scale) }}>
          {i > 0 && (
            <span
              style={{
                color: 'rgba(255,255,255,0.3)',
                fontSize: fonts.usp,
                fontFamily: BRAND.fonts.body,
                marginRight: Math.round(2 * scale),
              }}
            >
              ·
            </span>
          )}
          <span style={{ color: TEAL, fontSize: fonts.checkmark, lineHeight: 1 }}>✔</span>
          <span
            style={{
              color: '#ffffff',
              fontSize: fonts.usp,
              fontFamily: BRAND.fonts.body,
              fontWeight: 400,
              whiteSpace: 'nowrap',
            }}
          >
            {item}
          </span>
        </span>
      ))}
    </div>
  );

  // Top bar with logo + PRESENTS + badge
  const topBar = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 5,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(10 * scale) }}>
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
      {showBadge && (
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
          }}
        >
          {badgeText}
        </div>
      )}
    </div>
  );

  // Headline block
  const headlineBlock = (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: Math.round(2 * scale),
      }}
    >
      {/* Line 1: AI ENGINEERING */}
      <h1
        style={{
          margin: 0,
          fontFamily: BRAND.fonts.heading,
          fontWeight: 900,
          fontSize: fonts.line1,
          color: '#ffffff',
          lineHeight: 1.0,
          textTransform: 'uppercase',
        }}
      >
        {headlineLine1}
      </h1>

      {/* Line 2: BOOTCAMP + 1.0 */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: Math.round(8 * scale) }}>
        <span
          style={{
            fontFamily: BRAND.fonts.heading,
            fontWeight: 900,
            fontSize: fonts.line2,
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
            fontSize: fonts.version,
            color: LIME,
            lineHeight: 1.0,
          }}
        >
          {versionBadge}
        </span>
      </div>

      {/* Line 3: Built Exclusively for */}
      <p
        style={{
          margin: 0,
          marginTop: Math.round(6 * scale),
          fontFamily: BRAND.fonts.body,
          fontWeight: 300,
          fontSize: fonts.line3,
          color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.3,
        }}
      >
        {headlineLine3}
      </p>

      {/* Line 4: SOFTWARE ENGINEERS */}
      <h2
        style={{
          margin: 0,
          fontFamily: BRAND.fonts.heading,
          fontWeight: 900,
          fontSize: fonts.line4,
          color: BLUE,
          lineHeight: 1.0,
          textTransform: 'uppercase',
        }}
      >
        {headlineLine4}
      </h2>
    </div>
  );

  // ---- Layout variations ----

  // Tall / Portrait layout: headline top, hero center, USP bottom
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
            top: '30%',
            right: '10%',
            width: width * 0.7,
            height: width * 0.7,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(111,83,193,0.08) 40%, transparent 70%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Content */}
        <div style={{ padding: pad, display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 3 }}>
          {topBar}
          <div style={{ marginTop: Math.round(20 * scale) }}>
            {headlineBlock}
          </div>
        </div>

        {/* Hero image in center area */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            zIndex: 3,
            minHeight: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="AI Engineering Bootcamp Heroes"
            style={{
              height: '100%',
              maxWidth: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom center',
              maskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 15%)',
            }}
          />
        </div>

        {/* USP strip */}
        {uspStrip}
      </div>
    );
  }

  // Square layout: similar to wide but hero bottom-right, headline left
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
            top: '15%',
            right: '-5%',
            width: width * 0.65,
            height: width * 0.65,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(111,83,193,0.08) 40%, transparent 70%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />

        {/* Hero image - right side */}
        <div
          style={{
            position: 'absolute',
            right: heroRight,
            bottom: Math.round(40 * scale), // above USP strip
            width: heroWidth,
            height: height * 0.75,
            zIndex: 3,
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
              height: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom right',
              maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 30%, black 50%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 30%, black 50%)',
            }}
          />
        </div>

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
          {topBar}
          <div style={{ maxWidth: '55%' }}>
            {headlineBlock}
          </div>
          {/* Spacer above USP */}
          <div />
        </div>

        {/* USP strip */}
        {uspStrip}
      </div>
    );
  }

  // ---- Default: Wide / Landscape layout (YouTube Thumb, Facebook, etc.) ----
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
      {/* Grid texture overlay */}
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

      {/* Ambient glow behind heroes */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          right: '10%',
          width: width * 0.6,
          height: height * 1.2,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(111,83,193,0.08) 40%, transparent 70%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Hero image — right side, slightly overflowing top */}
      <div
        style={{
          position: 'absolute',
          right: heroRight,
          top: Math.round(-10 * scale),
          bottom: Math.round(40 * scale), // leave room for USP strip
          width: heroWidth,
          zIndex: 3,
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
            height: '110%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 30%, black 50%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 30%, black 50%)',
          }}
        />
      </div>

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
        {topBar}

        {/* Main headline — left side, vertically centered */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            maxWidth: isWide ? '48%' : '55%',
          }}
        >
          {headlineBlock}
        </div>
      </div>

      {/* Bottom USP strip */}
      {uspStrip}
    </div>
  );
}
