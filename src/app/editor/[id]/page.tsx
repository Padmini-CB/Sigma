'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import templatesData from '@/data/templates.json';
import templateDesignsData from '@/data/templateDesigns.json';
import EditorSidebar from '@/components/EditorSidebar';
import LivePreview, { LivePreviewHandle } from '@/components/LivePreview';
import { useExportPng } from '@/hooks/useExportPng';
import { useToast } from '@/components/Toast';
import { AIGenerateModal, GeneratedCreative } from '@/components/AIGenerateModal';
import { CHARACTERS, getCharacterImage, CharacterKey } from '@/data/characters';
import { type BootcampKey } from '@/data/products';
import { type FontSizeConfig, type PerSizeFontConfig, FONT_SIZE_PRESETS, DEFAULT_PRESET, buildDefaultPerSizeFonts } from '@/config/fontSizes';
import SizeTabBar from '@/components/SizeTabBar';
import { AD_SIZES, DEFAULT_AD_SIZE, type AdSize } from '@/config/adSizes';
import { type AIEngElementId, type ElementLayout, type ElementOverrides, type PerSizeElementOverrides } from '@/components/DraggableTemplateElement';

interface Template {
  id: string;
  name: string;
  category: string;
  platform: string;
  dimensions: {
    width: number;
    height: number;
  };
  aspectRatio: string;
  useCase: string;
  description: string;
  previewColors: string[];
}

interface TemplateDesign {
  id: string;
  name: string;
  description: string;
  category: string;
  applicableTo: string[];
  fields: EditorFields;
  previewColors: string[];
}

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
  // Interactive placement (set after drag/resize)
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  zIndex?: number;
  expressionId?: string;
  personId?: string;
}

