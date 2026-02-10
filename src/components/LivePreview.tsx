'use client';

import { EditorFields, SelectedCharacter } from '@/app/editor/[id]/page';
import { useState, useMemo, forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { ChatGPTResumeTemplate } from '@/components/templates/ChatGPTResumeTemplate';
import { GitHubBeforeAfterTemplate } from '@/components/templates/GitHubBeforeAfterTemplate';
import { PriceTransparencyTemplate } from '@/components/templates/PriceTransparencyTemplate';
import { WeekJourneyTemplate } from '@/components/templates/WeekJourneyTemplate';
import { TonySharmaV2Template } from '@/components/templates/TonySharmaV2Template';
import { IndustryVeteransTemplate } from '@/components/templates/IndustryVeteransTemplate';
import { CareerTransformationTemplate } from '@/components/templates/CareerTransformationTemplate';
import { AIvsRealSkillsTemplate } from '@/components/templates/AIvsRealSkillsTemplate';
import { WebinarTemplate } from '@/components/templates/WebinarTemplate';
import { SocialAnnouncementTemplate } from '@/components/templates/SocialAnnouncementTemplate';
import { LinkedInProofTemplate } from '@/components/templates/LinkedInProofTemplate';
import { DailyBreakdownTemplate } from '@/components/templates/DailyBreakdownTemplate';
import { InterviewPlaybackTemplate } from '@/components/templates/InterviewPlaybackTemplate';
import { ToolCemeteryTemplate } from '@/components/templates/ToolCemeteryTemplate';
import { CareerMapTemplate } from '@/components/templates/CareerMapTemplate';
import { ThreeAMTestTemplate } from '@/components/templates/ThreeAMTestTemplate';
import { YouTubeCommentWallTemplate } from '@/components/templates/YouTubeCommentWallTemplate';
import { YouTubeThumbnailTemplate } from '@/components/templates/YouTubeThumbnailTemplate';
import { MicroCourseTeaserTemplate } from '@/components/templates/MicroCourseTeaserTemplate';
import { ALL_BOOTCAMPS, type BootcampKey } from '@/data/products';

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
  selectedDesignId?: string | null;
  selectedCharacter?: SelectedCharacter | null;
  jesterLine?: string | null;
  selectedCourse?: BootcampKey | null;
}

export interface LivePreviewHandle {
  getExportElement: () => HTMLDivElement | null;
}

const LivePreview = forwardRef<LivePreviewHandle, LivePreviewProps>(function LivePreview({ template, fields, customColors, selectedDesignId, selectedCharacter, jesterLine, selectedCourse }, ref) {
  const exportRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    getExportElement: () => exportRef.current,
  }));

  const [zoom, setZoom] = useState(100);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });

  const activeColors = customColors || template.previewColors;

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: Math.max(rect.width - 64, 200),
          height: Math.max(rect.height - 64, 200),
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const previewStyle = useMemo(() => {
    const { width, height } = template.dimensions;
    const scale = zoom / 100;

    const maxContainerWidth = containerSize.width;
    const maxContainerHeight = containerSize.height;

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

          <div
            className="relative shadow-2xl"
            style={previewStyle}
          >
            <TemplateContent
              fields={fields}
              template={template}
              colors={activeColors}
              selectedDesignId={selectedDesignId}
              selectedCharacter={selectedCharacter}
              jesterLine={jesterLine}
              selectedCourse={selectedCourse}
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

      {/* Hidden Export Container */}
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
            colors={activeColors}
            selectedDesignId={selectedDesignId}
            selectedCharacter={selectedCharacter}
            selectedCourse={selectedCourse}
          />
        </div>
      </div>
    </main>
  );
});

interface TemplateContentProps {
  fields: EditorFields;
  template: Template;
  colors: string[];
  selectedDesignId?: string | null;
  selectedCharacter?: SelectedCharacter | null;
  jesterLine?: string | null;
  selectedCourse?: BootcampKey | null;
}

function getCourseData(courseKey?: BootcampKey | null) {
  if (!courseKey) return null;
  return ALL_BOOTCAMPS[courseKey] ?? null;
}

function CharacterOverlay({ character }: { character: SelectedCharacter }) {
  const charSize = character.size || 250;
  const positionStyles: Record<string, React.CSSProperties> = {
    left: { position: 'absolute', bottom: 0, left: 0, width: charSize, height: charSize, zIndex: 50 },
    right: { position: 'absolute', bottom: 0, right: 0, width: charSize, height: charSize, zIndex: 50 },
    bottom: { position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: charSize, height: charSize, zIndex: 50 },
  };

  return (
    <div style={positionStyles[character.position]}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={character.image}
        alt={character.name}
        style={{ height: `${charSize}px`, objectFit: 'contain', objectPosition: 'bottom' }}
      />
    </div>
  );
}

