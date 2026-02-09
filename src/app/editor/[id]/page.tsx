'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useRef, useEffect } from 'react';
import templatesData from '@/data/templates.json';
import templateDesignsData from '@/data/templateDesigns.json';
import EditorSidebar from '@/components/EditorSidebar';
import LivePreview, { LivePreviewHandle } from '@/components/LivePreview';
import { useExportPng } from '@/hooks/useExportPng';
import { useToast } from '@/components/Toast';

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
}

const defaultFields: EditorFields = {
  headline: 'Build Real-World Data Pipelines',
  subheadline: 'From Zero to Production-Ready Engineer',
  cta: 'Start Learning Today',
  price: '₹12,000',
  courseName: 'Data Engineering Bootcamp 1.0',
  credibility: '1.4M+ YouTube Subscribers',
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
  const [selectedCharacter, setSelectedCharacter] = useState<SelectedCharacter | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const previewRef = useRef<LivePreviewHandle>(null);
  const { exportPng, isExporting } = useExportPng();

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

  const handleReset = () => {
    setFields(defaultFields);
    setSelectedDesignId(null);
    setCustomColors(null);
    setSelectedCharacter(null);
    showToast('info', 'Reset Complete', 'Fields restored to defaults');
  };

  const handleExport = async () => {
    if (!template || !previewRef.current) return;

    try {
      const element = previewRef.current.getExportElement();
      await exportPng(element, {
        templateName: template.name,
        width: template.dimensions.width,
        height: template.dimensions.height,
      });
      showToast('success', 'Export Complete', `${template.name} saved as PNG`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      showToast('error', 'Export Failed', message);
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
    <div className="min-h-screen bg-brand-gray/30 flex flex-col">
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
                  {template.dimensions.width} × {template.dimensions.height} • {template.platform}
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
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-ui text-sm font-medium bg-brand-lime text-brand-navy hover:bg-brand-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isExporting ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                )}
                <span className="hidden xs:inline">{isExporting ? 'Exporting...' : 'Export'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <EditorSidebar
          fields={fields}
          onFieldChange={handleFieldChange}
          onDesignSelect={handleDesignSelect}
          selectedDesignId={selectedDesignId}
          templateCategory={template.category}
          selectedCharacter={selectedCharacter}
          onCharacterSelect={handleCharacterSelect}
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
        />

        {/* Right Panel - Live Preview */}
        <LivePreview
          ref={previewRef}
          template={template}
          fields={fields}
          customColors={customColors}
          selectedDesignId={selectedDesignId}
          selectedCharacter={selectedCharacter}
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
    </div>
  );
}
