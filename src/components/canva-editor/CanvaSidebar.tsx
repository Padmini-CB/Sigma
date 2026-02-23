'use client';

import React, { useCallback } from 'react';

export type SidebarTab = 'templates' | 'elements' | 'text' | 'uploads' | 'settings';

interface CanvaSidebarProps {
  activeTab: SidebarTab | null;
  onTabChange: (tab: SidebarTab | null) => void;
  children: React.ReactNode;
}

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
  { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
];

const ICON_STRIP_WIDTH = 60;
const PANEL_WIDTH = 280;

export default function CanvaSidebar({ activeTab, onTabChange, children }: CanvaSidebarProps) {
  const isPanelOpen = activeTab !== null;

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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        height: '100vh',
        maxHeight: '100vh',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
      }}
    >
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
          zIndex: 2,
          borderRight: '1px solid rgba(255, 255, 255, 0.06)',
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

      {/* Slide-out Panel */}
      <div
        style={{
          width: isPanelOpen ? PANEL_WIDTH : 0,
          minWidth: isPanelOpen ? PANEL_WIDTH : 0,
          height: '100%',
          backgroundColor: '#1e1e3a',
          overflow: 'hidden',
          transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRight: isPanelOpen ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: PANEL_WIDTH,
            height: '100%',
            overflowY: 'auto',
            overflowX: 'hidden',
            opacity: isPanelOpen ? 1 : 0,
            transition: 'opacity 0.2s ease',
            transitionDelay: isPanelOpen ? '0.1s' : '0s',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
