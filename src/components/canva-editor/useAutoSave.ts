import { useState, useCallback, useRef, useEffect, type RefObject } from 'react';
import type { CanvasElement, CanvasSize } from './types';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

interface AutoSaveOptions {
  creativeId: string;
  elements: CanvasElement[];
  activeSize: CanvasSize;
  perSizeElements: Record<string, CanvasElement[]>;
  projectName?: string;
  canvasBackground?: string;
  enabled?: boolean;
  canvasRef?: RefObject<HTMLDivElement | null>;
}

export interface SavedDesign {
  id: string;
  projectName: string;
  lastModified: number;
  savedAt: string;
  activeSize: CanvasSize;
  canvasBackground?: string;
  elements: CanvasElement[];
  perSizeElements: Record<string, CanvasElement[]>;
  thumbnail?: string;
}

export const STORAGE_PREFIX = 'sigma-creative-';

const DEBOUNCE_MS = 2000;
const INTERVAL_MS = 30000;
const FADE_DELAY_MS = 3000;

export function useAutoSave({
  creativeId,
  elements,
  activeSize,
  perSizeElements,
  projectName,
  canvasBackground,
  enabled = true,
  canvasRef,
}: AutoSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle');

  const lastSavedRef = useRef<string>('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const thumbnailRef = useRef<string | undefined>(undefined);

  const getSnapshot = useCallback(() => {
    return JSON.stringify({ elements, activeSize: activeSize.id, perSizeElements, canvasBackground });
  }, [elements, activeSize, perSizeElements, canvasBackground]);

  // Generate a small thumbnail from the canvas element
  const captureThumbnail = useCallback(async () => {
    const el = canvasRef?.current;
    if (!el) return undefined;
    try {
      const htmlToImage = await import('html-to-image');
      const origTransform = el.style.transform;
      const origTransformOrigin = el.style.transformOrigin;
      const origBoxShadow = el.style.boxShadow;
      el.style.transform = 'none';
      el.style.transformOrigin = 'top left';
      el.style.boxShadow = 'none';
      void el.offsetWidth;
      try {
        const dataUrl = await htmlToImage.toPng(el, {
          quality: 0.6,
          pixelRatio: 0.3,
          cacheBust: true,
        });
        return dataUrl;
      } finally {
        el.style.transform = origTransform;
        el.style.transformOrigin = origTransformOrigin;
        el.style.boxShadow = origBoxShadow;
      }
    } catch {
      return undefined;
    }
  }, [canvasRef]);

  const performSave = useCallback((data: object, thumbnail?: string): boolean => {
    setStatus('saving');

    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }

    try {
      const key = STORAGE_PREFIX + creativeId;
      const saveData: Record<string, unknown> = {
        ...data,
        id: creativeId,
        projectName: projectName ?? creativeId,
        canvasBackground,
        lastModified: Date.now(),
        savedAt: new Date().toISOString(),
      };
      if (thumbnail) {
        saveData.thumbnail = thumbnail;
      } else if (thumbnailRef.current) {
        saveData.thumbnail = thumbnailRef.current;
      }
      localStorage.setItem(key, JSON.stringify(saveData));

      setStatus('saved');
      fadeTimerRef.current = setTimeout(() => setStatus('idle'), FADE_DELAY_MS);
      return true;
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), FADE_DELAY_MS);
      return false;
    }
  }, [creativeId, projectName, canvasBackground]);

  const save = useCallback(async () => {
    if (!enabled) return;

    const snapshot = getSnapshot();
    if (snapshot === lastSavedRef.current) return;

    lastSavedRef.current = snapshot;
    const data = { elements, activeSize, perSizeElements, projectName, canvasBackground, lastModified: Date.now() };

    // Capture thumbnail in background (non-blocking)
    const thumb = await captureThumbnail();
    if (thumb) thumbnailRef.current = thumb;
    performSave(data, thumb);
  }, [enabled, getSnapshot, elements, activeSize, perSizeElements, projectName, canvasBackground, performSave, captureThumbnail]);

  // Debounced save — triggers 2 seconds after last change
  const debouncedSave = useCallback(() => {
    if (!enabled) return;
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(save, DEBOUNCE_MS);
  }, [enabled, save]);

  // Watch for element changes and trigger debounced save
  const prevSnapshotRef = useRef<string>('');
  useEffect(() => {
    if (!enabled) return;
    const snapshot = getSnapshot();
    if (snapshot !== prevSnapshotRef.current) {
      prevSnapshotRef.current = snapshot;
      debouncedSave();
    }
  }, [enabled, getSnapshot, debouncedSave]);

  // Periodic save every 30 seconds
  useEffect(() => {
    if (!enabled) return;
    intervalTimerRef.current = setInterval(save, INTERVAL_MS);
    return () => {
      if (intervalTimerRef.current) {
        clearInterval(intervalTimerRef.current);
      }
    };
  }, [enabled, save]);

  // Save on beforeunload
  useEffect(() => {
    if (!enabled) return;
    const handleBeforeUnload = () => {
      const snapshot = getSnapshot();
      if (snapshot !== lastSavedRef.current) {
        try {
          const key = STORAGE_PREFIX + creativeId;
          const saveData: Record<string, unknown> = {
            id: creativeId,
            projectName: projectName ?? creativeId,
            canvasBackground,
            elements,
            activeSize,
            perSizeElements,
            lastModified: Date.now(),
            savedAt: new Date().toISOString(),
          };
          if (thumbnailRef.current) saveData.thumbnail = thumbnailRef.current;
          localStorage.setItem(key, JSON.stringify(saveData));
        } catch {
          // Best-effort save on unload
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, creativeId, elements, activeSize, perSizeElements, projectName, canvasBackground, getSnapshot]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (intervalTimerRef.current) clearInterval(intervalTimerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  // Trigger immediate save (for drag/drop, move, resize events)
  const saveNow = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    save();
  }, [save]);

  return {
    status,
    conflictWarning: false,
    dismissConflict: () => {},
    saveNow,
  };
}
