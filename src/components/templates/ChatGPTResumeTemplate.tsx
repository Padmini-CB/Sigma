import { BRAND } from '@/styles/brand-constants';
import { ChatMockup } from '@/components/visual-elements/ChatMockup';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

interface ChatGPTResumeTemplateProps {
  headline?: string;
  subheadline?: string;
  bodyText?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  width?: number;
  height?: number;
}

const DEFAULT_MESSAGES = [
  { role: 'user' as const, text: 'Build me a data engineering resume' },
  { role: 'ai' as const, text: 'Here\'s a professional resume template with key skills like SQL, Python, and cloud technologies...' },
  { role: 'user' as const, text: 'Will this actually get me hired?' },
  { role: 'ai' as const, text: 'I should be transparent — these are generic suggestions. Real hiring managers look for project portfolios and hands-on experience...', isWarning: true },
];

export function ChatGPTResumeTemplate({
  headline = 'CHATGPT CAN WRITE YOUR RESUME.',
  subheadline = "IT CAN'T BUILD YOUR PORTFOLIO.",
  cta = 'BUILD REAL PROJECTS',
  courseName = 'Data Engineering Bootcamp 1.0',
  techStack = ['SQL', 'Python', 'Spark', 'Databricks', 'AWS S3', 'Lambda', 'Snowflake', 'Airflow'],
  width = 1080,
  height = 1080,
}: ChatGPTResumeTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const headlineBlock = (
    <div>
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
          fontSize: 'var(--sigma-subheadline-size)',
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
  );

  const topBar = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
      <PadminiLogo />
      <YouTubeBadge />
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

  // ---- YouTube Thumb: Bold headline only, no logo, no bottom bar, no trust signals ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 32 * scale, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '90%' }}>
          {headlineBlock}
        </div>
      </div>
    );
  }

  // ---- Landscape: Headline+pills left (55%), chat right (45%), compact bottom bar ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 16 * scale, overflow: 'hidden' }}>
          {/* Left: headline + tech stack (55%) */}
          <div style={{ width: '55%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 * scale }}>
            {headlineBlock}
            <TechStackPills technologies={techStack.slice(0, 4)} columns={2} pillSize="sm" />
          </div>
          {/* Right: compact chat (45%) */}
          <div style={{ flex: 1 }}>
            <ChatMockup messages={DEFAULT_MESSAGES.slice(0, 3)} />
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story (1080×1920): Vertical — headline ~25%, chat ~45%, pills+CTA ~30% ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column' }}>
        {topBar}

        {/* Headline area (~25%) */}
        <div style={{ flex: '0 0 auto', textAlign: 'center', padding: `${20 * scale}px 0 ${14 * scale}px` }}>
          {headlineBlock}
        </div>

        {/* Chat fills middle (~45%) */}
        <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, marginBottom: 14 * scale }}>
          <ChatMockup messages={DEFAULT_MESSAGES} />
        </div>

        {/* Tech stack pills + bottom bar (~30%) */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 * scale }}>
          <TechStackPills technologies={techStack} columns={4} />
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Portrait (1080×1350): Headline top, chat+pills fill the space, bottom bar ----
  if (layoutMode === 'portrait') {
    return (
      <div
        style={{
          ...wrapperBase,
          padding: 24 * scale,
          display: 'flex',
          flexDirection: 'column',
          gap: 10 * scale,
        }}
      >
        <div style={{ marginBottom: 2 * scale }}>
          {topBar}
        </div>

        {/* Headline */}
        <div style={{ flexShrink: 0 }}>
          {headlineBlock}
        </div>

        {/* Chat — fills most vertical space */}
        <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
          <ChatMockup messages={DEFAULT_MESSAGES} />
        </div>

        {/* Tech stack pills in 4-column grid */}
        <div style={{ flexShrink: 0 }}>
          <TechStackPills technologies={techStack} columns={4} />
        </div>

        {/* Bottom Bar */}
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square (1080×1080): Two-column — chat left (42%), headline+pills right (58%) ----
  return (
    <div
      style={{
        ...wrapperBase,
        padding: 24 * scale,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: 6 * scale }}>
        {topBar}
      </div>

      {/* Main content: Chat left, Headline right */}
      <div style={{ flex: 1, display: 'flex', gap: 12 * scale, overflow: 'hidden' }}>
        {/* Left - Chat Mockup (42%) */}
        <div style={{ width: '42%', flexShrink: 0 }}>
          <ChatMockup messages={DEFAULT_MESSAGES} />
        </div>

        {/* Right - Headline + Tech Stack (58%) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 * scale }}>
          {headlineBlock}
          <TechStackPills technologies={techStack} columns={4} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
