'use client';

import React, { useState, useCallback, useRef } from 'react';
import type { CanvasElement } from './types';

interface LayersPanelProps {
  elements: CanvasElement[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onElementsChange: (elements: CanvasElement[]) => void;
  onGroup: () => void;
  onUngroup: () => void;
}

function getLayerLabel(el: CanvasElement): string {
  if (el.layerName) return el.layerName;
  switch (el.type) {
    case 'text': return el.content?.slice(0, 20) || 'Text';
    case 'image': return 'Image';
    case 'button': return el.content?.slice(0, 16) || 'Button';
    case 'badge': return el.content?.slice(0, 16) || 'Badge';
    case 'strip': return el.content?.slice(0, 16) || 'Strip';
    case 'shape': return 'Shape';
    case 'group': return 'Group';
    default: return 'Layer';
  }
}

function getLayerIcon(type: string): React.ReactElement {
  const s = { width: 14, height: 14, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'text':
      return <svg {...s}><path d="M4 7V4h16v3" /><line x1="12" y1="4" x2="12" y2="20" /><line x1="8" y1="20" x2="16" y2="20" /></svg>;
    case 'image':
      return <svg {...s}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>;
    case 'button':
      return <svg {...s}><rect x="3" y="6" width="18" height="12" rx="3" /><line x1="8" y1="12" x2="16" y2="12" /></svg>;
    case 'badge':
      return <svg {...s}><circle cx="12" cy="12" r="9" /><path d="M8 12h8" /></svg>;
    case 'strip':
      return <svg {...s}><rect x="2" y="8" width="20" height="8" rx="1" /></svg>;
    case 'shape':
      return <svg {...s}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>;
    default:
      return <svg {...s}><rect x="3" y="3" width="18" height="18" rx="2" /></svg>;
  }
}

export default function LayersPanel({
  elements,
  selectedIds,
  onSelectionChange,
  onElementsChange,
  onGroup,
  onUngroup,
}: LayersPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dragOverPosition, setDragOverPosition] = useState<'above' | 'below' | null>(null);
  const dragItemId = useRef<string | null>(null);

  // Sort by zIndex descending (top layers first)
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  // Group elements by groupId
  const groupIds = new Set<string>();
  elements.forEach(el => { if (el.groupId) groupIds.add(el.groupId); });

  // Build layer list: ungrouped elements + group headers with children
  interface LayerItem {
    type: 'element' | 'group-header';
    id: string;
    element?: CanvasElement;
    groupId?: string;
    children?: CanvasElement[];
    depth: number;
  }

  const layerItems: LayerItem[] = [];
  const processedGroups = new Set<string>();

  for (const el of sortedElements) {
    if (!el.visible && el.type === 'group') continue; // skip group type elements from render
    if (el.groupId) {
      if (!processedGroups.has(el.groupId)) {
        processedGroups.add(el.groupId);
        const children = sortedElements.filter(e => e.groupId === el.groupId);
        layerItems.push({
          type: 'group-header',
          id: `group-${el.groupId}`,
          groupId: el.groupId,
          children,
          depth: 0,
        });
        if (!collapsedGroups.has(el.groupId)) {
          for (const child of children) {
            layerItems.push({ type: 'element', id: child.id, element: child, groupId: child.groupId, depth: 1 });
          }
        }
      }
    } else {
      layerItems.push({ type: 'element', id: el.id, element: el, depth: 0 });
    }
  }

  const handleToggleVisibility = useCallback((id: string) => {
    const updated = elements.map(el =>
      el.id === id ? { ...el, visible: !el.visible } : el
    );
    onElementsChange(updated);
  }, [elements, onElementsChange]);

  const handleToggleLock = useCallback((id: string) => {
    const updated = elements.map(el =>
      el.id === id ? { ...el, locked: !el.locked } : el
    );
    onElementsChange(updated);
  }, [elements, onElementsChange]);

  const handleToggleGroupVisibility = useCallback((groupId: string) => {
    const children = elements.filter(el => el.groupId === groupId);
    const allVisible = children.every(el => el.visible);
    const updated = elements.map(el =>
      el.groupId === groupId ? { ...el, visible: !allVisible } : el
    );
    onElementsChange(updated);
  }, [elements, onElementsChange]);

  const handleToggleGroupLock = useCallback((groupId: string) => {
    const children = elements.filter(el => el.groupId === groupId);
    const allLocked = children.every(el => el.locked);
    const updated = elements.map(el =>
      el.groupId === groupId ? { ...el, locked: !allLocked } : el
    );
    onElementsChange(updated);
  }, [elements, onElementsChange]);

  const handleSelectElement = useCallback((id: string, e: React.MouseEvent) => {
    if (e.shiftKey) {
      const newIds = selectedIds.includes(id)
        ? selectedIds.filter(s => s !== id)
        : [...selectedIds, id];
      onSelectionChange(newIds);
    } else {
      onSelectionChange([id]);
    }
  }, [selectedIds, onSelectionChange]);

