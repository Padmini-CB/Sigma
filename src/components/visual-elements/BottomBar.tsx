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
        padding: '12px 20px',
        gap: 14,
        position: 'relative',
        zIndex: 50,
      }}
    >
      <div
        style={{
          fontSize: 13,
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
          fontSize: 11,
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
          backgroundColor: BRAND.colors.accentGreen,
          color: BRAND.colors.bgDark,
          fontSize: 14,
          fontWeight: 700,
          fontFamily: BRAND.fonts.body,
          padding: '10px 20px',
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
