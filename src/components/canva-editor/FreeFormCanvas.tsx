'use client';

import React, { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import type {
  CanvasElement,
  TextStyle,
  ResizeHandle,
  SnapGuide,
  DragState,
  ResizeState,
  SelectionRect,
  Position,
} from './types';
import TextToolbar from './TextToolbar';

// ─── Props ────────────────────────────────────────────────────────────────────

interface FreeFormCanvasProps {
  elements: CanvasElement[];
  selectedIds: string[];
  canvasWidth: number;
  canvasHeight: number;
  zoom: number; // 25-200
  onElementsChange: (elements: CanvasElement[]) => void;
  onElementsUpdate: (elements: CanvasElement[]) => void;
  onSelectionChange: (ids: string[]) => void;
  onTextEditStart?: () => void;
  onTextEditEnd?: () => void;
  onZoomChange?: (updater: number | ((prev: number) => number)) => void;
  canvasExportRef?: React.Ref<HTMLDivElement>;
  // Eraser tool
  eraserMode?: boolean;
  eraserBrushSize?: number;
  eraserSoftness?: number;
  eraserOpacity?: number;
  eraserMagicMode?: boolean;
  eraserMagicTolerance?: number;
  eraserMagicRadius?: number;
  eraserMagicSoftness?: number;
  // File drop handler for uploads
  onFileDrop?: (dataUrl: string, width: number, height: number, x: number, y: number) => void;
  // Custom canvas background (CSS value)
  canvasBackground?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SNAP_THRESHOLD = 5;
const MIN_SIZE = 20;
const HANDLE_SIZE = 8;

const RESIZE_HANDLES: ResizeHandle[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

const HANDLE_CURSORS: Record<ResizeHandle, string> = {
  nw: 'nwse-resize',
  n: 'ns-resize',
  ne: 'nesw-resize',
  e: 'ew-resize',
  se: 'nwse-resize',
  s: 'ns-resize',
  sw: 'nesw-resize',
  w: 'ew-resize',
};

const HANDLE_POSITIONS: Record<ResizeHandle, { top: string; left: string; transform: string }> = {
  nw: { top: '0%', left: '0%', transform: 'translate(-50%, -50%)' },
  n: { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' },
  ne: { top: '0%', left: '100%', transform: 'translate(-50%, -50%)' },
  e: { top: '50%', left: '100%', transform: 'translate(-50%, -50%)' },
  se: { top: '100%', left: '100%', transform: 'translate(-50%, -50%)' },
  s: { top: '100%', left: '50%', transform: 'translate(-50%, -50%)' },
  sw: { top: '100%', left: '0%', transform: 'translate(-50%, -50%)' },
  w: { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' },
};

// ─── Context Menu Item ────────────────────────────────────────────────────────

interface ContextMenuItem {
  label: string;
  action: string;
  shortcut?: string;
  separator?: false;
}

interface ContextMenuSeparator {
  separator: true;
}

type ContextMenuEntry = ContextMenuItem | ContextMenuSeparator;

const CONTEXT_MENU_ITEMS: ContextMenuEntry[] = [
  { label: 'Bring to Front', action: 'bringToFront', shortcut: 'Ctrl+]' },
  { label: 'Bring Forward', action: 'bringForward', shortcut: ']' },
  { label: 'Send Backward', action: 'sendBackward', shortcut: '[' },
  { label: 'Send to Back', action: 'sendToBack', shortcut: 'Ctrl+[' },
  { separator: true },
  { label: 'Duplicate', action: 'duplicate', shortcut: 'Ctrl+D' },
  { label: 'Delete', action: 'delete', shortcut: 'Del' },
];

// ─── Snap Guide Computation ───────────────────────────────────────────────────

function computeSnapGuides(
  movingIds: string[],
  allElements: CanvasElement[],
  canvasWidth: number,
  canvasHeight: number,
  currentPositions: Record<string, Position>
): { guides: SnapGuide[]; snapOffsetX: number; snapOffsetY: number } {
  const guides: SnapGuide[] = [];
  let snapOffsetX = 0;
  let snapOffsetY = 0;

  const movingBounds = movingIds.reduce(
    (acc, id) => {
      const el = allElements.find((e) => e.id === id);
      if (!el) return acc;
      const pos = currentPositions[id] || { x: el.x, y: el.y };
      return {
        left: Math.min(acc.left, pos.x),
        top: Math.min(acc.top, pos.y),
        right: Math.max(acc.right, pos.x + el.width),
        bottom: Math.max(acc.bottom, pos.y + el.height),
      };
    },
    { left: Infinity, top: Infinity, right: -Infinity, bottom: -Infinity }
  );

  const movingCenterX = (movingBounds.left + movingBounds.right) / 2;
  const movingCenterY = (movingBounds.top + movingBounds.bottom) / 2;

  // Canvas center guides
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  const verticalTargets: number[] = [0, canvasCenterX, canvasWidth];
  const horizontalTargets: number[] = [0, canvasCenterY, canvasHeight];

  // Gather edges from non-moving elements
  allElements.forEach((el) => {
    if (movingIds.includes(el.id) || !el.visible) return;
    verticalTargets.push(el.x, el.x + el.width, el.x + el.width / 2);
    horizontalTargets.push(el.y, el.y + el.height, el.y + el.height / 2);
  });

  // Check vertical snaps (moving element edges and center)
  const movingVEdges = [movingBounds.left, movingCenterX, movingBounds.right];
  let bestVDist = SNAP_THRESHOLD + 1;
  let bestVSnap: { target: number; movingEdge: number } | null = null;

  for (const mEdge of movingVEdges) {
    for (const target of verticalTargets) {
      const dist = Math.abs(mEdge - target);
      if (dist < bestVDist) {
        bestVDist = dist;
        bestVSnap = { target, movingEdge: mEdge };
      }
    }
  }

  if (bestVSnap && bestVDist <= SNAP_THRESHOLD) {
    snapOffsetX = bestVSnap.target - bestVSnap.movingEdge;
    guides.push({ type: 'vertical', position: bestVSnap.target });
  }

  // Check horizontal snaps
  const movingHEdges = [movingBounds.top, movingCenterY, movingBounds.bottom];
  let bestHDist = SNAP_THRESHOLD + 1;
  let bestHSnap: { target: number; movingEdge: number } | null = null;

  for (const mEdge of movingHEdges) {
    for (const target of horizontalTargets) {
      const dist = Math.abs(mEdge - target);
      if (dist < bestHDist) {
        bestHDist = dist;
        bestHSnap = { target, movingEdge: mEdge };
      }
    }
  }

  if (bestHSnap && bestHDist <= SNAP_THRESHOLD) {
    snapOffsetY = bestHSnap.target - bestHSnap.movingEdge;
    guides.push({ type: 'horizontal', position: bestHSnap.target });
  }

  return { guides, snapOffsetX, snapOffsetY };
}

// ─── Element Renderer ─────────────────────────────────────────────────────────

function renderElementContent(el: CanvasElement): React.ReactNode {
  switch (el.type) {
    case 'image': {
      const imgStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: el.imageStyle?.objectFit || 'cover',
        borderRadius: el.imageStyle?.borderRadius ?? 0,
        opacity: el.imageStyle?.opacity ?? 1,
        display: 'block',
        pointerEvents: 'none',
        userSelect: 'none',
      };

      if (el.imageStyle?.maskType === 'radial') {
        imgStyle.maskImage = `radial-gradient(${el.imageStyle.maskParams || 'ellipse at center, black 60%, transparent 100%'})`;
        imgStyle.WebkitMaskImage = imgStyle.maskImage;
      } else if (el.imageStyle?.maskType === 'linear') {
        imgStyle.maskImage = `linear-gradient(${el.imageStyle.maskParams || 'to bottom, black 60%, transparent 100%'})`;
        imgStyle.WebkitMaskImage = imgStyle.maskImage;
      }

      const containerStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        position: 'relative',
        borderRadius: el.imageStyle?.borderRadius ?? 0,
      };

      // Glow: a blurred colored circle behind the hero image
      const glowDiv = el.glowColor ? (
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '80%',
          height: '80%',
          background: `radial-gradient(circle, ${el.glowColor} 0%, transparent 70%)`,
          filter: 'blur(80px)',
          opacity: 0.35,
          pointerEvents: 'none',
          zIndex: 0,
        }} />
      ) : null;

      return (
        <div style={containerStyle}>
          {glowDiv}
          <img src={el.content} alt="" style={{ ...imgStyle, position: 'relative', zIndex: 1 }} draggable={false} />
        </div>
      );
    }

    case 'text': {
      const ts = el.textStyle;
      const textStyle: React.CSSProperties = {
        fontFamily: ts?.fontFamily || 'sans-serif',
        fontSize: ts?.fontSize ?? 16,
        fontWeight: ts?.fontWeight ?? 400,
        fontStyle: ts?.fontStyle || 'normal',
        color: ts?.color || '#ffffff',
        textAlign: ts?.textAlign || 'left',
        letterSpacing: ts?.letterSpacing ?? 0,
        lineHeight: ts?.lineHeight ?? 1.2,
        textTransform: ts?.textTransform || 'none',
        transform: ts?.scaleX != null ? `scaleX(${ts.scaleX})` : undefined,
        width: '100%',
        height: '100%',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        overflow: 'hidden',
        pointerEvents: 'none',
        userSelect: 'none',
        margin: 0,
        padding: 0,
      };
      return <div style={textStyle}>{el.content}</div>;
    }

    case 'button': {
      const bs = el.buttonStyle;
      const btnStyle: React.CSSProperties = {
        width: 'auto',
        height: 'auto',
        minWidth: 150,
        backgroundColor: bs?.backgroundColor || '#D7EF3F',
        color: bs?.textColor || '#181830',
        fontFamily: bs?.fontFamily || 'Kanit, sans-serif',
        fontSize: bs?.fontSize ?? 16,
        fontWeight: bs?.fontWeight ?? 600,
        borderRadius: bs?.borderRadius ?? 8,
        border: bs?.borderWidth ? `${bs.borderWidth}px solid ${bs.borderColor || 'transparent'}` : 'none',
        paddingLeft: bs?.paddingX ?? 24,
        paddingRight: bs?.paddingX ?? 24,
        paddingTop: bs?.paddingY ?? 12,
        paddingBottom: bs?.paddingY ?? 12,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        whiteSpace: 'nowrap',
        cursor: 'default',
        pointerEvents: 'none',
        userSelect: 'none',
        boxSizing: 'border-box',
      };
      return <div style={btnStyle}>{el.content}</div>;
    }

    case 'badge': {
      const bg = el.badgeStyle;
      const badgeStyle: React.CSSProperties = {
        width: 'auto',
        height: 'auto',
        minWidth: '100%',
        minHeight: '100%',
        backgroundColor: bg?.backgroundColor || 'rgba(255,255,255,0.1)',
        color: bg?.textColor || '#ffffff',
        fontFamily: bg?.fontFamily || 'Kanit, sans-serif',
        fontSize: bg?.fontSize ?? 14,
        fontWeight: bg?.fontWeight ?? 500,
        borderRadius: bg?.borderRadius ?? 20,
        border: bg?.borderWidth ? `${bg.borderWidth}px solid ${bg.borderColor || 'transparent'}` : 'none',
        paddingLeft: bg?.paddingX ?? 16,
        paddingRight: bg?.paddingX ?? 16,
        paddingTop: bg?.paddingY ?? 6,
        paddingBottom: bg?.paddingY ?? 6,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        boxSizing: 'border-box',
      };
      return (
        <div style={badgeStyle}>
          {bg?.icon && <span>{bg.icon}</span>}
          <span>{el.content}</span>
        </div>
      );
    }

    case 'strip': {
      const ss = el.stripStyle;
      const stripStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        backgroundColor: ss?.backgroundColor || '#6F53C1',
        color: ss?.textColor || '#ffffff',
        fontFamily: ss?.fontFamily || 'Kanit, sans-serif',
        fontSize: ss?.fontSize ?? 14,
        fontWeight: ss?.fontWeight ?? 500,
        paddingLeft: ss?.paddingX ?? 16,
        paddingRight: ss?.paddingX ?? 16,
        paddingTop: ss?.paddingY ?? 8,
        paddingBottom: ss?.paddingY ?? 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        userSelect: 'none',
        boxSizing: 'border-box',
        overflow: 'hidden',
      };
      return <div style={stripStyle}>{el.content}</div>;
    }

    case 'shape': {
      const sh = el.shapeStyle;
      const shapeStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        backgroundColor: sh?.backgroundColor || 'transparent',
        borderColor: sh?.borderColor || 'transparent',
        borderWidth: sh?.borderWidth ?? 0,
        borderStyle: sh?.borderWidth ? 'solid' : 'none',
        borderRadius: sh?.borderRadius ?? 0,
        boxSizing: 'border-box',
        pointerEvents: 'none',
        userSelect: 'none',
      };
      return <div style={shapeStyle} />;
    }

    default:
      return null;
  }
}

