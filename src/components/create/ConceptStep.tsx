'use client';

import { useRouter } from 'next/navigation';

interface Concept {
  id: string;
  title: string;
  description: string;
  tag?: string;
  recommended?: boolean;
  templateId: string;
  designId?: string;
}

// Concept mappings based on intent + canvas combinations
const conceptMappings: Record<string, Concept[]> = {
  // E2 (Show What's Possible) + PPC
  'E2-PPC': [
    {
      id: 'real-placements',
      title: 'Real People. Real Placements.',
      description: '4 testimonial cards with before→after transformations. Non-IT badges. LinkedIn verification.',
      tag: 'Highest ROAS (8.49x)',
      recommended: true,
      templateId: 'meta-feed-square',
    },
    {
      id: 'non-it-breakthrough',
      title: 'The Non-IT Breakthrough',
      description: 'Single learner spotlight with prominent Non-IT badge and career transformation.',
      templateId: 'meta-stories',
    },
  ],
  // E5 (Spark Recognition) + Social
  'E5-Social': [
    {
      id: 'tony-trap',
      title: 'The Tony Sharma Trap',
      description: 'Tony with certificate in hand. "Certificates don\'t write code. You do."',
      recommended: true,
      templateId: 'instagram-story',
      designId: 'tony-sharma-trap',
    },
    {
      id: 'peter-confusion',
      title: 'Peter\'s Analysis Paralysis',
      description: 'Peter surrounded by 47 browser tabs. "Which bootcamp? Which language? Which..."',
      templateId: 'meta-feed-square',
    },
  ],
  // E1 (Build Trust) + PPC
  'E1-PPC': [
    {
      id: 'credibility-stack',
      title: 'The Credibility Stack',
      description: '1.4M subscribers, 75+ Trustpilot reviews, 30-day refund guarantee. All in one glance.',
      recommended: true,
      templateId: 'google-display-landscape',
    },
    {
      id: 'youtube-proof',
      title: 'YouTube-First Learning',
      description: 'Show the journey from free YouTube content to premium bootcamp transformation.',
      templateId: 'meta-feed-square',
    },
  ],
  // E7 (Create Momentum) + Social
  'E7-Social': [
    {
      id: 'batch-countdown',
      title: 'Batch Countdown',
      description: 'Enrollment closing animation with seat counter. Create urgency without desperation.',
      recommended: true,
      templateId: 'instagram-story',
    },
  ],
  // E3 (Resolve a Fear) + PPC
  'E3-PPC': [
    {
      id: 'ai-not-replacing',
      title: 'AI Won\'t Replace You',
      description: 'Address the #1 fear: "Will AI take my job?" Answer: Only if you don\'t skill up.',
      recommended: true,
      templateId: 'meta-feed-square',
    },
  ],
  // Default fallback
  'default': [
    {
      id: 'brand-awareness',
      title: 'Padmini Brand Awareness',
      description: 'General brand creative showcasing our learning philosophy and community.',
      templateId: 'meta-feed-square',
    },
  ],
};

// Mapping for display names
const canvasNames: Record<string, string> = {
  'PPC': 'PPC Ad',
  'Social': 'Social Media',
  'YouTube': 'YouTube Thumbnail',
  'Email': 'Email Header',
  'Flyer': 'Flyer',
};

const bootcampNames: Record<string, string> = {
  'da-bootcamp': 'Data Analytics',
  'de-bootcamp': 'Data Engineering',
  'ds-bootcamp': 'GenAI & Data Science',
  'bundle': 'Bundle',
  'general': 'Padmini General',
};

const intentNames: Record<string, string> = {
  'E1': 'Build Trust',
  'E2': 'Show What\'s Possible',
  'E3': 'Resolve a Fear',
  'E4': 'Open Their Eyes',
  'E5': 'Spark Recognition',
  'E6': 'Create Belonging',
  'E7': 'Create Momentum',
};

interface ConceptStepProps {
  canvas: string;
  bootcamp: string;
  intent: string;
  onBack: () => void;
}

export default function ConceptStep({ canvas, bootcamp, intent, onBack }: ConceptStepProps) {
  const router = useRouter();

  // Get concepts based on intent + canvas combination
  const key = `${intent}-${canvas}`;
  const concepts = conceptMappings[key] || conceptMappings['default'];

  const handleUseConcept = (concept: Concept) => {
    // Navigate to editor with selected template and pass intent data as query params
    const params = new URLSearchParams({
      bootcamp,
      intent,
      headline: concept.title,
    });
    if (concept.designId) {
      params.set('designId', concept.designId);
    }
    router.push(`/editor/${concept.templateId}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 font-ui text-sm text-gray-400 hover:text-white mb-8 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>

      <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white text-center mb-4">
        Here are concepts that match your intent
      </h2>

      {/* Selection summary */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        <span className="inline-flex items-center px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full font-ui text-sm">
          {canvasNames[canvas] || canvas}
        </span>
        <span className="text-gray-500">·</span>
        <span className="inline-flex items-center px-3 py-1 bg-brand-purple/10 text-brand-purple rounded-full font-ui text-sm">
          {bootcampNames[bootcamp] || bootcamp}
        </span>
        <span className="text-gray-500">·</span>
        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full font-ui text-sm">
          {intentNames[intent] || intent}
        </span>
      </div>

      <div className="space-y-6">
        {concepts.map((concept) => (
          <div
            key={concept.id}
            className="relative bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-brand-blue/30 hover:shadow-lg transition-all duration-200"
          >
            {concept.recommended && (
              <div className="absolute -top-3 left-6">
                <span className="inline-block px-3 py-1 bg-brand-lime text-brand-navy font-ui font-semibold text-xs rounded-full">
                  Recommended
                </span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-headline text-xl font-bold text-brand-navy mb-2">
                  {concept.title}
                </h3>
                <p className="font-body text-gray-600 mb-2">
                  {concept.description}
                </p>
                {concept.tag && (
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-700 font-ui text-xs rounded">
                    {concept.tag}
                  </span>
                )}
              </div>
              <button
                onClick={() => handleUseConcept(concept)}
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-blue text-white font-ui font-semibold rounded-lg hover:bg-brand-blue/90 transition-colors flex-shrink-0"
              >
                Use This Concept
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Fallback message */}
      <p className="text-center font-body text-sm text-gray-400 mt-8">
        More concept templates coming soon. You can also browse all templates directly.
      </p>
    </div>
  );
}
