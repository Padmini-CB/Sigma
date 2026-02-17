import { BRAND } from '@/styles/brand-constants';
import { GitHubGrid } from '@/components/visual-elements/GitHubGrid';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';

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
  const scale = Math.min(width, height) / 1080;

  return (
    <div
      style={{
        width,
        height,
        background: BRAND.background,
        padding: 24 * scale,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: BRAND.fonts.body,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top bar: Logo + YouTube */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <PadminiLogo />
        <YouTubeBadge />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', gap: 12 * scale, overflow: 'hidden' }}>
        {/* Left text (30%) */}
        <div style={{ width: '30%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
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
