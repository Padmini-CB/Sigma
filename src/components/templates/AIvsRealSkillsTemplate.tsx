import { BRAND } from '@/styles/brand-constants';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface AIvsRealSkillsTemplateProps {
  headline?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  aiSkills?: string[];
  realSkills?: string[];
  width?: number;
  height?: number;
}

export function AIvsRealSkillsTemplate({
  headline = "AI-GENERATED SKILLS vs SKILLS YOU'LL ACTUALLY BUILD",
  cta = 'BUILD REAL SKILLS',
  courseName = 'Data Engineering Bootcamp 1.0',
  techStack = ['SQL', 'Python', 'Spark', 'Databricks', 'AWS', 'Snowflake'],
  aiSkills = [
    'Proficient in Python',
    'Experience with databases',
    'Knowledge of cloud',
    'Team player',
    'Self-motivated learner',
  ],
  realSkills = [
    'Built ETL pipeline processing 100GB data',
    'Deployed real-time Kafka streaming',
    'Designed Snowflake data warehouse',
    '7 production projects on GitHub',
    'Virtual internship at AtliQ Technologies',
  ],
  width = 1080,
  height = 1080,
}: AIvsRealSkillsTemplateProps) {
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

      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: 10 * scale, flexShrink: 0 }}>
        <h1
          style={{
            fontSize: 48 * scale,
            fontWeight: 900,
            color: BRAND.colors.textWhite,
            fontFamily: BRAND.fonts.heading,
            lineHeight: 1.1,
          }}
        >
          {headline}
        </h1>
      </div>

      {/* Two Column Comparison */}
      <div style={{ flex: 1, display: 'flex', gap: 16 * scale, overflow: 'hidden' }}>
        {/* Left Column - AI Generated (Red) */}
        <div
          style={{
            flex: 1,
            backgroundColor: BRAND.colors.bgCard,
            border: `2px solid ${BRAND.colors.redWarning}`,
            borderRadius: 12,
            padding: 24 * scale,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 18 * scale,
              fontWeight: 800,
              color: BRAND.colors.redWarning,
              fontFamily: BRAND.fonts.heading,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              textAlign: 'center',
              paddingBottom: 10,
              borderBottom: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            AI-GENERATED SKILLS
          </div>
          {aiSkills.map((skill) => (
            <div
              key={skill}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 16 * scale,
                color: BRAND.colors.textMuted,
                fontFamily: BRAND.fonts.body,
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: BRAND.colors.redWarning, flexShrink: 0 }}>&#10007;</span>
              <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>{skill}</span>
            </div>
          ))}
        </div>

        {/* Right Column - Real Skills (Green) */}
        <div
          style={{
            flex: 1,
            backgroundColor: BRAND.colors.bgCard,
            border: `2px solid ${BRAND.colors.greenGrid}`,
            borderRadius: 12,
            padding: 24 * scale,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 18 * scale,
              fontWeight: 800,
              color: BRAND.colors.greenGrid,
              fontFamily: BRAND.fonts.heading,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              textAlign: 'center',
              paddingBottom: 10,
              borderBottom: '1px solid rgba(34,197,94,0.3)',
            }}
          >
            SKILLS YOU&apos;LL ACTUALLY BUILD
          </div>
          {realSkills.map((skill) => (
            <div
              key={skill}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                fontSize: 16 * scale,
                color: BRAND.colors.textWhite,
                fontFamily: BRAND.fonts.body,
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: BRAND.colors.greenGrid, flexShrink: 0 }}>&#10003;</span>
              <span>{skill}</span>
            </div>
          ))}

          {/* Tech Stack on the real skills side */}
          <div style={{ marginTop: 'auto', paddingTop: 10 }}>
            <TechStackPills technologies={techStack} pillSize="sm" />
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
