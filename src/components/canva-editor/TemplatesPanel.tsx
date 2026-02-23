'use client';

import React, { useState, useMemo } from 'react';
import { TEMPLATES, TemplateInfo, getStandaloneTemplates, getCarouselTemplates } from './templateDefinitions';

interface TemplatesPanelProps {
  onSelectTemplate: (template: TemplateInfo) => void;
  activeTemplateId: string | null;
}

export default function TemplatesPanel({ onSelectTemplate, activeTemplateId }: TemplatesPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const standaloneTemplates = useMemo(() => getStandaloneTemplates(), []);
  const carouselTemplates = useMemo(() => getCarouselTemplates(), []);

  const filterTemplates = (templates: TemplateInfo[]) => {
    if (!searchQuery.trim()) return templates;
    const q = searchQuery.toLowerCase();
    return templates.filter(
      (t) => t.label.toLowerCase().includes(q) || t.shortLabel.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    );
  };

  const filteredStandalone = filterTemplates(standaloneTemplates);
  const filteredCarousel = filterTemplates(carouselTemplates);

  return (
    <div style={styles.container}>
      {/* Search bar */}
      <div style={styles.searchWrapper}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={styles.searchIcon}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.scrollArea}>
        {/* Standalone Ads Section */}
        {filteredStandalone.length > 0 && (
          <div style={styles.section}>
            <div style={styles.sectionLabel}>Standalone Ads</div>
            <div style={styles.grid}>
              {filteredStandalone.map((template) => (
                <TemplateThumb
                  key={template.id}
                  template={template}
                  isActive={activeTemplateId === template.id}
                  onClick={() => onSelectTemplate(template)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Carousel Section */}
        {filteredCarousel.length > 0 && (
          <div style={styles.section}>
            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerText}>Carousel</span>
              <span style={styles.dividerLine} />
            </div>
            <div style={styles.grid}>
              {filteredCarousel.map((template) => (
                <TemplateThumb
                  key={template.id}
                  template={template}
                  isActive={activeTemplateId === template.id}
                  onClick={() => onSelectTemplate(template)}
                />
              ))}
            </div>
          </div>
        )}

        {filteredStandalone.length === 0 && filteredCarousel.length === 0 && (
          <div style={styles.emptyState}>No templates match your search.</div>
        )}
      </div>
    </div>
  );
}

/* -- Template thumbnail card -- */

function TemplateThumb({
  template,
  isActive,
  onClick,
}: {
  template: TemplateInfo;
  isActive: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const hasThumbnail = !!template.thumbnailImage;

  const cardStyle: React.CSSProperties = {
    width: '100%',
    aspectRatio: '1',
    borderRadius: 8,
    backgroundColor: template.thumbnailBg || '#0D1117',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: hasThumbnail ? 'flex-end' : 'center',
    cursor: 'pointer',
    border: isActive
      ? '2px solid #3B82F6'
      : hovered
        ? '2px solid #3B82F6'
        : '2px solid rgba(255,255,255,0.08)',
    boxShadow: isActive ? '0 0 0 2px rgba(59,130,246,0.4)' : 'none',
    transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
    transform: hovered ? 'scale(1.04)' : 'scale(1)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={template.label}
    >
      {hasThumbnail ? (
        <>
          {/* Thumbnail image */}
          <img
            src={template.thumbnailImage}
            alt={template.shortLabel}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            loading="lazy"
          />
          {/* Gradient overlay for label readability */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40%',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
            zIndex: 1,
          }} />
          {/* Label over thumbnail */}
          <span
            style={{
              position: 'relative',
              zIndex: 2,
              fontSize: 11,
              fontWeight: 600,
              color: '#FFFFFF',
              textAlign: 'center',
              lineHeight: 1.2,
              padding: '6px 6px',
              maxWidth: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            {template.shortLabel}
          </span>
        </>
      ) : (
        <>
          {/* Text-based preview card */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, #0D1117 60%, ${template.thumbnailAccent})`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 12,
              boxSizing: 'border-box',
            }}
          >
            <span
              style={{
                color: '#ffffff',
                fontSize: 13,
                fontWeight: 800,
                fontFamily: 'Poppins, sans-serif',
                textTransform: 'uppercase',
                textAlign: 'center',
                lineHeight: 1.2,
                letterSpacing: -0.3,
                maxWidth: '100%',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {template.thumbnailHeadline}
            </span>
          </div>
          <span
            style={{
              position: 'absolute',
              bottom: 6,
              left: 0,
              right: 0,
              fontSize: 10,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
              textAlign: 'center',
              lineHeight: 1.2,
              padding: '0 4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              zIndex: 1,
            }}
          >
            {template.shortLabel}
          </span>
        </>
      )}
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
  searchWrapper: {
    position: 'relative',
    padding: '12px 12px 8px 12px',
    flexShrink: 0,
  },
  searchIcon: {
    position: 'absolute',
    left: 22,
    top: '50%',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    height: 34,
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: '#ffffff',
    fontSize: 13,
    paddingLeft: 32,
    paddingRight: 10,
    outline: 'none',
    boxSizing: 'border-box',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '4px 12px 16px 12px',
  },
  section: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 10,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    marginTop: 4,
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
  emptyState: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    paddingTop: 40,
  },
};
