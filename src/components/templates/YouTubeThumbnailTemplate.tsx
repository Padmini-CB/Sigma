import { BRAND } from '@/styles/brand-constants';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface YouTubeThumbnailTemplateProps {
  headline?: string;
  subheadline?: string;
  cta?: string;
  courseName?: string;
  badges?: string[];
  width?: number;
  height?: number;
}

export function YouTubeThumbnailTemplate({
  headline = 'WILL AI REPLACE SOFTWARE ENGINEERS?',
  subheadline,
  cta: _cta,
  courseName: _courseName,
  badges = ['2026 Update', 'Industry Analysis', 'Career Guide'],
  width = 1280,
  height = 720,
}: YouTubeThumbnailTemplateProps) {
  const scale = Math.min(width, height) / 720;

  // Split headline: last word gets accent color, rest stays white
  const words = headline.split(' ');
  const lastWord = words[words.length - 1];
  const restWords = words.slice(0, -1).join(' ');

  return (
    <div
      style={{
        width,
        height,
        background: BRAND.background,
        padding: 28 * scale,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: BRAND.fonts.body,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Main content area - split layout */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 24 * scale,
        }}
      >
        {/* LEFT side (45%) - Founder image placeholder */}
        <div
          style={{
            width: '45%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 200 * scale,
              height: 200 * scale,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.05)',
              border: '3px solid rgba(255,255,255,0.15)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 72 * scale, lineHeight: 1 }}>
              &#x1F468;&#x200D;&#x1F4BB;
            </span>
          </div>
        </div>

        {/* RIGHT side (55%) - Headline + badges */}
        <div
          style={{
            width: '55%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 16 * scale,
          }}
        >
          {/* Headline */}
          <h1
            style={{
              fontSize: 54 * scale,
              fontWeight: 900,
              fontFamily: BRAND.fonts.heading,
              textTransform: 'uppercase',
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            <span style={{ color: BRAND.colors.textWhite }}>{restWords} </span>
            <span style={{ color: '#c7f464' }}>{lastWord}</span>
          </h1>

          {/* Subheadline */}
          {subheadline && (
            <p
              style={{
                fontSize: 20 * scale,
                fontWeight: 300,
                color: BRAND.colors.textMuted,
                fontFamily: BRAND.fonts.body,
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              {subheadline}
            </p>
          )}

          {/* Badge row */}
          {badges && badges.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 8 * scale,
                marginTop: 8 * scale,
              }}
            >
              {badges.map((badge) => (
                <div
                  key={badge}
                  style={{
                    backgroundColor: 'rgba(199,244,100,0.15)',
                    border: '1px solid rgba(199,244,100,0.3)',
                    borderRadius: 16,
                    padding: `${4 * scale}px ${12 * scale}px`,
                  }}
                >
                  <span
                    style={{
                      color: '#c7f464',
                      fontSize: 12 * scale,
                      fontWeight: 600,
                      fontFamily: BRAND.fonts.body,
                    }}
                  >
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom-right corner: CodebasicsLogo watermark */}
      <div
        style={{
          position: 'absolute',
          bottom: 16 * scale,
          right: 20 * scale,
          opacity: 0.6,
        }}
      >
        <CodebasicsLogo />
      </div>
    </div>
  );
}
