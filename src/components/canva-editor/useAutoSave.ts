import { useState, useCallback, useRef, useEffect } from 'react';
import type { CanvasElement, CanvasSize } from './types';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'offline';

interface AutoSaveOptions {
  creativeId: string;
  elements: CanvasElement[];
  activeSize: CanvasSize;
  perSizeElements: Record<string, CanvasElement[]>;
  enabled?: boolean;
}

const DEBOUNCE_MS = 2000;
const INTERVAL_MS = 30000;
const MAX_RETRIES = 3;
const FADE_DELAY_MS = 3000;

export function useAutoSave({
  creativeId,
  elements,
  activeSize,
  perSizeElements,
  enabled = true,
}: AutoSaveOptions) {
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [conflictWarning, setConflictWarning] = useState(false);

  const lastSavedRef = useRef<string>('');
  const lastModifiedRef = useRef<number | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingSaveRef = useRef<object | null>(null);
  const isSavingRef = useRef(false);
  const retryCountRef = useRef(0);
  const isOnlineRef = useRef(typeof navigator !== 'undefined' ? navigator.onLine : true);

  const getSnapshot = useCallback(() => {
    return JSON.stringify({ elements, activeSize: activeSize.id, perSizeElements });
  }, [elements, activeSize, perSizeElements]);

  const performSave = useCallback(async (data: object): Promise<boolean> => {
    if (isSavingRef.current) {
      pendingSaveRef.current = data;
      return false;
    }

    isSavingRef.current = true;
    setStatus('saving');

    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current);
      fadeTimerRef.current = null;
    }

    try {
      const response = await fetch('/api/creatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          id: creativeId,
          clientLastModified: lastModifiedRef.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`Save failed: ${response.status}`);
      }

      const result = await response.json();
      lastModifiedRef.current = result.lastModified;
      retryCountRef.current = 0;

      if (result.conflict) {
        setConflictWarning(true);
      }

      setStatus('saved');
      fadeTimerRef.current = setTimeout(() => setStatus('idle'), FADE_DELAY_MS);

      isSavingRef.current = false;

      // Process queued save if any
      if (pendingSaveRef.current) {
        const queued = pendingSaveRef.current;
        pendingSaveRef.current = null;
        performSave(queued);
      }

      return true;
    } catch {
      isSavingRef.current = false;

      if (!navigator.onLine) {
        isOnlineRef.current = false;
        setStatus('offline');
        pendingSaveRef.current = data;
        return false;
      }

      retryCountRef.current++;
      if (retryCountRef.current <= MAX_RETRIES) {
        setStatus('error');
        const backoff = Math.pow(2, retryCountRef.current) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoff));
        return performSave(data);
      }

      setStatus('error');
      retryCountRef.current = 0;
      return false;
    }
  }, [creativeId]);

  const save = useCallback(() => {
    if (!enabled) return;

    const snapshot = getSnapshot();
    if (snapshot === lastSavedRef.current) return;

    lastSavedRef.current = snapshot;
    const data = { elements, activeSize, perSizeElements, lastModified: Date.now() };
    performSave(data);
  }, [enabled, getSnapshot, elements, activeSize, perSizeElements, performSave]);

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

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      isOnlineRef.current = true;
      // Retry pending save
      if (pendingSaveRef.current) {
        const queued = pendingSaveRef.current;
        pendingSaveRef.current = null;
        setStatus('idle');
        performSave(queued);
      } else {
        setStatus('idle');
      }
    };

    const handleOffline = () => {
      isOnlineRef.current = false;
      setStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [performSave]);

  // Save on beforeunload
  useEffect(() => {
    if (!enabled) return;
    const handleBeforeUnload = () => {
      const snapshot = getSnapshot();
      if (snapshot !== lastSavedRef.current) {
        // Use sendBeacon for reliability on page close
        const data = { id: creativeId, elements, activeSize, perSizeElements, lastModified: Date.now(), clientLastModified: lastModifiedRef.current };
        navigator.sendBeacon('/api/creatives', JSON.stringify(data));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enabled, creativeId, elements, activeSize, perSizeElements, getSnapshot]);

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

  const dismissConflict = useCallback(() => setConflictWarning(false), []);

  return {
    status,
    conflictWarning,
    dismissConflict,
    saveNow,
  };
}
