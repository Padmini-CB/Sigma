import { useState, useCallback, useRef } from 'react';
import { CanvasElement } from './types';

const MAX_HISTORY = 50;

interface HistoryEntry {
  elements: CanvasElement[];
  timestamp: number;
}

export function useCanvasHistory(initialElements: CanvasElement[] = []) {
  const [elements, setElements] = useState<CanvasElement[]>(initialElements);
  const historyRef = useRef<HistoryEntry[]>([{ elements: initialElements, timestamp: Date.now() }]);
  const indexRef = useRef(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 1000);
  }, []);

  const saveState = useCallback((newElements: CanvasElement[]) => {
    // Truncate any future states if we've undone
    const history = historyRef.current;
    history.splice(indexRef.current + 1);

    // Add new state
    history.push({ elements: structuredClone(newElements), timestamp: Date.now() });

    // Trim to max
    if (history.length > MAX_HISTORY) {
      history.shift();
    }
    indexRef.current = history.length - 1;

    setElements(newElements);
  }, []);

  const undo = useCallback(() => {
    if (indexRef.current > 0) {
      indexRef.current--;
      const entry = historyRef.current[indexRef.current];
      setElements(structuredClone(entry.elements));
      showToast('Undo');
      return true;
    }
    return false;
  }, [showToast]);

  const redo = useCallback(() => {
    if (indexRef.current < historyRef.current.length - 1) {
      indexRef.current++;
      const entry = historyRef.current[indexRef.current];
      setElements(structuredClone(entry.elements));
      showToast('Redo');
      return true;
    }
    return false;
  }, [showToast]);

  const canUndo = indexRef.current > 0;
  const canRedo = indexRef.current < historyRef.current.length - 1;

  // Update elements without saving to history (for continuous operations like dragging)
  const updateWithoutHistory = useCallback((newElements: CanvasElement[]) => {
    setElements(newElements);
  }, []);

  // Reset history with new initial state
  const resetHistory = useCallback((newElements: CanvasElement[]) => {
    historyRef.current = [{ elements: structuredClone(newElements), timestamp: Date.now() }];
    indexRef.current = 0;
    setElements(newElements);
  }, []);

  return {
    elements,
    setElements: saveState,
    updateWithoutHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    resetHistory,
    toastMessage,
  };
}
