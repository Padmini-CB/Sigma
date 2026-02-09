'use client';

import { EditorFields, SelectedCharacter } from '@/app/editor/[id]/page';
import { CHARACTERS, CharacterKey, getCharacterImage } from '@/data/characters';
import templateDesignsData from '@/data/templateDesigns.json';
import { ALL_BOOTCAMPS, type BootcampKey } from '@/data/products';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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
  templateCategory: string;
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
  selectedCharacter?: SelectedCharacter | null;
  onCharacterSelect?: (character: SelectedCharacter | null) => void;
  selectedCourse?: BootcampKey | null;
  onCourseSelect?: (course: BootcampKey | null) => void;
}

interface FieldConfig {
  key: keyof EditorFields;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea';
  hint?: string;
}

const topFieldConfigs: FieldConfig[] = [
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
];

const priceFieldConfig: FieldConfig = {
  key: 'price',
  label: 'Price (Optional)',
  placeholder: '₹12,000',
  type: 'text',
};

const bottomFieldConfigs: FieldConfig[] = [
  {
    key: 'credibility',
    label: 'Trust Signal',
    placeholder: '1.4M+ YouTube Subscribers',
    type: 'text',
    hint: '1.4M+ YouTube, 44K+ Learners, 4.9 Rating',
  },
];

const CTA_PRESETS = [
  'Start Learning Today',
  'Explore the Bootcamp',
  'Join 44,000+ Learners',
  'Build Your Data Career',
  'Preview Sample Lessons',
  'Download Curriculum',
  'Talk to Our Team',
  'Claim Your Seat',
];

const CUSTOM_CTA_VALUE = '___custom___';

const designs = templateDesignsData.designs as TemplateDesign[];

function FieldRenderer({
  config,
  fields,
  onFieldChange,
  isMobile,
}: {
  config: FieldConfig;
  fields: EditorFields;
  onFieldChange: (field: keyof EditorFields, value: string) => void;
  isMobile?: boolean;
}) {
  const fieldId = `${isMobile ? 'mobile-' : ''}${config.key}`;
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={fieldId}
        className="block font-ui text-sm font-semibold text-brand-navy"
      >
        {config.label}
      </label>
      {config.type === 'textarea' ? (
        <textarea
          id={fieldId}
          value={fields[config.key]}
          onChange={(e) => onFieldChange(config.key, e.target.value)}
          placeholder={config.placeholder}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 font-body text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors resize-none"
        />
      ) : (
        <input
          type="text"
          id={fieldId}
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
  );
}

function CtaField({
  fields,
  onFieldChange,
  isMobile,
}: {
  fields: EditorFields;
  onFieldChange: (field: keyof EditorFields, value: string) => void;
  isMobile?: boolean;
}) {
  const isPreset = CTA_PRESETS.includes(fields.cta);
  const selectValue = isPreset ? fields.cta : CUSTOM_CTA_VALUE;
  const selectId = `${isMobile ? 'mobile-' : ''}cta-select`;
  const customId = `${isMobile ? 'mobile-' : ''}cta-custom`;

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={selectId}
        className="block font-ui text-sm font-semibold text-brand-navy"
      >
        Call to Action
      </label>
      <select
        id={selectId}
        value={selectValue}
        onChange={(e) => {
          if (e.target.value === CUSTOM_CTA_VALUE) {
            onFieldChange('cta', '');
          } else {
            onFieldChange('cta', e.target.value);
          }
        }}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-300 font-body text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors cursor-pointer"
      >
        {CTA_PRESETS.map((preset) => (
          <option key={preset} value={preset}>
            {preset}
          </option>
        ))}
        <option value={CUSTOM_CTA_VALUE}>Custom...</option>
      </select>
      {!isPreset && (
        <input
          type="text"
          id={customId}
          value={fields.cta}
          onChange={(e) => onFieldChange('cta', e.target.value)}
          placeholder="Enter custom CTA text..."
          className="w-full px-3 py-2 rounded-lg border border-gray-300 font-body text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
        />
      )}
      <p className="font-ui text-xs text-gray-400">
        What should the learner do next?
      </p>
    </div>
  );
}

