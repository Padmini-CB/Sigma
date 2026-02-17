'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { type SelectedCharacter } from '@/app/editor/[id]/page';

const ASSET_BASE = '/assets/founders';
const MIN_SIZE = 100;

interface ManifestExpression {
  id: string;
  label: string;
  file: string;
}

interface ManifestPerson {
  id: string;
  name: string;
  expressions: ManifestExpression[];
}

interface Manifest {
  people: ManifestPerson[];
}

interface DraggableCharacterProps {
  character: SelectedCharacter;
  canvasWidth: number;
  canvasHeight: number;
  canvasScale: number;
  onUpdate: (updates: Partial<SelectedCharacter>) => void;
  onDelete: () => void;
}

function getInitialBounds(
  char: SelectedCharacter,
  canvasWidth: number,
  canvasHeight: number,
) {
  if (
    char.x !== undefined &&
    char.y !== undefined &&
    char.w !== undefined &&
    char.h !== undefined
  ) {
    return { x: char.x, y: char.y, w: char.w, h: char.h };
  }
  const s = char.size || 350;
  let x: number;
  let y: number;
  switch (char.position) {
    case 'left':
      x = 0;
      y = canvasHeight - s;
      break;
    case 'bottom':
      x = (canvasWidth - s) / 2;
      y = canvasHeight - s;
      break;
    case 'right':
    default:
      x = canvasWidth - s;
      y = canvasHeight - s;
      break;
  }
  return { x, y, w: s, h: s };
}

