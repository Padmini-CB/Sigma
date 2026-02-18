'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BRAND } from '@/styles/brand-constants';

interface AssetGeneratorProps {
  onIconSelect?: (iconUrl: string, toolName: string) => void;
  onBackgroundGenerated?: (base64: string) => void;
  onCustomImageGenerated?: (base64: string) => void;
}

interface ToolIcon {
  id: string;
  name: string;
  file: string;
}

interface ToolManifest {
  icons: ToolIcon[];
}

type BackgroundStyle =
  | 'tech-grid'
  | 'gradient-mesh'
  | 'circuit'
  | 'data-flow'
  | 'geometric'
  | 'code-rain';

interface BackgroundPreset {
  label: string;
  style: BackgroundStyle;
  emoji: string;
}

const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { label: 'Tech Grid', style: 'tech-grid', emoji: '&#9638;' },
  { label: 'Gradient Mesh', style: 'gradient-mesh', emoji: '&#9672;' },
  { label: 'Circuit Pattern', style: 'circuit', emoji: '&#9881;' },
  { label: 'Data Flow', style: 'data-flow', emoji: '&#9735;' },
  { label: 'Geometric', style: 'geometric', emoji: '&#9670;' },
  { label: 'Code Rain', style: 'code-rain', emoji: '&#10094;' },
];

const SECTION_HEADER_STYLE: React.CSSProperties = {
  color: '#3B82F6',
  fontFamily: BRAND.fonts.heading,
  textTransform: 'uppercase',
  letterSpacing: '3px',
  fontSize: 12,
  fontWeight: 700,
  marginBottom: 12,
};

