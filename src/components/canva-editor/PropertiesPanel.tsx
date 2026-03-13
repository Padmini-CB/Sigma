'use client';

import { CanvasElement } from './types';
import { useState, useRef, useEffect, useCallback } from 'react';

interface ElementScreenRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface PropertiesPanelProps {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
  /** Bounding rect of the selected element in screen (viewport) coordinates */
  elementScreenRect?: ElementScreenRect | null;
  /** Called when user clicks "Remove Background" on an image element */
  onRemoveBackground?: () => void;
  /** Whether background removal is currently in progress */
  isRemovingBg?: boolean;
  /** Called when user clicks "Magic Eraser" on an image element */
  onMagicErase?: () => void;
}

const PANEL_WIDTH = 220;
const PANEL_GAP = 12;
const MOBILE_BREAKPOINT = 640;

export default function PropertiesPanel({ element, onUpdate, elementScreenRect, onRemoveBackground, isRemovingBg, onMagicErase }: PropertiesPanelProps) {
  const [lockAspect, setLockAspect] = useState(true);
  const aspectRatio = element.width / element.height;
  const panelRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number } | null>(null);
  const [panelPos, setPanelPos] = useState<{ x: number; y: number } | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isDraggingRef = useRef(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Reset manual position when element changes (new selection)
  useEffect(() => {
    setPanelPos(null);
  }, [element.id]);

  // Compute auto-position from element's screen rect
  const computeAutoPosition = useCallback((): { x: number; y: number } => {
    if (!elementScreenRect) {
      // Fallback: top-right
      return { x: window.innerWidth - PANEL_WIDTH - 20, y: 80 };
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const panelHeight = panelRef.current?.offsetHeight ?? 300;

    // Prefer placing to the right of the element
    let x = elementScreenRect.left + elementScreenRect.width + PANEL_GAP;
    let y = elementScreenRect.top;

    // If panel would go off the right edge, place to the left
    if (x + PANEL_WIDTH > vw - 8) {
      x = elementScreenRect.left - PANEL_WIDTH - PANEL_GAP;
    }

    // If still off-screen left, place above/below
    if (x < 8) {
      x = Math.max(8, elementScreenRect.left);
      // Place above the element
      y = elementScreenRect.top - panelHeight - PANEL_GAP;
      if (y < 56) {
        // Not enough space above, place below
        y = elementScreenRect.top + elementScreenRect.height + PANEL_GAP;
      }
    }

    // Clamp within viewport
    x = Math.max(8, Math.min(vw - PANEL_WIDTH - 8, x));
    y = Math.max(56, Math.min(vh - 100, y));

    return { x, y };
  }, [elementScreenRect]);

  // Drag handlers
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    const currentPos = panelPos ?? computeAutoPosition();
    const offset = { x: e.clientX - currentPos.x, y: e.clientY - currentPos.y };
    setDragOffset(offset);

    const handleMove = (ev: MouseEvent) => {
      const newX = Math.max(0, Math.min(window.innerWidth - PANEL_WIDTH, ev.clientX - offset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 60, ev.clientY - offset.y));
      setPanelPos({ x: newX, y: newY });
    };
    const handleUp = () => {
      isDraggingRef.current = false;
      setDragOffset(null);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  }, [panelPos, computeAutoPosition]);

  const handleWidthChange = (w: number) => {
    if (lockAspect) {
      onUpdate({ width: w, height: Math.round(w / aspectRatio) });
    } else {
      onUpdate({ width: w });
    }
  };

  const handleHeightChange = (h: number) => {
    if (lockAspect) {
      onUpdate({ height: h, width: Math.round(h * aspectRatio) });
    } else {
      onUpdate({ height: h });
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '4px 8px',
    borderRadius: 4,
    border: '1px solid rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontFamily: 'Manrope, sans-serif',
    fontSize: 12,
    outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: 11,
    color: 'rgba(255,255,255,0.45)',
    marginBottom: 2,
    display: 'block',
  };

  const sectionTitle: React.CSSProperties = {
    fontFamily: 'Manrope, sans-serif',
    fontSize: 11,
    fontWeight: 600,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: 8,
    marginTop: 12,
  };

  const pos = panelPos ?? computeAutoPosition();

  // Mobile: bottom sheet
  if (isMobile) {
    return (
      <div
        ref={panelRef}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          width: '100%',
          backgroundColor: '#1a1d27',
          borderRadius: '12px 12px 0 0',
          border: '1px solid rgba(59,130,246,0.3)',
          borderBottom: 'none',
          padding: 16,
          zIndex: 9999,
          boxShadow: '0 -8px 32px rgba(0,0,0,0.4)',
          maxHeight: '50vh',
          overflowY: 'auto',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {renderHeader()}
        {renderContent()}
      </div>
    );
  }

  // Desktop: floating panel near element
  return (
    <div
      ref={panelRef}
      style={{
        position: 'fixed',
        top: pos.y,
        left: pos.x,
        width: PANEL_WIDTH,
        backgroundColor: '#1a1d27',
        borderRadius: 12,
        border: '1px solid rgba(59,130,246,0.3)',
        padding: 16,
        paddingTop: 0,
        zIndex: 9999,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
        transition: dragOffset ? 'none' : 'top 0.15s ease-out, left 0.15s ease-out',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Draggable header */}
      <div
        onMouseDown={handleDragStart}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0 6px',
          cursor: 'grab',
          userSelect: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 4,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {/* Grip icon */}
          <svg width="10" height="10" viewBox="0 0 10 10" style={{ opacity: 0.3 }}>
            <circle cx="2" cy="2" r="1" fill="#fff" />
            <circle cx="2" cy="5" r="1" fill="#fff" />
            <circle cx="2" cy="8" r="1" fill="#fff" />
            <circle cx="6" cy="2" r="1" fill="#fff" />
            <circle cx="6" cy="5" r="1" fill="#fff" />
            <circle cx="6" cy="8" r="1" fill="#fff" />
          </svg>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff' }}>
            {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Properties
          </span>
        </div>
      </div>

      {renderContent()}
    </div>
  );

  function renderHeader() {
    return (
      <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
        {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Properties
      </div>
    );
  }

  function renderContent() {
    return (
      <>
        {/* Text Content — for all text-containing elements */}
        {(element.type === 'text' || element.type === 'button' || element.type === 'badge' || element.type === 'strip') && (
          <>
            <div style={sectionTitle}>
              {element.type === 'button' ? 'Button Label' : element.type === 'badge' ? 'Badge Text' : element.type === 'strip' ? 'Strip Text' : 'Text Content'}
            </div>
            <textarea
              value={element.content}
              onChange={(e) => onUpdate({ content: e.target.value })}
              rows={element.type === 'text' ? 3 : 2}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: element.type === 'text' ? 56 : 36,
                lineHeight: '1.4',
              }}
            />
          </>
        )}

        {/* Position */}
        <div style={sectionTitle}>Position</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div>
            <span style={labelStyle}>X</span>
            <input
              type="number"
              value={Math.round(element.x)}
              onChange={(e) => onUpdate({ x: Number(e.target.value) })}
              style={inputStyle}
            />
          </div>
          <div>
            <span style={labelStyle}>Y</span>
            <input
              type="number"
              value={Math.round(element.y)}
              onChange={(e) => onUpdate({ y: Number(e.target.value) })}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Size */}
        <div style={sectionTitle}>
          Size
          <button
            onClick={() => setLockAspect(!lockAspect)}
            style={{
              marginLeft: 8,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: lockAspect ? '#3B82F6' : 'rgba(255,255,255,0.3)',
              fontSize: 12,
            }}
            title={lockAspect ? 'Unlock aspect ratio' : 'Lock aspect ratio'}
          >
            {lockAspect ? '\ud83d\udd12' : '\ud83d\udd13'}
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <div>
            <span style={labelStyle}>W</span>
            <input
              type="number"
              value={Math.round(element.width)}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
          <div>
            <span style={labelStyle}>H</span>
            <input
              type="number"
              value={Math.round(element.height)}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Rotation */}
        <div style={sectionTitle}>Rotation</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="range"
            min={-180}
            max={180}
            value={element.rotation}
            onChange={(e) => onUpdate({ rotation: Number(e.target.value) })}
            style={{ flex: 1, accentColor: '#3B82F6' }}
          />
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', width: 36, textAlign: 'right' }}>
            {element.rotation}&deg;
          </span>
        </div>

        {/* Opacity */}
        <div style={sectionTitle}>Opacity</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(element.opacity * 100)}
            onChange={(e) => onUpdate({ opacity: Number(e.target.value) / 100 })}
            style={{ flex: 1, accentColor: '#3B82F6' }}
          />
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.5)', width: 36, textAlign: 'right' }}>
            {Math.round(element.opacity * 100)}%
          </span>
        </div>

        {/* Lock toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <button
            onClick={() => onUpdate({ locked: !element.locked })}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '5px 10px', borderRadius: 6, border: 'none',
              backgroundColor: element.locked ? 'rgba(212,160,23,0.15)' : 'rgba(255,255,255,0.06)',
              color: element.locked ? '#D4A017' : 'rgba(255,255,255,0.6)',
              fontSize: 11, fontWeight: 600, fontFamily: 'Manrope, sans-serif',
              cursor: 'pointer', flex: 1,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {element.locked ? (
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
            {element.locked ? 'Locked' : 'Unlocked'}
          </button>
        </div>

        {/* Text-specific properties */}
        {element.type === 'text' && element.textStyle && (
          <>
            <div style={sectionTitle}>Text</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <span style={labelStyle}>Font Family</span>
                <select
                  value={element.textStyle.fontFamily}
                  onChange={(e) => onUpdate({ textStyle: { ...element.textStyle!, fontFamily: e.target.value } })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="Poppins">Poppins</option>
                  <option value="Saira Condensed">Saira Condensed</option>
                  <option value="Kanit">Kanit</option>
                  <option value="Manrope">Manrope</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <span style={labelStyle}>Size</span>
                  <input
                    type="number"
                    value={element.textStyle.fontSize}
                    onChange={(e) => onUpdate({ textStyle: { ...element.textStyle!, fontSize: Number(e.target.value) } })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Weight</span>
                  <select
                    value={element.textStyle.fontWeight}
                    onChange={(e) => onUpdate({ textStyle: { ...element.textStyle!, fontWeight: Number(e.target.value) } })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value={300}>Light</option>
                    <option value={400}>Regular</option>
                    <option value={500}>Medium</option>
                    <option value={600}>SemiBold</option>
                    <option value={700}>Bold</option>
                    <option value={800}>ExtraBold</option>
                    <option value={900}>Black</option>
                  </select>
                </div>
              </div>
              <div>
                <span style={labelStyle}>Color</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={element.textStyle.color.startsWith('rgba') ? '#ffffff' : element.textStyle.color}
                    onChange={(e) => onUpdate({ textStyle: { ...element.textStyle!, color: e.target.value } })}
                    style={{ width: 28, height: 28, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 0, backgroundColor: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={element.textStyle.color}
                    onChange={(e) => onUpdate({ textStyle: { ...element.textStyle!, color: e.target.value } })}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>
              <div>
                <span style={labelStyle}>Align</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  {(['left', 'center', 'right'] as const).map(align => (
                    <button
                      key={align}
                      onClick={() => onUpdate({ textStyle: { ...element.textStyle!, textAlign: align } })}
                      style={{
                        flex: 1,
                        padding: '4px 0',
                        borderRadius: 4,
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: element.textStyle!.textAlign === align ? '#3B82F6' : 'rgba(255,255,255,0.06)',
                        color: element.textStyle!.textAlign === align ? '#fff' : 'rgba(255,255,255,0.5)',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: 11,
                        textTransform: 'capitalize' as const,
                      }}
                    >
                      {align}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <span style={labelStyle}>Letter Sp.</span>
                  <input
                    type="number"
                    step={0.5}
                    value={element.textStyle.letterSpacing}
                    onChange={(e) => onUpdate({ textStyle: { ...element.textStyle!, letterSpacing: Number(e.target.value) } })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Line Ht.</span>
                  <input
                    type="number"
                    step={0.05}
                    value={element.textStyle.lineHeight}
                    onChange={(e) => onUpdate({ textStyle: { ...element.textStyle!, lineHeight: Number(e.target.value) } })}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Button-specific properties */}
        {element.type === 'button' && element.buttonStyle && (
          <>
            <div style={sectionTitle}>Button</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <span style={labelStyle}>Font Family</span>
                <select
                  value={element.buttonStyle.fontFamily}
                  onChange={(e) => onUpdate({ buttonStyle: { ...element.buttonStyle!, fontFamily: e.target.value } })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="Poppins">Poppins</option>
                  <option value="Saira Condensed">Saira Condensed</option>
                  <option value="Kanit">Kanit</option>
                  <option value="Manrope">Manrope</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <span style={labelStyle}>Font Size</span>
                  <input
                    type="number"
                    min={8}
                    max={300}
                    value={element.buttonStyle.fontSize}
                    onChange={(e) => onUpdate({ buttonStyle: { ...element.buttonStyle!, fontSize: Number(e.target.value) } })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Weight</span>
                  <select
                    value={element.buttonStyle.fontWeight}
                    onChange={(e) => onUpdate({ buttonStyle: { ...element.buttonStyle!, fontWeight: Number(e.target.value) } })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value={400}>Regular</option>
                    <option value={500}>Medium</option>
                    <option value={600}>SemiBold</option>
                    <option value={700}>Bold</option>
                    <option value={800}>ExtraBold</option>
                    <option value={900}>Black</option>
                  </select>
                </div>
              </div>
              <div>
                <span style={labelStyle}>Text Color</span>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <input
                    type="color"
                    value={element.buttonStyle.textColor.startsWith('rgba') ? '#ffffff' : element.buttonStyle.textColor}
                    onChange={(e) => onUpdate({ buttonStyle: { ...element.buttonStyle!, textColor: e.target.value } })}
                    style={{ width: 28, height: 28, border: 'none', borderRadius: 4, cursor: 'pointer', padding: 0, backgroundColor: 'transparent' }}
                  />
                  <input
                    type="text"
                    value={element.buttonStyle.textColor}
                    onChange={(e) => onUpdate({ buttonStyle: { ...element.buttonStyle!, textColor: e.target.value } })}
                    style={{ ...inputStyle, flex: 1 }}
                  />
                </div>
              </div>
              <div>
                <span style={labelStyle}>Background</span>
                <input
                  type="text"
                  value={element.buttonStyle.backgroundColor}
                  onChange={(e) => onUpdate({ buttonStyle: { ...element.buttonStyle!, backgroundColor: e.target.value } })}
                  style={inputStyle}
                />
              </div>
              <div>
                <span style={labelStyle}>Border Radius</span>
                <input
                  type="number"
                  min={0}
                  value={element.buttonStyle.borderRadius}
                  onChange={(e) => onUpdate({ buttonStyle: { ...element.buttonStyle!, borderRadius: Number(e.target.value) } })}
                  style={inputStyle}
                />
              </div>
            </div>
          </>
        )}

        {/* Badge-specific properties */}
        {element.type === 'badge' && element.badgeStyle && (
          <>
            <div style={sectionTitle}>Badge</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <span style={labelStyle}>Font Size</span>
                  <input
                    type="number"
                    min={8}
                    max={300}
                    value={element.badgeStyle.fontSize}
                    onChange={(e) => onUpdate({ badgeStyle: { ...element.badgeStyle!, fontSize: Number(e.target.value) } })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Weight</span>
                  <select
                    value={element.badgeStyle.fontWeight}
                    onChange={(e) => onUpdate({ badgeStyle: { ...element.badgeStyle!, fontWeight: Number(e.target.value) } })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value={400}>Regular</option>
                    <option value={500}>Medium</option>
                    <option value={600}>SemiBold</option>
                    <option value={700}>Bold</option>
                    <option value={800}>ExtraBold</option>
                  </select>
                </div>
              </div>
              <div>
                <span style={labelStyle}>Text Color</span>
                <input
                  type="text"
                  value={element.badgeStyle.textColor}
                  onChange={(e) => onUpdate({ badgeStyle: { ...element.badgeStyle!, textColor: e.target.value } })}
                  style={inputStyle}
                />
              </div>
              <div>
                <span style={labelStyle}>Background</span>
                <input
                  type="text"
                  value={element.badgeStyle.backgroundColor}
                  onChange={(e) => onUpdate({ badgeStyle: { ...element.badgeStyle!, backgroundColor: e.target.value } })}
                  style={inputStyle}
                />
              </div>
            </div>
          </>
        )}

        {/* Strip-specific properties */}
        {element.type === 'strip' && element.stripStyle && (
          <>
            <div style={sectionTitle}>Strip</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <div>
                  <span style={labelStyle}>Font Size</span>
                  <input
                    type="number"
                    min={8}
                    max={300}
                    value={element.stripStyle.fontSize}
                    onChange={(e) => onUpdate({ stripStyle: { ...element.stripStyle!, fontSize: Number(e.target.value) } })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <span style={labelStyle}>Weight</span>
                  <select
                    value={element.stripStyle.fontWeight}
                    onChange={(e) => onUpdate({ stripStyle: { ...element.stripStyle!, fontWeight: Number(e.target.value) } })}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    <option value={400}>Regular</option>
                    <option value={500}>Medium</option>
                    <option value={600}>SemiBold</option>
                    <option value={700}>Bold</option>
                    <option value={800}>ExtraBold</option>
                  </select>
                </div>
              </div>
              <div>
                <span style={labelStyle}>Text Color</span>
                <input
                  type="text"
                  value={element.stripStyle.textColor}
                  onChange={(e) => onUpdate({ stripStyle: { ...element.stripStyle!, textColor: e.target.value } })}
                  style={inputStyle}
                />
              </div>
              <div>
                <span style={labelStyle}>Background</span>
                <input
                  type="text"
                  value={element.stripStyle.backgroundColor}
                  onChange={(e) => onUpdate({ stripStyle: { ...element.stripStyle!, backgroundColor: e.target.value } })}
                  style={inputStyle}
                />
              </div>
            </div>
          </>
        )}

        {/* Image-specific properties */}
        {element.type === 'image' && element.imageStyle && (
          <>
            <div style={sectionTitle}>Image</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <span style={labelStyle}>Mask</span>
                <select
                  value={element.imageStyle.maskType ?? 'none'}
                  onChange={(e) => onUpdate({ imageStyle: { ...element.imageStyle!, maskType: e.target.value as 'none' | 'radial' | 'linear' } })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="none">None</option>
                  <option value="radial">Radial Fade</option>
                  <option value="linear">Linear Fade</option>
                </select>
              </div>
              <div>
                <span style={labelStyle}>Fit</span>
                <select
                  value={element.imageStyle.objectFit}
                  onChange={(e) => onUpdate({ imageStyle: { ...element.imageStyle!, objectFit: e.target.value as 'cover' | 'contain' | 'fill' } })}
                  style={{ ...inputStyle, cursor: 'pointer' }}
                >
                  <option value="contain">Contain</option>
                  <option value="cover">Cover</option>
                  <option value="fill">Fill</option>
                </select>
              </div>
              <div>
                <span style={labelStyle}>Border Radius</span>
                <input
                  type="number"
                  min={0}
                  value={element.imageStyle.borderRadius}
                  onChange={(e) => onUpdate({ imageStyle: { ...element.imageStyle!, borderRadius: Number(e.target.value) } })}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Image Tools */}
            <div style={sectionTitle}>Image Tools</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {/* Remove Background */}
              <button
                onClick={onRemoveBackground}
                disabled={isRemovingBg}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid rgba(59,130,246,0.3)',
                  backgroundColor: isRemovingBg ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.1)',
                  color: isRemovingBg ? 'rgba(255,255,255,0.5)' : '#fff',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: isRemovingBg ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                }}
              >
                {isRemovingBg ? (
                  <>
                    <svg width="14" height="14" viewBox="0 0 14 14" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="7" cy="7" r="5.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                      <path d="M7 1.5 A5.5 5.5 0 0 1 12.5 7" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                    Removing...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.5 11H3.5" />
                      <path d="M12 2.5v17" />
                      <path d="M5.5 5.5l13 13" />
                      <path d="M18.5 5.5l-13 13" />
                      <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
                    </svg>
                    Remove Background
                  </>
                )}
              </button>

              {/* Magic Eraser */}
              <button
                onClick={onMagicErase}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: '1px solid rgba(111,83,193,0.3)',
                  backgroundColor: 'rgba(111,83,193,0.1)',
                  color: '#fff',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 20H7L3 16c-.6-.6-.6-1.5 0-2.1L13.1 3.8c.6-.6 1.5-.6 2.1 0L20 8.5c.6.6.6 1.5 0 2.1L12 18.5" />
                  <path d="M6 12l4 4" />
                </svg>
                Magic Eraser
              </button>
            </div>
          </>
        )}

        {/* Shape-specific */}
        {element.type === 'shape' && element.shapeStyle && (
          <>
            <div style={sectionTitle}>Shape</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div>
                <span style={labelStyle}>Background</span>
                <input
                  type="text"
                  value={element.shapeStyle.backgroundColor}
                  onChange={(e) => onUpdate({ shapeStyle: { ...element.shapeStyle!, backgroundColor: e.target.value } })}
                  style={inputStyle}
                />
              </div>
              <div>
                <span style={labelStyle}>Border Color</span>
                <input
                  type="text"
                  value={element.shapeStyle.borderColor}
                  onChange={(e) => onUpdate({ shapeStyle: { ...element.shapeStyle!, borderColor: e.target.value } })}
                  style={inputStyle}
                />
              </div>
              <div>
                <span style={labelStyle}>Border Radius</span>
                <input
                  type="number"
                  min={0}
                  value={element.shapeStyle.borderRadius}
                  onChange={(e) => onUpdate({ shapeStyle: { ...element.shapeStyle!, borderRadius: Number(e.target.value) } })}
                  style={inputStyle}
                />
              </div>
            </div>
          </>
        )}
      </>
    );
  }
}
