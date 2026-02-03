'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import TemplateCard from '@/components/TemplateCard';
import FilterBar from '@/components/FilterBar';
import templatesData from '@/data/templates.json';

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

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const templates: Template[] = templatesData.templates;
  const categories: Category[] = templatesData.categories;

  // Filter templates based on active filter
  const filteredTemplates = useMemo(() => {
    if (activeFilter === 'All') {
      return templates;
    }
    return templates.filter((template) => template.category === activeFilter);
  }, [templates, activeFilter]);

  // Group templates by category for the "All" view
  const groupedTemplates = useMemo(() => {
    if (activeFilter !== 'All') {
      return null;
    }
    return categories.reduce((acc, category) => {
      acc[category.id] = templates.filter((t) => t.category === category.id);
      return acc;
    }, {} as Record<string, Template[]>);
  }, [templates, categories, activeFilter]);

  const handleTemplateClick = (template: Template) => {
    router.push(`/editor/${template.id}`);
  };

  return (
    <div className="min-h-screen bg-brand-gray/30">
      {/* Header */}
      <header className="bg-gradient-dark border-b border-white/10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-headline text-4xl font-bold text-white mb-2">
                SIGMA
              </h1>
              <p className="font-body text-lg text-gray-400">
                Strategic Image Generation for Marketing Assets
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Credibility Badge */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-4 py-2">
                <div className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
                <span className="font-ui text-sm text-white">
                  1.4M+ YouTube Subscribers
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h2 className="font-headline text-3xl font-bold text-brand-navy mb-2">
            Template Library
          </h2>
          <p className="font-body text-gray-600 max-w-2xl">
            Choose a template to start creating brand-compliant marketing assets.
            All templates follow Codebasics visual identity guidelines.
          </p>
        </div>

        {/* Filter Bar */}
        <FilterBar
          categories={categories}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          templateCount={filteredTemplates.length}
        />

        {/* Template Grid */}
        {activeFilter === 'All' && groupedTemplates ? (
          // Grouped view when showing all
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryTemplates = groupedTemplates[category.id];
              if (!categoryTemplates || categoryTemplates.length === 0) return null;

              return (
                <section key={category.id}>
                  <div className="flex items-center gap-3 mb-6">
                    <h3 className="font-headline text-xl font-bold text-brand-navy">
                      {category.name}
                    </h3>
                    <span className="font-ui text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                      {categoryTemplates.length} templates
                    </span>
                  </div>
                  <p className="font-body text-sm text-gray-500 mb-4">
                    {category.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categoryTemplates.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={template}
                        onClick={() => handleTemplateClick(template)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          // Flat grid when filtering by category
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onClick={() => handleTemplateClick(template)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredTemplates.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-headline text-lg font-semibold text-gray-700 mb-2">
              No templates found
            </h3>
            <p className="font-body text-gray-500">
              Try selecting a different category.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy/5 border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <p className="font-ui text-sm text-gray-500">
              Codebasics Internal Tool
            </p>
            <div className="flex items-center gap-4">
              <span className="font-ui text-xs text-gray-400">
                Brand Colors:
              </span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-brand-blue" title="Blue" />
                <div className="w-4 h-4 rounded bg-brand-purple" title="Purple" />
                <div className="w-4 h-4 rounded bg-brand-navy" title="Navy" />
                <div className="w-4 h-4 rounded bg-brand-lime" title="Lime" />
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
