'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BRAND } from '@/styles/brand-constants';
import { useExportPng } from '@/hooks/useExportPng';
import { useToast } from '@/components/Toast';

const WIDTH = 1280;
const HEIGHT = 720;

type FontStyleId = 'bold-clean' | 'gradient-impact' | 'mixed-weight' | 'outlined';

interface ThumbnailState {
  headline: string;
  accentWords: Set<number>;
  expression: string;
  backgroundPreset: number;
  techIcons: string[];
  layout: number;
  fontStyle: FontStyleId;
}

const FONT_STYLE_PRESETS: { id: FontStyleId; name: string; description: string; bestFor: string }[] = [
  { id: 'bold-clean', name: 'Bold Clean', description: 'Saira Condensed, weight 900, uppercase, solid colors', bestFor: 'Tutorials' },
  { id: 'gradient-impact', name: 'Gradient Impact', description: 'Extra Condensed, weight 900, gradient fill', bestFor: 'Roadmaps' },
  { id: 'mixed-weight', name: 'Mixed Weight', description: 'Thin + extra bold mix for visual hierarchy', bestFor: 'Debates' },
  { id: 'outlined', name: 'Outlined', description: 'Colored outline with transparent or white fill', bestFor: 'Provocative' },
];

const EXPRESSIONS = [
  { id: 'thinking', label: 'Thinking', img: '/assets/founders/dhaval-thinking.png' },
  { id: 'pointing', label: 'Pointing', img: '/assets/founders/dhaval-pointing.png' },
  { id: 'displaying', label: 'Displaying', img: '/assets/founders/dhaval-displaying.png' },
  { id: 'excited', label: 'Excited', img: '/assets/founders/dhaval-excited.png' },
  { id: 'none', label: 'No Person', img: '' },
];

const GRADIENT_PRESETS = [
  { label: 'Deep Navy', bg: 'linear-gradient(135deg, #0c1630 0%, #1a1545 50%, #0c1630 100%)' },
  { label: 'Electric Blue', bg: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0a2463 100%)' },
  { label: 'Purple Haze', bg: 'linear-gradient(135deg, #1a0533 0%, #2d1b69 50%, #1a0533 100%)' },
  { label: 'Dark Emerald', bg: 'linear-gradient(135deg, #0a1628 0%, #0d3320 50%, #0a1628 100%)' },
  { label: 'Warm Ember', bg: 'linear-gradient(135deg, #1a0a0a 0%, #3d1c1c 50%, #1a0a0a 100%)' },
];

const TECH_ICON_OPTIONS = [
  'Python', 'SQL', 'Power BI', 'Excel', 'Spark', 'AWS',
  'Snowflake', 'Airflow', 'Kafka', 'Docker', 'Databricks', 'Tableau',
  'TensorFlow', 'React', 'MongoDB', 'PostgreSQL',
];

const PRESET_LAYOUTS = [
  {
    name: 'AI Will Replace You?',
    headline: 'WILL AI REPLACE SOFTWARE ENGINEERS?',
    accentWords: new Set([4]),
    expression: 'thinking',
    techIcons: ['Python', 'TensorFlow', 'AWS'],
    backgroundPreset: 0,
    fontStyle: 'mixed-weight' as FontStyleId,
  },
  {
    name: 'SQL for Beginners',
    headline: 'LEARN SQL IN 4 HOURS',
    accentWords: new Set([1]),
    expression: 'displaying',
    techIcons: ['SQL', 'PostgreSQL', 'Excel'],
    backgroundPreset: 1,
    fontStyle: 'bold-clean' as FontStyleId,
  },
  {
    name: 'Data Engineer Roadmap',
    headline: 'DATA ENGINEER ROADMAP 2026',
    accentWords: new Set([3]),
    expression: 'pointing',
    techIcons: ['Spark', 'Airflow', 'Kafka', 'AWS', 'Databricks'],
    backgroundPreset: 2,
    fontStyle: 'gradient-impact' as FontStyleId,
  },
  {
    name: 'Power BI Full Course',
    headline: 'POWER BI FULL COURSE FOR BEGINNERS',
    accentWords: new Set([0, 1]),
    expression: 'excited',
    techIcons: ['Power BI', 'Excel', 'SQL'],
    backgroundPreset: 3,
    fontStyle: 'bold-clean' as FontStyleId,
  },
  {
    name: 'Resume Tips',
    headline: 'YOUR RESUME IS GETTING REJECTED',
    accentWords: new Set([5]),
    expression: 'thinking',
    techIcons: [],
    backgroundPreset: 4,
    fontStyle: 'outlined' as FontStyleId,
  },
];

