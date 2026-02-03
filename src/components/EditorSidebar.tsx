'use client';

import { EditorFields } from '@/app/editor/[id]/page';

interface EditorSidebarProps {
  fields: EditorFields;
  onFieldChange: (field: keyof EditorFields, value: string) => void;
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
    hint: 'Use Sage-approved words: Build, Pipeline, Real-World',
  },
  {
    key: 'subheadline',
    label: 'Subheadline',
    placeholder: 'Enter supporting text...',
    type: 'text',
    hint: 'Clarify the value proposition',
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
    hint: 'List key features or benefits',
  },
  {
    key: 'cta',
    label: 'Call to Action',
    placeholder: 'Enter CTA text...',
    type: 'text',
    hint: 'Action-oriented, specific',
  },
  {
    key: 'price',
    label: 'Price',
    placeholder: '₹12,000',
    type: 'text',
  },
  {
    key: 'originalPrice',
    label: 'Original Price (Strikethrough)',
    placeholder: '₹24,000',
    type: 'text',
    hint: 'Use Sage framing: "Merit-Based Fee Waiver"',
  },
  {
    key: 'credibility',
    label: 'Credibility Indicator',
    placeholder: '1.4M+ YouTube Subscribers',
    type: 'text',
    hint: '1.4M+ YouTube, 44K+ Learners, 4.9 Rating',
  },
];

export default function EditorSidebar({ fields, onFieldChange }: EditorSidebarProps) {
  return (
    <aside className="w-96 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="font-headline text-lg font-bold text-brand-navy">
          Edit Content
        </h2>
        <p className="font-body text-sm text-gray-500 mt-1">
          Changes update the preview in real-time
        </p>
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {fieldConfigs.map((config) => (
          <div key={config.key} className="space-y-1.5">
            <label
              htmlFor={config.key}
              className="block font-ui text-sm font-semibold text-brand-navy"
            >
              {config.label}
            </label>
            {config.type === 'textarea' ? (
              <textarea
                id={config.key}
                value={fields[config.key]}
                onChange={(e) => onFieldChange(config.key, e.target.value)}
                placeholder={config.placeholder}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-body text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors resize-none"
              />
            ) : (
              <input
                type="text"
                id={config.key}
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
        <div className="flex items-center gap-2">
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
    </aside>
  );
}
