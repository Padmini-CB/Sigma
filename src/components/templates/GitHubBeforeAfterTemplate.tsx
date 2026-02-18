import { BRAND } from '@/styles/brand-constants';
import { GitHubGrid } from '@/components/visual-elements/GitHubGrid';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

interface GitHubBeforeAfterTemplateProps {
  headline?: string;
  subheadline?: string;
  cta?: string;
  courseName?: string;
  beforeStat?: string;
  afterStat?: string;
  width?: number;
  height?: number;
}

export function GitHubBeforeAfterTemplate({
  headline = 'YOUR GITHUB SAYS MORE',
  subheadline = 'THAN YOUR RESUME',
  cta = 'BUILD YOUR PORTFOLIO',
  courseName = 'Data Engineering Bootcamp 1.0',
  beforeStat = '2 Projects',
  afterStat = '7+ Production Projects',
  width = 1080,
  height = 1080,
}: GitHubBeforeAfterTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const headlineBlock = (
    <div>
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
      <h2
        style={{
          fontSize: 'var(--sigma-headline-size)',
          fontWeight: 800,
          color: 'var(--sigma-headline-accent-color)',
          fontFamily: BRAND.fonts.heading,
          lineHeight: 1.05,
          margin: 0,
          marginTop: 4,
        }}
      >
        {subheadline}
      </h2>
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

  // ---- YouTube Thumb: Bold headline only, no grids, no bottom bar ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {topBar}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${12 * scale}px` }}>
          <div style={{ textAlign: 'center' }}>
            {headlineBlock}
          </div>
        </div>
      </div>
    );
  }

  // ---- Landscape: Headline left (45%) + grids right (55%), compact ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 16 * scale, overflow: 'hidden' }}>
          {/* Left: headline (45%) */}
          <div style={{ width: '45%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {headlineBlock}
          </div>
          {/* Right: grids (55%) */}
          <div style={{ flex: 1, display: 'flex', gap: 12 * scale, alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <GitHubGrid variant="before" label="BEFORE" statNumber={beforeStat.split(' ')[0]} statLabel={beforeStat.split(' ').slice(1).join(' ')} />
            </div>
            <div style={{ flex: 1 }}>
              <GitHubGrid variant="after" label="AFTER" statNumber={afterStat.split(' ')[0]} statLabel={afterStat.split(' ').slice(1).join(' ')} />
            </div>
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: Vertical stack — proportional sections (25% header, 50% content, 10% CTA, 15% spacing) ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 32 * scale, display: 'flex', flexDirection: 'column' }}>
        {/* Header section ~25% */}
        <div style={{ flex: '0 0 20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {topBar}
          <div style={{ textAlign: 'center', padding: `${16 * scale}px 0` }}>
            {headlineBlock}
          </div>
        </div>

        {/* Spacing */}
        <div style={{ flex: '0 0 3%' }} />

        {/* Content section ~55% — grids stacked vertically, full width */}
        <div style={{ flex: '0 0 55%', display: 'flex', flexDirection: 'column', gap: 16 * scale, minHeight: 0 }}>
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <GitHubGrid responsive variant="before" label="BEFORE" statNumber={beforeStat.split(' ')[0]} statLabel={beforeStat.split(' ').slice(1).join(' ')} />
          </div>
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            <GitHubGrid responsive variant="after" label="AFTER" statNumber={afterStat.split(' ')[0]} statLabel={afterStat.split(' ').slice(1).join(' ')} />
          </div>
        </div>

        {/* Spacing */}
        <div style={{ flex: '0 0 5%' }} />

        {/* CTA / Bottom bar ~10% */}
        <div style={{ flex: '0 0 10%', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '100%' }}>
            <BottomBar courseName={courseName} cta={cta} />
          </div>
        </div>
      </div>
    );
  }

  // ---- Square / Portrait: Original two-column layout ----
  const isPortrait = layoutMode === 'portrait';

  return (
    <div
      style={{
        ...wrapperBase,
        padding: 24 * scale,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar: Logo + YouTube */}
      <div style={{ marginBottom: 6 * scale }}>
        {topBar}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', gap: (isPortrait ? 16 : 12) * scale, overflow: 'hidden' }}>
        {/* Left text (30%) */}
        <div style={{ width: '30%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {headlineBlock}
        </div>

        {/* Right grids (70%) */}
        <div style={{ flex: 1, display: 'flex', gap: 12 * scale, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <GitHubGrid variant="before" label="BEFORE" statNumber={beforeStat.split(' ')[0]} statLabel={beforeStat.split(' ').slice(1).join(' ')} />
          </div>
          <div style={{ flex: 1 }}>
            <GitHubGrid variant="after" label="AFTER" statNumber={afterStat.split(' ')[0]} statLabel={afterStat.split(' ').slice(1).join(' ')} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
