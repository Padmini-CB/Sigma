import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';

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

  // January 2026 calendar data
  const monthName = 'JANUARY 2026';
  const dayHeaders = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const startOffset = 3; // January 1, 2026 is a Thursday (index 3 in Mon-Sun)
  const totalDays = 31;
  const completedDays = 28;
  const highlightDay = 28;
  const totalCells = 35; // 5 rows x 7 cols

  // Build array of cell values: null for empty, number for day
  const calendarCells: (number | null)[] = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startOffset + 1;
    if (dayNum < 1 || dayNum > totalDays) {
      calendarCells.push(null);
    } else {
      calendarCells.push(dayNum);
    }
  }

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

      {/* Main Content: Split */}
      <div style={{ flex: 1, display: 'flex', gap: 16 * scale, overflow: 'hidden' }}>
        {/* LEFT (55%) */}
        <div style={{ width: '55%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 * scale }}>
          {/* Big daily price */}
          <div>
            <div style={{
              fontSize: 72 * scale, fontWeight: 900, color: '#c7f464',
              fontFamily: BRAND.fonts.heading, lineHeight: 1,
              textTransform: 'uppercase' as const,
            }}>
              {dailyPrice}/DAY
            </div>
            <div style={{
              fontSize: 26 * scale, fontWeight: 400, color: BRAND.colors.textWhite,
              fontFamily: BRAND.fonts.body, marginTop: 4 * scale,
            }}>
              That&apos;s all it takes.
            </div>
            <div style={{
              fontSize: 17 * scale, fontWeight: 300, color: 'rgba(255,255,255,0.55)',
              fontFamily: BRAND.fonts.body, marginTop: 2 * scale,
            }}>
              {price} &divide; 4 months = one career transformation
            </div>
          </div>

          {/* Calendar Widget */}
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10 * scale,
            overflow: 'hidden',
          }}>
            {/* Calendar header with month and arrows */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: `${8 * scale}px ${12 * scale}px`,
              background: 'rgba(255,255,255,0.05)',
            }}>
              <span style={{
                fontSize: 14 * scale,
                color: 'rgba(255,255,255,0.4)',
                fontFamily: BRAND.fonts.body,
                cursor: 'pointer',
                userSelect: 'none',
                lineHeight: 1,
                padding: `${2 * scale}px ${6 * scale}px`,
              }}>
                &lt;
              </span>
              <span style={{
                fontSize: 15 * scale,
                fontWeight: 700,
                color: BRAND.colors.textWhite,
                fontFamily: BRAND.fonts.heading,
                letterSpacing: '0.06em',
                textTransform: 'uppercase' as const,
              }}>
                {monthName}
              </span>
              <span style={{
                fontSize: 14 * scale,
                color: 'rgba(255,255,255,0.4)',
                fontFamily: BRAND.fonts.body,
                cursor: 'pointer',
                userSelect: 'none',
                lineHeight: 1,
                padding: `${2 * scale}px ${6 * scale}px`,
              }}>
                &gt;
              </span>
            </div>

            {/* Day-of-week headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              padding: `${6 * scale}px ${8 * scale}px ${2 * scale}px`,
            }}>
              {dayHeaders.map((day) => (
                <div key={day} style={{
                  textAlign: 'center',
                  fontSize: 12 * scale,
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: BRAND.fonts.body,
                  textTransform: 'uppercase' as const,
                  lineHeight: 1,
                }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar day grid: 5 rows x 7 cols */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: 3 * scale,
              padding: `${4 * scale}px ${8 * scale}px ${8 * scale}px`,
            }}>
              {calendarCells.map((dayNum, i) => {
                if (dayNum === null) {
                  return <div key={i} />;
                }

                const isCompleted = dayNum <= completedDays;
                const isHighlighted = dayNum === highlightDay;

                return (
                  <div key={i} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: `${3 * scale}px 0`,
                    borderRadius: 6 * scale,
                    border: isHighlighted
                      ? `2px solid #c7f464`
                      : '1px solid rgba(255,255,255,0.05)',
                    background: isHighlighted
                      ? 'rgba(199,244,100,0.08)'
                      : 'transparent',
                    minHeight: 32 * scale,
                  }}>
                    <span style={{
                      fontSize: 11 * scale,
                      fontWeight: isHighlighted ? 700 : 400,
                      color: isHighlighted
                        ? '#c7f464'
                        : isCompleted
                          ? 'rgba(255,255,255,0.7)'
                          : 'rgba(255,255,255,0.35)',
                      fontFamily: BRAND.fonts.body,
                      lineHeight: 1,
                    }}>
                      {dayNum}
                    </span>
                    {isCompleted && (
                      <span style={{
                        fontSize: 14 * scale,
                        color: '#4cc378',
                        lineHeight: 1,
                        marginTop: 1 * scale,
                      }}>
                        &#10003;
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT (45%) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 * scale }}>
          {/* What it buys elsewhere — red label */}
          <div style={{
            fontSize: 17 * scale, fontWeight: 700, color: '#c47070',
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
                <div style={{ fontSize: 17 * scale, fontWeight: 400, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.body }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 14 * scale, fontWeight: 300, color: '#c47070', fontFamily: BRAND.fonts.body }}>
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
            fontSize: 17 * scale, fontWeight: 700, color: '#4cc378',
            fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
            letterSpacing: '0.04em',
          }}>
            What {dailyPrice}/Day Gets You Here
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 * scale }}>
            {valueItems.map((item) => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: 8 * scale,
                fontSize: 16 * scale, fontWeight: 400,
                color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.body,
              }}>
                <span style={{ color: '#4cc378', flexShrink: 0, fontSize: 16 * scale }}>&#10003;</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center', marginTop: 8 * scale, flexShrink: 0 }}>
        <h1 style={{
          fontSize: 36 * scale, fontWeight: 900,
          fontFamily: BRAND.fonts.heading, lineHeight: 1.1,
          margin: 0, textTransform: 'uppercase' as const,
        }}>
          {(() => {
            const eqIdx = headline.indexOf('=');
            if (eqIdx >= 0) {
              return (
                <>
                  <span style={{ color: BRAND.colors.textWhite }}>{headline.slice(0, eqIdx + 1)}</span>
                  <span style={{ color: '#c7f464' }}>{headline.slice(eqIdx + 1)}</span>
                </>
              );
            }
            return <span style={{ color: BRAND.colors.textWhite }}>{headline}</span>;
          })()}
        </h1>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
