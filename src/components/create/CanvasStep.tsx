'use client';

interface CanvasOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const canvasOptions: CanvasOption[] = [
  { id: 'PPC', name: 'PPC Ad', icon: '📊', description: '4 sizes for paid campaigns' },
  { id: 'Social', name: 'Social Media', icon: '📱', description: '1080×1080 square' },
  { id: 'YouTube', name: 'YouTube Thumbnail', icon: '▶️', description: '1280×720' },
  { id: 'Email', name: 'Email Header', icon: '✉️', description: '600×200' },
  { id: 'Flyer', name: 'Flyer', icon: '📄', description: '1080×1350' },
];

interface CanvasStepProps {
  onSelect: (canvas: string) => void;
}

export default function CanvasStep({ onSelect }: CanvasStepProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="font-headline text-3xl sm:text-4xl font-bold text-brand-navy text-center mb-4">
        What are you making?
      </h2>
      <p className="font-body text-gray-600 text-center mb-12">
        Choose the format that fits your campaign
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {canvasOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className="group relative bg-white rounded-2xl border-2 border-gray-100 p-6 text-left hover:border-brand-blue/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
          >
            <span className="text-4xl mb-4 block">{option.icon}</span>
            <h3 className="font-headline text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-blue transition-colors">
              {option.name}
            </h3>
            <p className="font-body text-sm text-gray-500">
              {option.description}
            </p>
            <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
