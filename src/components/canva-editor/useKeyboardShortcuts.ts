import { useEffect, useCallback, useRef } from 'react';
import { CanvasElement } from './types';

interface ShortcutActions {
  undo: () => void;
  redo: () => void;
  deleteSelected: () => void;
  selectAll: () => void;
  deselectAll: () => void;
  copySelected: () => void;
  paste: () => void;
  duplicateSelected: () => void;
  nudge: (dx: number, dy: number) => void;
  bringForward: () => void;
  sendBackward: () => void;
  bringToFront: () => void;
  sendToBack: () => void;
  groupSelected: () => void;
  ungroupSelected: () => void;
  toggleLock: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomToFit: () => void;
  exportCanvas: () => void;
  toggleShortcutsHelp: () => void;
}

export function useKeyboardShortcuts(
  actions: ShortcutActions,
  isTextEditing: boolean,
  hasSelection: boolean,
) {
  const actionsRef = useRef(actions);
  actionsRef.current = actions;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const a = actionsRef.current;
    const isMod = e.metaKey || e.ctrlKey;

    // When text editing, only intercept Escape
    if (isTextEditing) {
      if (e.key === 'Escape') {
        // Handled by the text editing component itself
      }
      return;
    }

    // Don't intercept if we're in an input/textarea/select
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      return;
    }

    // ? - Show shortcuts
    if (e.key === '?' && !isMod) {
      e.preventDefault();
      a.toggleShortcutsHelp();
      return;
    }

    // Escape - Deselect
    if (e.key === 'Escape') {
      e.preventDefault();
      a.deselectAll();
      return;
    }

    // Delete / Backspace - Delete selected
    if ((e.key === 'Delete' || e.key === 'Backspace') && hasSelection) {
      e.preventDefault();
      a.deleteSelected();
      return;
    }

    // Mod shortcuts
    if (isMod) {
      switch (e.key.toLowerCase()) {
        case 'z':
          e.preventDefault();
          if (e.shiftKey) {
            a.redo();
          } else {
            a.undo();
          }
          return;
        case 'y':
          e.preventDefault();
          a.redo();
          return;
        case 's':
          e.preventDefault();
          a.exportCanvas();
          return;
        case 'a':
          e.preventDefault();
          a.selectAll();
          return;
        case 'c':
          if (hasSelection) {
            e.preventDefault();
            a.copySelected();
          }
          return;
        case 'v':
          e.preventDefault();
          a.paste();
          return;
        case 'd':
          if (hasSelection) {
            e.preventDefault();
            a.duplicateSelected();
          }
          return;
        case 'g':
          if (hasSelection) {
            e.preventDefault();
            if (e.shiftKey) {
              a.ungroupSelected();
            } else {
              a.groupSelected();
            }
          }
          return;
        case 'l':
          if (hasSelection) {
            e.preventDefault();
            a.toggleLock();
          }
          return;
        case ']':
          if (hasSelection) {
            e.preventDefault();
            a.bringToFront();
          }
          return;
        case '[':
          if (hasSelection) {
            e.preventDefault();
            a.sendToBack();
          }
          return;
        case '=':
        case '+':
          e.preventDefault();
          a.zoomIn();
          return;
        case '-':
          e.preventDefault();
          a.zoomOut();
          return;
        case '0':
          e.preventDefault();
          a.zoomToFit();
          return;
      }
    }

    // Non-mod layer shortcuts
    if (!isMod && hasSelection) {
      if (e.key === ']') {
        e.preventDefault();
        a.bringForward();
        return;
      }
      if (e.key === '[') {
        e.preventDefault();
        a.sendBackward();
        return;
      }
    }

    // Arrow keys - Nudge
    if (hasSelection) {
      const amount = e.shiftKey ? 10 : 1;
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          a.nudge(-amount, 0);
          return;
        case 'ArrowRight':
          e.preventDefault();
          a.nudge(amount, 0);
          return;
        case 'ArrowUp':
          e.preventDefault();
          a.nudge(0, -amount);
          return;
        case 'ArrowDown':
          e.preventDefault();
          a.nudge(0, amount);
          return;
      }
    }
  }, [isTextEditing, hasSelection]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

// Clipboard helper - stores copied elements
let clipboard: CanvasElement[] = [];

export function setClipboard(elements: CanvasElement[]) {
  clipboard = structuredClone(elements);
}

export function getClipboard(): CanvasElement[] {
  return structuredClone(clipboard);
}
