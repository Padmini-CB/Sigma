import { BRAND } from '@/styles/brand-constants';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface SocialAnnouncementTemplateProps {
  headline?: string;
  subheadline?: string;
  bodyText?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  credibility?: string;
  width?: number;
  height?: number;
}

export function SocialAnnouncementTemplate({
  headline = 'NEW BATCH STARTING SOON',
  subheadline = 'Join 44K+ learners building real-world data skills',
  bodyText = '10 Weeks \u2022 7 Projects \u2022 2 Virtual Internships \u2022 Discord Community',
  cta = 'RESERVE YOUR SPOT',
  courseName = 'Data Engineering Bootcamp 1.0',
  techStack = ['SQL', 'Python', 'Spark', 'Databricks', 'AWS', 'Snowflake'],
  credibility = 'Lifetime Access \u2022 Job Assistance',
  width = 1080,
  height = 1080,
}: SocialAnnouncementTemplateProps) {
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
      {/* Decorative accent lines */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${BRAND.colors.primaryBlue}, #4cc378)`,
        }}
      />

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <CodebasicsLogo />
        <YouTubeBadge />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16 * scale }}>
        {/* Big headline */}
        <h1
          style={{
            fontSize: 60 * scale,
            fontWeight: 800,
            color: BRAND.colors.textWhite,
            fontFamily: BRAND.fonts.heading,
            lineHeight: 1.0,
            textAlign: 'center',
            margin: 0,
          }}
        >
          {headline}
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: 22 * scale,
            color: BRAND.colors.textMuted,
            fontFamily: BRAND.fonts.body,
            textAlign: 'center',
            margin: 0,
            maxWidth: '80%',
          }}
        >
          {subheadline}
        </p>

        {/* Divider */}
        <div
          style={{
            width: 60,
            height: 3,
            borderRadius: 2,
            backgroundColor: '#4cc378',
          }}
        />

        {/* Body text */}
        <p
          style={{
            fontSize: 16 * scale,
            color: BRAND.colors.textMuted,
            fontFamily: BRAND.fonts.body,
            textAlign: 'center',
            margin: 0,
          }}
        >
          {bodyText}
        </p>

        {/* Tech Stack */}
        <TechStackPills technologies={techStack} pillSize="md" />

        {/* Credibility */}
        <div
          style={{
            fontSize: 14 * scale,
            color: '#4cc378',
            fontFamily: BRAND.fonts.body,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {credibility}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
