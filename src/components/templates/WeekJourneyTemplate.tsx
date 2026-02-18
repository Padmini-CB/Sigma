import { BRAND } from '@/styles/brand-constants';
import { WeekJourneyGrid } from '@/components/visual-elements/WeekJourneyGrid';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

interface WeekJourneyTemplateProps {
  headline?: string;
  subheadline?: string;
  cta?: string;
  courseName?: string;
  totalWeeks?: string;
  weeks?: Array<{ weekLabel: string; title: string; desc: string }>;
  width?: number;
  height?: number;
}

export function WeekJourneyTemplate({
  subheadline = 'From Zero to Job-Ready Data Engineer',
  cta = 'START WEEK 1',
  courseName = 'Data Engineering Bootcamp 1.0',
  totalWeeks = '10',
  weeks = [
    { weekLabel: '1-2', title: 'SQL & Python', desc: 'Foundations with real business datasets' },
    { weekLabel: '3-4', title: 'AWS & Cloud', desc: 'S3, Lambda, ETL pipelines' },
    { weekLabel: '5-6', title: 'Spark & Databricks', desc: 'E-commerce pipeline at scale' },
    { weekLabel: '7-8', title: 'Snowflake & Airflow', desc: 'Orchestration & data warehouse' },
    { weekLabel: '9', title: 'Production Projects', desc: 'Azure, Kafka. Enterprise systems' },
    { weekLabel: '10', title: 'Virtual Internship', desc: 'Capstone with Scrum & Jira' },
  ],
  width = 1080,
  height = 1080,
}: WeekJourneyTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const headlineBlock = (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{
        fontSize: 'var(--sigma-headline-size)', fontWeight: 900, fontFamily: BRAND.fonts.heading,
        lineHeight: 1.1, margin: 0, textTransform: 'uppercase' as const,
        color: BRAND.colors.textWhite,
      }}>
        {totalWeeks} WEEKS
      </h1>
      <h2 style={{
        fontSize: 'var(--sigma-headline-size)', fontWeight: 800,
        color: 'var(--sigma-headline-accent-color)',
        fontFamily: BRAND.fonts.heading,
        lineHeight: 1.1, margin: 0, marginTop: 4 * scale,
        textTransform: 'uppercase' as const,
      }}>
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

  // ---- YouTube Thumb: Headline/subheadline only, centered ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {topBar}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${12 * scale}px` }}>
          {headlineBlock}
        </div>
      </div>
    );
  }

  // ---- Landscape: Reduced padding, compact grid ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>

        {/* Journey Grid - compact */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <WeekJourneyGrid
            weeks={weeks}
            totalWeeks={totalWeeks}
            subtitle={subheadline}
          />
        </div>

        {/* Bottom Bar with less margin */}
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: Increased spacing around grid ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}

        {/* Journey Grid with generous spacing */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <WeekJourneyGrid
            weeks={weeks}
            totalWeeks={totalWeeks}
            subtitle={subheadline}
          />
        </div>

        {/* Bottom Bar */}
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait: Original layout ----
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <PadminiLogo />
        <YouTubeBadge layoutMode={layoutMode} />
      </div>

      {/* Journey Grid */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <WeekJourneyGrid
          weeks={weeks}
          totalWeeks={totalWeeks}
          subtitle={subheadline}
        />
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
