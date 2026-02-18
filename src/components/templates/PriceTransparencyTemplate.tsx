import { BRAND } from '@/styles/brand-constants';
import { BarChartComparison } from '@/components/visual-elements/BarChartComparison';
import { StatCounterGrid } from '@/components/visual-elements/StatCounterGrid';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

interface PriceTransparencyTemplateProps {
  headline?: string;
  price?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  stats?: Array<{ number: string; label: string }>;
  leftCard?: { title: string; items: Array<{ label: string; percentage: number }> };
  rightCard?: { title: string; items: Array<{ label: string; percentage: number }> };
  width?: number;
  height?: number;
}

export function PriceTransparencyTemplate({
  headline = "Here's exactly where your money goes",
  price = '₹12,000',
  cta = 'START LEARNING',
  courseName = 'Data Engineering Bootcamp 1.0',
  techStack = ['SQL', 'Python', 'Spark', 'Databricks', 'AWS', 'Snowflake', 'Airflow', 'Kafka'],
  stats = [
    { number: '7', label: 'Production Projects' },
    { number: '2', label: 'Virtual Internships' },
    { number: '24', label: 'Live Sessions / Year' },
    { number: '290+', label: 'Hours of Content' },
    { number: '∞', label: 'Practice Environments' },
    { number: '1M+', label: 'Community Members' },
  ],
  leftCard = {
    title: '₹2.5L BOOTCAMP',
    items: [
      { label: 'Sales & Marketing', percentage: 45 },
      { label: 'Fancy Office', percentage: 25 },
      { label: 'Generic Videos', percentage: 15 },
      { label: '"Career Support"', percentage: 10 },
      { label: 'Actual Teaching', percentage: 5 },
    ],
  },
  rightCard = {
    title: 'CODEBASICS (₹12K)',
    items: [
      { label: 'Content & Platform', percentage: 50 },
      { label: 'Live Mentoring', percentage: 25 },
      { label: 'Cloud Infra', percentage: 15 },
      { label: 'Support & Admin', percentage: 10 },
      { label: 'Billboard Ads', percentage: 0 },
    ],
  },
  width = 1080,
  height = 1080,
}: PriceTransparencyTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const priceBlock = (
    <div>
      <div
        style={{
          fontSize: 'var(--sigma-stat-number-size)',
          fontWeight: 800,
          color: 'var(--sigma-stat-color)',
          fontFamily: BRAND.fonts.heading,
          lineHeight: 1,
        }}
      >
        {price}
      </div>
      <div
        style={{
          fontSize: 'var(--sigma-body-size)',
          color: 'var(--sigma-body-color)',
          fontFamily: BRAND.fonts.body,
          marginTop: 6,
        }}
      >
        {headline}
      </div>
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

  // ---- YouTube Thumb: Headline + price only, centered, no bottom bar ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {topBar}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${12 * scale}px` }}>
          <div style={{ textAlign: 'center' }}>
            {priceBlock}
          </div>
        </div>
      </div>
    );
  }

  // ---- Landscape: Two-column with adjusted ratios, reduced stats ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 10 * scale, overflow: 'hidden' }}>
          {/* Left column: Price + Stats (35%) */}
          <div style={{ width: '35%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 * scale, justifyContent: 'center' }}>
            {priceBlock}
            <StatCounterGrid stats={stats.slice(0, 4)} columns={2} />
          </div>
          {/* Right: Bar Chart Comparison (65%) */}
          <div style={{ flex: 1 }}>
            <BarChartComparison leftCard={leftCard} rightCard={rightCard} />
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: Vertical stack — price, stats, tech, chart, bottom bar ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}
        {/* Price + headline centered */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          {priceBlock}
        </div>
        {/* Stats full width */}
        <div style={{ flexShrink: 0 }}>
          <StatCounterGrid stats={stats} columns={3} />
        </div>
        {/* Tech stack pills */}
        <div style={{ flexShrink: 0 }}>
          <TechStackPills technologies={techStack} pillSize="sm" />
        </div>
        {/* Bar chart comparison full width */}
        <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <BarChartComparison leftCard={leftCard} rightCard={rightCard} />
        </div>
        {/* Bottom bar */}
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
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
      {/* Top bar */}
      <div style={{ marginBottom: 6 * scale }}>
        {topBar}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', gap: 10 * scale, overflow: 'hidden' }}>
        {/* Left column: Price + Stats + Tech (40%) */}
        <div style={{ width: '40%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: (isPortrait ? 12 : 8) * scale, justifyContent: 'center' }}>
          {priceBlock}

          <StatCounterGrid stats={stats} columns={2} />

          <TechStackPills technologies={techStack} pillSize="sm" />
        </div>

        {/* Right: Bar Chart Comparison (60%) */}
        <div style={{ flex: 1 }}>
          <BarChartComparison leftCard={leftCard} rightCard={rightCard} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
