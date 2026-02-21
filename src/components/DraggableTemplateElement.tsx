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

const MIN_SIZE = 40;

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
    startFontSize: 0,
    startScale: 1,
    corner: '',
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
    (corner: string) => (e: React.MouseEvent) => {
      if (!isInteractive) return;
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      onSelect(elementId);
      resizeRef.current = {
        startClientX: e.clientX,
        startClientY: e.clientY,
        startWidth: layout.width ?? defaultWidth ?? 200,
        startHeight: layout.height ?? defaultHeight ?? 200,
        startFontSize: layout.fontSize ?? defaultFontSize ?? 40,
        startScale: layout.scale ?? 1,
        corner,
      };
    },
    [isInteractive, layout, defaultWidth, defaultHeight, defaultFontSize, elementId, onSelect],
  );

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      const dx = (e.clientX - resizeRef.current.startClientX) / canvasScale;
      const dy = (e.clientY - resizeRef.current.startClientY) / canvasScale;
      const { corner, startWidth, startHeight, startFontSize, startScale } = resizeRef.current;

      // Compute delta based on corner direction
      let delta = dx;
      if (corner === 'sw' || corner === 'nw') delta = -dx;
      if (corner === 'ne' || corner === 'nw') delta = Math.abs(dx) > Math.abs(dy) ? (corner === 'nw' ? -dx : dx) : -dy;

      if (type === 'image') {
        const ratio = startWidth / startHeight;
        const newW = Math.max(MIN_SIZE, startWidth + delta);
        const newH = newW / ratio;
        onUpdate(elementId, { width: newW, height: newH });
      } else if (type === 'text') {
        const newSize = Math.max(10, Math.min(200, startFontSize + delta * 0.5));
        onUpdate(elementId, { fontSize: newSize });
      } else if (type === 'badge') {
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

  const cornerCursor: Record<string, string> = {
    nw: 'nwse-resize',
    ne: 'nesw-resize',
    sw: 'nesw-resize',
    se: 'nwse-resize',
  };

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
            border: `${borderPx}px solid ${isSelected ? '#3B82F6' : 'rgba(59,130,246,0.4)'}`,
            borderRadius: 4 * inv,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        />
      )}

      {/* Corner resize handles */}
      {isSelected &&
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
                zIndex: 11,
              }}
            />
          );
        })}

      {/* Reset button (only when element has been moved) */}
      {isSelected && (layout.offsetX !== 0 || layout.offsetY !== 0) && (
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
