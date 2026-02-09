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
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 10,
        padding: '10px 16px',
        gap: 12,
      }}
    >
      {/* Course name */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: BRAND.colors.textMuted,
          fontFamily: BRAND.fonts.heading,
          textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        {courseName}
      </div>

      {/* Trust signals */}
      <div
        style={{
          fontSize: 9,
          color: BRAND.colors.textMuted,
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

      {/* CTA Button */}
      <div
        style={{
          backgroundColor: BRAND.colors.accentGreen,
          color: BRAND.colors.bgDark,
          fontSize: 11,
          fontWeight: 700,
          fontFamily: BRAND.fonts.body,
          padding: '8px 16px',
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
