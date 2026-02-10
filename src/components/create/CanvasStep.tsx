'use client';

import { useState } from 'react';

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
  { id: 'Custom', name: 'Custom Size', icon: '⚙️', description: 'Enter your own dimensions' },
];

interface CanvasStepProps {
  onSelect: (canvas: string, customDimensions?: { width: number; height: number }) => void;
  onBack?: () => void;
}

export default function CanvasStep({ onSelect, onBack }: CanvasStepProps) {
  const [showCustom, setShowCustom] = useState(false);
  const [customWidth, setCustomWidth] = useState('');
  const [customHeight, setCustomHeight] = useState('');

  const handleSelect = (id: string) => {
    if (id === 'Custom') {
      setShowCustom(true);
    } else {
      onSelect(id);
    }
  };

  const handleCustomContinue = () => {
    const w = parseInt(customWidth, 10);
    const h = parseInt(customHeight, 10);
    if (w > 0 && h > 0) {
      onSelect('Custom', { width: w, height: h });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 font-ui text-sm text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      )}
      <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white text-center mb-4">
        What are you making?
      </h2>
      <p className="font-body text-gray-400 text-center mb-12">
        Choose the format that fits your campaign
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {canvasOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`group relative bg-white rounded-2xl border-2 p-6 text-left hover:border-brand-blue/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 ${
              showCustom && option.id === 'Custom'
                ? 'border-brand-blue/50 shadow-lg'
                : 'border-gray-100'
            }`}
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

      {/* Custom Size Input */}
      {showCustom && (
        <div className="mt-8 max-w-md mx-auto bg-white rounded-2xl border-2 border-brand-blue/30 p-6 animate-fade-in">
          <h3 className="font-headline text-lg font-bold text-brand-navy mb-4">
            Enter Custom Dimensions
          </h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <label htmlFor="custom-width" className="block font-ui text-sm font-semibold text-gray-600 mb-1">
                Width (px)
              </label>
              <input
                id="custom-width"
                type="number"
                min="1"
                value={customWidth}
                onChange={(e) => setCustomWidth(e.target.value)}
                placeholder="1080"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 font-body text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
              />
            </div>
            <span className="font-ui text-gray-400 mt-6">×</span>
            <div className="flex-1">
              <label htmlFor="custom-height" className="block font-ui text-sm font-semibold text-gray-600 mb-1">
                Height (px)
              </label>
              <input
                id="custom-height"
                type="number"
                min="1"
                value={customHeight}
                onChange={(e) => setCustomHeight(e.target.value)}
                placeholder="1080"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-300 font-body text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
              />
            </div>
          </div>
          <button
            onClick={handleCustomContinue}
            disabled={!customWidth || !customHeight || parseInt(customWidth, 10) <= 0 || parseInt(customHeight, 10) <= 0}
            className="w-full py-2.5 rounded-lg font-ui text-sm font-semibold bg-brand-blue text-white hover:bg-brand-blue/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
