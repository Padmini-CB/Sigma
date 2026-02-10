import { BRAND } from '@/styles/brand-constants';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';

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

  const words = headline.split(' ');
  const lastWord = words[words.length - 1];
  const restWords = words.slice(0, -1).join(' ');

  return (
    <div style={{
      width, height,
      background: BRAND.background,
      padding: 28 * scale,
      display: 'flex',
      fontFamily: BRAND.fonts.body,
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* LEFT (40%) - Founder placeholder */}
      <div style={{
        width: '40%', display: 'flex',
        justifyContent: 'center', alignItems: 'center', flexShrink: 0,
      }}>
        <div style={{
          width: 220 * scale, height: 220 * scale, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(67,97,238,0.15) 0%, rgba(199,244,100,0.08) 100%)',
          border: '3px solid rgba(255,255,255,0.12)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
          <div style={{
            width: 180 * scale, height: 180 * scale, borderRadius: '50%',
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '2px solid rgba(255,255,255,0.08)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
          }}>
            <span style={{
              fontSize: 20 * scale, fontWeight: 700, color: 'rgba(255,255,255,0.2)',
              fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
              letterSpacing: '0.1em',
            }}>
              FOUNDER
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT (60%) - Text content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', gap: 14 * scale, paddingLeft: 10 * scale,
      }}>
        {/* Headline */}
        <h1 style={{
          fontSize: 64 * scale, fontWeight: 900,
          fontFamily: BRAND.fonts.heading, textTransform: 'uppercase',
          lineHeight: 1.05, margin: 0,
        }}>
          <span style={{ color: BRAND.colors.textWhite }}>{restWords} </span>
          <span style={{ color: '#c7f464' }}>{lastWord}</span>
        </h1>

        {/* Subheadline */}
        {subheadline && (
          <p style={{
            fontSize: 24 * scale, fontWeight: 300,
            color: BRAND.colors.textMuted, fontFamily: BRAND.fonts.body,
            margin: 0, lineHeight: 1.4,
          }}>
            {subheadline}
          </p>
        )}

        {/* Badge row — WHITE text, subtle card bg */}
        {badges && badges.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 * scale }}>
            {badges.map((badge) => (
              <div key={badge} style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 16, padding: `${5 * scale}px ${14 * scale}px`,
              }}>
                <span style={{
                  color: BRAND.colors.textWhite, fontSize: 15 * scale,
                  fontWeight: 600, fontFamily: BRAND.fonts.body,
                }}>
                  {badge}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom-right: CB logo watermark */}
      <div style={{
        position: 'absolute', bottom: 14 * scale, right: 18 * scale, opacity: 0.5,
      }}>
        <PadminiLogo />
      </div>
    </div>
  );
}