const defaultFields: EditorFields = {
  headline: 'Build Real-World Data Pipelines',
  subheadline: 'From Zero to Production-Ready Engineer',
  cta: 'Start Learning Today',
  price: '₹12,000',
  courseName: 'Data Engineering Bootcamp 1.0',
  credibility: '1 Million+ YouTube Subscribers',
  bodyText: '7 Business Projects • 2 Virtual Internships • Lifetime Access',
};

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = params.id as string;
  const { showToast } = useToast();

  const template = useMemo(() => {
    return templatesData.templates.find((t) => t.id === templateId) as Template | undefined;
  }, [templateId]);

  // Pre-fill fields from query params if coming from intent flow
  const initialFields = useMemo(() => {
    const headline = searchParams.get('headline');
    if (headline) {
      return { ...defaultFields, headline };
    }
    return defaultFields;
  }, [searchParams]);

  const [fields, setFields] = useState<EditorFields>(initialFields);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [customColors, setCustomColors] = useState<string[] | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [jesterLine, setJesterLine] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<BootcampKey | null>(null);
  const [activeSize, setActiveSize] = useState<AdSize>(DEFAULT_AD_SIZE);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const previewRef = useRef<LivePreviewHandle>(null);
  const { exportPng, isExporting } = useExportPng();

  // ── Per-size font state ──
  const [perSizeFonts, setPerSizeFonts] = useState<PerSizeFontConfig>(() =>
    buildDefaultPerSizeFonts(AD_SIZES.map(s => s.id)),
  );
  // Track which sizes have been manually edited (for badge indicators)
  const [editedSizes, setEditedSizes] = useState<Set<string>>(new Set());

  // Derived: current size's font config
  const fontSizes = perSizeFonts[activeSize.id] ?? { ...FONT_SIZE_PRESETS[DEFAULT_PRESET].sizes };
  const setFontSizes = useCallback((sizes: FontSizeConfig) => {
    setPerSizeFonts(prev => ({ ...prev, [activeSize.id]: sizes }));
    setEditedSizes(prev => { const next = new Set(prev); next.add(activeSize.id); return next; });
  }, [activeSize.id]);

  // ── Per-size character placement ──
  const [perSizeCharacter, setPerSizeCharacter] = useState<Record<string, SelectedCharacter | null>>({});

  // Derived: current size's character
  const selectedCharacter = perSizeCharacter[activeSize.id] ?? null;
  const setSelectedCharacter = useCallback((char: SelectedCharacter | null) => {
    setPerSizeCharacter(prev => ({ ...prev, [activeSize.id]: char }));
  }, [activeSize.id]);

  // ── Hero image for AI Engineering template ──
  const [heroImage, setHeroImage] = useState<string>('/images/bootcamps/ai-engineering/heroes/superhero-trio.png');

  // ── Per-size element overrides (for draggable template elements) ──
  const [perSizeElementOverrides, setPerSizeElementOverrides] = useState<PerSizeElementOverrides>({});
  const [selectedElement, setSelectedElement] = useState<AIEngElementId | null>(null);

  // Derived: current size's element overrides
  const elementOverrides: ElementOverrides = perSizeElementOverrides[activeSize.id] ?? {};
  const handleElementUpdate = useCallback((id: AIEngElementId, updates: Partial<ElementLayout>) => {
    setPerSizeElementOverrides(prev => {
      const current = prev[activeSize.id] ?? {};
      const existing = current[id] ?? { offsetX: 0, offsetY: 0 };
      return {
        ...prev,
        [activeSize.id]: {
          ...current,
          [id]: { ...existing, ...updates },
        },
      };
    });
  }, [activeSize.id]);

  const handleElementSelect = useCallback((id: AIEngElementId | null) => {
    setSelectedElement(id);
  }, []);

  // Apply character to ALL sizes (convenience action)
  const handleApplyCharacterToAll = useCallback(() => {
    const current = perSizeCharacter[activeSize.id] ?? null;
    setPerSizeCharacter(() => {
      const next: Record<string, SelectedCharacter | null> = {};
      for (const size of AD_SIZES) {
        next[size.id] = current;
      }
      return next;
    });
  }, [activeSize.id, perSizeCharacter]);

  // Auto-select design from query params (e.g., coming from concept flow)
  useEffect(() => {
    const designId = searchParams.get('designId');
    if (designId && !selectedDesignId) {
      const designs = templateDesignsData.designs as TemplateDesign[];
      const design = designs.find(d => d.id === designId);
      if (design) {
        setSelectedDesignId(design.id);
        setFields(design.fields);
        setCustomColors(design.previewColors);
      }
    }
  }, [searchParams, selectedDesignId]);

  const handleFieldChange = (field: keyof EditorFields, value: string) => {
    setFields((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDesignSelect = (design: TemplateDesign) => {
    setSelectedDesignId(design.id);
    setFields(design.fields);
    setCustomColors(design.previewColors);
    showToast('success', 'Design Applied', `"${design.name}" template loaded`);
    // Close mobile sidebar after selecting
    setIsSidebarOpen(false);
  };

  const handleCharacterSelect = (character: SelectedCharacter | null) => {
    setSelectedCharacter(character);
    if (character) {
      showToast('success', 'Character Added', `${character.name} added to canvas`);
    }
    setIsSidebarOpen(false);
  };

  const handleCharacterUpdate = useCallback((updates: Partial<SelectedCharacter>) => {
    setPerSizeCharacter(prev => {
      const current = prev[activeSize.id] ?? null;
      if (!current) return prev;
      return { ...prev, [activeSize.id]: { ...current, ...updates } };
    });
  }, [activeSize.id]);

  const handleCharacterDelete = useCallback(() => {
    setSelectedCharacter(null);
  }, []);

  const handleReset = () => {
    setFields(defaultFields);
    setSelectedDesignId(null);
    setCustomColors(null);
    setPerSizeCharacter({});
    setSelectedCourse(null);
    setPerSizeFonts(buildDefaultPerSizeFonts(AD_SIZES.map(s => s.id)));
    setEditedSizes(new Set());
    setPerSizeElementOverrides({});
    setSelectedElement(null);
    showToast('info', 'Reset Complete', 'Fields restored to defaults');
  };

  const handleAIGenerate = (result: GeneratedCreative) => {
    // Update form fields with generated content
    setFields((prev) => ({
      ...prev,
      headline: result.headline,
      subheadline: result.subheadline,
      bodyText: result.bodyText,
      cta: result.cta,
    }));

    // Set jester line if provided
    if (result.jesterLine) {
      setJesterLine(result.jesterLine);
    }

    // Set character if provided
    if (result.character?.name) {
      const charKey = result.character.name.toLowerCase() as CharacterKey;
      const char = CHARACTERS[charKey];
      if (char) {
        setSelectedCharacter({
          key: charKey,
          name: char.name,
          image: getCharacterImage(charKey, result.character.pose),
          position: result.character.position || 'left',
          size: result.character.size || 250,
        });
      }
    }

    // Set founder if provided
    if (result.founder?.name) {
      const founderMap: Record<string, { key: string; image: string }> = {
        'Dhaval Patel': { key: 'dhaval', image: '/assets/founders/Dhaval.png' },
        'Hemanand Vadivel': { key: 'hemanand', image: '/assets/founders/Hemanand.png' },
      };
      const founder = founderMap[result.founder.name];
      if (founder) {
        setSelectedCharacter({
          key: founder.key,
          name: result.founder.name,
          image: founder.image,
          position: result.founder.position || 'left',
        });
      }
    }

    showToast(
      'success',
      result.isDemo ? 'Demo Creative Applied' : 'AI Generated',
      result.isDemo
        ? 'Using pre-built creative. Add an API key for live generation.'
        : 'Creative content has been applied to the editor'
    );
  };

  const handleExport = async () => {
    if (!template || !previewRef.current) return;

    try {
      const element = previewRef.current.getExportElement();
      await exportPng(element, {
        templateName: template.name,
        width: activeSize.width,
        height: activeSize.height,
      });
      showToast('success', 'Export Complete', `${template.name} (${activeSize.width}×${activeSize.height}) saved as PNG`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      showToast('error', 'Export Failed', message);
    }
  };

  const handleDownloadAll = async () => {
    if (!template || !previewRef.current || isExportingAll) return;

    setIsExportingAll(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      const sanitizedName = template.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      for (const size of AD_SIZES) {
        const sizeFonts = perSizeFonts[size.id] ?? fontSizes;
        const sizeChar = perSizeCharacter[size.id] ?? null;
        const dataUrl = await previewRef.current.renderAtSize(size.width, size.height, sizeFonts, sizeChar);
        // Convert data URL to binary
        const base64 = dataUrl.split(',')[1];
        zip.file(`${sanitizedName}-${size.width}x${size.height}.png`, base64, { base64: true });
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${sanitizedName}-all-sizes.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('success', 'Download Complete', `${AD_SIZES.length} sizes exported as ZIP`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      showToast('error', 'Export Failed', message);
    } finally {
      setIsExportingAll(false);
    }
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-brand-gray/30 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="font-headline text-2xl font-bold text-brand-navy mb-2">
            Template Not Found
          </h1>
          <p className="font-body text-gray-600 mb-6">
            The template you&apos;re looking for doesn&apos;t exist or may have been removed.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-cta inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-brand-gray/30 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-dark border-b border-white/10 flex-shrink-0">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              {/* Mobile menu button */}
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors lg:hidden"
                aria-label="Open editor sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <button
                onClick={() => router.push('/')}
                className="hidden sm:flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-ui text-sm">Back</span>
              </button>
              <div className="h-6 w-px bg-white/20 hidden sm:block" />
              <div className="min-w-0">
                <h1 className="font-headline text-lg sm:text-xl font-bold text-white truncate">
                  {template.name}
                </h1>
                <p className="font-ui text-xs text-gray-400 truncate">
                  {activeSize.width} × {activeSize.height} • {template.platform}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={handleReset}
                className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-ui text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="hidden md:inline">Reset</span>
              </button>
              <button
                onClick={() => setShowAIModal(true)}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-ui text-sm font-semibold rounded-lg hover:opacity-90 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                <span className="hidden sm:inline">Generate with AI</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Size Tab Bar — sits between header and canvas, does NOT scroll */}
      <SizeTabBar
        activeSize={activeSize}
        onSizeChange={setActiveSize}
        onDownload={handleExport}
        onDownloadAll={handleDownloadAll}
        isExporting={isExporting}
        isExportingAll={isExportingAll}
        editedSizes={editedSizes}
      />

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Desktop Sidebar */}
        <EditorSidebar
          fields={fields}
          onFieldChange={handleFieldChange}
          onDesignSelect={handleDesignSelect}
          selectedDesignId={selectedDesignId}
          templateCategory={template.category}
          selectedCharacter={selectedCharacter}
          onCharacterSelect={handleCharacterSelect}
          selectedCourse={selectedCourse}
          onCourseSelect={setSelectedCourse}
          fontSizes={fontSizes}
          onFontSizesChange={setFontSizes}
          activeSizeLabel={`${activeSize.label} (${activeSize.width} × ${activeSize.height})`}
          onApplyCharacterToAll={handleApplyCharacterToAll}
          isAIEngTemplate={selectedDesignId === 'ai-engineering-bootcamp-thumbnail'}
          selectedElement={selectedElement}
          elementOverrides={elementOverrides}
          onElementUpdate={handleElementUpdate}
          canvasWidth={activeSize.width}
          canvasHeight={activeSize.height}
          heroImage={heroImage}
          onHeroImageChange={setHeroImage}
        />

        {/* Mobile Sidebar Drawer */}
        <EditorSidebar
          fields={fields}
          onFieldChange={handleFieldChange}
          onDesignSelect={handleDesignSelect}
          selectedDesignId={selectedDesignId}
          templateCategory={template.category}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          isMobile={true}
          selectedCharacter={selectedCharacter}
          onCharacterSelect={handleCharacterSelect}
          selectedCourse={selectedCourse}
          onCourseSelect={setSelectedCourse}
          fontSizes={fontSizes}
          onFontSizesChange={setFontSizes}
          activeSizeLabel={`${activeSize.label} (${activeSize.width} × ${activeSize.height})`}
          onApplyCharacterToAll={handleApplyCharacterToAll}
          isAIEngTemplate={selectedDesignId === 'ai-engineering-bootcamp-thumbnail'}
          selectedElement={selectedElement}
          elementOverrides={elementOverrides}
          onElementUpdate={handleElementUpdate}
          canvasWidth={activeSize.width}
          canvasHeight={activeSize.height}
          heroImage={heroImage}
          onHeroImageChange={setHeroImage}
        />

        {/* Right Panel - Live Preview */}
        <LivePreview
          ref={previewRef}
          template={template}
          fields={fields}
          customColors={customColors}
          selectedDesignId={selectedDesignId}
          selectedCharacter={selectedCharacter}
          jesterLine={jesterLine}
          selectedCourse={selectedCourse}
          fontSizes={fontSizes}
          onCharacterUpdate={handleCharacterUpdate}
          onCharacterDelete={handleCharacterDelete}
          overrideDimensions={{ width: activeSize.width, height: activeSize.height }}
          perSizeFonts={perSizeFonts}
          perSizeCharacter={perSizeCharacter}
          elementOverrides={elementOverrides}
          onElementUpdate={handleElementUpdate}
          selectedElement={selectedElement}
          onElementSelect={handleElementSelect}
          perSizeElementOverrides={perSizeElementOverrides}
          heroImage={heroImage}
        />
      </div>

      {/* Mobile Bottom Bar */}
      <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between flex-shrink-0">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-medium bg-brand-blue text-white"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Content
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Reset"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Back to dashboard"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>
      </div>

      {/* AI Generate Modal */}
      <AIGenerateModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}
