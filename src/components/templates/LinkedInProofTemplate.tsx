import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';

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

  const cardStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 12 * scale,
    padding: 16 * scale,
    display: 'flex',
    flexDirection: 'column',
    gap: 10 * scale,
  };

  const proofStats = [
    { number: '300+', label: 'Career Switches' },
    { number: '7+', label: 'Business Projects' },
    { number: '44K+', label: 'Learners' },
  ];

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

      {/* LinkedIn Posts Side by Side */}
      <div style={{ flex: 1, display: 'flex', gap: 16 * scale, overflow: 'hidden' }}>
        {/* LEFT POST - Tutorial Learner (dimmed, red tint) */}
        <div
          style={{
            ...cardStyle,
            flex: 1,
            borderLeft: '3px solid #c47070',
            opacity: 0.6,
          }}
        >
          {/* Profile header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 * scale }}>
            <div
              style={{
                width: 40 * scale,
                height: 40 * scale,
                borderRadius: '50%',
                backgroundColor: 'rgba(196,112,112,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14 * scale,
                fontWeight: 700,
                color: '#c47070',
                fontFamily: BRAND.fonts.heading,
                flexShrink: 0,
              }}
            >
              TL
            </div>
            <div>
              <div
                style={{
                  fontSize: 14 * scale,
                  fontWeight: 700,
                  color: BRAND.colors.textWhite,
                  fontFamily: BRAND.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                Tutorial Learner
              </div>
              <div
                style={{
                  fontSize: 11 * scale,
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: BRAND.fonts.body,
                  lineHeight: 1.2,
                }}
              >
                Aspiring Data Analyst
              </div>
            </div>
          </div>

          {/* Post text */}
          <div
            style={{
              fontSize: 13 * scale,
              color: 'rgba(255,255,255,0.6)',
              fontFamily: BRAND.fonts.body,
              lineHeight: 1.5,
              fontWeight: 300,
            }}
          >
            Just completed a Python tutorial! Also worked on the Titanic dataset on Kaggle. Excited to start my data journey! #DataScience #Learning
          </div>

          {/* Engagement */}
          <div
            style={{
              fontSize: 11 * scale,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: BRAND.fonts.body,
              borderTop: '1px solid rgba(255,255,255,0.07)',
              paddingTop: 8 * scale,
              marginTop: 'auto',
            }}
          >
            2 reactions &bull; 0 comments
          </div>
        </div>

        {/* RIGHT POST - Bootcamp Learner (bright, green tint) */}
        <div
          style={{
            ...cardStyle,
            flex: 1,
            borderLeft: '3px solid #4cc378',
          }}
        >
          {/* Profile header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 * scale }}>
            <div
              style={{
                width: 40 * scale,
                height: 40 * scale,
                borderRadius: '50%',
                backgroundColor: 'rgba(76,195,120,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14 * scale,
                fontWeight: 700,
                color: '#4cc378',
                fontFamily: BRAND.fonts.heading,
                flexShrink: 0,
              }}
            >
              BL
            </div>
            <div>
              <div
                style={{
                  fontSize: 14 * scale,
                  fontWeight: 700,
                  color: BRAND.colors.textWhite,
                  fontFamily: BRAND.fonts.heading,
                  lineHeight: 1.2,
                }}
              >
                Bootcamp Learner
              </div>
              <div
                style={{
                  fontSize: 11 * scale,
                  color: 'rgba(255,255,255,0.6)',
                  fontFamily: BRAND.fonts.body,
                  lineHeight: 1.2,
                }}
              >
                Data Analyst at TCS
              </div>
            </div>
          </div>

          {/* Post text */}
          <div
            style={{
              fontSize: 13 * scale,
              color: BRAND.colors.textWhite,
              fontFamily: BRAND.fonts.body,
              lineHeight: 1.5,
              fontWeight: 400,
            }}
          >
            Built a supply chain forecast dashboard for AtliQ Hardware using Power BI. Reduced stockouts by 15%. Check out the full project on my GitHub portfolio!
          </div>

          {/* Engagement */}
          <div
            style={{
              fontSize: 11 * scale,
              color: '#4cc378',
              fontFamily: BRAND.fonts.body,
              borderTop: '1px solid rgba(76,195,120,0.2)',
              paddingTop: 8 * scale,
              marginTop: 'auto',
              fontWeight: 500,
            }}
          >
            147 reactions &bull; 23 comments
          </div>
        </div>
      </div>

      {/* Headline Section */}
      <div style={{ textAlign: 'center', marginTop: 16 * scale, flexShrink: 0 }}>
        <h1
          style={{
            fontSize: 40 * scale,
            fontWeight: 900,
            fontFamily: BRAND.fonts.heading,
            lineHeight: 1.1,
            margin: 0,
            textTransform: 'uppercase' as const,
          }}
        >
          <span style={{ color: BRAND.colors.textWhite }}>REAL PROJECTS VS</span>
          <span style={{ color: '#c7f464' }}> TUTORIALS</span>
        </h1>
        <div
          style={{
            fontSize: 16 * scale,
            fontWeight: 400,
            fontFamily: BRAND.fonts.body,
            color: BRAND.colors.textWhite,
            marginTop: 4 * scale,
            lineHeight: 1.3,
          }}
        >
          REAL PROJECTS. <span style={{ color: '#c7f464' }}>REAL LINKEDIN CREDIBILITY.</span>
        </div>
      </div>

      {/* Proof Strip Row */}
      <div style={{ display: 'flex', gap: 12 * scale, marginTop: 14 * scale, flexShrink: 0 }}>
        {proofStats.map((stat) => (
          <div
            key={stat.label}
            style={{
              flex: 1,
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8 * scale,
              padding: `${10 * scale}px ${12 * scale}px`,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 24 * scale,
                fontWeight: 900,
                color: '#c7f464',
                fontFamily: BRAND.fonts.heading,
                lineHeight: 1.1,
              }}
            >
              {stat.number}
            </div>
            <div
              style={{
                fontSize: 11 * scale,
                color: 'rgba(255,255,255,0.6)',
                fontFamily: BRAND.fonts.body,
                fontWeight: 300,
                marginTop: 2,
              }}
            >
              {stat.label}
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
