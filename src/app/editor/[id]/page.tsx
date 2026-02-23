'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useRef, useCallback } from 'react';
import templatesData from '@/data/templates.json';
import { useToast } from '@/components/Toast';

// Canva-style editor components
import CanvaSidebar, { type SidebarTab } from '@/components/canva-editor/CanvaSidebar';
import FreeFormCanvas from '@/components/canva-editor/FreeFormCanvas';
import TemplatesPanel from '@/components/canva-editor/TemplatesPanel';
import ElementsPanel from '@/components/canva-editor/ElementsPanel';
import TextPanel from '@/components/canva-editor/TextPanel';
import UploadsPanel from '@/components/canva-editor/UploadsPanel';
import SettingsPanel from '@/components/canva-editor/SettingsPanel';
import PropertiesPanel from '@/components/canva-editor/PropertiesPanel';
import KeyboardShortcutsOverlay from '@/components/canva-editor/KeyboardShortcutsOverlay';
import { useCanvasHistory } from '@/components/canva-editor/useCanvasHistory';
import { useKeyboardShortcuts, setClipboard, getClipboard } from '@/components/canva-editor/useKeyboardShortcuts';
import { type CanvasElement, type CanvasSize, CANVAS_SIZES } from '@/components/canva-editor/types';
import { type TemplateInfo } from '@/components/canva-editor/templateDefinitions';
import { type AssetItem } from '@/components/canva-editor/types';

// Keep legacy exports for other components that import from this file
export interface EditorFields {
  headline: string;
  subheadline: string;
  cta: string;
  price: string;
  courseName: string;
  credibility: string;
  bodyText: string;
}

export interface SelectedCharacter {
  key: string;
  name: string;
  image: string;
  position: 'left' | 'right' | 'bottom';
  size?: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  zIndex?: number;
  expressionId?: string;
  personId?: string;
}

