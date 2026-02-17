import { BRAND } from '@/styles/brand-constants';
import { TechStackPills } from '@/components/visual-elements/TechStackPills';
import { BottomBar } from '@/components/visual-elements/BottomBar';
import { YouTubeBadge } from '@/components/visual-elements/YouTubeBadge';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

interface SocialAnnouncementTemplateProps {
  headline?: string;
  subheadline?: string;
  bodyText?: string;
  cta?: string;
  courseName?: string;
  techStack?: string[];
  credibility?: string;
  width?: number;
  height?: number;
}

export function SocialAnnouncementTemplate({
  headline = 'NEW BATCH STARTING SOON',
  subheadline = 'Join 44K+ learners building real-world data skills',
  bodyText = '10 Weeks \u2022 7 Projects \u2022 2 Virtual Internships \u2022 Discord Community',
  cta = 'RESERVE YOUR SPOT',
  courseName = 'Data Engineering Bootcamp 1.0',
  techStack = ['SQL', 'Python', 'Spark', 'Databricks', 'AWS', 'Snowflake'],
  credibility = 'Lifetime Access \u2022 Job Assistance',
  width = 1080,
  height = 1080,
}: SocialAnnouncementTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 1080;

  const wrapperBase: React.CSSProperties = {
    width,
    height,
    background: BRAND.background,
    fontFamily: BRAND.fonts.body,
    position: 'relative',
    overflow: 'hidden',
    boxSizing: 'border-box',
  };

  const accentLine = (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        background: `linear-gradient(90deg, ${BRAND.colors.primaryBlue}, #4cc378)`,
      }}
    />
  );

  const topBar = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
      <PadminiLogo />
      <YouTubeBadge />
    </div>
  );

  const headlineBlock = (
    <div style={{ textAlign: 'center' }}>
      <h1
        style={{
          fontSize: 'var(--sigma-headline-size)',
          fontWeight: 800,
          color: 'var(--sigma-headline-color)',
          fontFamily: BRAND.fonts.heading,
          lineHeight: 1.0,
          textAlign: 'center',
          margin: 0,
        }}
      >
        {headline}
      </h1>
      <p
        style={{
          fontSize: 'var(--sigma-subheadline-size)',
          color: 'var(--sigma-body-color)',
          fontFamily: BRAND.fonts.body,
          textAlign: 'center',
          margin: 0,
          marginTop: 12 * scale,
          maxWidth: '80%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        {subheadline}
      </p>
    </div>
  );

  // ---- YouTube Thumb: headline + subheadline only, centered ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        {accentLine}
        {topBar}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {headlineBlock}
        </div>
      </div>
    );
  }

  // ---- Landscape: more compact vertical spacing ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex', flexDirection: 'column' }}>
        {accentLine}
        <div style={{ marginBottom: 4 * scale }}>
          {topBar}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 8 * scale }}>
          <h1
            style={{
              fontSize: 'var(--sigma-headline-size)',
              fontWeight: 800,
              color: 'var(--sigma-headline-color)',
              fontFamily: BRAND.fonts.heading,
              lineHeight: 1.0,
              textAlign: 'center',
              margin: 0,
            }}
          >
            {headline}
          </h1>
          <p
            style={{
              fontSize: 'var(--sigma-subheadline-size)',
              color: 'var(--sigma-body-color)',
              fontFamily: BRAND.fonts.body,
              textAlign: 'center',
              margin: 0,
              maxWidth: '80%',
            }}
          >
            {subheadline}
          </p>
          <div
            style={{
              width: 60,
              height: 3,
              borderRadius: 2,
              backgroundColor: 'var(--sigma-stat-color)',
            }}
          />
          <p
            style={{
              fontSize: 'var(--sigma-body-size)',
              color: 'var(--sigma-body-color)',
              fontFamily: BRAND.fonts.body,
              textAlign: 'center',
              margin: 0,
            }}
          >
            {bodyText}
          </p>
          <TechStackPills technologies={techStack} pillSize="sm" />
          <div
            style={{
              fontSize: 'var(--sigma-label-size)',
              color: 'var(--sigma-stat-color)',
              fontFamily: BRAND.fonts.body,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {credibility}
          </div>
        </div>
        <div style={{ flexShrink: 0, marginTop: 4 * scale }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Story: increase spacing, center content ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        {accentLine}
        {topBar}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 18 * scale }}>
          <h1
            style={{
              fontSize: 'var(--sigma-headline-size)',
              fontWeight: 800,
              color: 'var(--sigma-headline-color)',
              fontFamily: BRAND.fonts.heading,
              lineHeight: 1.0,
              textAlign: 'center',
              margin: 0,
            }}
          >
            {headline}
          </h1>
          <p
            style={{
              fontSize: 'var(--sigma-subheadline-size)',
              color: 'var(--sigma-body-color)',
              fontFamily: BRAND.fonts.body,
              textAlign: 'center',
              margin: 0,
              maxWidth: '80%',
            }}
          >
            {subheadline}
          </p>
          <div
            style={{
              width: 60,
              height: 3,
              borderRadius: 2,
              backgroundColor: 'var(--sigma-stat-color)',
            }}
          />
          <p
            style={{
              fontSize: 'var(--sigma-body-size)',
              color: 'var(--sigma-body-color)',
              fontFamily: BRAND.fonts.body,
              textAlign: 'center',
              margin: 0,
            }}
          >
            {bodyText}
          </p>
          <TechStackPills technologies={techStack} pillSize="md" />
          <div
            style={{
              fontSize: 'var(--sigma-label-size)',
              color: 'var(--sigma-stat-color)',
              fontFamily: BRAND.fonts.body,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {credibility}
          </div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <BottomBar courseName={courseName} cta={cta} />
        </div>
      </div>
    );
  }

  // ---- Square / Portrait: Original layout ----
  return (
    <div
      style={{
        ...wrapperBase,
        padding: 24 * scale,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Decorative accent lines */}
      {accentLine}

      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0, marginBottom: 6 * scale }}>
        <PadminiLogo />
        <YouTubeBadge />
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 * scale }}>
        {/* Big headline */}
        <h1
          style={{
            fontSize: 'var(--sigma-headline-size)',
            fontWeight: 800,
            color: 'var(--sigma-headline-color)',
            fontFamily: BRAND.fonts.heading,
            lineHeight: 1.0,
            textAlign: 'center',
            margin: 0,
          }}
        >
          {headline}
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: 'var(--sigma-subheadline-size)',
            color: 'var(--sigma-body-color)',
            fontFamily: BRAND.fonts.body,
            textAlign: 'center',
            margin: 0,
            maxWidth: '80%',
          }}
        >
          {subheadline}
        </p>

        {/* Divider */}
        <div
          style={{
            width: 60,
            height: 3,
            borderRadius: 2,
            backgroundColor: 'var(--sigma-stat-color)',
          }}
        />

        {/* Body text */}
        <p
          style={{
            fontSize: 'var(--sigma-body-size)',
            color: 'var(--sigma-body-color)',
            fontFamily: BRAND.fonts.body,
            textAlign: 'center',
            margin: 0,
          }}
        >
          {bodyText}
        </p>

        {/* Tech Stack */}
        <TechStackPills technologies={techStack} pillSize="md" />

        {/* Credibility */}
        <div
          style={{
            fontSize: 'var(--sigma-label-size)',
            color: 'var(--sigma-stat-color)',
            fontFamily: BRAND.fonts.body,
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {credibility}
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ flexShrink: 0, marginTop: 8 * scale }}>
        <BottomBar courseName={courseName} cta={cta} />
      </div>
    </div>
  );
}