  const handleSelectGroup = useCallback((groupId: string, e: React.MouseEvent) => {
    const childIds = elements.filter(el => el.groupId === groupId).map(el => el.id);
    if (e.shiftKey) {
      const newIds = [...new Set([...selectedIds, ...childIds])];
      onSelectionChange(newIds);
    } else {
      onSelectionChange(childIds);
    }
  }, [elements, selectedIds, onSelectionChange]);

  const handleToggleCollapse = useCallback((groupId: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }, []);

  const handleStartRename = useCallback((id: string, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  }, []);

  const handleFinishRename = useCallback(() => {
    if (editingId && editValue.trim()) {
      const updated = elements.map(el =>
        el.id === editingId ? { ...el, layerName: editValue.trim() } : el
      );
      onElementsChange(updated);
    }
    setEditingId(null);
  }, [editingId, editValue, elements, onElementsChange]);

  // Drag-to-reorder
  const handleDragStart = useCallback((id: string) => {
    dragItemId.current = id;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    setDragOverId(targetId);
    setDragOverPosition(e.clientY < midY ? 'above' : 'below');
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
    setDragOverPosition(null);
  }, []);

  const handleDrop = useCallback((targetId: string) => {
    const sourceId = dragItemId.current;
    if (!sourceId || sourceId === targetId) {
      setDragOverId(null);
      setDragOverPosition(null);
      return;
    }

    // Find the target element to get its zIndex
    const targetEl = elements.find(el => el.id === targetId);
    const sourceEl = elements.find(el => el.id === sourceId);
    if (!targetEl || !sourceEl) {
      setDragOverId(null);
      setDragOverPosition(null);
      return;
    }

    // Reorder: set source element zIndex relative to target
    // In layers panel, top = higher zIndex. "above" in UI = higher zIndex.
    const targetZ = targetEl.zIndex;
    let newZ: number;
    if (dragOverPosition === 'above') {
      // Place above target = higher zIndex
      newZ = targetZ + 1;
    } else {
      // Place below target = lower zIndex
      newZ = targetZ - 1;
    }

    // If source has a group, move all group members
    const idsToMove = sourceEl.groupId
      ? elements.filter(el => el.groupId === sourceEl.groupId).map(el => el.id)
      : [sourceId];

    const updated = elements.map(el => {
      if (idsToMove.includes(el.id)) {
        return { ...el, zIndex: newZ + (el.zIndex - sourceEl.zIndex) };
      }
      return el;
    });

    onElementsChange(updated);
    setDragOverId(null);
    setDragOverPosition(null);
    dragItemId.current = null;
  }, [elements, onElementsChange, dragOverPosition]);

