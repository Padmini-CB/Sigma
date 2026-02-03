'use client';

import { EditorFields } from '@/app/editor/[id]/page';
import { useState, useMemo, forwardRef, useImperativeHandle, useRef } from 'react';

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

interface LivePreviewProps {
  template: Template;
  fields: EditorFields;
}

export interface LivePreviewHandle {
  getExportElement: () => HTMLDivElement | null;
}

const LivePreview = forwardRef<LivePreviewHandle, LivePreviewProps>(function LivePreview({ template, fields }, ref) {
  const exportRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getExportElement: () => exportRef.current,
  }));

  const [zoom, setZoom] = useState(100);

  // Calculate the preview container sizing
  const previewStyle = useMemo(() => {
    const { width, height } = template.dimensions;
    const scale = zoom / 100;

    // Max container size based on available space
    const maxContainerWidth = 800;
    const maxContainerHeight = 600;

    // Calculate scale to fit within container
    const scaleToFitWidth = maxContainerWidth / width;
    const scaleToFitHeight = maxContainerHeight / height;
    const baseScale = Math.min(scaleToFitWidth, scaleToFitHeight, 1);

    const finalScale = baseScale * scale;

    return {
      width: width,
      height: height,
      transform: `scale(${finalScale})`,
      transformOrigin: 'center center',
    };
  }, [template.dimensions, zoom]);

  // Determine layout type based on aspect ratio
  const isVertical = template.dimensions.height > template.dimensions.width;
  const isSquare = template.dimensions.width === template.dimensions.height;

  return (
    <main className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
      {/* Preview Toolbar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <h3 className="font-ui text-sm font-semibold text-gray-700">Preview</h3>
          <span className="font-ui text-xs text-gray-400">
            {template.dimensions.width} × {template.dimensions.height}px
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-ui text-xs text-gray-500">Zoom:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title="Zoom out"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
            </button>
            <span className="font-ui text-sm text-gray-700 w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 25))}
              className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title="Zoom in"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setZoom(100)}
            className="px-2 py-1 rounded text-xs font-ui text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Preview Canvas Area */}
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <div className="relative">
          {/* Checkerboard Background (transparency indicator) */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #ccc 25%, transparent 25%),
                linear-gradient(-45deg, #ccc 25%, transparent 25%),
                linear-gradient(45deg, transparent 75%, #ccc 75%),
                linear-gradient(-45deg, transparent 75%, #ccc 75%)
              `,
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
            }}
          />

          {/* Template Preview */}
          <div
            className="relative shadow-2xl overflow-hidden"
            style={previewStyle}
          >
            {/* Template Content - Dynamic Layout Based on Type */}
            <TemplateContent
              fields={fields}
              template={template}
              isVertical={isVertical}
              isSquare={isSquare}
            />
          </div>
        </div>
      </div>

      {/* Preview Footer Info */}
      <div className="bg-white border-t border-gray-200 px-6 py-2 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-ui text-xs text-gray-500">
            Platform: <span className="font-semibold text-gray-700">{template.platform}</span>
          </span>
          <span className="font-ui text-xs text-gray-500">
            Category: <span className="font-semibold text-gray-700">{template.category}</span>
          </span>
        </div>
        <span className="font-ui text-xs text-gray-400">
          {template.useCase}
        </span>
      </div>

      {/* Hidden Export Container - Renders at full template dimensions */}
      <div
        style={{
          position: 'fixed',
          left: '-99999px',
          top: '-99999px',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <div
          ref={exportRef}
          style={{
            width: template.dimensions.width,
            height: template.dimensions.height,
            overflow: 'hidden',
          }}
        >
          <TemplateContent
            fields={fields}
            template={template}
            isVertical={isVertical}
            isSquare={isSquare}
          />
        </div>
      </div>
    </main>
  );
});

interface TemplateContentProps {
  fields: EditorFields;
  template: Template;
  isVertical: boolean;
  isSquare: boolean;
}

function TemplateContent({ fields, template, isVertical, isSquare }: TemplateContentProps) {
  const { headline, subheadline, cta, price, originalPrice, courseName, credibility, bodyText } = fields;

  // Calculate responsive font sizes based on template dimensions
  const baseFontSize = Math.min(template.dimensions.width, template.dimensions.height) / 20;

  const fontSizes = {
    headline: isVertical ? baseFontSize * 2.2 : baseFontSize * 2,
    subheadline: baseFontSize * 1.1,
    body: baseFontSize * 0.85,
    cta: baseFontSize * 0.9,
    price: baseFontSize * 1.4,
    small: baseFontSize * 0.7,
  };

  const padding = baseFontSize * 1.5;

  if (isVertical) {
    // Vertical Layout (Stories format)
    return (
      <div
        className="w-full h-full flex flex-col"
        style={{
          background: `linear-gradient(180deg, ${template.previewColors[0]}, ${template.previewColors[1]})`,
          padding: padding,
        }}
      >
        {/* Top Section - Credibility */}
        <div className="flex items-center justify-between mb-auto">
          <div
            className="bg-white/20 backdrop-blur rounded-full px-4 py-2"
            style={{ fontSize: fontSizes.small }}
          >
            <span className="font-ui font-semibold text-white">{credibility}</span>
          </div>
        </div>

        {/* Middle Section - Main Content */}
        <div className="flex-1 flex flex-col justify-center text-center" style={{ gap: padding }}>
          <p
            className="font-body text-white/80 uppercase tracking-wider"
            style={{ fontSize: fontSizes.small }}
          >
            {courseName}
          </p>
          <h1
            className="font-headline font-extrabold text-white leading-tight"
            style={{ fontSize: fontSizes.headline }}
          >
            {headline}
          </h1>
          <p
            className="font-body text-white/90"
            style={{ fontSize: fontSizes.subheadline }}
          >
            {subheadline}
          </p>
          <p
            className="font-body text-white/70"
            style={{ fontSize: fontSizes.body }}
          >
            {bodyText}
          </p>
        </div>

        {/* Bottom Section - CTA & Price */}
        <div className="mt-auto space-y-4">
          {/* Price */}
          <div className="flex items-center justify-center gap-3">
            <span
              className="font-headline font-bold text-white"
              style={{ fontSize: fontSizes.price }}
            >
              {price}
            </span>
            {originalPrice && (
              <span
                className="font-body text-white/50 line-through"
                style={{ fontSize: fontSizes.body }}
              >
                {originalPrice}
              </span>
            )}
          </div>

          {/* CTA Button */}
          <button
            className="w-full font-ui font-semibold rounded-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: '#D7EF3F',
              color: '#181830',
              fontSize: fontSizes.cta,
              padding: `${fontSizes.cta * 0.8}px ${fontSizes.cta * 1.5}px`,
            }}
          >
            {cta}
          </button>
        </div>
      </div>
    );
  }

  if (isSquare) {
    // Square Layout (Feed posts)
    return (
      <div
        className="w-full h-full flex flex-col"
        style={{
          background: `linear-gradient(135deg, ${template.previewColors[0]}, ${template.previewColors[1]})`,
          padding: padding,
        }}
      >
        {/* Top Section - Credibility & Course Name */}
        <div className="flex items-center justify-between">
          <div
            className="bg-white/20 backdrop-blur rounded-full px-4 py-2"
            style={{ fontSize: fontSizes.small }}
          >
            <span className="font-ui font-semibold text-white">{credibility}</span>
          </div>
          <p
            className="font-body text-white/80 uppercase tracking-wider"
            style={{ fontSize: fontSizes.small }}
          >
            {courseName}
          </p>
        </div>

        {/* Middle Section - Main Content */}
        <div className="flex-1 flex flex-col justify-center" style={{ gap: padding * 0.8 }}>
          <h1
            className="font-headline font-extrabold text-white leading-tight"
            style={{ fontSize: fontSizes.headline }}
          >
            {headline}
          </h1>
          <p
            className="font-body text-white/90"
            style={{ fontSize: fontSizes.subheadline }}
          >
            {subheadline}
          </p>
          <p
            className="font-body text-white/70"
            style={{ fontSize: fontSizes.body }}
          >
            {bodyText}
          </p>
        </div>

        {/* Bottom Section - CTA & Price */}
        <div className="flex items-center justify-between">
          {/* CTA Button */}
          <button
            className="font-ui font-semibold rounded-lg transition-transform hover:scale-105"
            style={{
              backgroundColor: '#D7EF3F',
              color: '#181830',
              fontSize: fontSizes.cta,
              padding: `${fontSizes.cta * 0.7}px ${fontSizes.cta * 1.2}px`,
            }}
          >
            {cta}
          </button>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span
              className="font-headline font-bold text-white"
              style={{ fontSize: fontSizes.price }}
            >
              {price}
            </span>
            {originalPrice && (
              <span
                className="font-body text-white/50 line-through"
                style={{ fontSize: fontSizes.body }}
              >
                {originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Landscape Layout (Display ads, LinkedIn, etc.)
  return (
    <div
      className="w-full h-full flex"
      style={{
        background: `linear-gradient(135deg, ${template.previewColors[0]}, ${template.previewColors[1]})`,
        padding: padding,
      }}
    >
      {/* Left Content */}
      <div className="flex-1 flex flex-col justify-between pr-8">
        {/* Top - Credibility */}
        <div
          className="bg-white/20 backdrop-blur rounded-full px-4 py-2 self-start"
          style={{ fontSize: fontSizes.small }}
        >
          <span className="font-ui font-semibold text-white">{credibility}</span>
        </div>

        {/* Middle - Main Content */}
        <div style={{ gap: padding * 0.5 }} className="flex flex-col">
          <p
            className="font-body text-white/80 uppercase tracking-wider"
            style={{ fontSize: fontSizes.small }}
          >
            {courseName}
          </p>
          <h1
            className="font-headline font-extrabold text-white leading-tight"
            style={{ fontSize: fontSizes.headline }}
          >
            {headline}
          </h1>
          <p
            className="font-body text-white/90"
            style={{ fontSize: fontSizes.subheadline }}
          >
            {subheadline}
          </p>
        </div>

        {/* Bottom - CTA */}
        <button
          className="font-ui font-semibold rounded-lg transition-transform hover:scale-105 self-start"
          style={{
            backgroundColor: '#D7EF3F',
            color: '#181830',
            fontSize: fontSizes.cta,
            padding: `${fontSizes.cta * 0.7}px ${fontSizes.cta * 1.2}px`,
          }}
        >
          {cta}
        </button>
      </div>

      {/* Right Content - Price & Features */}
      <div className="w-1/3 flex flex-col justify-center items-end text-right">
        <div className="bg-white/10 backdrop-blur rounded-xl p-4" style={{ padding: padding * 0.8 }}>
          {/* Price */}
          <div className="mb-3">
            <span
              className="font-headline font-bold text-white block"
              style={{ fontSize: fontSizes.price }}
            >
              {price}
            </span>
            {originalPrice && (
              <span
                className="font-body text-white/50 line-through"
                style={{ fontSize: fontSizes.body }}
              >
                {originalPrice}
              </span>
            )}
          </div>
          {/* Features */}
          <p
            className="font-body text-white/70"
            style={{ fontSize: fontSizes.small }}
          >
            {bodyText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LivePreview;
