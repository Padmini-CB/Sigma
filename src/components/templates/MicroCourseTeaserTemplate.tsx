import { BRAND } from '@/styles/brand-constants';
import { CodebasicsLogo } from '@/components/visual-elements/CodebasicsLogo';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { BottomBar } from '@/components/visual-elements/BottomBar';

interface MicroCourseTeaserTemplateProps {
  headline?: string;
  cta?: string;
  courseName?: string;
  width?: number;
  height?: number;
}

const COURSES = [
  {
    emoji: '\u{1F4CA}',
    name: 'SQL Fundamentals',
    description: 'Master queries with real business data',
    stats: '12 hrs \u2022 3 projects',
    price: '\u20B9499',
    progressColor: '#3b82f6',
  },
  {
    emoji: '\u{1F40D}',
    name: 'Python for Data',
    description: 'From basics to automation scripts',
    stats: '18 hrs \u2022 4 projects',
    price: '\u20B9799',
    progressColor: '#4cc378',
  },
  {
    emoji: '\u{1F4C8}',
    name: 'Excel Mastery',
    description: 'Advanced formulas & pivot tables',
    stats: '10 hrs \u2022 2 projects',
    price: '\u20B9499',
    progressColor: '#8B5CF6',
  },
  {
    emoji: '\u{1F4C9}',
    name: 'Power BI',
    description: 'Build dashboards that tell stories',
    stats: '15 hrs \u2022 3 projects',
    price: '\u20B9999',
    progressColor: '#c7f464',
  },
];

const LEARNING_PATH_STEPS = ['Micro Course', 'Full Bootcamp', 'Career Ready'];

export function MicroCourseTeaserTemplate({
  headline = 'START SMALL. BUILD BIG.',
  cta = 'EXPLORE COURSES',
  courseName = 'Codebasics Micro Courses',
  width = 1080,
  height = 1080,
}: MicroCourseTeaserTemplateProps) {
  const scale = Math.min(width, height) / 1080;

  // Split headline at the period+space boundary for two-tone rendering
  const headlineParts = headline.split('. ');
  const firstPart = headlineParts[0] + (headlineParts.length > 1 ? '.' : '');
  const secondPart = headlineParts.length > 1 ? ' ' + headlineParts.slice(1).join('. ') : '';

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexShrink: 0,
          marginBottom: 10 * scale,
        }}
      >
        <CodebasicsLogo />
        <YouTubeBadge />
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: 16 * scale, flexShrink: 0 }}>
        <h1
          style={{
            fontSize: 48 * scale,
            fontWeight: 900,
            fontFamily: BRAND.fonts.heading,
            textTransform: 'uppercase',
            lineHeight: 1.1,
            margin: 0,
          }}
        >
          <span style={{ color: BRAND.colors.textWhite }}>{firstPart}</span>
          <span style={{ color: '#c7f464' }}>{secondPart}</span>
        </h1>
      </div>

      {/* 2x2 Course Grid */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 14 * scale,
          overflow: 'hidden',
        }}
      >
        {COURSES.map((course) => (
          <div
            key={course.name}
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12,
              padding: 16 * scale,
              display: 'flex',
              flexDirection: 'column',
              gap: 6 * scale,
            }}
          >
            {/* Emoji icon */}
            <span style={{ fontSize: 32 * scale, lineHeight: 1.2 }}>{course.emoji}</span>

            {/* Course name */}
            <div
              style={{
                fontSize: 18 * scale,
                fontWeight: 700,
                color: BRAND.colors.textWhite,
                fontFamily: BRAND.fonts.body,
                lineHeight: 1.2,
              }}
            >
              {course.name}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 13 * scale,
                fontWeight: 300,
                color: BRAND.colors.textMuted,
                fontFamily: BRAND.fonts.body,
                lineHeight: 1.4,
              }}
            >
              {course.description}
            </div>

            {/* Stats row */}
            <div
              style={{
                fontSize: 11 * scale,
                fontWeight: 400,
                color: BRAND.colors.textMuted,
                fontFamily: BRAND.fonts.body,
                marginTop: 'auto',
              }}
            >
              {course.stats}
            </div>

            {/* Price */}
            <div
              style={{
                fontSize: 20 * scale,
                fontWeight: 700,
                color: '#c7f464',
                fontFamily: BRAND.fonts.body,
              }}
            >
              {course.price}
            </div>

            {/* Progress bar */}
            <div
              style={{
                width: '100%',
                height: 4,
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: '65%',
                  height: '100%',
                  backgroundColor: course.progressColor,
                  borderRadius: 2,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Learning path arrow section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 0,
          padding: `${14 * scale}px 0`,
          flexShrink: 0,
        }}
      >
        {LEARNING_PATH_STEPS.map((step, index) => (
          <div
            key={step}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 0,
            }}
          >
            {/* Step badge */}
            <div
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20,
                padding: `${6 * scale}px ${16 * scale}px`,
                whiteSpace: 'nowrap',
              }}
            >
              <span
                style={{
                  fontSize: 13 * scale,
                  fontWeight: 600,
                  color: index === LEARNING_PATH_STEPS.length - 1 ? '#c7f464' : BRAND.colors.textWhite,
                  fontFamily: BRAND.fonts.body,
                }}
              >
                {step}
              </span>
            </div>

            {/* Arrow between steps */}
            {index < LEARNING_PATH_STEPS.length - 1 && (
              <svg
                width={32 * scale}
                height={16 * scale}
                viewBox="0 0 32 16"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <line
                  x1="0"
                  y1="8"
                  x2="24"
                  y2="8"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                />
                <path
                  d="M20 3L27 8L20 13"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0 }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
