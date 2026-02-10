import { BRAND } from '@/styles/brand-constants';
import { WeekJourneyGrid } from '@/components/visual-elements/WeekJourneyGrid';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

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
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <CodebasicsLogo />
        <YouTubeBadge />
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
