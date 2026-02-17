import { BRAND } from '@/styles/brand-constants';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getCharacterImage } from '@/data/characters';
import { getAdSizeConfig } from '@/config/adSizes';

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
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;
  const maxCharHeight = height * 0.35;

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

  // ---- YouTube Thumb: Bold headline only, no character, no bottom bar ----
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

  // ---- Landscape: Compact layout, adjusted character position ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>

        {/* Main content area */}
        <div style={{ flex: 1, display: 'flex', gap: 12 * scale, overflow: 'hidden' }}>
          {/* Left: Tony character (30%) */}
          <div style={{ width: '30%', flexShrink: 0, position: 'relative' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getCharacterImage('tony', 'presenting')}
              alt="Tony Sharma"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'bottom',
                opacity: 0.9,
              }}
            />
          </div>

          {/* Right: headline + body + pills (70%) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 * scale }}>
            {headlineBlock}
            <p
              style={{
                fontSize: 'var(--sigma-body-size)',
                color: 'var(--sigma-body-color)',
                fontFamily: BRAND.fonts.body,
                margin: 0,
              }}
            >
              {bodyText}
            </p>
            <TechStackPills technologies={techStack.slice(0, 4)} pillSize="sm" />
          </div>
        </div>

        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: Vertical stack with generous spacing, more room for character ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}

        {/* Headline centered */}
        <div style={{ flexShrink: 0, textAlign: 'center', padding: `${12 * scale}px 0` }}>
          {headlineBlock}
        </div>

        {/* Body text */}
        <div style={{ flexShrink: 0, textAlign: 'center' }}>
          <p
            style={{
              fontSize: 'var(--sigma-body-size)',
              color: 'var(--sigma-body-color)',
              fontFamily: BRAND.fonts.body,
              margin: 0,
            }}
          >
            {bodyText}
          </p>
        </div>

        {/* Jester line */}
        {jesterLine && (
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <p
              style={{
                fontSize: 'var(--sigma-label-size)',
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

        {/* Tony Character - fills available vertical space */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', overflow: 'hidden', minHeight: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getCharacterImage('tony', 'presenting')}
            alt="Tony Sharma"
            style={{
              maxHeight: '100%',
              objectFit: 'contain',
              objectPosition: 'bottom',
              opacity: 0.9,
            }}
          />
        </div>

        {/* Tech stack pills */}
        <div style={{ flexShrink: 0 }}>
          <TechStackPills technologies={techStack} pillSize="sm" />
        </div>

        {/* Bottom bar */}
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait (default): Original layout ----
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

        {/* Hook / Body Text */}
        <div style={{ textAlign: 'right', paddingLeft: '35%' }}>
          <p
            style={{
              fontSize: 'var(--sigma-body-size)',
              color: 'var(--sigma-body-color)',
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
                fontSize: 'var(--sigma-label-size)',
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
