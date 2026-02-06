'use client';

import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center bg-brand-navy overflow-hidden">
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #FFFFFF 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-20 text-center">
        <h1 className="font-headline text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          Every great creative<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
            satisfies an intent.
          </span>
        </h1>

        <p className="font-body text-xl sm:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Sigma doesn&apos;t ask what size. It asks what purpose.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-8 py-4 font-ui font-semibold text-lg text-brand-navy bg-brand-lime rounded-lg hover:bg-brand-lime/90 transition-all duration-200 hover:scale-105 hover:shadow-lg min-w-[200px]"
          >
            Start with Intent
          </Link>
          <Link
            href="#concepts"
            className="inline-flex items-center justify-center px-8 py-4 font-ui font-semibold text-lg text-white border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200 min-w-[200px]"
          >
            Browse Concepts
          </Link>
        </div>
      </div>
    </section>
  );
}
