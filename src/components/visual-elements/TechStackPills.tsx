import { BRAND } from '@/styles/brand-constants';

interface TechStackPillsProps {
  technologies: string[];
  variant?: 'light' | 'dark';
  columns?: number;
  pillSize?: 'sm' | 'md' | 'lg';
}

export function TechStackPills({ technologies, variant = 'dark', columns, pillSize = 'md' }: TechStackPillsProps) {
  const fontSize = pillSize === 'sm' ? 14 : pillSize === 'lg' ? 20 : 16;
  const paddingY = pillSize === 'sm' ? 5 : pillSize === 'lg' ? 10 : 7;
  const paddingX = pillSize === 'sm' ? 12 : pillSize === 'lg' ? 22 : 16;

  const gridStyle: React.CSSProperties = columns
    ? { display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 8 }
    : { display: 'flex', flexWrap: 'wrap' as const, gap: 8 };

  return (
    <div style={gridStyle}>
      {technologies.map((tech) => (
        <div
          key={tech}
          style={{
            padding: `${paddingY}px ${paddingX}px`,
            borderRadius: 6,
            border: `1px solid ${variant === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)'}`,
            backgroundColor: variant === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
            fontSize,
            fontFamily: BRAND.fonts.body,
            color: variant === 'dark' ? BRAND.colors.textWhite : '#1a1a2e',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            fontWeight: 500,
            letterSpacing: '0.02em',
          }}
        >
          {tech}
        </div>
      ))}
    </div>
  );
}
