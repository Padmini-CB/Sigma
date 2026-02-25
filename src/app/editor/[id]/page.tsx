'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
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

  // ── Iframe mode (for HTML templates) ──
  const [iframeMode, setIframeMode] = useState(false);
  const [iframeHtmlPath, setIframeHtmlPath] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Zoom ──
  const [zoom, setZoom] = useState(100);

  // ── Text editing mode (disables keyboard shortcuts) ──
  const [isTextEditing, setIsTextEditing] = useState(false);

  // ── Shortcuts overlay ──
  const [showShortcuts, setShowShortcuts] = useState(false);

  // ── Export state ──
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // ── Download dropdown state ──
  const [showDownloadDropdown, setShowDownloadDropdown] = useState(false);
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');
  const [jpegQuality, setJpegQuality] = useState(92);
  const [selectedExportSizes, setSelectedExportSizes] = useState<Set<string>>(() => new Set([CANVAS_SIZES[0].id]));
  const downloadDropdownRef = useRef<HTMLDivElement>(null);

  // ── Close download dropdown on outside click ──
  useEffect(() => {
    if (!showDownloadDropdown) return;
    const handler = (e: MouseEvent) => {
      if (downloadDropdownRef.current && !downloadDropdownRef.current.contains(e.target as Node)) {
        setShowDownloadDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showDownloadDropdown]);

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
    if (tmpl.htmlPath) {
      // Switch to iframe mode — load the original HTML template
      setIframeMode(true);
      setIframeHtmlPath(tmpl.htmlPath);
      setActiveTemplateId(tmpl.id);
      setSelectedIds([]);
      showToast('success', 'Template Loaded', `"${tmpl.shortLabel}" loaded — drag to rearrange, double-click to edit text`);
    } else {
      // Fallback: use canvas element mode
      setIframeMode(false);
      setIframeHtmlPath(null);
      const newElements = tmpl.createElements();
      resetHistory(newElements);
      setActiveTemplateId(tmpl.id);
      setSelectedIds([]);
      showToast('success', 'Template Loaded', `"${tmpl.shortLabel}" loaded onto canvas`);
    }
  }, [resetHistory, showToast]);

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

  // ── Click-to-add element from sidebar (fallback when drag doesn't work) ──
  const handleClickAddElement = useCallback((item: AssetItem) => {
    if (iframeMode && iframeRef.current) {
      // In iframe mode, post message to add HTML element at center
      if (item.htmlSnippet) {
        iframeRef.current.contentWindow?.postMessage({
          type: 'sigma-command',
          command: 'addElement',
          html: item.htmlSnippet,
          x: activeSize.width / 2 - 150,
          y: activeSize.height / 2 - 40,
        }, '*');
      }
    } else {
      // In FreeFormCanvas mode, add element to center of canvas
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
    }
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

  // ── Helper: convert PNG data URL to JPEG with dark background ──
  const convertToJpeg = useCallback((pngDataUrl: string, width: number, height: number, quality: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) { reject(new Error('No 2d context')); return; }
        ctx.fillStyle = '#0D1117';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(tempCanvas.toDataURL('image/jpeg', quality / 100));
      };
      img.onerror = reject;
      img.src = pngDataUrl;
    });
  }, []);

  // ── Export current canvas at given size as data URL ──
  const exportCanvasDataUrl = useCallback(async (targetWidth: number, targetHeight: number, format: 'png' | 'jpeg', quality: number): Promise<string> => {
    if (iframeMode && iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument;
      if (!iframeDoc) throw new Error('Cannot access iframe content');
      iframe.contentWindow?.postMessage({ type: 'sigma-command', command: 'prepareExport' }, '*');
      await new Promise(r => setTimeout(r, 300));
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(iframeDoc.body, {
        width: targetWidth, height: targetHeight, scale: 2,
        backgroundColor: '#0D1117', useCORS: true, allowTaint: true, logging: false,
      });
      iframe.contentWindow?.postMessage({ type: 'sigma-command', command: 'restoreHandles' }, '*');
      const pngUrl = canvas.toDataURL('image/png', 1.0);
      return format === 'jpeg' ? convertToJpeg(pngUrl, targetWidth * 2, targetHeight * 2, quality) : pngUrl;
    } else {
      const canvasEl = canvasRef.current;
      if (!canvasEl) throw new Error('Canvas not available');
      const htmlToImage = await import('html-to-image');
      if (document.fonts?.ready) await document.fonts.ready;
      await new Promise(r => setTimeout(r, 150));
      const pngUrl = await htmlToImage.toPng(canvasEl, {
        quality: 1.0, pixelRatio: 2, width: targetWidth, height: targetHeight,
        style: { transform: 'none', overflow: 'hidden' },
      });
      return format === 'jpeg' ? convertToJpeg(pngUrl, targetWidth * 2, targetHeight * 2, quality) : pngUrl;
    }
  }, [iframeMode, convertToJpeg]);

  // ── Export current size (single file download) ──
  const handleExport = useCallback(async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const ext = exportFormat === 'jpeg' ? 'jpg' : 'png';
      const dataUrl = await exportCanvasDataUrl(activeSize.width, activeSize.height, exportFormat, jpegQuality);
      const link = document.createElement('a');
      const name = activeTemplateId || 'canvas';
      link.download = `${name}_${activeSize.width}x${activeSize.height}.${ext}`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('success', 'Export Complete', `Saved as ${activeSize.width}\u00d7${activeSize.height} ${ext.toUpperCase()}`);
    } catch (error) {
      showToast('error', 'Export Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsExporting(false);
    }
  }, [activeSize, activeTemplateId, isExporting, exportFormat, jpegQuality, exportCanvasDataUrl, showToast]);

  // ── Export selected sizes (ZIP if multiple, single file if one) ──
  const handleExportSelected = useCallback(async () => {
    if (isExporting) return;
    const sizesToExport = CANVAS_SIZES.filter(s => selectedExportSizes.has(s.id));
    if (sizesToExport.length === 0) return;

    setIsExporting(true);
    try {
      const ext = exportFormat === 'jpeg' ? 'jpg' : 'png';
      const name = activeTemplateId || 'canvas';

      if (sizesToExport.length === 1) {
        // Single size — download directly
        const size = sizesToExport[0];
        const canvasEl = canvasRef.current;
        if (!canvasEl) return;
        const origW = canvasEl.style.width;
        const origH = canvasEl.style.height;
        canvasEl.style.width = `${size.width}px`;
        canvasEl.style.height = `${size.height}px`;
        await new Promise(r => setTimeout(r, 100));
        try {
          const dataUrl = await exportCanvasDataUrl(size.width, size.height, exportFormat, jpegQuality);
          const link = document.createElement('a');
          link.download = `${name}_${size.width}x${size.height}.${ext}`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } finally {
          canvasEl.style.width = origW;
          canvasEl.style.height = origH;
        }
        showToast('success', 'Export Complete', `Saved as ${size.width}\u00d7${size.height} ${ext.toUpperCase()}`);
      } else {
        // Multiple sizes — ZIP
        showToast('info', 'Exporting', `Generating ${sizesToExport.length} sizes...`);
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();

        for (const size of sizesToExport) {
          const canvasEl = canvasRef.current;
          if (!canvasEl) continue;
          const origW = canvasEl.style.width;
          const origH = canvasEl.style.height;
          canvasEl.style.width = `${size.width}px`;
          canvasEl.style.height = `${size.height}px`;
          await new Promise(r => setTimeout(r, 100));
          try {
            const htmlToImage = await import('html-to-image');
            if (document.fonts?.ready) await document.fonts.ready;
            const pngUrl = await htmlToImage.toPng(canvasEl, {
              quality: 1.0, pixelRatio: 1, width: size.width, height: size.height,
              style: { transform: 'none', overflow: 'hidden' },
            });
            let finalUrl = pngUrl;
            if (exportFormat === 'jpeg') {
              finalUrl = await convertToJpeg(pngUrl, size.width, size.height, jpegQuality);
            }
            const base64 = finalUrl.split(',')[1];
            zip.file(`${name}_${size.width}x${size.height}.${ext}`, base64, { base64: true });
          } finally {
            canvasEl.style.width = origW;
            canvasEl.style.height = origH;
          }
        }

        const blob = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `${name}-${sizesToExport.length}sizes.zip`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        showToast('success', 'Download Complete', `${sizesToExport.length} sizes exported`);
      }
    } catch (error) {
      showToast('error', 'Export Failed', error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, exportFormat, jpegQuality, activeTemplateId, selectedExportSizes, exportCanvasDataUrl, convertToJpeg, showToast]);

  // ── Legacy export all (used by settings panel) ──
  const handleExportAll = useCallback(async () => {
    // Select all sizes and trigger export
    setSelectedExportSizes(new Set(CANVAS_SIZES.map(s => s.id)));
    // Defer to let state update
    setTimeout(() => handleExportSelected(), 50);
  }, [handleExportSelected]);

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
        return <ElementsPanel onDragStart={handleElementDragStart} onClickAdd={handleClickAddElement} />;
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
              {size.width}×{size.height}
            </button>
          ))}
          <div style={{ width: 1, height: 20, backgroundColor: 'rgba(255,255,255,0.1)', margin: '0 4px' }} />
          {/* Download button + dropdown */}
          <div ref={downloadDropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowDownloadDropdown(prev => !prev)}
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
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Download Dropdown Panel */}
            {showDownloadDropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                backgroundColor: '#1C2333',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 20,
                boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
                fontFamily: "'Poppins', sans-serif",
                minWidth: 280,
                zIndex: 99999,
              }}>
                {/* FORMAT */}
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
                  Format
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                  {(['png', 'jpeg'] as const).map(fmt => (
                    <button
                      key={fmt}
                      onClick={() => setExportFormat(fmt)}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        borderRadius: 6,
                        border: exportFormat === fmt ? '1.5px solid #3B82F6' : '1.5px solid rgba(255,255,255,0.12)',
                        backgroundColor: exportFormat === fmt ? 'rgba(59,130,246,0.15)' : 'transparent',
                        color: exportFormat === fmt ? '#3B82F6' : 'rgba(255,255,255,0.6)',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        textTransform: 'uppercase',
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>

                {/* JPEG Quality slider */}
                {exportFormat === 'jpeg' && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Quality</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{jpegQuality}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={jpegQuality}
                      onChange={(e) => setJpegQuality(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#3B82F6', cursor: 'pointer' }}
                    />
                  </div>
                )}

                {/* SIZES */}
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.45)', marginBottom: 8 }}>
                  Sizes
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                  {CANVAS_SIZES.map(size => {
                    const isChecked = selectedExportSizes.has(size.id);
                    return (
                      <label
                        key={size.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '6px 8px',
                          borderRadius: 6,
                          cursor: 'pointer',
                          backgroundColor: isChecked ? 'rgba(59,130,246,0.08)' : 'transparent',
                        }}
                        onMouseEnter={(e) => { if (!isChecked) (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'); }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = isChecked ? 'rgba(59,130,246,0.08)' : 'transparent'; }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSelectedExportSizes(prev => {
                              const next = new Set(prev);
                              if (next.has(size.id)) next.delete(size.id);
                              else next.add(size.id);
                              return next;
                            });
                          }}
                          style={{ accentColor: '#3B82F6', width: 15, height: 15, cursor: 'pointer' }}
                        />
                        <span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.85)', minWidth: 90 }}>
                          {size.width}&times;{size.height}
                        </span>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
                          {size.description}
                        </span>
                      </label>
                    );
                  })}
                </div>

                {/* Action buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={() => { setShowDownloadDropdown(false); handleExport(); }}
                    disabled={isExporting}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      width: '100%', height: 40, borderRadius: 8, border: 'none',
                      backgroundColor: '#3B82F6', color: '#fff',
                      fontSize: 13, fontWeight: 600, cursor: isExporting ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit', opacity: isExporting ? 0.6 : 1,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Current Size
                  </button>
                  {selectedExportSizes.size > 0 && (
                    <button
                      onClick={() => { setShowDownloadDropdown(false); handleExportSelected(); }}
                      disabled={isExporting}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        width: '100%', height: 40, borderRadius: 8,
                        border: '1.5px solid rgba(255,255,255,0.15)',
                        backgroundColor: 'transparent', color: 'rgba(255,255,255,0.7)',
                        fontSize: 13, fontWeight: 600, cursor: isExporting ? 'not-allowed' : 'pointer',
                        fontFamily: 'inherit', opacity: isExporting ? 0.6 : 1,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download All Selected ({selectedExportSizes.size})
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
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
                const html = e.dataTransfer.getData('text/html');
                const elementData = e.dataTransfer.getData('application/sigma-element');
                if (html && iframeRef.current) {
                  // Drop HTML component into iframe
                  const iframeRect = iframeRef.current.getBoundingClientRect();
                  iframeRef.current.contentWindow?.postMessage({
                    type: 'sigma-command',
                    command: 'addElement',
                    html,
                    x: (e.clientX - iframeRect.left) / (zoom / 100),
                    y: (e.clientY - iframeRect.top) / (zoom / 100),
                  }, '*');
                } else if (elementData && iframeRef.current) {
                  // Drop canvas element data — create HTML from element data
                  try {
                    const partial = JSON.parse(elementData);
                    const iframeRect = iframeRef.current.getBoundingClientRect();
                    const x = (e.clientX - iframeRect.left) / (zoom / 100);
                    const y = (e.clientY - iframeRect.top) / (zoom / 100);
                    // Create a simple HTML element from canvas element data
                    const el = document.createElement('div');
                    el.setAttribute('data-sigma', '');
                    el.style.cssText = `position:absolute;left:${x}px;top:${y}px;z-index:100;font-family:Poppins,sans-serif;font-size:${partial.buttonStyle?.fontSize || partial.badgeStyle?.fontSize || partial.textStyle?.fontSize || 16}px;font-weight:${partial.buttonStyle?.fontWeight || partial.badgeStyle?.fontWeight || partial.textStyle?.fontWeight || 600};color:${partial.buttonStyle?.textColor || partial.badgeStyle?.textColor || partial.textStyle?.color || '#fff'};background:${partial.buttonStyle?.backgroundColor || partial.badgeStyle?.backgroundColor || 'transparent'};padding:${partial.buttonStyle?.paddingY || partial.badgeStyle?.paddingY || 10}px ${partial.buttonStyle?.paddingX || partial.badgeStyle?.paddingX || 20}px;border-radius:${partial.buttonStyle?.borderRadius || partial.badgeStyle?.borderRadius || 8}px;`;
                    el.textContent = partial.content || '';
                    iframeRef.current.contentWindow?.postMessage({
                      type: 'sigma-command',
                      command: 'addElement',
                      html: el.outerHTML,
                      x, y,
                    }, '*');
                  } catch { /* ignore */ }
                }
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
              onElementsChange={setElements}
              onElementsUpdate={updateWithoutHistory}
              onSelectionChange={setSelectedIds}
              onTextEditStart={() => setIsTextEditing(true)}
              onTextEditEnd={() => setIsTextEditing(false)}
              onZoomChange={setZoom}
              canvasExportRef={canvasRef}
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

          {/* Properties Panel (floating right) */}
          {selectedElement && (
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
