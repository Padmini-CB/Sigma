import { useState, useCallback, useRef, useEffect } from 'react';
import type { CanvasElement, CanvasSize } from './types';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

interface AutoSaveOptions {
  creativeId: string;
  elements: CanvasElement[];
  activeSize: CanvasSize;
  perSizeElements: Record<string, CanvasElement[]>;
  projectName?: string;
  enabled?: boolean;
}

export interface SavedDesign {
  id: string;
  projectName: string;
  lastModified: number;
  savedAt: string;
  activeSize: CanvasSize;
  elements: CanvasElement[];
  perSizeElements: Record<string, CanvasElement[]>;
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
  enabled = true,
}: AutoSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle');

  const lastSavedRef = useRef<string>('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getSnapshot = useCallback(() => {
    return JSON.stringify({ elements, activeSize: activeSize.id, perSizeElements });
  }, [elements, activeSize, perSizeElements]);

  const performSave = useCallback((data: object): boolean => {
    setStatus('saving');

    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }

    try {
      const key = STORAGE_PREFIX + creativeId;
      localStorage.setItem(key, JSON.stringify({
        ...data,
        id: creativeId,
        projectName: projectName ?? creativeId,
        lastModified: Date.now(),
        savedAt: new Date().toISOString(),
      }));

      setStatus('saved');
      fadeTimerRef.current = setTimeout(() => setStatus('idle'), FADE_DELAY_MS);
      return true;
    } catch {
      // localStorage might be full or unavailable
      setStatus('error');
      // Clear error after a few seconds
      setTimeout(() => setStatus('idle'), FADE_DELAY_MS);
      return false;
    }
  }, [creativeId]);

  const save = useCallback(() => {
    if (!enabled) return;

    const snapshot = getSnapshot();
    if (snapshot === lastSavedRef.current) return;

    lastSavedRef.current = snapshot;
    const data = { elements, activeSize, perSizeElements, projectName, lastModified: Date.now() };
    performSave(data);
  }, [enabled, getSnapshot, elements, activeSize, perSizeElements, projectName, performSave]);

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
          localStorage.setItem(key, JSON.stringify({
            id: creativeId,
            projectName: projectName ?? creativeId,
            elements,
            activeSize,
            perSizeElements,
            lastModified: Date.now(),
            savedAt: new Date().toISOString(),
          }));
        } catch {
          // Best-effort save on unload
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, creativeId, elements, activeSize, perSizeElements, projectName, getSnapshot]);

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
