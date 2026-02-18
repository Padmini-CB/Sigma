import React from 'react';
import { BRAND } from '@/styles/brand-constants';
import { PadminiLogo } from '@/components/visual-elements/PadminiLogo';
import { getAdSizeConfig } from '@/config/adSizes';

interface YouTubeThumbnailTemplateProps {
  headline?: string;
  subheadline?: string;
  cta?: string;
  courseName?: string;
  badges?: string[];
  width?: number;
  height?: number;
}

export function YouTubeThumbnailTemplate({
  headline = 'WILL AI REPLACE SOFTWARE ENGINEERS?',
  subheadline,
  cta: _cta,
  courseName: _courseName,
  badges = ['2026 Update', 'Industry Analysis', 'Career Guide'],
  width = 1280,
  height = 720,
}: YouTubeThumbnailTemplateProps) {
  const { layoutMode } = getAdSizeConfig(width, height);
  const scale = Math.min(width, height) / 720;

  const words = headline.split(' ');
  const lastWord = words[words.length - 1];
  const restWords = words.slice(0, -1).join(' ');

  const headlineBlock = (
    <h1 style={{
      fontSize: 'var(--sigma-headline-size)', fontWeight: 900,
      fontFamily: BRAND.fonts.heading, textTransform: 'uppercase',
      lineHeight: 1.05, margin: 0,
    }}>
      <span style={{ color: 'var(--sigma-headline-color)' }}>{restWords} </span>
      <span style={{ color: 'var(--sigma-headline-accent-color)' }}>{lastWord}</span>
    </h1>
  );

  const subheadlineBlock = subheadline ? (
    <p style={{
      fontSize: 'var(--sigma-subheadline-size)', fontWeight: 300,
      color: 'var(--sigma-body-color)', fontFamily: BRAND.fonts.body,
      margin: 0, lineHeight: 1.4,
    }}>
      {subheadline}
    </p>
  ) : null;

  const badgeRow = badges && badges.length > 0 ? (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 * scale }}>
      {badges.map((badge) => (
        <div key={badge} style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16, padding: `${5 * scale}px ${14 * scale}px`,
        }}>
          <span style={{
            color: BRAND.colors.textWhite, fontSize: 'var(--sigma-label-size)',
            fontWeight: 600, fontFamily: BRAND.fonts.body,
          }}>
            {badge}
          </span>
        </div>
      ))}
    </div>
  ) : null;

  const founderCircle = (
    <div style={{
      width: 220 * scale, height: 220 * scale, borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(67,97,238,0.15) 0%, rgba(199,244,100,0.08) 100%)',
      border: '3px solid rgba(255,255,255,0.12)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
    }}>
      <div style={{
        width: 180 * scale, height: 180 * scale, borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.04)',
        border: '2px solid rgba(255,255,255,0.08)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        <span style={{
          fontSize: 'var(--sigma-card-title-size, 20px)', fontWeight: 700, color: 'rgba(255,255,255,0.2)',
          fontFamily: BRAND.fonts.heading, textTransform: 'uppercase' as const,
          letterSpacing: '0.1em',
        }}>
          FOUNDER
        </span>
      </div>
    </div>
  );

  const logoWatermark = (
    <div style={{
      position: 'absolute', bottom: 14 * scale, right: 18 * scale, opacity: 0.5,
    }}>
      <PadminiLogo />
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

  // ---- YouTube Thumb: Centered headline only, no founder circle ----
  if (layoutMode === 'youtube-thumb') {
    return (
      <div style={{ ...wrapperBase, padding: 24 * scale, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <PadminiLogo />
        </div>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `0 ${12 * scale}px` }}>
          <div style={{ textAlign: 'center' }}>
            {headlineBlock}
            {subheadlineBlock && <div style={{ marginTop: 10 * scale }}>{subheadlineBlock}</div>}
          </div>
        </div>
      </div>
    );
  }

  // ---- Landscape: Wider ratio — 35% founder, 65% text, compact padding ----
  if (layoutMode === 'landscape') {
    return (
      <div style={{ ...wrapperBase, padding: 18 * scale, display: 'flex' }}>
        {/* LEFT (35%) - Founder */}
        <div style={{
          width: '35%', display: 'flex',
          justifyContent: 'center', alignItems: 'center', flexShrink: 0,
        }}>
          {founderCircle}
        </div>

        {/* RIGHT (65%) - Text content */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', gap: 10 * scale, paddingLeft: 8 * scale,
        }}>
          {headlineBlock}
          {subheadlineBlock}
          {badgeRow}
        </div>

        {logoWatermark}
      </div>
    );
  }

  // ---- Story: Stacked vertically — headline, then founder circle ----
  if (layoutMode === 'story') {
    return (
      <div style={{ ...wrapperBase, padding: 28 * scale, display: 'flex', flexDirection: 'column', gap: 18 * scale }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
          <PadminiLogo />
        </div>

        {/* Headline centered */}
        <div style={{ flexShrink: 0, textAlign: 'center', padding: `${12 * scale}px 0` }}>
          {headlineBlock}
          {subheadlineBlock && <div style={{ marginTop: 10 * scale }}>{subheadlineBlock}</div>}
        </div>

        {/* Founder circle centered */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {founderCircle}
        </div>

        {/* Badges at bottom */}
        {badgeRow && (
          <div style={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            {badgeRow}
          </div>
        )}

        {logoWatermark}
      </div>
    );
  }

  // ---- Square / Portrait (default): Original left (40%) + right (60%) layout ----
  return (
    <div style={{
      ...wrapperBase,
      padding: 28 * scale,
      display: 'flex',
    }}>
      {/* LEFT (40%) - Founder placeholder */}
      <div style={{
        width: '40%', display: 'flex',
        justifyContent: 'center', alignItems: 'center', flexShrink: 0,
      }}>
        {founderCircle}
      </div>

      {/* RIGHT (60%) - Text content */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', gap: 14 * scale, paddingLeft: 10 * scale,
      }}>
        {headlineBlock}
        {subheadlineBlock}
        {badgeRow}
      </div>

      {logoWatermark}
    </div>
  );
}