  const hasSelection = selectedIds.length >= 2;
  const selectedGroupId = selectedIds.length === 1
    ? elements.find(el => el.id === selectedIds[0])?.groupId
    : null;
  const allSelectedInSameGroup = selectedIds.length >= 1 && (() => {
    const gids = selectedIds.map(id => elements.find(el => el.id === id)?.groupId).filter(Boolean);
    return gids.length === selectedIds.length && new Set(gids).size === 1;
  })();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: 4, padding: '8px 10px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <button
          onClick={onGroup}
          disabled={!hasSelection}
          title="Group selected (Ctrl+G)"
          style={{
            flex: 1, padding: '5px 0', borderRadius: 4, border: 'none',
            backgroundColor: hasSelection ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
            color: hasSelection ? '#3B82F6' : 'rgba(255,255,255,0.25)',
            fontSize: 11, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
            cursor: hasSelection ? 'pointer' : 'default',
          }}
        >
          Group
        </button>
        <button
          onClick={onUngroup}
          disabled={!allSelectedInSameGroup && !selectedGroupId}
          title="Ungroup (Ctrl+Shift+G)"
          style={{
            flex: 1, padding: '5px 0', borderRadius: 4, border: 'none',
            backgroundColor: (allSelectedInSameGroup || selectedGroupId) ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)',
            color: (allSelectedInSameGroup || selectedGroupId) ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)',
            fontSize: 11, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
            cursor: (allSelectedInSameGroup || selectedGroupId) ? 'pointer' : 'default',
          }}
        >
          Ungroup
        </button>
      </div>

      {/* Layer list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {layerItems.length === 0 && (
          <div style={{
            padding: '24px 16px', textAlign: 'center',
            color: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'Manrope, sans-serif',
          }}>
            No elements on canvas
          </div>
        )}

        {layerItems.map(item => {
          if (item.type === 'group-header') {
            const gid = item.groupId!;
            const children = item.children!;
            const isCollapsed = collapsedGroups.has(gid);
            const allLocked = children.every(c => c.locked);
            const allVisible = children.every(c => c.visible);
            const childIds = children.map(c => c.id);
            const isGroupSelected = childIds.every(id => selectedIds.includes(id));

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: isGroupSelected ? 'rgba(59,130,246,0.12)' : 'transparent',
                  borderLeft: isGroupSelected ? '2px solid #3B82F6' : '2px solid transparent',
                }}
              >
                <div
                  style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    padding: '5px 8px', cursor: 'pointer',
                    fontSize: 12, fontFamily: 'Manrope, sans-serif',
                  }}
                  onClick={(e) => handleSelectGroup(gid, e)}
                >
                  {/* Collapse toggle */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleCollapse(gid); }}
                    style={{
                      width: 16, height: 16, border: 'none', background: 'none',
                      color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      {isCollapsed
                        ? <polyline points="9 18 15 12 9 6" />
                        : <polyline points="6 9 12 15 18 9" />
                      }
                    </svg>
                  </button>

                  {/* Group icon */}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>

                  <span style={{ flex: 1, color: '#fff', fontWeight: 600, fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    Group ({children.length})
                  </span>

                  {/* Visibility */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleGroupVisibility(gid); }}
                    title={allVisible ? 'Hide group' : 'Show group'}
                    style={{
                      width: 20, height: 20, border: 'none', background: 'none',
                      color: allVisible ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                      cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {allVisible ? (
                        <>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      ) : (
                        <>
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                          <line x1="1" y1="1" x2="23" y2="23" />
                        </>
                      )}
                    </svg>
                  </button>

                  {/* Lock */}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleGroupLock(gid); }}
                    title={allLocked ? 'Unlock group' : 'Lock group'}
                    style={{
                      width: 20, height: 20, border: 'none', background: 'none',
                      color: allLocked ? '#D4A017' : 'rgba(255,255,255,0.3)',
                      cursor: 'pointer', padding: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      {allLocked ? (
                        <>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </>
                      ) : (
                        <>
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>
            );
          }

          // Regular element row
          const el = item.element!;
          const isSelected = selectedIds.includes(el.id);
          const isDragTarget = dragOverId === el.id;
          const label = getLayerLabel(el);

          return (
            <div
              key={el.id}
              draggable
              onDragStart={() => handleDragStart(el.id)}
              onDragOver={(e) => handleDragOver(e, el.id)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(el.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '4px 8px',
                paddingLeft: item.depth > 0 ? 28 : 8,
                cursor: 'pointer',
                backgroundColor: isSelected ? 'rgba(59,130,246,0.12)' : 'transparent',
                borderLeft: isSelected ? '2px solid #3B82F6' : '2px solid transparent',
                borderTop: isDragTarget && dragOverPosition === 'above' ? '2px solid #3B82F6' : '2px solid transparent',
                borderBottom: isDragTarget && dragOverPosition === 'below' ? '2px solid #3B82F6' : '2px solid transparent',
                opacity: el.visible ? 1 : 0.4,
                transition: 'background-color 0.1s',
              }}
              onClick={(e) => handleSelectElement(el.id, e)}
              onMouseEnter={(e) => {
                if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.04)';
              }}
              onMouseLeave={(e) => {
                if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              {/* Drag handle */}
              <div
                style={{
                  width: 12, height: 16, cursor: 'grab',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                  color: 'rgba(255,255,255,0.2)', flexShrink: 0,
                }}
                title="Drag to reorder"
              >
                <div style={{ width: 6, height: 1, backgroundColor: 'currentColor' }} />
                <div style={{ width: 6, height: 1, backgroundColor: 'currentColor' }} />
                <div style={{ width: 6, height: 1, backgroundColor: 'currentColor' }} />
              </div>

              {/* Type icon */}
              <div style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                {getLayerIcon(el.type)}
              </div>

              {/* Layer name */}
              {editingId === el.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleFinishRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleFinishRename();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    flex: 1, minWidth: 0,
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(59,130,246,0.5)',
                    borderRadius: 3, padding: '1px 4px',
                    color: '#fff', fontSize: 11, fontFamily: 'Manrope, sans-serif',
                    outline: 'none',
                  }}
                />
              ) : (
                <span
                  onDoubleClick={(e) => { e.stopPropagation(); handleStartRename(el.id, label); }}
                  title="Double-click to rename"
                  style={{
                    flex: 1, minWidth: 0,
                    color: isSelected ? '#fff' : 'rgba(255,255,255,0.7)',
                    fontSize: 11, fontFamily: 'Manrope, sans-serif', fontWeight: isSelected ? 600 : 400,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              )}

              {/* Visibility toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleVisibility(el.id); }}
                title={el.visible ? 'Hide' : 'Show'}
                style={{
                  width: 20, height: 20, border: 'none', background: 'none',
                  color: el.visible ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer', padding: 0, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {el.visible ? (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </>
                  ) : (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </>
                  )}
                </svg>
              </button>

              {/* Lock toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); handleToggleLock(el.id); }}
                title={el.locked ? 'Unlock' : 'Lock'}
                style={{
                  width: 20, height: 20, border: 'none', background: 'none',
                  color: el.locked ? '#D4A017' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer', padding: 0, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {el.locked ? (
                    <>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </>
                  ) : (
                    <>
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
