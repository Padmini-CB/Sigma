import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface DailyBreakdownTemplateProps {
  headline?: string;
  cta?: string;
  courseName?: string;
  price?: string;
  dailyPrice?: string;
  durationDays?: string;
  width?: number;
  height?: number;
}

export function DailyBreakdownTemplate({
  headline = '\u20B9105/DAY \u00D7 4 MONTHS = A CAREER YOU\u2019RE PROUD OF.',
  cta = 'START FOR \u20B9105/DAY',
  courseName = 'Data Engineering Bootcamp 1.0',
  price = '\u20B912,000',
  dailyPrice = '\u20B9105',
  durationDays = '120',
  width = 1080,
  height = 1080,
}: DailyBreakdownTemplateProps) {
  const scale = Math.min(width, height) / 1080;

  const comparisonItems = [
    { label: 'Coffee', gone: 'gone in 20 min' },
    { label: 'Movie Ticket', gone: 'gone in 3 hrs' },
    { label: 'Fast Food', gone: 'gone in 30 min' },
  ];

  const valueItems = [
    '7 Production Projects',
    'Virtual Internship',
    'Portfolio Website',
    'Job Assistance',
    '290+ Hours Content',
    'Lifetime Access',
  ];

  const calendarRows = 4;
  const calendarCols = 7;

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
        <CodebasicsLogo />
        <YouTubeBadge />
      </div>

      {/* Main Content: Split */}
      <div style={{ flex: 1, display: 'flex', gap: 16 * scale, overflow: 'hidden' }}>
        {/* LEFT (55%) */}
        <div style={{ width: '55%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 * scale }}>
          {/* Big daily price */}
          <div>
            <div style={{
              fontSize: 68 * scale, fontWeight: 900, color: '#c7f464',
              fontFamily: BRAND.fonts.heading, lineHeight: 1,
              textTransform: 'uppercase' as const,
            }}>
              {dailyPrice}/DAY
            </div>
            <div style={{
              fontSize: 22 * scale, fontWeight: 400, color: BRAND.colors.textWhite,
              fontFamily: BRAND.fonts.body, marginTop: 4 * scale,
            }}>
              That&apos;s all it takes.
            </div>
            <div style={{
              fontSize: 15 * scale, fontWeight: 300, color: 'rgba(255,255,255,0.55)',
              fontFamily: BRAND.fonts.body, marginTop: 2 * scale,
            }}>
              {price} &divide; 4 months = one career transformation
            </div>
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${calendarCols}, 1fr)`,
            gap: 3 * scale,
          }}>
            {Array.from({ length: calendarRows * calendarCols }).map((_, i) => (
              <div key={i} style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 4 * scale,
                padding: `${5 * scale}px ${2 * scale}px`,
                textAlign: 'center',
                fontSize: 10 * scale, color: '#c7f464',
                fontFamily: BRAND.fonts.body, fontWeight: 400, lineHeight: 1.2,
              }}>
                {dailyPrice}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT (45%) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 * scale }}>
          {/* What it buys elsewhere — red label */}
          <div style={{
            fontSize: 15 * scale, fontWeight: 700, color: '#c47070',
            fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
            letterSpacing: '0.04em',
          }}>
            What {dailyPrice} Buys Elsewhere
          </div>

          {comparisonItems.map((item) => (
            <div key={item.label} style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8 * scale,
              padding: `${8 * scale}px ${12 * scale}px`,
              display: 'flex', alignItems: 'center', gap: 10 * scale,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15 * scale, fontWeight: 400, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.body }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 12 * scale, fontWeight: 300, color: '#c47070', fontFamily: BRAND.fonts.body }}>
                  {item.gone}
                </div>
              </div>
            </div>
          ))}

          {/* Green divider */}
          <div style={{
            height: 1, backgroundColor: '#4cc378', opacity: 0.4,
            marginTop: 2 * scale, marginBottom: 2 * scale,
          }} />

          {/* What it gets you — green label */}
          <div style={{
            fontSize: 15 * scale, fontWeight: 700, color: '#4cc378',
            fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
            letterSpacing: '0.04em',
          }}>
            What {dailyPrice}/Day Gets You Here
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 * scale }}>
            {valueItems.map((item) => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: 8 * scale,
                fontSize: 14 * scale, fontWeight: 400,
                color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.body,
              }}>
                <span style={{ color: '#4cc378', flexShrink: 0, fontSize: 14 * scale }}>&#10003;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center', marginTop: 8 * scale, flexShrink: 0 }}>
        <h1 style={{
          fontSize: 30 * scale, fontWeight: 900, color: BRAND.colors.textWhite,
          fontFamily: BRAND.fonts.heading, lineHeight: 1.1,
          margin: 0, textTransform: 'uppercase' as const,
        }}>
          {headline}
        </h1>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
