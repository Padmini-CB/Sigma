'use client';

export default function LandingPageBuilderSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#1e1e3f] to-[#2D1B4E]">
      <div className="max-w-4xl mx-auto text-center px-6">
        <span className="text-[#D6EF3F] text-sm font-bold uppercase tracking-wider">Coming in 2026</span>
        <h2 className="text-4xl font-bold text-white mt-4 font-['Saira_Condensed']">
          Landing Page Builder
        </h2>
        <p className="text-xl text-white/80 mt-6 font-['Kanit'] leading-relaxed max-w-2xl mx-auto">
          Landing pages aren&apos;t just about conversions. They&apos;re about <span className="text-[#D6EF3F]">aspiration</span>.
        </p>
        <p className="text-lg text-white/60 mt-4 font-['Kanit'] leading-relaxed max-w-2xl mx-auto">
          When a learner lands on your page, they should see exactly where they want to be.
          Not just what the bootcamp teaches — but who they&apos;ll become after completing it.
        </p>
        <div className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white/80">
          <span>🔔</span>
          <span>Get notified when it launches</span>
        </div>
      </div>
    </section>
  );
}
