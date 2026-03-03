'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { type CanvasElement } from '@/components/canva-editor/types';
import {
  type SavedProject,
  createProject,
  saveProject,
  loadProject,
} from '@/lib/projectStorage';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface UseAutoSaveOptions {
  /** Existing project ID to resume, or null for new project */
  projectId: string | null;
  /** Default project name (template name + date) */
  defaultName: string;
  /** Bootcamp identifier */
  bootcamp: string;
  /** Template ID the project was started from */
  templateId: string;
  /** Current canvas dimensions */
  canvasWidth: number;
  canvasHeight: number;
  /** Current elements on canvas */
  elements: CanvasElement[];
  /** Ref to the canvas DOM element for thumbnail generation */
  canvasRef: React.RefObject<HTMLDivElement | null>;
  /** Debounce delay in ms */
  debounceMs?: number;
}

interface UseAutoSaveReturn {
  /** Current project (null until first save) */
  project: SavedProject | null;
  /** Current save status for the indicator */
  saveStatus: SaveStatus;
  /** Project name (editable) */
  projectName: string;
  /** Update the project name */
  setProjectName: (name: string) => void;
  /** Force an immediate save */
  saveNow: () => void;
}

export function useAutoSave(options: UseAutoSaveOptions): UseAutoSaveReturn {
  const {
    projectId,
    defaultName,
    bootcamp,
    templateId,
    canvasWidth,
    canvasHeight,
    elements,
    canvasRef,
    debounceMs = 2000,
  } = options;

  const [project, setProject] = useState<SavedProject | null>(() => {
    if (projectId) {
      return loadProject(projectId);
    }
    return null;
  });

  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [projectName, setProjectName] = useState(() => {
    if (projectId) {
      const loaded = loadProject(projectId);
      if (loaded) return loaded.name;
    }
    return defaultName;
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projectRef = useRef(project);
  const elementsRef = useRef(elements);
  const nameRef = useRef(projectName);
  const initialLoadDone = useRef(false);

  // Keep refs in sync
  projectRef.current = project;
  elementsRef.current = elements;
  nameRef.current = projectName;

  // Generate thumbnail from canvas DOM
  const generateThumbnail = useCallback(async (): Promise<string> => {
    const el = canvasRef.current;
    if (!el) return '';
    try {
      const htmlToImage = await import('html-to-image');
      // Small thumbnail: ~200px wide
      const scale = 200 / canvasWidth;
      const dataUrl = await htmlToImage.toPng(el, {
        quality: 0.7,
        pixelRatio: scale,
        width: canvasWidth,
        height: canvasHeight,
        style: { transform: 'none', overflow: 'hidden' },
      });
      return dataUrl;
    } catch {
      return '';
    }
  }, [canvasRef, canvasWidth, canvasHeight]);

  // Core save function
  const doSave = useCallback(async () => {
    const currentElements = elementsRef.current;
    const currentName = nameRef.current;

    // Don't save if canvas is empty (no elements yet)
    if (currentElements.length === 0) {
      setSaveStatus('idle');
      return;
    }

    setSaveStatus('saving');

    const thumbnail = await generateThumbnail();

    if (projectRef.current) {
      // Update existing project
      const updated: SavedProject = {
        ...projectRef.current,
        name: currentName,
        canvasWidth,
        canvasHeight,
        elements: structuredClone(currentElements),
        thumbnail,
      };
      saveProject(updated);
      setProject(updated);
    } else {
      // Create new project
      const newProject = createProject({
        name: currentName,
        bootcamp,
        templateId,
        canvasWidth,
        canvasHeight,
        elements: structuredClone(currentElements),
        thumbnail,
      });
      setProject(newProject);
    }

    setSaveStatus('saved');

    // Reset to idle after 2 seconds
    setTimeout(() => {
      setSaveStatus(prev => prev === 'saved' ? 'idle' : prev);
    }, 2000);
  }, [generateThumbnail, canvasWidth, canvasHeight, bootcamp, templateId]);

  // Force save
  const saveNow = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    doSave();
  }, [doSave]);

  // Debounced auto-save: trigger when elements change
  useEffect(() => {
    // Skip the initial render (don't save empty canvas or just-loaded state)
    if (!initialLoadDone.current) {
      if (elements.length > 0) {
        initialLoadDone.current = true;
        // If this is a brand new project (no existing project), don't save yet
        // Only save on actual edits
        if (project) {
          return; // Already loaded, no need to save
        }
      }
      return;
    }

    if (elements.length === 0) return;

    setSaveStatus('saving');

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      doSave();
      timerRef.current = null;
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [elements, debounceMs, doSave, project]);

  // Also save when project name changes (debounced)
  useEffect(() => {
    if (!initialLoadDone.current) return;
    if (!project) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      doSave();
      timerRef.current = null;
    }, debounceMs);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectName]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Synchronous save on unload (no thumbnail, just data)
      const currentElements = elementsRef.current;
      if (currentElements.length === 0) return;

      const proj = projectRef.current;
      if (proj) {
        const updated: SavedProject = {
          ...proj,
          name: nameRef.current,
          canvasWidth,
          canvasHeight,
          elements: structuredClone(currentElements),
          updatedAt: new Date().toISOString(),
        };
        try {
          localStorage.setItem(`sigma-project-${updated.id}`, JSON.stringify(updated));
        } catch { /* storage full - ignore */ }
      } else {
        // Create project synchronously
        createProject({
          name: nameRef.current,
          bootcamp,
          templateId,
          canvasWidth,
          canvasHeight,
          elements: structuredClone(currentElements),
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [canvasWidth, canvasHeight, bootcamp, templateId]);

  return {
    project,
    saveStatus,
    projectName,
    setProjectName,
    saveNow,
  };
}
