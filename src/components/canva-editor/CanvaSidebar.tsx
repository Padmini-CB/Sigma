'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';

export type SidebarTab = 'templates' | 'elements' | 'text' | 'uploads' | 'eraser' | 'settings';

interface CanvaSidebarProps {
  activeTab: SidebarTab | null;
  onTabChange: (tab: SidebarTab | null) => void;
  children: React.ReactNode;
}

const STORAGE_KEY = 'sigma-panel-position';

interface TabDefinition {
  id: SidebarTab;
  label: string;
  icon: React.ReactNode;
}

const ICON_SIZE = 22;

const TemplatesIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const ElementsIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const TextIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7" />
    <line x1="9" y1="20" x2="15" y2="20" />
    <line x1="12" y1="4" x2="12" y2="20" />
  </svg>
);

const UploadsIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const EraserIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 20H7L3 16a1 1 0 0 1 0-1.41l9.59-9.59a2 2 0 0 1 2.82 0l5.17 5.17a2 2 0 0 1 0 2.83L14 20" />
    <path d="M6 11l8 8" />
  </svg>
);

const SettingsIcon = () => (
  <svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const TABS: TabDefinition[] = [
  { id: 'templates', label: 'Templates', icon: <TemplatesIcon /> },
  { id: 'elements', label: 'Elements', icon: <ElementsIcon /> },
  { id: 'text', label: 'Text', icon: <TextIcon /> },
  { id: 'uploads', label: 'Uploads', icon: <UploadsIcon /> },
  { id: 'eraser', label: 'Eraser', icon: <EraserIcon /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

const ICON_STRIP_WIDTH = 60;
const PANEL_WIDTH = 280;

function loadPanelPosition(): { x: number; y: number } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function savePanelPosition(pos: { x: number; y: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  } catch { /* ignore */ }
}

export default function CanvaSidebar({ activeTab, onTabChange, children }: CanvaSidebarProps) {
  const isPanelOpen = activeTab !== null;

  // Draggable panel state
  const defaultPos = { x: ICON_STRIP_WIDTH + 8, y: 56 };
  const [panelPos, setPanelPos] = useState<{ x: number; y: number }>(() => loadPanelPosition() || defaultPos);
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Persist position changes
  useEffect(() => {
    savePanelPosition(panelPos);
  }, [panelPos]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: panelPos.x, origY: panelPos.y };

    const handleMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = ev.clientX - dragRef.current.startX;
      const dy = ev.clientY - dragRef.current.startY;
      const newX = Math.max(0, dragRef.current.origX + dx);
      const newY = Math.max(0, dragRef.current.origY + dy);
      setPanelPos({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [panelPos]);

  const handleTabClick = useCallback(
    (tab: SidebarTab) => {
      if (activeTab === tab) {
        onTabChange(null);
      } else {
        onTabChange(tab);
      }
    },
    [activeTab, onTabChange]
  );

  const activeLabel = TABS.find(t => t.id === activeTab)?.label || '';

  return (
    <>
      {/* Icon Strip */}
      <div
        style={{
          width: ICON_STRIP_WIDTH,
          minWidth: ICON_STRIP_WIDTH,
          height: '100%',
          backgroundColor: '#181830',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 8,
          gap: 4,
          zIndex: 20,
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          flexShrink: 0,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              title={tab.label}
              aria-label={tab.label}
              aria-pressed={isActive}
              style={{
                position: 'relative',
                width: 44,
                height: 44,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.55)',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.12)' : 'transparent',
                transition: 'all 0.15s ease',
                padding: 0,
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.55)';
                }
              }}
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.5)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: -6,
                    top: 8,
                    bottom: 8,
                    width: 3,
                    backgroundColor: '#3B82F6',
                    borderRadius: '0 2px 2px 0',
                  }}
                />
              )}
              {tab.icon}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: isActive ? 600 : 400,
                  marginTop: 2,
                  lineHeight: 1,
                  letterSpacing: '0.01em',
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                  userSelect: 'none',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Floating Draggable Panel */}
      {isPanelOpen && (
        <div
          ref={panelRef}
          style={{
            position: 'fixed',
            left: panelPos.x,
            top: panelPos.y,
            width: PANEL_WIDTH,
            height: 'calc(100vh - 64px)',
            maxHeight: 'calc(100vh - 64px)',
            backgroundColor: '#1e1e3a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          }}
        >
          {/* Draggable Header */}
          <div
            onMouseDown={handleDragStart}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              cursor: 'grab',
              flexShrink: 0,
              userSelect: 'none',
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Drag grip icon */}
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                <circle cx="8" cy="6" r="1.5" fill="rgba(255,255,255,0.3)" />
                <circle cx="16" cy="6" r="1.5" fill="rgba(255,255,255,0.3)" />
                <circle cx="8" cy="12" r="1.5" fill="rgba(255,255,255,0.3)" />
                <circle cx="16" cy="12" r="1.5" fill="rgba(255,255,255,0.3)" />
                <circle cx="8" cy="18" r="1.5" fill="rgba(255,255,255,0.3)" />
                <circle cx="16" cy="18" r="1.5" fill="rgba(255,255,255,0.3)" />
              </svg>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                {activeLabel}
              </span>
            </div>
            <button
              onClick={() => onTabChange(null)}
              style={{
                width: 22, height: 22, borderRadius: 4,
                border: 'none', backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}
              title="Close panel"
            >
              &times;
            </button>
          </div>

          {/* Panel Content */}
          <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
            {children}
          </div>
        </div>
      )}
    </>
  );
}
