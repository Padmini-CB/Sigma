'use client';

import React from 'react';

export interface BrandBackground {
  id: string;
  label: string;
  css: string; // CSS value for background property
  type: 'solid' | 'gradient';
}

export const BRAND_BACKGROUNDS: BrandBackground[] = [
  // Solids
  { id: 'navy', label: 'Navy', css: '#181830', type: 'solid' },
  { id: 'blue', label: 'Blue', css: '#3B82F6', type: 'solid' },
  { id: 'black', label: 'Black', css: '#000000', type: 'solid' },
  // Gradients
  { id: 'navy-blue', label: 'Navy to Blue', css: 'linear-gradient(135deg, #181830 0%, #3B82F6 100%)', type: 'gradient' },
  { id: 'navy-black', label: 'Navy to Black', css: 'linear-gradient(180deg, #181830 0%, #000000 100%)', type: 'gradient' },
  { id: 'blue-dark', label: 'Blue to Dark', css: 'linear-gradient(180deg, #1e3a5f 0%, #181830 100%)', type: 'gradient' },
  { id: 'radial-glow', label: 'Radial Glow', css: 'radial-gradient(ellipse at center, #181830 0%, #0d1020 50%, #181830 80%, #1e3a5f 100%)', type: 'gradient' },
];

interface BackgroundsPanelProps {
  activeBackground: string;
  onSelectBackground: (css: string) => void;
}

export default function BackgroundsPanel({ activeBackground, onSelectBackground }: BackgroundsPanelProps) {
  const sectionTitle: React.CSSProperties = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: 11,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 10,
    marginTop: 16,
  };

  const solids = BRAND_BACKGROUNDS.filter(b => b.type === 'solid');
  const gradients = BRAND_BACKGROUNDS.filter(b => b.type === 'gradient');

  return (
    <div style={{ padding: '12px 16px' }}>
      <div style={{
        fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700,
        color: '#fff', marginBottom: 4,
      }}>
        Backgrounds
      </div>
      <div style={{
        fontFamily: 'Manrope, sans-serif', fontSize: 11,
        color: 'rgba(255,255,255,0.4)', marginBottom: 12,
      }}>
        Brand-compliant canvas backgrounds
      </div>

      {/* Solid Colors */}
      <div style={sectionTitle}>Solid Colors</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {solids.map(bg => (
          <button
            key={bg.id}
            onClick={() => onSelectBackground(bg.css)}
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 8,
              border: activeBackground === bg.css
                ? '2px solid #3B82F6'
                : '2px solid rgba(255,255,255,0.1)',
              background: bg.css,
              cursor: 'pointer',
              position: 'relative',
              transition: 'border-color 0.15s',
            }}
            title={bg.label}
          >
            {activeBackground === bg.css && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4, marginTop: 4 }}>
        {solids.map(bg => (
          <div key={bg.id} style={{
            fontFamily: 'Manrope, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.35)',
            textAlign: 'center',
          }}>{bg.label}</div>
        ))}
      </div>

      {/* Gradients */}
      <div style={sectionTitle}>Gradients</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {gradients.map(bg => (
          <button
            key={bg.id}
            onClick={() => onSelectBackground(bg.css)}
            style={{
              width: '100%',
              aspectRatio: '16/10',
              borderRadius: 8,
              border: activeBackground === bg.css
                ? '2px solid #3B82F6'
                : '2px solid rgba(255,255,255,0.1)',
              background: bg.css,
              cursor: 'pointer',
              position: 'relative',
              transition: 'border-color 0.15s',
            }}
            title={bg.label}
          >
            {activeBackground === bg.css && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.5))' }}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 4 }}>
        {gradients.map(bg => (
          <div key={bg.id} style={{
            fontFamily: 'Manrope, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.35)',
            textAlign: 'center',
          }}>{bg.label}</div>
        ))}
      </div>
    </div>
  );
}
