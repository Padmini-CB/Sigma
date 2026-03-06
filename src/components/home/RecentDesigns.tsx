'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { STORAGE_PREFIX, type SavedDesign } from '@/components/canva-editor/useAutoSave';

interface DesignCard {
  id: string;
  projectName: string;
  lastModified: number;
  savedAt: string;
  elementCount: number;
  canvasSize: string;
}

function getSavedDesigns(): DesignCard[] {
  if (typeof window === 'undefined') return [];
  const designs: DesignCard[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(STORAGE_PREFIX)) continue;
    try {
      const data: SavedDesign = JSON.parse(localStorage.getItem(key)!);
      designs.push({
        id: data.id,
        projectName: data.projectName || data.id,
        lastModified: data.lastModified,
        savedAt: data.savedAt,
        elementCount: data.elements?.length ?? 0,
        canvasSize: data.activeSize
          ? `${data.activeSize.width}×${data.activeSize.height}`
          : 'Unknown',
      });
    } catch { /* skip corrupt entries */ }
  }
  return designs.sort((a, b) => b.lastModified - a.lastModified);
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString();
}

export default function RecentDesigns() {
  const router = useRouter();
  const [designs, setDesigns] = useState<DesignCard[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const refresh = useCallback(() => setDesigns(getSavedDesigns()), []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpenId) return;
    const handler = () => setMenuOpenId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [menuOpenId]);

  if (designs.length === 0) return null;

  const handleOpen = (id: string) => {
    router.push(`/editor/${id}`);
  };

  const handleRename = (id: string, currentName: string) => {
    setRenamingId(id);
    setRenameValue(currentName);
    setMenuOpenId(null);
  };

  const commitRename = (id: string) => {
    try {
      const key = STORAGE_PREFIX + id;
      const data = JSON.parse(localStorage.getItem(key)!);
      data.projectName = renameValue.trim() || id;
      localStorage.setItem(key, JSON.stringify(data));
    } catch { /* ignore */ }
    setRenamingId(null);
    refresh();
  };

  const handleDuplicate = (id: string) => {
    setMenuOpenId(null);
    try {
      const key = STORAGE_PREFIX + id;
      const data = JSON.parse(localStorage.getItem(key)!);
      const newId = `${id}-copy-${Date.now().toString(36)}`;
      data.id = newId;
      data.projectName = `${data.projectName || id} (Copy)`;
      data.lastModified = Date.now();
      data.savedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_PREFIX + newId, JSON.stringify(data));
      refresh();
    } catch { /* ignore */ }
  };

  const handleDelete = (id: string) => {
    setMenuOpenId(null);
    localStorage.removeItem(STORAGE_PREFIX + id);
    refresh();
  };

  return (
    <section style={{
      padding: '48px 24px',
      maxWidth: 1200,
      margin: '0 auto',
    }}>
      <h2 style={{
        fontFamily: 'Manrope, sans-serif',
        fontSize: 20,
        fontWeight: 700,
        color: '#fff',
        marginBottom: 24,
      }}>
        Recent Designs
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
      }}>
        {designs.map((design) => (
          <div
            key={design.id}
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              transition: 'border-color 0.15s, transform 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={() => handleOpen(design.id)}
          >
            {/* Thumbnail area */}
            <div style={{
              height: 120,
              backgroundColor: 'rgba(255,255,255,0.02)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="2" />
                  <line x1="2" y1="8" x2="22" y2="8" />
                  <line x1="8" y1="2" x2="8" y2="22" />
                </svg>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>
                  {design.elementCount} element{design.elementCount !== 1 ? 's' : ''} · {design.canvasSize}
                </span>
              </div>
            </div>

            {/* Info area */}
            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ flex: 1, minWidth: 0 }} onClick={(e) => e.stopPropagation()}>
                {renamingId === design.id ? (
                  <input
                    autoFocus
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={() => commitRename(design.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commitRename(design.id);
                      if (e.key === 'Escape') setRenamingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600, color: '#fff',
                      backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(59,130,246,0.5)',
                      borderRadius: 4, padding: '2px 6px', outline: 'none', width: '100%',
                    }}
                  />
                ) : (
                  <>
                    <div style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600, color: '#fff',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {design.projectName}
                    </div>
                    <div style={{
                      fontFamily: 'Manrope, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.35)',
                      marginTop: 2,
                    }}>
                      {formatTimeAgo(design.lastModified)}
                    </div>
                  </>
                )}
              </div>

              {/* Three-dot menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpenId(menuOpenId === design.id ? null : design.id);
                  }}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                    color: 'rgba(255,255,255,0.4)', borderRadius: 4,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="5" r="2" />
                    <circle cx="12" cy="12" r="2" />
                    <circle cx="12" cy="19" r="2" />
                  </svg>
                </button>

                {menuOpenId === design.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 4,
                      width: 140,
                      backgroundColor: '#1C2333',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      padding: 4,
                      zIndex: 100,
                      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                    }}
                  >
                    {[
                      { label: 'Open', action: () => handleOpen(design.id) },
                      { label: 'Rename', action: () => handleRename(design.id, design.projectName) },
                      { label: 'Duplicate', action: () => handleDuplicate(design.id) },
                      { label: 'Delete', action: () => handleDelete(design.id), color: '#EF4444' },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={item.action}
                        style={{
                          display: 'block', width: '100%', textAlign: 'left',
                          padding: '8px 12px', borderRadius: 4,
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 500,
                          color: item.color ?? 'rgba(255,255,255,0.7)',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
