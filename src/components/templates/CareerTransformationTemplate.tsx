import { BRAND } from '@/styles/brand-constants';
import { StatCounterGrid } from '@/components/visual-elements/StatCounterGrid';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface CareerTransformationTemplateProps {
  headline?: string;
  subheadline?: string;
  bodyText?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  stats?: Array<{ number: string; label: string }>;
  beforeRole?: string;
  afterRole?: string;
  width?: number;
  height?: number;
}

export function CareerTransformationTemplate({
  headline = "Non-Tech to Data Analyst. It's Possible.",
  subheadline = 'Join learners who made the switch at 40+.',
  cta = 'TRANSFORM YOUR CAREER',
  courseName = 'Data Analytics Bootcamp 5.0',
  techStack = ['Excel', 'Power BI', 'SQL', 'Python'],
  stats = [
    { number: '300+', label: 'Career Switches' },
    { number: '44K+', label: 'Learners' },
    { number: '4.9', label: 'Rating' },
  ],
  beforeRole = 'Mechanical Engineer',
  afterRole = 'Data Analyst at TCS',
  width = 1080,
  height = 1080,
}: CareerTransformationTemplateProps) {
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
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 * scale }}>
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

        {/* Before -> After transformation visual */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 * scale }}>
          {/* Before */}
          <div
            style={{
              backgroundColor: BRAND.colors.bgCard,
              border: `2px solid ${BRAND.colors.redWarning}`,
              borderRadius: 12,
              padding: '20px 32px',
              textAlign: 'center',
              minWidth: 240 * scale,
            }}
          >
            <div style={{ fontSize: 13 * scale, fontWeight: 700, color: BRAND.colors.redWarning, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>
              BEFORE
            </div>
            <div style={{ fontSize: 24 * scale, fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading }}>
              {beforeRole}
            </div>
            <div style={{ fontSize: 13 * scale, color: BRAND.colors.textMuted, marginTop: 4 }}>4 year career gap</div>
          </div>

          {/* Arrow */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width={80 * scale} height={32 * scale} viewBox="0 0 80 32" fill="none">
              <path d="M0 16H70M70 16L58 6M70 16L58 26" stroke={'#4cc378'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* After */}
          <div
            style={{
              backgroundColor: BRAND.colors.bgCard,
              border: `2px solid ${BRAND.colors.greenGrid}`,
              borderRadius: 12,
              padding: '20px 32px',
              textAlign: 'center',
              minWidth: 240 * scale,
            }}
          >
            <div style={{ fontSize: 13 * scale, fontWeight: 700, color: BRAND.colors.greenGrid, letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>
              AFTER
            </div>
            <div style={{ fontSize: 24 * scale, fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading }}>
              {afterRole}
            </div>
            <div style={{ fontSize: 13 * scale, color: '#4cc378', marginTop: 4 }}>In 4 months</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ width: '90%', margin: '0 auto' }}>
          <StatCounterGrid stats={stats} columns={3} />
        </div>

        {/* Tech Stack */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TechStackPills technologies={techStack} pillSize="sm" />
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
