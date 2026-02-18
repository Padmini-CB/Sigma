import { BRAND } from '@/styles/brand-constants';

interface WeekItem {
  weekLabel: string;
  title: string;
  desc: string;
}

interface WeekJourneyGridProps {
  weeks: WeekItem[];
  totalWeeks?: string;
  subtitle?: string;
}

export function WeekJourneyGrid({ weeks, totalWeeks, subtitle }: WeekJourneyGridProps) {
  const cols = weeks.length <= 4 ? 2 : 3;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
      {totalWeeks && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--sigma-headline-size, 44px)', fontWeight: 800, fontFamily: BRAND.fonts.heading, color: BRAND.colors.textWhite, lineHeight: 1.1 }}>
            YOUR <span style={{ color: BRAND.colors.accentGreen }}>{totalWeeks}-WEEK</span> JOURNEY
          </div>
          {subtitle && (
            <div style={{ fontSize: 'var(--sigma-body-size, 18px)', color: BRAND.colors.textMuted, fontFamily: BRAND.fonts.body, marginTop: 6 }}>
              {subtitle}
            </div>
          )}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, flex: 1 }}>
        {weeks.map((week, i) => (
          <div
            key={week.weekLabel}
            style={{
              backgroundColor: BRAND.colors.bgCard,
              border: `1px solid ${BRAND.colors.borderSubtle}`,
              borderRadius: 10,
              padding: 18,
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              borderLeft: `3px solid ${i % 2 === 0 ? BRAND.colors.accentGreen : BRAND.colors.primaryBlue}`,
            }}
          >
            <div style={{ fontSize: 'var(--sigma-label-size, 13px)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: BRAND.colors.accentGreen, fontFamily: BRAND.fonts.heading }}>
              WEEK {week.weekLabel}
            </div>
            <div style={{ fontSize: 'var(--sigma-card-title-size, 22px)', fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading, lineHeight: 1.2 }}>
              {week.title}
            </div>
            <div style={{ fontSize: 'var(--sigma-label-size, 13px)', color: BRAND.colors.textMuted, fontFamily: BRAND.fonts.body, lineHeight: 1.3 }}>
              {week.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
