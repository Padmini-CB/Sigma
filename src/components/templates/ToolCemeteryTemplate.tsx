import { BRAND } from '@/styles/brand-constants';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface ToolCemeteryTemplateProps {
  headline?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  width?: number;
  height?: number;
}

export function ToolCemeteryTemplate({
  headline = 'DEAD TOOLS?',
  cta = 'LEARN WHAT MATTERS',
  courseName = 'Data Engineering Bootcamp 1.0',
  techStack = ['Python', 'SQL', 'Spark', 'Databricks', 'AWS', 'Snowflake', 'Airflow', 'Kafka'],
  width = 1080,
  height = 1080,
}: ToolCemeteryTemplateProps) {
  const scale = Math.min(width, height) / 1080;

  const tombstones = [
    { name: 'Hadoop MapReduce', rip: 'RIP 2020' },
    { name: 'Jenkins for Data', rip: 'Never Again' },
    { name: 'Excel for 1M Rows', rip: 'Please Stop' },
    { name: 'Manual ETL Scripts', rip: 'RIP 2022' },
  ];

  return (
    <div
      style={{
        width,
        height,
        background: BRAND.background,
        padding: 28 * scale,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: BRAND.fonts.body,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 10 * scale }}>
        <CodebasicsLogo />
        <YouTubeBadge />
      </div>

      {/* Headline above tombstones */}
      <div style={{ textAlign: 'center', marginBottom: 16 * scale, flexShrink: 0 }}>
        <div
          style={{
            fontSize: 16 * scale,
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.6)',
            fontFamily: BRAND.fonts.body,
            marginBottom: 4 * scale,
          }}
        >
          Still learning with
        </div>
        <h1
          style={{
            fontSize: 56 * scale,
            fontWeight: 900,
            fontFamily: BRAND.fonts.heading,
            lineHeight: 1.05,
            margin: 0,
            textTransform: 'uppercase' as const,
          }}
        >
          <span style={{ color: BRAND.colors.textWhite }}>DEAD </span>
          <span style={{ color: '#c7f464' }}>TOOLS?</span>
        </h1>
      </div>

      {/* Tombstones Row */}
      <div style={{ display: 'flex', gap: 14 * scale, flexShrink: 0, marginBottom: 20 * scale }}>
        {tombstones.map((tomb) => (
          <div
            key={tomb.name}
            style={{
              flex: 1,
              height: 200 * scale,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: `${40 * scale}px ${40 * scale}px 0 0`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10 * scale,
              padding: `${16 * scale}px ${10 * scale}px`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 15 * scale,
                fontWeight: 400,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: BRAND.fonts.body,
                lineHeight: 1.3,
              }}
            >
              {tomb.name}
            </div>
            <div
              style={{
                fontSize: 13 * scale,
                fontWeight: 700,
                color: '#c47070',
                fontFamily: BRAND.fonts.heading,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
              }}
            >
              {tomb.rip}
            </div>
          </div>
        ))}
      </div>

      {/* Green Divider with "What's Alive" badge */}
      <div style={{ position: 'relative', marginBottom: 20 * scale, flexShrink: 0 }}>
        <div
          style={{
            height: 1,
            backgroundColor: '#4cc378',
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: BRAND.colors.bgDark,
            border: '1px solid #4cc378',
            borderRadius: 20 * scale,
            padding: `${6 * scale}px ${20 * scale}px`,
            fontSize: 14 * scale,
            fontWeight: 700,
            color: '#4cc378',
            fontFamily: BRAND.fonts.heading,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}
        >
          What&apos;s Alive
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div style={{ flexShrink: 0, marginBottom: 'auto' }}>
        <TechStackPills technologies={techStack} pillSize="md" />
      </div>

      {/* Spacer to push bottom bar down */}
      <div style={{ flex: 1 }} />

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 10 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
