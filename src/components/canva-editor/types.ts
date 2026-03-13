// Canvas element types for the Canva-style editor

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export type CanvasElementType = 'image' | 'text' | 'button' | 'badge' | 'strip' | 'shape' | 'group';

export interface TextStyle {
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: 'normal' | 'italic';
  color: string;
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  textTransform: 'none' | 'uppercase' | 'lowercase';
  scaleX?: number;
}

export interface ImageStyle {
  objectFit: 'cover' | 'contain' | 'fill';
  borderRadius: number;
  maskType?: 'none' | 'radial' | 'linear';
  maskParams?: string;
  opacity?: number;
}

export interface ShapeStyle {
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  borderRadius: number;
}

export interface ButtonStyle {
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  borderRadius: number;
  borderColor?: string;
  borderWidth?: number;
  paddingX: number;
  paddingY: number;
}

export interface BadgeStyle {
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  borderRadius: number;
  borderColor?: string;
  borderWidth?: number;
  paddingX: number;
  paddingY: number;
  icon?: string;
}

export interface StripStyle {
  backgroundColor: string;
  textColor: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  paddingX: number;
  paddingY: number;
}

export interface CanvasElement {
  id: string;
  type: CanvasElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  groupId?: string;
  layerName?: string;

  // Content based on type
  content: string; // text content, image src, etc.

  // Style based on type
  textStyle?: TextStyle;
  imageStyle?: ImageStyle;
  shapeStyle?: ShapeStyle;
  buttonStyle?: ButtonStyle;
  badgeStyle?: BadgeStyle;
  stripStyle?: StripStyle;

  // For glow effects on hero images
  glowColor?: string;
}

export interface CanvasState {
  elements: CanvasElement[];
  selectedIds: string[];
  canvasWidth: number;
  canvasHeight: number;
  backgroundColor: string;
  backgroundGrid: boolean;
}

export interface SnapGuide {
  type: 'horizontal' | 'vertical';
  position: number;
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  elementStartPositions: Record<string, Position>;
}

export interface ResizeState {
  isResizing: boolean;
  handle: ResizeHandle;
  startX: number;
  startY: number;
  elementStartBounds: { x: number; y: number; width: number; height: number };
  lockAspectRatio: boolean;
  // Group resize support
  isGroupResize?: boolean;
  groupStartBounds?: { x: number; y: number; width: number; height: number };
  allElementStartData?: Record<string, { x: number; y: number; width: number; height: number; fontSize?: number }>;
}

export type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

export interface SelectionRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CanvasAction {
  type: string;
  timestamp: number;
  state: CanvasElement[];
}

// Template definition for the gallery
export interface TemplateDefinition {
  id: string;
  filename: string;
  label: string;
  description: string;
  group?: 'standalone' | 'carousel';
  elements: Omit<CanvasElement, 'id'>[];
  thumbnailColor?: string;
}

// Asset library items
export interface AssetItem {
  id: string;
  type: 'hero' | 'button' | 'badge' | 'strip' | 'logo' | 'html-component';
  label: string;
  thumbnail?: string;
  element: Omit<CanvasElement, 'id' | 'x' | 'y' | 'zIndex'>;
  htmlSnippet?: string;
}

export interface AssetSection {
  id: string;
  label: string;
  expanded: boolean;
  subsections: AssetSubsection[];
}

export interface AssetSubsection {
  id: string;
  label: string;
  items: AssetItem[];
}

// Ad size configuration
export interface CanvasSize {
  id: string;
  label: string;
  width: number;
  height: number;
  description: string;
  category?: 'ad-creatives' | 'homepage-banner';
}

export const CANVAS_SIZES: CanvasSize[] = [
  { id: 'square', label: '1080 x 1080', width: 1080, height: 1080, description: 'Instagram/LinkedIn Feed', category: 'ad-creatives' },
  { id: 'story', label: '1080 x 1920', width: 1080, height: 1920, description: 'Instagram Story', category: 'ad-creatives' },
  { id: 'landscape', label: '1200 x 628', width: 1200, height: 628, description: 'Facebook/LinkedIn Landscape', category: 'ad-creatives' },
  { id: 'youtube', label: '1280 x 720', width: 1280, height: 720, description: 'YouTube Thumbnail', category: 'ad-creatives' },
  { id: 'portrait', label: '1080 x 1350', width: 1080, height: 1350, description: 'Instagram Portrait', category: 'ad-creatives' },
  { id: 'homepage-banner', label: '1920 x 680', width: 1920, height: 680, description: 'Homepage Banner (Full)', category: 'homepage-banner' },
  { id: 'homepage-banner-small', label: '800 x 283', width: 800, height: 283, description: 'Homepage Small', category: 'homepage-banner' },
  { id: 'homepage-banner-large', label: '1300 x 500', width: 1300, height: 500, description: 'Homepage Large', category: 'homepage-banner' },
];
