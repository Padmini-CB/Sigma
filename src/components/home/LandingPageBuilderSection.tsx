'use client';

export default function LandingPageBuilderSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#1e1e3f] to-[#2D1B4E]">
      <div className="max-w-4xl mx-auto text-center px-6">
        <span className="text-[#D6EF3F] text-sm font-bold uppercase tracking-wider">Coming in 2026</span>

        <h2 className="text-5xl font-bold text-white mt-4 font-['Saira_Condensed']">
          Landing Page Builder
        </h2>

        <p className="text-2xl text-white/90 mt-8 font-['Kanit'] leading-relaxed">
          A landing page isn&apos;t a sales pitch.<br/>
          It&apos;s a <span className="text-[#D6EF3F] font-bold">mirror</span>.
        </p>

        <p className="text-lg text-white/60 mt-6 max-w-2xl mx-auto leading-relaxed">
          When someone lands on your page, they shouldn&apos;t see features and pricing.<br/>
          They should see <em>themselves</em> — six months from now, in the career they&apos;ve been dreaming about.
        </p>

        <p className="text-lg text-white/60 mt-4 max-w-2xl mx-auto leading-relaxed">
          That&apos;s what converts. Not urgency. Not discounts.<br/>
          <span className="text-white">Aspiration.</span>
        </p>

        <div className="mt-10 inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full text-white/80 hover:bg-white/20 transition cursor-pointer">
          <span>🔔</span>
          <span>Get notified when it launches</span>
        </div>
      </div>
    </section>
  );
}