export default function AssetGenerator({
  onIconSelect,
  onBackgroundGenerated,
  onCustomImageGenerated,
}: AssetGeneratorProps) {
  // ── Section 1: Tool Icons ──
  const [icons, setIcons] = useState<ToolIcon[]>([]);
  const [iconsLoading, setIconsLoading] = useState(true);
  const [iconsError, setIconsError] = useState<string | null>(null);
  const [hoveredIconId, setHoveredIconId] = useState<string | null>(null);

  // ── Section 2: AI Backgrounds ──
  const bgCacheRef = useRef<Map<BackgroundStyle, string>>(new Map());
  const [bgGenerating, setBgGenerating] = useState<BackgroundStyle | null>(null);
  const [bgError, setBgError] = useState<BackgroundStyle | null>(null);
  const [bgCacheVersion, setBgCacheVersion] = useState(0);
  const [hoveredBgStyle, setHoveredBgStyle] = useState<BackgroundStyle | null>(null);

  // ── Section 3: Custom Prompt ──
  const [customPrompt, setCustomPrompt] = useState('');
  const [customGenerating, setCustomGenerating] = useState(false);
  const [customError, setCustomError] = useState(false);
  const [customResult, setCustomResult] = useState<string | null>(null);
  const [customHistory, setCustomHistory] = useState<string[]>([]);
  const [hoveredHistoryIdx, setHoveredHistoryIdx] = useState<number | null>(null);

  // ── Fetch tool icon manifest on mount ──
  useEffect(() => {
    let cancelled = false;

    async function fetchManifest() {
      try {
        setIconsLoading(true);
        setIconsError(null);
        const res = await fetch('/assets/icons/tools/_manifest.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ToolManifest = await res.json();
        if (!cancelled) {
          setIcons(data.icons);
        }
      } catch (err) {
        if (!cancelled) {
          setIconsError(err instanceof Error ? err.message : 'Failed to load icons');
        }
      } finally {
        if (!cancelled) {
          setIconsLoading(false);
        }
      }
    }

    fetchManifest();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Generate AI background ──
  const handleGenerateBackground = useCallback(
    async (style: BackgroundStyle) => {
      // If cached, do nothing — thumbnail is already visible
      if (bgCacheRef.current.has(style)) return;

      setBgGenerating(style);
      setBgError(null);

      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          body: JSON.stringify({ prompt: style, type: 'background' }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: { image: string } = await res.json();
        bgCacheRef.current.set(style, data.image);
        setBgCacheVersion((v) => v + 1);
      } catch {
        setBgError(style);
      } finally {
        setBgGenerating(null);
      }
    },
    [],
  );

  // ── Generate custom image ──
  const handleGenerateCustom = useCallback(async () => {
    if (!customPrompt.trim()) return;

    setCustomGenerating(true);
    setCustomError(false);
    setCustomResult(null);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        body: JSON.stringify({ prompt: customPrompt.trim(), type: 'custom' }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data: { image: string } = await res.json();
      setCustomResult(data.image);

      // Add to history (keep last 5)
      setCustomHistory((prev) => {
        const next = [data.image, ...prev];
        return next.slice(0, 5);
      });
    } catch {
      setCustomError(true);
    } finally {
      setCustomGenerating(false);
    }
  }, [customPrompt]);

  return (
    <div
      style={{
        padding: 16,
        height: '100%',
        overflowY: 'auto',
        background: '#ffffff',
      }}
    >
      {/* ═══════════════════════════════════════════
          SECTION 1: TOOL ICONS
         ═══════════════════════════════════════════ */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={SECTION_HEADER_STYLE}>Tool Icons</h3>

        {iconsLoading && (
          <div className="animate-pulse" style={{ color: '#8892a4', fontSize: 13, fontFamily: BRAND.fonts.body }}>
            Loading icons...
          </div>
        )}

        {iconsError && (
          <div style={{ color: '#ef4444', fontSize: 13, fontFamily: BRAND.fonts.body }}>
            {iconsError}
          </div>
        )}

        {!iconsLoading && !iconsError && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
            }}
          >
            {icons.map((icon) => {
              const isHovered = hoveredIconId === icon.id;
              return (
                <button
                  key={icon.id}
                  onClick={() =>
                    onIconSelect?.(`/assets/icons/tools/${icon.file}`, icon.name)
                  }
                  onMouseEnter={() => setHoveredIconId(icon.id)}
                  onMouseLeave={() => setHoveredIconId(null)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 60,
                    height: 60,
                    background: '#181830',
                    borderRadius: 8,
                    border: isHovered ? '2px solid #3B82F6' : '2px solid transparent',
                    cursor: 'pointer',
                    padding: 4,
                    transition: 'border-color 0.2s ease, transform 0.15s ease',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                  }}
                  title={icon.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/assets/icons/tools/${icon.file}`}
                    alt={icon.name}
                    style={{
                      width: 32,
                      height: 32,
                      objectFit: 'contain',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 9,
                      color: '#ffffff',
                      fontFamily: BRAND.fonts.body,
                      marginTop: 2,
                      textAlign: 'center',
                      lineHeight: 1.1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '100%',
                    }}
                  >
                    {icon.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 2: AI BACKGROUNDS
         ═══════════════════════════════════════════ */}
      <div style={{ marginBottom: 24 }}>
        <h3 style={SECTION_HEADER_STYLE}>AI Backgrounds</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 8,
          }}
        >
          {BACKGROUND_PRESETS.map((preset) => {
            const cached = bgCacheRef.current.get(preset.style);
            const isGenerating = bgGenerating === preset.style;
            const hasError = bgError === preset.style;
            const isHovered = hoveredBgStyle === preset.style;

            return (
              <div key={preset.style} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {/* Generate Button */}
                <button
                  onClick={() => handleGenerateBackground(preset.style)}
                  disabled={isGenerating}
                  onMouseEnter={() => setHoveredBgStyle(preset.style)}
                  onMouseLeave={() => setHoveredBgStyle(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '10px 8px',
                    background: isHovered ? '#5d3fb3' : '#6F53C1',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 8,
                    cursor: isGenerating ? 'wait' : 'pointer',
                    fontFamily: BRAND.fonts.body,
                    fontSize: 13,
                    fontWeight: 500,
                    transition: 'background-color 0.2s ease',
                    opacity: isGenerating ? 0.7 : 1,
                  }}
                >
                  <span
                    dangerouslySetInnerHTML={{ __html: preset.emoji }}
                    style={{ fontSize: 14 }}
                  />
                  <span>{preset.label}</span>
                </button>

                {/* Generating state */}
                {isGenerating && (
                  <div
                    className="animate-pulse"
                    style={{
                      color: '#6F53C1',
                      fontSize: 12,
                      fontFamily: BRAND.fonts.body,
                      textAlign: 'center',
                      padding: '8px 0',
                    }}
                  >
                    Generating...
                  </div>
                )}

                {/* Error state */}
                {hasError && !isGenerating && (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '6px 0',
                    }}
                  >
                    <span
                      style={{
                        color: '#ef4444',
                        fontSize: 11,
                        fontFamily: BRAND.fonts.body,
                        display: 'block',
                        marginBottom: 4,
                      }}
                    >
                      Generation failed — try again
                    </span>
                    <button
                      onClick={() => {
                        setBgError(null);
                        handleGenerateBackground(preset.style);
                      }}
                      style={{
                        color: '#ef4444',
                        fontSize: 11,
                        fontFamily: BRAND.fonts.body,
                        fontWeight: 600,
                        background: 'none',
                        border: '1px solid #ef4444',
                        borderRadius: 4,
                        padding: '2px 8px',
                        cursor: 'pointer',
                      }}
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Cached thumbnail */}
                {cached && !isGenerating && (
                  <button
                    onClick={() => onBackgroundGenerated?.(cached)}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: 0,
                      cursor: 'pointer',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/png;base64,${cached}`}
                      alt={`${preset.label} background`}
                      style={{
                        width: '100%',
                        height: 64,
                        objectFit: 'cover',
                        borderRadius: 8,
                        display: 'block',
                      }}
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {/* Force re-render when cache updates (bgCacheVersion is used implicitly via render) */}
        <span style={{ display: 'none' }}>{bgCacheVersion}</span>
      </div>

      {/* ═══════════════════════════════════════════
          SECTION 3: CUSTOM PROMPT
         ═══════════════════════════════════════════ */}
      <div>
        <h3 style={SECTION_HEADER_STYLE}>Custom Prompt</h3>

        {/* Input + Generate button */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleGenerateCustom();
            }}
            placeholder="Describe what you need..."
            style={{
              flex: 1,
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid #d1d5db',
              fontFamily: BRAND.fonts.body,
              fontSize: 13,
              outline: 'none',
            }}
          />
          <button
            onClick={handleGenerateCustom}
            disabled={customGenerating || !customPrompt.trim()}
            style={{
              padding: '8px 16px',
              background: '#6F53C1',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              fontFamily: BRAND.fonts.body,
              fontSize: 13,
              fontWeight: 600,
              cursor:
                customGenerating || !customPrompt.trim()
                  ? 'not-allowed'
                  : 'pointer',
              opacity: customGenerating || !customPrompt.trim() ? 0.6 : 1,
              whiteSpace: 'nowrap',
              transition: 'opacity 0.2s ease',
            }}
          >
            Generate
          </button>
        </div>

        {/* Generating state */}
        {customGenerating && (
          <div
            className="animate-pulse"
            style={{
              color: '#6F53C1',
              fontSize: 13,
              fontFamily: BRAND.fonts.body,
              textAlign: 'center',
              padding: '16px 0',
            }}
          >
            Generating...
          </div>
        )}

        {/* Error state */}
        {customError && !customGenerating && (
          <div style={{ textAlign: 'center', padding: '12px 0' }}>
            <span
              style={{
                color: '#ef4444',
                fontSize: 12,
                fontFamily: BRAND.fonts.body,
                display: 'block',
                marginBottom: 6,
              }}
            >
              Generation failed — try again
            </span>
            <button
              onClick={() => {
                setCustomError(false);
                handleGenerateCustom();
              }}
              style={{
                color: '#ef4444',
                fontSize: 12,
                fontFamily: BRAND.fonts.body,
                fontWeight: 600,
                background: 'none',
                border: '1px solid #ef4444',
                borderRadius: 4,
                padding: '3px 10px',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Generated result thumbnail */}
        {customResult && !customGenerating && (
          <button
            onClick={() => onCustomImageGenerated?.(customResult)}
            style={{
              border: 'none',
              background: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              marginBottom: 12,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/png;base64,${customResult}`}
              alt="Generated custom image"
              style={{
                width: '100%',
                height: 100,
                objectFit: 'cover',
                borderRadius: 8,
                display: 'block',
              }}
            />
          </button>
        )}

        {/* History thumbnails */}
        {customHistory.length > 0 && (
          <div>
            <p
              style={{
                fontSize: 11,
                color: '#8892a4',
                fontFamily: BRAND.fonts.body,
                marginBottom: 6,
              }}
            >
              Recent generations
            </p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {customHistory.map((base64, idx) => {
                const isHistoryHovered = hoveredHistoryIdx === idx;
                return (
                  <button
                    key={`${idx}-${base64.slice(0, 16)}`}
                    onClick={() => onCustomImageGenerated?.(base64)}
                    onMouseEnter={() => setHoveredHistoryIdx(idx)}
                    onMouseLeave={() => setHoveredHistoryIdx(null)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 8,
                      overflow: 'hidden',
                      border: isHistoryHovered
                        ? '2px solid #3B82F6'
                        : '2px solid transparent',
                      padding: 0,
                      background: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s ease',
                      flexShrink: 0,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/png;base64,${base64}`}
                      alt={`History ${idx + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
