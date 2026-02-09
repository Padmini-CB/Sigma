import { BRAND } from '@/styles/brand-constants';

interface StatItem {
  number: string;
  label: string;
}

interface StatCounterGridProps {
  stats: StatItem[];
  columns?: 2 | 3;
}

export function StatCounterGrid({ stats, columns = 3 }: StatCounterGridProps) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 8,
      }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          style={{
            backgroundColor: BRAND.colors.bgCard,
            border: `1px solid ${BRAND.colors.borderCard}`,
            borderRadius: 8,
            padding: '10px 8px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: BRAND.colors.accentGreen,
              fontFamily: BRAND.fonts.heading,
              lineHeight: 1.1,
            }}
          >
            {stat.number}
          </div>
          <div
            style={{
              fontSize: 9,
              color: BRAND.colors.textMuted,
              fontFamily: BRAND.fonts.body,
              lineHeight: 1.2,
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
