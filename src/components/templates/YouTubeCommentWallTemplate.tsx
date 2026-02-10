import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface Comment {
  initials: string;
  avatarBg: string;
  name: string;
  timestamp: string;
  text: string;
  highlight: string;
  likes: string;
}

interface YouTubeCommentWallTemplateProps {
  headline?: string;
  cta?: string;
  courseName?: string;
  width?: number;
  height?: number;
}

const DEFAULT_COMMENTS: Comment[] = [
  {
    initials: 'RK',
    avatarBg: '#3b82f6',
    name: 'Rakesh Kumar',
    timestamp: '3 months ago',
    text: 'Switched from mechanical engineering to data analyst at TCS. The virtual internship made all the difference.',
    highlight: 'mechanical engineering to data analyst',
    likes: '847',
  },
  {
    initials: 'PS',
    avatarBg: '#22c55e',
    name: 'Priya Singh',
    timestamp: '2 months ago',
    text: 'The Power BI projects are real business problems, not toy datasets. My manager was impressed in the interview.',
    highlight: 'real business problems',
    likes: '623',
  },
  {
    initials: 'AM',
    avatarBg: '#8b5cf6',
    name: 'Arun Mehta',
    timestamp: '5 months ago',
    text: 'Worth every rupee. After 4 months, I had a portfolio that actually got callbacks from recruiters.',
    highlight: 'portfolio that actually got callbacks',
    likes: '1.2K',
  },
  {
    initials: 'NK',
    avatarBg: '#f97316',
    name: 'Neha Kapoor',
    timestamp: '1 month ago',
    text: 'Non-IT background, 40+ age. Got placed as a junior data analyst. Never thought this was possible.',
    highlight: 'Non-IT background, 40+ age',
    likes: '934',
  },
  {
    initials: 'VR',
    avatarBg: '#14b8a6',
    name: 'Vikram Rao',
    timestamp: '4 months ago',
    text: "Dhaval sir's teaching style is different. He explains the 'why' behind every concept, not just the 'how'.",
    highlight: "the 'why' behind every concept",
    likes: '1.5K',
  },
  {
    initials: 'SG',
    avatarBg: '#ec4899',
    name: 'Sneha Gupta',
    timestamp: '6 months ago',
    text: 'I tried 3 other bootcamps before this one. The project-first approach here is exactly what employers want to see.',
    highlight: 'project-first approach',
    likes: '712',
  },
];

function renderHighlightedText(text: string, highlight: string, scale: number) {
  const index = text.indexOf(highlight);
  if (index === -1) {
    return <span>{text}</span>;
  }
  const before = text.slice(0, index);
  const match = text.slice(index, index + highlight.length);
  const after = text.slice(index + highlight.length);
  return (
    <span>
      {before}
      <span style={{ color: '#4cc378', fontWeight: 400 }}>{match}</span>
      {after}
    </span>
  );
}

export function YouTubeCommentWallTemplate({
  headline,
  cta = 'JOIN THE COMMUNITY',
  courseName = 'Data Analytics Bootcamp 1.0',
  width = 1080,
  height = 1080,
}: YouTubeCommentWallTemplateProps) {
  const scale = Math.min(width, height) / 1080;

  const headlineNode = headline ? (
    <span>{headline}</span>
  ) : (
    <>
      1 MILLION+ SUBSCRIBERS{' '}
      <span style={{ color: '#c7f464' }}>CAN&apos;T BE WRONG.</span>
    </>
  );

  return (
    <div
      style={{
        width,
        height,
        background: BRAND.background,
        padding: 28 * scale,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: BRAND.fonts.body,
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 10 * scale }}>
        <CodebasicsLogo />
        <YouTubeBadge />
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: 16 * scale, flexShrink: 0 }}>
        <h1
          style={{
            fontSize: 36 * scale,
            fontWeight: 900,
            color: BRAND.colors.textWhite,
            fontFamily: BRAND.fonts.heading,
            lineHeight: 1.1,
            textTransform: 'uppercase' as const,
            margin: 0,
          }}
        >
          {headlineNode}
        </h1>
      </div>

      {/* Comment grid: 2 columns x 3 rows */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
          gap: 12 * scale,
          overflow: 'hidden',
        }}
      >
        {DEFAULT_COMMENTS.map((comment) => (
          <div
            key={comment.initials}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8,
              padding: 12 * scale,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Top row: avatar, name, timestamp */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8 * scale,
                marginBottom: 8 * scale,
                flexShrink: 0,
              }}
            >
              {/* Avatar circle */}
              <div
                style={{
                  width: 28 * scale,
                  height: 28 * scale,
                  borderRadius: '50%',
                  backgroundColor: comment.avatarBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    fontSize: 11 * scale,
                    fontWeight: 700,
                    color: '#ffffff',
                    fontFamily: BRAND.fonts.heading,
                  }}
                >
                  {comment.initials}
                </span>
              </div>
              <span
                style={{
                  fontSize: 12 * scale,
                  fontWeight: 700,
                  color: BRAND.colors.textWhite,
                  fontFamily: BRAND.fonts.body,
                  whiteSpace: 'nowrap',
                }}
              >
                {comment.name}
              </span>
              <span
                style={{
                  fontSize: 10 * scale,
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: BRAND.fonts.body,
                  whiteSpace: 'nowrap',
                  marginLeft: 'auto',
                }}
              >
                {comment.timestamp}
              </span>
            </div>

            {/* Comment text */}
            <div
              style={{
                fontSize: 13 * scale,
                color: BRAND.colors.textWhite,
                fontFamily: BRAND.fonts.body,
                fontWeight: 300,
                lineHeight: 1.45,
                flex: 1,
                overflow: 'hidden',
              }}
            >
              {renderHighlightedText(comment.text, comment.highlight, scale)}
            </div>

            {/* Bottom: thumbs up + count */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4 * scale,
                marginTop: 8 * scale,
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: 13 * scale }}>&#x1F44D;</span>
              <span
                style={{
                  fontSize: 11 * scale,
                  color: 'rgba(255,255,255,0.4)',
                  fontFamily: BRAND.fonts.body,
                }}
              >
                {comment.likes}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 10 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
