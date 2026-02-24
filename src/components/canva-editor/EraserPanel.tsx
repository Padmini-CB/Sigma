'use client';

import React from 'react';

interface EraserPanelProps {
  brushSize: number;
  softness: number;
  opacity: number;
  onBrushSizeChange: (size: number) => void;
  onSoftnessChange: (softness: number) => void;
  onOpacityChange: (opacity: number) => void;
}

function SliderRow({ label, value, min, max, unit, onChange }: {
  label: string; value: number; min: number; max: number; unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, fontWeight: 600, color: '#fff', minWidth: 40, textAlign: 'right' }}>
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          height: 4,
          appearance: 'none',
          WebkitAppearance: 'none',
          background: `linear-gradient(to right, #3B82F6 ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)`,
          borderRadius: 2,
          outline: 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  );
}

export default function EraserPanel({ brushSize, softness, opacity, onBrushSizeChange, onSoftnessChange, onOpacityChange }: EraserPanelProps) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Eraser Tool
      </p>

      {/* Instructions */}
      <div style={{
        padding: 12,
        borderRadius: 8,
        backgroundColor: 'rgba(59,130,246,0.08)',
        border: '1px solid rgba(59,130,246,0.2)',
      }}>
        <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, margin: 0 }}>
          Click on any image to start erasing. Paint to remove pixels with soft edges.
        </p>
        <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            Ctrl+Z &mdash; Undo last stroke
          </span>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
            Esc &mdash; Finish erasing &amp; save
          </span>
        </div>
      </div>

      {/* Brush preview */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
        <div style={{
          width: Math.min(brushSize, 120),
          height: Math.min(brushSize, 120),
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,255,255,${opacity / 100 * 0.8}) 0%, rgba(255,255,255,${opacity / 100 * 0.8 * (1 - softness / 100)}) ${Math.round((1 - softness / 100) * 100)}%, transparent 100%)`,
          border: '1px solid rgba(255,255,255,0.2)',
        }} />
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <SliderRow label="Brush Size" value={brushSize} min={5} max={200} unit="px" onChange={onBrushSizeChange} />
        <SliderRow label="Softness" value={softness} min={0} max={100} unit="%" onChange={onSoftnessChange} />
        <SliderRow label="Opacity" value={opacity} min={10} max={100} unit="%" onChange={onOpacityChange} />
      </div>
    </div>
  );
}
