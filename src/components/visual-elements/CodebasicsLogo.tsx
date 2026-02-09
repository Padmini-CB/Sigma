import { BRAND } from '@/styles/brand-constants';

export function CodebasicsLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span
        style={{
          fontSize: 22,
          fontWeight: 800,
          color: BRAND.colors.primaryBlue,
          fontFamily: BRAND.fonts.heading,
          lineHeight: 1,
        }}
      >
        {'⟨/⟩'}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: BRAND.colors.primaryBlue,
            fontFamily: BRAND.fonts.heading,
            letterSpacing: '0.02em',
          }}
        >
          code
        </span>
        <span
          style={{
            fontSize: 10,
            fontWeight: 600,
            color: BRAND.colors.primaryBlue,
            fontFamily: BRAND.fonts.heading,
            letterSpacing: '0.18em',
            marginTop: -2,
          }}
        >
          basics
        </span>
      </div>
    </div>
  );
}
