import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';

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
    { name: 'HADOOP MAPREDUCE', rip: 'RIP 2020' },
    { name: 'JENKINS FOR DATA', rip: 'Never Again' },
    { name: 'EXCEL FOR 1M ROWS', rip: 'Please Stop' },
    { name: 'MANUAL ETL SCRIPTS', rip: 'RIP 2022' },
  ];

  const months = [
    {
      label: 'MONTH 1',
      items: ['• Python & SQL Foundations', '• Data Pipeline Basics', '• Git & Version Control'],
    },
    {
      label: 'MONTH 2',
      items: ['• Spark & Databricks', '• Cloud Infrastructure (AWS)', '• Medallion Architecture'],
    },
    {
      label: 'MONTH 3',
      items: ['• Airflow Orchestration', '• Kafka Streaming', '• Real-time Pipelines'],
    },
    {
      label: 'MONTH 4',
      items: ['• Production Deployment', '• Virtual Internship', '• Portfolio & Job Prep'],
    },
  ];

  const stats = [
    { number: '7+', label: 'Projects' },
    { number: '290+', label: 'Hours' },
    { number: '44K+', label: 'Learners' },
    { number: '100%', label: 'Refund' },
  ];

  return (
    <div style={{
      width, height,
      background: BRAND.background,
      padding: 24 * scale,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: BRAND.fonts.body,
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <PadminiLogo />
        <YouTubeBadge />
      </div>

      {/* Headline: "Still learning with" + "DEAD TOOLS?" */}
      <div style={{ textAlign: 'center', marginBottom: 8 * scale, flexShrink: 0 }}>
        <div style={{
          fontSize: 17 * scale, fontWeight: 300, fontStyle: 'italic',
          color: 'rgba(255,255,255,0.55)', fontFamily: BRAND.fonts.body, marginBottom: 2 * scale,
        }}>
          Still learning with
        </div>
        <h1 style={{
          fontSize: 58 * scale, fontWeight: 900, fontFamily: BRAND.fonts.heading,
          lineHeight: 1.05, margin: 0, textTransform: 'uppercase' as const,
        }}>
          <span style={{ color: BRAND.colors.textWhite }}>DEAD </span>
          <span style={{ color: '#c7f464' }}>TOOLS?</span>
        </h1>
      </div>

      {/* 4 Tombstones in a row - COMPACT */}
      <div style={{ display: 'flex', gap: 12 * scale, flexShrink: 0, marginBottom: 8 * scale }}>
        {tombstones.map((tomb) => (
          <div key={tomb.name} style={{
            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            {/* Tombstone shape: rounded top */}
            <div style={{
              width: '100%',
              height: 140 * scale,
              backgroundColor: 'rgba(255,255,255,0.035)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '50% 50% 4px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8 * scale,
              padding: `${14 * scale}px ${8 * scale}px`,
              textAlign: 'center',
            }}>
              {/* Cross/dagger at the top */}
              <div style={{
                fontSize: 26 * scale, color: 'rgba(255,255,255,0.15)',
                fontFamily: 'serif', lineHeight: 1,
              }}>
                †
              </div>
              {/* Tool name */}
              <div style={{
                fontSize: 16 * scale, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
                fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
                letterSpacing: '0.03em', lineHeight: 1.3,
              }}>
                {tomb.name}
              </div>
              {/* RIP text in faint red */}
              <div style={{
                fontSize: 14 * scale, fontWeight: 700, color: 'rgba(200,100,100,0.45)',
                fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
              }}>
                {tomb.rip}
              </div>
            </div>
            {/* Ground shadow beneath tombstone */}
            <div style={{
              width: '80%', height: 6 * scale, marginTop: 2 * scale,
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 70%)',
              borderRadius: '50%',
            }} />
          </div>
        ))}
      </div>

      {/* "WHAT'S ALIVE" divider with fading green line */}
      <div style={{ position: 'relative', marginBottom: 8 * scale, marginTop: 8 * scale, flexShrink: 0, height: 20 * scale, display: 'flex', alignItems: 'center' }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, top: '50%', height: 1,
          background: 'linear-gradient(90deg, transparent 0%, #4cc378 30%, #4cc378 70%, transparent 100%)',
          opacity: 0.5,
        }} />
        <div style={{
          position: 'relative', margin: '0 auto',
          backgroundColor: BRAND.colors.bgDark,
          padding: `0 ${16 * scale}px`,
          fontSize: 15 * scale, fontWeight: 700, color: '#4cc378',
          fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
          letterSpacing: 4,
        }}>
          WHAT&apos;S ALIVE
        </div>
      </div>

      {/* Bottom section - WHAT YOU'LL ACTUALLY LEARN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 * scale, minHeight: 0 }}>

        {/* Section title */}
        <div style={{
          fontSize: 20 * scale, fontWeight: 700, color: '#4cc378',
          fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
          letterSpacing: 2, textAlign: 'center', flexShrink: 0,
        }}>
          WHAT YOU&apos;LL ACTUALLY LEARN
        </div>

        {/* 2x2 grid of month blocks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8 * scale,
          flexShrink: 0,
        }}>
          {months.map((month) => (
            <div key={month.label} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8 * scale,
              padding: 10 * scale,
            }}>
              <div style={{
                fontSize: 13 * scale, fontWeight: 700, color: '#c7f464',
                fontFamily: BRAND.fonts.heading, marginBottom: 4 * scale,
              }}>
                {month.label}
              </div>
              {month.items.map((item) => (
                <div key={item} style={{
                  fontSize: 14 * scale, fontWeight: 300, color: '#ffffff',
                  fontFamily: BRAND.fonts.body, lineHeight: 1.5,
                }}>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Stats strip */}
        <div style={{
          display: 'flex',
          gap: 0,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 8 * scale,
          flexShrink: 0,
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{
              flex: 1, textAlign: 'center', padding: `${8 * scale}px 0`,
            }}>
              <div style={{
                fontSize: 28 * scale, fontWeight: 700, color: '#c7f464',
                fontFamily: BRAND.fonts.heading, lineHeight: 1.2,
              }}>
                {stat.number}
              </div>
              <div style={{
                fontSize: 12 * scale, fontWeight: 400, color: 'rgba(255,255,255,0.55)',
                fontFamily: BRAND.fonts.body,
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap' as const, gap: 5 * scale,
          justifyContent: 'center', flexShrink: 0,
        }}>
          {techStack.map((tech) => (
            <div key={tech} style={{
              backgroundColor: 'rgba(76,195,120,0.07)',
              border: '1px solid rgba(76,195,120,0.2)',
              borderRadius: 6,
              padding: `${4 * scale}px ${10 * scale}px`,
              fontSize: 13 * scale, fontWeight: 500,
              color: '#4cc378', fontFamily: BRAND.fonts.body,
            }}>
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0 }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
