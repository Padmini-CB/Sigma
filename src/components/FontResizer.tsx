'use client';

import { useState, useCallback, useMemo } from 'react';
import {
  FONT_SIZE_PRESETS,
  FONT_CONFIG,
  FONT_COLORS,
  BRAND_COLORS,
  DEFAULT_PRESET,
  type FontSizeConfig,
  type PresetMode,
} from '@/config/fontSizes';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface FontResizerProps {
  fontSizes: FontSizeConfig;
  onChange: (sizes: FontSizeConfig) => void;
  /** Label showing which ad size is being edited, e.g. "Portrait (1080 × 1350)" */
  activeSizeLabel?: string;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ELEMENT_LABELS: Record<keyof FontSizeConfig, string> = {
  headline: 'Headline',
  subheadline: 'Subheadline',
  body: 'Body',
  cardTitle: 'Card Title',
  label: 'Label',
  statNumber: 'Stat Number',
  cta: 'CTA',
  bottomBar: 'Bottom Bar',
};

const SLIDER_ELEMENTS: (keyof FontSizeConfig)[] = [
  'headline',
  'subheadline',
  'body',
  'cardTitle',
  'label',
  'statNumber',
  'cta',
  'bottomBar',
];

const PRESET_ORDER: PresetMode[] = ['desktop', 'balanced', 'mobile', 'bold'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function FontResizer({ fontSizes, onChange, activeSizeLabel }: FontResizerProps) {
  const [lastPreset, setLastPreset] = useState<PresetMode>(DEFAULT_PRESET);

  // Determine if current sizes exactly match any preset
  const matchingPreset = useMemo(() => {
    for (const mode of PRESET_ORDER) {
      const sizes = FONT_SIZE_PRESETS[mode].sizes;
      if (SLIDER_ELEMENTS.every((k) => fontSizes[k] === sizes[k])) {
        return mode;
      }
    }
    return null;
  }, [fontSizes]);

  const isCustomized = matchingPreset === null;

  // ------- handlers -------

  const handlePresetSelect = useCallback(
    (mode: PresetMode) => {
      setLastPreset(mode);
      onChange({ ...FONT_SIZE_PRESETS[mode].sizes });
    },
    [onChange],
  );

  const handleSliderChange = useCallback(
    (key: keyof FontSizeConfig, value: number) => {
      onChange({ ...fontSizes, [key]: value });
    },
    [fontSizes, onChange],
  );

  const handleReset = useCallback(() => {
    onChange({ ...FONT_SIZE_PRESETS[lastPreset].sizes });
  }, [lastPreset, onChange]);

  // ------- render -------

  return (
    <div className="space-y-6">
      {/* ── CURRENT SIZE CONTEXT ── */}
      {activeSizeLabel && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}
        >
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke={BRAND_COLORS.brandBlue} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
          <span
            className="text-xs font-bold"
            style={{ color: BRAND_COLORS.brandBlue, fontFamily: "'Saira Condensed', sans-serif", letterSpacing: '0.5px' }}
          >
            Editing: {activeSizeLabel}
          </span>
        </div>
      )}

      {/* ── PRESET SECTION ── */}
      <div>
        <h3
          className="font-headline text-xs font-bold uppercase mb-3"
          style={{ color: BRAND_COLORS.brandBlue, letterSpacing: '3px' }}
        >
          Size Preset
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {PRESET_ORDER.map((mode) => {
            const preset = FONT_SIZE_PRESETS[mode];
            const isActive = matchingPreset === mode;

            return (
              <button
                key={mode}
                onClick={() => handlePresetSelect(mode)}
                className="text-left p-3 rounded-lg transition-all"
                style={{
                  background: isActive
                    ? 'rgba(59, 130, 246, 0.08)'
                    : 'rgba(255, 255, 255, 0.03)',
                  border: isActive
                    ? `1.5px solid ${BRAND_COLORS.brandBlue}`
                    : '1.5px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: isActive
                    ? '0 0 12px rgba(59, 130, 246, 0.15)'
                    : 'none',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base leading-none">{preset.icon}</span>
                  <span
                    className="text-sm font-semibold"
                    style={{
                      color: isActive
                        ? BRAND_COLORS.white
                        : 'rgba(255, 255, 255, 0.6)',
                    }}
                  >
                    {preset.name}
                  </span>
                </div>
                <p
                  className="text-xs leading-tight"
                  style={{ color: 'rgba(255, 255, 255, 0.35)' }}
                >
                  {preset.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── FINE-TUNE SECTION ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-headline text-xs font-bold uppercase"
            style={{ color: BRAND_COLORS.brandBlue, letterSpacing: '3px' }}
          >
            Fine-Tune
          </h3>

          {isCustomized && (
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-bold uppercase px-2 py-0.5 rounded"
                style={{
                  color: BRAND_COLORS.white,
                  backgroundColor: BRAND_COLORS.brandPurple,
                  letterSpacing: '1px',
                }}
              >
                Customized
              </span>
              <button
                onClick={handleReset}
                className="text-[10px] underline transition-opacity hover:opacity-80"
                style={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                Reset to{' '}
                {FONT_SIZE_PRESETS[lastPreset].name.split(' /')[0].toLowerCase()}
              </button>
            </div>
          )}
        </div>

        <div
          className="rounded-xl p-4 space-y-4"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {SLIDER_ELEMENTS.map((key) => {
            const config = FONT_CONFIG[key];
            const value = fontSizes[key];
            const fill = ((value - 10) / (120 - 10)) * 100;
            const elementColor =
              FONT_COLORS[key as keyof typeof FONT_COLORS] ?? undefined;

            return (
              <div key={key}>
                {/* Label row */}
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    {elementColor && (
                      <span
                        className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor: elementColor,
                          border:
                            elementColor === BRAND_COLORS.white ||
                            elementColor === FONT_COLORS.bottomBar
                              ? '1px solid rgba(255,255,255,0.25)'
                              : 'none',
                        }}
                      />
                    )}
                    <span style={{ color: 'rgba(255, 255, 255, 0.6)' }} className="text-sm">
                      {ELEMENT_LABELS[key]}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: 'rgba(255, 255, 255, 0.35)' }}
                    >
                      {config.font}
                    </span>
                  </div>
                  <span
                    className="text-lg font-bold tabular-nums"
                    style={{
                      color: BRAND_COLORS.limeYellow,
                      fontFamily: "'Saira Condensed', sans-serif",
                    }}
                  >
                    {value}px
                  </span>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={10}
                  max={120}
                  value={value}
                  onChange={(e) =>
                    handleSliderChange(key, parseInt(e.target.value, 10))
                  }
                  className="font-resizer-slider w-full h-1.5 rounded-full appearance-none cursor-pointer outline-none"
                  style={{
                    background: `linear-gradient(to right, ${BRAND_COLORS.brandBlue} 0%, ${BRAND_COLORS.brandBlue} ${fill}%, rgba(255,255,255,0.08) ${fill}%, rgba(255,255,255,0.08) 100%)`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Scoped slider thumb styles */}
      <style>{`
        .font-resizer-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${BRAND_COLORS.white};
          border: 2px solid ${BRAND_COLORS.brandBlue};
          cursor: pointer;
          box-shadow: 0 0 4px rgba(59, 130, 246, 0.3);
        }
        .font-resizer-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: ${BRAND_COLORS.white};
          border: 2px solid ${BRAND_COLORS.brandBlue};
          cursor: pointer;
          box-shadow: 0 0 4px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}
