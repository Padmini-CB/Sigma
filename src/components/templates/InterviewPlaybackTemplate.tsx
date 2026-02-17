import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

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
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const qaCardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 6 * scale,
    padding: `${8 * scale}px ${12 * scale}px`,
    fontSize: 14 * scale,
    color: BRAND.colors.textWhite,
    fontFamily: BRAND.fonts.body,
    fontWeight: 400,
    lineHeight: 1.35,
  };

  const questionStyle: React.CSSProperties = {
    fontSize: 13 * scale,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: BRAND.fonts.body,
    fontWeight: 300,
    fontStyle: 'italic',
    lineHeight: 1.35,
    marginBottom: 3 * scale,
  };

  const candidateAQA = [
    {
      q: 'Tell me about a project you\u2019ve built',
      a: 'I did the Titanic survival prediction on Kaggle...',
    },
    {
      q: 'How do you handle messy data?',
      a: 'I usually clean it in Excel... delete the rows with missing values...',
    },
    {
      q: 'Show me your GitHub portfolio',
      a: 'I don\u2019t have a portfolio yet, but I plan to start one soon...',
    },
  ];

  const candidateBQA = [
    {
      q: 'Tell me about a project you\u2019ve built',
      a: 'Built a supply chain forecast dashboard for AtliQ Hardware using Power BI \u2014 reduced stockouts by 15%',
    },
    {
      q: 'How do you handle messy data?',
      a: 'I build data validation pipelines \u2014 null checks, type casting, dedup logic \u2014 all automated in Python',
    },
    {
      q: 'Show me your GitHub portfolio',
      a: 'Here\u2019s my portfolio with all 7 projects, including a real-time Kafka pipeline deployed on AWS',
    },
  ];

  const headlineBlock = (
    <div style={{ textAlign: 'center' }}>
      <h1 style={{
        fontSize: 'var(--sigma-headline-size)', fontWeight: 900, fontFamily: BRAND.fonts.heading,
        lineHeight: 1.1, margin: 0, textTransform: 'uppercase' as const,
      }}>
        <span style={{ color: BRAND.colors.textWhite }}>WHICH CANDIDATE GETS</span>
        <span style={{ color: 'var(--sigma-headline-accent-color)' }}> THE CALLBACK?</span>
      </h1>
    </div>
  );

  const topBar = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
      <PadminiLogo />
      <YouTubeBadge />
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

  const recordingBar = (padding: number) => (
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
  );

  const candidatePanel = (
    label: string,
    color: string,
    bgColor: string,
    qaItems: typeof candidateAQA,
    result: string,
    resultEmoji: string,
    maxItems?: number,
  ) => {
    const items = maxItems ? qaItems.slice(0, maxItems) : qaItems;
    return (
      <div style={{
        flex: 1,
        backgroundColor: bgColor,
        borderLeft: '1px solid rgba(255,255,255,0.07)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        padding: `${12 * scale}px ${14 * scale}px`,
        display: 'flex',
        flexDirection: 'column',
        gap: 5 * scale,
      }}>
        <div style={{
          fontSize: 22 * scale, fontWeight: 900, color,
          fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
          letterSpacing: '0.05em', paddingBottom: 6 * scale,
          borderBottom: `2px solid ${color}`, flexShrink: 0,
        }}>
          {label}
        </div>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-evenly', gap: 5 * scale,
        }}>
          {items.map((item, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={questionStyle}>&ldquo;{item.q}&rdquo;</div>
              <div style={qaCardStyle}>&ldquo;{item.a}&rdquo;</div>
            </div>
          ))}
        </div>
        <div style={{
          flexShrink: 0, fontSize: 20 * scale, fontWeight: 700,
          color, fontFamily: BRAND.fonts.heading,
          textAlign: 'center', padding: `${4 * scale}px 0`,
        }}>
          {resultEmoji} {result}
        </div>
      </div>
    );
  };

  const videoPlayerBar = (
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
  );

  // ---- YouTube Thumb: Bold headline only, centered ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {topBar}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${12 * scale}px` }}>
          {headlineBlock}
        </div>
      </div>
    );
  }

  // ---- Landscape: Compact split-screen, reduced Q&A items ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>

        {recordingBar(18)}

        {/* Two Candidate Panels - compact, show only 2 Q&A items */}
        <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden' }}>
          {candidatePanel('CANDIDATE A', '#c47070', 'rgba(196,112,112,0.06)', candidateAQA, 'No callback', '\u274C', 2)}
          {candidatePanel('CANDIDATE B', '#4cc378', 'rgba(76,195,120,0.06)', candidateBQA, 'Hired', '\u2705', 2)}
        </div>

        {videoPlayerBar}

        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: Vertical stack — recording bar, then each candidate section full width ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}

        {recordingBar(28)}

        {/* Candidate A - full width */}
        <div style={{
          flex: 1,
          backgroundColor: 'rgba(196,112,112,0.06)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8 * scale,
          padding: `${14 * scale}px ${16 * scale}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: 8 * scale,
        }}>
          <div style={{
            fontSize: 22 * scale, fontWeight: 900, color: '#c47070',
            fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
            letterSpacing: '0.05em', paddingBottom: 6 * scale,
            borderBottom: '2px solid #c47070', flexShrink: 0,
          }}>
            CANDIDATE A
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 * scale }}>
            {candidateAQA.map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={questionStyle}>&ldquo;{item.q}&rdquo;</div>
                <div style={qaCardStyle}>&ldquo;{item.a}&rdquo;</div>
              </div>
            ))}
          </div>
          <div style={{
            flexShrink: 0, fontSize: 20 * scale, fontWeight: 700,
            color: '#c47070', fontFamily: BRAND.fonts.heading,
            textAlign: 'center', padding: `${4 * scale}px 0`,
          }}>
            &#10060; No callback
          </div>
        </div>

        {/* Candidate B - full width */}
        <div style={{
          flex: 1,
          backgroundColor: 'rgba(76,195,120,0.06)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8 * scale,
          padding: `${14 * scale}px ${16 * scale}px`,
          display: 'flex',
          flexDirection: 'column',
          gap: 8 * scale,
        }}>
          <div style={{
            fontSize: 22 * scale, fontWeight: 900, color: '#4cc378',
            fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
            letterSpacing: '0.05em', paddingBottom: 6 * scale,
            borderBottom: '2px solid #4cc378', flexShrink: 0,
          }}>
            CANDIDATE B
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 * scale }}>
            {candidateBQA.map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={questionStyle}>&ldquo;{item.q}&rdquo;</div>
                <div style={qaCardStyle}>&ldquo;{item.a}&rdquo;</div>
              </div>
            ))}
          </div>
          <div style={{
            flexShrink: 0, fontSize: 20 * scale, fontWeight: 700,
            color: '#4cc378', fontFamily: BRAND.fonts.heading,
            textAlign: 'center', padding: `${4 * scale}px 0`,
          }}>
            &#9989; Hired
          </div>
        </div>

        {videoPlayerBar}

        {/* Headline */}
        <div style={{ flexShrink: 0 }}>
          {headlineBlock}
        </div>

        {/* Bottom Bar */}
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait: Original layout ----
  return (
    <div style={{
      ...wrapperBase,
      padding: 24 * scale,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <PadminiLogo />
        <YouTubeBadge />
      </div>

      {/* Recording Interface Top Bar */}
      {recordingBar(24)}

      {/* Two Candidate Panels */}
      <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden' }}>
        {candidatePanel('CANDIDATE A', '#c47070', 'rgba(196,112,112,0.06)', candidateAQA, 'No callback', '\u274C')}
        {candidatePanel('CANDIDATE B', '#4cc378', 'rgba(76,195,120,0.06)', candidateBQA, 'Hired', '\u2705')}
      </div>

      {/* Video Player Bar */}
      {videoPlayerBar}

      {/* Headline */}
      <div style={{ marginTop: 10 * scale, flexShrink: 0 }}>
        {headlineBlock}
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
