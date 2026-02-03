'use client';

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

interface TemplateCardProps {
  template: Template;
  onClick?: () => void;
}

export default function TemplateCard({ template, onClick }: TemplateCardProps) {
  const { name, category, platform, dimensions, aspectRatio, useCase, previewColors } = template;

  // Calculate preview dimensions maintaining aspect ratio
  const previewMaxWidth = 200;
  const previewMaxHeight = 140;
  const ratio = dimensions.width / dimensions.height;

  let previewWidth: number;
  let previewHeight: number;

  if (ratio > previewMaxWidth / previewMaxHeight) {
    previewWidth = previewMaxWidth;
    previewHeight = previewMaxWidth / ratio;
  } else {
    previewHeight = previewMaxHeight;
    previewWidth = previewMaxHeight * ratio;
  }

  // Category badge colors
  const categoryColors: Record<string, { bg: string; text: string }> = {
    PPC: { bg: 'bg-brand-blue', text: 'text-white' },
    Social: { bg: 'bg-brand-purple', text: 'text-white' },
    YouTube: { bg: 'bg-red-500', text: 'text-white' },
    Email: { bg: 'bg-brand-lime', text: 'text-brand-navy' },
    Flyer: { bg: 'bg-brand-navy', text: 'text-white' },
  };

  const badgeStyle = categoryColors[category] || { bg: 'bg-gray-500', text: 'text-white' };

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-brand-blue/30 transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail Preview */}
      <div className="h-44 bg-brand-navy/5 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Abstract gradient preview */}
        <div
          className="rounded-lg shadow-md flex items-center justify-center overflow-hidden relative"
          style={{
            width: `${previewWidth}px`,
            height: `${previewHeight}px`,
            background: `linear-gradient(135deg, ${previewColors[0]}, ${previewColors[1]})`,
          }}
        >
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />
          </div>
          {/* Dimension label */}
          <span className="font-ui text-xs text-white/90 font-medium z-10">
            {dimensions.width} × {dimensions.height}
          </span>
        </div>

        {/* Category badge */}
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-ui font-semibold ${badgeStyle.bg} ${badgeStyle.text}`}>
          {category}
        </span>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Template Name */}
        <h3 className="font-headline text-lg font-bold text-brand-navy mb-1 group-hover:text-brand-blue transition-colors">
          {name}
        </h3>

        {/* Platform & Aspect Ratio */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-ui text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {platform}
          </span>
          <span className="font-ui text-xs text-gray-400">
            {aspectRatio}
          </span>
        </div>

        {/* Use Case */}
        <p className="font-body text-sm text-gray-600 line-clamp-2">
          {useCase}
        </p>

        {/* Action hint */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="font-ui text-xs text-brand-blue font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            Click to create ad →
          </span>
        </div>
      </div>
    </div>
  );
}
