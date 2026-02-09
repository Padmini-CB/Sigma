import { BRAND } from '@/styles/brand-constants';

interface BarChartItem {
  label: string;
  percentage: number;
}

interface BarChartCard {
  title: string;
  items: BarChartItem[];
}

interface BarChartComparisonProps {
  leftCard: BarChartCard;
  rightCard: BarChartCard;
}

function BarCard({ card, color, borderColor }: { card: BarChartCard; color: string; borderColor: string }) {
  return (
    <div
      style={{
        flex: 1,
        border: `2px solid ${borderColor}`,
        borderRadius: 12,
        padding: 16,
        backgroundColor: BRAND.colors.bgCard,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: borderColor,
          fontFamily: BRAND.fonts.heading,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.05em',
        }}
      >
        {card.title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {card.items.map((item) => (
          <div key={item.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 10, color: BRAND.colors.textMuted, fontFamily: BRAND.fonts.body }}>
                {item.label}
              </span>
              <span style={{ fontSize: 10, color: BRAND.colors.textMuted, fontFamily: BRAND.fonts.body, fontWeight: 600 }}>
                {item.percentage}%
              </span>
            </div>
            <div
              style={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255,255,255,0.05)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${Math.max(item.percentage, 2)}%`,
                  height: '100%',
                  borderRadius: 4,
                  backgroundColor: color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BarChartComparison({ leftCard, rightCard }: BarChartComparisonProps) {
  return (
    <div style={{ display: 'flex', gap: 12, height: '100%' }}>
      <BarCard card={leftCard} color={BRAND.colors.redBar} borderColor={BRAND.colors.redWarning} />
      <BarCard card={rightCard} color={BRAND.colors.blueBar} borderColor={BRAND.colors.primaryBlue} />
    </div>
  );
}
