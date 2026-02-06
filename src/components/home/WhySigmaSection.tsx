'use client';

export default function WhySigmaSection() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy to-brand-purple/20" />

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-purple/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Quote block */}
          <blockquote className="relative">
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
              style={{ background: 'linear-gradient(180deg, #6F53C1, #3B82F6)' }}
            />
            <div className="pl-8 sm:pl-12">
              <p className="font-body text-xl sm:text-2xl md:text-3xl text-gray-300 leading-relaxed mb-8">
                &ldquo;Most marketing tools ask you to pick a size. We ask you to pick a purpose.
                Because a 1080&times;1080 square can build trust, resolve a fear, or spark recognition
                &mdash; and those are <span className="text-brand-purple font-semibold">three very different creatives</span>.&rdquo;
              </p>
              <footer className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center">
                  <span className="font-headline font-bold text-white text-lg">P</span>
                </div>
                <div>
                  <cite className="font-ui font-semibold text-white not-italic">
                    Padmini
                  </cite>
                  <p className="font-body text-sm text-gray-400">Creator of Sigma</p>
                </div>
              </footer>
            </div>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
