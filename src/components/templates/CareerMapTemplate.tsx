import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';

interface Milestone {
  label: string;
  color: string;
  desc: string;
}

interface CareerMapTemplateProps {
  headline?: string;
  cta?: string;
  courseName?: string;
  milestones?: Milestone[];
  width?: number;
  height?: number;
}

export function CareerMapTemplate({
  headline,
  cta = 'START YOUR JOURNEY',
  courseName = 'Data Analytics Bootcamp 1.0',
  milestones = [
    { label: 'Start Here', color: '#8892a4', desc: 'No coding background? No problem.' },
    { label: 'Month 1', color: '#4cc378', desc: 'First SQL query on real data. First Excel dashboard.' },
    { label: 'Month 2', color: '#4cc378', desc: 'Build your first Power BI dashboard. Real business data.' },
    { label: 'Month 3', color: '#4cc378', desc: 'Virtual Internship experience. Real projects.' },
    { label: 'Month 4', color: '#4cc378', desc: 'Python + Advanced Analytics. Capstone project.' },
    { label: "You're Ready", color: '#c7f464', desc: 'Portfolio website live. GitHub full. Interview-ready.' },
  ],
  width = 1080,
  height = 1080,
}: CareerMapTemplateProps) {
  const scale = Math.min(width, height) / 1080;

  const headlineNode = headline ? (
    <span>{headline}</span>
  ) : (
    <>
      YOUR JOURNEY FROM ZERO TO JOB-READY IN{' '}
      <span style={{ color: 'var(--sigma-headline-accent-color)' }}>4 MONTHS</span>
    </>
  );

  const lineLeft = 44 * scale;
  const dotSize = 14 * scale;
  const cardLeft = lineLeft + 28 * scale;

  return (
    <div style={{
      width, height,
      background: BRAND.background,
      padding: 24 * scale,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: BRAND.fonts.body,
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <PadminiLogo />
        <YouTubeBadge />
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: 10 * scale, flexShrink: 0 }}>
        <h1 style={{
          fontSize: 'var(--sigma-headline-size)', fontWeight: 900,
          color: BRAND.colors.textWhite,
          fontFamily: BRAND.fonts.heading,
          lineHeight: 1.1, textTransform: 'uppercase' as const, margin: 0,
        }}>
          {headlineNode}
        </h1>
      </div>

      {/* Timeline section */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Vertical gradient line */}
        <div style={{
          position: 'absolute',
          left: lineLeft,
          top: 6 * scale,
          bottom: 6 * scale,
          width: 3 * scale,
          background: 'linear-gradient(to bottom, #8892a4 0%, #4cc378 50%, #c7f464 100%)',
          borderRadius: 2,
        }} />

        {/* Milestones */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', height: '100%', position: 'relative',
        }}>
          {milestones.map((milestone, index) => {
            const isLast = index === milestones.length - 1;
            return (
              <div key={milestone.label} style={{
                display: 'flex', alignItems: 'center', position: 'relative',
              }}>
                {/* Dot on the line */}
                <div style={{
                  position: 'absolute',
                  left: lineLeft - (dotSize / 2) + (1.5 * scale),
                  width: dotSize, height: dotSize, borderRadius: '50%',
                  backgroundColor: milestone.color,
                  boxShadow: isLast ? `0 0 14px ${milestone.color}, 0 0 28px ${milestone.color}` : 'none',
                  flexShrink: 0, zIndex: 2,
                  border: isLast ? '2px solid rgba(255,255,255,0.3)' : 'none',
                }} />

                {/* Content card */}
                <div style={{
                  marginLeft: cardLeft,
                  backgroundColor: isLast ? 'rgba(199,244,100,0.06)' : 'rgba(255,255,255,0.03)',
                  border: isLast ? '1px solid rgba(199,244,100,0.15)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 8, padding: `${10 * scale}px ${14 * scale}px`,
                  flex: 1, marginRight: 8 * scale,
                }}>
                  <div style={{
                    fontSize: 'var(--sigma-card-title-size)', fontWeight: 700, color: milestone.color,
                    fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
                    letterSpacing: '0.04em', marginBottom: 3 * scale,
                    display: 'flex', alignItems: 'center', gap: 6 * scale,
                  }}>
                    {milestone.label}
                    {isLast && <span style={{ fontSize: 18 * scale }}>&#10003;</span>}
                  </div>
                  <div style={{
                    fontSize: 'var(--sigma-body-size)', color: 'rgba(255,255,255,0.6)',
                    fontFamily: BRAND.fonts.body, fontWeight: 300, lineHeight: 1.4,
                  }}>
                    {milestone.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