function ThumbnailCanvas({ state }: { state: ThumbnailState }) {
  const scale = HEIGHT / 720;
  const words = state.headline.split(' ');
  const expressionData = EXPRESSIONS.find(e => e.id === state.expression);
  const hasExpression = state.expression !== 'none' && expressionData?.img;
  const baseFontSize = hasExpression ? 90 * scale : 110 * scale;

  const renderHeadline = () => {
    switch (state.fontStyle) {
      case 'gradient-impact': {
        return (
          <h1 style={{
            fontSize: baseFontSize,
            fontWeight: 900,
            fontFamily: "'Saira Extra Condensed', 'Saira Condensed', sans-serif",
            textTransform: 'uppercase',
            lineHeight: 1.0,
            margin: 0,
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #c7f464 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            {words.join(' ')}
          </h1>
        );
      }

      case 'mixed-weight': {
        return (
          <h1 style={{
            fontSize: baseFontSize,
            fontFamily: BRAND.fonts.heading,
            textTransform: 'uppercase',
            lineHeight: 1.0,
            margin: 0,
          }}>
            {words.map((word, i) => {
              const isAccent = state.accentWords.has(i);
              return (
                <span key={i}>
                  <span style={{
                    fontWeight: isAccent ? 900 : 300,
                    color: isAccent ? '#c7f464' : 'rgba(255,255,255,0.85)',
                  }}>
                    {word}
                  </span>
                  {i < words.length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </h1>
        );
      }

      case 'outlined': {
        return (
          <h1 style={{
            fontSize: baseFontSize,
            fontWeight: 900,
            fontFamily: BRAND.fonts.heading,
            textTransform: 'uppercase',
            lineHeight: 1.0,
            margin: 0,
            color: 'transparent',
            WebkitTextStroke: `${2.5 * scale}px #c7f464`,
          }}>
            {words.map((word, i) => {
              const isAccent = state.accentWords.has(i);
              return (
                <span key={i}>
                  <span style={{
                    ...(isAccent ? {
                      color: '#ffffff',
                      WebkitTextStroke: `${2.5 * scale}px #c7f464`,
                    } : {}),
                  }}>
                    {word}
                  </span>
                  {i < words.length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </h1>
        );
      }

      case 'bold-clean':
      default: {
        return (
          <h1 style={{
            fontSize: baseFontSize,
            fontWeight: 900,
            fontFamily: BRAND.fonts.heading,
            textTransform: 'uppercase',
            lineHeight: 1.0,
            margin: 0,
          }}>
            {words.map((word, i) => (
              <span key={i}>
                <span style={{
                  color: state.accentWords.has(i) ? '#c7f464' : '#ffffff',
                }}>
                  {word}
                </span>
                {i < words.length - 1 ? ' ' : ''}
              </span>
            ))}
          </h1>
        );
      }
    }
  };

  return (
    <div style={{
      width: WIDTH,
      height: HEIGHT,
      background: GRADIENT_PRESETS[state.backgroundPreset]?.bg || GRADIENT_PRESETS[0].bg,
      display: 'flex',
      fontFamily: BRAND.fonts.body,
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box',
    }}>
      {/* Decorative gradient circle */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-5%',
        width: 500 * scale,
        height: 500 * scale,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(67,97,238,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* LEFT 60% — Text content */}
      <div style={{
        width: hasExpression ? '60%' : '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `${28 * scale}px ${36 * scale}px`,
        gap: 16 * scale,
        flexShrink: 0,
      }}>
        {/* Headline — styled by font preset */}
        {renderHeadline()}

        {/* Tech icons row */}
        {state.techIcons.length > 0 && (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 10 * scale,
          }}>
            {state.techIcons.map(tech => (
              <div key={tech} style={{
                backgroundColor: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                padding: `${6 * scale}px ${16 * scale}px`,
                fontSize: 20 * scale,
                fontWeight: 600,
                color: '#ffffff',
                fontFamily: BRAND.fonts.body,
              }}>
                {tech}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* RIGHT 40% — Founder expression photo */}
      {hasExpression && (
        <div style={{
          width: '40%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Gradient overlay at bottom for seamless blend */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '20%',
            background: 'linear-gradient(to top, rgba(12,22,48,0.6), transparent)',
            zIndex: 1,
          }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={expressionData!.img}
            alt={`Dhaval - ${expressionData!.label}`}
            style={{
              height: '110%',
              objectFit: 'cover',
              objectPosition: 'top center',
              position: 'relative',
              zIndex: 2,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function ThumbnailPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const exportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { exportPng, isExporting } = useExportPng();
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  const [state, setState] = useState<ThumbnailState>({
    headline: 'WILL AI REPLACE SOFTWARE ENGINEERS?',
    accentWords: new Set([4]),
    expression: 'thinking',
    backgroundPreset: 0,
    techIcons: ['Python', 'TensorFlow', 'AWS'],
    layout: 0,
    fontStyle: 'bold-clean',
  });

  const [description, setDescription] = useState('');

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: Math.max(rect.width - 64, 200),
          height: Math.max(rect.height - 64, 200),
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const previewScale = useMemo(() => {
    const scaleW = containerSize.width / WIDTH;
    const scaleH = containerSize.height / HEIGHT;
    return Math.min(scaleW, scaleH, 1);
  }, [containerSize]);

  const toggleAccentWord = (idx: number) => {
    setState(prev => {
      const next = new Set(prev.accentWords);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return { ...prev, accentWords: next };
    });
  };

  const toggleTechIcon = (tech: string) => {
    setState(prev => {
      const next = prev.techIcons.includes(tech)
        ? prev.techIcons.filter(t => t !== tech)
        : [...prev.techIcons, tech];
      return { ...prev, techIcons: next };
    });
  };

  const applyPreset = (idx: number) => {
    const preset = PRESET_LAYOUTS[idx];
    setState({
      headline: preset.headline,
      accentWords: new Set(preset.accentWords),
      expression: preset.expression,
      backgroundPreset: preset.backgroundPreset,
      techIcons: [...preset.techIcons],
      layout: idx,
      fontStyle: preset.fontStyle,
    });
    showToast('success', 'Preset Applied', `"${preset.name}" layout loaded`);
  };

  const handleGenerate = () => {
    // Demo mode: pick a preset based on description keywords
    const lower = description.toLowerCase();
    if (lower.includes('sql')) applyPreset(1);
    else if (lower.includes('road') || lower.includes('engineer')) applyPreset(2);
    else if (lower.includes('power bi') || lower.includes('powerbi')) applyPreset(3);
    else if (lower.includes('resume') || lower.includes('reject')) applyPreset(4);
    else applyPreset(0);
    showToast('info', 'Demo Mode', 'Using pre-built thumbnail. AI generation coming soon.');
  };

  const handleExport = async () => {
    try {
      await exportPng(exportRef.current, {
        templateName: 'youtube-thumbnail',
        width: WIDTH,
        height: HEIGHT,
      });
      showToast('success', 'Export Complete', 'Thumbnail saved as PNG (1280×720)');
    } catch {
      showToast('error', 'Export Failed', 'Could not export thumbnail');
    }
  };

  const words = state.headline.split(' ');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-dark border-b border-white/10 flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => router.push('/create')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-ui text-sm">Back</span>
              </button>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="font-headline text-xl font-bold text-white">YouTube Thumbnail</h1>
                <p className="font-ui text-xs text-gray-400">1280 × 720 • YouTube</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-medium bg-brand-lime text-brand-navy hover:bg-brand-lime/90 transition-colors disabled:opacity-50"
              >
                {isExporting ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                {isExporting ? 'Exporting...' : 'Export PNG'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0 hidden lg:block">
          <div className="p-4 space-y-5">
            {/* Describe your video */}
            <div>
              <label className="block font-ui text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Describe your video
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. SQL tutorial for beginners, data engineer roadmap 2026..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-body text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue resize-none"
              />
              <button
                onClick={handleGenerate}
                className="w-full mt-2 py-2.5 rounded-lg font-ui text-sm font-semibold bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:opacity-90 transition"
              >
                Generate Thumbnail
              </button>
            </div>

            <hr className="border-gray-200" />

            {/* Headline */}
            <div>
              <label className="block font-ui text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Headline
              </label>
              <input
                type="text"
                value={state.headline}
                onChange={e => setState(prev => ({ ...prev, headline: e.target.value, accentWords: new Set() }))}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-body text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
              />
              <p className="font-ui text-xs text-gray-400 mt-1">Click words below to accent them:</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {words.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => toggleAccentWord(i)}
                    className={`px-2 py-1 rounded text-xs font-ui font-semibold transition-colors ${
                      state.accentWords.has(i)
                        ? 'bg-lime-400 text-gray-900'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Font Style */}
            <div>
              <label className="block font-ui text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Font Style
              </label>
              <div className="space-y-1.5">
                {FONT_STYLE_PRESETS.map(preset => (
                  <button
                    key={preset.id}
                    onClick={() => setState(prev => ({ ...prev, fontStyle: preset.id }))}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors border ${
                      state.fontStyle === preset.id
                        ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/30'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Mini visual preview */}
                      <div
                        className="w-14 h-9 rounded flex-shrink-0 flex items-center justify-center overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #0c1630 0%, #1a1545 100%)' }}
                      >
                        {preset.id === 'bold-clean' && (
                          <span style={{
                            fontFamily: "'Saira Condensed', sans-serif",
                            fontWeight: 900,
                            fontSize: 11,
                            color: '#ffffff',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                          }}>
                            <span>AB</span>
                            <span style={{ color: '#c7f464' }}>C</span>
                          </span>
                        )}
                        {preset.id === 'gradient-impact' && (
                          <span style={{
                            fontFamily: "'Saira Condensed', sans-serif",
                            fontWeight: 900,
                            fontSize: 11,
                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #c7f464)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                          }}>
                            ABC
                          </span>
                        )}
                        {preset.id === 'mixed-weight' && (
                          <span style={{
                            fontFamily: "'Saira Condensed', sans-serif",
                            fontSize: 11,
                            textTransform: 'uppercase',
                            lineHeight: 1,
                          }}>
                            <span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.6)' }}>A</span>
                            <span style={{ fontWeight: 900, color: '#c7f464' }}>B</span>
                            <span style={{ fontWeight: 300, color: 'rgba(255,255,255,0.6)' }}>C</span>
                          </span>
                        )}
                        {preset.id === 'outlined' && (
                          <span style={{
                            fontFamily: "'Saira Condensed', sans-serif",
                            fontWeight: 900,
                            fontSize: 11,
                            color: 'transparent',
                            WebkitTextStroke: '1px #c7f464',
                            textTransform: 'uppercase',
                            lineHeight: 1,
                          }}>
                            ABC
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-ui text-sm font-semibold leading-tight">{preset.name}</div>
                        <div className="font-ui text-[10px] text-gray-400 leading-tight mt-0.5">
                          Best for {preset.bestFor}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Founder Expression */}
            <div>
              <label className="block font-ui text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Dhaval Expression
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {EXPRESSIONS.map(expr => (
                  <button
                    key={expr.id}
                    onClick={() => setState(prev => ({ ...prev, expression: expr.id }))}
                    className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg text-xs font-ui transition-colors ${
                      state.expression === expr.id
                        ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/30'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    {expr.img ? (
                      <div className="w-12 h-12 rounded-lg bg-gray-900 overflow-hidden flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={expr.img} alt={expr.label} className="w-full h-full object-cover object-top" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      </div>
                    )}
                    <span className="font-semibold">{expr.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Tech Icons */}
            <div>
              <label className="block font-ui text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Tech Icons
              </label>
              <div className="flex flex-wrap gap-1.5">
                {TECH_ICON_OPTIONS.map(tech => (
                  <button
                    key={tech}
                    onClick={() => toggleTechIcon(tech)}
                    className={`px-2.5 py-1 rounded text-xs font-ui font-medium transition-colors ${
                      state.techIcons.includes(tech)
                        ? 'bg-brand-blue text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Background Presets */}
            <div>
              <label className="block font-ui text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Background
              </label>
              <div className="grid grid-cols-5 gap-2">
                {GRADIENT_PRESETS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => setState(prev => ({ ...prev, backgroundPreset: i }))}
                    title={preset.label}
                    className={`w-full aspect-square rounded-lg transition-all ${
                      state.backgroundPreset === i
                        ? 'ring-2 ring-brand-blue ring-offset-2'
                        : 'hover:ring-1 hover:ring-gray-300'
                    }`}
                    style={{ background: preset.bg }}
                  />
                ))}
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Quick Presets */}
            <div>
              <label className="block font-ui text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Quick Presets
              </label>
              <div className="space-y-1.5">
                {PRESET_LAYOUTS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => applyPreset(i)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-ui transition-colors ${
                      state.layout === i
                        ? 'bg-brand-blue/10 text-brand-blue border border-brand-blue/30'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <span className="font-semibold">{preset.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white border-b border-gray-200 px-6 py-2 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-4">
              <h3 className="font-ui text-sm font-semibold text-gray-700">Preview</h3>
              <span className="font-ui text-xs text-gray-400">1280 × 720px</span>
            </div>
            <span className="font-ui text-xs text-gray-400">YouTube Thumbnail</span>
          </div>

          {/* Preview */}
          <div
            ref={containerRef}
            className="flex-1 overflow-auto p-8 flex items-center justify-center"
          >
            <div className="relative">
              <div
                className="relative shadow-2xl"
                style={{
                  width: WIDTH,
                  height: HEIGHT,
                  transform: `scale(${previewScale})`,
                  transformOrigin: 'center center',
                }}
              >
                <ThumbnailCanvas state={state} />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 px-6 py-2 flex-shrink-0">
            <div className="flex items-center justify-between">
              <span className="font-ui text-xs text-gray-500">
                Platform: <span className="font-semibold text-gray-700">YouTube</span>
              </span>
              <span className="font-ui text-xs text-gray-400">
                No logo, badge, CTA, or bottom bar — YouTube-native design
              </span>
            </div>
          </div>

          {/* Hidden export container */}
          <div
            style={{
              position: 'fixed',
              left: '-99999px',
              top: '-99999px',
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <div
              ref={exportRef}
              style={{ width: WIDTH, height: HEIGHT, overflow: 'visible' }}
            >
              <ThumbnailCanvas state={state} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
