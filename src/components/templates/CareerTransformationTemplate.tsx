import { BRAND } from '@/styles/brand-constants';
import { StatCounterGrid } from '@/components/visual-elements/StatCounterGrid';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

interface CareerTransformationTemplateProps {
  headline?: string;
  subheadline?: string;
  bodyText?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  stats?: Array<{ number: string; label: string }>;
  beforeRole?: string;
  afterRole?: string;
  width?: number;
  height?: number;
}

export function CareerTransformationTemplate({
  headline = "Non-Tech to Data Analyst. It's Possible.",
  subheadline = 'Join learners who made the switch at 40+.',
  cta = 'TRANSFORM YOUR CAREER',
  courseName = 'Data Analytics Bootcamp 5.0',
  techStack = ['Excel', 'Power BI', 'SQL', 'Python'],
  stats = [
    { number: '300+', label: 'Career Switches' },
    { number: '44K+', label: 'Learners' },
    { number: '4.9', label: 'Rating' },
  ],
  beforeRole = 'Mechanical Engineer',
  afterRole = 'Data Analyst at TCS',
  width = 1080,
  height = 1080,
}: CareerTransformationTemplateProps) {
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

  const beforeCard = (minW: number, padding: string) => (
    <div
      style={{
        backgroundColor: BRAND.colors.bgCard,
        border: `2px solid ${BRAND.colors.redWarning}`,
        borderRadius: 12,
        padding,
        textAlign: 'center',
        minWidth: minW,
      }}
    >
      <div style={{ fontSize: 'var(--sigma-label-size)', fontWeight: 700, color: BRAND.colors.redWarning, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>
        BEFORE
      </div>
      <div style={{ fontSize: 'var(--sigma-card-title-size)', fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading }}>
        {beforeRole}
      </div>
      <div style={{ fontSize: 'var(--sigma-label-size)', color: 'var(--sigma-body-color)', marginTop: 4 }}>4 year career gap</div>
    </div>
  );

  const afterCard = (minW: number, padding: string) => (
    <div
      style={{
        backgroundColor: BRAND.colors.bgCard,
        border: `2px solid ${BRAND.colors.greenGrid}`,
        borderRadius: 12,
        padding,
        textAlign: 'center',
        minWidth: minW,
      }}
    >
      <div style={{ fontSize: 'var(--sigma-label-size)', fontWeight: 700, color: BRAND.colors.greenGrid, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>
        AFTER
      </div>
      <div style={{ fontSize: 'var(--sigma-card-title-size)', fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading }}>
        {afterRole}
      </div>
      <div style={{ fontSize: 'var(--sigma-label-size, 15px)', color: '#4cc378', marginTop: 4 }}>In 4 months</div>
    </div>
  );

  const arrow = (arrowScale: number) => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg width={80 * arrowScale} height={32 * arrowScale} viewBox="0 0 80 32" fill="none">
        <path d="M0 16H70M70 16L58 6M70 16L58 26" stroke={'#4cc378'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );

  // ---- YouTube Thumb: Bold headline only, no cards, no stats, no bottom bar ----
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

  // ---- Landscape: Compact before/after side-by-side, reduced stats ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 * scale }}>
          {headlineBlock}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 * scale }}>
            {beforeCard(180 * scale, '14px 24px')}
            {arrow(scale)}
            {afterCard(180 * scale, '14px 24px')}
          </div>
          <div style={{ width: '90%', margin: '0 auto' }}>
            <StatCounterGrid stats={stats} columns={3} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TechStackPills technologies={techStack} pillSize="sm" />
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 * scale }}>
          {beforeCard(240 * scale, '20px 32px')}
          {arrow(scale)}
          {afterCard(240 * scale, '20px 32px')}
        </div>
        <div style={{ width: '90%', margin: '0 auto' }}>
          <StatCounterGrid stats={stats} columns={3} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TechStackPills technologies={techStack} pillSize="sm" />
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 * scale }}>
        {headlineBlock}

        {/* Before -> After transformation visual */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 * scale }}>
          {beforeCard(240 * scale, '20px 32px')}
          {arrow(scale)}
          {afterCard(240 * scale, '20px 32px')}
        </div>

        {/* Stats */}
        <div style={{ width: '90%', margin: '0 auto' }}>
          <StatCounterGrid stats={stats} columns={3} />
        </div>

        {/* Tech Stack */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TechStackPills technologies={techStack} pillSize="sm" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
