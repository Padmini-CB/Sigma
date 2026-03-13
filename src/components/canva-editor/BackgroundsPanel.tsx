'use client';

import React, { useState, useCallback } from 'react';

export interface BrandBackground {
  id: string;
  label: string;
  css: string; // CSS value for background property
  type: 'solid' | 'gradient';
}

// ── Solid brand colors ──
const SOLID_BACKGROUNDS: BrandBackground[] = [
  { id: 'navy', label: 'Navy', css: '#181830', type: 'solid' },
  { id: 'pure-dark', label: 'Pure Dark', css: '#0D1117', type: 'solid' },
  { id: 'blue', label: 'Blue', css: '#3B82F6', type: 'solid' },
  { id: 'black', label: 'Black', css: '#000000', type: 'solid' },
];

// ── Gradient presets (brand-compliant) ──
const GRADIENT_PRESETS: BrandBackground[] = [
  {
    id: 'navy-depth',
    label: 'Navy Depth',
    css: 'linear-gradient(180deg, #181830 0%, #0D0D1F 60%, #080810 100%)',
    type: 'gradient',
  },
  {
    id: 'blue-glow',
    label: 'Blue Glow',
    css: 'radial-gradient(ellipse 80% 50% at 50% 0%, #1a2a4a 0%, #0D1117 60%, #080810 100%)',
    type: 'gradient',
  },
  {
    id: 'brand-blue',
    label: 'Brand Blue',
    css: 'linear-gradient(135deg, #0D1117 0%, #181830 50%, #1a2a5e 100%)',
    type: 'gradient',
  },
  {
    id: 'green-glow',
    label: 'Green Glow',
    css: 'radial-gradient(ellipse 70% 40% at 50% 100%, #0a2a22 0%, #0D1117 60%, #080810 100%)',
    type: 'gradient',
  },
  {
    id: 'lime-accent',
    label: 'Lime Accent',
    css: 'linear-gradient(160deg, #0D1117 0%, #181830 60%, #1a2200 100%)',
    type: 'gradient',
  },
  {
    id: 'pure-dark-flat',
    label: 'Pure Dark',
    css: '#0D1117',
    type: 'gradient', // Kept in gradient section as specified
  },
  {
    id: 'midnight',
    label: 'Midnight',
    css: 'linear-gradient(180deg, #0a0e1a 0%, #0D1117 100%)',
    type: 'gradient',
  },
  {
    id: 'warm-dark',
    label: 'Warm Dark',
    css: 'linear-gradient(180deg, #1a1210 0%, #0D1117 100%)',
    type: 'gradient',
  },
];

// Combined export for external use
export const BRAND_BACKGROUNDS: BrandBackground[] = [...SOLID_BACKGROUNDS, ...GRADIENT_PRESETS];

type GradientDirection = 'to bottom' | '135deg' | 'radial';

const DIRECTION_OPTIONS: { value: GradientDirection; label: string }[] = [
  { value: 'to bottom', label: 'Top → Bottom' },
  { value: '135deg', label: 'Diagonal' },
  { value: 'radial', label: 'Radial' },
];

interface BackgroundsPanelProps {
  activeBackground: string;
  onSelectBackground: (css: string) => void;
}

