import { BRAND } from '@/styles/brand-constants';
import { StatCounterGrid } from '@/components/visual-elements/StatCounterGrid';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

interface IndustryVeteransTemplateProps {
  headline?: string;
  subheadline?: string;
  cta?: string;
  courseName?: string;
  stats?: Array<{ number: string; label: string }>;
  width?: number;
  height?: number;
}

export function IndustryVeteransTemplate({
  headline = 'LEARN FROM INDUSTRY VETERANS',
  subheadline = 'Real-world experience. Not theoretical fluff.',
  cta = 'MEET YOUR MENTORS',
  courseName = 'Padmini',
  stats = [
    { number: '17+', label: 'Years Experience' },
    { number: '1M+', label: 'Subscribers' },
    { number: '44K+', label: 'Learners' },
  ],
  width = 1080,
  height = 1080,
}: IndustryVeteransTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const headlineBlock = (
    <div style={{ textAlign: 'center' }}>
      <h1
        style={{
          fontSize: 'var(--sigma-headline-size)',
          fontWeight: 800,
          color: 'var(--sigma-headline-color)',
          fontFamily: BRAND.fonts.heading,
          lineHeight: 1.05,
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
          marginTop: 8,
        }}
      >
        {subheadline}
      </p>
    </div>
  );

  const topBar = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
      <PadminiLogo />
      <YouTubeBadge layoutMode={layoutMode} />
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

  const founderCard = (name: string, role: string, img: string, imgSize: number) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
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
          src={img}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--sigma-card-title-size)', fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading }}>
          {name}
        </div>
        <div style={{ fontSize: 'var(--sigma-label-size)', color: 'var(--sigma-body-color)', fontFamily: BRAND.fonts.body }}>
          {role}
        </div>
      </div>
    </div>
  );

  // ---- YouTube Thumb: Bold headline only, no founders, no stats, no bottom bar ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {topBar}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            {headlineBlock}
          </div>
        </div>
      </div>
    );
  }

  // ---- Landscape: Compact layout, smaller founder images, less spacing ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 * scale }}>
          {headlineBlock}
          <div style={{ display: 'flex', gap: 30 * scale, justifyContent: 'center', alignItems: 'center' }}>
            {founderCard('Dhaval Patel', 'Founder & CEO', '/assets/founders/Dhaval.png', 120 * scale)}
            {founderCard('Hemanand Vadivel', 'Co-Founder & CTO', '/assets/founders/Hemanand.png', 120 * scale)}
          </div>
          <div style={{ width: '80%' }}>
            <StatCounterGrid stats={stats} columns={3} />
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: Vertical stack with generous spacing ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}
        <div style={{ flexShrink: 0, textAlign: 'center', padding: `${12 * scale}px 0` }}>
          {headlineBlock}
        </div>
        <div style={{ display: 'flex', gap: 40 * scale, justifyContent: 'center', alignItems: 'center' }}>
          {founderCard('Dhaval Patel', 'Founder & CEO', '/assets/founders/Dhaval.png', 180 * scale)}
          {founderCard('Hemanand Vadivel', 'Co-Founder & CTO', '/assets/founders/Hemanand.png', 180 * scale)}
        </div>
        <div style={{ width: '80%', margin: '0 auto' }}>
          <StatCounterGrid stats={stats} columns={3} />
        </div>
        <div style={{ flexShrink: 0 }}>
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
      {/* Top bar */}
      <div style={{ marginBottom: 6 * scale }}>
        {topBar}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 * scale }}>
        {headlineBlock}

        {/* Founders Display */}
        <div style={{ display: 'flex', gap: 40 * scale, justifyContent: 'center', alignItems: 'center' }}>
          {founderCard('Dhaval Patel', 'Founder & CEO', '/assets/founders/Dhaval.png', 180 * scale)}
          {founderCard('Hemanand Vadivel', 'Co-Founder & CTO', '/assets/founders/Hemanand.png', 180 * scale)}
        </div>

        {/* Stats */}
        <div style={{ width: '80%' }}>
          <StatCounterGrid stats={stats} columns={3} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
