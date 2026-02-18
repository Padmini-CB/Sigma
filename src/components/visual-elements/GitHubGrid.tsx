import { BRAND } from '@/styles/brand-constants';

interface GitHubGridProps {
  variant: 'before' | 'after';
  label?: string;
  statNumber?: string;
  statLabel?: string;
  /** When true, grid cells stretch to fill the container width */
  responsive?: boolean;
}

function generateGrid(variant: 'before' | 'after'): number[][] {
  const rows = 7;
  const cols = 15;
  const grid: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: number[] = [];
    for (let c = 0; c < cols; c++) {
      if (variant === 'before') {
        row.push(Math.random() < 0.08 ? (Math.random() < 0.5 ? 1 : 2) : 0);
      } else {
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

export function GitHubGrid({ variant, label, statNumber, statLabel, responsive }: GitHubGridProps) {
  const grid = generateGrid(variant);
  const colors = variant === 'before' ? BEFORE_COLORS : AFTER_COLORS;
  const borderColor = variant === 'before' ? BRAND.colors.redWarning : BRAND.colors.greenGrid;

  const cellGap = responsive ? 4 : 3;

  return (
    <div style={{
      border: `2px solid ${borderColor}`,
      borderRadius: 12,
      padding: responsive ? 24 : 18,
      backgroundColor: BRAND.colors.bgCard,
      display: 'flex',
      flexDirection: 'column',
      gap: responsive ? 16 : 12,
      ...(responsive ? { width: '100%', height: '100%', boxSizing: 'border-box' as const } : {}),
    }}>
      {label && (
        <div style={{ fontSize: 'var(--sigma-label-size, 14px)', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: borderColor, fontFamily: BRAND.fonts.heading, flexShrink: 0 }}>{label}</div>
      )}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: cellGap,
        ...(responsive ? { flex: 1, minHeight: 0 } : {}),
      }}>
        {grid.map((row, ri) => (
          <div key={ri} style={{
            display: 'flex',
            gap: cellGap,
            ...(responsive ? { flex: 1, minHeight: 0 } : {}),
          }}>
            {row.map((val, ci) => (
              <div key={ci} style={{
                borderRadius: responsive ? 3 : 2,
                backgroundColor: colors[Math.min(val, colors.length - 1)],
                ...(responsive
                  ? { flex: 1, minWidth: 0, aspectRatio: '1' }
                  : { width: 14, height: 14 }),
              }} />
            ))}
          </div>
        ))}
      </div>
      {statNumber && (
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: 'var(--sigma-card-title-size, 22px)', fontWeight: 800, color: borderColor, fontFamily: BRAND.fonts.heading }}>{statNumber}</span>
          {statLabel && <span style={{ fontSize: 'var(--sigma-label-size, 14px)', color: BRAND.colors.textMuted, marginLeft: 6, fontFamily: BRAND.fonts.body }}>{statLabel}</span>}
        </div>
      )}
    </div>
  );
}
