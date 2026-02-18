import { BRAND } from '@/styles/brand-constants';

interface YouTubeBadgeProps {
  subscribers?: string;
  rating?: string;
  layoutMode?: string;
}

export function YouTubeBadge({
  subscribers = '1 Million+',
  rating = '4.9',
  layoutMode,
}: YouTubeBadgeProps) {
  // Per brand guidelines: badge should NOT appear on YouTube Thumbnail (1280x720)
  if (layoutMode === 'youtube-thumb') return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 12,
        padding: '12px 20px',
        border: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      {/* YouTube Play Icon — red ▶ triangle in white rounded rectangle */}
      <svg width="32" height="22" viewBox="0 0 32 22" fill="none" style={{ flexShrink: 0 }}>
        <rect width="32" height="22" rx="4" fill="#FF0000" />
        <path d="M13 16V6L22 11L13 16Z" fill="white" />
      </svg>

      {/* Text block: subscribers line + rating line */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span
          style={{
            fontSize: 'var(--sigma-label-size, 20px)',
            fontWeight: 700,
            color: BRAND.colors.textWhite,
            fontFamily: BRAND.fonts.body,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          {subscribers} Subscribers
        </span>
        <span
          style={{
            fontSize: 'var(--sigma-label-size, 18px)',
            fontWeight: 600,
            color: '#D7EF3F',
            fontFamily: BRAND.fonts.body,
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
          }}
        >
          {rating} Rating
        </span>
      </div>
    </div>
  );
}
