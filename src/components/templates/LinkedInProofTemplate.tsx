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

  const linkedInCardBase: React.CSSProperties = {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 10 * scale,
    padding: 14 * scale,
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
  };

  const linkedInWatermark: React.CSSProperties = {
    position: 'absolute',
    top: 10 * scale,
    right: 12 * scale,
    opacity: 0.15,
    fontSize: 40 * scale,
    fontWeight: 900,
    color: '#0A66C2',
    fontFamily: 'Georgia, serif',
    fontStyle: 'italic',
    lineHeight: 1,
    pointerEvents: 'none',
  };

  const actionIconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4 * scale,
    fontSize: 11 * scale,
    fontFamily: BRAND.fonts.body,
    fontWeight: 500,
  };

  const actionRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
    paddingTop: 6 * scale,
    borderTop: '1px solid rgba(255,255,255,0.06)',
  };

  /* Thumbs up SVG icon for like */
  const ThumbIcon = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M7 22V11L2 13V22H7ZM10 21H18.6L21.8 11.4C21.9 11.1 22 10.8 22 10.5C22 9.7 21.3 9 20.5 9H14L15.1 4.3L15.1 4C15.1 3.6 14.9 3.2 14.7 2.9L13.7 2L7.8 7.9C7.3 8.3 7 8.9 7 9.5V19.5C7 20.3 7.7 21 8.5 21H10Z" fill={color} />
    </svg>
  );

  /* Comment SVG icon */
  const CommentIcon = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill={color} />
    </svg>
  );

  /* Share SVG icon */
  const ShareIcon = ({ size, color }: { size: number; color: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M21 12L14 5V9C7 10 4 15 3 20C5.5 16.5 9 14.9 14 14.9V19L21 12Z" fill={color} />
    </svg>
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
        fontSize: 52 * scale,
        fontWeight: 900,
        fontFamily: BRAND.fonts.heading,
        textAlign: 'center',
        margin: 0,
        flexShrink: 0,
        lineHeight: 1.1,
        marginBottom: 10 * scale,
      }}>
        <span style={{ color: BRAND.colors.textWhite }}>REAL PROJECTS VS</span>
        <span style={{ color: '#c7f464' }}> TUTORIALS</span>
      </h1>

      {/* Two LinkedIn Post Cards Side by Side */}
      <div style={{ flex: 1, display: 'flex', gap: 14 * scale, minHeight: 0, overflow: 'hidden' }}>

        {/* ===== LEFT POST - Tutorial Learner (dimmed) ===== */}
        <div style={{
          ...linkedInCardBase,
          borderLeft: `3px solid #c47070`,
          opacity: 0.55,
        }}>
          {/* LinkedIn watermark */}
          <div style={linkedInWatermark}>in</div>

          {/* Profile header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 * scale, marginBottom: 10 * scale }}>
            <div style={{
              width: 42 * scale, height: 42 * scale, borderRadius: '50%',
              backgroundColor: 'rgba(196,112,112,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15 * scale, fontWeight: 700, color: '#c47070',
              fontFamily: BRAND.fonts.heading, flexShrink: 0,
            }}>
              TL
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 16 * scale, fontWeight: 700, color: BRAND.colors.textWhite,
                fontFamily: BRAND.fonts.heading, lineHeight: 1.2,
              }}>
                Tutorial Learner
              </div>
              <div style={{
                fontSize: 12 * scale, color: 'rgba(255,255,255,0.5)',
                fontFamily: BRAND.fonts.body, lineHeight: 1.3,
              }}>
                Aspiring Data Analyst | Looking for opportunities
              </div>
              <div style={{
                fontSize: 11 * scale, color: 'rgba(255,255,255,0.35)',
                fontFamily: BRAND.fonts.body, lineHeight: 1.4,
                display: 'flex', alignItems: 'center', gap: 4 * scale,
              }}>
                1d &bull;
                <svg width={12 * scale} height={12 * scale} viewBox="0 0 16 16" fill="rgba(255,255,255,0.35)">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 9.5h-5v-7h1.5v5.5h3.5v1.5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Post body */}
          <div style={{
            fontSize: 14 * scale, color: 'rgba(255,255,255,0.7)',
            fontFamily: BRAND.fonts.body, lineHeight: 1.6, fontWeight: 400, flex: 1,
          }}>
            Just completed a Python tutorial! {'\u{1F389}'} Also worked on the Titanic dataset on Kaggle. Excited to start my data journey!
            {' '}
            <span style={{ color: 'rgba(10,102,194,0.4)' }}>
              #DataScience #Learning #Python #MachineLearning
            </span>
          </div>

          {/* Reaction bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: 12 * scale, color: 'rgba(255,255,255,0.4)', fontFamily: BRAND.fonts.body,
            paddingTop: 6 * scale, paddingBottom: 4 * scale,
            borderTop: '1px solid rgba(255,255,255,0.06)',
            marginTop: 'auto',
          }}>
            <span>{'\u{1F44D}'} 2</span>
            <span>0 comments</span>
          </div>

          {/* Like / Comment / Share action row */}
          <div style={actionRowStyle}>
            <div style={{ ...actionIconStyle, color: 'rgba(255,255,255,0.4)' }}>
              <ThumbIcon size={14 * scale} color="rgba(255,255,255,0.4)" />
              Like
            </div>
            <div style={{ ...actionIconStyle, color: 'rgba(255,255,255,0.4)' }}>
              <CommentIcon size={14 * scale} color="rgba(255,255,255,0.4)" />
              Comment
            </div>
            <div style={{ ...actionIconStyle, color: 'rgba(255,255,255,0.4)' }}>
              <ShareIcon size={14 * scale} color="rgba(255,255,255,0.4)" />
              Share
            </div>
          </div>
        </div>

        {/* ===== RIGHT POST - Bootcamp Learner (bright) ===== */}
        <div style={{
          ...linkedInCardBase,
          borderLeft: `3px solid #4cc378`,
        }}>
          {/* LinkedIn watermark */}
          <div style={linkedInWatermark}>in</div>

          {/* Profile header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 * scale, marginBottom: 10 * scale }}>
            <div style={{
              width: 42 * scale, height: 42 * scale, borderRadius: '50%',
              backgroundColor: 'rgba(76,195,120,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15 * scale, fontWeight: 700, color: '#4cc378',
              fontFamily: BRAND.fonts.heading, flexShrink: 0,
            }}>
              SP
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 16 * scale, fontWeight: 700, color: BRAND.colors.textWhite,
                fontFamily: BRAND.fonts.heading, lineHeight: 1.2,
              }}>
                Sneha Patel
              </div>
              <div style={{
                fontSize: 12 * scale, color: 'rgba(255,255,255,0.65)',
                fontFamily: BRAND.fonts.body, lineHeight: 1.3,
              }}>
                Data Analyst @ TCS | Ex-codebasics Bootcamp Learner
              </div>
              <div style={{
                fontSize: 11 * scale, color: 'rgba(255,255,255,0.45)',
                fontFamily: BRAND.fonts.body, lineHeight: 1.4,
                display: 'flex', alignItems: 'center', gap: 4 * scale,
              }}>
                3h &bull;
                <svg width={12 * scale} height={12 * scale} viewBox="0 0 16 16" fill="rgba(255,255,255,0.45)">
                  <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm3.5 9.5h-5v-7h1.5v5.5h3.5v1.5z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Post body */}
          <div style={{
            fontSize: 14 * scale, color: BRAND.colors.textWhite,
            fontFamily: BRAND.fonts.body, lineHeight: 1.6, fontWeight: 400, flex: 1,
          }}>
            Thrilled to share that the supply chain dashboard I built for AtliQ Hardware during the codebasics virtual internship helped reduce stockouts by 15%!
            {'\n\n'}
            This was not a toy project -- it involved real-world data, stakeholder requirements, and production-grade Power BI architecture.
            {'\n\n'}
            The hands-on project experience from the bootcamp gave me the confidence to tackle enterprise-grade problems and build a portfolio that stands out.
            {'\n\n'}
            {'\u{1F449}'} Check out the full project on my GitHub portfolio.
            {' '}
            <span style={{ color: 'rgba(10,102,194,0.5)' }}>
              #DataAnalytics #PowerBI #SupplyChain #codebasics #Portfolio
            </span>
          </div>

          {/* Reaction bar */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            fontSize: 12 * scale, color: 'rgba(255,255,255,0.65)', fontFamily: BRAND.fonts.body,
            paddingTop: 6 * scale, paddingBottom: 4 * scale,
            borderTop: '1px solid rgba(76,195,120,0.15)',
            marginTop: 'auto',
          }}>
            <span>{'\u{1F44D}'}{'\u{1F4A1}'}{'\u{1F389}'} 147</span>
            <span>23 comments</span>
          </div>

          {/* Like / Comment / Share action row */}
          <div style={actionRowStyle}>
            <div style={{ ...actionIconStyle, color: 'rgba(255,255,255,0.6)' }}>
              <ThumbIcon size={14 * scale} color="rgba(255,255,255,0.6)" />
              Like
            </div>
            <div style={{ ...actionIconStyle, color: 'rgba(255,255,255,0.6)' }}>
              <CommentIcon size={14 * scale} color="rgba(255,255,255,0.6)" />
              Comment
            </div>
            <div style={{ ...actionIconStyle, color: 'rgba(255,255,255,0.6)' }}>
              <ShareIcon size={14 * scale} color="rgba(255,255,255,0.6)" />
              Share
            </div>
          </div>
        </div>
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
              fontSize: 34 * scale, fontWeight: 900, color: '#c7f464',
              fontFamily: BRAND.fonts.heading, lineHeight: 1.1,
            }}>
              {stat.number}
            </div>
            <div style={{
              fontSize: 13 * scale, color: 'rgba(255,255,255,0.55)',
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
