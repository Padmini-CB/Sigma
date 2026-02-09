import { BRAND } from '@/styles/brand-constants';

interface GitHubGridProps {
  variant: 'before' | 'after';
  label?: string;
  statNumber?: string;
  statLabel?: string;
}

function generateGrid(variant: 'before' | 'after'): number[][] {
  const rows = 7;
  const cols = 13;
  const grid: number[][] = [];

  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      if (variant === 'before') {
        // Sparse: mostly 0, few scattered 1s
        row.push(Math.random() < 0.08 ? (Math.random() < 0.5 ? 1 : 2) : 0);
      } else {
        // Full: mostly 2-4, few 1s
        const val = Math.random();
        if (val < 0.05) row.push(0);
        else if (val < 0.15) row.push(1);
        else if (val < 0.35) row.push(2);
        else if (val < 0.6) row.push(3);
        else row.push(4);
      }
    }
    grid.push(row);
  }
  return grid;
}

const BEFORE_COLORS = ['#1a1a2e', '#3b1c1c', '#7f1d1d', '#dc2626'];
const AFTER_COLORS = ['#1a1a2e', '#14432a', '#166534', '#22c55e', '#4ade80'];

export function GitHubGrid({ variant, label, statNumber, statLabel }: GitHubGridProps) {
  const grid = generateGrid(variant);
  const colors = variant === 'before' ? BEFORE_COLORS : AFTER_COLORS;
  const borderColor = variant === 'before' ? BRAND.colors.redWarning : BRAND.colors.greenGrid;

  return (
    <div
      style={{
        border: `2px solid ${borderColor}`,
        borderRadius: 12,
        padding: 16,
        backgroundColor: BRAND.colors.bgCard,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      {/* Label */}
      {label && (
        <div
          style={{
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            color: borderColor,
            fontFamily: BRAND.fonts.heading,
          }}
        >
          {label}
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {grid.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 3 }}>
            {row.map((val, ci) => (
              <div
                key={ci}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 2,
                  backgroundColor: colors[Math.min(val, colors.length - 1)],
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Stat */}
      {statNumber && (
        <div style={{ textAlign: 'center' }}>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: borderColor,
              fontFamily: BRAND.fonts.heading,
            }}
          >
            {statNumber}
          </span>
          {statLabel && (
            <span style={{ fontSize: 11, color: BRAND.colors.textMuted, marginLeft: 6, fontFamily: BRAND.fonts.body }}>
              {statLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
