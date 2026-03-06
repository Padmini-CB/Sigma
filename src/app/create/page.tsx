'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BootcampStep from '@/components/create/BootcampStep';

type CreativeType = 'select' | 'ppc-ads';

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState<CreativeType>('select');

  const handleBootcampSelect = (bootcamp: string) => {
    router.push(`/editor/meta-feed-square?bootcamp=${encodeURIComponent(bootcamp)}`);
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
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          <div className="animate-fade-in">
            {step === 'select' ? (
              <div className="w-full max-w-3xl mx-auto">
                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center gap-2 font-ui text-sm text-gray-400 hover:text-white mb-8 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>

                <h2 className="font-headline text-3xl sm:text-4xl font-bold text-white text-center mb-4">
                  What are you creating?
                </h2>
                <p className="font-body text-gray-400 text-center mb-12">
                  Choose the type of creative you want to build
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* PPC Ads / Ad Creative */}
                  <button
                    onClick={() => setStep('ppc-ads')}
                    className="group bg-white rounded-2xl border-2 border-gray-100 p-8 text-left hover:border-brand-purple/50 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center mb-5">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="font-headline text-xl font-bold text-brand-navy group-hover:text-brand-purple transition-colors mb-2">
                      PPC Ads / Ad Creative
                    </h3>
                    <p className="font-body text-sm text-gray-500">
                      Meta, Google, LinkedIn ad creatives for bootcamp promotions. Multiple formats and sizes.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-brand-purple opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="font-ui text-sm font-semibold">Get started</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>

                  {/* YouTube Thumbnail Maker */}
                  <button
                    onClick={() => router.push('/thumbnail-maker')}
                    className="group bg-white rounded-2xl border-2 border-gray-100 p-8 text-left hover:border-red-400/50 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center mb-5">
                      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <h3 className="font-headline text-xl font-bold text-brand-navy group-hover:text-red-600 transition-colors mb-2">
                      YouTube Thumbnail Maker
                    </h3>
                    <p className="font-body text-sm text-gray-500">
                      Create eye-catching YouTube thumbnails with brand-compliant designs. Drag-and-drop editor.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="font-ui text-sm font-semibold">Open maker</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            ) : (
              <BootcampStep
                onSelect={handleBootcampSelect}
                onBack={() => setStep('select')}
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
            &larr; Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
