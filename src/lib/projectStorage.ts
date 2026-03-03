import { type CanvasElement } from '@/components/canva-editor/types';

// ── Types ──

export interface SavedProject {
  id: string;
  name: string;
  bootcamp: string;
  templateId: string;
  canvasWidth: number;
  canvasHeight: number;
  elements: CanvasElement[];
  thumbnail: string; // base64 data URL (~200px wide)
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

export interface ProjectIndexEntry {
  id: string;
  name: string;
  bootcamp: string;
  thumbnail: string;
  updatedAt: string;
  canvasWidth: number;
  canvasHeight: number;
}

// ── Constants ──

const INDEX_KEY = 'sigma-projects';
const PROJECT_PREFIX = 'sigma-project-';
const STORAGE_WARNING_THRESHOLD = 4 * 1024 * 1024; // 4MB — warn before 5MB limit

// ── Helpers ──

function generateId(): string {
  return `proj_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function getStorageUsage(): number {
  let total = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      total += (localStorage.getItem(key) || '').length * 2; // UTF-16 chars = ~2 bytes each
    }
  }
  return total;
}

// ── CRUD Operations ──

/** Get the lightweight project index (id, name, thumbnail, updatedAt) */
export function getProjectIndex(): ProjectIndexEntry[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ProjectIndexEntry[];
  } catch {
    return [];
  }
}

/** Save the project index */
function saveProjectIndex(index: ProjectIndexEntry[]): void {
  localStorage.setItem(INDEX_KEY, JSON.stringify(index));
}

/** Load full project data by ID */
export function loadProject(id: string): SavedProject | null {
  try {
    const raw = localStorage.getItem(`${PROJECT_PREFIX}${id}`);
    if (!raw) return null;
    return JSON.parse(raw) as SavedProject;
  } catch {
    return null;
  }
}

/** Create a new project and return it */
export function createProject(params: {
  name: string;
  bootcamp: string;
  templateId: string;
  canvasWidth: number;
  canvasHeight: number;
  elements: CanvasElement[];
  thumbnail?: string;
}): SavedProject {
  const now = new Date().toISOString();
  const project: SavedProject = {
    id: generateId(),
    name: params.name,
    bootcamp: params.bootcamp,
    templateId: params.templateId,
    canvasWidth: params.canvasWidth,
    canvasHeight: params.canvasHeight,
    elements: params.elements,
    thumbnail: params.thumbnail || '',
    createdAt: now,
    updatedAt: now,
  };

  // Save full project data
  localStorage.setItem(`${PROJECT_PREFIX}${project.id}`, JSON.stringify(project));

  // Update index
  const index = getProjectIndex();
  index.unshift({
    id: project.id,
    name: project.name,
    bootcamp: project.bootcamp,
    thumbnail: project.thumbnail,
    updatedAt: project.updatedAt,
    canvasWidth: project.canvasWidth,
    canvasHeight: project.canvasHeight,
  });
  saveProjectIndex(index);

  return project;
}

/** Save/update an existing project */
export function saveProject(project: SavedProject): void {
  project.updatedAt = new Date().toISOString();

  // Save full project data
  localStorage.setItem(`${PROJECT_PREFIX}${project.id}`, JSON.stringify(project));

  // Update index entry
  const index = getProjectIndex();
  const idx = index.findIndex(e => e.id === project.id);
  const entry: ProjectIndexEntry = {
    id: project.id,
    name: project.name,
    bootcamp: project.bootcamp,
    thumbnail: project.thumbnail,
    updatedAt: project.updatedAt,
    canvasWidth: project.canvasWidth,
    canvasHeight: project.canvasHeight,
  };

  if (idx >= 0) {
    index[idx] = entry;
  } else {
    index.unshift(entry);
  }

  // Sort by most recently updated
  index.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  saveProjectIndex(index);
}

/** Rename a project */
export function renameProject(id: string, newName: string): void {
  const project = loadProject(id);
  if (!project) return;
  project.name = newName;
  saveProject(project);
}

/** Duplicate a project */
export function duplicateProject(id: string): SavedProject | null {
  const original = loadProject(id);
  if (!original) return null;

  return createProject({
    name: `${original.name} (Copy)`,
    bootcamp: original.bootcamp,
    templateId: original.templateId,
    canvasWidth: original.canvasWidth,
    canvasHeight: original.canvasHeight,
    elements: structuredClone(original.elements),
    thumbnail: original.thumbnail,
  });
}

/** Delete a project */
export function deleteProject(id: string): void {
  localStorage.removeItem(`${PROJECT_PREFIX}${id}`);

  const index = getProjectIndex().filter(e => e.id !== id);
  saveProjectIndex(index);
}

/** Check if storage is getting full */
export function isStorageNearFull(): boolean {
  return getStorageUsage() > STORAGE_WARNING_THRESHOLD;
}

/** Format relative time (e.g., "2 hours ago") */
export function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;

  return new Date(isoDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}