const CHARACTER_LIST: { key: CharacterKey; color: string; borderColor: string; textColor: string }[] = [
  { key: 'peter', color: 'bg-orange-50', borderColor: 'border-orange-400', textColor: 'text-orange-700' },
  { key: 'tony', color: 'bg-red-50', borderColor: 'border-red-400', textColor: 'text-red-700' },
  { key: 'bruce', color: 'bg-purple-50', borderColor: 'border-purple-400', textColor: 'text-purple-700' },
];

function SidebarContent({
  fields,
  onFieldChange,
  onDesignSelect,
  selectedDesignId,
  templateCategory,
  onClose,
  isMobile,
  selectedCharacter,
  onCharacterSelect,
  selectedCourse,
  onCourseSelect,
}: Omit<EditorSidebarProps, 'isOpen'>) {
  const [activeTab, setActiveTab] = useState<'edit' | 'assets'>('edit');
  const [expandedCharacter, setExpandedCharacter] = useState<CharacterKey | null>(null);

  return (
    <>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline text-lg font-bold text-brand-navy">
              {activeTab === 'edit' ? 'Edit Content' : 'Assets'}
            </h2>
            <p className="font-body text-sm text-gray-500 mt-1">
              {activeTab === 'edit' ? 'Changes update the preview in real-time' : 'Drag elements to canvas (coming soon)'}
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

        {/* Tab Bar */}
        <div className="flex gap-1 mt-3 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 px-3 py-1.5 rounded-md font-ui text-sm font-semibold transition-colors ${
              activeTab === 'edit'
                ? 'bg-white text-brand-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Edit
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 px-3 py-1.5 rounded-md font-ui text-sm font-semibold transition-colors ${
              activeTab === 'assets'
                ? 'bg-white text-brand-navy shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Assets
          </button>
        </div>
      </div>

      {activeTab === 'assets' ? (
        /* Assets Panel */
        <div className="flex-1 overflow-y-auto p-4">
          {/* Active character indicator */}
          {selectedCharacter && (
            <div className="mb-4 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white">
                    <Image
                      src={selectedCharacter.image}
                      alt={selectedCharacter.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-ui text-xs font-semibold text-green-800">On Canvas</p>
                    <p className="font-ui text-xs text-green-600">{selectedCharacter.name} ({selectedCharacter.position})</p>
                  </div>
                </div>
                <button
                  onClick={() => onCharacterSelect?.(null)}
                  className="p-1 rounded hover:bg-green-100 text-green-600 transition-colors"
                  title="Remove from canvas"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <p className="font-ui text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
            Characters — Click to add to canvas
          </p>
          <div className="space-y-2 mb-6">
            {CHARACTER_LIST.map((charConfig) => {
              const char = CHARACTERS[charConfig.key];
              const isExpanded = expandedCharacter === charConfig.key;
              const isActive = selectedCharacter?.key === charConfig.key;
              const defaultImageSrc = getCharacterImage(charConfig.key);

              return (
                <div key={charConfig.key} className="space-y-1">
                  {/* Character header button */}
                  <button
                    onClick={() => {
                      if (isActive) {
                        onCharacterSelect?.(null);
                      } else {
                        onCharacterSelect?.({
                          key: charConfig.key,
                          name: char.name,
                          image: defaultImageSrc,
                          position: 'left',
                        });
                      }
                      setExpandedCharacter(isExpanded ? null : charConfig.key);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                      isActive
                        ? 'border-green-500 bg-green-50 shadow-md ring-2 ring-green-200'
                        : `${charConfig.borderColor} ${charConfig.color} hover:shadow-md`
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white flex-shrink-0">
                      <Image
                        src={defaultImageSrc}
                        alt={char.name}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 text-left">
                      <span className={`font-ui text-sm font-semibold ${isActive ? 'text-green-700' : charConfig.textColor}`}>
                        {char.name}
                      </span>
                      <p className="font-ui text-xs text-gray-400">{char.title}</p>
                    </div>
                    <span className="font-ui text-[10px] text-gray-400">{Object.keys(char.poses).length} poses</span>
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Expanded pose grid */}
                  {isExpanded && (
                    <div className="pl-2 pr-1 pb-1">
                      <p className="font-ui text-xs text-gray-400 mb-2 ml-1">Select pose:</p>
                      <div className="grid grid-cols-3 gap-1.5">
                        {Object.entries(char.poses).map(([pose, poseInfo]) => {
                          const isSelectedPose = isActive && selectedCharacter?.image === poseInfo.src;
                          return (
                            <button
                              key={pose}
                              onClick={() => {
                                onCharacterSelect?.({
                                  key: charConfig.key,
                                  name: char.name,
                                  image: poseInfo.src,
                                  position: selectedCharacter?.position || 'left',
                                });
                              }}
                              className={`relative rounded-lg overflow-hidden border-2 aspect-square transition-all ${
                                isSelectedPose
                                  ? 'border-green-500 ring-2 ring-green-200'
                                  : 'border-gray-200 hover:border-gray-400'
                              }`}
                              title={`${poseInfo.label} — ${poseInfo.useFor}`}
                            >
                              <Image
                                src={poseInfo.src}
                                alt={`${char.name} - ${poseInfo.label}`}
                                width={80}
                                height={80}
                                className="object-cover w-full h-full"
                              />
                              <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] font-ui text-center py-0.5">
                                {poseInfo.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {/* Position selector */}
                      {isActive && (
                        <div className="mt-2 ml-1">
                          <p className="font-ui text-xs text-gray-400 mb-1">Position:</p>
                          <div className="flex gap-1">
                            {(['left', 'right', 'bottom'] as const).map((pos) => (
                              <button
                                key={pos}
                                onClick={() => {
                                  if (selectedCharacter) {
                                    onCharacterSelect?.({ ...selectedCharacter, position: pos });
                                  }
                                }}
                                className={`px-2.5 py-1 rounded text-xs font-ui font-medium transition-colors capitalize ${
                                  selectedCharacter?.position === pos
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {pos}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Size Slider */}
                      {isActive && selectedCharacter && (
                        <div className="mt-4">
                          <label className="text-xs text-gray-500 block mb-2">Size</label>
                          <input
                            type="range"
                            min="150"
                            max="450"
                            step="25"
                            value={selectedCharacter.size || 250}
                            onChange={(e) => onCharacterSelect?.({
                              ...selectedCharacter,
                              size: parseInt(e.target.value)
                            })}
                            className="w-full accent-blue-500"
                          />
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>S</span>
                            <span>{selectedCharacter.size || 250}px</span>
                            <span>L</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* FOUNDERS SECTION */}
          <div className="mt-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Founders
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => onCharacterSelect?.({
                  key: 'dhaval',
                  name: 'Dhaval Patel',
                  image: '/assets/founders/Dhaval.png',
                  position: 'left',
                })}
                className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/founders/Dhaval.png" alt="Dhaval" className="w-10 h-10 rounded-full object-cover" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Dhaval Patel</p>
                  <p className="text-xs text-gray-500">Founder &amp; CEO</p>
                </div>
              </button>
              <button
                onClick={() => onCharacterSelect?.({
                  key: 'hemanand',
                  name: 'Hemanand Vadivel',
                  image: '/assets/founders/Hemanand.png',
                  position: 'left',
                })}
                className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/founders/Hemanand.png" alt="Hemanand" className="w-10 h-10 rounded-full object-cover" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Hemanand Vadivel</p>
                  <p className="text-xs text-gray-500">Co-Founder &amp; CTO</p>
                </div>
              </button>
              <button
                onClick={() => onCharacterSelect?.({
                  key: 'both',
                  name: 'Both Founders',
                  image: '/assets/founders/Both.png',
                  position: 'left',
                })}
                className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 transition"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/founders/Both.png" alt="Both Founders" className="w-10 h-10 rounded-full object-cover" />
                <div className="text-left">
                  <p className="font-semibold text-gray-800">Both Founders</p>
                  <p className="text-xs text-gray-500">For webinars &amp; trust</p>
                </div>
              </button>
            </div>
          </div>

          <p className="font-ui text-xs font-semibold text-gray-500 mb-3 mt-6 uppercase tracking-wide">
            Brand Elements
          </p>
          <div className="space-y-2">
            <div className="w-full p-3 rounded-lg border-2 border-red-400 bg-red-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
                    <rect width="20" height="14" rx="3" fill="white" />
                    <path d="M8 10V4L13.5 7L8 10Z" fill="#dc2626" />
                  </svg>
                </div>
                <div>
                  <span className="font-ui text-sm font-semibold text-red-700">YouTube Badge</span>
                  <p className="font-ui text-xs text-red-500">1.4M+ Subs &bull; 4.9 Rating</p>
                </div>
              </div>
              <p className="font-ui text-xs text-red-400 mt-2">Included in all rich templates automatically</p>
            </div>
          </div>

          <p className="font-body text-xs text-gray-400 mt-6 text-center italic">
            Drag &amp; drop coming in Sprint 4
          </p>
        </div>
      ) : (
      <>

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

      {/* Course Selector */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50 flex-shrink-0">
        <label className="block font-ui text-sm font-semibold text-brand-navy mb-2">
          Course / Bootcamp
        </label>
        <select
          value={selectedCourse || ''}
          onChange={(e) => {
            const key = e.target.value as BootcampKey | '';
            if (key && key in ALL_BOOTCAMPS) {
              onCourseSelect?.(key as BootcampKey);
              const course = ALL_BOOTCAMPS[key as BootcampKey];
              // Auto-populate courseName and price from product data
              onFieldChange('courseName', course.name);
              onFieldChange('price', course.price);
            } else {
              onCourseSelect?.(null);
            }
          }}
          className="w-full px-3 py-2.5 rounded-lg border border-gray-300 font-body text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors cursor-pointer"
        >
          <option value="">— Select a course —</option>
          <option value="da">Data Analytics Bootcamp 5.0</option>
          <option value="de">Data Engineering Bootcamp 1.0</option>
          <option value="ds-genai">GenAI & Data Science Bootcamp 3.0</option>
        </select>
        {selectedCourse && (
          <p className="font-ui text-xs text-green-700 mt-2">
            Course data will auto-populate template visuals
          </p>
        )}
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {topFieldConfigs.map((config) => (
          <FieldRenderer
            key={config.key}
            config={config}
            fields={fields}
            onFieldChange={onFieldChange}
            isMobile={isMobile}
          />
        ))}

        <CtaField
          fields={fields}
          onFieldChange={onFieldChange}
          isMobile={isMobile}
        />

        <FieldRenderer
          config={priceFieldConfig}
          fields={fields}
          onFieldChange={onFieldChange}
          isMobile={isMobile}
        />

        {bottomFieldConfigs.map((config) => (
          <FieldRenderer
            key={config.key}
            config={config}
            fields={fields}
            onFieldChange={onFieldChange}
            isMobile={isMobile}
          />
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
      )}
    </>
  );
}

export default function EditorSidebar({
  fields,
  onFieldChange,
  onDesignSelect,
  selectedDesignId,
  templateCategory,
  isOpen = true,
  onClose,
  isMobile = false,
  selectedCharacter,
  onCharacterSelect,
  selectedCourse,
  onCourseSelect,
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
            templateCategory={templateCategory}
            onClose={onClose}
            isMobile={true}
            selectedCharacter={selectedCharacter}
            onCharacterSelect={onCharacterSelect}
            selectedCourse={selectedCourse}
            onCourseSelect={onCourseSelect}
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
        templateCategory={templateCategory}
        isMobile={false}
        selectedCharacter={selectedCharacter}
        onCharacterSelect={onCharacterSelect}
        selectedCourse={selectedCourse}
        onCourseSelect={onCourseSelect}
      />
    </aside>
  );
}
