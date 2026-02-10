import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface InterviewPlaybackTemplateProps {
  headline?: string;
  cta?: string;
  courseName?: string;
  width?: number;
  height?: number;
}

export function InterviewPlaybackTemplate({
  headline = 'WHICH CANDIDATE GETS THE CALLBACK?',
  cta = 'BECOME CANDIDATE B',
  courseName = 'Data Engineering Bootcamp 1.0',
  width = 1080,
  height = 1080,
}: InterviewPlaybackTemplateProps) {
  const scale = Math.min(width, height) / 1080;

  const qaCardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 8 * scale,
    padding: `${10 * scale}px ${14 * scale}px`,
    fontSize: 16 * scale,
    color: BRAND.colors.textWhite,
    fontFamily: BRAND.fonts.body,
    fontWeight: 400,
    lineHeight: 1.4,
  };

  const questionStyle: React.CSSProperties = {
    fontSize: 15 * scale,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: BRAND.fonts.body,
    fontWeight: 300,
    fontStyle: 'italic',
    lineHeight: 1.4,
    marginBottom: 4 * scale,
  };

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
        <CodebasicsLogo />
        <YouTubeBadge />
      </div>

      {/* Recording Interface Top Bar */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: `${10 * scale}px ${10 * scale}px 0 0`,
        padding: `${10 * scale}px ${16 * scale}px`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 * scale }}>
          {/* Red recording dot with glow */}
          <div style={{
            width: 10 * scale, height: 10 * scale, borderRadius: '50%',
            backgroundColor: '#ef4444', flexShrink: 0,
            boxShadow: '0 0 6px rgba(239,68,68,0.6)',
          }} />
          <span style={{
            fontSize: 16 * scale, fontWeight: 600,
            color: '#ef4444', fontFamily: BRAND.fonts.body,
          }}>
            REC
          </span>
          <span style={{
            fontSize: 16 * scale, fontWeight: 500,
            color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.body,
          }}>
            Interview Recording
          </span>
        </div>
        <span style={{
          fontSize: 13 * scale, fontWeight: 300,
          color: 'rgba(255,255,255,0.5)', fontFamily: BRAND.fonts.body,
        }}>
          Technical Round &mdash; Data Analyst Position
        </span>
      </div>

      {/* Two Candidate Panels */}
      <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden' }}>
        {/* LEFT - Candidate A (red tint) */}
        <div style={{
          flex: 1,
          backgroundColor: 'rgba(196,112,112,0.06)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: `${14 * scale}px ${16 * scale}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: 8 * scale,
        }}>
          <div style={{
            fontSize: 22 * scale, fontWeight: 900, color: '#c47070',
            fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
            letterSpacing: '0.05em', paddingBottom: 6 * scale,
            borderBottom: '2px solid #c47070',
          }}>
            CANDIDATE A
          </div>

          <div style={questionStyle}>&ldquo;Tell me about a project you&apos;ve built&rdquo;</div>
          <div style={qaCardStyle}>&ldquo;I did the Titanic survival prediction on Kaggle...&rdquo;</div>

          <div style={{ ...questionStyle, marginTop: 4 * scale }}>&ldquo;What&apos;s in your GitHub?&rdquo;</div>
          <div style={qaCardStyle}>&ldquo;I have a weather API tutorial from YouTube...&rdquo;</div>

          <div style={{
            marginTop: 'auto', fontSize: 20 * scale, fontWeight: 700,
            color: '#c47070', fontFamily: BRAND.fonts.heading,
            textAlign: 'center', padding: `${6 * scale}px 0`,
          }}>
            &#10060; No callback
          </div>
        </div>

        {/* RIGHT - Candidate B (green tint) */}
        <div style={{
          flex: 1,
          backgroundColor: 'rgba(76,195,120,0.06)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          padding: `${14 * scale}px ${16 * scale}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: 8 * scale,
        }}>
          <div style={{
            fontSize: 22 * scale, fontWeight: 900, color: '#4cc378',
            fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
            letterSpacing: '0.05em', paddingBottom: 6 * scale,
            borderBottom: '2px solid #4cc378',
          }}>
            CANDIDATE B
          </div>

          <div style={questionStyle}>&ldquo;Tell me about a project you&apos;ve built&rdquo;</div>
          <div style={qaCardStyle}>&ldquo;Built a supply chain forecast dashboard for AtliQ Hardware using Power BI...&rdquo;</div>

          <div style={{ ...questionStyle, marginTop: 4 * scale }}>&ldquo;What&apos;s in your GitHub?&rdquo;</div>
          <div style={qaCardStyle}>&ldquo;GitHub portfolio with all 7 projects, including a real-time Kafka pipeline...&rdquo;</div>

          <div style={{
            marginTop: 'auto', fontSize: 20 * scale, fontWeight: 700,
            color: '#4cc378', fontFamily: BRAND.fonts.heading,
            textAlign: 'center', padding: `${6 * scale}px 0`,
          }}>
            &#9989; Hired
          </div>
        </div>
      </div>

      {/* Video Player Bar */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: `0 0 ${10 * scale}px ${10 * scale}px`,
        padding: `${8 * scale}px ${16 * scale}px`,
        display: 'flex', alignItems: 'center', gap: 10 * scale,
        flexShrink: 0,
      }}>
        <div style={{
          width: 28 * scale, height: 28 * scale, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <div style={{
            width: 0, height: 0,
            borderTop: `${6 * scale}px solid transparent`,
            borderBottom: `${6 * scale}px solid transparent`,
            borderLeft: `${10 * scale}px solid rgba(255,255,255,0.7)`,
            marginLeft: 2 * scale,
          }} />
        </div>
        <div style={{ flex: 1, height: 4 * scale, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 2 * scale, overflow: 'hidden' }}>
          <div style={{ width: '72%', height: '100%', backgroundColor: BRAND.colors.primaryBlue, borderRadius: 2 * scale }} />
        </div>
        <span style={{
          fontSize: 12 * scale, color: 'rgba(255,255,255,0.5)',
          fontFamily: BRAND.fonts.body, fontWeight: 300, whiteSpace: 'nowrap', flexShrink: 0,
        }}>
          24:18 / 33:45
        </span>
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center', marginTop: 10 * scale, flexShrink: 0 }}>
        <h1 style={{
          fontSize: 52 * scale, fontWeight: 900, fontFamily: BRAND.fonts.heading,
          lineHeight: 1.1, margin: 0, textTransform: 'uppercase' as const,
        }}>
          <span style={{ color: BRAND.colors.textWhite }}>WHICH CANDIDATE GETS</span>
          <span style={{ color: '#c7f464' }}> THE CALLBACK?</span>
        </h1>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