export default function DraggableCharacter({
  character,
  canvasWidth,
  canvasHeight,
  canvasScale,
  onUpdate,
  onDelete,
}: DraggableCharacterProps) {
  const bounds = getInitialBounds(character, canvasWidth, canvasHeight);
  const zIndex = character.zIndex ?? 50;

  // Inverse scale for making UI elements a constant visual size
  const inv = 1 / Math.max(canvasScale, 0.1);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [showQuickSwap, setShowQuickSwap] = useState(false);
  const [quickSwapPos, setQuickSwapPos] = useState({ x: 0, y: 0 });
  const [resizeDims, setResizeDims] = useState<{ w: number; h: number } | null>(null);
  const [manifest, setManifest] = useState<Manifest | null>(null);

  const dragRef = useRef({ clientX: 0, clientY: 0, charX: 0, charY: 0 });
  const resizeRef = useRef({
    clientX: 0, clientY: 0,
    charX: 0, charY: 0, charW: 0, charH: 0,
    corner: '',
  });
  const elRef = useRef<HTMLDivElement>(null);

  // Load manifest for quick-swap
  useEffect(() => {
    fetch(`${ASSET_BASE}/_manifest.json`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => { if (data) setManifest(data); })
      .catch(() => {});
  }, []);

  // Delete / Backspace key
  useEffect(() => {
    if (!isSelected) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDelete();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isSelected, onDelete]);

  // Click outside to deselect
  useEffect(() => {
    if (!isSelected) return;
    const onClick = (e: MouseEvent) => {
      if (elRef.current && !elRef.current.contains(e.target as Node)) {
        setIsSelected(false);
        setShowContextMenu(false);
        setShowQuickSwap(false);
      }
    };
    // Use setTimeout to avoid catching the same click
    const id = setTimeout(() => window.addEventListener('mousedown', onClick), 0);
    return () => {
      clearTimeout(id);
      window.removeEventListener('mousedown', onClick);
    };
  }, [isSelected]);

  // ── DRAG ──────────────────────────────────────────────────
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (isResizing) return;
      // Ignore right-clicks
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      setIsSelected(true);
      setShowContextMenu(false);
      setShowQuickSwap(false);
      dragRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        charX: bounds.x,
        charY: bounds.y,
      };
    },
    [isResizing, bounds.x, bounds.y],
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragRef.current.clientX) / canvasScale;
      const dy = (e.clientY - dragRef.current.clientY) / canvasScale;
      const newX = Math.max(
        -bounds.w * 0.5,
        Math.min(canvasWidth - bounds.w * 0.5, dragRef.current.charX + dx),
      );
      const newY = Math.max(
        -bounds.h * 0.5,
        Math.min(canvasHeight - bounds.h * 0.5, dragRef.current.charY + dy),
      );
      onUpdate({ x: newX, y: newY, w: bounds.w, h: bounds.h });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, canvasScale, canvasWidth, canvasHeight, bounds.w, bounds.h, onUpdate]);

  // ── RESIZE ────────────────────────────────────────────────
  const startResize = useCallback(
    (corner: string) => (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      setIsSelected(true);
      resizeRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        charX: bounds.x,
        charY: bounds.y,
        charW: bounds.w,
        charH: bounds.h,
        corner,
      };
    },
    [bounds],
  );

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      const { clientX: sx, clientY: sy, charX, charY, charW, charH, corner } =
        resizeRef.current;
      const dx = (e.clientX - sx) / canvasScale;
      const dy = (e.clientY - sy) / canvasScale;
      const ratio = charW / charH;
      const maxW = canvasWidth;

      let nw = charW;
      let nh = charH;
      let nx = charX;
      let ny = charY;

      if (corner === 'se') {
        nw = charW + dx;
      } else if (corner === 'sw') {
        nw = charW - dx;
        nx = charX + (charW - nw);
      } else if (corner === 'ne') {
        nw = charW + dx;
        ny = charY + (charH - nw / ratio);
      } else if (corner === 'nw') {
        nw = charW - dx;
        nx = charX + (charW - nw);
        ny = charY + (charH - nw / ratio);
      }

      nw = Math.max(MIN_SIZE, Math.min(maxW, nw));
      nh = nw / ratio;

      // Recalculate position for corners that anchor opposite side
      if (corner === 'sw' || corner === 'nw') {
        nx = charX + charW - nw;
      }
      if (corner === 'ne' || corner === 'nw') {
        ny = charY + charH - nh;
      }

      setResizeDims({ w: Math.round(nw), h: Math.round(nh) });
      onUpdate({ x: nx, y: ny, w: nw, h: nh });
    };
    const onUp = () => {
      setIsResizing(false);
      setResizeDims(null);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isResizing, canvasScale, canvasWidth, canvasHeight, onUpdate]);

  // ── CONTEXT MENU (right-click) ────────────────────────────
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenuPos({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
    setShowQuickSwap(false);
    setIsSelected(true);
  }, []);

  // ── DOUBLE-CLICK → QUICK-SWAP ────────────────────────────
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickSwapPos({ x: e.clientX, y: e.clientY });
    setShowQuickSwap(true);
    setShowContextMenu(false);
    setIsSelected(true);
  }, []);

  // Person expressions for quick-swap
  const personExpressions =
    manifest?.people.find(
      p => p.id === (character.personId || character.key),
    )?.expressions || [];

  const showUI = isSelected || isHovered;
  const handlePx = 10 * inv; // constant visual size
  const borderPx = 2 * inv;
  const deleteBtnPx = 24 * inv;

  const cornerCursor: Record<string, string> = {
    nw: 'nwse-resize',
    ne: 'nesw-resize',
    sw: 'nesw-resize',
    se: 'nwse-resize',
  };

  return (
    <>
      <div
        ref={elRef}
        style={{
          position: 'absolute',
          left: bounds.x,
          top: bounds.y,
          width: bounds.w,
          height: bounds.h,
          zIndex,
          cursor: isDragging ? 'grabbing' : 'crosshair',
          userSelect: 'none',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          if (!isDragging && !isResizing) setIsHovered(false);
        }}
        onMouseDown={handleDragStart}
        onContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={character.image}
          alt={character.name}
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom',
            pointerEvents: 'none',
          }}
        />

        {/* Selection border */}
        {showUI && (
          <div
            style={{
              position: 'absolute',
              inset: -borderPx,
              border: `${borderPx}px solid #3B82F6`,
              borderRadius: 4 * inv,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Corner resize handles */}
        {showUI &&
          (['nw', 'ne', 'sw', 'se'] as const).map(corner => {
            const isTop = corner[0] === 'n';
            const isLeft = corner[1] === 'w';
            return (
              <div
                key={corner}
                onMouseDown={startResize(corner)}
                style={{
                  position: 'absolute',
                  width: handlePx,
                  height: handlePx,
                  backgroundColor: '#3B82F6',
                  border: `${borderPx}px solid #ffffff`,
                  borderRadius: 2 * inv,
                  top: isTop ? -handlePx / 2 : undefined,
                  bottom: isTop ? undefined : -handlePx / 2,
                  left: isLeft ? -handlePx / 2 : undefined,
                  right: isLeft ? undefined : -handlePx / 2,
                  cursor: cornerCursor[corner],
                  zIndex: 1,
                }}
              />
            );
          })}

        {/* Delete button */}
        {showUI && !isDragging && !isResizing && (
          <button
            onClick={e => {
              e.stopPropagation();
              onDelete();
            }}
            onMouseDown={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: -deleteBtnPx * 0.6,
              right: -deleteBtnPx * 0.6,
              width: deleteBtnPx,
              height: deleteBtnPx,
              borderRadius: '50%',
              backgroundColor: '#ef4444',
              border: `${borderPx}px solid #ffffff`,
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 2,
              fontSize: 14 * inv,
              fontWeight: 700,
              lineHeight: 1,
              padding: 0,
            }}
            title="Remove (Delete key)"
          >
            &times;
          </button>
        )}

        {/* Dimension tooltip while resizing */}
        {isResizing && resizeDims && (
          <div
            style={{
              position: 'absolute',
              bottom: -28 * inv,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(0,0,0,0.85)',
              color: '#ffffff',
              padding: `${3 * inv}px ${8 * inv}px`,
              borderRadius: 4 * inv,
              fontSize: 12 * inv,
              fontFamily: "'Kanit', sans-serif",
              fontWeight: 500,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {resizeDims.w} &times; {resizeDims.h}
          </div>
        )}
      </div>

      {/* ── Fixed-position overlays (escape canvas overflow:hidden) ── */}

      {/* Right-click context menu */}
      {showContextMenu && (
        <FixedOverlay onClose={() => setShowContextMenu(false)}>
          <div
            style={{
              position: 'fixed',
              left: contextMenuPos.x,
              top: contextMenuPos.y,
              backgroundColor: '#1e1e2e',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 8,
              padding: 4,
              zIndex: 9999,
              minWidth: 170,
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <ContextButton
              disabled={zIndex >= 50}
              onClick={() => {
                onUpdate({ zIndex: 50 });
                setShowContextMenu(false);
              }}
            >
              Bring to Front
            </ContextButton>
            <ContextButton
              disabled={zIndex <= 1}
              onClick={() => {
                onUpdate({ zIndex: 1 });
                setShowContextMenu(false);
              }}
            >
              Send to Back
            </ContextButton>
          </div>
        </FixedOverlay>
      )}

      {/* Quick-swap popup */}
      {showQuickSwap && personExpressions.length > 0 && (
        <FixedOverlay onClose={() => setShowQuickSwap(false)}>
          <div
            style={{
              position: 'fixed',
              left: quickSwapPos.x + 8,
              top: quickSwapPos.y - 60,
              backgroundColor: '#1e1e2e',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 10,
              padding: 8,
              zIndex: 9999,
              maxHeight: 280,
              overflowY: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
            onMouseDown={e => e.stopPropagation()}
          >
            <div
              style={{
                fontFamily: "'Saira Condensed', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: '#3B82F6',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '2px 4px 6px',
              }}
            >
              Quick Swap
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 4,
              }}
            >
              {personExpressions.map(expr => {
                const imgPath = `${ASSET_BASE}/${expr.file}`;
                const isCurrent = character.image === imgPath;
                return (
                  <button
                    key={expr.id}
                    onClick={e => {
                      e.stopPropagation();
                      onUpdate({ image: imgPath, expressionId: expr.id });
                      setShowQuickSwap(false);
                    }}
                    style={{
                      position: 'relative',
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: isCurrent
                        ? '2px solid #3B82F6'
                        : '1px solid rgba(255,255,255,0.1)',
                      backgroundColor: isCurrent
                        ? 'rgba(59,130,246,0.1)'
                        : 'rgba(255,255,255,0.03)',
                      cursor: 'pointer',
                      padding: 0,
                      width: 56,
                      height: 56,
                    }}
                    title={expr.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imgPath}
                      alt={expr.label}
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '2px',
                        background:
                          'linear-gradient(transparent, rgba(0,0,0,0.7))',
                        fontFamily: "'Kanit', sans-serif",
                        fontSize: 8,
                        color: 'rgba(255,255,255,0.8)',
                        textAlign: 'center',
                      }}
                    >
                      {expr.label}
                    </span>
                    {isCurrent && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          width: 14,
                          height: 14,
                          borderRadius: '50%',
                          backgroundColor: '#3B82F6',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <svg
                          width="8"
                          height="8"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="white"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </FixedOverlay>
      )}
    </>
  );
}

// ── Helpers ──────────────────────────────────────────────────

/** Backdrop that catches clicks outside the popup */
function FixedOverlay({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
      }}
      onMouseDown={e => {
        e.stopPropagation();
        onClose();
      }}
    >
      {children}
    </div>
  );
}

function ContextButton({
  children,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={e => {
        e.stopPropagation();
        if (!disabled) onClick();
      }}
      onMouseDown={e => e.stopPropagation()}
      style={{
        display: 'block',
        width: '100%',
        textAlign: 'left',
        padding: '6px 12px',
        borderRadius: 4,
        backgroundColor: 'transparent',
        border: 'none',
        color: disabled ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.85)',
        fontFamily: "'Kanit', sans-serif",
        fontSize: 13,
        fontWeight: 400,
        cursor: disabled ? 'default' : 'pointer',
      }}
      onMouseEnter={e => {
        if (!disabled)
          (e.currentTarget as HTMLElement).style.backgroundColor =
            'rgba(59,130,246,0.2)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </button>
  );
}
