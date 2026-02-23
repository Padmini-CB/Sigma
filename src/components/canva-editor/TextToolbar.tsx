'use client';

import { TextStyle } from './types';

interface TextToolbarProps {
  style: TextStyle;
  position: { x: number; y: number };
  onChange: (updates: Partial<TextStyle>) => void;
}

export default function TextToolbar({ style, position, onChange }: TextToolbarProps) {
  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y - 48,
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#1e1e2e',
        borderRadius: 8,
        border: '1px solid rgba(255,255,255,0.15)',
        padding: '4px 8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: 200,
        whiteSpace: 'nowrap',
      }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Font family */}
      <select
        value={style.fontFamily}
        onChange={(e) => onChange({ fontFamily: e.target.value })}
        style={{
          padding: '3px 4px',
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          color: '#fff',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 11,
          cursor: 'pointer',
          outline: 'none',
          maxWidth: 90,
        }}
      >
        <option value="Poppins">Poppins</option>
        <option value="Saira Condensed">Saira Condensed</option>
        <option value="Kanit">Kanit</option>
        <option value="Manrope">Manrope</option>
      </select>

      {/* Separator */}
      <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.15)' }} />

      {/* Font size */}
      <input
        type="number"
        value={style.fontSize}
        onChange={(e) => onChange({ fontSize: Number(e.target.value) })}
        style={{
          width: 44,
          padding: '3px 4px',
          borderRadius: 4,
          border: '1px solid rgba(255,255,255,0.15)',
          backgroundColor: 'rgba(255,255,255,0.06)',
          color: '#fff',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 11,
          outline: 'none',
          textAlign: 'center',
        }}
      />

      <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.15)' }} />

      {/* Bold */}
      <button
        onClick={() => onChange({ fontWeight: style.fontWeight >= 700 ? 400 : 700 })}
        style={{
          width: 28,
          height: 28,
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
          backgroundColor: style.fontWeight >= 700 ? 'rgba(59,130,246,0.3)' : 'transparent',
          color: style.fontWeight >= 700 ? '#3B82F6' : 'rgba(255,255,255,0.5)',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 13,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Bold"
      >
        B
      </button>

      {/* Italic */}
      <button
        onClick={() => onChange({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' })}
        style={{
          width: 28,
          height: 28,
          borderRadius: 4,
          border: 'none',
          cursor: 'pointer',
          backgroundColor: style.fontStyle === 'italic' ? 'rgba(59,130,246,0.3)' : 'transparent',
          color: style.fontStyle === 'italic' ? '#3B82F6' : 'rgba(255,255,255,0.5)',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 13,
          fontStyle: 'italic',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        title="Italic"
      >
        I
      </button>

      <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.15)' }} />

      {/* Color */}
      <input
        type="color"
        value={style.color.startsWith('rgba') ? '#ffffff' : style.color}
        onChange={(e) => onChange({ color: e.target.value })}
        style={{
          width: 24,
          height: 24,
          border: '2px solid rgba(255,255,255,0.15)',
          borderRadius: 4,
          cursor: 'pointer',
          padding: 0,
          backgroundColor: 'transparent',
        }}
        title="Text color"
      />

      <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.15)' }} />

      {/* Alignment */}
      {(['left', 'center', 'right'] as const).map(align => (
        <button
          key={align}
          onClick={() => onChange({ textAlign: align })}
          style={{
            width: 26,
            height: 26,
            borderRadius: 4,
            border: 'none',
            cursor: 'pointer',
            backgroundColor: style.textAlign === align ? 'rgba(59,130,246,0.3)' : 'transparent',
            color: style.textAlign === align ? '#3B82F6' : 'rgba(255,255,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          title={`Align ${align}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {align === 'left' && <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></>}
            {align === 'center' && <><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></>}
            {align === 'right' && <><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></>}
          </svg>
        </button>
      ))}
    </div>
  );
}
