'use client';

import React, { useState, useMemo } from 'react';
import { ASSET_SECTIONS } from './assetLibrary';
import { AssetItem, AssetSection } from './types';

interface ElementsPanelProps {
  onDragStart: (item: AssetItem, e: React.DragEvent) => void;
}

export default function ElementsPanel({ onDragStart }: ElementsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ASSET_SECTIONS.forEach((section) => {
      initial[section.id] = section.expanded;
    });
    return initial;
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const filterSections = useMemo(() => {
    if (!searchQuery.trim()) return ASSET_SECTIONS;
    const q = searchQuery.toLowerCase();
    return ASSET_SECTIONS.map((section) => ({
      ...section,
      subsections: section.subsections
        .map((sub) => ({
          ...sub,
          items: sub.items.filter((item) => item.label.toLowerCase().includes(q) || item.type.toLowerCase().includes(q)),
        }))
        .filter((sub) => sub.items.length > 0),
    })).filter((section) => section.subsections.length > 0);
  }, [searchQuery]);

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
          placeholder="Search elements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.scrollArea}>
        {filterSections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            isExpanded={searchQuery.trim() ? true : !!expandedSections[section.id]}
            onToggle={() => toggleSection(section.id)}
            onDragStart={onDragStart}
          />
        ))}

        {filterSections.length === 0 && (
          <div style={styles.emptyState}>No elements match your search.</div>
        )}
      </div>
    </div>
  );
}

/* -- Section block with expand/collapse -- */

function SectionBlock({
  section,
  isExpanded,
  onToggle,
  onDragStart,
}: {
  section: AssetSection;
  isExpanded: boolean;
  onToggle: () => void;
  onDragStart: (item: AssetItem, e: React.DragEvent) => void;
}) {
  return (
    <div style={styles.sectionBlock}>
      {/* Section header */}
      <button onClick={onToggle} style={styles.sectionHeader}>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'transform 0.15s ease',
            transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
            flexShrink: 0,
          }}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        <span style={styles.sectionTitle}>{section.label}</span>
        {section.subsections.length === 0 && (
          <span style={styles.emptyTag}>Empty</span>
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && section.subsections.length > 0 && (
        <div style={styles.sectionContent}>
          {section.subsections.map((sub) => (
            <div key={sub.id} style={styles.subsection}>
              <div style={styles.subsectionLabel}>{sub.label}</div>
              <div style={styles.itemsGrid}>
                {sub.items.map((item) => (
                  <AssetItemCard key={item.id} item={item} onDragStart={onDragStart} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -- Individual asset item card -- */

function AssetItemCard({
  item,
  onDragStart,
}: {
  item: AssetItem;
  onDragStart: (item: AssetItem, e: React.DragEvent) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = 'copy';
    onDragStart(item, e);
  };

  const renderPreview = () => {
    switch (item.type) {
      case 'hero':
        return (
          <div style={styles.heroPreview}>
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }}
                draggable={false}
              />
            ) : (
              <div style={styles.heroPlaceholder}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            )}
          </div>
        );

      case 'button':
        return (
          <div
            style={{
              ...styles.buttonPreview,
              backgroundColor: item.element.buttonStyle?.backgroundColor || '#3B82F6',
              color: item.element.buttonStyle?.textColor || '#FFFFFF',
              borderRadius: item.element.buttonStyle?.borderRadius || 6,
              borderColor: item.element.buttonStyle?.borderColor || 'transparent',
              borderWidth: item.element.buttonStyle?.borderWidth || 0,
              borderStyle: item.element.buttonStyle?.borderWidth ? 'solid' : 'none',
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.element.content}
            </span>
          </div>
        );

      case 'badge':
        return (
          <div
            style={{
              ...styles.badgePreview,
              backgroundColor: item.element.badgeStyle?.backgroundColor || 'rgba(255,255,255,0.06)',
              color: item.element.badgeStyle?.textColor || 'rgba(255,255,255,0.6)',
              borderRadius: item.element.badgeStyle?.borderRadius || 9999,
              borderColor: item.element.badgeStyle?.borderColor || 'transparent',
              borderWidth: item.element.badgeStyle?.borderWidth || 0,
              borderStyle: item.element.badgeStyle?.borderWidth ? 'solid' : 'none',
            }}
          >
            <span style={{ fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.element.content}
            </span>
          </div>
        );

      case 'strip':
        return (
          <div
            style={{
              ...styles.stripPreview,
              backgroundColor: item.element.stripStyle?.backgroundColor || 'rgba(255,255,255,0.04)',
            }}
          >
            <span
              style={{
                fontSize: 8,
                fontWeight: 600,
                color: item.element.stripStyle?.textColor || 'rgba(255,255,255,0.5)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {item.element.content}
            </span>
          </div>
        );

      case 'logo':
        return (
          <div style={styles.logoPreview}>
            {item.thumbnail ? (
              <img
                src={item.thumbnail}
                alt={item.label}
                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                draggable={false}
              />
            ) : (
              <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Logo</span>
            )}
          </div>
        );

      default:
        return (
          <div style={styles.defaultPreview}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>{item.type}</span>
          </div>
        );
    }
  };

  return (
    <div
      draggable="true"
      onDragStart={handleDragStart}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...styles.itemCard,
        borderColor: hovered ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.06)',
        backgroundColor: hovered ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.02)',
      }}
      title={item.label}
    >
      {renderPreview()}
      <span style={styles.itemLabel}>{item.label}</span>
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
    padding: '0 12px 16px 12px',
  },
  sectionBlock: {
    marginBottom: 4,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    padding: '10px 4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 600,
    textAlign: 'left',
  },
  sectionTitle: {
    flex: 1,
  },
  emptyTag: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.25)',
    fontWeight: 400,
    fontStyle: 'italic',
  },
  sectionContent: {
    paddingLeft: 4,
    paddingBottom: 8,
  },
  subsection: {
    marginBottom: 12,
  },
  subsectionLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingLeft: 4,
  },
  itemsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 8,
  },
  itemCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    borderRadius: 6,
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'grab',
    transition: 'border-color 0.12s ease, background-color 0.12s ease',
    minHeight: 64,
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    lineHeight: 1.2,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  heroPreview: {
    width: 56,
    height: 56,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.04)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroPlaceholder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  buttonPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px 10px',
    maxWidth: '100%',
    height: 24,
  },
  badgePreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '3px 8px',
    maxWidth: '100%',
    height: 22,
  },
  stripPreview: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 18,
    borderRadius: 3,
    padding: '2px 6px',
  },
  logoPreview: {
    width: 56,
    height: 28,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 4,
    padding: 4,
  },
  defaultPreview: {
    width: 48,
    height: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 4,
  },
  emptyState: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
    textAlign: 'center',
    paddingTop: 40,
  },
};
