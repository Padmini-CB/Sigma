import { BRAND } from '@/styles/brand-constants';
import { getAdSizeConfig } from '@/config/adSizes';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { BottomBar } from '@/components/visual-elements/BottomBar';

interface StatPunchTemplateProps {
  statNumber?: string;
  statLabel?: string;
  cta?: string;
  courseName?: string;
  width?: number;
  height?: number;
}

export function StatPunchTemplate({
  statNumber = '300+',
  statLabel = 'REAL CAREER SWITCHES',
  cta = 'BUILD REAL SKILLS',
  courseName = 'Data Engineering Bootcamp 1.0',
  width = 1080,
  height = 1080,
}: StatPunchTemplateProps) {
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

  const statNumberBlock = (
    <div
      style={{
        fontSize: 'var(--sigma-stat-number-size)',
        fontFamily: BRAND.fonts.heading,
        fontWeight: 900,
        color: '#D7EF3F',
        lineHeight: 1,
        textAlign: 'center',
      }}
    >
      {statNumber}
    </div>
  );

  const statLabelBlock = (
    <div
      style={{
        fontSize: 'var(--sigma-headline-size)',
        fontFamily: BRAND.fonts.heading,
        fontWeight: 800,
        color: BRAND.colors.textWhite,
        textTransform: 'uppercase' as const,
        letterSpacing: 4,
        lineHeight: 1.15,
        textAlign: 'center',
      }}
    >
      {statLabel}
    </div>
  );

  const photoPlaceholder = (placeholderWidth: string, placeholderHeight: string) => (
    <div
      style={{
        width: placeholderWidth,
        height: placeholderHeight,
        border: '2px dashed rgba(255,255,255,0.1)',
        borderRadius: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontSize: 'var(--sigma-label-size)',
          color: 'rgba(255,255,255,0.15)',
          fontFamily: BRAND.fonts.body,
          fontWeight: 500,
        }}
      >
        Founder Photo
      </span>
    </div>
  );

  // ---- YouTube Thumb: Just stat number + label centered. No BottomBar, no photo area. ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {topBar}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12 * scale,
          }}
        >
          {statNumberBlock}
          {statLabelBlock}
        </div>
      </div>
    );
  }

  // ---- Landscape: Stat number on left (60%), photo placeholder on right (40%), compact BottomBar below ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 16 * scale, overflow: 'hidden' }}>
          {/* Left: Stat number + label (60%) */}
          <div
            style={{
              width: '60%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10 * scale,
            }}
          >
            {statNumberBlock}
            {statLabelBlock}
          </div>

          {/* Right: Photo placeholder (40%) */}
          <div
            style={{
              width: '40%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {photoPlaceholder('100%', `${200 * scale}px`)}
          </div>
        </div>

        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: topBar, stat number + label centered in the middle, photo placeholder below, BottomBar at bottom ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16 * scale,
          }}
        >
          {statNumberBlock}
          {statLabelBlock}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {photoPlaceholder('60%', `${280 * scale}px`)}
        </div>

        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Portrait: Like square but with more vertical breathing room ----
  if (layoutMode === 'portrait') {
    return (
      <div
        style={{
          ...wrapperBase,
          padding: 24 * scale,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ marginBottom: 10 * scale }}>
          {topBar}
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18 * scale,
          }}
        >
          {statNumberBlock}
          {statLabelBlock}

          {/* Photo placeholder area */}
          <div style={{ alignSelf: 'flex-end', width: '30%' }}>
            {photoPlaceholder('100%', `${240 * scale}px`)}
          </div>
        </div>

        <div style={{ flexShrink: 0, marginTop: 12 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square (default): Full layout ----
  return (
    <div
      style={{
        ...wrapperBase,
        padding: 24 * scale,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div style={{ marginBottom: 6 * scale }}>
        {topBar}
      </div>

      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12 * scale,
          position: 'relative',
        }}
      >
        {/* Massive stat number */}
        {statNumberBlock}

        {/* Stat label */}
        {statLabelBlock}

        {/* Founder photo placeholder - bottom-right area (30% of canvas) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: '30%',
            height: '30%',
          }}
        >
          {photoPlaceholder('100%', '100%')}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