export default function BackgroundsPanel({ activeBackground, onSelectBackground }: BackgroundsPanelProps) {
  const [gradientsExpanded, setGradientsExpanded] = useState(true);
  const [solidsExpanded, setSolidsExpanded] = useState(true);
  const [customExpanded, setCustomExpanded] = useState(false);

  // Custom gradient state
  const [customColor1, setCustomColor1] = useState('#181830');
  const [customColor2, setCustomColor2] = useState('#3B82F6');
  const [customDirection, setCustomDirection] = useState<GradientDirection>('to bottom');

  const buildCustomCss = useCallback(() => {
    if (customDirection === 'radial') {
      return `radial-gradient(ellipse at center, ${customColor1} 0%, ${customColor2} 100%)`;
    }
    return `linear-gradient(${customDirection}, ${customColor1} 0%, ${customColor2} 100%)`;
  }, [customColor1, customColor2, customDirection]);

  const sectionHeader: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    padding: '8px 0',
    userSelect: 'none',
  };

  const sectionLabel: React.CSSProperties = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  };

  const chevron = (expanded: boolean) => (
    <svg
      width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.15s' }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  const renderSwatch = (bg: BrandBackground, size: number = 48) => {
    const isActive = activeBackground === bg.css;
    return (
      <div key={bg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <button
          onClick={() => onSelectBackground(bg.css)}
          style={{
            width: size,
            height: size,
            borderRadius: 8,
            border: isActive ? '2px solid #3B82F6' : '2px solid rgba(255,255,255,0.1)',
            background: bg.css,
            cursor: 'pointer',
            position: 'relative',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: isActive ? '0 0 0 1px rgba(59,130,246,0.3)' : 'none',
            padding: 0,
            outline: 'none',
            flexShrink: 0,
          }}
          title={bg.label}
          onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
          }}
        >
          {isActive && (
            <svg
              width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.7))',
              }}
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>
        <span style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 9,
          color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)',
          textAlign: 'center',
          lineHeight: 1.2,
          maxWidth: size + 8,
          fontWeight: isActive ? 600 : 400,
        }}>
          {bg.label}
        </span>
      </div>
    );
  };

  return (
    <div style={{ padding: '12px 16px' }}>
      {/* Panel header */}
      <div style={{
        fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700,
        color: '#fff', marginBottom: 4,
      }}>
        Background
      </div>
      <div style={{
        fontFamily: 'Manrope, sans-serif', fontSize: 11,
        color: 'rgba(255,255,255,0.4)', marginBottom: 8,
      }}>
        Brand-compliant canvas backgrounds
      </div>

      {/* ── Gradient Presets ── */}
      <div style={sectionHeader} onClick={() => setGradientsExpanded(!gradientsExpanded)}>
        <span style={sectionLabel}>Gradients</span>
        {chevron(gradientsExpanded)}
      </div>
      {gradientsExpanded && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10,
          padding: '4px 0 12px',
          justifyItems: 'center',
        }}>
          {GRADIENT_PRESETS.map(bg => renderSwatch(bg, 48))}
        </div>
      )}

      {/* ── Solid Colors ── */}
      <div style={sectionHeader} onClick={() => setSolidsExpanded(!solidsExpanded)}>
        <span style={sectionLabel}>Solid Colors</span>
        {chevron(solidsExpanded)}
      </div>
      {solidsExpanded && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: 10,
          padding: '4px 0 12px',
          justifyItems: 'center',
        }}>
          {SOLID_BACKGROUNDS.map(bg => renderSwatch(bg, 40))}
        </div>
      )}

      {/* ── Custom Gradient ── */}
      <div style={sectionHeader} onClick={() => setCustomExpanded(!customExpanded)}>
        <span style={sectionLabel}>Custom Gradient</span>
        {chevron(customExpanded)}
      </div>
      {customExpanded && (
        <div style={{ padding: '4px 0 12px' }}>
          {/* Preview */}
          <div style={{
            width: '100%',
            height: 48,
            borderRadius: 8,
            background: buildCustomCss(),
            border: '1px solid rgba(255,255,255,0.1)',
            marginBottom: 12,
          }} />

          {/* Color pickers */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={{
                fontFamily: 'Manrope, sans-serif', fontSize: 10, fontWeight: 600,
                color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 4,
              }}>
                Start Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="color"
                  value={customColor1}
                  onChange={(e) => setCustomColor1(e.target.value)}
                  style={{
                    width: 28, height: 28, border: 'none', borderRadius: 4,
                    cursor: 'pointer', padding: 0, background: 'none',
                  }}
                />
                <span style={{
                  fontFamily: 'monospace', fontSize: 10,
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  {customColor1}
                </span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <label style={{
                fontFamily: 'Manrope, sans-serif', fontSize: 10, fontWeight: 600,
                color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 4,
              }}>
                End Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input
                  type="color"
                  value={customColor2}
                  onChange={(e) => setCustomColor2(e.target.value)}
                  style={{
                    width: 28, height: 28, border: 'none', borderRadius: 4,
                    cursor: 'pointer', padding: 0, background: 'none',
                  }}
                />
                <span style={{
                  fontFamily: 'monospace', fontSize: 10,
                  color: 'rgba(255,255,255,0.5)',
                }}>
                  {customColor2}
                </span>
              </div>
            </div>
          </div>

          {/* Direction selector */}
          <label style={{
            fontFamily: 'Manrope, sans-serif', fontSize: 10, fontWeight: 600,
            color: 'rgba(255,255,255,0.45)', display: 'block', marginBottom: 4,
          }}>
            Direction
          </label>
          <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
            {DIRECTION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => setCustomDirection(opt.value)}
                style={{
                  flex: 1,
                  padding: '5px 0',
                  borderRadius: 6,
                  border: customDirection === opt.value
                    ? '1px solid #3B82F6'
                    : '1px solid rgba(255,255,255,0.1)',
                  backgroundColor: customDirection === opt.value
                    ? 'rgba(59,130,246,0.15)'
                    : 'rgba(255,255,255,0.04)',
                  color: customDirection === opt.value
                    ? '#3B82F6'
                    : 'rgba(255,255,255,0.5)',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 10,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  outline: 'none',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Apply button */}
          <button
            onClick={() => onSelectBackground(buildCustomCss())}
            style={{
              width: '100%',
              padding: '8px 0',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#3B82F6',
              color: '#fff',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background-color 0.15s',
              outline: 'none',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#2563EB'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#3B82F6'; }}
          >
            Apply Custom Gradient
          </button>
        </div>
      )}
    </div>
  );
}
