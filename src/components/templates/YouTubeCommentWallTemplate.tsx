import React from 'react';
import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

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
    initials: 'RK', avatarBg: '#3b82f6', name: 'Rakesh Kumar', timestamp: '3 months ago',
    text: 'Switched from mechanical engineering to data analyst at TCS. The virtual internship made all the difference.',
    highlight: 'mechanical engineering to data analyst', likes: '847',
  },
  {
    initials: 'PS', avatarBg: '#22c55e', name: 'Priya Singh', timestamp: '2 months ago',
    text: 'The Power BI projects are real business problems, not toy datasets. My manager was impressed in the interview.',
    highlight: 'real business problems', likes: '623',
  },
  {
    initials: 'AM', avatarBg: '#8b5cf6', name: 'Arun Mehta', timestamp: '5 months ago',
    text: 'Worth every rupee. After 4 months, I had a portfolio that actually got callbacks from recruiters.',
    highlight: 'portfolio that actually got callbacks', likes: '1.2K',
  },
  {
    initials: 'NK', avatarBg: '#f97316', name: 'Neha Kapoor', timestamp: '1 month ago',
    text: 'Non-IT background, 40+ age. Got placed as a junior data analyst. Never thought this was possible.',
    highlight: 'Non-IT background, 40+ age', likes: '934',
  },
  {
    initials: 'VR', avatarBg: '#14b8a6', name: 'Vikram Rao', timestamp: '4 months ago',
    text: "Dhaval sir's teaching style is different. He explains the 'why' behind every concept, not just the 'how'.",
    highlight: "the 'why' behind every concept", likes: '1.5K',
  },
  {
    initials: 'SG', avatarBg: '#ec4899', name: 'Sneha Gupta', timestamp: '6 months ago',
    text: 'I tried 3 other bootcamps before this one. The project-first approach here is exactly what employers want to see.',
    highlight: 'project-first approach', likes: '712',
  },
];

function renderHighlightedText(text: string, highlight: string) {
  const index = text.indexOf(highlight);
  if (index === -1) return <span>{text}</span>;
  const before = text.slice(0, index);
  const match = text.slice(index, index + highlight.length);
  const after = text.slice(index + highlight.length);
  return (
    <span>
      {before}
      <span style={{ color: '#4cc378', fontWeight: 500 }}>{match}</span>
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
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const headlineNode = headline ? (
    <span>{headline}</span>
  ) : (
    <>
      <span style={{ color: BRAND.colors.textWhite }}>1 MILLION+ SUBSCRIBERS </span>
      <span style={{ color: 'var(--sigma-headline-accent-color)' }}>CAN&apos;T BE WRONG.</span>
    </>
  );

  const topBar = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
      <PadminiLogo />
      <YouTubeBadge />
    </div>
  );

  const headlineBlock = (
    <div style={{ textAlign: 'center', flexShrink: 0 }}>
      <h1 style={{
        fontSize: 'var(--sigma-headline-size)', fontWeight: 900,
        fontFamily: BRAND.fonts.heading, lineHeight: 1.1,
        textTransform: 'uppercase' as const, margin: 0,
      }}>
        {headlineNode}
      </h1>
    </div>
  );

  const wrapperBase: React.CSSProperties = {
    width,
    height,
    background: BRAND.background,
    fontFamily: BRAND.fonts.body,
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const renderCommentCard = (comment: Comment) => (
    <div key={comment.initials} style={{
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8,
      padding: `${10 * scale}px ${12 * scale}px`,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Avatar + name + timestamp */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8 * scale,
        marginBottom: 6 * scale, flexShrink: 0,
      }}>
        <div style={{
          width: 30 * scale, height: 30 * scale, borderRadius: '50%',
          backgroundColor: comment.avatarBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontSize: 'var(--sigma-label-size, 14px)', fontWeight: 700, color: '#fff', fontFamily: BRAND.fonts.heading }}>
            {comment.initials}
          </span>
        </div>
        <span style={{ fontSize: 'var(--sigma-body-size, 15px)', fontWeight: 700, color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.body, whiteSpace: 'nowrap' }}>
          {comment.name}
        </span>
        <span style={{
          fontSize: 'var(--sigma-label-size, 10px)', color: 'rgba(255,255,255,0.35)',
          fontFamily: BRAND.fonts.body, whiteSpace: 'nowrap', marginLeft: 'auto',
        }}>
          {comment.timestamp}
        </span>
      </div>

      {/* Comment text */}
      <div style={{
        fontSize: 'var(--sigma-body-size, 15px)', color: 'rgba(255,255,255,0.8)',
        fontFamily: BRAND.fonts.body, fontWeight: 300,
        lineHeight: 1.45, flex: 1, overflow: 'hidden',
      }}>
        {renderHighlightedText(comment.text, comment.highlight)}
      </div>

      {/* Thumbs up */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 4 * scale,
        marginTop: 6 * scale, flexShrink: 0,
      }}>
        <svg width={14 * scale} height={14 * scale} viewBox="0 0 20 20" fill="none">
          <path d="M2 10h3v8H2a1 1 0 01-1-1v-6a1 1 0 011-1zm5-1V5a3 3 0 013-3l.5.5a1.5 1.5 0 01.44 1.06L10.5 7H16a2 2 0 012 2v.5l-1.5 6A2 2 0 0114.56 17H7V9z" fill="rgba(255,255,255,0.3)" />
        </svg>
        <span style={{ fontSize: 'var(--sigma-label-size, 11px)', color: 'rgba(255,255,255,0.35)', fontFamily: BRAND.fonts.body }}>
          {comment.likes}
        </span>
      </div>
    </div>
  );

  // ---- YouTube Thumb: Bold headline only, no comments, no bottom bar ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {topBar}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${12 * scale}px` }}>
          <div style={{ textAlign: 'center' }}>
            {headlineBlock}
          </div>
        </div>
      </div>
    );
  }

  // ---- Landscape: 3 columns x 2 rows, compact padding, less margin on bottom bar ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ marginBottom: 6 * scale }}>
          {headlineBlock}
        </div>

        {/* Comment grid: 3x2 */}
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 8 * scale,
          overflow: 'hidden',
        }}>
          {DEFAULT_COMMENTS.map(renderCommentCard)}
        </div>

        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: 2x3 grid with generous spacing, stacked vertically ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 14 * scale }}>
        {topBar}
        <div style={{ padding: `${8 * scale}px 0` }}>
          {headlineBlock}
        </div>

        {/* Comment grid: 2x3 with more gap */}
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr 1fr',
          gap: 14 * scale,
          overflow: 'hidden',
        }}>
          {DEFAULT_COMMENTS.map(renderCommentCard)}
        </div>

        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait (default): Original 2x3 layout ----
  return (
    <div style={{
      ...wrapperBase,
      padding: 24 * scale,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ marginBottom: 6 * scale }}>
        {topBar}
      </div>

      <div style={{ marginBottom: 10 * scale }}>
        {headlineBlock}
      </div>

      {/* Comment grid: 2x3 */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr 1fr',
        gap: 10 * scale,
        overflow: 'hidden',
      }}>
        {DEFAULT_COMMENTS.map(renderCommentCard)}
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
