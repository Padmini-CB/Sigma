'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import templatesData from '@/data/templates.json';
import { useToast } from '@/components/Toast';

// Canva-style editor components
import CanvaSidebar, { type SidebarTab } from '@/components/canva-editor/CanvaSidebar';
import FreeFormCanvas from '@/components/canva-editor/FreeFormCanvas';
import TemplatesPanel from '@/components/canva-editor/TemplatesPanel';
import ElementsPanel from '@/components/canva-editor/ElementsPanel';
import TextPanel from '@/components/canva-editor/TextPanel';
import UploadsPanel from '@/components/canva-editor/UploadsPanel';
import EraserPanel, { type EraserMode } from '@/components/canva-editor/EraserPanel';
import SettingsPanel from '@/components/canva-editor/SettingsPanel';
import BackgroundsPanel from '@/components/canva-editor/BackgroundsPanel';
import PropertiesPanel from '@/components/canva-editor/PropertiesPanel';
import MagicEraserOverlay from '@/components/canva-editor/MagicEraserOverlay';
import KeyboardShortcutsOverlay from '@/components/canva-editor/KeyboardShortcutsOverlay';
import { useCanvasHistory } from '@/components/canva-editor/useCanvasHistory';
import { useKeyboardShortcuts, setClipboard, getClipboard } from '@/components/canva-editor/useKeyboardShortcuts';
import { type CanvasElement, type CanvasSize, CANVAS_SIZES } from '@/components/canva-editor/types';
import { type TemplateInfo } from '@/components/canva-editor/templateDefinitions';
import { type AssetItem } from '@/components/canva-editor/types';
import { useAutoSave } from '@/components/canva-editor/useAutoSave';
import SaveIndicator from '@/components/canva-editor/SaveIndicator';

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
  const searchParams = useSearchParams();
  const templateId = params.id as string;
  const bootcampFilter = searchParams.get('bootcamp') || null;
  const { showToast } = useToast();
  const { data: session } = useSession();

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

  // ── Restore saved design from localStorage on mount ──
  const hasRestoredRef = useRef(false);
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;
    try {
      const saved = localStorage.getItem(`sigma-creative-${templateId}`);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.elements && data.elements.length > 0) {
          resetHistory(data.elements);
        }
        if (data.perSizeElements) {
          setPerSizeElements(data.perSizeElements);
        }
        if (data.activeSize) {
          const matchingSize = CANVAS_SIZES.find(s => s.id === data.activeSize.id);
          if (matchingSize) setActiveSize(matchingSize);
        }
      }
    } catch { /* ignore corrupt data */ }
  }, [templateId, resetHistory]);

  // ── Selection state ──
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // ── Canvas size (multi-size support) ──
  const [activeSize, setActiveSize] = useState<CanvasSize>(CANVAS_SIZES[0]);
  const [perSizeElements, setPerSizeElements] = useState<Record<string, CanvasElement[]>>({});

  // ── Canvas background ──
  const [canvasBackground, setCanvasBackground] = useState<string>(() => {
    if (typeof window === 'undefined') return '#181830';
    try {
      const saved = localStorage.getItem(`sigma-creative-${templateId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.canvasBackground) return parsed.canvasBackground;
      }
    } catch { /* ignore */ }
    return '#181830';
  });

  // ── Sidebar state ──
  const [activeTab, setActiveTab] = useState<SidebarTab | null>('templates');
  const [activeTemplateId, setActiveTemplateId] = useState<string | null>(null);

  // ── Iframe mode (for HTML templates) ──
  const [iframeMode, setIframeMode] = useState(false);
  const [iframeHtmlPath, setIframeHtmlPath] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Zoom ──
  const [zoom, setZoom] = useState(100);

  // ── Text editing mode (disables keyboard shortcuts) ──
  const [isTextEditing, setIsTextEditing] = useState(false);

  // ── Eraser tool ──
  const [eraserBrushSize, setEraserBrushSize] = useState(50);
  const [eraserSoftness, setEraserSoftness] = useState(70);
  const [eraserOpacity, setEraserOpacity] = useState(100);
  const [eraserModeType, setEraserModeType] = useState<EraserMode>('brush');
  const [magicTolerance, setMagicTolerance] = useState(25);
  const [magicRadius, setMagicRadius] = useState(100);
  const [magicSoftness, setMagicSoftness] = useState(30);
  const eraserMode = false; // Eraser disabled — Coming Soon

  // ── Background Remover / Magic Eraser state ──
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [magicEraserActive, setMagicEraserActive] = useState(false);

  // ── Editable project name ──
  const [projectName, setProjectName] = useState<string>(() => {
    if (typeof window === 'undefined') return template?.name ?? templateId;
    try {
      const saved = localStorage.getItem(`sigma-creative-${templateId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.projectName) return parsed.projectName;
      }
    } catch { /* ignore */ }
    return template?.name ?? templateId;
  });
  const [isEditingName, setIsEditingName] = useState(false);

  // ── Auto-save ──
  const { status: saveStatus, conflictWarning, dismissConflict, saveNow } = useAutoSave({
    creativeId: templateId,
    elements,
    activeSize,
    perSizeElements,
    projectName,
    canvasBackground,
  });

  // ── Shortcuts overlay ──
  const [showShortcuts, setShowShortcuts] = useState(false);

  // ── Export state ──
  const [isExporting, setIsExporting] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [jpegQuality, setJpegQuality] = useState(95);
  const [exportSizes, setExportSizes] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    CANVAS_SIZES.forEach((s, i) => { initial[s.id] = i < 2; }); // first 2 checked
    return initial;
  });
  const canvasRef = useRef<HTMLDivElement>(null);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  // ── Close download menu on click outside ──
  useEffect(() => {
    if (!showDownloadMenu) return;
    const handler = (e: MouseEvent) => {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(e.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDownloadMenu]);

  // ── Auto-reflow elements to fit a new canvas size ──
  const reflowElements = useCallback((srcElements: CanvasElement[], fromW: number, fromH: number, toW: number, toH: number): CanvasElement[] => {
    if (fromW === toW && fromH === toH) return structuredClone(srcElements);
    const scaleX = toW / fromW;
    const scaleY = toH / fromH;
    const fontScale = Math.min(scaleX, scaleY);

    return srcElements.map(el => {
      const result: CanvasElement = {
        ...structuredClone(el),
        x: Math.round(el.x * scaleX),
        y: Math.round(el.y * scaleY),
        width: Math.max(20, Math.round(el.width * scaleX)),
        height: Math.max(20, Math.round(el.height * scaleY)),
      };

      // Scale font sizes proportionally
      if (el.type === 'text' && result.textStyle) {
        result.textStyle = { ...result.textStyle, fontSize: Math.max(6, Math.round(result.textStyle.fontSize * fontScale)) };
      } else if (el.type === 'button' && result.buttonStyle) {
        result.buttonStyle = { ...result.buttonStyle, fontSize: Math.max(6, Math.round(result.buttonStyle.fontSize * fontScale)) };
      } else if (el.type === 'badge' && result.badgeStyle) {
        result.badgeStyle = { ...result.badgeStyle, fontSize: Math.max(6, Math.round(result.badgeStyle.fontSize * fontScale)) };
      } else if (el.type === 'strip' && result.stripStyle) {
        result.stripStyle = { ...result.stripStyle, fontSize: Math.max(6, Math.round(result.stripStyle.fontSize * fontScale)) };
      }

      return result;
    });
  }, []);

  // ── Per-size elements helpers ──
  const handleSizeChange = useCallback((newSize: CanvasSize) => {
    // Save current size's elements
    setPerSizeElements(prev => ({ ...prev, [activeSize.id]: structuredClone(elements) }));
    // Load new size's elements (or auto-reflow if never edited)
    const saved = perSizeElements[newSize.id];
    if (saved) {
      resetHistory(saved);
    } else {
      // Auto-reflow: scale all elements to fit the new canvas dimensions
      const reflowed = reflowElements(elements, activeSize.width, activeSize.height, newSize.width, newSize.height);
      resetHistory(reflowed);
    }
    setActiveSize(newSize);
    setSelectedIds([]);
  }, [activeSize, elements, perSizeElements, resetHistory, reflowElements]);

  // ── Template loading ──
  const handleSelectTemplate = useCallback((tmpl: TemplateInfo) => {
    // Always use canvas element mode so template elements are fully interactive
    // (draggable, resizable, editable, selectable via Ctrl+A, undo/redo, etc.)
    setIframeMode(false);
    setIframeHtmlPath(null);

    // Auto-switch canvas size if the template specifies a target size
    if (tmpl.targetSize) {
      const matchingSize = CANVAS_SIZES.find(
        s => s.width === tmpl.targetSize!.width && s.height === tmpl.targetSize!.height
      );
      if (matchingSize && matchingSize.id !== activeSize.id) {
        setPerSizeElements(prev => ({ ...prev, [activeSize.id]: structuredClone(elements) }));
        setActiveSize(matchingSize);
      }
    }

    const newElements = tmpl.createElements();
    resetHistory(newElements);
    setActiveTemplateId(tmpl.id);
    setSelectedIds([]);
    showToast('success', 'Template Loaded', `"${tmpl.shortLabel}" loaded onto canvas`);
  }, [resetHistory, showToast, activeSize, elements]);

  // ── Save-triggering wrapper for element changes (drag/drop, move, resize) ──
  const setElementsAndSave = useCallback((newElements: CanvasElement[]) => {
    setElements(newElements);
    saveNow();
  }, [setElements, saveNow]);

  // ── Element drop from sidebar ──
  const handleElementDragStart = useCallback((item: AssetItem, e: React.DragEvent) => {
    const elementData = JSON.stringify(item.element);
    e.dataTransfer.setData('application/sigma-element', elementData);
    // Also set text/html for iframe mode (HTML components can be dropped into the iframe)
    if (item.htmlSnippet) {
      e.dataTransfer.setData('text/html', item.htmlSnippet);
    }
    e.dataTransfer.effectAllowed = 'copy';
  }, []);

  // ── Click-to-add element from sidebar ──
  const handleClickAddElement = useCallback((item: AssetItem) => {
    // Always add to FreeFormCanvas. Exit iframe mode if active so the canvas renders.
    if (iframeMode) {
      setIframeMode(false);
      setIframeHtmlPath(null);
    }

    const maxZ = elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) : 0;
    const w = item.element.width || 200;
    const h = item.element.height || 200;
    const newEl: CanvasElement = {
      ...item.element,
      id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      x: Math.round(activeSize.width / 2 - w / 2),
      y: Math.round(activeSize.height / 2 - h / 2),
      zIndex: maxZ + 1,
    } as CanvasElement;
    setElements([...elements, newEl]);
    setSelectedIds([newEl.id]);
    showToast('success', 'Element Added', `"${item.label}" added to canvas`);
  }, [iframeMode, elements, activeSize, setElements, showToast]);

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

  // ── Upload click-to-add ──
  const handleUploadClickAdd = useCallback((dataUrl: string, width: number, height: number) => {
    if (iframeMode) {
      setIframeMode(false);
      setIframeHtmlPath(null);
    }
    const maxZ = elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) : 0;
    const maxDim = 400;
    let w = Math.min(width, 500);
    let h = Math.min(height, 500);
    if (w > maxDim || h > maxDim) {
      const ratio = Math.min(maxDim / w, maxDim / h);
      w = Math.round(w * ratio);
      h = Math.round(h * ratio);
    }
    const newEl: CanvasElement = {
      id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: 'image',
      x: Math.round(activeSize.width / 2 - w / 2),
      y: Math.round(activeSize.height / 2 - h / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      zIndex: maxZ + 1,
      locked: false,
      visible: true,
      content: dataUrl,
      imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'none' },
    };
    setElements([...elements, newEl]);
    setSelectedIds([newEl.id]);
    showToast('success', 'Image Added', 'Uploaded image added to canvas');
  }, [iframeMode, elements, activeSize, setElements, showToast]);

  // ── File drop on canvas ──
  const handleFileDrop = useCallback((dataUrl: string, width: number, height: number, x: number, y: number) => {
    if (iframeMode) {
      setIframeMode(false);
      setIframeHtmlPath(null);
    }
    const maxZ = elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) : 0;
    const newEl: CanvasElement = {
      id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: 'image',
      x, y,
      width, height,
      rotation: 0,
      opacity: 1,
      zIndex: maxZ + 1,
      locked: false,
      visible: true,
      content: dataUrl,
      imageStyle: { objectFit: 'contain', borderRadius: 0, maskType: 'none' },
    };
    setElements([...elements, newEl]);
    setSelectedIds([newEl.id]);
    showToast('success', 'Image Added', 'File dropped onto canvas');
  }, [iframeMode, elements, setElements, showToast]);

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
    const updated = elements.map(el => {
      if (el.id !== id) return el;
      const merged = { ...el, ...updates };
      // Auto-resize when content text changes
      if (updates.content !== undefined) {
        const content = updates.content || '';
        if (merged.type === 'button' && merged.buttonStyle) {
          const bs = merged.buttonStyle;
          const charWidth = (bs.fontSize ?? 16) * 0.62;
          const textWidth = content.length * charWidth;
          const newWidth = Math.max(150, Math.ceil(textWidth + (bs.paddingX ?? 24) * 2));
          merged.width = Math.max(merged.width, newWidth);
        } else if (merged.type === 'badge' && merged.badgeStyle) {
          const bs = merged.badgeStyle;
          const charWidth = (bs.fontSize ?? 14) * 0.62;
          const textWidth = content.length * charWidth;
          const newWidth = Math.max(100, Math.ceil(textWidth + (bs.paddingX ?? 16) * 2));
          merged.width = Math.max(merged.width, newWidth);
        } else if (merged.type === 'strip' && merged.stripStyle) {
          const ss = merged.stripStyle;
          const charWidth = (ss.fontSize ?? 14) * 0.62;
          const textWidth = content.length * charWidth;
          merged.width = Math.max(merged.width, Math.ceil(textWidth + (ss.paddingX ?? 16) * 2));
        }
      }
      // Auto-resize text elements when font properties change
      if (merged.type === 'text' && updates.textStyle) {
        const ts = merged.textStyle!;
        const fontSize = ts.fontSize ?? 16;
        const lineHeight = ts.lineHeight ?? 1.2;
        // Estimate lines from content
        const content = merged.content || '';
        const lines = content.split('\n');
        const charWidth = fontSize * 0.6 * (ts.scaleX ?? 1);
        const maxLineChars = Math.max(...lines.map(l => l.length), 1);
        const textWidth = maxLineChars * charWidth;
        // Auto-grow: only expand, never shrink below current size
        const lineCount = Math.max(lines.length, Math.ceil(textWidth / Math.max(merged.width, 1)));
        const neededHeight = Math.max(40, Math.ceil(fontSize * lineHeight * lineCount + 8));
        if (neededHeight > merged.height) {
          merged.height = neededHeight;
        }
      }
      // Auto-resize buttons when font properties change
      if (merged.type === 'button' && updates.buttonStyle) {
        const bs = merged.buttonStyle!;
        const fontSize = bs.fontSize ?? 16;
        const paddingX = bs.paddingX ?? 24;
        const paddingY = bs.paddingY ?? 12;
        const charWidth = fontSize * 0.62;
        const textWidth = (merged.content || '').length * charWidth;
        const newWidth = Math.max(150, Math.ceil(textWidth + paddingX * 2));
        const newHeight = Math.max(40, Math.ceil(fontSize * 1.6 + paddingY * 2));
        merged.width = Math.max(merged.width, newWidth);
        merged.height = Math.max(merged.height, newHeight);
      }
      // Auto-resize badges when font properties change
      if (merged.type === 'badge' && updates.badgeStyle) {
        const bs = merged.badgeStyle!;
        const fontSize = bs.fontSize ?? 14;
        const paddingX = bs.paddingX ?? 16;
        const paddingY = bs.paddingY ?? 6;
        const charWidth = fontSize * 0.62;
        const textWidth = (merged.content || '').length * charWidth;
        const newWidth = Math.max(100, Math.ceil(textWidth + paddingX * 2));
        const newHeight = Math.max(30, Math.ceil(fontSize * 1.6 + paddingY * 2));
        merged.width = Math.max(merged.width, newWidth);
        merged.height = Math.max(merged.height, newHeight);
      }
      // Auto-resize strips when font properties change
      if (merged.type === 'strip' && updates.stripStyle) {
        const ss = merged.stripStyle!;
        const fontSize = ss.fontSize ?? 15;
        const paddingY = ss.paddingY ?? 10;
        const newHeight = Math.max(40, Math.ceil(fontSize * 1.6 + paddingY * 2));
        merged.height = Math.max(merged.height, newHeight);
      }
      return merged;
    });
    setElements(updated);
  }, [elements, selectedIds, setElements]);

  // ── Background Remover handler ──
  const handleRemoveBackground = useCallback(async () => {
    if (selectedIds.length !== 1) return;
    const el = elements.find(e => e.id === selectedIds[0]);
    if (!el || el.type !== 'image') return;

    setIsRemovingBg(true);
    try {
      // Convert image src to base64 data URL if it's a relative path
      let dataUrl = el.content;
      if (!dataUrl.startsWith('data:')) {
        const resp = await fetch(el.content);
        const blob = await resp.blob();
        dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
      }

      const res = await fetch('/api/remove-bg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataUrl }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Background removal failed');
      }

      const { image } = await res.json();
      const updated = elements.map(e =>
        e.id === el.id ? { ...e, content: image } : e
      );
      setElements(updated);
      showToast('success', 'Background removed');
    } catch (err) {
      console.error('Background removal failed:', err);
      showToast('error', 'Background removal failed');
    } finally {
      setIsRemovingBg(false);
    }
  }, [elements, selectedIds, setElements, showToast]);

  // ── Magic Eraser handlers ──
  const handleStartMagicEraser = useCallback(() => {
    if (selectedIds.length !== 1) return;
    const el = elements.find(e => e.id === selectedIds[0]);
    if (!el || el.type !== 'image') return;
    setMagicEraserActive(true);
  }, [elements, selectedIds]);

  const handleApplyMagicEraser = useCallback((dataUrl: string) => {
    if (selectedIds.length !== 1) return;
    const id = selectedIds[0];
    const updated = elements.map(e =>
      e.id === id ? { ...e, content: dataUrl } : e
    );
    setElements(updated);
    setMagicEraserActive(false);
    showToast('success', 'Eraser applied');
  }, [elements, selectedIds, setElements, showToast]);

  const handleCancelMagicEraser = useCallback(() => {
    setMagicEraserActive(false);
  }, []);

  // ── Export helper: render current canvas as dataUrl ──
  const renderCanvasDataUrl = useCallback(async (format: 'png' | 'jpeg', quality: number): Promise<string> => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) throw new Error('No canvas');
    const htmlToImage = await import('html-to-image');
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise(r => setTimeout(r, 150));
    if (format === 'jpeg') {
      return await htmlToImage.toJpeg(canvasEl, {
        quality: quality / 100,
        pixelRatio: 2,
        width: activeSize.width,
        height: activeSize.height,
        backgroundColor: '#0D1117',
        style: { transform: 'none', overflow: 'hidden' },
      });
    }
    return await htmlToImage.toPng(canvasEl, {
      quality: 1.0,
      pixelRatio: 2,
      width: activeSize.width,
      height: activeSize.height,
      style: { transform: 'none', overflow: 'hidden' },
    });
  }, [activeSize]);

  // ── Export current size ──
  const handleExport = useCallback(async (fmt?: 'png' | 'jpeg') => {
    if (isExporting) return;
    setIsExporting(true);
    setShowDownloadMenu(false);
    const format = fmt || exportFormat;
    try {
      const dataUrl = await renderCanvasDataUrl(format, jpegQuality);
      const link = document.createElement('a');
      const name = activeTemplateId || 'canvas';
      link.download = `${name}_${activeSize.width}x${activeSize.height}.${format === 'jpeg' ? 'jpg' : 'png'}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('success', 'Export Complete', `Saved as ${activeSize.width}\u00d7${activeSize.height} ${format.toUpperCase()}`);
    } catch (error) {
      showToast('error', 'Export Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsExporting(false);
    }
  }, [activeSize, activeTemplateId, isExporting, exportFormat, jpegQuality, showToast, renderCanvasDataUrl]);

  // ── Export selected sizes (zip if multiple) ──
  const handleExportSelected = useCallback(async () => {
    if (isExporting) return;
    const selectedSizeIds = Object.entries(exportSizes).filter(([, v]) => v).map(([k]) => k);
    if (selectedSizeIds.length === 0) {
      showToast('error', 'No Sizes', 'Select at least one size to download');
      return;
    }
    // If only the current size is selected, just do a single export
    if (selectedSizeIds.length === 1 && selectedSizeIds[0] === activeSize.id) {
      handleExport();
      return;
    }
    setIsExporting(true);
    setShowDownloadMenu(false);
    try {
      showToast('info', 'Exporting', `Generating ${selectedSizeIds.length} size(s)...`);
      const JSZip = (await import('jszip')).default;
      const htmlToImage = await import('html-to-image');
      const zip = new JSZip();
      const name = activeTemplateId || 'canvas';
      const ext = exportFormat === 'jpeg' ? 'jpg' : 'png';
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;

      for (const sizeId of selectedSizeIds) {
        const size = CANVAS_SIZES.find(s => s.id === sizeId);
        if (!size) continue;

        const origW = canvasEl.style.width;
        const origH = canvasEl.style.height;
        canvasEl.style.width = `${size.width}px`;
        canvasEl.style.height = `${size.height}px`;
        if (document.fonts?.ready) await document.fonts.ready;
        await new Promise(r => setTimeout(r, 100));

        try {
          let dataUrl: string;
          if (exportFormat === 'jpeg') {
            dataUrl = await htmlToImage.toJpeg(canvasEl, {
              quality: jpegQuality / 100,
              pixelRatio: 2,
              width: size.width,
              height: size.height,
              backgroundColor: '#0D1117',
              style: { transform: 'none', overflow: 'hidden' },
            });
          } else {
            dataUrl = await htmlToImage.toPng(canvasEl, {
              quality: 1.0,
              pixelRatio: 2,
              width: size.width,
              height: size.height,
              style: { transform: 'none', overflow: 'hidden' },
            });
          }
          const base64 = dataUrl.split(',')[1];
          zip.file(`${name}_${size.width}x${size.height}.${ext}`, base64, { base64: true });
        } finally {
          canvasEl.style.width = origW;
          canvasEl.style.height = origH;
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${name}-${selectedSizeIds.length}sizes.zip`;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast('success', 'Download Complete', `${selectedSizeIds.length} sizes exported as ${exportFormat.toUpperCase()}`);
    } catch (error) {
      showToast('error', 'Export Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, exportSizes, exportFormat, jpegQuality, activeSize, activeTemplateId, showToast, handleExport]);

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

  useKeyboardShortcuts(shortcutActions, isTextEditing || eraserMode, selectedIds.length > 0);

  // ── Selected element for properties panel ──
  const selectedElement = selectedIds.length === 1
    ? elements.find(el => el.id === selectedIds[0]) ?? null
    : null;

  // ── Compute selected element screen rect for floating properties panel ──
  const [elementScreenRect, setElementScreenRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  useEffect(() => {
    if (!selectedElement || !canvasRef.current) {
      setElementScreenRect(null);
      return;
    }
    const update = () => {
      const canvasEl = canvasRef.current;
      if (!canvasEl) return;
      const canvasRect = canvasEl.getBoundingClientRect();
      const scale = zoom / 100;
      // The canvas div has transform: scale(scale) with transformOrigin: center center
      // canvasRect already reflects the scaled dimensions
      const scaleX = canvasRect.width / canvasEl.offsetWidth;
      const scaleY = canvasRect.height / canvasEl.offsetHeight;
      setElementScreenRect({
        top: canvasRect.top + selectedElement.y * scaleY,
        left: canvasRect.left + selectedElement.x * scaleX,
        width: selectedElement.width * scaleX,
        height: selectedElement.height * scaleY,
      });
    };
    update();
    // Update on scroll/resize
    const workspace = canvasRef.current?.parentElement;
    workspace?.addEventListener('scroll', update);
    window.addEventListener('resize', update);
    return () => {
      workspace?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [selectedElement, zoom, selectedElement?.x, selectedElement?.y, selectedElement?.width, selectedElement?.height]);

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
        return <TemplatesPanel onSelectTemplate={handleSelectTemplate} activeTemplateId={activeTemplateId} bootcamp={bootcampFilter} />;
      case 'elements':
        return <ElementsPanel onDragStart={handleElementDragStart} onClickAdd={handleClickAddElement} />;
      case 'text':
        return <TextPanel onAddText={handleAddText} />;
      case 'uploads':
        return <UploadsPanel onDragStart={handleUploadDragStart} onClickAdd={handleUploadClickAdd} />;
      case 'backgrounds':
        return <BackgroundsPanel activeBackground={canvasBackground} onSelectBackground={(css) => { setCanvasBackground(css); saveNow(); }} />;
      case 'eraser':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.85)', marginBottom: 4 }}>ERASER TOOL</div>
            <div style={{ fontSize: 28, marginBottom: 12 }}>&#128295;</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#3B82F6', marginBottom: 8 }}>Coming Soon</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
              This tool is under development and will be available in the next update.
            </div>
          </div>
        );
      case 'settings':
        return (
          <SettingsPanel
            activeSize={activeSize}
            onSizeChange={handleSizeChange}
            onExport={() => handleExport()}
            onExportAll={handleExportSelected}
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
            {isEditingName ? (
              <input
                autoFocus
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => { setIsEditingName(false); saveNow(); }}
                onKeyDown={(e) => { if (e.key === 'Enter') { setIsEditingName(false); saveNow(); } if (e.key === 'Escape') setIsEditingName(false); }}
                style={{
                  fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(59,130,246,0.5)',
                  borderRadius: 4, padding: '2px 8px', outline: 'none', width: 220,
                }}
              />
            ) : (
              <span
                onClick={() => setIsEditingName(true)}
                title="Click to rename"
                style={{
                  fontFamily: 'Manrope, sans-serif', fontSize: 14, fontWeight: 700, color: '#fff',
                  cursor: 'pointer', padding: '2px 8px', borderRadius: 4,
                  border: '1px solid transparent',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
              >
                {projectName}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Ad Creative size tabs */}
          {CANVAS_SIZES.filter(s => s.category === 'ad-creatives').map(size => (
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
              {size.width}×{size.height}
            </button>
          ))}
          <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
          <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', letterSpacing: 1, textTransform: 'uppercase' as const, whiteSpace: 'nowrap' }}>Banner</span>
          {CANVAS_SIZES.filter(s => s.category === 'homepage-banner').map(size => (
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
              {size.width}×{size.height}
            </button>
          ))}
          <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
          {/* Download button with dropdown */}
          <div style={{ position: 'relative' }} ref={downloadMenuRef}>
            <button
              onClick={() => setShowDownloadMenu(v => !v)}
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
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {showDownloadMenu && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 6,
                width: 280,
                backgroundColor: '#1C2333',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '16px',
                zIndex: 200,
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                fontFamily: 'Manrope, sans-serif',
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>Format</div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {(['png', 'jpeg'] as const).map(fmt => (
                    <button key={fmt} onClick={() => setExportFormat(fmt)} style={{
                      flex: 1, padding: '6px 0', borderRadius: 6, border: 'none',
                      backgroundColor: exportFormat === fmt ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)',
                      color: exportFormat === fmt ? '#3B82F6' : 'rgba(255,255,255,0.6)',
                      fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    }}>{fmt.toUpperCase()}</button>
                  ))}
                </div>
                {exportFormat === 'jpeg' && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Quality</span>
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{jpegQuality}%</span>
                    </div>
                    <input type="range" min={10} max={100} value={jpegQuality} onChange={e => setJpegQuality(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#3B82F6' }} />
                  </div>
                )}
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: 1, marginBottom: 8, textTransform: 'uppercase' }}>Sizes</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 14 }}>
                  {CANVAS_SIZES.map(size => (
                    <label key={size.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '3px 0' }}>
                      <input type="checkbox" checked={!!exportSizes[size.id]}
                        onChange={() => setExportSizes(prev => ({ ...prev, [size.id]: !prev[size.id] }))}
                        style={{ accentColor: '#3B82F6', width: 14, height: 14 }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>
                        {size.width}&times;{size.height}
                      </span>
                      <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginLeft: 'auto' }}>
                        {size.description}
                      </span>
                    </label>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <button onClick={handleExportSelected} disabled={isExporting} style={{
                    width: '100%', padding: '8px 0', borderRadius: 6, border: 'none',
                    backgroundColor: '#3B82F6', color: '#fff',
                    fontSize: 12, fontWeight: 600, cursor: isExporting ? 'not-allowed' : 'pointer',
                    opacity: isExporting ? 0.6 : 1,
                  }}>
                    {isExporting ? 'Exporting...' : 'Download Selected Sizes'}
                  </button>
                  <button onClick={() => handleExport()} disabled={isExporting} style={{
                    width: '100%', padding: '8px 0', borderRadius: 6,
                    border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'transparent',
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 12, fontWeight: 600, cursor: isExporting ? 'not-allowed' : 'pointer',
                    opacity: isExporting ? 0.6 : 1,
                  }}>
                    Download Current Size
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* User email + Logout */}
          {session?.user && (
            <>
              <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'Manrope, sans-serif' }}>
                  {session.user.email}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  style={{
                    padding: '4px 12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 6,
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 12,
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Auto-save indicator */}
      <SaveIndicator status={saveStatus} conflictWarning={conflictWarning} onDismissConflict={dismissConflict} onRetry={saveNow} />

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
        <div style={{ flex: 1, position: 'relative', overflow: 'auto' }}>
          {iframeMode && iframeHtmlPath ? (
            <div
              onDragOver={(e) => {
                if (e.dataTransfer.types.includes('application/sigma-element') || e.dataTransfer.types.includes('text/html')) {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                }
              }}
              onDrop={(e) => {
                e.preventDefault();
                const elementData = e.dataTransfer.getData('application/sigma-element');
                if (!elementData) return;

                // Switch to canvas mode so FreeFormCanvas renders with the new element
                setIframeMode(false);
                setIframeHtmlPath(null);

                try {
                  const partial = JSON.parse(elementData) as Partial<CanvasElement>;
                  const maxZ = elements.length > 0 ? Math.max(...elements.map(el => el.zIndex)) : 0;
                  const w = partial.width || 200;
                  const h = partial.height || 200;
                  const newEl: CanvasElement = {
                    ...partial,
                    id: `el_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                    x: Math.round(activeSize.width / 2 - w / 2),
                    y: Math.round(activeSize.height / 2 - h / 2),
                    zIndex: maxZ + 1,
                    locked: false,
                    visible: true,
                  } as CanvasElement;
                  setElements([...elements, newEl]);
                  setSelectedIds([newEl.id]);
                  showToast('success', 'Element Added', 'Element added to canvas');
                } catch { /* ignore */ }
              }}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100%',
                backgroundColor: '#1a1a2e',
                overflow: 'auto',
              }}
            >
              <div style={{
                width: activeSize.width,
                height: activeSize.height,
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'center center',
                flexShrink: 0,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
                position: 'relative',
              }}>
                <iframe
                  ref={iframeRef}
                  src={iframeHtmlPath}
                  style={{
                    width: activeSize.width,
                    height: activeSize.height,
                    border: 'none',
                    display: 'block',
                    pointerEvents: 'auto',
                  }}
                  title="Template Preview"
                />
              </div>
            </div>
          ) : (
            <FreeFormCanvas
              elements={elements}
              selectedIds={selectedIds}
              canvasWidth={activeSize.width}
              canvasHeight={activeSize.height}
              zoom={zoom}
              onElementsChange={setElementsAndSave}
              onElementsUpdate={updateWithoutHistory}
              onSelectionChange={setSelectedIds}
              onTextEditStart={() => setIsTextEditing(true)}
              onTextEditEnd={() => setIsTextEditing(false)}
              onZoomChange={setZoom}
              canvasExportRef={canvasRef}
              eraserMode={eraserMode}
              eraserBrushSize={eraserBrushSize}
              eraserSoftness={eraserSoftness}
              eraserOpacity={eraserOpacity}
              eraserMagicMode={eraserModeType === 'magic'}
              eraserMagicTolerance={magicTolerance}
              eraserMagicRadius={magicRadius}
              eraserMagicSoftness={magicSoftness}
              onFileDrop={handleFileDrop}
              canvasBackground={canvasBackground}
            />
          )}

          {/* Zoom Toolbar */}
          <div style={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#1e1e2e',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '4px 6px',
            zIndex: 50,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}>
            <button
              onClick={() => setZoom(z => Math.max(25, z - 25))}
              style={{
                width: 28, height: 28, borderRadius: 4,
                border: 'none', backgroundColor: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 600,
              }}
              title="Zoom out (Ctrl+-)"
            >{'\u2212'}</button>
            <span style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(255,255,255,0.6)',
              minWidth: 44,
              textAlign: 'center',
            }}>{zoom}%</span>
            <button
              onClick={() => setZoom(z => Math.min(200, z + 25))}
              style={{
                width: 28, height: 28, borderRadius: 4,
                border: 'none', backgroundColor: 'rgba(255,255,255,0.06)',
                color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, fontWeight: 600,
              }}
              title="Zoom in (Ctrl++)"
            >+</button>
            <div style={{ width: 1, height: 16, backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 2px' }} />
            <button
              onClick={() => setZoom(100)}
              style={{
                height: 28, borderRadius: 4, padding: '0 8px',
                border: 'none', backgroundColor: zoom === 100 ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.06)',
                color: zoom === 100 ? '#3B82F6' : 'rgba(255,255,255,0.7)',
                cursor: 'pointer',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 11, fontWeight: 600,
              }}
              title="Fit to view (Ctrl+0)"
            >Fit</button>
          </div>

          {/* Properties Panel (floating near element) */}
          {selectedElement && (
            <PropertiesPanel
              element={selectedElement}
              onUpdate={handlePropertyUpdate}
              elementScreenRect={elementScreenRect}
              onRemoveBackground={handleRemoveBackground}
              isRemovingBg={isRemovingBg}
              onMagicErase={handleStartMagicEraser}
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

      {/* Magic Eraser Overlay */}
      {magicEraserActive && selectedElement && selectedElement.type === 'image' && (() => {
        const canvasEl = canvasRef.current;
        if (!canvasEl) return null;
        const canvasRect = canvasEl.getBoundingClientRect();
        return (
          <MagicEraserOverlay
            element={selectedElement}
            canvasZoom={zoom}
            canvasRect={{ top: canvasRect.top, left: canvasRect.left }}
            onApply={handleApplyMagicEraser}
            onCancel={handleCancelMagicEraser}
          />
        );
      })()}

      {/* Keyboard Shortcuts Overlay */}
      <KeyboardShortcutsOverlay
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
