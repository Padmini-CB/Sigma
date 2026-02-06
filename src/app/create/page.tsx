'use client';

import { useState } from 'react';
import Link from 'next/link';
import CanvasStep from '@/components/create/CanvasStep';
import BootcampStep from '@/components/create/BootcampStep';
import IntentStep from '@/components/create/IntentStep';
import ConceptStep from '@/components/create/ConceptStep';

type Step = 1 | 2 | 3 | 4;

interface Selections {
  canvas: string;
  bootcamp: string;
  intent: string;
  customDimensions?: { width: number; height: number };
}

export default function CreatePage() {
  const [step, setStep] = useState<Step>(1);
  const [selections, setSelections] = useState<Selections>({
    canvas: '',
    bootcamp: '',
    intent: '',
  });

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

            {/* Mobile progress */}
            <div className="sm:hidden font-ui text-sm text-gray-500">
              Step {step} of 4
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          {/* Step content with fade transition */}
          <div className="animate-fade-in">
            {step === 1 && <CanvasStep onSelect={handleCanvasSelect} />}
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
