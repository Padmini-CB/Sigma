'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CanvasStep from '@/components/create/CanvasStep';
import BootcampStep from '@/components/create/BootcampStep';
import IntentStep from '@/components/create/IntentStep';
import ConceptStep from '@/components/create/ConceptStep';

type Step = 0 | 1 | 2 | 3 | 4;

interface Selections {
  canvas: string;
  bootcamp: string;
  intent: string;
  customDimensions?: { width: number; height: number };
}

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(0);
  const [selections, setSelections] = useState<Selections>({
    canvas: '',
    bootcamp: '',
    intent: '',
  });

  const handleTypeSelect = (type: 'ad' | 'thumbnail') => {
    if (type === 'thumbnail') {
      router.push('/thumbnail');
    } else {
      setStep(1);
    }
  };

  const handleCanvasSelect = (canvas: string, customDimensions?: { width: number; height: number }) => {
    setSelections((prev) => ({ ...prev, canvas, customDimensions }));
    setStep(2);
  };

  const handleBootcampSelect = (bootcamp: string) => {
    setSelections((prev) => ({ ...prev, bootcamp }));
    setStep(3);
  };

  const handleIntentSelect = (intent: string) => {
    setSelections((prev) => ({ ...prev, intent }));
    setStep(4);
  };

  const goToStep = (targetStep: Step) => {
    setStep(targetStep);
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-navy/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <h1 className="font-headline text-2xl font-bold text-white">
                SIGMA
              </h1>
            </Link>

            {/* Progress indicator */}
            {step > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                {[1, 2, 3, 4].map((stepNum) => (
                  <div key={stepNum} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-ui text-sm font-semibold transition-colors ${
                        stepNum === step
                          ? 'bg-brand-blue text-white'
                          : stepNum < step
                          ? 'bg-brand-blue/20 text-brand-blue'
                          : 'bg-gray-200 text-gray-400'
                      }`}
                    >
                      {stepNum < step ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        stepNum
                      )}
                    </div>
                    {stepNum < 4 && (
                      <div
                        className={`w-8 h-0.5 mx-1 transition-colors ${
                          stepNum < step ? 'bg-brand-blue/40' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Mobile progress */}
            {step > 0 && (
              <div className="sm:hidden font-ui text-sm text-gray-500">
                Step {step} of 4
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          {/* Step content with fade transition */}
          <div className="animate-fade-in">
            {step === 0 && (
              <div className="w-full max-w-3xl mx-auto">
                <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white text-center mb-4">
                  What do you want to create?
                </h2>
                <p className="font-body text-gray-400 text-center mb-12">
                  Choose your creative type to get started
                </p>
                <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <button
                    onClick={() => handleTypeSelect('ad')}
                    className="group relative bg-white rounded-2xl border-2 border-gray-100 p-8 text-left hover:border-brand-blue/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-headline text-xl font-bold text-brand-navy mb-2 group-hover:text-brand-blue transition-colors">
                      Ad Creative
                    </h3>
                    <p className="font-body text-sm text-gray-500">
                      PPC ads, social media posts, flyers, email headers. Choose bootcamp, intent, and concept.
                    </p>
                    <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                  <button
                    onClick={() => handleTypeSelect('thumbnail')}
                    className="group relative bg-white rounded-2xl border-2 border-gray-100 p-8 text-left hover:border-red-400/50 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                      <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <h3 className="font-headline text-xl font-bold text-brand-navy mb-2 group-hover:text-red-500 transition-colors">
                      YouTube Thumbnail
                    </h3>
                    <p className="font-body text-sm text-gray-500">
                      1280×720 thumbnails with AI generation, presets, and custom layouts. No course selection needed.
                    </p>
                    <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {step === 1 && <CanvasStep onSelect={handleCanvasSelect} onBack={() => goToStep(0)} />}
            {step === 2 && (
              <BootcampStep
                onSelect={handleBootcampSelect}
                onBack={() => goToStep(1)}
              />
            )}
            {step === 3 && (
              <IntentStep
                onSelect={handleIntentSelect}
                onBack={() => goToStep(2)}
              />
            )}
            {step === 4 && (
              <ConceptStep
                canvas={selections.canvas}
                bootcamp={selections.bootcamp}
                intent={selections.intent}
                onBack={() => goToStep(3)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-brand-navy/90 backdrop-blur-md border-t border-white/10 py-3 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-ui text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Home
          </Link>
          <p className="font-ui text-xs text-gray-500 hidden sm:block">
            Need help? The intent you choose shapes your creative direction.
          </p>
        </div>
      </footer>
    </div>
  );
}
