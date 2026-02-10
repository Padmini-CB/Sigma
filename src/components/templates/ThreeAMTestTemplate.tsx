import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';

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
    { emoji: '\u{1F50D}', text: 'Google the error' },
    { emoji: '\u{1F4CB}', text: 'Copy from StackOverflow' },
    { emoji: '\u{1F64F}', text: 'Push and pray' },
    { emoji: '\u{1F635}', text: 'Still debugging at sunrise' },
  ];

  const bootcampSteps = [
    { emoji: '\u{1F4CA}', text: 'Check CloudWatch logs' },
    { emoji: '\u{1F50E}', text: 'Identify pipeline failure' },
    { emoji: '\u{1F527}', text: 'Fix, test, redeploy' },
    { emoji: '\u{1F634}', text: 'Back to sleep by 3:30 AM' },
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
        <PadminiLogo />
        <YouTubeBadge />
      </div>

      {/* Phone Screen UI */}
      <div style={{
        borderRadius: 28 * scale,
        border: '2px solid rgba(255,255,255,0.15)',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: `${12 * scale}px ${18 * scale}px ${14 * scale}px`,
        marginBottom: 10 * scale,
        flexShrink: 0,
        position: 'relative',
      }}>
        {/* Phone notch */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 6 * scale,
        }}>
          <div style={{
            width: 60 * scale,
            height: 6 * scale,
            borderRadius: 4,
            backgroundColor: 'rgba(255,255,255,0.1)',
          }} />
        </div>

        {/* Status bar: WiFi, Signal, Battery */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 8 * scale,
          marginBottom: 4 * scale,
        }}>
          {/* WiFi icon - 3 curved bars */}
          <svg width={14 * scale} height={12 * scale} viewBox="0 0 16 14" fill="none">
            <path d="M8 12.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" fill="rgba(255,255,255,0.5)" />
            <path d="M5.2 9.2a4 4 0 0 1 5.6 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M3 6.6a7 7 0 0 1 10 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round" />
            <path d="M0.8 4a10.2 10.2 0 0 1 14.4 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round" />
          </svg>

          {/* Signal bars - 4 bars */}
          <svg width={14 * scale} height={12 * scale} viewBox="0 0 16 12" fill="none">
            <rect x="0" y="9" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.5)" />
            <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="rgba(255,255,255,0.5)" />
            <rect x="9" y="3" width="3" height="9" rx="0.5" fill="rgba(255,255,255,0.5)" />
            <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="rgba(255,255,255,0.5)" />
          </svg>

          {/* Battery icon with 23% red fill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 * scale }}>
            <div style={{
              width: 22 * scale,
              height: 11 * scale,
              border: '1.5px solid rgba(255,255,255,0.4)',
              borderRadius: 3 * scale,
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', left: 0, top: 0, bottom: 0,
                width: '23%',
                backgroundColor: '#ef4444',
              }} />
            </div>
            <div style={{
              width: 2 * scale,
              height: 5 * scale,
              backgroundColor: 'rgba(255,255,255,0.4)',
              borderRadius: 1,
            }} />
            <span style={{
              fontSize: 10 * scale,
              color: 'rgba(255,255,255,0.4)',
              fontFamily: BRAND.fonts.body,
              marginLeft: 2 * scale,
            }}>
              23%
            </span>
          </div>
        </div>

        {/* Dramatic Clock */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          marginBottom: 2 * scale,
        }}>
          <span style={{
            fontSize: 56 * scale,
            fontWeight: 900,
            color: '#ffffff',
            fontFamily: BRAND.fonts.heading,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            3:07
          </span>
          <span style={{
            fontSize: 24 * scale,
            fontWeight: 700,
            color: '#ffffff',
            fontFamily: BRAND.fonts.heading,
            marginLeft: 6 * scale,
            lineHeight: 1,
          }}>
            AM
          </span>
        </div>

        {/* Date */}
        <div style={{
          textAlign: 'center',
          marginBottom: 10 * scale,
        }}>
          <span style={{
            fontSize: 13 * scale,
            color: 'rgba(255,255,255,0.45)',
            fontFamily: BRAND.fonts.body,
            fontWeight: 300,
          }}>
            Tuesday, January 28
          </span>
        </div>

        {/* AWS Alert notification card */}
        <div style={{
          backgroundColor: 'rgba(196,112,112,0.12)',
          border: '1px solid rgba(196,112,112,0.3)',
          borderRadius: 10 * scale,
          padding: `${10 * scale}px ${12 * scale}px`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 8 * scale,
        }}>
          <span style={{ fontSize: 18 * scale, flexShrink: 0, lineHeight: 1 }}>{'\u26A0\uFE0F'}</span>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 2 * scale,
            }}>
              <span style={{
                fontSize: 16 * scale, fontWeight: 600, color: '#c47070',
                fontFamily: BRAND.fonts.body, lineHeight: 1.3,
              }}>
                AWS CloudWatch Alert
              </span>
              <span style={{
                fontSize: 10 * scale,
                fontWeight: 700,
                color: '#ffffff',
                backgroundColor: '#ef4444',
                borderRadius: 20,
                padding: `${2 * scale}px ${8 * scale}px`,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.05em',
                lineHeight: 1.4,
              }}>
                CRITICAL
              </span>
            </div>
            <div style={{
              fontSize: 14 * scale, color: 'rgba(196,112,112,0.7)',
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
            <span style={{ fontSize: 20 * scale, lineHeight: 1 }}>{'\u{1F630}'}</span>
            <span style={{
              fontSize: 20 * scale, fontWeight: 700, color: '#c47070',
              fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const, letterSpacing: '0.04em',
            }}>
              Tutorial Graduate
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 * scale, flex: 1 }}>
            {tutorialSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 * scale }}>
                <span style={{
                  fontSize: 17 * scale, flexShrink: 0, lineHeight: 1.3,
                }}>
                  {step.emoji}
                </span>
                <span style={{
                  fontSize: 17 * scale, color: BRAND.colors.textWhite,
                  fontFamily: BRAND.fonts.body, fontWeight: 300, lineHeight: 1.4,
                }}>
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'auto', paddingTop: 10 * scale,
            borderTop: '1px solid rgba(196,112,112,0.15)',
          }}>
            <span style={{
              fontSize: 15 * scale, color: '#c47070',
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
            <span style={{ fontSize: 20 * scale, lineHeight: 1 }}>{'\u{1F60E}'}</span>
            <span style={{
              fontSize: 20 * scale, fontWeight: 700, color: '#4cc378',
              fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const, letterSpacing: '0.04em',
            }}>
              Bootcamp Graduate
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 * scale, flex: 1 }}>
            {bootcampSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 * scale }}>
                <span style={{
                  fontSize: 17 * scale, flexShrink: 0, lineHeight: 1.3,
                }}>
                  {step.emoji}
                </span>
                <span style={{
                  fontSize: 17 * scale, color: BRAND.colors.textWhite,
                  fontFamily: BRAND.fonts.body, fontWeight: 300, lineHeight: 1.4,
                }}>
                  {step.text}
                </span>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 'auto', paddingTop: 10 * scale,
            borderTop: '1px solid rgba(76,195,120,0.15)',
          }}>
            <span style={{
              fontSize: 15 * scale, color: '#4cc378',
              fontFamily: BRAND.fonts.body, fontStyle: 'italic', fontWeight: 300,
            }}>
              Sleeping. Pipeline recovered.
            </span>
          </div>
        </div>
      </div>

      {/* Tech stack pills */}
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
            fontSize: 14 * scale, fontWeight: 500,
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
            fontSize: 42 * scale, fontWeight: 900,
            color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading,
            lineHeight: 1.1, textTransform: 'uppercase' as const, margin: 0,
          }}>
            {headline}
          </h1>
        ) : (
          <h1 style={{
            fontSize: 42 * scale, fontWeight: 900,
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
