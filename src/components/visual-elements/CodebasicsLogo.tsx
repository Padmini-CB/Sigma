import { BRAND } from '@/styles/brand-constants';

export function CodebasicsLogo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
      <span
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: BRAND.colors.primaryBlue,
          fontFamily: BRAND.fonts.heading,
          letterSpacing: '-0.02em',
        }}
      >
        ◈ODE
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: BRAND.colors.primaryBlue,
          fontFamily: BRAND.fonts.heading,
          letterSpacing: '0.25em',
          marginTop: -2,
        }}
      >
        BASICS
      </span>
    </div>
  );
}
