import { BRAND } from '@/styles/brand-constants';
import { BarChartComparison } from '@/components/visual-elements/BarChartComparison';
import { StatCounterGrid } from '@/components/visual-elements/StatCounterGrid';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

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
    { number: '1.4M+', label: 'Community Members' },
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
  const scale = Math.min(width, height) / 1080;

  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(145deg, ${BRAND.colors.bgDark}, ${BRAND.colors.bgCard})`,
        padding: 36 * scale,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: BRAND.fonts.body,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 16 * scale }}>
        <CodebasicsLogo />
        <YouTubeBadge />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', gap: 20 * scale, overflow: 'hidden' }}>
        {/* Left column: Price + Stats + Tech */}
        <div style={{ width: '35%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 * scale, justifyContent: 'center' }}>
          <div>
            <div
              style={{
                fontSize: 48 * scale,
                fontWeight: 800,
                color: BRAND.colors.accentGreen,
                fontFamily: BRAND.fonts.heading,
                lineHeight: 1,
              }}
            >
              {price}
            </div>
            <div
              style={{
                fontSize: 14 * scale,
                color: BRAND.colors.textMuted,
                fontFamily: BRAND.fonts.body,
                marginTop: 6,
              }}
            >
              {headline}
            </div>
          </div>

          <StatCounterGrid stats={stats} columns={2} />

          <TechStackPills technologies={techStack} pillSize="sm" />
        </div>

        {/* Right: Bar Chart Comparison */}
        <div style={{ flex: 1 }}>
          <BarChartComparison leftCard={leftCard} rightCard={rightCard} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 14 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
