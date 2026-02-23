'use client';

import React, { useState } from 'react';

interface TextPanelProps {
  onAddText: (preset: 'heading' | 'subheading' | 'body', content?: string) => void;
}

interface TextPreset {
  id: string;
  content: string;
}

const CAMPAIGN_PRESETS: TextPreset[] = [
  { id: 'preset-1', content: "YOUR TODOs DON'T SHIP." },
  { id: 'preset-2', content: 'WE SKIP THE BASICS.' },
  { id: 'preset-3', content: '500 SEATS. THEN WE CLOSE.' },
  { id: 'preset-4', content: 'TWO BOOTCAMPS. ONE PRICE.' },
  { id: 'preset-5', content: '75 DAYS TO BECOME AN AI ENGINEER.' },
];

export default function TextPanel({ onAddText }: TextPanelProps) {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [hoveredPreset, setHoveredPreset] = useState<string | null>(null);

  return (
    <div style={styles.container}>
      <div style={styles.scrollArea}>
        {/* Section label */}
        <div style={styles.sectionLabel}>Click to add to canvas</div>

        {/* Add a heading */}
        <button
          onClick={() => onAddText('heading')}
          onMouseEnter={() => setHoveredButton('heading')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            ...styles.textButton,
            borderColor: hoveredButton === 'heading' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)',
            backgroundColor: hoveredButton === 'heading' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
          }}
        >
          <span style={styles.headingPreview}>Add a heading</span>
          <span style={styles.textMeta}>Poppins 900 / 72px</span>
        </button>

        {/* Add a subheading */}
        <button
          onClick={() => onAddText('subheading')}
          onMouseEnter={() => setHoveredButton('subheading')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            ...styles.textButton,
            borderColor: hoveredButton === 'subheading' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)',
            backgroundColor: hoveredButton === 'subheading' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
          }}
        >
          <span style={styles.subheadingPreview}>Add a subheading</span>
          <span style={styles.textMeta}>Poppins 700 / 36px</span>
        </button>

        {/* Add body text */}
        <button
          onClick={() => onAddText('body')}
          onMouseEnter={() => setHoveredButton('body')}
          onMouseLeave={() => setHoveredButton(null)}
          style={{
            ...styles.textButton,
            borderColor: hoveredButton === 'body' ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)',
            backgroundColor: hoveredButton === 'body' ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
          }}
        >
          <span style={styles.bodyPreview}>Add body text</span>
          <span style={styles.textMeta}>Poppins 400 / 20px</span>
        </button>

        {/* Campaign Text Presets */}
        <div style={styles.presetsDivider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>Campaign Text Presets</span>
          <span style={styles.dividerLine} />
        </div>

        <div style={styles.presetsDescription}>
          AI Engineering Bootcamp
        </div>

        <div style={styles.presetsGrid}>
          {CAMPAIGN_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onAddText('heading', preset.content)}
              onMouseEnter={() => setHoveredPreset(preset.id)}
              onMouseLeave={() => setHoveredPreset(null)}
              style={{
                ...styles.presetCard,
                borderColor: hoveredPreset === preset.id ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.08)',
                backgroundColor: hoveredPreset === preset.id ? 'rgba(59,130,246,0.08)' : 'rgba(255,255,255,0.02)',
                transform: hoveredPreset === preset.id ? 'scale(1.02)' : 'scale(1)',
              }}
            >
              <span style={styles.presetText}>{preset.content}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -- Styles -- */

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#1e1e2e',
    color: '#ffffff',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '12px 12px 16px 12px',
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 12,
  },
  textButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: '100%',
    padding: '16px 16px',
    marginBottom: 8,
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, background-color 0.15s ease',
    background: 'none',
    textAlign: 'left',
    gap: 6,
  },
  headingPreview: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 900,
    fontSize: 24,
    color: '#ffffff',
    lineHeight: 1.1,
    letterSpacing: -0.5,
  },
  subheadingPreview: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 700,
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 1.2,
  },
  bodyPreview: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 400,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.4,
  },
  textMeta: {
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 0.3,
  },
  presetsDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.45)',
    whiteSpace: 'nowrap',
  },
  presetsDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.35)',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  presetsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  presetCard: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, background-color 0.15s ease, transform 0.12s ease',
    background: 'none',
    textAlign: 'left',
  },
  presetText: {
    fontFamily: 'Poppins, sans-serif',
    fontWeight: 800,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 1.3,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
};
