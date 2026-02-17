import { BRAND } from '@/styles/brand-constants';
import { ChatMockup } from '@/components/visual-elements/ChatMockup';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';

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
      {/* Top bar: Logo + YouTube */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <PadminiLogo />
        <YouTubeBadge />
      </div>

      {/* Main content: Chat left, Headline right */}
      <div style={{ flex: 1, display: 'flex', gap: 12 * scale, overflow: 'hidden' }}>
        {/* Left - Chat Mockup (42%) */}
        <div style={{ width: '42%', flexShrink: 0 }}>
          <ChatMockup messages={DEFAULT_MESSAGES} />
        </div>

        {/* Right - Headline + Tech Stack (58%) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 * scale }}>
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
                fontSize: 'var(--sigma-headline-size)',
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
