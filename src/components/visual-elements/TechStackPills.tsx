import { BRAND } from '@/styles/brand-constants';

interface TechStackPillsProps {
  technologies: string[];
  variant?: 'light' | 'dark';
  columns?: number;
  pillSize?: 'sm' | 'md' | 'lg';
}

export function TechStackPills({ technologies, variant = 'dark', columns, pillSize = 'md' }: TechStackPillsProps) {
  const fontSize = pillSize === 'sm' ? 11 : pillSize === 'lg' ? 16 : 13;
  const paddingY = pillSize === 'sm' ? 4 : pillSize === 'lg' ? 8 : 6;
  const paddingX = pillSize === 'sm' ? 10 : pillSize === 'lg' ? 18 : 14;

  const gridStyle: React.CSSProperties = columns
    ? {
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 8,
      }
    : {
        display: 'flex',
        flexWrap: 'wrap' as const,
        gap: 8,
      };

  return (
    <div style={gridStyle}>
      {technologies.map((tech) => (
        <div
          key={tech}
          style={{
            padding: `${paddingY}px ${paddingX}px`,
            borderRadius: 6,
            border: `1px solid ${variant === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}`,
            backgroundColor: variant === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
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
