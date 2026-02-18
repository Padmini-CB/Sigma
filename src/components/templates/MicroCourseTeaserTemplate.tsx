import React from 'react';
import { BRAND } from '@/styles/brand-constants';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { getAdSizeConfig } from '@/config/adSizes';

interface MicroCourseTeaserTemplateProps {
  headline?: string;
  cta?: string;
  courseName?: string;
  width?: number;
  height?: number;
}

function SqlIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="10" rx="13" ry="5" fill="#3b82f6" opacity="0.25" />
      <ellipse cx="20" cy="10" rx="13" ry="5" stroke="#3b82f6" strokeWidth="2" fill="none" />
      <path d="M7 10v20c0 2.76 5.82 5 13 5s13-2.24 13-5V10" stroke="#3b82f6" strokeWidth="2" fill="none" />
      <path d="M7 20c0 2.76 5.82 5 13 5s13-2.24 13-5" stroke="#3b82f6" strokeWidth="1.5" opacity="0.5" fill="none" />
    </svg>
  );
}

function PythonIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 4c-5 0-9 1.5-9 5v4h9v1.5H9.5C5.5 14.5 3 18 3 22.5s2 8 6.5 8H13v-4.5c0-3 2.5-5.5 5.5-5.5h9c2.5 0 4.5-2 4.5-4.5v-7C32 5.5 26 4 20 4zm-5 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill="#4cc378" />
      <path d="M20 36c5 0 9-1.5 9-5v-4h-9v-1.5h10.5c4 0 6.5-3.5 6.5-8s-2-8-6.5-8H27v4.5c0 3-2.5 5.5-5.5 5.5h-9c-2.5 0-4.5 2-4.5 4.5v7c0 3.5 6 4.5 12 4.5zm5-3a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" fill="#4cc378" opacity="0.65" />
    </svg>
  );
}

function ExcelIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="5" y="5" width="30" height="30" rx="3" stroke="#8B5CF6" strokeWidth="2" fill="#8B5CF6" fillOpacity="0.12" />
      <line x1="5" y1="14" x2="35" y2="14" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.5" />
      <line x1="5" y1="23" x2="35" y2="23" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.5" />
      <line x1="17" y1="5" x2="17" y2="35" stroke="#8B5CF6" strokeWidth="1.5" opacity="0.5" />
      <path d="M8 18l6 8M14 18l-6 8" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function PowerBIIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="6" y="22" width="6" height="14" rx="1.5" fill="#c7f464" opacity="0.45" />
      <rect x="14" y="14" width="6" height="22" rx="1.5" fill="#c7f464" opacity="0.65" />
      <rect x="22" y="8" width="6" height="28" rx="1.5" fill="#c7f464" opacity="0.85" />
      <rect x="30" y="4" width="6" height="32" rx="1.5" fill="#c7f464" />
    </svg>
  );
}

const COURSE_ICONS: Record<string, (size: number) => React.ReactNode> = {
  sql: (s) => <SqlIcon size={s} />,
  python: (s) => <PythonIcon size={s} />,
  excel: (s) => <ExcelIcon size={s} />,
  powerbi: (s) => <PowerBIIcon size={s} />,
};

const COURSES = [
  { iconKey: 'sql', name: 'SQL Fundamentals', description: 'Master queries with real business data', stats: '12 hrs \u2022 3 projects', price: '\u20B9499', progressColor: '#3b82f6' },
  { iconKey: 'python', name: 'Python for Data', description: 'From basics to automation scripts', stats: '18 hrs \u2022 4 projects', price: '\u20B9799', progressColor: '#4cc378' },
  { iconKey: 'excel', name: 'Excel Mastery', description: 'Advanced formulas & pivot tables', stats: '10 hrs \u2022 2 projects', price: '\u20B9499', progressColor: '#8B5CF6' },
  { iconKey: 'powerbi', name: 'Power BI', description: 'Build dashboards that tell stories', stats: '15 hrs \u2022 3 projects', price: '\u20B9999', progressColor: '#c7f464' },
];

const LEARNING_PATH_STEPS = ['Micro Course', 'Full Bootcamp', 'Career Ready'];

