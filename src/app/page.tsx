'use client';

import HeroSection from '@/components/home/HeroSection';
import TwoQuestionsSection from '@/components/home/TwoQuestionsSection';
import CharacterSection from '@/components/home/CharacterSection';
import ComingSoonSection from '@/components/home/ComingSoonSection';
import LandingPageBuilderSection from '@/components/home/LandingPageBuilderSection';
import EthicalMarketingSection from '@/components/home/EthicalMarketingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-navy">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-navy/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="font-headline text-2xl font-bold text-white">
                SIGMA
              </h1>
              <span className="hidden sm:inline font-body text-sm text-gray-400">
                by Codebasics
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-2 border border-white/20">
                <span className="text-[#D6EF3F]">&#10024;</span>
                <span className="text-sm font-medium text-white">Intent-First Design</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content with padding for fixed header */}
      <main className="pt-16">
        <HeroSection />
        <TwoQuestionsSection />
        <CharacterSection />
        <ComingSoonSection />
        <LandingPageBuilderSection />
        <EthicalMarketingSection />
      </main>

      {/* Footer */}
      <footer className="bg-brand-navy py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-headline text-xl font-bold text-white mb-1">SIGMA</h2>
              <p className="font-body text-sm text-gray-400">
                Strategic Image Generation for Marketing Assets
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-ui text-xs text-gray-500">Brand Colors:</span>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded bg-brand-blue" title="Blue" />
                <div className="w-4 h-4 rounded bg-brand-purple" title="Purple" />
                <div className="w-4 h-4 rounded bg-brand-lime" title="Lime" />
              </div>
            </div>
            <p className="font-ui text-xs text-gray-500">
              Codebasics Internal Tool
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
