'use client';

interface IntentOption {
  id: string;
  icon: string;
  name: string;
  description: string;
  bestFor: string;
}

const intentOptions: IntentOption[] = [
  {
    id: 'E1',
    icon: '🏛️',
    name: 'BUILD TRUST',
    description: 'They don\'t know us yet → They trust our credibility',
    bestFor: 'New audiences, cold traffic',
  },
  {
    id: 'E2',
    icon: '🌟',
    name: 'SHOW WHAT\'S POSSIBLE',
    description: 'They think they can\'t → They see someone like them who did',
    bestFor: 'Social proof, placement stories',
  },
  {
    id: 'E3',
    icon: '🛡️',
    name: 'RESOLVE A FEAR',
    description: 'They\'re worried about AI/money/ability → That fear is addressed',
    bestFor: 'Objection handling, reassurance',
  },
  {
    id: 'E4',
    icon: '💡',
    name: 'OPEN THEIR EYES',
    description: 'They don\'t know what they don\'t know → Now they understand',
    bestFor: 'Education, market awareness',
  },
  {
    id: 'E5',
    icon: '🪞',
    name: 'SPARK RECOGNITION',
    description: 'They don\'t see the problem → "Wait, that\'s me!"',
    bestFor: 'Tony/Peter content, memes, relatable pain',
  },
  {
    id: 'E6',
    icon: '🤝',
    name: 'CREATE BELONGING',
    description: 'They feel alone → They find their community',
    bestFor: 'Community content, alumni stories',
  },
  {
    id: 'E7',
    icon: '🚀',
    name: 'CREATE MOMENTUM',
    description: 'They think they have time → They feel the energy to act now',
    bestFor: 'Batch announcements, enrollment drives',
  },
];

interface IntentStepProps {
  onSelect: (intent: string) => void;
  onBack: () => void;
}

export default function IntentStep({ onSelect, onBack }: IntentStepProps) {
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
        What should the learner feel?
      </h2>
      <p className="font-body text-gray-400 text-center mb-12">
        Choose the emotional transformation you want to create
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {intentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="group bg-white rounded-xl border-2 border-gray-100 p-5 text-left hover:border-brand-blue/50 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl flex-shrink-0">{option.icon}</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-headline text-lg font-bold text-brand-navy group-hover:text-brand-blue transition-colors mb-1">
                  {option.name}
                </h3>
                <p className="font-body text-sm text-gray-600 mb-2">
                  {option.description}
                </p>
                <p className="font-ui text-xs text-gray-400">
                  Best for: {option.bestFor}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