export function MicroCourseTeaserTemplate({
  headline = 'START SMALL. BUILD BIG.',
  cta = 'EXPLORE COURSES',
  courseName = 'Padmini Micro Courses',
  width = 1080,
  height = 1080,
}: MicroCourseTeaserTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const headlineParts = headline.split('. ');
  const firstPart = headlineParts[0] + (headlineParts.length > 1 ? '.' : '');
  const secondPart = headlineParts.length > 1 ? ' ' + headlineParts.slice(1).join('. ') : '';

  const topBar = (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0,
    }}>
      <PadminiLogo />
      <YouTubeBadge layoutMode={layoutMode} />
    </div>
  );

  const headlineBlock = (
    <div style={{ textAlign: 'center', flexShrink: 0 }}>
      <h1 style={{
        fontSize: 'var(--sigma-headline-size)', fontWeight: 900, fontFamily: BRAND.fonts.heading,
        textTransform: 'uppercase', lineHeight: 1.1, margin: 0,
      }}>
        <span style={{ color: 'var(--sigma-headline-color)' }}>{firstPart}</span>
        <span style={{ color: 'var(--sigma-headline-accent-color)' }}>{secondPart}</span>
      </h1>
    </div>
  );

  const renderCourseCard = (course: typeof COURSES[number]) => (
    <div key={course.name} style={{
      backgroundColor: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 12, padding: `${14 * scale}px ${16 * scale}px`,
      display: 'flex', flexDirection: 'column', gap: 5 * scale,
    }}>
      <div style={{ width: 38 * scale, height: 38 * scale, flexShrink: 0 }}>
        {COURSE_ICONS[course.iconKey]?.(38 * scale)}
      </div>
      <div style={{
        fontSize: 'var(--sigma-card-title-size)', fontWeight: 700, color: BRAND.colors.textWhite,
        fontFamily: BRAND.fonts.body, lineHeight: 1.2,
      }}>
        {course.name}
      </div>
      <div style={{
        fontSize: 'var(--sigma-body-size)', fontWeight: 300, color: 'var(--sigma-body-color)',
        fontFamily: BRAND.fonts.body, lineHeight: 1.4,
      }}>
        {course.description}
      </div>
      <div style={{
        fontSize: 'var(--sigma-label-size)', fontWeight: 400, color: 'var(--sigma-body-color)',
        fontFamily: BRAND.fonts.body, marginTop: 'auto',
      }}>
        {course.stats}
      </div>
      <div style={{
        fontSize: 'var(--sigma-stat-number-size)', fontWeight: 700, color: 'var(--sigma-stat-color)', fontFamily: BRAND.fonts.body,
      }}>
        {course.price}
      </div>
      <div style={{
        width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 2, overflow: 'hidden',
      }}>
        <div style={{
          width: '65%', height: '100%',
          backgroundColor: course.progressColor, borderRadius: 2,
        }} />
      </div>
    </div>
  );

  const learningPath = (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      gap: 0, padding: `${10 * scale}px 0`, flexShrink: 0,
    }}>
      {LEARNING_PATH_STEPS.map((step, index) => (
        <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 20, padding: `${5 * scale}px ${14 * scale}px`, whiteSpace: 'nowrap',
          }}>
            <span style={{
              fontSize: 'var(--sigma-label-size)', fontWeight: 600,
              color: index === LEARNING_PATH_STEPS.length - 1 ? 'var(--sigma-stat-color)' : BRAND.colors.textWhite,
              fontFamily: BRAND.fonts.body,
            }}>
              {step}
            </span>
          </div>
          {index < LEARNING_PATH_STEPS.length - 1 && (
            <svg width={28 * scale} height={14 * scale} viewBox="0 0 28 14" fill="none" style={{ flexShrink: 0 }}>
              <line x1="0" y1="7" x2="20" y2="7" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <path d="M17 3L24 7L17 11" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
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

  // ---- YouTube Thumb: Centered headline only, no cards, no bottom bar ----
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

  // ---- Landscape: 4x1 row of cards, compact padding ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ marginBottom: 6 * scale }}>
          {headlineBlock}
        </div>

        {/* Course Grid: 4x1 row */}
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gridTemplateRows: '1fr',
          gap: 8 * scale, overflow: 'hidden',
        }}>
          {COURSES.map(renderCourseCard)}
        </div>

        {learningPath}

        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: 2x2 with more spacing, generous gaps ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 14 * scale }}>
        {topBar}
        <div style={{ padding: `${8 * scale}px 0` }}>
          {headlineBlock}
        </div>

        {/* Course Grid: 2x2 with generous spacing */}
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: 16 * scale, overflow: 'hidden',
        }}>
          {COURSES.map(renderCourseCard)}
        </div>

        {learningPath}

        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait (default): Original 2x2 layout ----
  return (
    <div style={{
      ...wrapperBase,
      padding: 24 * scale,
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ marginBottom: 6 * scale }}>
        {topBar}
      </div>

      <div style={{ marginBottom: 10 * scale }}>
        {headlineBlock}
      </div>

      {/* 2x2 Course Grid */}
      <div style={{
        flex: 1, display: 'grid',
        gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr',
        gap: 12 * scale, overflow: 'hidden',
      }}>
        {COURSES.map(renderCourseCard)}
      </div>

      {learningPath}

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0 }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
