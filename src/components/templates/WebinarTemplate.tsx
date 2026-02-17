import { BRAND } from '@/styles/brand-constants';
import { StatCounterGrid } from '@/components/visual-elements/StatCounterGrid';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

interface WebinarTemplateProps {
  headline?: string;
  subheadline?: string;
  bodyText?: string;
  cta?: string;
  courseName?: string;
  stats?: Array<{ number: string; label: string }>;
  width?: number;
  height?: number;
}

export function WebinarTemplate({
  headline = 'LIVE PROBLEM-SOLVING SESSION',
  subheadline = 'Join Dhaval & Hemanand for bi-weekly mentorship',
  bodyText = 'Real business problems \u2022 Production-grade solutions \u2022 Q&A with experts',
  cta = 'REGISTER NOW',
  courseName = 'Padmini Live',
  stats = [
    { number: '17+', label: 'Years Experience' },
    { number: '1M+', label: 'Subscribers' },
    { number: '24', label: 'Sessions / Year' },
  ],
  width = 1080,
  height = 1080,
}: WebinarTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const headlineBlock = (
    <>
      <h1
        style={{
          fontSize: 'var(--sigma-headline-size)',
          fontWeight: 800,
          color: 'var(--sigma-headline-color)',
          fontFamily: BRAND.fonts.heading,
          lineHeight: 1.05,
          textAlign: 'center',
          margin: 0,
        }}
      >
        {headline}
      </h1>
      <p
        style={{
          fontSize: 'var(--sigma-subheadline-size)',
          color: 'var(--sigma-body-color)',
          fontFamily: BRAND.fonts.body,
          textAlign: 'center',
          margin: 0,
        }}
      >
        {subheadline}
      </p>
    </>
  );

  const topBar = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, zIndex: 1 }}>
      <PadminiLogo />
      <YouTubeBadge />
    </div>
  );

  const wrapperBase: React.CSSProperties = {
    width,
    height,
    background: BRAND.background,
    fontFamily: BRAND.fonts.body,
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const decorativeCircle = (
    <div
      style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 600 * scale,
        height: 600 * scale,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(67,97,238,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }}
    />
  );

  const eventBadge = (
    <div style={{ textAlign: 'center', flexShrink: 0, zIndex: 1 }}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          backgroundColor: 'rgba(67,97,238,0.2)',
          border: '1px solid rgba(67,97,238,0.4)',
          borderRadius: 20,
          padding: '4px 14px',
          fontSize: 'var(--sigma-label-size)',
          fontWeight: 600,
          color: BRAND.colors.primaryBlue,
          fontFamily: BRAND.fonts.body,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
        LIVE EVENT
      </div>
    </div>
  );

  const founderCards = (imgSize: number, gap: number) => (
    <div style={{ display: 'flex', gap, justifyContent: 'center', alignItems: 'center' }}>
      {[
        { name: 'Dhaval Patel', role: 'Founder & CEO', img: '/assets/founders/Dhaval.png' },
        { name: 'Hemanand Vadivel', role: 'Co-Founder & CTO', img: '/assets/founders/Hemanand.png' },
      ].map((founder) => (
        <div key={founder.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: imgSize,
              height: imgSize,
              borderRadius: '50%',
              border: '3px solid rgba(255,255,255,0.3)',
              overflow: 'hidden',
              backgroundColor: BRAND.colors.bgCard,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={founder.img}
              alt={founder.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--sigma-card-title-size)', fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading }}>
              {founder.name}
            </div>
            <div style={{ fontSize: 'var(--sigma-label-size)', color: 'var(--sigma-body-color)' }}>
              {founder.role}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // ---- YouTube Thumb: Headline + LIVE EVENT badge only, no detailed content ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {decorativeCircle}
        {topBar}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 * scale, zIndex: 1 }}>
          {eventBadge}
          <div style={{ textAlign: 'center' }}>
            {headlineBlock}
          </div>
        </div>
      </div>
    );
  }

  // ---- Landscape: Compact layout, smaller founder cards ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        {decorativeCircle}
        <div style={{ marginBottom: 4 * scale, zIndex: 1 }}>
          {topBar}
        </div>
        {eventBadge}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 * scale, zIndex: 1 }}>
          {headlineBlock}
          {founderCards(110 * scale, 30 * scale)}
          <div style={{ width: '70%' }}>
            <StatCounterGrid stats={stats} columns={3} />
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: 4 * scale, zIndex: 1 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: Vertical stack with generous spacing ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {decorativeCircle}
        <div style={{ zIndex: 1 }}>
          {topBar}
        </div>
        {eventBadge}
        <div style={{ flexShrink: 0, textAlign: 'center', zIndex: 1 }}>
          {headlineBlock}
        </div>
        <div style={{ zIndex: 1 }}>
          {founderCards(160 * scale, 40 * scale)}
        </div>
        <p
          style={{
            fontSize: 'var(--sigma-body-size)',
            color: 'var(--sigma-body-color)',
            fontFamily: BRAND.fonts.body,
            textAlign: 'center',
            zIndex: 1,
          }}
        >
          {bodyText}
        </p>
        <div style={{ width: '70%', margin: '0 auto', zIndex: 1 }}>
          <StatCounterGrid stats={stats} columns={3} />
        </div>
        <div style={{ flexShrink: 0, zIndex: 1 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait (default): Original layout ----
  return (
    <div
      style={{
        ...wrapperBase,
        padding: 24 * scale,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {decorativeCircle}

      {/* Top bar */}
      <div style={{ marginBottom: 6 * scale, zIndex: 1 }}>
        {topBar}
      </div>

      {/* Event badge */}
      {eventBadge}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 * scale, zIndex: 1 }}>
        {headlineBlock}
        {founderCards(160 * scale, 40 * scale)}

        {/* Event details */}
        <p
          style={{
            fontSize: 'var(--sigma-body-size)',
            color: 'var(--sigma-body-color)',
            fontFamily: BRAND.fonts.body,
            textAlign: 'center',
          }}
        >
          {bodyText}
        </p>

        {/* Stats */}
        <div style={{ width: '70%' }}>
          <StatCounterGrid stats={stats} columns={3} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale, zIndex: 1 }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
