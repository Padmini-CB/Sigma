import { BRAND } from '@/styles/brand-constants';
import { getAdSizeConfig } from '@/config/adSizes';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { BottomBar } from '@/components/visual-elements/BottomBar';

interface ToolShowcaseTemplateProps {
  headline?: string;
  accentWord?: string;
  techStack?: string[];
  cta?: string;
  courseName?: string;
  width?: number;
  height?: number;
}

const TOOL_ICON_MAP: Record<string, string> = {
  'SQL': 'sql', 'Python': 'python', 'Spark': 'spark', 'Databricks': 'databricks',
  'AWS': 'aws', 'Snowflake': 'snowflake', 'Airflow': 'airflow', 'Kafka': 'kafka',
  'Power BI': 'powerbi', 'Excel': 'excel', 'TensorFlow': 'tensorflow', 'Docker': 'docker',
  'Azure': 'azure', 'Lambda': 'lambda', 'PostgreSQL': 'postgresql', 'MongoDB': 'mongodb',
  'Tableau': 'tableau', 'Jupyter': 'jupyter', 'Git': 'git', 'Linux': 'linux',
};

function renderHeadline(text: string, accent: string) {
  if (!accent || !text.includes(accent)) {
    return <span>{text}</span>;
  }
  const idx = text.indexOf(accent);
  return (
    <>
      {text.slice(0, idx) && <span>{text.slice(0, idx)}</span>}
      <span style={{ color: '#D7EF3F' }}>{accent}</span>
      {text.slice(idx + accent.length) && <span>{text.slice(idx + accent.length)}</span>}
    </>
  );
}

export function ToolShowcaseTemplate({
  headline = 'MASTER THESE TOOLS',
  accentWord = 'MASTER',
  techStack = ['SQL', 'Python', 'Spark', 'Databricks', 'AWS', 'Snowflake', 'Airflow', 'Kafka'],
  cta = 'BUILD REAL SKILLS',
  courseName = 'Data Engineering Bootcamp 1.0',
  width = 1080,
  height = 1080,
}: ToolShowcaseTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const wrapperBase: React.CSSProperties = {
    width,
    height,
    background: BRAND.background,
    fontFamily: BRAND.fonts.body,
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const topBar = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
      <PadminiLogo />
      <YouTubeBadge layoutMode={layoutMode} />
    </div>
  );

  const headlineBlock = (
    <h1 style={{
      fontSize: 'var(--sigma-headline-size)',
      fontWeight: 900,
      fontFamily: BRAND.fonts.heading,
      lineHeight: 1.05,
      margin: 0,
      textTransform: 'uppercase' as const,
      color: BRAND.colors.textWhite,
    }}>
      {renderHeadline(headline, accentWord)}
    </h1>
  );

  const renderToolIcon = (tool: string) => {
    const iconId = TOOL_ICON_MAP[tool] || tool.toLowerCase();
    return (
      <div
        key={tool}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: 100 * scale,
          height: 100 * scale,
          background: 'rgba(255,255,255,0.04)',
          borderRadius: 12,
          gap: 6 * scale,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/assets/icons/tools/${iconId}.svg`}
          alt={tool}
          width={50 * scale}
          height={50 * scale}
        />
        <span style={{
          fontSize: 'var(--sigma-label-size)',
          color: '#3B82F6',
          fontFamily: BRAND.fonts.body,
          fontWeight: 500,
          lineHeight: 1.2,
        }}>
          {tool}
        </span>
      </div>
    );
  };

  const toolGrid4x2 = (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, auto)',
      gridTemplateRows: 'repeat(2, auto)',
      gap: 12 * scale,
      justifyContent: 'center',
      alignContent: 'center',
    }}>
      {techStack.slice(0, 8).map(renderToolIcon)}
    </div>
  );

  const toolGrid4x1 = (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, auto)',
      gap: 12 * scale,
      justifyContent: 'center',
      alignContent: 'center',
    }}>
      {techStack.slice(0, 4).map(renderToolIcon)}
    </div>
  );

  const photoPlaceholder = (
    <div style={{
      width: '25%',
      border: '2px dashed rgba(255,255,255,0.1)',
      borderRadius: 12 * scale,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'stretch',
    }}>
      <span style={{
        fontSize: 'var(--sigma-label-size)',
        color: 'rgba(255,255,255,0.15)',
        fontFamily: BRAND.fonts.body,
        fontWeight: 400,
        textAlign: 'center',
      }}>
        Founder Photo
      </span>
    </div>
  );

  // ---- YouTube Thumb: Just headline + 4x1 row of tool icons, centered. No BottomBar, no photo. ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {topBar}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24 * scale,
        }}>
          <div style={{ textAlign: 'center' }}>
            {headlineBlock}
          </div>
          {toolGrid4x1}
        </div>
      </div>
    );
  }

  // ---- Landscape: headline on left (40%), tool grid 4x1 on right (60%), BottomBar below ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 16 * scale, overflow: 'hidden', alignItems: 'center' }}>
          {/* Headline left 40% */}
          <div style={{
            flex: '0 0 40%',
            display: 'flex',
            alignItems: 'center',
          }}>
            {headlineBlock}
          </div>
          {/* Tool grid right 60% */}
          <div style={{
            flex: '0 0 60%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {toolGrid4x1}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: topBar, headline, then full 4x2 tool grid in center, photo placeholder area, BottomBar ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}
        {/* Headline */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          {headlineBlock}
        </div>
        {/* Tool grid center */}
        <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {toolGrid4x2}
        </div>
        {/* Photo placeholder area */}
        <div style={{
          flex: 1,
          border: '2px dashed rgba(255,255,255,0.1)',
          borderRadius: 12 * scale,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: 'var(--sigma-label-size)',
            color: 'rgba(255,255,255,0.15)',
            fontFamily: BRAND.fonts.body,
            fontWeight: 400,
          }}>
            Founder Photo
          </span>
        </div>
        {/* Bottom Bar */}
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Portrait: Like square but bigger tool grid (4x2) with more breathing room ----
  if (layoutMode === 'portrait') {
    return (
      <div style={{
        ...wrapperBase,
        padding: 24 * scale,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Top bar */}
        <div style={{ marginBottom: 6 * scale }}>
          {topBar}
        </div>
        {/* Headline */}
        <div style={{ marginBottom: 16 * scale, flexShrink: 0 }}>
          {headlineBlock}
        </div>
        {/* Tool grid with more breathing room */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16 * scale,
        }}>
          {toolGrid4x2}
        </div>
        {/* Photo placeholder + BottomBar */}
        <div style={{ display: 'flex', gap: 12 * scale, flexShrink: 0, marginBottom: 8 * scale }}>
          {photoPlaceholder}
          <div style={{ flex: 1 }} />
        </div>
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square (1080x1080): Default layout ----
  return (
    <div style={{
      ...wrapperBase,
      padding: 24 * scale,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* TOP (40%): topBar + headline */}
      <div style={{ flex: '0 0 40%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 6 * scale }}>
          {topBar}
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          {headlineBlock}
        </div>
      </div>

      {/* MIDDLE (40%): Grid of tool icons */}
      <div style={{
        flex: '0 0 40%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {toolGrid4x2}
      </div>

      {/* BOTTOM LEFT: Placeholder area for founder photo */}
      <div style={{ display: 'flex', gap: 12 * scale, flexShrink: 0, marginBottom: 8 * scale }}>
        {photoPlaceholder}
        <div style={{ flex: 1 }} />
      </div>

      {/* BOTTOM BAR */}
      <div style={{ flexShrink: 0 }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
