'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

export interface ElementLayout {
  offsetX: number;
  offsetY: number;
  /** Override width (for image/badge elements) */
  width?: number;
  /** Override height (for image/badge elements) */
  height?: number;
  /** Override font size (for text elements) */
  fontSize?: number;
  /** Override scale factor (for badge/logo elements) */
  scale?: number;
}

export type AIEngElementId =
  | 'heroImage'
  | 'headline'
  | 'subtitle'
  | 'targetAudience'
  | 'badge'
  | 'logo'
  | 'uspStrip';

export type ElementOverrides = Partial<Record<AIEngElementId, ElementLayout>>;
export type PerSizeElementOverrides = Record<string, ElementOverrides>;

export const DEFAULT_ELEMENT_LAYOUT: ElementLayout = {
  offsetX: 0,
  offsetY: 0,
};

type HandleId = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

interface DraggableTemplateElementProps {
  elementId: AIEngElementId;
  isInteractive: boolean;
  canvasScale: number;
  layout: ElementLayout;
  /** 'image' uses width/height resize, 'text' uses fontSize, 'badge' uses scale */
  type: 'image' | 'text' | 'badge';
  onUpdate: (id: AIEngElementId, updates: Partial<ElementLayout>) => void;
  onSelect: (id: AIEngElementId | null) => void;
  isSelected: boolean;
  /** Default dimensions for resize ratio calculation */
  defaultWidth?: number;
  defaultHeight?: number;
  defaultFontSize?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

const MIN_SIZE = 50;

const HANDLE_CURSORS: Record<HandleId, string> = {
  nw: 'nwse-resize',
  se: 'nwse-resize',
  ne: 'nesw-resize',
  sw: 'nesw-resize',
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
};

export default function DraggableTemplateElement({
  elementId,
  isInteractive,
  canvasScale,
  layout,
  type,
  onUpdate,
  onSelect,
  isSelected,
  defaultWidth,
  defaultHeight,
  defaultFontSize,
  children,
  style,
  className,
}: DraggableTemplateElementProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);

  const dragRef = useRef({
    startClientX: 0,
    startClientY: 0,
    startOffsetX: 0,
    startOffsetY: 0,
  });

  const resizeRef = useRef({
    startClientX: 0,
    startClientY: 0,
    startWidth: 0,
    startHeight: 0,
    startOffsetX: 0,
    startOffsetY: 0,
    startFontSize: 0,
    startScale: 1,
    handle: '' as HandleId | string,
    aspectRatio: 1,
  });

  // Inverse scale for constant-size UI elements
  const inv = 1 / Math.max(canvasScale, 0.1);

  // Click outside to deselect
  useEffect(() => {
    if (!isSelected || !isInteractive) return;
    const onClick = (e: MouseEvent) => {
      if (elRef.current && !elRef.current.contains(e.target as Node)) {
        onSelect(null);
      }
    };
    const id = setTimeout(() => window.addEventListener('mousedown', onClick), 0);
    return () => {
      clearTimeout(id);
      window.removeEventListener('mousedown', onClick);
    };
  }, [isSelected, isInteractive, onSelect]);

