import { BRAND } from '@/styles/brand-constants';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

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
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const headlineBlock = (
    <h1
      style={{
        fontSize: 'var(--sigma-headline-size)',
        fontWeight: 900,
        color: 'var(--sigma-headline-color)',
        fontFamily: BRAND.fonts.heading,
        lineHeight: 1.1,
        margin: 0,
      }}
    >
      {headline}
    </h1>
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

  const aiSkillsBox = (padding: number, gap: number) => (
    <div
      style={{
        flex: 1,
        backgroundColor: BRAND.colors.bgCard,
        border: `2px solid ${BRAND.colors.redWarning}`,
        borderRadius: 12,
        padding,
        display: 'flex',
        flexDirection: 'column',
        gap,
      }}
    >
      <div
        style={{
          fontSize: 'var(--sigma-card-title-size)',
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
            fontSize: 'var(--sigma-body-size)',
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
  );

  const realSkillsBox = (padding: number, gap: number) => (
    <div
      style={{
        flex: 1,
        backgroundColor: BRAND.colors.bgCard,
        border: `2px solid ${BRAND.colors.greenGrid}`,
        borderRadius: 12,
        padding,
        display: 'flex',
        flexDirection: 'column',
        gap,
      }}
    >
      <div
        style={{
          fontSize: 'var(--sigma-card-title-size)',
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
            fontSize: 'var(--sigma-body-size)',
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
  );

  // ---- YouTube Thumb: Headline only, no comparison boxes, no bottom bar ----
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

  // ---- Landscape: Two columns compact ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        {/* Headline */}
        <div style={{ textAlign: 'center', marginBottom: 6 * scale, flexShrink: 0 }}>
          {headlineBlock}
        </div>
        {/* Two Column Comparison - compact */}
        <div style={{ flex: 1, display: 'flex', gap: 10 * scale, overflow: 'hidden' }}>
          {aiSkillsBox(16 * scale, 8)}
          {realSkillsBox(16 * scale, 8)}
        </div>
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: Headline centered, comparison boxes stacked vertically ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}
        {/* Headline centered */}
        <div style={{ flexShrink: 0, textAlign: 'center', padding: `${12 * scale}px 0` }}>
          {headlineBlock}
        </div>
        {/* Comparison boxes stacked vertically */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 * scale, overflow: 'hidden' }}>
          {aiSkillsBox(24 * scale, 12)}
          {realSkillsBox(24 * scale, 12)}
        </div>
        {/* Bottom bar */}
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait: Original side-by-side layout ----
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

      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: 10 * scale, flexShrink: 0 }}>
        {headlineBlock}
      </div>

      {/* Two Column Comparison */}
      <div style={{ flex: 1, display: 'flex', gap: (isPortrait ? 16 : 12) * scale, overflow: 'hidden' }}>
        {aiSkillsBox(24 * scale, 12)}
        {realSkillsBox(24 * scale, 12)}
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
