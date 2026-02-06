'use client';

import { EditorFields } from '@/app/editor/[id]/page';
import { useState, useMemo, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';

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
  customColors?: string[] | null;
}

export interface LivePreviewHandle {
  getExportElement: () => HTMLDivElement | null;
}

const LivePreview = forwardRef<LivePreviewHandle, LivePreviewProps>(function LivePreview({ template, fields, customColors }, ref) {
  const exportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getExportElement: () => exportRef.current,
  }));

  const [zoom, setZoom] = useState(100);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  // Use custom colors from design if provided, otherwise use template default colors
  const activeColors = customColors || template.previewColors;

  // Track container size for responsive scaling
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: Math.max(rect.width - 64, 200), // Account for padding
          height: Math.max(rect.height - 64, 200),
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Calculate the preview container sizing
  const previewStyle = useMemo(() => {
    const { width, height } = template.dimensions;
    const scale = zoom / 100;

    // Use actual container size for responsive scaling
    const maxContainerWidth = containerSize.width;
    const maxContainerHeight = containerSize.height;

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
  }, [template.dimensions, zoom, containerSize]);

  // Determine layout type based on aspect ratio
  const isVertical = template.dimensions.height > template.dimensions.width;
  const isSquare = template.dimensions.width === template.dimensions.height;

  return (
    <main className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
      {/* Preview Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <h3 className="font-ui text-sm font-semibold text-gray-700">Preview</h3>
          <span className="font-ui text-xs text-gray-400 hidden sm:inline">
            {template.dimensions.width} × {template.dimensions.height}px
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-ui text-xs text-gray-500 hidden sm:inline">Zoom:</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
              </svg>
            </button>
            <span className="font-ui text-sm text-gray-700 w-10 sm:w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(150, zoom + 25))}
              className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          <button
            onClick={() => setZoom(100)}
            className="px-2 py-1 rounded text-xs font-ui text-gray-500 hover:bg-gray-100 transition-colors hidden sm:block"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Preview Canvas Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center"
      >
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
            className="relative shadow-2xl"
            style={previewStyle}
          >
            {/* Template Content - Dynamic Layout Based on Type */}
            <TemplateContent
              fields={fields}
              template={template}
              isVertical={isVertical}
              isSquare={isSquare}
              colors={activeColors}
            />
          </div>
        </div>
      </div>

      {/* Preview Footer Info */}
      <div className="bg-white border-t border-gray-200 px-4 sm:px-6 py-2 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 sm:gap-4 overflow-hidden">
            <span className="font-ui text-xs text-gray-500 truncate">
              <span className="hidden sm:inline">Platform: </span>
              <span className="font-semibold text-gray-700">{template.platform}</span>
            </span>
            <span className="font-ui text-xs text-gray-500 truncate hidden sm:inline">
              Category: <span className="font-semibold text-gray-700">{template.category}</span>
            </span>
          </div>
          <span className="font-ui text-xs text-gray-400 truncate hidden md:inline">
            {template.useCase}
          </span>
        </div>
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
            overflow: 'visible',
          }}
        >
          <TemplateContent
            fields={fields}
            template={template}
            isVertical={isVertical}
            isSquare={isSquare}
            colors={activeColors}
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
  colors: string[];
}

