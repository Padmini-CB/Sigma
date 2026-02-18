import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

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
  const { layoutMode } = getAdSizeConfig(width, height);
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

  /* ───── Wrapper base ───── */
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
      <YouTubeBadge />
    </div>
  );

  /* ───── Headline element ───── */
  const headlineElement = (
    <div style={{ textAlign: 'center', flexShrink: 0 }}>
      <h1 style={{
        fontSize: 'var(--sigma-subheadline-size)', fontWeight: 900,
        fontFamily: BRAND.fonts.heading, lineHeight: 1.1,
        margin: 0, textTransform: 'uppercase' as const,
      }}>
        {(() => {
          const eqIdx = headline.indexOf('=');
          if (eqIdx >= 0) {
            return (
              <>
                <span style={{ color: BRAND.colors.textWhite }}>{headline.slice(0, eqIdx + 1)}</span>
                <span style={{ color: 'var(--sigma-headline-accent-color)' }}>{headline.slice(eqIdx + 1)}</span>
              </>
            );
          }
          return <span style={{ color: BRAND.colors.textWhite }}>{headline}</span>;
        })()}
      </h1>
    </div>
  );

  /* ───── Daily price block ───── */
  const dailyPriceBlock = (
    <div>
      <div style={{
        fontSize: 'var(--sigma-headline-size)', fontWeight: 900, color: 'var(--sigma-stat-color)',
        fontFamily: BRAND.fonts.heading, lineHeight: 1,
        textTransform: 'uppercase' as const,
      }}>
        {dailyPrice}/DAY
      </div>
      <div style={{
        fontSize: 'var(--sigma-subheadline-size)', fontWeight: 400, color: BRAND.colors.textWhite,
        fontFamily: BRAND.fonts.body, marginTop: 4 * scale,
      }}>
        That&apos;s all it takes.
      </div>
      <div style={{
        fontSize: 'var(--sigma-label-size)', fontWeight: 300, color: 'rgba(255,255,255,0.55)',
        fontFamily: BRAND.fonts.body, marginTop: 2 * scale,
      }}>
        {price} &divide; 4 months = one career transformation
      </div>
    </div>
  );

  /* ───── Calendar Widget ───── */
  const calendarWidget = (
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
          fontSize: 'var(--sigma-label-size, 14px)',
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
          fontSize: 'var(--sigma-body-size, 15px)',
          fontWeight: 700,
          color: BRAND.colors.textWhite,
          fontFamily: BRAND.fonts.heading,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
        }}>
          {monthName}
        </span>
        <span style={{
          fontSize: 'var(--sigma-label-size, 14px)',
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
            fontSize: 'var(--sigma-label-size, 12px)',
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
                ? `2px solid var(--sigma-stat-color)`
                : '1px solid rgba(255,255,255,0.05)',
              background: isHighlighted
                ? 'rgba(199,244,100,0.08)'
                : 'transparent',
              minHeight: 32 * scale,
            }}>
              <span style={{
                fontSize: 'var(--sigma-label-size, 11px)',
                fontWeight: isHighlighted ? 700 : 400,
                color: isHighlighted
                  ? 'var(--sigma-stat-color)'
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
                  fontSize: 'var(--sigma-label-size, 14px)',
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
  );

  /* ───── Comparison section (right side) ───── */
  const comparisonSection = (
    <>
      {/* What it buys elsewhere — red label */}
      <div style={{
        fontSize: 'var(--sigma-card-title-size, 17px)', fontWeight: 700, color: '#c47070',
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
            <div style={{ fontSize: 'var(--sigma-body-size, 17px)', fontWeight: 400, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.body }}>
              {item.label}
            </div>
            <div style={{ fontSize: 'var(--sigma-label-size, 14px)', fontWeight: 300, color: '#c47070', fontFamily: BRAND.fonts.body }}>
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
        fontSize: 'var(--sigma-card-title-size, 17px)', fontWeight: 700, color: '#4cc378',
        fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
        letterSpacing: '0.04em',
      }}>
        What {dailyPrice}/Day Gets You Here
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 * scale }}>
        {valueItems.map((item) => (
          <div key={item} style={{
            display: 'flex', alignItems: 'center', gap: 8 * scale,
            fontSize: 'var(--sigma-body-size, 16px)', fontWeight: 400,
            color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.body,
          }}>
            <span style={{ color: '#4cc378', flexShrink: 0, fontSize: 'var(--sigma-body-size, 16px)' }}>&#10003;</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </>
  );

  // ---- YouTube Thumb: just the headline and daily price display centered ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {topBar}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              fontSize: 'var(--sigma-headline-size)', fontWeight: 900, color: 'var(--sigma-stat-color)',
              fontFamily: BRAND.fonts.heading, lineHeight: 1,
              textTransform: 'uppercase' as const,
              marginBottom: 12 * scale,
            }}>
              {dailyPrice}/DAY
            </div>
            <h1 style={{
              fontSize: 'var(--sigma-subheadline-size)', fontWeight: 900,
              fontFamily: BRAND.fonts.heading, lineHeight: 1.1,
              margin: 0, textTransform: 'uppercase' as const,
            }}>
              {(() => {
                const eqIdx = headline.indexOf('=');
                if (eqIdx >= 0) {
                  return (
                    <>
                      <span style={{ color: BRAND.colors.textWhite }}>{headline.slice(0, eqIdx + 1)}</span>
                      <span style={{ color: 'var(--sigma-headline-accent-color)' }}>{headline.slice(eqIdx + 1)}</span>
                    </>
                  );
                }
                return <span style={{ color: BRAND.colors.textWhite }}>{headline}</span>;
              })()}
            </h1>
          </div>
        </div>
      </div>
    );
  }

  // ---- Landscape: keep two columns, reduce column widths ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>

        {/* Main Content: Split */}
        <div style={{ flex: 1, display: 'flex', gap: 12 * scale, overflow: 'hidden' }}>
          {/* LEFT (50%) */}
          <div style={{ width: '50%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 * scale }}>
            {dailyPriceBlock}
            {calendarWidget}
          </div>

          {/* RIGHT (50%) */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 * scale }}>
            {comparisonSection}
          </div>
        </div>

        {/* Headline */}
        <div style={{ marginTop: 4 * scale }}>
          {headlineElement}
        </div>

        {/* Bottom Bar */}
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: stack price section on top, comparison below, full width ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}

        {/* Price section - full width */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 * scale }}>
          {dailyPriceBlock}
          {calendarWidget}
        </div>

        {/* Comparison section - full width */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 * scale }}>
          {comparisonSection}
        </div>

        {/* Headline */}
        {headlineElement}

        {/* Bottom Bar */}
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait: Original two-column layout ----
  return (
    <div style={{
      ...wrapperBase,
      padding: 24 * scale,
      display: 'flex',
      flexDirection: 'column',
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
          {dailyPriceBlock}

          {/* Calendar Widget */}
          {calendarWidget}
        </div>

        {/* RIGHT (45%) */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10 * scale }}>
          {comparisonSection}
        </div>
      </div>

      {/* Headline */}
      {headlineElement}

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
