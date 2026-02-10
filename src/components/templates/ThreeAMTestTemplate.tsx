import { BRAND } from '@/styles/brand-constants';
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
    'Still debugging at sunrise',
  ];

  const bootcampSteps = [
    'Check CloudWatch logs',
    'Identify pipeline failure',
    'Fix, test, redeploy',
    'Back to sleep by 3:30 AM',
  ];

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

      {/* Phone notification mockup */}
      <div style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 16 * scale,
        padding: `${14 * scale}px ${16 * scale}px`,
        marginBottom: 10 * scale,
        flexShrink: 0,
        border: '1px solid rgba(255,255,255,0.07)',
      }}>
        {/* Status bar: time + battery */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8 * scale,
        }}>
          <span style={{
            fontSize: 30 * scale, fontWeight: 700,
            color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading,
          }}>
            3:07 AM
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 * scale }}>
            <div style={{
              width: 20 * scale, height: 10 * scale, border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: 2 * scale, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: '23%', backgroundColor: '#ef4444',
              }} />
            </div>
            <span style={{ fontSize: 12 * scale, color: 'rgba(255,255,255,0.4)', fontFamily: BRAND.fonts.body }}>
              23%
            </span>
          </div>
        </div>

        {/* Red AWS alert card */}
        <div style={{
          backgroundColor: 'rgba(196,112,112,0.12)',
          border: '1px solid rgba(196,112,112,0.3)',
          borderRadius: 10 * scale,
          padding: `${10 * scale}px ${12 * scale}px`,
          display: 'flex', alignItems: 'flex-start', gap: 8 * scale,
        }}>
          <span style={{ fontSize: 16 * scale, color: '#ef4444', flexShrink: 0, lineHeight: 1 }}>&#9888;</span>
          <div>
            <div style={{
              fontSize: 16 * scale, fontWeight: 600, color: '#c47070',
              fontFamily: BRAND.fonts.body, lineHeight: 1.3,
            }}>
              AWS CloudWatch Alert
            </div>
            <div style={{
              fontSize: 15 * scale, color: 'rgba(196,112,112,0.7)',
              fontFamily: BRAND.fonts.body, fontWeight: 300, lineHeight: 1.3,
            }}>
              Production Model Failed &mdash; Pipeline timeout at Stage 3
            </div>
          </div>
        </div>
      </div>

      {/* Two path cards */}
      <div style={{ flex: 1, display: 'flex', gap: 12 * scale, overflow: 'hidden', marginBottom: 10 * scale }}>
        {/* LEFT - Tutorial Graduate (red) */}
        <div style={{
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(196,112,112,0.2)',
          borderRadius: 12,
          padding: `${14 * scale}px ${16 * scale}px`,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6 * scale,
            marginBottom: 12 * scale, paddingBottom: 8 * scale,
            borderBottom: '1px solid rgba(196,112,112,0.2)',
          }}>
            <span style={{ fontSize: 16 * scale, color: '#c47070' }}>&#10007;</span>
            <span style={{
              fontSize: 22 * scale, fontWeight: 700, color: '#c47070',
              fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const, letterSpacing: '0.04em',
            }}>
              Tutorial Graduate
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 * scale, flex: 1 }}>
            {tutorialSteps.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 * scale }}>
                <span style={{
                  fontSize: 17 * scale, fontWeight: 700, color: '#c47070',
                  fontFamily: BRAND.fonts.heading, flexShrink: 0, width: 22 * scale,
                }}>
                  {i + 1}.
                </span>
                <span style={{
                  fontSize: 17 * scale, color: BRAND.colors.textWhite,
                  fontFamily: BRAND.fonts.body, fontWeight: 300, lineHeight: 1.4,
                }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'auto', paddingTop: 10 * scale,
            borderTop: '1px solid rgba(196,112,112,0.15)',
          }}>
            <span style={{
              fontSize: 16 * scale, color: '#c47070',
              fontFamily: BRAND.fonts.body, fontStyle: 'italic', fontWeight: 300,
            }}>
              Still debugging at sunrise
            </span>
          </div>
        </div>

        {/* RIGHT - Bootcamp Graduate (green) */}
        <div style={{
          flex: 1,
          backgroundColor: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(76,195,120,0.2)',
          borderRadius: 12,
          padding: `${14 * scale}px ${16 * scale}px`,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6 * scale,
            marginBottom: 12 * scale, paddingBottom: 8 * scale,
            borderBottom: '1px solid rgba(76,195,120,0.2)',
          }}>
            <span style={{ fontSize: 16 * scale, color: '#4cc378' }}>&#10003;</span>
            <span style={{
              fontSize: 22 * scale, fontWeight: 700, color: '#4cc378',
              fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const, letterSpacing: '0.04em',
            }}>
              Bootcamp Graduate
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 * scale, flex: 1 }}>
            {bootcampSteps.map((step, i) => (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 * scale }}>
                <span style={{
                  fontSize: 17 * scale, fontWeight: 700, color: '#4cc378',
                  fontFamily: BRAND.fonts.heading, flexShrink: 0, width: 22 * scale,
                }}>
                  {i + 1}.
                </span>
                <span style={{
                  fontSize: 17 * scale, color: BRAND.colors.textWhite,
                  fontFamily: BRAND.fonts.body, fontWeight: 300, lineHeight: 1.4,
                }}>
                  {step}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'auto', paddingTop: 10 * scale,
            borderTop: '1px solid rgba(76,195,120,0.15)',
          }}>
            <span style={{
              fontSize: 16 * scale, color: '#4cc378',
              fontFamily: BRAND.fonts.body, fontStyle: 'italic', fontWeight: 300,
            }}>
              Sleeping. Pipeline recovered.
            </span>
          </div>
        </div>
      </div>

      {/* Tech stack pills — GREEN badges, not neon */}
      <div style={{
        display: 'flex', flexWrap: 'wrap' as const, gap: 6 * scale,
        justifyContent: 'center', flexShrink: 0, marginBottom: 8 * scale,
      }}>
        {techStack.map((tech) => (
          <div key={tech} style={{
            backgroundColor: 'rgba(76,195,120,0.07)',
            border: '1px solid rgba(76,195,120,0.2)',
            borderRadius: 6,
            padding: `${4 * scale}px ${12 * scale}px`,
            fontSize: 15 * scale, fontWeight: 500,
            color: '#4cc378', fontFamily: BRAND.fonts.body,
          }}>
            {tech}
          </div>
        ))}
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: 8 * scale, flexShrink: 0 }}>
        {headline ? (
          <h1 style={{
            fontSize: 46 * scale, fontWeight: 900,
            color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading,
            lineHeight: 1.1, textTransform: 'uppercase' as const, margin: 0,
          }}>
            {headline}
          </h1>
        ) : (
          <h1 style={{
            fontSize: 46 * scale, fontWeight: 900,
            fontFamily: BRAND.fonts.heading, lineHeight: 1.15,
            textTransform: 'uppercase' as const, margin: 0,
          }}>
            <span style={{ color: BRAND.colors.textWhite }}>WE DON&apos;T JUST TEACH YOU TO BUILD MODELS.</span>
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
