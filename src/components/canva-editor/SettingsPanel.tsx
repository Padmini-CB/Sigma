'use client';

import React, { useState } from 'react';
import { CANVAS_SIZES, CanvasSize } from './types';

interface SettingsPanelProps {
  activeSize: CanvasSize;
  onSizeChange: (size: CanvasSize) => void;
  onExport: () => void;
  onExportAll: () => void;
  isExporting: boolean;
}

const BRAND_COLORS = [
  { label: 'Blue', hex: '#3B82F6' },
  { label: 'Purple', hex: '#6F53C1' },
  { label: 'Navy', hex: '#181830' },
  { label: 'Lime Yellow', hex: '#D7EF3F' },
];

export default function SettingsPanel({
  activeSize,
  onSizeChange,
  onExport,
  onExportAll,
  isExporting,
}: SettingsPanelProps) {
  const [hoveredSizeId, setHoveredSizeId] = useState<string | null>(null);
  const [hoveredExport, setHoveredExport] = useState<string | null>(null);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  return (
    <div style={styles.container}>
      <div style={styles.scrollArea}>
        {/* Canvas Size Section */}
        <div style={styles.sectionLabel}>Ad Creatives</div>
        <div style={styles.sizeGrid}>
          {CANVAS_SIZES.filter(s => s.category === 'ad-creatives').map((size) => {
            const isActive = activeSize.id === size.id;
            const isHovered = hoveredSizeId === size.id;

            return (
              <button
                key={size.id}
                onClick={() => onSizeChange(size)}
                onMouseEnter={() => setHoveredSizeId(size.id)}
                onMouseLeave={() => setHoveredSizeId(null)}
                style={{
                  ...styles.sizeCard,
                  borderColor: isActive
                    ? '#3B82F6'
                    : isHovered
                      ? 'rgba(59,130,246,0.4)'
                      : 'rgba(255,255,255,0.08)',
                  boxShadow: isActive ? '0 0 0 2px rgba(59,130,246,0.3)' : 'none',
                  backgroundColor: isActive
                    ? 'rgba(59,130,246,0.1)'
                    : isHovered
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(255,255,255,0.02)',
                }}
              >
                {/* Size icon - proportional rectangle */}
                <div
                  style={{
                    ...styles.sizeIconWrapper,
                  }}
                >
                  <div
                    style={{
                      width: size.width >= size.height ? 28 : Math.round(28 * (size.width / size.height)),
                      height: size.height >= size.width ? 28 : Math.round(28 * (size.height / size.width)),
                      borderRadius: 3,
                      border: `1.5px solid ${isActive ? '#3B82F6' : 'rgba(255,255,255,0.25)'}`,
                      backgroundColor: isActive ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                      transition: 'border-color 0.15s ease',
                    }}
                  />
                </div>
                <div style={styles.sizeInfo}>
                  <span
                    style={{
                      ...styles.sizeDimensions,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {size.label}
                  </span>
                  <span style={styles.sizeDescription}>{size.description}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Homepage Banner Sizes */}
        <div style={styles.sectionDivider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>Homepage Banner</span>
          <span style={styles.dividerLine} />
        </div>
        <div style={styles.sizeGrid}>
          {CANVAS_SIZES.filter(s => s.category === 'homepage-banner').map((size) => {
            const isActive = activeSize.id === size.id;
            const isHovered = hoveredSizeId === size.id;

            return (
              <button
                key={size.id}
                onClick={() => onSizeChange(size)}
                onMouseEnter={() => setHoveredSizeId(size.id)}
                onMouseLeave={() => setHoveredSizeId(null)}
                style={{
                  ...styles.sizeCard,
                  borderColor: isActive
                    ? '#3B82F6'
                    : isHovered
                      ? 'rgba(59,130,246,0.4)'
                      : 'rgba(255,255,255,0.08)',
                  boxShadow: isActive ? '0 0 0 2px rgba(59,130,246,0.3)' : 'none',
                  backgroundColor: isActive
                    ? 'rgba(59,130,246,0.1)'
                    : isHovered
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(255,255,255,0.02)',
                }}
              >
                <div style={styles.sizeIconWrapper}>
                  <div
                    style={{
                      width: size.width >= size.height ? 28 : Math.round(28 * (size.width / size.height)),
                      height: size.height >= size.width ? 28 : Math.round(28 * (size.height / size.width)),
                      borderRadius: 3,
                      border: `1.5px solid ${isActive ? '#3B82F6' : 'rgba(255,255,255,0.25)'}`,
                      backgroundColor: isActive ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                      transition: 'border-color 0.15s ease',
                    }}
                  />
                </div>
                <div style={styles.sizeInfo}>
                  <span
                    style={{
                      ...styles.sizeDimensions,
                      color: isActive ? '#ffffff' : 'rgba(255,255,255,0.8)',
                    }}
                  >
                    {size.label}
                  </span>
                  <span style={styles.sizeDescription}>{size.description}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Export Section */}
        <div style={styles.sectionDivider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>Export</span>
          <span style={styles.dividerLine} />
        </div>

        <div style={styles.exportButtons}>
          {/* Download PNG - Primary */}
          <button
            onClick={onExport}
            disabled={isExporting}
            onMouseEnter={() => setHoveredExport('png')}
            onMouseLeave={() => setHoveredExport(null)}
            style={{
              ...styles.exportButtonPrimary,
              opacity: isExporting ? 0.6 : 1,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              backgroundColor: hoveredExport === 'png' && !isExporting ? '#2563EB' : '#3B82F6',
              transform: hoveredExport === 'png' && !isExporting ? 'translateY(-1px)' : 'translateY(0)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{isExporting ? 'Exporting...' : 'Download PNG'}</span>
          </button>

          {/* Download All Sizes - Outline */}
          <button
            onClick={onExportAll}
            disabled={isExporting}
            onMouseEnter={() => setHoveredExport('all')}
            onMouseLeave={() => setHoveredExport(null)}
            style={{
              ...styles.exportButtonOutline,
              opacity: isExporting ? 0.6 : 1,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              borderColor: hoveredExport === 'all' && !isExporting ? '#3B82F6' : 'rgba(255,255,255,0.15)',
              color: hoveredExport === 'all' && !isExporting ? '#3B82F6' : 'rgba(255,255,255,0.7)',
              backgroundColor: hoveredExport === 'all' && !isExporting ? 'rgba(59,130,246,0.08)' : 'transparent',
              transform: hoveredExport === 'all' && !isExporting ? 'translateY(-1px)' : 'translateY(0)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="2" ry="2" />
              <path d="M7 2v20" />
              <path d="M17 2v20" />
              <path d="M2 12h20" />
              <path d="M2 7h5" />
              <path d="M2 17h5" />
              <path d="M17 7h5" />
              <path d="M17 17h5" />
            </svg>
            <span>{isExporting ? 'Exporting...' : 'Download All Sizes'}</span>
          </button>
        </div>

        {/* Brand Colors Section */}
        <div style={styles.sectionDivider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>Brand Colors</span>
          <span style={styles.dividerLine} />
        </div>

        <div style={styles.colorsGrid}>
          {BRAND_COLORS.map((color) => (
            <div
              key={color.hex}
              onMouseEnter={() => setHoveredColor(color.hex)}
              onMouseLeave={() => setHoveredColor(null)}
              style={{
                ...styles.colorCard,
                borderColor: hoveredColor === color.hex ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)',
              }}
              title={`${color.label}: ${color.hex}`}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: color.hex,
                  border: color.hex === '#181830' ? '1px solid rgba(255,255,255,0.15)' : 'none',
                  flexShrink: 0,
                }}
              />
              <div style={styles.colorInfo}>
                <span style={styles.colorLabel}>{color.label}</span>
                <span style={styles.colorHex}>{color.hex}</span>
              </div>
            </div>
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
    marginBottom: 10,
  },
  sizeGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  sizeCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: '10px 12px',
    borderRadius: 8,
    border: '1.5px solid rgba(255,255,255,0.08)',
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease',
    background: 'none',
    textAlign: 'left',
    color: '#ffffff',
  },
  sizeIconWrapper: {
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  sizeInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    flex: 1,
    minWidth: 0,
  },
  sizeDimensions: {
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.2,
  },
  sizeDescription: {
    fontSize: 10,
    fontWeight: 400,
    color: 'rgba(255,255,255,0.4)',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  sectionDivider: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    marginBottom: 12,
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
  exportButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  exportButtonPrimary: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 42,
    borderRadius: 8,
    border: 'none',
    backgroundColor: '#3B82F6',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.15s ease, transform 0.1s ease, opacity 0.15s ease',
  },
  exportButtonOutline: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 42,
    borderRadius: 8,
    border: '1.5px solid rgba(255,255,255,0.15)',
    backgroundColor: 'transparent',
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'border-color 0.15s ease, color 0.15s ease, background-color 0.15s ease, transform 0.1s ease, opacity 0.15s ease',
  },
  colorsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 8,
  },
  colorCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    borderRadius: 8,
    border: '1px solid rgba(255,255,255,0.06)',
    transition: 'border-color 0.15s ease',
    cursor: 'default',
  },
  colorInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
    minWidth: 0,
  },
  colorLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.2,
  },
  colorHex: {
    fontSize: 10,
    fontWeight: 400,
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 1.2,
    fontFamily: 'monospace',
  },
};
