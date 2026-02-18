import { BRAND } from '@/styles/brand-constants';
import { getAdSizeConfig } from '@/config/adSizes';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { BottomBar } from '@/components/visual-elements/BottomBar';

interface HeroStatementTemplateProps {
  headline?: string;
  accentWord?: string;
  cta?: string;
  courseName?: string;
  width?: number;
  height?: number;
}

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

export function HeroStatementTemplate({
  headline = 'STOP LEARNING DEAD TOOLS.',
  accentWord = 'DEAD TOOLS.',
  cta = 'BUILD REAL SKILLS',
  courseName = 'Data Engineering Bootcamp 1.0',
  width = 1080,
  height = 1080,
}: HeroStatementTemplateProps) {
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

  const photoPlaceholder = (
    <div style={{
      width: '100%',
      height: '100%',
      border: '2px dotted rgba(255,255,255,0.1)',
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
        Founder Expression Photo
      </span>
    </div>
  );

  // ---- YouTube Thumb: Bold headline centered, no BottomBar, no photo area ----
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

  // ---- Landscape: Compact. topBar, headline on left (60%), photo area on right (40%), slim BottomBar ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ flex: 1, display: 'flex', gap: 16 * scale, overflow: 'hidden' }}>
          {/* Headline left 60% */}
          <div style={{
            flex: '0 0 60%',
            display: 'flex',
            alignItems: 'center',
          }}>
            {headlineBlock}
          </div>
          {/* Photo area right 40% */}
          <div style={{ flex: '0 0 40%' }}>
            {photoPlaceholder}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: topBar at top, headline in upper portion (45%), photo area below (40%), BottomBar at bottom ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}
        {/* Headline upper portion 45% */}
        <div style={{
          flex: '0 0 45%',
          display: 'flex',
          alignItems: 'center',
        }}>
          {headlineBlock}
        </div>
        {/* Photo area 40% */}
        <div style={{ flex: '0 0 40%' }}>
          {photoPlaceholder}
        </div>
        {/* Bottom bar */}
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Portrait: Similar to square but more vertical space for photo area ----
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
        {/* Content: headline left + photo right */}
        <div style={{ flex: 1, display: 'flex', gap: 16 * scale, overflow: 'hidden' }}>
          {/* Headline left 55% */}
          <div style={{
            flex: '0 0 55%',
            display: 'flex',
            alignItems: 'flex-start',
            paddingTop: 20 * scale,
          }}>
            {headlineBlock}
          </div>
          {/* Photo area right 45% — more vertical space */}
          <div style={{ flex: 1 }}>
            {photoPlaceholder}
          </div>
        </div>
        {/* Bottom Bar */}
        <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
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
      {/* Top bar */}
      <div style={{ marginBottom: 6 * scale }}>
        {topBar}
      </div>
      {/* Content: headline left 55% + photo placeholder right 45% */}
      <div style={{ flex: 1, display: 'flex', gap: 16 * scale, overflow: 'hidden' }}>
        {/* LEFT SIDE: Massive headline 55% */}
        <div style={{
          flex: '0 0 55%',
          display: 'flex',
          alignItems: 'center',
        }}>
          {headlineBlock}
        </div>
        {/* RIGHT SIDE: Photo placeholder 45% */}
        <div style={{ flex: 1 }}>
          {photoPlaceholder}
        </div>
      </div>
      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