function TemplateContent({ fields, template, colors, selectedDesignId, selectedCharacter, jesterLine, selectedCourse }: TemplateContentProps) {
  const { headline, subheadline, cta, price, courseName, bodyText } = fields;
  const { width, height } = template.dimensions;
  const courseData = getCourseData(selectedCourse);

  // Rich template routing — collect JSX, then wrap with character overlay
  let richContent: React.ReactNode = null;

  if (selectedDesignId === 'chatgpt-resume-trap') {
    richContent = <ChatGPTResumeTemplate headline={headline} subheadline={subheadline} cta={cta} courseName={courseName} techStack={courseData?.techStack} width={width} height={height} />;
  } else if (selectedDesignId === 'github-before-after') {
    richContent = <GitHubBeforeAfterTemplate headline={headline} subheadline={subheadline} cta={cta} courseName={courseName} afterStat={courseData ? `${courseData.stats.projects} Production Projects` : undefined} width={width} height={height} />;
  } else if (selectedDesignId === 'price-transparency') {
    const deData = courseData && 'priceComparison' in courseData ? courseData as typeof import('@/data/products/de-bootcamp').DE_BOOTCAMP : null;
    richContent = (
      <PriceTransparencyTemplate
        headline={headline}
        price={price || courseData?.price}
        cta={cta}
        courseName={courseName}
        techStack={courseData?.techStack}
        stats={courseData ? [
          { number: courseData.stats.projects, label: 'Production Projects' },
          { number: String((courseData.stats as Record<string, string>).internships || '2'), label: 'Virtual Internships' },
          { number: String((courseData.stats as Record<string, string>).liveSessions || '24/year'), label: 'Live Sessions / Year' },
          { number: courseData.stats.hours, label: 'Hours of Content' },
          { number: String((courseData.stats as Record<string, string>).practiceEnvironments || '\u221E'), label: 'Practice Environments' },
          { number: courseData.stats.communityMembers, label: 'Community Members' },
        ] : undefined}
        leftCard={deData ? { title: deData.priceComparison.competitors.label, items: deData.priceComparison.competitors.breakdown.map(b => ({ label: b.item, percentage: b.pct })) } : undefined}
        rightCard={deData ? { title: deData.priceComparison.padmini.label, items: deData.priceComparison.padmini.breakdown.map(b => ({ label: b.item, percentage: b.pct })) } : undefined}
        width={width}
        height={height}
      />
    );
  } else if (selectedDesignId === 'week-journey') {
    richContent = (
      <WeekJourneyTemplate
        subheadline={subheadline}
        cta={cta}
        courseName={courseName}
        totalWeeks={courseData?.weekJourney ? String(Math.max(...courseData.weekJourney.map((w: { weeks: string; title: string; desc: string }) => { const parts = w.weeks.split('-'); return parseInt(parts[parts.length - 1]); }))) : undefined}
        weeks={courseData?.weekJourney.map((w: { weeks: string; title: string; desc: string }) => ({ weekLabel: w.weeks, title: w.title, desc: w.desc }))}
        width={width}
        height={height}
      />
    );
  } else if (selectedDesignId === 'tony-sharma-trap') {
    richContent = <TonySharmaV2Template headline={headline} subheadline={subheadline} bodyText={bodyText} cta={cta} courseName={courseName} techStack={courseData?.techStack} jesterLine={jesterLine || undefined} width={width} height={height} />;
  } else if (selectedDesignId === 'industry-veterans') {
    richContent = <IndustryVeteransTemplate headline={headline} subheadline={subheadline} cta={cta} courseName={courseName} width={width} height={height} />;
  } else if (selectedDesignId === 'career-transformation') {
    richContent = (
      <CareerTransformationTemplate
        headline={headline}
        subheadline={subheadline}
        cta={cta}
        courseName={courseName}
        techStack={courseData?.techStack}
        stats={courseData ? [
          { number: String((courseData.stats as Record<string, string>).placements || '300+'), label: 'Career Switches' },
          { number: courseData.stats.communityMembers, label: 'Learners' },
          { number: '4.9', label: 'Rating' },
        ] : undefined}
        width={width}
        height={height}
      />
    );
  } else if (selectedDesignId === 'ai-vs-real-skills') {
    richContent = <AIvsRealSkillsTemplate headline={headline} cta={cta} courseName={courseName} techStack={courseData?.techStack} width={width} height={height} />;
  } else if (selectedDesignId === 'webinar-banner') {
    richContent = <WebinarTemplate headline={headline} subheadline={subheadline} bodyText={bodyText} cta={cta} courseName={courseName} width={width} height={height} />;
  } else if (selectedDesignId === 'social-announcement') {
    richContent = <SocialAnnouncementTemplate headline={headline} subheadline={subheadline} bodyText={bodyText} cta={cta} courseName={courseName} techStack={courseData?.techStack} credibility={fields.credibility} width={width} height={height} />;
  } else if (selectedDesignId === 'linkedin-proof') {
    richContent = <LinkedInProofTemplate headline={headline} subheadline={subheadline} cta={cta} courseName={courseName} techStack={courseData?.techStack} width={width} height={height} />;
  } else if (selectedDesignId === 'daily-breakdown') {
    richContent = <DailyBreakdownTemplate headline={headline} cta={cta} courseName={courseName} price={price || courseData?.price} width={width} height={height} />;
  } else if (selectedDesignId === 'interview-playback') {
    richContent = <InterviewPlaybackTemplate headline={headline} cta={cta} courseName={courseName} width={width} height={height} />;
  } else if (selectedDesignId === 'tool-cemetery') {
    richContent = <ToolCemeteryTemplate headline={headline} cta={cta} courseName={courseName} techStack={courseData?.techStack} width={width} height={height} />;
  } else if (selectedDesignId === 'career-map') {
    richContent = <CareerMapTemplate headline={headline} cta={cta} courseName={courseName} width={width} height={height} />;
  } else if (selectedDesignId === 'three-am-test') {
    richContent = <ThreeAMTestTemplate headline={headline} cta={cta} courseName={courseName} techStack={courseData?.techStack} width={width} height={height} />;
  } else if (selectedDesignId === 'youtube-comment-wall') {
    richContent = <YouTubeCommentWallTemplate headline={headline} cta={cta} courseName={courseName} width={width} height={height} />;
  } else if (selectedDesignId === 'youtube-thumbnail') {
    richContent = <YouTubeThumbnailTemplate headline={headline} subheadline={subheadline} courseName={courseName} width={width} height={height} />;
  } else if (selectedDesignId === 'micro-course-teaser') {
    richContent = <MicroCourseTeaserTemplate headline={headline} cta={cta} courseName={courseName} width={width} height={height} />;
  }

  // If we matched a rich template, wrap with character overlay
  if (richContent) {
    return (
      <div style={{ width, height, position: 'relative', overflow: 'hidden' }}>
        {richContent}
        {selectedCharacter && <CharacterOverlay character={selectedCharacter} />}
      </div>
    );
  }

  // ============ Fallback: Generic template rendering ============
  const BRAND_BLUE = '#3B82F6';
  const BRAND_PURPLE = '#6F53C1';
  const BRAND_NAVY = '#181830';
  const BRAND_LIME = '#D7EF3F';

  const baseFontSize = Math.min(width, height) / 25;
  const fontSizes = {
    headline: baseFontSize * 1.4,
    subheadline: baseFontSize * 0.9,
    body: baseFontSize * 0.75,
    cta: baseFontSize * 0.8,
    price: baseFontSize * 1.1,
    small: baseFontSize * 0.6,
  };
  const padding = width * 0.05;
  const isVertical = height > width;
  const isSquare = width === height;

  const getGradient = () => {
    const color1 = colors[0] || BRAND_BLUE;
    const color2 = colors[1] || BRAND_PURPLE;
    if (color1 === BRAND_NAVY || color1 === '#181830') {
      return `linear-gradient(135deg, ${BRAND_NAVY}, ${BRAND_PURPLE})`;
    }
    return `linear-gradient(135deg, ${color1}, ${color2})`;
  };

  if (isVertical) {
    return (
      <div
        style={{
          width, height,
          background: getGradient(),
          padding,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {selectedCharacter && <CharacterOverlay character={selectedCharacter} />}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: '9999px', padding: `${fontSizes.small * 0.5}px ${fontSizes.small * 1.2}px`, fontSize: fontSizes.small }}>
            <span className="font-ui font-semibold" style={{ color: '#FFFFFF' }}>{fields.credibility}</span>
          </div>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: fontSizes.small, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{courseName}</p>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: padding * 0.5, paddingTop: padding * 0.5, paddingBottom: padding * 0.5 }}>
          <h1 className="font-headline font-extrabold" style={{ color: '#FFFFFF', fontSize: fontSizes.headline, lineHeight: 1.1 }}>{headline}</h1>
          {jesterLine && <p className="font-body" style={{ color: 'rgba(255,255,255,0.6)', fontSize: fontSizes.small, fontStyle: 'italic' }}>{jesterLine}</p>}
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.9)', fontSize: fontSizes.subheadline }}>{subheadline}</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.7)', fontSize: fontSizes.body }}>{bodyText}</p>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: padding * 0.3, zIndex: 2 }}>
          {price && <span className="font-headline font-bold" style={{ color: '#FFFFFF', fontSize: fontSizes.price, textAlign: 'center' }}>{price}</span>}
          <div className="font-ui font-semibold" style={{ backgroundColor: BRAND_LIME, color: BRAND_NAVY, fontSize: fontSizes.cta, padding: `${fontSizes.cta * 0.7}px ${fontSizes.cta * 1.2}px`, borderRadius: '8px', textAlign: 'center', width: '100%' }}>{cta}</div>
        </div>
      </div>
    );
  }

  if (isSquare) {
    return (
      <div
        style={{
          width, height,
          background: getGradient(),
          padding,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {selectedCharacter && <CharacterOverlay character={selectedCharacter} />}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: '9999px', padding: `${fontSizes.small * 0.5}px ${fontSizes.small * 1.2}px`, fontSize: fontSizes.small }}>
            <span className="font-ui font-semibold" style={{ color: '#FFFFFF' }}>{fields.credibility}</span>
          </div>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: fontSizes.small, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{courseName}</p>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: padding * 0.4 }}>
          <h1 className="font-headline font-extrabold" style={{ color: '#FFFFFF', fontSize: fontSizes.headline, lineHeight: 1.1 }}>{headline}</h1>
          {jesterLine && <p className="font-body" style={{ color: 'rgba(255,255,255,0.6)', fontSize: fontSizes.small, fontStyle: 'italic' }}>{jesterLine}</p>}
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.9)', fontSize: fontSizes.subheadline }}>{subheadline}</p>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.7)', fontSize: fontSizes.body }}>{bodyText}</p>
        </div>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 2 }}>
          <div className="font-ui font-semibold" style={{ backgroundColor: BRAND_LIME, color: BRAND_NAVY, fontSize: fontSizes.cta, padding: `${fontSizes.cta * 0.7}px ${fontSizes.cta * 1.2}px`, borderRadius: '8px' }}>{cta}</div>
          {price && <span className="font-headline font-bold" style={{ color: '#FFFFFF', fontSize: fontSizes.price }}>{price}</span>}
        </div>
      </div>
    );
  }

  // Landscape
  return (
    <div
      style={{
        width, height,
        background: getGradient(),
        padding,
        display: 'flex',
        flexDirection: 'row',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {selectedCharacter && <CharacterOverlay character={selectedCharacter} />}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingRight: padding * 0.5, overflow: 'hidden' }}>
        <div style={{ flexShrink: 0, backgroundColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', borderRadius: '9999px', padding: `${fontSizes.small * 0.5}px ${fontSizes.small * 1.2}px`, fontSize: fontSizes.small, alignSelf: 'flex-start' }}>
          <span className="font-ui font-semibold" style={{ color: '#FFFFFF' }}>{fields.credibility}</span>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: padding * 0.25 }}>
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.8)', fontSize: fontSizes.small, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{courseName}</p>
          <h1 className="font-headline font-extrabold" style={{ color: '#FFFFFF', fontSize: fontSizes.headline, lineHeight: 1.1 }}>{headline}</h1>
          {jesterLine && <p className="font-body" style={{ color: 'rgba(255,255,255,0.6)', fontSize: fontSizes.small, fontStyle: 'italic' }}>{jesterLine}</p>}
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.9)', fontSize: fontSizes.subheadline }}>{subheadline}</p>
        </div>
        <div className="font-ui font-semibold" style={{ flexShrink: 0, backgroundColor: BRAND_LIME, color: BRAND_NAVY, fontSize: fontSizes.cta, padding: `${fontSizes.cta * 0.6}px ${fontSizes.cta * 1}px`, borderRadius: '8px', alignSelf: 'flex-start', zIndex: 2 }}>{cta}</div>
      </div>
      <div style={{ width: '35%', flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', textAlign: 'right' }}>
        <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', borderRadius: '12px', padding: padding * 0.6 }}>
          {price && <div style={{ marginBottom: fontSizes.small * 0.5 }}><span className="font-headline font-bold" style={{ color: '#FFFFFF', fontSize: fontSizes.price, display: 'block' }}>{price}</span></div>}
          <p className="font-body" style={{ color: 'rgba(255,255,255,0.7)', fontSize: fontSizes.small }}>{bodyText}</p>
        </div>
      </div>
    </div>
  );
}

export default LivePreview;
