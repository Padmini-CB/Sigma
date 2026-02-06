'use client';

export default function SoulSection() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center animate-fade-in">
          {/* Line 1 - Large, Navy */}
          <p className="font-body text-2xl sm:text-3xl md:text-4xl font-medium text-brand-navy leading-relaxed mb-8">
            Every satisfying creative satisfies an intent.
          </p>

          {/* Line 2 - Regular, Gray */}
          <p className="font-body text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            It&apos;s not about the size. It&apos;s about the purpose.
          </p>

          {/* Line 3 - Purple, Italic */}
          <p className="font-body text-xl sm:text-2xl text-brand-purple italic">
            Let&apos;s start building with a soul.
          </p>
        </div>
      </div>
    </section>
  );
}