function TemplateContent({ fields, template, isVertical, isSquare, colors }: TemplateContentProps) {
  const { headline, subheadline, cta, price, originalPrice, courseName, credibility, bodyText } = fields;

  // Brand colors
  const BRAND_BLUE = '#3B82F6';
  const BRAND_PURPLE = '#6F53C1';
  const BRAND_NAVY = '#181830';
  const BRAND_LIME = '#D7EF3F';

  // Check if this is a PPC template (only PPC shows price)
  const isPPC = template.category === 'PPC';

  // Calculate responsive font sizes based on template dimensions
  // Reduced headline size to prevent overflow
  const { width, height } = template.dimensions;
  const baseFontSize = Math.min(width, height) / 25;

  const fontSizes = {
    headline: isVertical ? baseFontSize * 1.6 : baseFontSize * 1.4,
    subheadline: baseFontSize * 0.9,
    body: baseFontSize * 0.75,
    cta: baseFontSize * 0.8,
    price: baseFontSize * 1.1,
    small: baseFontSize * 0.6,
  };

  // Padding at ~5% of template width
  const padding = width * 0.05;

  // Determine gradient based on template colors
  const getGradient = () => {
    // Use brand-accurate gradients
    const color1 = colors[0] || BRAND_BLUE;
    const color2 = colors[1] || BRAND_PURPLE;

    // If dark navy is first, use dark variant gradient
    if (color1 === BRAND_NAVY || color1 === '#181830') {
      return `linear-gradient(135deg, ${BRAND_NAVY}, ${BRAND_PURPLE})`;
    }
    // Default to primary gradient (blue to purple)
    return `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_PURPLE})`;
  };

  if (isVertical) {
    // Vertical Layout (Stories format) - Flexbox with hard boundaries
    return (
      <div
        style={{
          width: width,
          height: height,
          background: getGradient(),
          padding: padding,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Top Bar - Credibility & Course Name (flex-shrink: 0) */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: '9999px',
              padding: `${fontSizes.small * 0.5}px ${fontSizes.small * 1.2}px`,
              fontSize: fontSizes.small,
            }}
          >
            <span className="font-ui font-semibold" style={{ color: '#FFFFFF' }}>{credibility}</span>
          </div>
          <p
            className="font-body"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: fontSizes.small,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {courseName}
          </p>
        </div>

        {/* Main Content Section (flex: 1, overflow: hidden) */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'center',
            gap: padding * 0.5,
            paddingTop: padding * 0.5,
            paddingBottom: padding * 0.5,
          }}
        >
          <h1
            className="font-headline font-extrabold"
            style={{
              color: '#FFFFFF',
              fontSize: fontSizes.headline,
              lineHeight: 1.1,
            }}
          >
            {headline}
          </h1>
          <p
            className="font-body"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: fontSizes.subheadline,
            }}
          >
            {subheadline}
          </p>
          <p
            className="font-body"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: fontSizes.body,
            }}
          >
            {bodyText}
          </p>
        </div>

        {/* Bottom Bar - CTA & Price (flex-shrink: 0) */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: padding * 0.3 }}>
          {/* Price - show for all templates, strikethrough only for PPC */}
          {price && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: fontSizes.small }}>
              <span
                className="font-headline font-bold"
                style={{ color: '#FFFFFF', fontSize: fontSizes.price }}
              >
                {price}
              </span>
              {isPPC && originalPrice && (
                <span
                  className="font-body"
                  style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: fontSizes.body,
                    textDecoration: 'line-through',
                  }}
                >
                  {originalPrice}
                </span>
              )}
            </div>
          )}

          {/* CTA Button */}
          <div
            className="font-ui font-semibold"
            style={{
              backgroundColor: BRAND_LIME,
              color: BRAND_NAVY,
              fontSize: fontSizes.cta,
              padding: `${fontSizes.cta * 0.7}px ${fontSizes.cta * 1.2}px`,
              borderRadius: '8px',
              textAlign: 'center',
              width: '100%',
            }}
          >
            {cta}
          </div>
        </div>
      </div>
    );
  }

  if (isSquare) {
    // Square Layout (Feed posts) - Flexbox with hard boundaries
    return (
      <div
        style={{
          width: width,
          height: height,
          background: getGradient(),
          padding: padding,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Top Bar - Credibility & Course Name (flex-shrink: 0) */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: '9999px',
              padding: `${fontSizes.small * 0.5}px ${fontSizes.small * 1.2}px`,
              fontSize: fontSizes.small,
            }}
          >
            <span className="font-ui font-semibold" style={{ color: '#FFFFFF' }}>{credibility}</span>
          </div>
          <p
            className="font-body"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: fontSizes.small,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {courseName}
          </p>
        </div>

        {/* Main Content Section (flex: 1, overflow: hidden) */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: padding * 0.4,
          }}
        >
          <h1
            className="font-headline font-extrabold"
            style={{
              color: '#FFFFFF',
              fontSize: fontSizes.headline,
              lineHeight: 1.1,
            }}
          >
            {headline}
          </h1>
          <p
            className="font-body"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: fontSizes.subheadline,
            }}
          >
            {subheadline}
          </p>
          <p
            className="font-body"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: fontSizes.body,
            }}
          >
            {bodyText}
          </p>
        </div>

        {/* Bottom Bar - CTA & Price (flex-shrink: 0) */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* CTA Button */}
          <div
            className="font-ui font-semibold"
            style={{
              backgroundColor: BRAND_LIME,
              color: BRAND_NAVY,
              fontSize: fontSizes.cta,
              padding: `${fontSizes.cta * 0.7}px ${fontSizes.cta * 1.2}px`,
              borderRadius: '8px',
            }}
          >
            {cta}
          </div>

          {/* Price - show for all templates, strikethrough only for PPC */}
          {price && (
            <div style={{ display: 'flex', alignItems: 'center', gap: fontSizes.small * 0.5 }}>
              <span
                className="font-headline font-bold"
                style={{ color: '#FFFFFF', fontSize: fontSizes.price }}
              >
                {price}
              </span>
              {isPPC && originalPrice && (
                <span
                  className="font-body"
                  style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: fontSizes.body,
                    textDecoration: 'line-through',
                  }}
                >
                  {originalPrice}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Landscape Layout (Display ads, LinkedIn, etc.) - Flexbox with hard boundaries
  return (
    <div
      style={{
        width: width,
        height: height,
        background: getGradient(),
        padding: padding,
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      {/* Left Content - Main area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingRight: padding * 0.5,
          overflow: 'hidden',
        }}
      >
        {/* Top - Credibility (flex-shrink: 0) */}
        <div
          style={{
            flexShrink: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            padding: `${fontSizes.small * 0.5}px ${fontSizes.small * 1.2}px`,
            fontSize: fontSizes.small,
            alignSelf: 'flex-start',
          }}
        >
          <span className="font-ui font-semibold" style={{ color: '#FFFFFF' }}>{credibility}</span>
        </div>

        {/* Middle - Main Content (flex: 1, overflow: hidden) */}
        <div
          style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: padding * 0.25,
          }}
        >
          <p
            className="font-body"
            style={{
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: fontSizes.small,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {courseName}
          </p>
          <h1
            className="font-headline font-extrabold"
            style={{
              color: '#FFFFFF',
              fontSize: fontSizes.headline,
              lineHeight: 1.1,
            }}
          >
            {headline}
          </h1>
          <p
            className="font-body"
            style={{
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: fontSizes.subheadline,
            }}
          >
            {subheadline}
          </p>
        </div>

        {/* Bottom - CTA (flex-shrink: 0) */}
        <div
          className="font-ui font-semibold"
          style={{
            flexShrink: 0,
            backgroundColor: BRAND_LIME,
            color: BRAND_NAVY,
            fontSize: fontSizes.cta,
            padding: `${fontSizes.cta * 0.6}px ${fontSizes.cta * 1}px`,
            borderRadius: '8px',
            alignSelf: 'flex-start',
          }}
        >
          {cta}
        </div>
      </div>

      {/* Right Content - Price & Features */}
      <div
        style={{
          width: '35%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end',
          textAlign: 'right',
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            padding: padding * 0.6,
          }}
        >
          {/* Price - show for all templates, strikethrough only for PPC */}
          {price && (
            <div style={{ marginBottom: fontSizes.small * 0.5 }}>
              <span
                className="font-headline font-bold"
                style={{ color: '#FFFFFF', fontSize: fontSizes.price, display: 'block' }}
              >
                {price}
              </span>
              {isPPC && originalPrice && (
                <span
                  className="font-body"
                  style={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: fontSizes.body,
                    textDecoration: 'line-through',
                  }}
                >
                  {originalPrice}
                </span>
              )}
            </div>
          )}
          {/* Features */}
          <p
            className="font-body"
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: fontSizes.small,
            }}
          >
            {bodyText}
          </p>
        </div>
      </div>
    </div>
  );
}

export default LivePreview;
