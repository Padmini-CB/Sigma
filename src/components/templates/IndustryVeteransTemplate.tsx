import { BRAND } from '@/styles/brand-constants';
import { StatCounterGrid } from '@/components/visual-elements/StatCounterGrid';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface IndustryVeteransTemplateProps {
  headline?: string;
  subheadline?: string;
  cta?: string;
  courseName?: string;
  stats?: Array<{ number: string; label: string }>;
  width?: number;
  height?: number;
}

export function IndustryVeteransTemplate({
  headline = 'LEARN FROM INDUSTRY VETERANS',
  subheadline = 'Real-world experience. Not theoretical fluff.',
  cta = 'MEET YOUR MENTORS',
  courseName = 'Codebasics',
  stats = [
    { number: '17+', label: 'Years Experience' },
    { number: '1M+', label: 'Subscribers' },
    { number: '44K+', label: 'Learners' },
  ],
  width = 1080,
  height = 1080,
}: IndustryVeteransTemplateProps) {
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
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <CodebasicsLogo />
        <YouTubeBadge />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 14 * scale }}>
        {/* Headline */}
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 56 * scale,
              fontWeight: 800,
              color: BRAND.colors.textWhite,
              fontFamily: BRAND.fonts.heading,
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            {headline}
          </h1>
          <p
            style={{
              fontSize: 22 * scale,
              color: BRAND.colors.textMuted,
              fontFamily: BRAND.fonts.body,
              marginTop: 8,
            }}
          >
            {subheadline}
          </p>
        </div>

        {/* Founders Display */}
        <div style={{ display: 'flex', gap: 40 * scale, justifyContent: 'center', alignItems: 'center' }}>
          {/* Dhaval */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 180 * scale,
                height: 180 * scale,
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.3)',
                overflow: 'hidden',
                backgroundColor: BRAND.colors.bgCard,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/founders/Dhaval.png"
                alt="Dhaval Patel"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20 * scale, fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading }}>
                Dhaval Patel
              </div>
              <div style={{ fontSize: 15 * scale, color: BRAND.colors.textMuted, fontFamily: BRAND.fonts.body }}>
                Founder & CEO
              </div>
            </div>
          </div>

          {/* Hemanand */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 180 * scale,
                height: 180 * scale,
                borderRadius: '50%',
                border: '3px solid rgba(255,255,255,0.3)',
                overflow: 'hidden',
                backgroundColor: BRAND.colors.bgCard,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/founders/Hemanand.png"
                alt="Hemanand Vadivel"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20 * scale, fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading }}>
                Hemanand Vadivel
              </div>
              <div style={{ fontSize: 15 * scale, color: BRAND.colors.textMuted, fontFamily: BRAND.fonts.body }}>
                Co-Founder & CTO
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ width: '80%' }}>
          <StatCounterGrid stats={stats} columns={3} />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
