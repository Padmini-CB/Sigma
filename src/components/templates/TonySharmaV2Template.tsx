import { BRAND } from '@/styles/brand-constants';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getCharacterImage } from '@/data/characters';

interface TonySharmaV2TemplateProps {
  headline?: string;
  subheadline?: string;
  bodyText?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  jesterLine?: string;
  width?: number;
  height?: number;
}

export function TonySharmaV2Template({
  headline = "Certificates don't write code.",
  subheadline = 'You do.',
  bodyText = "Tony bought a certificate. You're building a career.",
  cta = 'LEARN THE FUNDAMENTALS',
  courseName = 'Data Analytics Bootcamp 5.0',
  techStack = ['Excel', 'Power BI', 'SQL', 'Python', 'PowerPoint'],
  jesterLine = "Tony's certificate is collecting dust. Your portfolio won't.",
  width = 1080,
  height = 1080,
}: TonySharmaV2TemplateProps) {
  const scale = Math.min(width, height) / 1080;
  const maxCharHeight = height * 0.35;

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale, zIndex: 3 }}>
        <PadminiLogo />
        <YouTubeBadge />
      </div>

      {/* Main content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 * scale, zIndex: 2 }}>
        {/* Headline */}
        <div style={{ textAlign: 'right', paddingLeft: '35%' }}>
          <h1
            style={{
              fontSize: 64 * scale,
              fontWeight: 800,
              color: BRAND.colors.textWhite,
              fontFamily: BRAND.fonts.heading,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            {headline}
          </h1>
          <h2
            style={{
              fontSize: 64 * scale,
              fontWeight: 800,
              color: BRAND.colors.accentGreen,
              fontFamily: BRAND.fonts.heading,
              lineHeight: 1.05,
              margin: 0,
              marginTop: 4,
            }}
          >
            {subheadline}
          </h2>
        </div>

        {/* Hook / Body Text */}
        <div style={{ textAlign: 'right', paddingLeft: '35%' }}>
          <p
            style={{
              fontSize: 24 * scale,
              color: BRAND.colors.textMuted,
              fontFamily: BRAND.fonts.body,
              margin: 0,
            }}
          >
            {bodyText}
          </p>
        </div>

        {/* Jester line */}
        {jesterLine && (
          <div style={{ textAlign: 'right', paddingLeft: '35%' }}>
            <p
              style={{
                fontSize: 17 * scale,
                color: 'rgba(255,255,255,0.45)',
                fontFamily: BRAND.fonts.body,
                fontStyle: 'italic',
                margin: 0,
              }}
            >
              {jesterLine}
            </p>
          </div>
        )}

        {/* Tech Stack Pills */}
        <div style={{ paddingLeft: '35%' }}>
          <TechStackPills technologies={techStack} pillSize="sm" />
        </div>
      </div>

      {/* Tony Character - bottom left, above bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 100 * scale,
          left: 20 * scale,
          height: maxCharHeight,
          zIndex: 2,
          overflow: 'hidden',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={getCharacterImage('tony', 'presenting')}
          alt="Tony Sharma"
          style={{
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom',
            opacity: 0.9,
          }}
        />
      </div>

      {/* Bottom Bar - highest z-index */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale, zIndex: 50 }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
