import { BRAND } from '@/styles/brand-constants';

interface BottomBarProps {
  courseName: string;
  cta: string;
  trustSignals?: string;
}

export function BottomBar({ courseName, cta, trustSignals = BRAND.trustSignals }: BottomBarProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        padding: '14px 22px',
        gap: 14,
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontSize: 'var(--sigma-bottom-bar-size, 15px)',
          fontWeight: 700,
          color: BRAND.colors.textMuted,
          fontFamily: BRAND.fonts.heading,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.08em',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {courseName}
      </div>
      <div
        style={{
          fontSize: 'var(--sigma-label-size, 13px)',
          color: 'rgba(255,255,255,0.45)',
          fontFamily: BRAND.fonts.body,
          textAlign: 'center',
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {trustSignals}
      </div>
      <div
        style={{
          background: 'var(--sigma-cta-bg, linear-gradient(90deg, #2563eb, #3b82f6))',
          color: 'var(--sigma-cta-color, #ffffff)',
          fontSize: 'var(--sigma-cta-size, 20px)',
          fontWeight: 700,
          fontFamily: BRAND.fonts.body,
          padding: '12px 28px',
          borderRadius: 6,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {cta} →
      </div>
    </div>
  );
}
