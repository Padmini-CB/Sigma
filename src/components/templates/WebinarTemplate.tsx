import { BRAND } from '@/styles/brand-constants';
import { StatCounterGrid } from '@/components/visual-elements/StatCounterGrid';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface WebinarTemplateProps {
  headline?: string;
  subheadline?: string;
  bodyText?: string;
  cta?: string;
  courseName?: string;
  stats?: Array<{ number: string; label: string }>;
  width?: number;
  height?: number;
}

export function WebinarTemplate({
  headline = 'LIVE PROBLEM-SOLVING SESSION',
  subheadline = 'Join Dhaval & Hemanand for bi-weekly mentorship',
  bodyText = 'Real business problems \u2022 Production-grade solutions \u2022 Q&A with experts',
  cta = 'REGISTER NOW',
  courseName = 'Codebasics Live',
  stats = [
    { number: '17+', label: 'Years Experience' },
    { number: '1.4M+', label: 'Subscribers' },
    { number: '24', label: 'Sessions / Year' },
  ],
  width = 1080,
  height = 1080,
}: WebinarTemplateProps) {
  const scale = Math.min(width, height) / 1080;

  return (
    <div
      style={{
        width,
        height,
        background: `linear-gradient(145deg, ${BRAND.colors.bgDark} 0%, #0d1a30 50%, #0a0e1a 100%)`,
        padding: 40 * scale,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: BRAND.fonts.body,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Decorative gradient circle */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 500 * scale,
          height: 500 * scale,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(67,97,238,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 20 * scale, zIndex: 1 }}>
        <CodebasicsLogo />
        <YouTubeBadge />
      </div>

      {/* Event badge */}
      <div style={{ textAlign: 'center', flexShrink: 0, zIndex: 1 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(67,97,238,0.2)',
            border: `1px solid rgba(67,97,238,0.4)`,
            borderRadius: 20,
            padding: '4px 14px',
            fontSize: 11 * scale,
            fontWeight: 600,
            color: BRAND.colors.primaryBlue,
            fontFamily: BRAND.fonts.body,
            textTransform: 'uppercase' as const,
            letterSpacing: '0.08em',
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#ef4444', display: 'inline-block' }} />
          LIVE EVENT
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 24 * scale, zIndex: 1 }}>
        {/* Headline */}
        <h1
          style={{
            fontSize: 40 * scale,
            fontWeight: 800,
            color: BRAND.colors.textWhite,
            fontFamily: BRAND.fonts.heading,
            lineHeight: 1.05,
            textAlign: 'center',
            margin: 0,
          }}
        >
          {headline}
        </h1>
        <p
          style={{
            fontSize: 15 * scale,
            color: BRAND.colors.textMuted,
            fontFamily: BRAND.fonts.body,
            textAlign: 'center',
            margin: 0,
          }}
        >
          {subheadline}
        </p>

        {/* Founders */}
        <div style={{ display: 'flex', gap: 32 * scale, justifyContent: 'center', alignItems: 'center' }}>
          {[
            { name: 'Dhaval Patel', role: 'Founder & CEO', img: '/assets/founders/Dhaval.png', border: BRAND.colors.primaryBlue },
            { name: 'Hemanand Vadivel', role: 'Co-Founder & CTO', img: '/assets/founders/Hemanand.png', border: BRAND.colors.accentGreen },
          ].map((founder) => (
            <div key={founder.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div
                style={{
                  width: 110 * scale,
                  height: 110 * scale,
                  borderRadius: '50%',
                  border: `3px solid ${founder.border}`,
                  overflow: 'hidden',
                  backgroundColor: BRAND.colors.bgCard,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={founder.img}
                  alt={founder.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12 * scale, fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading }}>
                  {founder.name}
                </div>
                <div style={{ fontSize: 9 * scale, color: BRAND.colors.textMuted }}>
                  {founder.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Event details */}
        <p
          style={{
            fontSize: 12 * scale,
            color: BRAND.colors.textMuted,
            fontFamily: BRAND.fonts.body,
            textAlign: 'center',
          }}
        >
          {bodyText}
        </p>

        {/* Stats */}
        <div style={{ width: '70%' }}>
          <StatCounterGrid stats={stats} columns={3} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 16 * scale, zIndex: 1 }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