interface TemplateRecord {
  id: string;
  name: string;
  category: string;
  platform: string;
  dimensions: { width: number; height: number };
  aspectRatio: string;
  useCase: string;
  description: string;
  previewColors: string[];
}

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;
  const { showToast } = useToast();

  const template = useMemo(() => {
    return templatesData.templates.find((t) => t.id === templateId) as TemplateRecord | undefined;
  }, [templateId]);

  // ── Canvas state with undo/redo ──
  const {
    elements,
    setElements,
    updateWithoutHistory,
    undo,
    redo,
    resetHistory,
    toastMessage,
  } = useCanvasHistory([]);

  // ── Selection state ──
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── Canvas size (multi-size support) ──
  const [activeSize, setActiveSize] = useState<CanvasSize>(CANVAS_SIZES[0]);
  const [perSizeElements, setPerSizeElements] = useState<Record<string, CanvasElement[]>>({});

  // ── Sidebar state ──
  const [activeTab, setActiveTab] = useState<SidebarTab | null>('templates');
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  // ── Zoom ──
  const [zoom, setZoom] = useState(100);

  // ── Text editing mode (disables keyboard shortcuts) ──
  const [isTextEditing, setIsTextEditing] = useState(false);

  // ── Shortcuts overlay ──
  const [showShortcuts, setShowShortcuts] = useState(false);

  // ── Export state ──
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ── Per-size elements helpers ──
  const handleSizeChange = useCallback((newSize: CanvasSize) => {
    // Save current size's elements
    setPerSizeElements(prev => ({ ...prev, [activeSize.id]: structuredClone(elements) }));
    // Load new size's elements (or empty if never edited)
    const saved = perSizeElements[newSize.id];
    if (saved) {
      resetHistory(saved);
    } else {
      resetHistory(elements); // Copy current elements as starting point
    }
    setActiveSize(newSize);
    setSelectedIds([]);
  }, [activeSize.id, elements, perSizeElements, resetHistory]);

  // ── Template loading ──
  const handleSelectTemplate = useCallback((tmpl: TemplateInfo) => {
    const newElements = tmpl.createElements();
    resetHistory(newElements);
    setActiveTemplateId(tmpl.id);
    setSelectedIds([]);
    showToast('success', 'Template Loaded', `"${tmpl.shortLabel}" loaded onto canvas`);
  }, [resetHistory, showToast]);

  // ── Element drop from sidebar ──
  const handleElementDragStart = useCallback((item: AssetItem, e: React.DragEvent) => {
    const elementData = JSON.stringify(item.element);
    e.dataTransfer.setData('application/sigma-element', elementData);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  // ── Upload image drop ──
  const handleUploadDragStart = useCallback((dataUrl: string, width: number, height: number, e: React.DragEvent) => {
    const elementData = JSON.stringify({
      type: 'image',
      width: Math.min(width, 500),
      height: Math.min(height, 500),
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      content: dataUrl,
      imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'none' },
    });
    e.dataTransfer.setData('application/sigma-element', elementData);
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  // ── Add text from TextPanel ──
  const handleAddText = useCallback((preset: 'heading' | 'subheading' | 'body', content?: string) => {
    const maxZ = elements.length > 0 ? Math.max(...elements.map(e => e.zIndex)) : 0;
    const configs = {
      heading: { fontSize: 72, fontWeight: 900, w: 600, h: 100, text: content || 'Add heading' },
      subheading: { fontSize: 36, fontWeight: 700, w: 500, h: 60, text: content || 'Add subheading' },
      body: { fontSize: 20, fontWeight: 400, w: 400, h: 50, text: content || 'Add body text' },
    };
    const cfg = configs[preset];
    const newEl: CanvasElement = {
      id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: 'text',
      x: (activeSize.width - cfg.w) / 2,
      y: (activeSize.height - cfg.h) / 2,
      width: cfg.w,
      height: cfg.h,
      rotation: 0,
      opacity: 1,
      zIndex: maxZ + 1,
      locked: false,
      visible: true,
      content: cfg.text,
      textStyle: {
        fontFamily: 'Poppins',
        fontSize: cfg.fontSize,
        fontWeight: cfg.fontWeight,
        fontStyle: 'normal',
        color: '#FFFFFF',
        textAlign: 'left',
        letterSpacing: preset === 'heading' ? -1 : 0,
        lineHeight: preset === 'heading' ? 0.92 : 1.4,
        textTransform: preset === 'heading' ? 'uppercase' : 'none',
        scaleX: preset === 'heading' ? 0.74 : 1,
      },
    };
    setElements([...elements, newEl]);
    setSelectedIds([newEl.id]);
  }, [elements, activeSize, setElements]);

  // ── Properties panel update ──
  const handlePropertyUpdate = useCallback((updates: Partial<CanvasElement>) => {
    if (selectedIds.length !== 1) return;
    const id = selectedIds[0];
    const updated = elements.map(el => el.id === id ? { ...el, ...updates } : el);
    setElements(updated);
  }, [elements, selectedIds, setElements]);

  // ── Export (PNG) ──
  const handleExport = useCallback(async () => {
    const canvasEl = canvasRef.current;
    if (!canvasEl || isExporting) return;
    setIsExporting(true);
    try {
      const htmlToImage = await import('html-to-image');
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise(r => setTimeout(r, 150));
      const dataUrl = await htmlToImage.toPng(canvasEl, {
        quality: 1.0,
        pixelRatio: 2,
        width: activeSize.width,
        height: activeSize.height,
        style: { transform: 'none', overflow: 'hidden' },
      });
      const link = document.createElement('a');
      const name = activeTemplateId || 'canvas';
      link.download = `${name}_${activeSize.width}x${activeSize.height}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('success', 'Export Complete', `Saved as ${activeSize.width}\u00d7${activeSize.height} PNG`);
    } catch (error) {
      showToast('error', 'Export Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsExporting(false);
    }
  }, [activeSize, activeTemplateId, isExporting, showToast]);

  // ── Export All Sizes (ZIP) ──
  const handleExportAll = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      showToast('info', 'Exporting', 'Generating all sizes...');
      const JSZip = (await import('jszip')).default;
      const htmlToImage = await import('html-to-image');
      const zip = new JSZip();
      const name = activeTemplateId || 'canvas';

      // Save current elements before switching
      const currentElements = structuredClone(elements);

      for (const size of CANVAS_SIZES) {
        // Get elements for this size
        const sizeElements = size.id === activeSize.id
          ? currentElements
          : (perSizeElements[size.id] || currentElements);

        // We export the current canvas element - need to temporarily resize
        const canvasEl = canvasRef.current;
        if (!canvasEl) continue;

        const origW = canvasEl.style.width;
        const origH = canvasEl.style.height;
        canvasEl.style.width = `${size.width}px`;
        canvasEl.style.height = `${size.height}px`;

        if (document.fonts?.ready) await document.fonts.ready;
        await new Promise(r => setTimeout(r, 100));

        try {
          const dataUrl = await htmlToImage.toPng(canvasEl, {
            quality: 1.0,
            pixelRatio: 1,
            width: size.width,
            height: size.height,
            style: { transform: 'none', overflow: 'hidden' },
          });
          const base64 = dataUrl.split(',')[1];
          zip.file(`${name}_${size.width}x${size.height}.png`, base64, { base64: true });
        } finally {
          canvasEl.style.width = origW;
          canvasEl.style.height = origH;
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${name}-all-sizes.zip`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('success', 'Download Complete', `${CANVAS_SIZES.length} sizes exported`);
    } catch (error) {
      showToast('error', 'Export Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, elements, activeSize, activeTemplateId, perSizeElements, showToast]);

  // ── Keyboard shortcut actions ──
  const shortcutActions = useMemo(() => ({
    undo,
    redo,
    deleteSelected: () => {
      if (selectedIds.length === 0) return;
      setElements(elements.filter(el => !selectedIds.includes(el.id)));
      setSelectedIds([]);
    },
    selectAll: () => setSelectedIds(elements.map(el => el.id)),
    deselectAll: () => setSelectedIds([]),
    copySelected: () => {
      const copied = elements.filter(el => selectedIds.includes(el.id));
      setClipboard(copied);
      showToast('info', 'Copied', `${copied.length} element(s)`);
    },
    paste: () => {
      const pasted = getClipboard();
      if (pasted.length === 0) return;
      const maxZ = Math.max(...elements.map(e => e.zIndex), 0);
      const newEls = pasted.map((el, i) => ({
        ...el,
        id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        x: el.x + 10,
        y: el.y + 10,
        zIndex: maxZ + i + 1,
      }));
      setElements([...elements, ...newEls]);
      setSelectedIds(newEls.map(e => e.id));
    },
    duplicateSelected: () => {
      const maxZ = Math.max(...elements.map(e => e.zIndex), 0);
      const duped = elements
        .filter(el => selectedIds.includes(el.id))
        .map((el, i) => ({
          ...el,
          id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          x: el.x + 10,
          y: el.y + 10,
          zIndex: maxZ + i + 1,
        }));
      setElements([...elements, ...duped]);
      setSelectedIds(duped.map(e => e.id));
    },
    nudge: (dx: number, dy: number) => {
      const updated = elements.map(el =>
        selectedIds.includes(el.id) ? { ...el, x: el.x + dx, y: el.y + dy } : el
      );
      setElements(updated);
    },
    bringForward: () => {
      if (selectedIds.length === 0) return;
      const updated = elements.map(el =>
        selectedIds.includes(el.id) ? { ...el, zIndex: el.zIndex + 1 } : el
      );
      setElements(updated);
    },
    sendBackward: () => {
      if (selectedIds.length === 0) return;
      const updated = elements.map(el =>
        selectedIds.includes(el.id) ? { ...el, zIndex: el.zIndex - 1 } : el
      );
      setElements(updated);
    },
    bringToFront: () => {
      if (selectedIds.length === 0) return;
      const maxZ = Math.max(...elements.map(e => e.zIndex));
      const updated = elements.map(el =>
        selectedIds.includes(el.id) ? { ...el, zIndex: maxZ + 1 } : el
      );
      setElements(updated);
    },
    sendToBack: () => {
      if (selectedIds.length === 0) return;
      const minZ = Math.min(...elements.map(e => e.zIndex));
      const updated = elements.map(el =>
        selectedIds.includes(el.id) ? { ...el, zIndex: minZ - 1 } : el
      );
      setElements(updated);
    },
    groupSelected: () => {
      // Simplified grouping - just toast for now
      showToast('info', 'Group', 'Grouping coming soon');
    },
    ungroupSelected: () => {
      showToast('info', 'Ungroup', 'Ungrouping coming soon');
    },
    toggleLock: () => {
      const updated = elements.map(el =>
        selectedIds.includes(el.id) ? { ...el, locked: !el.locked } : el
      );
      setElements(updated);
    },
    zoomIn: () => setZoom(z => Math.min(200, z + 25)),
    zoomOut: () => setZoom(z => Math.max(25, z - 25)),
    zoomToFit: () => setZoom(100),
    exportCanvas: handleExport,
    toggleShortcutsHelp: () => setShowShortcuts(s => !s),
  }), [elements, selectedIds, undo, redo, setElements, showToast, handleExport]);

  useKeyboardShortcuts(shortcutActions, isTextEditing, selectedIds.length > 0);

  // ── Selected element for properties panel ──
  const selectedElement = selectedIds.length === 1
    ? elements.find(el => el.id === selectedIds[0]) ?? null
    : null;

  // ── Not found ──
  if (!template) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <h1 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
            Template Not Found
          </h1>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 24 }}>
            The template doesn&apos;t exist or was removed.
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '10px 24px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#3B82F6',
              color: '#fff',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ── Render panel content based on active tab ──
  const renderPanelContent = () => {
    switch (activeTab) {
      case 'templates':
        return <TemplatesPanel onSelectTemplate={handleSelectTemplate} activeTemplateId={activeTemplateId} />;
      case 'elements':
        return <ElementsPanel onDragStart={handleElementDragStart} />;
      case 'text':
        return <TextPanel onAddText={handleAddText} />;
      case 'uploads':
        return <UploadsPanel onDragStart={handleUploadDragStart} />;
      case 'settings':
        return (
          <SettingsPanel
            activeSize={activeSize}
            onSizeChange={handleSizeChange}
            onExport={handleExport}
            onExportAll={handleExportAll}
            isExporting={isExporting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#1a1a2e' }}>
      {/* Top Header Bar */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        height: 48,
        backgroundColor: '#151528',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', fontFamily: 'Manrope, sans-serif', fontSize: 13,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Back
          </button>
          <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)' }} />
          <div>
            <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff' }}>
              {activeTemplateId
                ? `AI Engineering \u2014 ${activeTemplateId.replace('concept-', '').toUpperCase()}`
                : template.name
              }
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Size tabs */}
          {CANVAS_SIZES.map(size => (
            <button
              key={size.id}
              onClick={() => handleSizeChange(size)}
              style={{
                padding: '4px 10px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: activeSize.id === size.id ? 'rgba(59,130,246,0.2)' : 'transparent',
                color: activeSize.id === size.id ? '#3B82F6' : 'rgba(255,255,255,0.4)',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
              title={size.description}
            >
              {size.width}\u00d7{size.height}
            </button>
          ))}
          <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
          {/* Download button */}
          <button
            onClick={handleExport}
            disabled={isExporting}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: '#3B82F6',
              color: '#fff',
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              cursor: isExporting ? 'not-allowed' : 'pointer',
              opacity: isExporting ? 0.6 : 1,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {isExporting ? 'Exporting...' : 'Download'}
          </button>
        </div>
      </header>

      {/* Main Editor Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* Canva-Style Sidebar */}
        <CanvaSidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {renderPanelContent()}
        </CanvaSidebar>

        {/* Canvas Area */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <FreeFormCanvas
            elements={elements}
            selectedIds={selectedIds}
            canvasWidth={activeSize.width}
            canvasHeight={activeSize.height}
            zoom={zoom}
            onElementsChange={setElements}
            onElementsUpdate={updateWithoutHistory}
            onSelectionChange={setSelectedIds}
            onTextEditStart={() => setIsTextEditing(true)}
            onTextEditEnd={() => setIsTextEditing(false)}
            canvasExportRef={canvasRef}
          />

          {/* Properties Panel (floating right) */}
          {selectedElement && !isTextEditing && (
            <PropertiesPanel
              element={selectedElement}
              onUpdate={handlePropertyUpdate}
            />
          )}
        </div>
      </div>

      {/* Undo/Redo Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 20px',
          borderRadius: 8,
          backgroundColor: '#1e1e2e',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.7)',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 13,
          fontWeight: 600,
          zIndex: 300,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          {toastMessage}
        </div>
      )}

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsOverlay
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