  // ── DRAG ──
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (isResizing || !isInteractive) return;
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
      onSelect(elementId);
      dragRef.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startOffsetX: layout.offsetX,
        startOffsetY: layout.offsetY,
      };
    },
    [isResizing, isInteractive, layout.offsetX, layout.offsetY, elementId, onSelect],
  );

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - dragRef.current.startClientX) / canvasScale;
      const dy = (e.clientY - dragRef.current.startClientY) / canvasScale;
      onUpdate(elementId, {
        offsetX: dragRef.current.startOffsetX + dx,
        offsetY: dragRef.current.startOffsetY + dy,
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging, canvasScale, elementId, onUpdate]);

  // ── RESIZE ──
  const startResize = useCallback(
    (handle: HandleId | string) => (e: React.MouseEvent) => {
      if (!isInteractive) return;
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      onSelect(elementId);
      const w = layout.width ?? defaultWidth ?? 200;
      const h = layout.height ?? defaultHeight ?? 200;
      resizeRef.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startWidth: w,
        startHeight: h,
        startOffsetX: layout.offsetX,
        startOffsetY: layout.offsetY,
        startFontSize: layout.fontSize ?? defaultFontSize ?? 40,
        startScale: layout.scale ?? 1,
        handle,
        aspectRatio: w / Math.max(h, 1),
      };
    },
    [isInteractive, layout, defaultWidth, defaultHeight, defaultFontSize, elementId, onSelect],
  );

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - resizeRef.current.startClientX) / canvasScale;
      const dy = (e.clientY - resizeRef.current.startClientY) / canvasScale;
      const { handle, startWidth, startHeight, startOffsetX, startOffsetY, startFontSize, startScale, aspectRatio } = resizeRef.current;

      if (type === 'image') {
        let newW = startWidth;
        let newH = startHeight;
        let newOffX = startOffsetX;
        let newOffY = startOffsetY;

        switch (handle) {
          // ── CORNERS: aspect-ratio locked ──
          case 'se': {
            // Anchor: top-left. Grow right+down.
            const delta = Math.abs(dx) > Math.abs(dy) ? dx : dy * aspectRatio;
            newW = Math.max(MIN_SIZE, startWidth + delta);
            newH = newW / aspectRatio;
            break;
          }
          case 'ne': {
            // Anchor: bottom-left. Grow right+up.
            const delta = Math.abs(dx) > Math.abs(dy) ? dx : -dy * aspectRatio;
            newW = Math.max(MIN_SIZE, startWidth + delta);
            newH = newW / aspectRatio;
            newOffY = startOffsetY - (newH - startHeight);
            break;
          }
          case 'sw': {
            // Anchor: top-right. Grow left+down.
            const delta = Math.abs(dx) > Math.abs(dy) ? -dx : dy * aspectRatio;
            newW = Math.max(MIN_SIZE, startWidth + delta);
            newH = newW / aspectRatio;
            newOffX = startOffsetX - (newW - startWidth);
            break;
          }
          case 'nw': {
            // Anchor: bottom-right. Grow left+up.
            const delta = Math.abs(dx) > Math.abs(dy) ? -dx : -dy * aspectRatio;
            newW = Math.max(MIN_SIZE, startWidth + delta);
            newH = newW / aspectRatio;
            newOffX = startOffsetX - (newW - startWidth);
            newOffY = startOffsetY - (newH - startHeight);
            break;
          }
          // ── EDGES: free stretch (one axis only) ──
          case 'e': {
            newW = Math.max(MIN_SIZE, startWidth + dx);
            break;
          }
          case 'w': {
            newW = Math.max(MIN_SIZE, startWidth - dx);
            newOffX = startOffsetX - (newW - startWidth);
            break;
          }
          case 's': {
            newH = Math.max(MIN_SIZE, startHeight + dy);
            break;
          }
          case 'n': {
            newH = Math.max(MIN_SIZE, startHeight - dy);
            newOffY = startOffsetY - (newH - startHeight);
            break;
          }
        }
        onUpdate(elementId, { width: newW, height: newH, offsetX: newOffX, offsetY: newOffY });
      } else if (type === 'text') {
        // Text: corners adjust font size
        let delta = dx;
        if (handle === 'sw' || handle === 'nw' || handle === 'w') delta = -dx;
        const newSize = Math.max(10, Math.min(200, startFontSize + delta * 0.5));
        onUpdate(elementId, { fontSize: newSize });
      } else if (type === 'badge') {
        let delta = dx;
        if (handle === 'sw' || handle === 'nw' || handle === 'w') delta = -dx;
        const newScale = Math.max(0.3, Math.min(3, startScale + delta * 0.003));
        onUpdate(elementId, { scale: newScale });
      }
    };
    const onUp = () => setIsResizing(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isResizing, canvasScale, type, elementId, onUpdate]);

  if (!isInteractive) {
    // Static mode: just apply offsets, no drag UI
    return (
      <div
        style={{
          ...style,
          transform: layout.offsetX || layout.offsetY
            ? `translate(${layout.offsetX}px, ${layout.offsetY}px)`
            : undefined,
        }}
        className={className}
      >
        {children}
      </div>
    );
  }

  const showUI = isSelected || isHovered;
  const handlePx = 10 * inv;
  const borderPx = 2 * inv;

  // For image type when selected, show 8 handles; for text/badge show 4 corners
  const isImage = type === 'image';

  // Corner handles (all types get these when selected)
  const cornerHandles: { id: HandleId; isTop: boolean; isLeft: boolean }[] = [
    { id: 'nw', isTop: true, isLeft: true },
    { id: 'ne', isTop: true, isLeft: false },
    { id: 'sw', isTop: false, isLeft: true },
    { id: 'se', isTop: false, isLeft: false },
  ];

  // Edge/midpoint handles (only for image type)
  const edgeHandles: { id: HandleId; top?: string; bottom?: string; left?: string; right?: string; transform: string }[] = [
    { id: 'n', top: `${-handlePx / 2}px`, left: '50%', transform: 'translateX(-50%)' },
    { id: 's', bottom: `${-handlePx / 2}px`, left: '50%', transform: 'translateX(-50%)' },
    { id: 'e', top: '50%', right: `${-handlePx / 2}px`, transform: 'translateY(-50%)' },
    { id: 'w', top: '50%', left: `${-handlePx / 2}px`, transform: 'translateY(-50%)' },
  ];

  return (
    <div
      ref={elRef}
      style={{
        ...style,
        transform: `translate(${layout.offsetX}px, ${layout.offsetY}px)`,
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
        zIndex: isSelected ? 100 : (style?.zIndex as number | undefined),
      }}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        if (!isDragging && !isResizing) setIsHovered(false);
      }}
      onMouseDown={handleDragStart}
    >
      {children}

      {/* Hover/selection border */}
      {showUI && (
        <div
          style={{
            position: 'absolute',
            inset: -borderPx,
            border: `${borderPx}px ${isSelected ? 'solid' : 'dashed'} ${isSelected ? '#3B82F6' : 'rgba(59,130,246,0.4)'}`,
            borderRadius: 4 * inv,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}

      {/* Corner resize handles (all types) */}
      {isSelected &&
        cornerHandles.map(({ id, isTop, isLeft }) => (
          <div
            key={id}
            onMouseDown={startResize(id)}
            style={{
              position: 'absolute',
              width: handlePx,
              height: handlePx,
              backgroundColor: '#ffffff',
              border: `${borderPx}px solid #3B82F6`,
              borderRadius: 2 * inv,
              top: isTop ? -handlePx / 2 : undefined,
              bottom: isTop ? undefined : -handlePx / 2,
              left: isLeft ? -handlePx / 2 : undefined,
              right: isLeft ? undefined : -handlePx / 2,
              cursor: HANDLE_CURSORS[id],
              zIndex: 11,
            }}
          />
        ))}

      {/* Edge/midpoint resize handles (image type only) */}
      {isSelected && isImage &&
        edgeHandles.map((h) => (
          <div
            key={h.id}
            onMouseDown={startResize(h.id)}
            style={{
              position: 'absolute',
              width: (h.id === 'n' || h.id === 's') ? handlePx * 1.6 : handlePx,
              height: (h.id === 'e' || h.id === 'w') ? handlePx * 1.6 : handlePx,
              backgroundColor: '#ffffff',
              border: `${borderPx}px solid #3B82F6`,
              borderRadius: 2 * inv,
              top: h.top,
              bottom: h.bottom,
              left: h.left,
              right: h.right,
              transform: h.transform,
              cursor: HANDLE_CURSORS[h.id],
              zIndex: 11,
            }}
          />
        ))}

      {/* Reset button (only when element has been moved/resized) */}
      {isSelected && (layout.offsetX !== 0 || layout.offsetY !== 0 || layout.width || layout.height || layout.fontSize || layout.scale) && (
        <button
          onClick={e => {
            e.stopPropagation();
            onUpdate(elementId, {
              offsetX: 0,
              offsetY: 0,
              width: undefined,
              height: undefined,
              fontSize: undefined,
              scale: undefined,
            });
          }}
          onMouseDown={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            top: -28 * inv,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0,0,0,0.8)',
            color: '#ffffff',
            padding: `${2 * inv}px ${8 * inv}px`,
            borderRadius: 4 * inv,
            fontSize: 11 * inv,
            fontFamily: "'Kanit', sans-serif",
            fontWeight: 500,
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            border: 'none',
            zIndex: 12,
          }}
          title="Reset to default position"
        >
          Reset
        </button>
      )}
    </div>
  );
}