// ─── Helpers to extract / apply TextStyle for any editable element ──────────

function getTextStyleFromElement(el: CanvasElement): TextStyle {
  switch (el.type) {
    case 'text':
      return el.textStyle ?? { fontFamily: 'Poppins', fontSize: 16, fontWeight: 400, fontStyle: 'normal', color: '#ffffff', textAlign: 'left', letterSpacing: 0, lineHeight: 1.2, textTransform: 'none' };
    case 'button': {
      const bs = el.buttonStyle;
      return { fontFamily: bs?.fontFamily ?? 'Poppins', fontSize: bs?.fontSize ?? 16, fontWeight: bs?.fontWeight ?? 600, fontStyle: 'normal', color: bs?.textColor ?? '#ffffff', textAlign: 'center', letterSpacing: 0, lineHeight: 1.2, textTransform: 'none' };
    }
    case 'badge': {
      const bg = el.badgeStyle;
      return { fontFamily: bg?.fontFamily ?? 'Poppins', fontSize: bg?.fontSize ?? 14, fontWeight: bg?.fontWeight ?? 500, fontStyle: 'normal', color: bg?.textColor ?? '#ffffff', textAlign: 'center', letterSpacing: 0, lineHeight: 1.2, textTransform: 'none' };
    }
    case 'strip': {
      const ss = el.stripStyle;
      return { fontFamily: ss?.fontFamily ?? 'Poppins', fontSize: ss?.fontSize ?? 14, fontWeight: ss?.fontWeight ?? 500, fontStyle: 'normal', color: ss?.textColor ?? '#ffffff', textAlign: 'center', letterSpacing: 0, lineHeight: 1.2, textTransform: 'none' };
    }
    default:
      return { fontFamily: 'Poppins', fontSize: 16, fontWeight: 400, fontStyle: 'normal', color: '#ffffff', textAlign: 'left', letterSpacing: 0, lineHeight: 1.2, textTransform: 'none' };
  }
}

function applyTextStyleChanges(el: CanvasElement, changes: Partial<TextStyle>): CanvasElement {
  switch (el.type) {
    case 'text':
      return { ...el, textStyle: { ...el.textStyle!, ...changes } };
    case 'button': {
      const bsUpdates: Record<string, unknown> = {};
      if (changes.fontSize !== undefined) bsUpdates.fontSize = changes.fontSize;
      if (changes.fontWeight !== undefined) bsUpdates.fontWeight = changes.fontWeight;
      if (changes.fontFamily !== undefined) bsUpdates.fontFamily = changes.fontFamily;
      if (changes.color !== undefined) bsUpdates.textColor = changes.color;
      return { ...el, buttonStyle: { ...el.buttonStyle!, ...bsUpdates } };
    }
    case 'badge': {
      const bgUpdates: Record<string, unknown> = {};
      if (changes.fontSize !== undefined) bgUpdates.fontSize = changes.fontSize;
      if (changes.fontWeight !== undefined) bgUpdates.fontWeight = changes.fontWeight;
      if (changes.fontFamily !== undefined) bgUpdates.fontFamily = changes.fontFamily;
      if (changes.color !== undefined) bgUpdates.textColor = changes.color;
      return { ...el, badgeStyle: { ...el.badgeStyle!, ...bgUpdates } };
    }
    case 'strip': {
      const ssUpdates: Record<string, unknown> = {};
      if (changes.fontSize !== undefined) ssUpdates.fontSize = changes.fontSize;
      if (changes.fontWeight !== undefined) ssUpdates.fontWeight = changes.fontWeight;
      if (changes.fontFamily !== undefined) ssUpdates.fontFamily = changes.fontFamily;
      if (changes.color !== undefined) ssUpdates.textColor = changes.color;
      return { ...el, stripStyle: { ...el.stripStyle!, ...ssUpdates } };
    }
    default:
      return el;
  }
}

