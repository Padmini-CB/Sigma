'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo, useRef } from 'react';
import templatesData from '@/data/templates.json';
import EditorSidebar from '@/components/EditorSidebar';
import LivePreview, { LivePreviewHandle } from '@/components/LivePreview';
import { useExportPng } from '@/hooks/useExportPng';

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
  originalPrice: string;
  courseName: string;
  credibility: string;
  bodyText: string;
}

const defaultFields: EditorFields = {
  headline: 'Build Real-World Data Pipelines',
  subheadline: 'From Zero to Production-Ready Engineer',
  cta: 'Start Learning Today',
  price: '₹12,000',
  originalPrice: '₹24,000',
  courseName: 'Data Engineering Bootcamp 1.0',
  credibility: '1.4M+ YouTube Subscribers',
  bodyText: '7 Business Projects • 2 Virtual Internships • Lifetime Access',
};

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.id as string;

  const template = useMemo(() => {
    return templatesData.templates.find((t) => t.id === templateId) as Template | undefined;
  }, [templateId]);

  const [fields, setFields] = useState<EditorFields>(defaultFields);
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null);
  const [customColors, setCustomColors] = useState<string[] | null>(null);
  const previewRef = useRef<LivePreviewHandle>(null);
  const { exportPng, isExporting } = useExportPng();

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
  };

  const handleReset = () => {
    setFields(defaultFields);
    setSelectedDesignId(null);
    setCustomColors(null);
  };

  const handleExport = async () => {
    if (!template || !previewRef.current) return;

    const element = previewRef.current.getExportElement();
    await exportPng(element, {
      templateName: template.name,
      width: template.dimensions.width,
      height: template.dimensions.height,
    });
  };

  if (!template) {
    return (
      <div className="min-h-screen bg-brand-gray/30 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-headline text-2xl font-bold text-brand-navy mb-4">
            Template Not Found
          </h1>
          <p className="font-body text-gray-600 mb-6">
            The template you&apos;re looking for doesn&apos;t exist.
          </p>
          <button
            onClick={() => router.push('/')}
            className="btn-cta"
          >
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
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-ui text-sm">Back</span>
              </button>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <h1 className="font-headline text-xl font-bold text-white">
                  {template.name}
                </h1>
                <p className="font-ui text-xs text-gray-400">
                  {template.dimensions.width} × {template.dimensions.height} • {template.platform}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-medium bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-ui text-sm font-medium bg-brand-lime text-brand-navy hover:bg-brand-lime/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                {isExporting ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Form Fields */}
        <EditorSidebar
          fields={fields}
          onFieldChange={handleFieldChange}
          onDesignSelect={handleDesignSelect}
          selectedDesignId={selectedDesignId}
        />

        {/* Right Panel - Live Preview */}
        <LivePreview
          ref={previewRef}
          template={template}
          fields={fields}
          customColors={customColors}
        />
      </div>
    </div>
  );
}
