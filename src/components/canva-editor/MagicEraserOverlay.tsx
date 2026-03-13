'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CanvasElement } from './types';

interface MagicEraserOverlayProps {
  element: CanvasElement;
  canvasZoom: number;
  canvasRect: { top: number; left: number };
  onApply: (dataUrl: string) => void;
  onCancel: () => void;
}

export default function MagicEraserOverlay({
  element,
  canvasZoom,
  canvasRect,
  onApply,
  onCancel,
}: MagicEraserOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(30);
  const [imageLoaded, setImageLoaded] = useState(false);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const scale = canvasZoom / 100;
  const displayW = element.width * scale;
  const displayH = element.height * scale;
  const displayX = canvasRect.left + element.x * scale;
  const displayY = canvasRect.top + element.y * scale;

  // Load the image onto the visible canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (!canvas || !maskCanvas) return;

    const ctx = canvas.getContext('2d');
    const maskCtx = maskCanvas.getContext('2d');
    if (!ctx || !maskCtx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Use natural image dimensions to avoid stretching
      const natW = img.naturalWidth;
      const natH = img.naturalHeight;

      canvas.width = natW;
      canvas.height = natH;
      maskCanvas.width = natW;
      maskCanvas.height = natH;

      // Clear mask (all white = fully opaque)
      maskCtx.fillStyle = '#ffffff';
      maskCtx.fillRect(0, 0, natW, natH);

      originalImageRef.current = img;
      ctx.drawImage(img, 0, 0, natW, natH);
      setImageLoaded(true);
    };
    img.src = element.content;
  }, [element.content]);

  const getCanvasCoords = useCallback(
    (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    [],
  );

  const eraseAt = useCallback(
    (x: number, y: number) => {
      const maskCanvas = maskCanvasRef.current;
      const canvas = canvasRef.current;
      if (!maskCanvas || !canvas || !originalImageRef.current) return;

      const maskCtx = maskCanvas.getContext('2d');
      const ctx = canvas.getContext('2d');
      if (!maskCtx || !ctx) return;

      // Paint black on mask (= transparent)
      maskCtx.globalCompositeOperation = 'source-over';
      maskCtx.fillStyle = '#000000';
      maskCtx.beginPath();
      maskCtx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      maskCtx.fill();

      // Re-render: draw original image then apply mask
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(originalImageRef.current, 0, 0, canvas.width, canvas.height);

      // Apply mask: use destination-in with the mask
      ctx.globalCompositeOperation = 'destination-in';
      ctx.drawImage(maskCanvas, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    },
    [brushSize],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDrawing(true);
      const coords = getCanvasCoords(e);
      eraseAt(coords.x, coords.y);
    },
    [getCanvasCoords, eraseAt],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing) return;
      e.preventDefault();
      e.stopPropagation();
      const coords = getCanvasCoords(e);
      eraseAt(coords.x, coords.y);
    },
    [isDrawing, getCanvasCoords, eraseAt],
  );

  const handleMouseUp = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const handleApply = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onApply(dataUrl);
  }, [onApply]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
      if (e.key === 'Enter') handleApply();
      // Brush size shortcuts
      if (e.key === '[') setBrushSize((s) => Math.max(5, s - 5));
      if (e.key === ']') setBrushSize((s) => Math.min(200, s + 5));
    },
    [onCancel, handleApply],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Semi-transparent backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 10000,
        }}
        onClick={onCancel}
      />

      {/* Canvas overlay positioned exactly over the image element */}
      <div
        style={{
          position: 'fixed',
          left: displayX,
          top: displayY,
          width: displayW,
          height: displayH,
          zIndex: 10001,
          borderRadius: element.imageStyle?.borderRadius ?? 0,
          overflow: 'hidden',
          boxShadow: '0 0 0 2px #3B82F6, 0 8px 32px rgba(0,0,0,0.6)',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            cursor: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='${Math.max(8, brushSize * scale)}' height='${Math.max(8, brushSize * scale)}'><circle cx='50%25' cy='50%25' r='45%25' fill='none' stroke='white' stroke-width='2'/></svg>") ${Math.max(4, (brushSize * scale) / 2)} ${Math.max(4, (brushSize * scale) / 2)}, crosshair`,
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
        {/* Hidden mask canvas */}
        <canvas ref={maskCanvasRef} style={{ display: 'none' }} />
      </div>

      {/* Control bar */}
      <div
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 32,
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          padding: '12px 24px',
          backgroundColor: '#1a1d27',
          borderRadius: 12,
          border: '1px solid rgba(59,130,246,0.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          zIndex: 10002,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          Brush: {brushSize}px
        </span>
        <input
          type="range"
          min={5}
          max={200}
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          style={{ width: 120, accentColor: '#3B82F6' }}
        />
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 11,
            color: 'rgba(255,255,255,0.35)',
          }}
        >
          [ / ] resize &middot; Esc cancel &middot; Enter apply
        </span>

        <button
          onClick={onCancel}
          style={{
            padding: '6px 16px',
            borderRadius: 6,
            border: '1px solid rgba(255,255,255,0.15)',
            backgroundColor: 'transparent',
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleApply}
          disabled={!imageLoaded}
          style={{
            padding: '6px 16px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#3B82F6',
            color: '#fff',
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            cursor: imageLoaded ? 'pointer' : 'not-allowed',
            opacity: imageLoaded ? 1 : 0.5,
          }}
        >
          Done
        </button>
      </div>
    </>
  );
}
