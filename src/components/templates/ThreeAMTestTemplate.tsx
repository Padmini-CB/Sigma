import { BRAND } from '@/styles/brand-constants';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

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
  const { layoutMode } = getAdSizeConfig(width, height);
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

  const headlineBlock = headline ? (
    <h1 style={{
      fontSize: 'var(--sigma-subheadline-size)', fontWeight: 900,
      color: BRAND.colors.textWhite, fontFamily: BRAND.fonts.heading,
      lineHeight: 1.1, textTransform: 'uppercase' as const, margin: 0,
    }}>
      {headline}
    </h1>
  ) : (
    <h1 style={{
      fontSize: 'var(--sigma-subheadline-size)', fontWeight: 900,
      fontFamily: BRAND.fonts.heading, lineHeight: 1.15,
      textTransform: 'uppercase' as const, margin: 0,
    }}>
      <span style={{ color: BRAND.colors.textWhite }}>WE DON&apos;T JUST TEACH YOU TO BUILD MODELS.</span>
      <br />
      <span style={{ color: 'var(--sigma-headline-accent-color)' }}>WE TEACH YOU TO FIX THEM.</span>
    </h1>
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

  // Shared phone mockup component
  const phoneMockup = (phoneScale: number = 1) => (
    <div style={{
      borderRadius: 28 * scale * phoneScale,
      border: '2px solid rgba(255,255,255,0.15)',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: `${12 * scale * phoneScale}px ${18 * scale * phoneScale}px ${14 * scale * phoneScale}px`,
      flexShrink: 0,
      position: 'relative',
    }}>
      {/* Phone notch */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 6 * scale * phoneScale,
      }}>
        <div style={{
          width: 60 * scale * phoneScale,
          height: 6 * scale * phoneScale,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.1)',
        }} />
      </div>

      {/* Status bar: WiFi, Signal, Battery */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8 * scale * phoneScale,
        marginBottom: 4 * scale * phoneScale,
      }}>
        {/* WiFi icon */}
        <svg width={14 * scale * phoneScale} height={12 * scale * phoneScale} viewBox="0 0 16 14" fill="none">
          <path d="M8 12.5a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4Z" fill="rgba(255,255,255,0.5)" />
          <path d="M5.2 9.2a4 4 0 0 1 5.6 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M3 6.6a7 7 0 0 1 10 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round" />
          <path d="M0.8 4a10.2 10.2 0 0 1 14.4 0" stroke="rgba(255,255,255,0.5)" strokeWidth="1.3" strokeLinecap="round" />
        </svg>

        {/* Signal bars */}
        <svg width={14 * scale * phoneScale} height={12 * scale * phoneScale} viewBox="0 0 16 12" fill="none">
          <rect x="0" y="9" width="3" height="3" rx="0.5" fill="rgba(255,255,255,0.5)" />
          <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="rgba(255,255,255,0.5)" />
          <rect x="9" y="3" width="3" height="9" rx="0.5" fill="rgba(255,255,255,0.5)" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="rgba(255,255,255,0.5)" />
        </svg>

        {/* Battery icon with 23% red fill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 * scale * phoneScale }}>
          <div style={{
            width: 22 * scale * phoneScale,
            height: 11 * scale * phoneScale,
            border: '1.5px solid rgba(255,255,255,0.4)',
            borderRadius: 3 * scale * phoneScale,
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
            width: 2 * scale * phoneScale,
            height: 5 * scale * phoneScale,
            backgroundColor: 'rgba(255,255,255,0.4)',
            borderRadius: 1,
          }} />
          <span style={{
            fontSize: 'var(--sigma-label-size, 10px)',
            color: 'rgba(255,255,255,0.4)',
            fontFamily: BRAND.fonts.body,
            marginLeft: 2 * scale * phoneScale,
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
        marginBottom: 2 * scale * phoneScale,
      }}>
        <span style={{
          fontSize: 'var(--sigma-headline-size, 56px)',
          fontWeight: 900,
          color: '#ffffff',
          fontFamily: BRAND.fonts.heading,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          3:07
        </span>
        <span style={{
          fontSize: 'var(--sigma-subheadline-size, 24px)',
          fontWeight: 700,
          color: '#ffffff',
          fontFamily: BRAND.fonts.heading,
          marginLeft: 6 * scale * phoneScale,
          lineHeight: 1,
        }}>
          AM
        </span>
      </div>

      {/* Date */}
      <div style={{
        textAlign: 'center',
        marginBottom: 10 * scale * phoneScale,
      }}>
        <span style={{
          fontSize: 'var(--sigma-label-size, 13px)',
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
        borderRadius: 10 * scale * phoneScale,
        padding: `${10 * scale * phoneScale}px ${12 * scale * phoneScale}px`,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8 * scale * phoneScale,
      }}>
        <span style={{ fontSize: 'var(--sigma-body-size, 18px)', flexShrink: 0, lineHeight: 1 }}>{'\u26A0\uFE0F'}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 2 * scale * phoneScale,
          }}>
            <span style={{
              fontSize: 'var(--sigma-body-size, 16px)', fontWeight: 600, color: '#c47070',
              fontFamily: BRAND.fonts.body, lineHeight: 1.3,
            }}>
              AWS CloudWatch Alert
            </span>
            <span style={{
              fontSize: 'var(--sigma-label-size, 10px)',
              fontWeight: 700,
              color: '#ffffff',
              backgroundColor: '#ef4444',
              borderRadius: 20,
              padding: `${2 * scale * phoneScale}px ${8 * scale * phoneScale}px`,
              textTransform: 'uppercase' as const,
              letterSpacing: '0.05em',
              lineHeight: 1.4,
            }}>
              CRITICAL
            </span>
          </div>
          <div style={{
            fontSize: 'var(--sigma-label-size, 14px)', color: 'rgba(196,112,112,0.7)',
            fontFamily: BRAND.fonts.body, fontWeight: 300, lineHeight: 1.3,
          }}>
            Production Model Failed &mdash; Pipeline timeout at Stage 3
          </div>
        </div>
      </div>
    </div>
  );

  // Shared comparison card renderer
  const comparisonCard = (
    title: string,
    emoji: string,
    steps: { emoji: string; text: string }[],
    color: string,
    tagline: string,
    cardScale: number = 1,
  ) => (
    <div style={{
      flex: 1,
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: `1px solid ${color === '#c47070' ? 'rgba(196,112,112,0.2)' : 'rgba(76,195,120,0.2)'}`,
      borderRadius: 12,
      padding: `${14 * scale * cardScale}px ${16 * scale * cardScale}px`,
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6 * scale * cardScale,
        marginBottom: 12 * scale * cardScale, paddingBottom: 8 * scale * cardScale,
        borderBottom: `1px solid ${color === '#c47070' ? 'rgba(196,112,112,0.2)' : 'rgba(76,195,120,0.2)'}`,
      }}>
        <span style={{ fontSize: 'var(--sigma-card-title-size, 20px)', lineHeight: 1 }}>{emoji}</span>
        <span style={{
          fontSize: 'var(--sigma-card-title-size, 20px)', fontWeight: 700, color,
          fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const, letterSpacing: '0.04em',
        }}>
          {title}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 * scale * cardScale, flex: 1 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 * scale * cardScale }}>
            <span style={{
              fontSize: 'var(--sigma-body-size, 17px)', flexShrink: 0, lineHeight: 1.3,
            }}>
              {step.emoji}
            </span>
            <span style={{
              fontSize: 'var(--sigma-body-size, 17px)', color: BRAND.colors.textWhite,
              fontFamily: BRAND.fonts.body, fontWeight: 300, lineHeight: 1.4,
            }}>
              {step.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 'auto', paddingTop: 10 * scale * cardScale,
        borderTop: `1px solid ${color === '#c47070' ? 'rgba(196,112,112,0.15)' : 'rgba(76,195,120,0.15)'}`,
      }}>
        <span style={{
          fontSize: 'var(--sigma-label-size, 15px)', color,
          fontFamily: BRAND.fonts.body, fontStyle: 'italic', fontWeight: 300,
        }}>
          {tagline}
        </span>
      </div>
    </div>
  );

  // ---- YouTube Thumb: Bold headline only, no phone, no cards, no bottom bar ----
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

  // ---- Landscape: Phone left, comparison cards right ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>

        {/* Main content: Phone left, cards right */}
        <div style={{ flex: 1, display: 'flex', gap: 12 * scale, overflow: 'hidden' }}>
          {/* Left: Phone mockup (40%) */}
          <div style={{ width: '40%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {phoneMockup(0.85)}
          </div>

          {/* Right: Two comparison cards stacked (60%) */}
          <div style={{ flex: 1, display: 'flex', gap: 8 * scale, overflow: 'hidden' }}>
            {comparisonCard('Tutorial Graduate', '\u{1F630}', tutorialSteps, '#c47070', 'Still debugging at sunrise', 0.85)}
            {comparisonCard('Bootcamp Graduate', '\u{1F60E}', bootcampSteps, '#4cc378', 'Sleeping. Pipeline recovered.', 0.85)}
          </div>
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', margin: `${4 * scale}px 0`, flexShrink: 0 }}>
          {headlineBlock}
        </div>

        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: Stack phone on top, cards below, generous spacing ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {topBar}

        {/* Phone mockup */}
        <div style={{ flexShrink: 0 }}>
          {phoneMockup()}
        </div>

        {/* Two path cards - stacked vertically with generous spacing */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 * scale, overflow: 'hidden' }}>
          {comparisonCard('Tutorial Graduate', '\u{1F630}', tutorialSteps, '#c47070', 'Still debugging at sunrise')}
          {comparisonCard('Bootcamp Graduate', '\u{1F60E}', bootcampSteps, '#4cc378', 'Sleeping. Pipeline recovered.')}
        </div>

        {/* Tech stack pills */}
        <div style={{
          display: 'flex', flexWrap: 'wrap' as const, gap: 8 * scale,
          justifyContent: 'center', flexShrink: 0,
        }}>
          {techStack.map((tech) => (
            <div key={tech} style={{
              backgroundColor: 'rgba(76,195,120,0.07)',
              border: '1px solid rgba(76,195,120,0.2)',
              borderRadius: 6,
              padding: `${5 * scale}px ${14 * scale}px`,
              fontSize: 'var(--sigma-label-size, 14px)', fontWeight: 500,
              color: '#4cc378', fontFamily: BRAND.fonts.body,
            }}>
              {tech}
            </div>
          ))}
        </div>

        {/* Headline */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          {headlineBlock}
        </div>

        {/* Bottom Bar */}
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait (default): Original layout ----
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
              fontSize: 'var(--sigma-label-size, 10px)',
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
            fontSize: 'var(--sigma-headline-size, 56px)',
            fontWeight: 900,
            color: '#ffffff',
            fontFamily: BRAND.fonts.heading,
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}>
            3:07
          </span>
          <span style={{
            fontSize: 'var(--sigma-subheadline-size, 24px)',
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
            fontSize: 'var(--sigma-label-size, 13px)',
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
          <span style={{ fontSize: 'var(--sigma-body-size, 18px)', flexShrink: 0, lineHeight: 1 }}>{'\u26A0\uFE0F'}</span>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 2 * scale,
            }}>
              <span style={{
                fontSize: 'var(--sigma-body-size, 16px)', fontWeight: 600, color: '#c47070',
                fontFamily: BRAND.fonts.body, lineHeight: 1.3,
              }}>
                AWS CloudWatch Alert
              </span>
              <span style={{
                fontSize: 'var(--sigma-label-size, 10px)',
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
              fontSize: 'var(--sigma-label-size, 14px)', color: 'rgba(196,112,112,0.7)',
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
            <span style={{ fontSize: 'var(--sigma-card-title-size, 20px)', lineHeight: 1 }}>{'\u{1F630}'}</span>
            <span style={{
              fontSize: 'var(--sigma-card-title-size, 20px)', fontWeight: 700, color: '#c47070',
              fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const, letterSpacing: '0.04em',
            }}>
              Tutorial Graduate
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 * scale, flex: 1 }}>
            {tutorialSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 * scale }}>
                <span style={{
                  fontSize: 'var(--sigma-body-size, 17px)', flexShrink: 0, lineHeight: 1.3,
                }}>
                  {step.emoji}
                </span>
                <span style={{
                  fontSize: 'var(--sigma-body-size, 17px)', color: BRAND.colors.textWhite,
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
              fontSize: 'var(--sigma-label-size, 15px)', color: '#c47070',
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
            <span style={{ fontSize: 'var(--sigma-card-title-size, 20px)', lineHeight: 1 }}>{'\u{1F60E}'}</span>
            <span style={{
              fontSize: 'var(--sigma-card-title-size, 20px)', fontWeight: 700, color: '#4cc378',
              fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const, letterSpacing: '0.04em',
            }}>
              Bootcamp Graduate
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 * scale, flex: 1 }}>
            {bootcampSteps.map((step, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 * scale }}>
                <span style={{
                  fontSize: 'var(--sigma-body-size, 17px)', flexShrink: 0, lineHeight: 1.3,
                }}>
                  {step.emoji}
                </span>
                <span style={{
                  fontSize: 'var(--sigma-body-size, 17px)', color: BRAND.colors.textWhite,
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
              fontSize: 'var(--sigma-label-size, 15px)', color: '#4cc378',
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
            fontSize: 'var(--sigma-label-size, 14px)', fontWeight: 500,
            color: '#4cc378', fontFamily: BRAND.fonts.body,
          }}>
            {tech}
          </div>
        ))}
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: 8 * scale, flexShrink: 0 }}>
        {headlineBlock}
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0 }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
