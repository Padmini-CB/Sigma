'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { type ProjectIndexEntry, formatRelativeTime } from '@/lib/projectStorage';

interface ProjectCardProps {
  project: ProjectIndexEntry;
  onClick: () => void;
  onRename: (id: string, newName: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

const BOOTCAMP_LABELS: Record<string, string> = {
  'ai-engineering-1.0': 'AI Eng 1.0',
  'data-analytics-5.0': 'DA 5.0',
  'gen-ai': 'Gen AI',
  'data-science': 'Data Science',
  'data-engineering': 'Data Eng',
};

export default function ProjectCard({ project, onClick, onRename, onDuplicate, onDelete }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(project.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close menu on click outside
  useEffect(() => {
    if (!showMenu) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showMenu]);

  const handleRenameStart = useCallback(() => {
    setShowMenu(false);
    setIsRenaming(true);
    setRenameValue(project.name);
    setTimeout(() => inputRef.current?.select(), 0);
  }, [project.name]);

  const handleRenameFinish = useCallback(() => {
    const trimmed = renameValue.trim();
    if (trimmed && trimmed !== project.name) {
      onRename(project.id, trimmed);
    }
    setIsRenaming(false);
  }, [renameValue, project, onRename]);

  const handleRenameKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRenameFinish();
    else if (e.key === 'Escape') setIsRenaming(false);
  }, [handleRenameFinish]);

  const bootcampLabel = BOOTCAMP_LABELS[project.bootcamp] || project.bootcamp;

  return (
    <div
      style={{
        borderRadius: 8,
        border: '1px solid #E4E8EB',
        backgroundColor: '#FFFFFF',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 150ms ease-out',
        position: 'relative',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#D1D7DC'; (e.currentTarget as HTMLElement).style.borderWidth = '2px'; (e.currentTarget as HTMLElement).style.margin = '-1px'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#E4E8EB'; (e.currentTarget as HTMLElement).style.borderWidth = '1px'; (e.currentTarget as HTMLElement).style.margin = '0'; }}
    >
      {/* Thumbnail */}
      <div
        onClick={onClick}
        style={{
          aspectRatio: '16/9',
          backgroundColor: '#F4F5F6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            }}
          />
        ) : (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D1D7DC" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 12px' }}>
        {/* Name */}
        {isRenaming ? (
          <input
            ref={inputRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onBlur={handleRenameFinish}
            onKeyDown={handleRenameKeyDown}
            autoFocus
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              color: '#1C1D1F',
              border: '1px solid #3B82F6',
              borderRadius: 4,
              padding: '2px 6px',
              outline: 'none',
              width: '100%',
              backgroundColor: '#fff',
            }}
          />
        ) : (
          <div
            onClick={onClick}
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              color: '#1C1D1F',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: 4,
            }}
          >
            {project.name}
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Timestamp */}
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              fontWeight: 400,
              color: '#9DA3A7',
            }}>
              Edited {formatRelativeTime(project.updatedAt)}
            </span>

            {/* Bootcamp pill */}
            {project.bootcamp && (
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 10,
                fontWeight: 500,
                color: '#3B82F6',
                backgroundColor: '#EBF2FE',
                borderRadius: 4,
                padding: '2px 6px',
                whiteSpace: 'nowrap',
              }}>
                {bootcampLabel}
              </span>
            )}
          </div>

          {/* Three-dot menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(v => !v); }}
              style={{
                width: 24,
                height: 24,
                borderRadius: 4,
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9DA3A7',
                padding: 0,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F5F6'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="5" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="12" cy="19" r="2" />
              </svg>
            </button>

            {showMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '100%',
                marginTop: 4,
                width: 140,
                backgroundColor: '#fff',
                border: '1px solid #E4E8EB',
                borderRadius: 6,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                zIndex: 100,
                overflow: 'hidden',
              }}>
                {[
                  { label: 'Rename', action: handleRenameStart },
                  { label: 'Duplicate', action: () => { setShowMenu(false); onDuplicate(project.id); } },
                  { label: 'Delete', action: () => { setShowMenu(false); setShowDeleteConfirm(true); }, danger: true },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={(e) => { e.stopPropagation(); item.action(); }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      textAlign: 'left',
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 13,
                      fontWeight: 500,
                      color: 'danger' in item && item.danger ? '#EF4444' : '#1C1D1F',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = '#F4F5F6'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation overlay */}
      {showDeleteConfirm && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: 16,
            borderRadius: 8,
          }}
        >
          <p style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 13,
            fontWeight: 600,
            color: '#1C1D1F',
            textAlign: 'center',
          }}>
            Delete this design?
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              style={{
                padding: '6px 16px',
                borderRadius: 6,
                border: '1px solid #E4E8EB',
                backgroundColor: '#fff',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                color: '#1C1D1F',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => { setShowDeleteConfirm(false); onDelete(project.id); }}
              style={{
                padding: '6px 16px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: '#EF4444',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 12,
                fontWeight: 600,
                color: '#fff',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
