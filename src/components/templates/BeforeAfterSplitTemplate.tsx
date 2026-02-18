import { BRAND } from '@/styles/brand-constants';
import { getAdSizeConfig } from '@/config/adSizes';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { BottomBar } from '@/components/visual-elements/BottomBar';

interface BeforeAfterSplitTemplateProps {
  beforeLabel?: string;
  afterLabel?: string;
  cta?: string;
  courseName?: string;
  width?: number;
  height?: number;
}

export function BeforeAfterSplitTemplate({
  beforeLabel = 'Tutorial Hell',
  afterLabel = 'Production Ready',
  cta = 'BUILD REAL SKILLS',
  courseName = 'Data Engineering Bootcamp 1.0',
  width = 1080,
  height = 1080,
}: BeforeAfterSplitTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const wrapperBase: React.CSSProperties = {
    width,
    height,
    background: BRAND.background,
    fontFamily: BRAND.fonts.body,
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const topBar = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
      <PadminiLogo />
      <YouTubeBadge layoutMode={layoutMode} />
    </div>
  );

  const sectionLabelStyle = (color: string): React.CSSProperties => ({
    fontFamily: BRAND.fonts.heading,
    fontWeight: 800,
    fontSize: 'var(--sigma-subheadline-size)',
    textTransform: 'uppercase',
    letterSpacing: 3,
    color,
    textAlign: 'center',
    margin: 0,
  });

  const mainTextStyle: React.CSSProperties = {
    fontSize: 'var(--sigma-headline-size)',
    fontWeight: 900,
    color: '#ffffff',
    fontFamily: BRAND.fonts.heading,
    lineHeight: 1.1,
    textAlign: 'center',
    margin: 0,
  };

  const placeholderBoxStyle: React.CSSProperties = {
    border: '2px dashed rgba(255,255,255,0.1)',
    borderRadius: 12,
    width: '80%',
    height: '60%',
    margin: '0 auto',
  };

  const RED = '#E63946';
  const TEAL = '#20C997';

  // ---- YouTube Thumb: Labels side by side with descriptions, minimal top bar, no BottomBar, no photo areas ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <PadminiLogo />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32 * scale }}>
          {/* BEFORE side */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 * scale }}>
            <div style={sectionLabelStyle(RED)}>BEFORE</div>
            <div style={mainTextStyle}>{beforeLabel}</div>
          </div>
          {/* Divider */}
          <div
            style={{
              width: 2,
              alignSelf: 'stretch',
              background: 'rgba(255,255,255,0.15)',
              flexShrink: 0,
              margin: `${40 * scale}px 0`,
            }}
          />
          {/* AFTER side */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 * scale }}>
            <div style={sectionLabelStyle(TEAL)}>AFTER</div>
            <div style={mainTextStyle}>{afterLabel}</div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Landscape: Horizontal split, BEFORE left (48%), AFTER right (52%), compact, no photo placeholders ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden' }}>
          {/* BEFORE side — 48% */}
          <div
            style={{
              width: '48%',
              flexShrink: 0,
              background: 'rgba(0,0,0,0.15)',
              borderTop: `4px solid ${RED}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10 * scale,
              padding: 16 * scale,
            }}
          >
            <div style={sectionLabelStyle(RED)}>BEFORE</div>
            <div style={mainTextStyle}>{beforeLabel}</div>
          </div>
          {/* AFTER side — 52% */}
          <div
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.03)',
              borderTop: `4px solid ${TEAL}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10 * scale,
              padding: 16 * scale,
            }}
          >
            <div style={sectionLabelStyle(TEAL)}>AFTER</div>
            <div style={mainTextStyle}>{afterLabel}</div>
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: Vertical stacked — BEFORE on top half, AFTER on bottom half, generous spacing, photo placeholders ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column' }}>
        {/* Logo + Badge - absolute positioned */}
        <div style={{ position: 'absolute', top: 28 * scale, left: 28 * scale, zIndex: 10 }}>
          <PadminiLogo />
        </div>
        <div style={{ position: 'absolute', top: 28 * scale, right: 28 * scale, zIndex: 10 }}>
          <YouTubeBadge layoutMode={layoutMode} />
        </div>

        {/* BEFORE — top half */}
        <div
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.15)',
            borderTop: `4px solid ${RED}`,
            borderRadius: '12px 12px 0 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${60 * scale}px ${24 * scale}px ${20 * scale}px`,
            gap: 16 * scale,
          }}
        >
          <div style={sectionLabelStyle(RED)}>BEFORE</div>
          <div style={mainTextStyle}>{beforeLabel}</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ ...placeholderBoxStyle, height: '100%' }} />
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: 8 * scale, flexShrink: 0 }} />

        {/* AFTER — bottom half */}
        <div
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.03)',
            borderTop: `4px solid ${TEAL}`,
            borderRadius: '12px 12px 0 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${20 * scale}px ${24 * scale}px ${20 * scale}px`,
            gap: 16 * scale,
          }}
        >
          <div style={sectionLabelStyle(TEAL)}>AFTER</div>
          <div style={mainTextStyle}>{afterLabel}</div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', width: '100%' }}>
            <div style={{ ...placeholderBoxStyle, height: '100%' }} />
          </div>
        </div>

        {/* BottomBar */}
        <div style={{ position: 'absolute', bottom: 28 * scale, left: 28 * scale, right: 28 * scale, zIndex: 10 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait: Vertical split — two columns side by side ----
  const isPortrait = layoutMode === 'portrait';

  return (
    <div style={wrapperBase}>
      {/* Logo — absolute top-left */}
      <div style={{ position: 'absolute', top: 24 * scale, left: 24 * scale, zIndex: 10 }}>
        <PadminiLogo />
      </div>
      {/* YouTube Badge — absolute top-right */}
      <div style={{ position: 'absolute', top: 24 * scale, right: 24 * scale, zIndex: 10 }}>
        <YouTubeBadge layoutMode={layoutMode} />
      </div>

      {/* VERTICAL SPLIT — two columns */}
      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
        {/* LEFT (48%) — BEFORE side */}
        <div
          style={{
            width: '48%',
            flexShrink: 0,
            background: 'rgba(0,0,0,0.15)',
            borderTop: `4px solid ${RED}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${80 * scale}px ${20 * scale}px ${100 * scale}px`,
            gap: 16 * scale,
            boxSizing: 'border-box',
          }}
        >
          <div style={sectionLabelStyle(RED)}>BEFORE</div>
          <div style={mainTextStyle}>{beforeLabel}</div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              marginTop: 12 * scale,
            }}
          >
            <div
              style={{
                ...placeholderBoxStyle,
                height: isPortrait ? '70%' : '60%',
              }}
            />
          </div>
        </div>

        {/* RIGHT (52%) — AFTER side */}
        <div
          style={{
            flex: 1,
            background: 'rgba(255,255,255,0.03)',
            borderTop: `4px solid ${TEAL}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${80 * scale}px ${20 * scale}px ${100 * scale}px`,
            gap: 16 * scale,
            boxSizing: 'border-box',
          }}
        >
          <div style={sectionLabelStyle(TEAL)}>AFTER</div>
          <div style={mainTextStyle}>{afterLabel}</div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              marginTop: 12 * scale,
            }}
          >
            <div
              style={{
                ...placeholderBoxStyle,
                height: isPortrait ? '70%' : '60%',
              }}
            />
          </div>
        </div>
      </div>

      {/* BottomBar — full width over both columns */}
      <div
        style={{
          position: 'absolute',
          bottom: 24 * scale,
          left: 24 * scale,
          right: 24 * scale,
          zIndex: 10,
        }}
      >
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
