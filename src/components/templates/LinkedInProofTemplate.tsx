import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';

interface LinkedInProofTemplateProps {
  headline?: string;
  subheadline?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  width?: number;
  height?: number;
}

export function LinkedInProofTemplate({
  headline = 'REAL PROJECTS VS TUTORIALS',
  subheadline = 'REAL PROJECTS. REAL LINKEDIN CREDIBILITY.',
  cta = 'BUILD YOUR PORTFOLIO',
  courseName = 'Data Engineering Bootcamp 1.0',
  techStack = ['SQL', 'Python', 'Spark', 'Databricks', 'AWS', 'Snowflake'],
  width = 1080,
  height = 1080,
}: LinkedInProofTemplateProps) {
  const scale = Math.min(width, height) / 1080;

  const proofStats = [
    { number: '300+', label: 'Career Switches' },
    { number: '7+', label: 'Business Projects' },
    { number: '44K+', label: 'Learners' },
  ];

  /* ───── LinkedIn-native SVG icons ───── */

  const ThumbIcon = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M19.46 11l-3.91-3.91a1.51 1.51 0 00-1.13-.49H9v10h8.59a1.5 1.5 0 001.42-1.01L21 11h-1.54zM8 17V7H4v10h4z" fill={color} />
    </svg>
  );

  const CommentIcon = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 9h10v1.5H7V9zm0 4h7v1.5H7V13z" fill={color} />
      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18H7l3.5 4 3.5-4h6.5a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0020.5 2zm0 14.5H13.4l-1.4 1.6-1.4-1.6H3.5v-13h17v13z" fill={color} />
    </svg>
  );

  const RepostIcon = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M13.96 5H6c-1.1 0-2 .9-2 2v5h2V7h7.96l-1.75 2.24 1.58 1.23L17 6.54l-3.21-3.97-1.58 1.23L13.96 5zM10.04 19H18c1.1 0 2-.9 2-2v-5h-2v5h-7.96l1.75-2.24-1.58-1.23L7 17.46l3.21 3.97 1.58-1.23L10.04 19z" fill={color} />
    </svg>
  );

  const SendIcon = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 3L0 10l7.66 4.26L21 3zm-11.54 9.8L13.72 21 21 3 9.46 12.8z" fill={color} />
    </svg>
  );

  const GlobeIcon = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill={color}>
      <path d="M8 1a7 7 0 107 7 7 7 0 00-7-7zM5.37 13.35A5.5 5.5 0 013.08 9.5h2.05a11.78 11.78 0 00.37 3.07 7.36 7.36 0 01-.13.78zm-2.29-5.35a5.5 5.5 0 012.29-3.85 7.36 7.36 0 01.13.78 11.78 11.78 0 00-.37 3.07H3.08zM7.25 14.44A10.29 10.29 0 016.64 9.5h1.61v4.94a.42.42 0 01-1 0zM7.25 8H6.64A10.29 10.29 0 017.25 3.06a.42.42 0 011 0V8zm3.38 5.35a7.36 7.36 0 01-.13-.78 11.78 11.78 0 00.37-3.07h2.05a5.5 5.5 0 01-2.29 3.85zm.73-5.35a10.29 10.29 0 00-.61-4.94.42.42 0 011 0H12.92a5.5 5.5 0 012.29 3.85 7.36 7.36 0 01-.13.78 11.78 11.78 0 00-.37-3.07H9.36z" />
    </svg>
  );

  /* ───── Shared styles ───── */

  const linkedInCard: React.CSSProperties = {
    flex: 1,
    borderRadius: 8 * scale,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  };

  const actionBtnStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4 * scale,
    fontSize: 12 * scale,
    fontWeight: 600,
    fontFamily: BRAND.fonts.body,
    padding: `${6 * scale}px 0`,
    flex: 1,
    borderRadius: 4 * scale,
  };

  /* ───── LinkedIn Post Card component ───── */
  const LinkedInPost = ({
    variant,
    initials,
    name,
    title,
    connectionBadge,
    timestamp,
    body,
    linkPreview,
    reactionEmojis,
    reactionCount,
    commentCount,
    repostCount,
  }: {
    variant: 'weak' | 'strong';
    initials: string;
    name: string;
    title: string;
    connectionBadge: string;
    timestamp: string;
    body: React.ReactNode;
    linkPreview?: React.ReactNode;
    reactionEmojis: string;
    reactionCount: string;
    commentCount: string;
    repostCount?: string;
  }) => {
    const isWeak = variant === 'weak';
    const tintOverlay = isWeak
      ? 'rgba(200,80,80,0.05)'
      : 'rgba(80,200,80,0.05)';
    const cardBg = isWeak
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(255,255,255,0.08)';
    const avatarBg = isWeak
      ? 'rgba(196,112,112,0.3)'
      : 'rgba(76,195,120,0.3)';
    const avatarColor = isWeak ? '#c47070' : '#4cc378';
    const textOpacity = isWeak ? 0.55 : 1;
    const mutedText = isWeak
      ? 'rgba(255,255,255,0.35)'
      : 'rgba(255,255,255,0.55)';
    const bodyColor = isWeak
      ? 'rgba(255,255,255,0.6)'
      : 'rgba(255,255,255,0.92)';
    const actionColor = isWeak
      ? 'rgba(255,255,255,0.35)'
      : 'rgba(255,255,255,0.6)';
    const separatorColor = isWeak
      ? 'rgba(255,255,255,0.05)'
      : 'rgba(255,255,255,0.08)';

    return (
      <div style={{
        ...linkedInCard,
        backgroundColor: cardBg,
        border: `1px solid ${separatorColor}`,
        opacity: textOpacity,
      }}>
        {/* Tint overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: tintOverlay,
          pointerEvents: 'none',
          zIndex: 0,
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1, padding: `${12 * scale}px ${14 * scale}px` }}>
          {/* ── Profile Header ── */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 * scale, marginBottom: 10 * scale }}>
            {/* Avatar circle */}
            <div style={{
              width: 48 * scale,
              height: 48 * scale,
              borderRadius: '50%',
              backgroundColor: avatarBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16 * scale,
              fontWeight: 700,
              color: avatarColor,
              fontFamily: BRAND.fonts.heading,
              flexShrink: 0,
            }}>
              {initials}
            </div>

            {/* Name, title, timestamp */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 * scale }}>
                <span style={{
                  fontSize: 14 * scale,
                  fontWeight: 700,
                  color: BRAND.colors.textWhite,
                  fontFamily: BRAND.fonts.heading,
                  lineHeight: 1.3,
                }}>
                  {name}
                </span>
                <span style={{
                  fontSize: 10 * scale,
                  fontWeight: 500,
                  color: mutedText,
                  fontFamily: BRAND.fonts.body,
                  backgroundColor: isWeak ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${separatorColor}`,
                  borderRadius: 3 * scale,
                  padding: `${1 * scale}px ${4 * scale}px`,
                  lineHeight: 1.4,
                }}>
                  {connectionBadge}
                </span>
              </div>
              <div style={{
                fontSize: 11 * scale,
                color: mutedText,
                fontFamily: BRAND.fonts.body,
                lineHeight: 1.4,
                marginTop: 1 * scale,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {title}
              </div>
              <div style={{
                fontSize: 10 * scale,
                color: mutedText,
                fontFamily: BRAND.fonts.body,
                lineHeight: 1.4,
                display: 'flex',
                alignItems: 'center',
                gap: 3 * scale,
                marginTop: 1 * scale,
              }}>
                {timestamp} &bull;{' '}
                <GlobeIcon size={10 * scale} color={mutedText} />
              </div>
            </div>

            {/* Three dots menu */}
            <span style={{
              fontSize: 18 * scale,
              color: mutedText,
              lineHeight: 1,
              cursor: 'default',
              flexShrink: 0,
              marginTop: 2 * scale,
            }}>
              ⋯
            </span>
          </div>

          {/* ── Post Body ── */}
          <div style={{
            fontSize: 13 * scale,
            color: bodyColor,
            fontFamily: BRAND.fonts.body,
            lineHeight: 1.55,
            fontWeight: 400,
            flex: 1,
            whiteSpace: 'pre-line',
          }}>
            {body}
          </div>

          {/* ── Link Preview Card (optional) ── */}
          {linkPreview && (
            <div style={{ marginTop: 8 * scale }}>
              {linkPreview}
            </div>
          )}

          {/* ── Reaction Bar ── */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 11 * scale,
            color: mutedText,
            fontFamily: BRAND.fonts.body,
            padding: `${6 * scale}px 0`,
            borderBottom: `1px solid ${separatorColor}`,
            marginTop: 'auto',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 * scale }}>
              {reactionEmojis} {reactionCount}
            </span>
            <span>
              {commentCount}{repostCount ? ` \u00B7 ${repostCount}` : ''}
            </span>
          </div>

          {/* ── Action Buttons Row ── */}
          <div style={{
            display: 'flex',
            gap: 2 * scale,
            paddingTop: 4 * scale,
          }}>
            <div style={{ ...actionBtnStyle, color: actionColor }}>
              <ThumbIcon size={16 * scale} color={actionColor} />
              Like
            </div>
            <div style={{ ...actionBtnStyle, color: actionColor }}>
              <CommentIcon size={16 * scale} color={actionColor} />
              Comment
            </div>
            <div style={{ ...actionBtnStyle, color: actionColor }}>
              <RepostIcon size={16 * scale} color={actionColor} />
              Repost
            </div>
            <div style={{ ...actionBtnStyle, color: actionColor }}>
              <SendIcon size={16 * scale} color={actionColor} />
              Send
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ───── GitHub link preview card for the strong post ───── */
  const GitHubLinkPreview = () => (
    <div style={{
      backgroundColor: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 8 * scale,
      overflow: 'hidden',
    }}>
      {/* Preview image area */}
      <div style={{
        height: 60 * scale,
        background: 'linear-gradient(135deg, rgba(67,97,238,0.15) 0%, rgba(22,27,34,0.6) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <svg width={24 * scale} height={24 * scale} viewBox="0 0 16 16" fill="rgba(255,255,255,0.3)">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
      </div>
      {/* Preview text */}
      <div style={{ padding: `${8 * scale}px ${10 * scale}px` }}>
        <div style={{
          fontSize: 10 * scale,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: BRAND.fonts.body,
          marginBottom: 2 * scale,
        }}>
          github.com
        </div>
        <div style={{
          fontSize: 12 * scale,
          color: 'rgba(255,255,255,0.8)',
          fontFamily: BRAND.fonts.body,
          fontWeight: 600,
          lineHeight: 1.3,
          marginBottom: 2 * scale,
        }}>
          AtliQ Supply Chain Dashboard
        </div>
        <div style={{
          fontSize: 10 * scale,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: BRAND.fonts.body,
          lineHeight: 1.3,
        }}>
          Power BI project with 3 interactive pages, DAX measures, and live data pipeline
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      width, height,
      background: BRAND.background,
      padding: 24 * scale,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: BRAND.fonts.body,
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <PadminiLogo />
        <YouTubeBadge />
      </div>

      {/* Headline */}
      <h1 style={{
        fontSize: 'var(--sigma-headline-size)',
        fontWeight: 900,
        fontFamily: BRAND.fonts.heading,
        textAlign: 'center',
        margin: 0,
        flexShrink: 0,
        lineHeight: 1.1,
        marginBottom: 10 * scale,
      }}>
        <span style={{ color: BRAND.colors.textWhite }}>REAL PROJECTS VS</span>
        <span style={{ color: 'var(--sigma-headline-accent-color)' }}> TUTORIALS</span>
      </h1>

      {/* ══════ Two LinkedIn Post Cards Side by Side ══════ */}
      <div style={{ flex: 1, display: 'flex', gap: 10 * scale, minHeight: 0, overflow: 'hidden' }}>

        {/* ===== LEFT POST - Tutorial Learner (weak) ===== */}
        <LinkedInPost
          variant="weak"
          initials="RM"
          name="Rahul M."
          title="Aspiring Data Analyst | Open to work"
          connectionBadge="2nd"
          timestamp="2d"
          body={
            <>
              Just completed a Python tutorial! Also worked on the Titanic dataset on Kaggle. Excited to start my data journey!
              {'\n\n'}
              <span style={{ color: 'rgba(59,130,246,0.5)' }}>
                #DataScience #Python #Learning
              </span>
            </>
          }
          reactionEmojis={'\u{1F44D}'}
          reactionCount="2"
          commentCount="0 comments"
        />

        {/* ===== RIGHT POST - Bootcamp Learner (strong) ===== */}
        <LinkedInPost
          variant="strong"
          initials="PS"
          name="Priya S."
          title="Data Analyst at TCS | Codebasics Graduate"
          connectionBadge="Following"
          timestamp="1d"
          body={
            <>
              Thrilled to share my latest project — built a supply chain forecast dashboard for AtliQ Hardware using Power BI. Reduced stockouts by 15%!
              {'\n\n'}
              Check out the full project on my GitHub: github.com/priya/atliq-supply-chain {'\u{1F680}'}
              {'\n\n'}
              <span style={{ color: '#3b82f6' }}>
                #codebasics #DataAnalytics #PowerBI #SupplyChain
              </span>
            </>
          }
          linkPreview={<GitHubLinkPreview />}
          reactionEmojis={'\u{1F44D}\u{2764}\u{FE0F}\u{1F389}'}
          reactionCount="147"
          commentCount="23 comments"
          repostCount="8 reposts"
        />
      </div>

      {/* Proof Stats Row */}
      <div style={{ display: 'flex', gap: 10 * scale, marginTop: 10 * scale, flexShrink: 0 }}>
        {proofStats.map((stat) => (
          <div key={stat.label} style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 8 * scale,
            padding: `${8 * scale}px ${10 * scale}px`,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: 'var(--sigma-stat-number-size)', fontWeight: 900, color: 'var(--sigma-stat-color)',
              fontFamily: BRAND.fonts.heading, lineHeight: 1.1,
            }}>
              {stat.number}
            </div>
            <div style={{
              fontSize: 'var(--sigma-label-size)', color: 'rgba(255,255,255,0.55)',
              fontFamily: BRAND.fonts.body, fontWeight: 300, marginTop: 2,
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
