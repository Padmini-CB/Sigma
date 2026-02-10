import { BRAND } from '@/styles/brand-constants';

interface YouTubeBadgeProps {
  subscribers?: string;
  rating?: string;
}

export function YouTubeBadge({ subscribers = '1 Million+', rating = '4.9' }: YouTubeBadgeProps) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        borderRadius: 20,
        padding: '7px 16px',
        border: `1px solid rgba(255,255,255,0.15)`,
      }}
    >
      {/* YouTube Icon - SVG */}
      <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
        <rect width="20" height="14" rx="3" fill="#FF0000" />
        <path d="M8 10V4L13.5 7L8 10Z" fill="white" />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 600, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.body }}>
        {subscribers} Subscribers
      </span>
      <div style={{ width: 1, height: 12, backgroundColor: 'rgba(255,255,255,0.3)' }} />
      <span style={{ fontSize: 13, fontWeight: 600, color: BRAND.colors.accentGreen, fontFamily: BRAND.fonts.body }}>
        {rating} Rating
      </span>
    </div>
  );
}