// ─── Editing styles for contentEditable overlay ──────────────────────────────

const EDITABLE_TYPES = new Set(['text', 'button', 'badge', 'strip']);

function getEditingStyles(el: CanvasElement): React.CSSProperties {
  const base: React.CSSProperties = {
    width: '100%',
    height: '100%',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    outline: 'none',
    border: '1px dashed #3B82F6',
    margin: 0,
    overflow: 'hidden',
    cursor: 'text',
    boxSizing: 'border-box' as const,
    caretColor: '#3B82F6',
  };

  switch (el.type) {
    case 'text': {
      const ts = el.textStyle;
      return {
        ...base,
        fontFamily: ts?.fontFamily || 'sans-serif',
        fontSize: ts?.fontSize ?? 16,
        fontWeight: ts?.fontWeight ?? 400,
        fontStyle: ts?.fontStyle || 'normal',
        color: ts?.color || '#ffffff',
        textAlign: ts?.textAlign || 'left',
        letterSpacing: ts?.letterSpacing ?? 0,
        lineHeight: ts?.lineHeight ?? 1.2,
        textTransform: ts?.textTransform || 'none',
        transform: ts?.scaleX != null ? `scaleX(${ts.scaleX})` : undefined,
        backgroundColor: 'rgba(59, 130, 246, 0.05)',
        padding: 0,
      };
    }
    case 'button': {
      const bs = el.buttonStyle;
      return {
        ...base,
        width: 'auto',
        height: 'auto',
        minWidth: 150,
        fontFamily: bs?.fontFamily || 'Kanit, sans-serif',
        fontSize: bs?.fontSize ?? 16,
        fontWeight: bs?.fontWeight ?? 600,
        color: bs?.textColor || '#181830',
        backgroundColor: bs?.backgroundColor || '#D7EF3F',
        borderRadius: bs?.borderRadius ?? 8,
        paddingLeft: bs?.paddingX ?? 24,
        paddingRight: bs?.paddingX ?? 24,
        paddingTop: bs?.paddingY ?? 12,
        paddingBottom: bs?.paddingY ?? 12,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        whiteSpace: 'nowrap',
      };
    }
    case 'badge': {
      const bg = el.badgeStyle;
      return {
        ...base,
        fontFamily: bg?.fontFamily || 'Kanit, sans-serif',
        fontSize: bg?.fontSize ?? 14,
        fontWeight: bg?.fontWeight ?? 500,
        color: bg?.textColor || '#ffffff',
        backgroundColor: bg?.backgroundColor || 'rgba(255,255,255,0.1)',
        borderRadius: bg?.borderRadius ?? 20,
        paddingLeft: bg?.paddingX ?? 16,
        paddingRight: bg?.paddingX ?? 16,
        paddingTop: bg?.paddingY ?? 6,
        paddingBottom: bg?.paddingY ?? 6,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      };
    }
    case 'strip': {
      const ss = el.stripStyle;
      return {
        ...base,
        fontFamily: ss?.fontFamily || 'Kanit, sans-serif',
        fontSize: ss?.fontSize ?? 14,
        fontWeight: ss?.fontWeight ?? 500,
        color: ss?.textColor || '#ffffff',
        backgroundColor: ss?.backgroundColor || '#6F53C1',
        paddingLeft: ss?.paddingX ?? 16,
        paddingRight: ss?.paddingX ?? 16,
        paddingTop: ss?.paddingY ?? 8,
        paddingBottom: ss?.paddingY ?? 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      };
    }
    default:
      return base;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FreeFormCanvas({
  elements,
  selectedIds,
  canvasWidth,
  canvasHeight,
  zoom = 100,
  onElementsChange,
  onElementsUpdate,
  onSelectionChange,
  onTextEditStart,
  onTextEditEnd,
  onZoomChange,
  canvasExportRef,
  eraserMode,
  eraserBrushSize = 50,
  eraserSoftness = 70,
  eraserOpacity = 100,
  eraserMagicMode,
  eraserMagicTolerance = 30,
  eraserMagicRadius = 100,
  eraserMagicSoftness = 50,
  onFileDrop,
  canvasBackground,
}: FreeFormCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const textEditRef = useRef<HTMLDivElement>(null);

  // ── Interactive state ─────────────────────────────────────────────────────
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [resizeState, setResizeState] = useState<ResizeState | null>(null);
  const [selectionRect, setSelectionRect] = useState<SelectionRect | null>(null);
  const [snapGuides, setSnapGuides] = useState<SnapGuide[]>([]);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; elementId: string } | null>(null);

  // ── Space+Drag panning state ────────────────────────────────────────────
  const [isSpaceHeld, setIsSpaceHeld] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef<{ x: number; y: number; scrollLeft: number; scrollTop: number } | null>(null);

  // Refs for tracking mouse state during drag/resize without re-renders
  const dragStateRef = useRef<DragState | null>(null);
  const resizeStateRef = useRef<ResizeState | null>(null);
  const selectionStartRef = useRef<{ x: number; y: number } | null>(null);

  // ── Eraser state ──
  const [eraserTargetId, setEraserTargetId] = useState<string | null>(null);
  const [eraserCursorPos, setEraserCursorPos] = useState<Position | null>(null);
  const eraserCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const eraserStrokeHistoryRef = useRef<ImageData[]>([]);
  const isEraserPaintingRef = useRef(false);
  const lastEraserPosRef = useRef<Position | null>(null);
  const eraserInitializedRef = useRef<string | null>(null);
  const eraserNaturalSizeRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const scale = zoom / 100;

  // ── Sorted elements by zIndex ─────────────────────────────────────────────
  const sortedElements = useMemo(
    () => [...elements].sort((a, b) => a.zIndex - b.zIndex),
    [elements]
  );

  // ── Convert screen coordinates to canvas coordinates ──────────────────────
  const screenToCanvas = useCallback(
    (clientX: number, clientY: number): Position => {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return { x: 0, y: 0 };
      const rect = canvasEl.getBoundingClientRect();
      return {
        x: (clientX - rect.left) / scale,
        y: (clientY - rect.top) / scale,
      };
    },
    [scale]
  );

  // ── Eraser helpers ──────────────────────────────────────────────────────────

  const eraserPaint = useCallback((canvasEl: HTMLCanvasElement, localX: number, localY: number) => {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    // Scale brush size from element display coords to natural image pixel coords
    const nat = eraserNaturalSizeRef.current;
    const el = eraserTargetId ? elements.find(e => e.id === eraserTargetId) : null;
    const brushScale = (nat.w > 0 && el) ? nat.w / el.width : 1;
    const radius = (eraserBrushSize / 2) * brushScale;
    const softnessFrac = eraserSoftness / 100;
    const opacityFrac = eraserOpacity / 100;

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const innerRadius = radius * Math.max(0, 1 - softnessFrac);
    const gradient = ctx.createRadialGradient(localX, localY, innerRadius, localX, localY, radius);
    gradient.addColorStop(0, `rgba(0,0,0,${opacityFrac})`);
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(localX, localY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }, [eraserBrushSize, eraserSoftness, eraserOpacity, eraserTargetId, elements]);

  const eraserPaintLine = useCallback((canvasEl: HTMLCanvasElement, from: Position, to: Position) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const spacing = Math.max(2, eraserBrushSize / 4);
    if (dist < spacing) {
      eraserPaint(canvasEl, to.x, to.y);
      return;
    }
    const steps = Math.ceil(dist / spacing);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      eraserPaint(canvasEl, from.x + dx * t, from.y + dy * t);
    }
  }, [eraserBrushSize, eraserPaint]);

  const screenToEraserCanvas = useCallback((clientX: number, clientY: number): Position | null => {
    const canvasEl = eraserCanvasRef.current;
    if (!canvasEl) return null;
    const rect = canvasEl.getBoundingClientRect();
    // Map screen coords to the canvas pixel buffer (which uses natural image dimensions)
    const scaleX = canvasEl.width / rect.width;
    const scaleY = canvasEl.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const magicErase = useCallback((canvasEl: HTMLCanvasElement, clickX: number, clickY: number) => {
    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;
    // Scale radius from element display coords to natural image pixel coords
    const nat = eraserNaturalSizeRef.current;
    const el = eraserTargetId ? elements.find(e => e.id === eraserTargetId) : null;
    const brushScale = (nat.w > 0 && el) ? nat.w / el.width : 1;
    const radius = eraserMagicRadius * brushScale;
    const tolerance = eraserMagicTolerance;
    const softness = Math.max(0.01, eraserMagicSoftness / 100);

    const cw = canvasEl.width;
    const ch = canvasEl.height;
    const imageData = ctx.getImageData(0, 0, cw, ch);
    const data = imageData.data;

    const cx = Math.round(clickX);
    const cy = Math.round(clickY);
    if (cx < 0 || cx >= cw || cy < 0 || cy >= ch) return;

    const targetIdx = (cy * cw + cx) * 4;
    const tR = data[targetIdx];
    const tG = data[targetIdx + 1];
    const tB = data[targetIdx + 2];

    const r = Math.ceil(radius);
    const yStart = Math.max(0, cy - r);
    const yEnd = Math.min(ch - 1, cy + r);
    const xStart = Math.max(0, cx - r);
    const xEnd = Math.min(cw - 1, cx + r);

    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
        if (dist > radius) continue;

        const i = (y * cw + x) * 4;
        const colorDiff = Math.sqrt(
          (data[i] - tR) ** 2 +
          (data[i + 1] - tG) ** 2 +
          (data[i + 2] - tB) ** 2
        );

        if (colorDiff <= tolerance * 2.55) {
          const edgeFactor = dist / radius;
          const softFactor = edgeFactor > (1 - softness)
            ? (1 - edgeFactor) / softness : 1;
          data[i + 3] = Math.max(0, Math.round(data[i + 3] - 255 * Math.max(0, softFactor)));
        }
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }, [eraserTargetId, elements, eraserMagicRadius, eraserMagicTolerance, eraserMagicSoftness]);

  const saveEraserResult = useCallback(() => {
    if (!eraserTargetId || !eraserCanvasRef.current) return;
    const canvasEl = eraserCanvasRef.current;
    const dataUrl = canvasEl.toDataURL('image/png');
    const updated = elements.map(el =>
      el.id === eraserTargetId ? { ...el, content: dataUrl } : el
    );
    onElementsChange(updated);
    setEraserTargetId(null);
    eraserStrokeHistoryRef.current = [];
    eraserInitializedRef.current = null;
  }, [eraserTargetId, elements, onElementsChange]);

  // When eraser mode deactivates, save result
  const prevEraserModeRef = useRef(eraserMode);
  useEffect(() => {
    if (prevEraserModeRef.current && !eraserMode && eraserTargetId) {
      saveEraserResult();
    }
    prevEraserModeRef.current = eraserMode;
  }, [eraserMode, eraserTargetId, saveEraserResult]);

  // ── Close context menu on any click ───────────────────────────────────────
  useEffect(() => {
    if (!contextMenu) return;
    const handler = () => setContextMenu(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [contextMenu]);

  // ── Dismiss text editing on Escape ────────────────────────────────────────
  useEffect(() => {
    if (!editingTextId) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Cancel: revert content
        setEditingTextId(null);
        onTextEditEnd?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [editingTextId, onTextEditEnd]);

  // ── Focus the contentEditable when entering edit mode ─────────────────────
  useEffect(() => {
    if (editingTextId && textEditRef.current) {
      textEditRef.current.focus();
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(textEditRef.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [editingTextId]);

  // ── Context menu actions ──────────────────────────────────────────────────
  const handleContextAction = useCallback(
    (action: string, elementId: string) => {
      const idx = elements.findIndex((e) => e.id === elementId);
      if (idx === -1) return;

      let updated = [...elements];
      const zIndices = updated.map((e) => e.zIndex);
      const maxZ = Math.max(...zIndices);
      const minZ = Math.min(...zIndices);

      switch (action) {
        case 'bringToFront':
          updated[idx] = { ...updated[idx], zIndex: maxZ + 1 };
          break;
        case 'sendToBack':
          updated[idx] = { ...updated[idx], zIndex: minZ - 1 };
          break;
        case 'bringForward': {
          const currentZ = updated[idx].zIndex;
          const nextAbove = updated
            .filter((e) => e.zIndex > currentZ)
            .sort((a, b) => a.zIndex - b.zIndex)[0];
          if (nextAbove) {
            const swapZ = nextAbove.zIndex;
            const nextIdx = updated.findIndex((e) => e.id === nextAbove.id);
            updated[nextIdx] = { ...updated[nextIdx], zIndex: currentZ };
            updated[idx] = { ...updated[idx], zIndex: swapZ };
          }
          break;
        }
        case 'sendBackward': {
          const currentZ = updated[idx].zIndex;
          const nextBelow = updated
            .filter((e) => e.zIndex < currentZ)
            .sort((a, b) => b.zIndex - a.zIndex)[0];
          if (nextBelow) {
            const swapZ = nextBelow.zIndex;
            const nextIdx = updated.findIndex((e) => e.id === nextBelow.id);
            updated[nextIdx] = { ...updated[nextIdx], zIndex: currentZ };
            updated[idx] = { ...updated[idx], zIndex: swapZ };
          }
          break;
        }
        case 'duplicate': {
          const el = updated[idx];
          const duped: CanvasElement = {
            ...structuredClone(el),
            id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            x: el.x + 10,
            y: el.y + 10,
            zIndex: maxZ + 1,
          };
          updated = [...updated, duped];
          onSelectionChange([duped.id]);
          break;
        }
        case 'delete':
          updated = updated.filter((e) => e.id !== elementId);
          onSelectionChange(selectedIds.filter((id) => id !== elementId));
          break;
      }

      onElementsChange(updated);
      setContextMenu(null);
    },
    [elements, selectedIds, onElementsChange, onSelectionChange]
  );

  // ── Pan mouse down (Space+Drag) ──────────────────────────────────────────
  const handlePanMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isSpaceHeld) return false;
    e.preventDefault();
    e.stopPropagation();
    const workspace = workspaceRef.current;
    if (!workspace) return false;
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      scrollLeft: workspace.scrollLeft,
      scrollTop: workspace.scrollTop,
    };
    return true;
  }, [isSpaceHeld]);

  // ── Mouse down on element (drag start or select) ─────────────────────────
  const handleElementMouseDown = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      if (e.button === 2) return; // right-click handled separately

      // Eraser mode: start painting on image elements
      if (eraserMode) {
        const el = elements.find((el) => el.id === elementId);
        if (el && el.type === 'image') {
          e.stopPropagation();
          e.preventDefault();

          // If switching to a different image, save previous eraser result
          if (eraserTargetId && eraserTargetId !== elementId) {
            saveEraserResult();
          }

          setEraserTargetId(elementId);
          onSelectionChange([elementId]);

          // Start erasing — the canvas init happens via ref callback
          if (eraserMagicMode) {
            // Magic eraser: single click removes similar-colored pixels
            requestAnimationFrame(() => {
              const canvasEl = eraserCanvasRef.current;
              if (canvasEl) {
                const ctx = canvasEl.getContext('2d');
                if (ctx) {
                  eraserStrokeHistoryRef.current.push(
                    ctx.getImageData(0, 0, canvasEl.width, canvasEl.height)
                  );
                }
                const pos = screenToEraserCanvas(e.clientX, e.clientY);
                if (pos) {
                  magicErase(canvasEl, pos.x, pos.y);
                }
              }
            });
          } else {
            // Brush eraser: paint transparency
            isEraserPaintingRef.current = true;

            // Save state for undo before first stroke
            requestAnimationFrame(() => {
              const canvasEl = eraserCanvasRef.current;
              if (canvasEl) {
                const ctx = canvasEl.getContext('2d');
                if (ctx) {
                  eraserStrokeHistoryRef.current.push(
                    ctx.getImageData(0, 0, canvasEl.width, canvasEl.height)
                  );
                }
                // Paint at click position
                const pos = screenToEraserCanvas(e.clientX, e.clientY);
                if (pos) {
                  eraserPaint(canvasEl, pos.x, pos.y);
                  lastEraserPosRef.current = pos;
                }
              }
            });
          }
          return;
        }
        // Non-image click in eraser mode: just select
      }

      // Space+click on element = pan (don't start drag)
      if (isSpaceHeld) {
        handlePanMouseDown(e);
        return;
      }

      e.stopPropagation();

      // If we are editing text and click outside the editing element, confirm edit
      if (editingTextId && editingTextId !== elementId) {
        confirmTextEdit();
      }

      const el = elements.find((el) => el.id === elementId);
      if (!el) return;

      // Update selection
      let newSelected: string[];
      if (e.shiftKey) {
        if (selectedIds.includes(elementId)) {
          newSelected = selectedIds.filter((id) => id !== elementId);
        } else {
          newSelected = [...selectedIds, elementId];
        }
      } else {
        if (!selectedIds.includes(elementId)) {
          newSelected = [elementId];
        } else {
          newSelected = selectedIds;
        }
      }
      onSelectionChange(newSelected);

      // Start drag
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      const startPositions: Record<string, Position> = {};
      newSelected.forEach((id) => {
        const elem = elements.find((el) => el.id === id);
        if (elem) {
          startPositions[id] = { x: elem.x, y: elem.y };
        }
      });

      const newDragState: DragState = {
        isDragging: true,
        startX: canvasPos.x,
        startY: canvasPos.y,
        elementStartPositions: startPositions,
      };
      setDragState(newDragState);
      dragStateRef.current = newDragState;
    },
    [elements, selectedIds, onSelectionChange, screenToCanvas, editingTextId, isSpaceHeld, handlePanMouseDown, eraserMode, eraserMagicMode, eraserTargetId, saveEraserResult, screenToEraserCanvas, eraserPaint, magicErase]
  );

  // ── Double-click to enter text edit mode ──────────────────────────────────
  const handleElementDoubleClick = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.stopPropagation();
      const el = elements.find((el) => el.id === elementId);
      if (!el || !EDITABLE_TYPES.has(el.type)) return;

      setEditingTextId(elementId);
      onSelectionChange([elementId]);
      onTextEditStart?.();
    },
    [elements, onSelectionChange, onTextEditStart]
  );

  // ── Confirm text edit ─────────────────────────────────────────────────────
  const confirmTextEdit = useCallback(() => {
    if (!editingTextId || !textEditRef.current) {
      setEditingTextId(null);
      onTextEditEnd?.();
      return;
    }
    const newContent = textEditRef.current.innerText;
    const updated = elements.map((el) =>
      el.id === editingTextId ? { ...el, content: newContent } : el
    );
    onElementsChange(updated);
    setEditingTextId(null);
    onTextEditEnd?.();
  }, [editingTextId, elements, onElementsChange, onTextEditEnd]);

  // ── Handle text style changes from toolbar ──────────────────────────────────
  const handleToolbarStyleChange = useCallback(
    (changes: Partial<TextStyle>) => {
      if (!editingTextId) return;
      const updated = elements.map((el) =>
        el.id === editingTextId ? applyTextStyleChanges(el, changes) : el
      );
      onElementsChange(updated);
    },
    [editingTextId, elements, onElementsChange]
  );

  // ── Compute toolbar position for the editing element ─────────────────────
  const toolbarPosition = useMemo(() => {
    if (!editingTextId) return null;
    const el = elements.find((e) => e.id === editingTextId);
    if (!el) return null;
    const canvasEl = canvasRef.current;
    if (!canvasEl) return null;
    const rect = canvasEl.getBoundingClientRect();
    return {
      x: rect.left + (el.x + el.width / 2) * scale,
      y: rect.top + el.y * scale,
    };
  }, [editingTextId, elements, scale]);

  // ── Resize handle mouse down ──────────────────────────────────────────────
  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle) => {
      e.stopPropagation();
      e.preventDefault();

      if (selectedIds.length !== 1) return;
      const el = elements.find((el) => el.id === selectedIds[0]);
      if (!el || el.locked) return;

      // Corner handles: proportional by default, Shift = free.
      // Edge handles: always stretch one dimension.
      const isCorner = ['nw', 'ne', 'se', 'sw'].includes(handle);
      const lockAspect = isCorner ? !e.shiftKey : false;

      const newResizeState: ResizeState = {
        isResizing: true,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        elementStartBounds: { x: el.x, y: el.y, width: el.width, height: el.height },
        lockAspectRatio: lockAspect,
      };
      setResizeState(newResizeState);
      resizeStateRef.current = newResizeState;
    },
    [selectedIds, elements]
  );

  // ── Group bounding box for multi-select ────────────────────────────────────
  const groupBBox = useMemo(() => {
    if (selectedIds.length < 2) return null;
    const selectedEls = elements.filter(el => selectedIds.includes(el.id));
    if (selectedEls.length < 2) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    selectedEls.forEach(el => {
      minX = Math.min(minX, el.x);
      minY = Math.min(minY, el.y);
      maxX = Math.max(maxX, el.x + el.width);
      maxY = Math.max(maxY, el.y + el.height);
    });
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }, [elements, selectedIds]);

  // ── Group resize mouse down ────────────────────────────────────────────────
  const handleGroupResizeMouseDown = useCallback(
    (e: React.MouseEvent, handle: ResizeHandle) => {
      e.stopPropagation();
      e.preventDefault();

      if (selectedIds.length < 2) return;
      const selectedEls = elements.filter(el => selectedIds.includes(el.id));
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      const allData: Record<string, { x: number; y: number; width: number; height: number; fontSize?: number }> = {};

      selectedEls.forEach(el => {
        minX = Math.min(minX, el.x);
        minY = Math.min(minY, el.y);
        maxX = Math.max(maxX, el.x + el.width);
        maxY = Math.max(maxY, el.y + el.height);

        let fontSize: number | undefined;
        if (el.type === 'text') fontSize = el.textStyle?.fontSize;
        else if (el.type === 'button') fontSize = el.buttonStyle?.fontSize;
        else if (el.type === 'badge') fontSize = el.badgeStyle?.fontSize;
        else if (el.type === 'strip') fontSize = el.stripStyle?.fontSize;

        allData[el.id] = { x: el.x, y: el.y, width: el.width, height: el.height, fontSize };
      });

      const gBounds = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      const isCorner = ['nw', 'ne', 'se', 'sw'].includes(handle);
      const lockAspect = isCorner ? !e.shiftKey : false;

      const newResizeState: ResizeState = {
        isResizing: true,
        handle,
        startX: e.clientX,
        startY: e.clientY,
        elementStartBounds: gBounds,
        lockAspectRatio: lockAspect,
        isGroupResize: true,
        groupStartBounds: gBounds,
        allElementStartData: allData,
      };
      setResizeState(newResizeState);
      resizeStateRef.current = newResizeState;
    },
    [selectedIds, elements]
  );

  // ── Right-click context menu ──────────────────────────────────────────────
  const handleElementContextMenu = useCallback(
    (e: React.MouseEvent, elementId: string) => {
      e.preventDefault();
      e.stopPropagation();

      if (!selectedIds.includes(elementId)) {
        onSelectionChange([elementId]);
      }

      // Position relative to the workspace container
      const workspace = workspaceRef.current;
      if (!workspace) return;
      const rect = workspace.getBoundingClientRect();
      setContextMenu({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        elementId,
      });
    },
    [selectedIds, onSelectionChange]
  );

  // ── Canvas mouse down (empty area: deselect or start selection rect) ──────
  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 2) return;

      // Space+click = pan
      if (isSpaceHeld) {
        handlePanMouseDown(e);
        return;
      }

      // Close context menu
      setContextMenu(null);

      // Confirm text edit if active
      if (editingTextId) {
        confirmTextEdit();
        return;
      }

      // Deselect
      onSelectionChange([]);

      // Start selection rectangle
      const canvasPos = screenToCanvas(e.clientX, e.clientY);
      selectionStartRef.current = canvasPos;
      setSelectionRect({ x: canvasPos.x, y: canvasPos.y, width: 0, height: 0 });
    },
    [onSelectionChange, screenToCanvas, editingTextId, confirmTextEdit, isSpaceHeld, handlePanMouseDown]
  );

  // ── Global mouse move (drag / resize / selection rect) ────────────────────
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // ── Eraser cursor tracking ──
      if (eraserMode) {
        const canvasEl = canvasRef.current;
        if (canvasEl) {
          const rect = canvasEl.getBoundingClientRect();
          setEraserCursorPos({
            x: (e.clientX - rect.left) / scale,
            y: (e.clientY - rect.top) / scale,
          });
        }
      }

      // ── Eraser painting ──
      if (isEraserPaintingRef.current && eraserCanvasRef.current) {
        const pos = screenToEraserCanvas(e.clientX, e.clientY);
        if (pos) {
          if (lastEraserPosRef.current) {
            eraserPaintLine(eraserCanvasRef.current, lastEraserPosRef.current, pos);
          } else {
            eraserPaint(eraserCanvasRef.current, pos.x, pos.y);
          }
          lastEraserPosRef.current = pos;
        }
        return;
      }

      // ── Dragging elements ──
      if (dragStateRef.current) {
        const ds = dragStateRef.current;
        const canvasPos = screenToCanvas(e.clientX, e.clientY);
        const dx = canvasPos.x - ds.startX;
        const dy = canvasPos.y - ds.startY;

        // Free movement always — both X and Y update every frame

        // Compute new positions
        const newPositions: Record<string, Position> = {};
        const startPositions = ds.elementStartPositions;
        for (const id of Object.keys(startPositions)) {
          const startPos = startPositions[id];
          newPositions[id] = { x: startPos.x + dx, y: startPos.y + dy };
        }

        // Snap guides always active during drag
        let snapOffsetX = 0;
        let snapOffsetY = 0;
        {
          const movingIds = Object.keys(ds.elementStartPositions);
          const snap = computeSnapGuides(
            movingIds,
            elements,
            canvasWidth,
            canvasHeight,
            newPositions
          );
          setSnapGuides(snap.guides);
          snapOffsetX = snap.snapOffsetX;
          snapOffsetY = snap.snapOffsetY;
        }

        // Apply positions (with snap offset if Shift held)
        const updatedElements = elements.map((el) => {
          if (newPositions[el.id]) {
            return {
              ...el,
              x: Math.round(newPositions[el.id].x + snapOffsetX),
              y: Math.round(newPositions[el.id].y + snapOffsetY),
            };
          }
          return el;
        });

        onElementsUpdate(updatedElements);
        return;
      }

      // ── Resizing element ──
      if (resizeStateRef.current) {
        const rs = resizeStateRef.current;
        const dx = (e.clientX - rs.startX) / scale;
        const dy = (e.clientY - rs.startY) / scale;
        const { x: sx, y: sy, width: sw, height: sh } = rs.elementStartBounds;
        const aspectRatio = sw / sh;
        const handle = rs.handle;

        let newX = sx;
        let newY = sy;
        let newW = sw;
        let newH = sh;

        // Compute raw new bounds based on handle
        switch (handle) {
          case 'se':
            newW = sw + dx;
            newH = sh + dy;
            break;
          case 'e':
            newW = sw + dx;
            break;
          case 's':
            newH = sh + dy;
            break;
          case 'nw':
            newX = sx + dx;
            newY = sy + dy;
            newW = sw - dx;
            newH = sh - dy;
            break;
          case 'n':
            newY = sy + dy;
            newH = sh - dy;
            break;
          case 'ne':
            newW = sw + dx;
            newY = sy + dy;
            newH = sh - dy;
            break;
          case 'w':
            newX = sx + dx;
            newW = sw - dx;
            break;
          case 'sw':
            newX = sx + dx;
            newW = sw - dx;
            newH = sh + dy;
            break;
        }

        // Lock aspect ratio for corners (unless shift is held)
        if (rs.lockAspectRatio && !e.shiftKey) {
          const isCorner = ['nw', 'ne', 'se', 'sw'].includes(handle);
          if (isCorner) {
            // Use the dimension with the larger delta to drive
            const wDelta = Math.abs(newW - sw);
            const hDelta = Math.abs(newH - sh);
            if (wDelta > hDelta) {
              newH = newW / aspectRatio;
            } else {
              newW = newH * aspectRatio;
            }
            // Adjust position for nw/ne/sw handles
            if (handle === 'nw') {
              newX = sx + sw - newW;
              newY = sy + sh - newH;
            } else if (handle === 'ne') {
              newY = sy + sh - newH;
            } else if (handle === 'sw') {
              newX = sx + sw - newW;
            }
          }
        }

        // Enforce minimum size
        if (newW < MIN_SIZE) {
          if (handle.includes('w')) {
            newX = sx + sw - MIN_SIZE;
          }
          newW = MIN_SIZE;
        }
        if (newH < MIN_SIZE) {
          if (handle.includes('n')) {
            newY = sy + sh - MIN_SIZE;
          }
          newH = MIN_SIZE;
        }

        if (rs.isGroupResize && rs.allElementStartData && rs.groupStartBounds) {
          // Group proportional resize
          const gb = rs.groupStartBounds;
          const scaleXFactor = newW / gb.width;
          const scaleYFactor = newH / gb.height;

          const updatedElements = elements.map((el) => {
            const startData = rs.allElementStartData![el.id];
            if (!startData) return el;

            const relX = startData.x - gb.x;
            const relY = startData.y - gb.y;

            const result: CanvasElement = {
              ...el,
              x: Math.round(newX + relX * scaleXFactor),
              y: Math.round(newY + relY * scaleYFactor),
              width: Math.max(MIN_SIZE, Math.round(startData.width * scaleXFactor)),
              height: Math.max(MIN_SIZE, Math.round(startData.height * scaleYFactor)),
            };

            // Scale font sizes proportionally
            if (startData.fontSize) {
              const scaledFontSize = Math.max(6, Math.round(startData.fontSize * Math.min(scaleXFactor, scaleYFactor)));
              if (el.type === 'text' && el.textStyle) {
                result.textStyle = { ...el.textStyle, fontSize: scaledFontSize };
              } else if (el.type === 'button' && el.buttonStyle) {
                result.buttonStyle = { ...el.buttonStyle, fontSize: scaledFontSize };
              } else if (el.type === 'badge' && el.badgeStyle) {
                result.badgeStyle = { ...el.badgeStyle, fontSize: scaledFontSize };
              } else if (el.type === 'strip' && el.stripStyle) {
                result.stripStyle = { ...el.stripStyle, fontSize: scaledFontSize };
              }
            }

            return result;
          });
          onElementsUpdate(updatedElements);
        } else {
          // Single element resize
          const updatedElements = elements.map((el) => {
            if (el.id === selectedIds[0]) {
              return {
                ...el,
                x: Math.round(newX),
                y: Math.round(newY),
                width: Math.round(newW),
                height: Math.round(newH),
              };
            }
            return el;
          });
          onElementsUpdate(updatedElements);
        }
        return;
      }

      // ── Selection rectangle ──
      if (selectionStartRef.current) {
        const start = selectionStartRef.current;
        const canvasPos = screenToCanvas(e.clientX, e.clientY);
        const rx = Math.min(start.x, canvasPos.x);
        const ry = Math.min(start.y, canvasPos.y);
        const rw = Math.abs(canvasPos.x - start.x);
        const rh = Math.abs(canvasPos.y - start.y);
        setSelectionRect({ x: rx, y: ry, width: rw, height: rh });

        // Select elements that intersect
        const intersecting = elements
          .filter((el) => {
            if (!el.visible) return false;
            return !(
              el.x + el.width < rx ||
              el.x > rx + rw ||
              el.y + el.height < ry ||
              el.y > ry + rh
            );
          })
          .map((el) => el.id);
        onSelectionChange(intersecting);
      }
    };

    const handleMouseUp = () => {
      // Finalize eraser stroke
      if (isEraserPaintingRef.current) {
        isEraserPaintingRef.current = false;
        lastEraserPosRef.current = null;
        return;
      }

      // Finalize drag — only commit to history if actual movement occurred
      if (dragStateRef.current) {
        const ds = dragStateRef.current;
        dragStateRef.current = null;
        setDragState(null);
        setSnapGuides([]);
        // Check if any element actually moved
        const anyMoved = Object.keys(ds.elementStartPositions).some(id => {
          const el = elements.find(e => e.id === id);
          const start = ds.elementStartPositions[id];
          return el && (Math.round(el.x) !== Math.round(start.x) || Math.round(el.y) !== Math.round(start.y));
        });
        if (anyMoved) {
          onElementsChange(elements);
        }
      }

      // Finalize resize
      if (resizeStateRef.current) {
        resizeStateRef.current = null;
        setResizeState(null);
        onElementsChange(elements);
      }

      // Finalize selection rect
      if (selectionStartRef.current) {
        selectionStartRef.current = null;
        setSelectionRect(null);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    elements,
    selectedIds,
    canvasWidth,
    canvasHeight,
    scale,
    screenToCanvas,
    onElementsChange,
    onElementsUpdate,
    onSelectionChange,
    eraserMode,
    eraserPaint,
    eraserPaintLine,
    screenToEraserCanvas,
  ]);

  // ── Eraser keyboard: Ctrl+Z undo stroke, Escape to save & exit ──────────
  useEffect(() => {
    if (!eraserMode) return;
    const handler = (e: KeyboardEvent) => {
      // Ctrl+Z: undo last stroke
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        const history = eraserStrokeHistoryRef.current;
        if (history.length > 0 && eraserCanvasRef.current) {
          const ctx = eraserCanvasRef.current.getContext('2d');
          if (ctx) {
            const prev = history.pop()!;
            ctx.putImageData(prev, 0, 0);
          }
        }
      }
      // Escape: save and exit eraser on this element
      if (e.key === 'Escape') {
        e.preventDefault();
        saveEraserResult();
      }
    };
    window.addEventListener('keydown', handler, true); // capture phase to beat other handlers
    return () => window.removeEventListener('keydown', handler, true);
  }, [eraserMode, saveEraserResult]);

  // ── Keyboard: Delete selected elements ────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (editingTextId) return; // don't delete while editing text
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (
          selectedIds.length > 0 &&
          document.activeElement === document.body
        ) {
          const updated = elements.filter((el) => !selectedIds.includes(el.id));
          onElementsChange(updated);
          onSelectionChange([]);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [elements, selectedIds, editingTextId, onElementsChange, onSelectionChange]);

  // ── Space+Drag panning ──────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !editingTextId && e.target === document.body) {
        e.preventDefault();
        setIsSpaceHeld(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpaceHeld(false);
        setIsPanning(false);
        panStartRef.current = null;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [editingTextId]);

  useEffect(() => {
    if (!isPanning) return;
    const handleMouseMove = (e: MouseEvent) => {
      const ps = panStartRef.current;
      const workspace = workspaceRef.current;
      if (!ps || !workspace) return;
      const dx = e.clientX - ps.x;
      const dy = e.clientY - ps.y;
      workspace.scrollLeft = ps.scrollLeft - dx;
      workspace.scrollTop = ps.scrollTop - dy;
    };
    const handleMouseUp = () => {
      setIsPanning(false);
      panStartRef.current = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning]);

  // ── Ctrl+Scroll wheel zoom ────────────────────────────────────────────────
  useEffect(() => {
    const workspace = workspaceRef.current;
    if (!workspace || !onZoomChange) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const step = 5;
        onZoomChange((prev: number) =>
          e.deltaY < 0
            ? Math.min(200, prev + step)
            : Math.max(25, prev - step)
        );
      }
    };

    workspace.addEventListener('wheel', handleWheel, { passive: false });
    return () => workspace.removeEventListener('wheel', handleWheel);
  }, [onZoomChange]);

  // ── Drop handler for elements dragged from sidebar + file drops ─────────
  const handleCanvasDragOver = useCallback((e: React.DragEvent) => {
    if (e.dataTransfer.types.includes('application/sigma-element') || e.dataTransfer.types.includes('Files')) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    }
  }, []);

  const handleCanvasDrop = useCallback((e: React.DragEvent) => {
    // Handle element drops from sidebar
    const data = e.dataTransfer.getData('application/sigma-element');
    if (data) {
      e.preventDefault();
      try {
        const partial = JSON.parse(data) as Partial<CanvasElement>;
        const canvasPos = screenToCanvas(e.clientX, e.clientY);
        const maxZ = elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) : 0;
        const w = partial.width || 200;
        const h = partial.height || 200;

        const newEl: CanvasElement = {
          id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          type: partial.type || 'shape',
          x: Math.round(canvasPos.x - w / 2),
          y: Math.round(canvasPos.y - h / 2),
          width: w,
          height: h,
          rotation: partial.rotation ?? 0,
          opacity: partial.opacity ?? 1,
          zIndex: maxZ + 1,
          locked: false,
          visible: true,
          content: partial.content || '',
          textStyle: partial.textStyle,
          imageStyle: partial.imageStyle,
          buttonStyle: partial.buttonStyle,
          badgeStyle: partial.badgeStyle,
          stripStyle: partial.stripStyle,
          shapeStyle: partial.shapeStyle,
          glowColor: partial.glowColor,
        };

        onElementsChange([...elements, newEl]);
        onSelectionChange([newEl.id]);
      } catch {
        // Ignore malformed data
      }
      return;
    }

    // Handle file drops from desktop
    const files = e.dataTransfer.files;
    if (files.length > 0 && onFileDrop) {
      e.preventDefault();
      const file = files[0];
      if (!file.type.startsWith('image/')) return;
      if (file.size > 10 * 1024 * 1024) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const canvasPos = screenToCanvas(e.clientX, e.clientY);
          const maxDim = 400;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            const ratio = Math.min(maxDim / w, maxDim / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          onFileDrop(dataUrl, w, h, Math.round(canvasPos.x - w / 2), Math.round(canvasPos.y - h / 2));
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  }, [elements, screenToCanvas, onElementsChange, onSelectionChange, onFileDrop]);

  // ── Prevent default context menu on canvas ────────────────────────────────
  const handleCanvasContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      ref={workspaceRef}
      style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#1a1a2e',
        position: 'relative',
        minHeight: 0,
      }}
    >
      {/* Canvas */}
      <div
        ref={(node) => {
          (canvasRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (canvasExportRef) {
            if (typeof canvasExportRef === 'function') canvasExportRef(node);
            else (canvasExportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseLeave={() => { if (eraserMode) setEraserCursorPos(null); }}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        onContextMenu={handleCanvasContextMenu}
        style={{
          width: canvasWidth,
          height: canvasHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
          background: canvasBackground || '#181830',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
          flexShrink: 0,
          overflow: 'visible',
          margin: 'auto',
          cursor: isPanning ? 'grabbing' : isSpaceHeld ? 'grab' : eraserMode ? 'none' : 'default',
        }}
      >
        {/* Render elements sorted by zIndex */}
        {sortedElements.map((el) => {
          if (!el.visible) return null;
          const isSelected = selectedIds.includes(el.id);
          const isEditing = editingTextId === el.id;

          return (
            <div
              key={el.id}
              onMouseDown={(e) => handleElementMouseDown(e, el.id)}
              onDoubleClick={(e) => handleElementDoubleClick(e, el.id)}
              onContextMenu={(e) => handleElementContextMenu(e, el.id)}
              style={{
                position: 'absolute',
                left: el.x,
                top: el.y,
                width: el.width,
                height: el.height,
                opacity: el.opacity,
                transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                zIndex: el.zIndex,
                cursor: eraserMode && el.type === 'image' ? 'none' : 'move',
                outline: isSelected ? '2px solid #3B82F6' : 'none',
                outlineOffset: -1,
                pointerEvents: 'auto',
                overflow: (el.type === 'button' || el.type === 'badge') ? 'visible' : undefined,
              }}
            >
              {/* Element content -- or inline editing -- or eraser canvas */}
              {isEditing ? (
                <div
                  ref={textEditRef}
                  contentEditable
                  suppressContentEditableWarning
                  onMouseDown={(e) => e.stopPropagation()}
                  onBlur={confirmTextEdit}
                  style={getEditingStyles(el)}
                >
                  {el.content}
                </div>
              ) : eraserMode && eraserTargetId === el.id && el.type === 'image' ? (
                (() => {
                  // Eraser canvas replaces the image
                  const imgStyle: React.CSSProperties = {
                    width: '100%',
                    height: '100%',
                    display: 'block',
                    pointerEvents: 'none',
                    userSelect: 'none',
                  };
                  if (el.imageStyle?.maskType === 'radial') {
                    imgStyle.maskImage = `radial-gradient(${el.imageStyle.maskParams || 'ellipse at center, black 60%, transparent 100%'})`;
                    imgStyle.WebkitMaskImage = imgStyle.maskImage;
                  } else if (el.imageStyle?.maskType === 'linear') {
                    imgStyle.maskImage = `linear-gradient(${el.imageStyle.maskParams || 'to bottom, black 60%, transparent 100%'})`;
                    imgStyle.WebkitMaskImage = imgStyle.maskImage;
                  }
                  const containerStyle: React.CSSProperties = {
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    borderRadius: el.imageStyle?.borderRadius ?? 0,
                  };
                  const glowDiv = el.glowColor ? (
                    <div style={{
                      position: 'absolute', top: '10%', left: '10%', width: '80%', height: '80%',
                      background: `radial-gradient(circle, ${el.glowColor} 0%, transparent 70%)`,
                      filter: 'blur(80px)', opacity: 0.35, pointerEvents: 'none', zIndex: 0,
                    }} />
                  ) : null;
                  return (
                    <div style={containerStyle}>
                      {glowDiv}
                      <canvas
                        ref={(node) => {
                          if (node && eraserInitializedRef.current !== el.id) {
                            eraserCanvasRef.current = node;
                            eraserInitializedRef.current = el.id;
                            // Initialize canvas with NATURAL image dimensions to prevent stretching
                            const img = new Image();
                            img.crossOrigin = 'anonymous';
                            img.onload = () => {
                              const natW = img.naturalWidth || img.width;
                              const natH = img.naturalHeight || img.height;
                              // Set canvas pixel buffer to natural image size
                              node.width = natW;
                              node.height = natH;
                              eraserNaturalSizeRef.current = { w: natW, h: natH };
                              const ctx = node.getContext('2d');
                              if (ctx) {
                                ctx.drawImage(img, 0, 0, natW, natH);
                                eraserStrokeHistoryRef.current = [
                                  ctx.getImageData(0, 0, natW, natH),
                                ];
                              }
                            };
                            img.src = el.content;
                          } else if (node) {
                            eraserCanvasRef.current = node;
                          }
                        }}
                        width={1}
                        height={1}
                        style={{ ...imgStyle, position: 'relative', zIndex: 1, objectFit: undefined }}
                      />
                    </div>
                  );
                })()
              ) : (
                renderElementContent(el)
              )}

              {/* Resize handles */}
              {isSelected && !isEditing && !el.locked && selectedIds.length === 1 && (
                <>
                  {RESIZE_HANDLES.map((handle) => (
                    <div
                      key={handle}
                      onMouseDown={(e) => handleResizeMouseDown(e, handle)}
                      style={{
                        position: 'absolute',
                        top: HANDLE_POSITIONS[handle].top,
                        left: HANDLE_POSITIONS[handle].left,
                        transform: HANDLE_POSITIONS[handle].transform,
                        width: HANDLE_SIZE,
                        height: HANDLE_SIZE,
                        backgroundColor: '#ffffff',
                        border: '1.5px solid #3B82F6',
                        borderRadius: 1,
                        cursor: HANDLE_CURSORS[handle],
                        zIndex: 10000,
                        boxSizing: 'border-box',
                      }}
                    />
                  ))}
                </>
              )}
            </div>
          );
        })}

        {/* Selection rectangle */}
        {selectionRect && selectionRect.width > 1 && selectionRect.height > 1 && (
          <div
            style={{
              position: 'absolute',
              left: selectionRect.x,
              top: selectionRect.y,
              width: selectionRect.width,
              height: selectionRect.height,
              border: '1.5px dashed #3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              pointerEvents: 'none',
              zIndex: 99999,
            }}
          />
        )}

        {/* Group selection bounding box with resize handles */}
        {groupBBox && !editingTextId && (
          <div
            style={{
              position: 'absolute',
              left: groupBBox.x,
              top: groupBBox.y,
              width: groupBBox.width,
              height: groupBBox.height,
              border: '1.5px dashed #3B82F6',
              pointerEvents: 'none',
              zIndex: 99997,
            }}
          >
            {RESIZE_HANDLES.map((handle) => (
              <div
                key={`group-${handle}`}
                onMouseDown={(e) => handleGroupResizeMouseDown(e, handle)}
                style={{
                  position: 'absolute',
                  top: HANDLE_POSITIONS[handle].top,
                  left: HANDLE_POSITIONS[handle].left,
                  transform: HANDLE_POSITIONS[handle].transform,
                  width: HANDLE_SIZE,
                  height: HANDLE_SIZE,
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #3B82F6',
                  borderRadius: 1,
                  cursor: HANDLE_CURSORS[handle],
                  zIndex: 10000,
                  boxSizing: 'border-box',
                  pointerEvents: 'auto',
                }}
              />
            ))}
          </div>
        )}

        {/* Snap guides */}
        {snapGuides.map((guide, i) =>
          guide.type === 'vertical' ? (
            <div
              key={`snap-v-${i}`}
              style={{
                position: 'absolute',
                left: guide.position,
                top: 0,
                width: 1,
                height: canvasHeight,
                backgroundColor: '#FF00FF',
                pointerEvents: 'none',
                zIndex: 99999,
                opacity: 0.9,
              }}
            />
          ) : (
            <div
              key={`snap-h-${i}`}
              style={{
                position: 'absolute',
                left: 0,
                top: guide.position,
                width: canvasWidth,
                height: 1,
                backgroundColor: '#FF00FF',
                pointerEvents: 'none',
                zIndex: 99999,
                opacity: 0.9,
              }}
            />
          )
        )}

        {/* Eraser cursor circle */}
        {eraserMode && eraserCursorPos && (
          <div
            style={{
              position: 'absolute',
              left: eraserCursorPos.x - eraserBrushSize / 2,
              top: eraserCursorPos.y - eraserBrushSize / 2,
              width: eraserBrushSize,
              height: eraserBrushSize,
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.7)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.3)',
              pointerEvents: 'none',
              zIndex: 100001,
              background: `radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent ${Math.round((1 - eraserSoftness / 100) * 100)}%, transparent 100%)`,
            }}
          />
        )}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          style={{
            position: 'absolute',
            left: contextMenu.x,
            top: contextMenu.y,
            backgroundColor: '#1C2333',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8,
            padding: '4px 0',
            minWidth: 200,
            zIndex: 100000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            fontFamily: 'Poppins, sans-serif',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {CONTEXT_MENU_ITEMS.map((item, i) => {
            if (item.separator) {
              return (
                <div
                  key={`sep-${i}`}
                  style={{
                    height: 1,
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    margin: '4px 8px',
                  }}
                />
              );
            }
            const isDelete = item.action === 'delete';
            return (
              <button
                key={item.action}
                onClick={() => handleContextAction(item.action, contextMenu.elementId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '8px 16px',
                  background: 'none',
                  border: 'none',
                  color: isDelete ? '#ef4444' : 'rgba(255,255,255,0.85)',
                  fontSize: 13,
                  fontFamily: 'inherit',
                  textAlign: 'left',
                  cursor: 'pointer',
                  borderRadius: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <span>{item.label}</span>
                {item.shortcut && (
                  <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginLeft: 16 }}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Floating text toolbar when editing any text-containing element */}
      {editingTextId && toolbarPosition && (() => {
        const editEl = elements.find((e) => e.id === editingTextId);
        if (!editEl) return null;
        return (
          <TextToolbar
            style={getTextStyleFromElement(editEl)}
            position={toolbarPosition}
            onChange={handleToolbarStyleChange}
          />
        );
      })()}
    </div>
  );
}
