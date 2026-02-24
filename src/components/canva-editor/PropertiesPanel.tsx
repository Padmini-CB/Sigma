'use client';

import { CanvasElement } from './types';
import { useState } from 'react';

interface PropertiesPanelProps {
  element: CanvasElement;
  onUpdate: (updates: Partial<CanvasElement>) => void;
}

export default function PropertiesPanel({ element, onUpdate }: PropertiesPanelProps) {
  const [lockAspect, setLockAspect] = useState(true);
  const aspectRatio = element.width / element.height;

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

  return (
    <div
      style={{
        position: 'fixed',
        top: 80,
        right: 20,
        width: 220,
        backgroundColor: '#1a1d27',
        borderRadius: 12,
        border: '1px solid rgba(59,130,246,0.3)',
        padding: 16,
        zIndex: 9999,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
        {element.type.charAt(0).toUpperCase() + element.type.slice(1)} Properties
      </div>

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
          {element.rotation}\u00b0
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
    </div>
  );
}
