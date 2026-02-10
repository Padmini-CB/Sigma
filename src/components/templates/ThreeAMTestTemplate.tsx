import { BRAND } from '@/styles/brand-constants';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';

interface ThreeAMTestTemplateProps {
  headline?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  width?: number;
  height?: number;
}

export function ThreeAMTestTemplate({
  headline,
  cta = 'BUILD REAL SKILLS',
  courseName = 'Data Engineering Bootcamp 1.0',
  techStack = ['Python', 'AWS', 'CloudWatch', 'Spark', 'Airflow', 'Docker'],
  width = 1080,
  height = 1080,
}: ThreeAMTestTemplateProps) {
  const scale = Math.min(width, height) / 1080;

  const tutorialSteps = [
    'Google the error',
    'Copy from StackOverflow',
    'Push and pray',
    'Crashes at 4 AM',
  ];

  const bootcampSteps = [
    'Check CloudWatch logs',
    'Identify pipeline failure',
    'Fix, test, redeploy',
    'Back to sleep by 3:30 AM',
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

      {/* Phone notification */}
      <div
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 16 * scale,
          padding: 16 * scale,
          marginBottom: 14 * scale,
          flexShrink: 0,
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Time + battery row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10 * scale,
          }}
        >
          <span
            style={{
              fontSize: 22 * scale,
              fontWeight: 700,
              color: BRAND.colors.textWhite,
              fontFamily: BRAND.fonts.heading,
            }}
          >
            3:07 AM
          </span>
          <span
            style={{
              fontSize: 14 * scale,
              color: 'rgba(255,255,255,0.5)',
              fontFamily: BRAND.fonts.body,
            }}
          >
            &#x1F50B; 23%
          </span>
        </div>

        {/* Red alert card */}
        <div
          style={{
            backgroundColor: 'rgba(196,112,112,0.12)',
            border: '1px solid rgba(196,112,112,0.3)',
            borderRadius: 10 * scale,
            padding: 12 * scale,
          }}
        >
          <span
            style={{
              fontSize: 13 * scale,
              color: '#c47070',
              fontFamily: BRAND.fonts.body,
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            &#9888; AWS CloudWatch: Production Model Failed &mdash; Pipeline timeout at Stage 3
          </span>
        </div>
      </div>

      {/* Two path cards side by side */}
      <div style={{ flex: 1, display: 'flex', gap: 14 * scale, overflow: 'hidden', marginBottom: 14 * scale }}>
        {/* LEFT - Tutorial Graduate */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(196,112,112,0.25)',
            borderRadius: 12,
            padding: 18 * scale,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8 * scale,
              marginBottom: 16 * scale,
              paddingBottom: 12 * scale,
              borderBottom: '1px solid rgba(196,112,112,0.2)',
            }}
          >
            <span style={{ fontSize: 18 * scale, color: '#c47070' }}>&#10007;</span>
            <span
              style={{
                fontSize: 18 * scale,
                fontWeight: 700,
                color: '#c47070',
                fontFamily: BRAND.fonts.heading,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.04em',
              }}
            >
              Tutorial Graduate
            </span>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 * scale, flex: 1 }}>
            {tutorialSteps.map((step, i) => (
              <div
                key={step}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10 * scale,
                }}
              >
                <span
                  style={{
                    fontSize: 14 * scale,
                    fontWeight: 700,
                    color: '#c47070',
                    fontFamily: BRAND.fonts.heading,
                    flexShrink: 0,
                    width: 22 * scale,
                  }}
                >
                  {i + 1}.
                </span>
                <span
                  style={{
                    fontSize: 14 * scale,
                    color: BRAND.colors.textWhite,
                    fontFamily: BRAND.fonts.body,
                    fontWeight: 300,
                    lineHeight: 1.4,
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom verdict */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: 14 * scale,
              borderTop: '1px solid rgba(196,112,112,0.15)',
            }}
          >
            <span
              style={{
                fontSize: 13 * scale,
                color: '#c47070',
                fontFamily: BRAND.fonts.body,
                fontStyle: 'italic',
                fontWeight: 300,
              }}
            >
              Still debugging at sunrise
            </span>
          </div>
        </div>

        {/* RIGHT - Bootcamp Graduate */}
        <div
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(76,195,120,0.25)',
            borderRadius: 12,
            padding: 18 * scale,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8 * scale,
              marginBottom: 16 * scale,
              paddingBottom: 12 * scale,
              borderBottom: '1px solid rgba(76,195,120,0.2)',
            }}
          >
            <span style={{ fontSize: 18 * scale, color: '#4cc378' }}>&#10003;</span>
            <span
              style={{
                fontSize: 18 * scale,
                fontWeight: 700,
                color: '#4cc378',
                fontFamily: BRAND.fonts.heading,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.04em',
              }}
            >
              Bootcamp Graduate
            </span>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 * scale, flex: 1 }}>
            {bootcampSteps.map((step, i) => (
              <div
                key={step}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10 * scale,
                }}
              >
                <span
                  style={{
                    fontSize: 14 * scale,
                    fontWeight: 700,
                    color: '#4cc378',
                    fontFamily: BRAND.fonts.heading,
                    flexShrink: 0,
                    width: 22 * scale,
                  }}
                >
                  {i + 1}.
                </span>
                <span
                  style={{
                    fontSize: 14 * scale,
                    color: BRAND.colors.textWhite,
                    fontFamily: BRAND.fonts.body,
                    fontWeight: 300,
                    lineHeight: 1.4,
                  }}
                >
                  {step}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom verdict */}
          <div
            style={{
              marginTop: 'auto',
              paddingTop: 14 * scale,
              borderTop: '1px solid rgba(76,195,120,0.15)',
            }}
          >
            <span
              style={{
                fontSize: 13 * scale,
                color: '#4cc378',
                fontFamily: BRAND.fonts.body,
                fontStyle: 'italic',
                fontWeight: 300,
              }}
            >
              Sleeping. Pipeline recovered.
            </span>
          </div>
        </div>
      </div>

      {/* Tech stack pills */}
      <div style={{ flexShrink: 0, marginBottom: 14 * scale }}>
        <TechStackPills technologies={techStack} pillSize="sm" />
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: 14 * scale, flexShrink: 0 }}>
        {headline ? (
          <h1
            style={{
              fontSize: 32 * scale,
              fontWeight: 900,
              color: BRAND.colors.textWhite,
              fontFamily: BRAND.fonts.heading,
              lineHeight: 1.1,
              textTransform: 'uppercase' as const,
              margin: 0,
            }}
          >
            {headline}
          </h1>
        ) : (
          <h1
            style={{
              fontSize: 32 * scale,
              fontWeight: 900,
              fontFamily: BRAND.fonts.heading,
              lineHeight: 1.15,
              textTransform: 'uppercase' as const,
              margin: 0,
            }}
          >
            <span style={{ color: BRAND.colors.textWhite }}>
              WE DON&apos;T JUST TEACH YOU TO BUILD MODELS.
            </span>
            <br />
            <span style={{ color: '#c7f464' }}>WE TEACH YOU TO FIX THEM.</span>
          </h1>
        )}
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0 }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
