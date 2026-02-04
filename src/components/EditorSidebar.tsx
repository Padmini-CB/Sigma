'use client';

import { EditorFields } from '@/app/editor/[id]/page';
import templateDesignsData from '@/data/templateDesigns.json';
import { useEffect } from 'react';

interface TemplateDesign {
  id: string;
  name: string;
  description: string;
  category: string;
  applicableTo: string[];
  fields: EditorFields;
  previewColors: string[];
}

interface EditorSidebarProps {
  fields: EditorFields;
  onFieldChange: (field: keyof EditorFields, value: string) => void;
  onDesignSelect: (design: TemplateDesign) => void;
  selectedDesignId: string | null;
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

interface FieldConfig {
  key: keyof EditorFields;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea';
  hint?: string;
}

const fieldConfigs: FieldConfig[] = [
  {
    key: 'headline',
    label: 'Headline',
    placeholder: 'Enter main headline...',
    type: 'text',
    hint: 'Lead with the transformation or outcome',
  },
  {
    key: 'subheadline',
    label: 'Subheadline',
    placeholder: 'Enter supporting text...',
    type: 'text',
    hint: 'Support the headline with specifics',
  },
  {
    key: 'courseName',
    label: 'Course Name',
    placeholder: 'Enter course name...',
    type: 'text',
  },
  {
    key: 'bodyText',
    label: 'Body Text',
    placeholder: 'Enter body text or features...',
    type: 'textarea',
    hint: 'Highlight what the learner gets',
  },
  {
    key: 'cta',
    label: 'Call to Action',
    placeholder: 'Enter CTA text...',
    type: 'text',
    hint: 'What should the learner do next?',
  },
  {
    key: 'price',
    label: 'Price',
    placeholder: '₹12,000',
    type: 'text',
  },
  {
    key: 'originalPrice',
    label: 'Compare At Price',
    placeholder: '₹24,000',
    type: 'text',
    hint: 'Shows value compared to full program investment',
  },
  {
    key: 'credibility',
    label: 'Trust Signal',
    placeholder: '1.4M+ YouTube Subscribers',
    type: 'text',
    hint: '1.4M+ YouTube, 44K+ Learners, 4.9 Rating',
  },
];

const designs = templateDesignsData.designs as TemplateDesign[];

function SidebarContent({
  fields,
  onFieldChange,
  onDesignSelect,
  selectedDesignId,
  onClose,
  isMobile
}: Omit<EditorSidebarProps, 'isOpen'>) {
  return (
    <>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-lg font-bold text-brand-navy">
              Edit Content
            </h2>
            <p className="font-body text-sm text-gray-500 mt-1">
              Changes update the preview in real-time
            </p>
          </div>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Template Design Selector */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-brand-blue/5 to-brand-purple/5 flex-shrink-0">
        <label className="block font-ui text-sm font-semibold text-brand-navy mb-2">
          Quick Start: Select a Design
        </label>
        <select
          value={selectedDesignId || ''}
          onChange={(e) => {
            const design = designs.find(d => d.id === e.target.value);
            if (design) onDesignSelect(design);
          }}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 font-body text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors cursor-pointer"
        >
          <option value="">— Choose a pre-made design —</option>
          {designs.map((design) => (
            <option key={design.id} value={design.id}>
              {design.name} — {design.category}
            </option>
          ))}
        </select>
        {selectedDesignId && (
          <p className="font-ui text-xs text-brand-purple mt-2">
            {designs.find(d => d.id === selectedDesignId)?.description}
          </p>
        )}
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {fieldConfigs.map((config) => (
          <div key={config.key} className="space-y-1.5">
            <label
              htmlFor={`${isMobile ? 'mobile-' : ''}${config.key}`}
              className="block font-ui text-sm font-semibold text-brand-navy"
            >
              {config.label}
            </label>
            {config.type === 'textarea' ? (
              <textarea
                id={`${isMobile ? 'mobile-' : ''}${config.key}`}
                value={fields[config.key]}
                onChange={(e) => onFieldChange(config.key, e.target.value)}
                placeholder={config.placeholder}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-body text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                id={`${isMobile ? 'mobile-' : ''}${config.key}`}
                value={fields[config.key]}
                onChange={(e) => onFieldChange(config.key, e.target.value)}
                placeholder={config.placeholder}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-body text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
              />
            )}
            {config.hint && (
              <p className="font-ui text-xs text-gray-400">{config.hint}</p>
            )}
          </div>
        ))}
      </div>

      {/* Brand Colors Reference */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <p className="font-ui text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
          Brand Colors
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-brand-blue" title="#3B82F6" />
            <span className="font-ui text-xs text-gray-500">Blue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-brand-purple" title="#6F53C1" />
            <span className="font-ui text-xs text-gray-500">Purple</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded bg-brand-navy" title="#181830" />
            <span className="font-ui text-xs text-gray-500">Navy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded border border-gray-300 bg-brand-lime" title="#D7EF3F" />
            <span className="font-ui text-xs text-gray-500">Lime</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default function EditorSidebar({
  fields,
  onFieldChange,
  onDesignSelect,
  selectedDesignId,
  isOpen = true,
  onClose,
  isMobile = false
}: EditorSidebarProps) {
  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobile, isOpen]);

  // Mobile drawer mode
  if (isMobile) {
    return (
      <>
        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 drawer-overlay z-40 lg:hidden animate-fade-in"
            onClick={onClose}
            aria-hidden="true"
          />
        )}

        {/* Drawer */}
        <aside
          className={`fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 flex flex-col lg:hidden transform transition-transform duration-300 ease-out ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          aria-label="Edit sidebar"
        >
          <SidebarContent
            fields={fields}
            onFieldChange={onFieldChange}
            onDesignSelect={onDesignSelect}
            selectedDesignId={selectedDesignId}
            onClose={onClose}
            isMobile={true}
          />
        </aside>
      </>
    );
  }

  // Desktop sidebar mode
  return (
    <aside className="w-80 xl:w-96 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden hidden lg:flex">
      <SidebarContent
        fields={fields}
        onFieldChange={onFieldChange}
        onDesignSelect={onDesignSelect}
        selectedDesignId={selectedDesignId}
        isMobile={false}
      />
    </aside>
  );
}
