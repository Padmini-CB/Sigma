'use client';

const feelIntents = [
  { icon: '🏛️', label: 'Trust', description: '"I can rely on these people"' },
  { icon: '🌟', label: 'Possibility', description: '"Someone like me achieved this"' },
  { icon: '🛡️', label: 'Relief', description: '"My fear has been addressed"' },
  { icon: '💡', label: 'Clarity', description: '"Now I understand what I didn\'t know"' },
  { icon: '🪞', label: 'Recognition', description: '"Wait, that\'s exactly me!"' },
  { icon: '🤝', label: 'Belonging', description: '"I\'m part of something bigger"' },
  { icon: '🚀', label: 'Momentum', description: '"I need to act now"' },
];

const doActions = [
  { icon: '💬', label: 'Engage Here', description: 'Like, comment, save (no click needed)' },
  { icon: '🔍', label: 'Explore Free Content', description: 'Visit YouTube, blog, resources' },
  { icon: '📖', label: 'Learn More', description: 'Check the curriculum, landing page' },
  { icon: '✅', label: 'Enroll Now', description: 'Direct purchase/registration' },
  { icon: '📥', label: 'Download Resources', description: 'PDFs, cheatsheets, brochures' },
  { icon: '🧭', label: 'Take Career Assessment', description: 'Suitability test' },
  { icon: '📐', label: 'Calculate Career Roadmap', description: 'Career path tool' },
  { icon: '🎯', label: 'Join Live Event', description: 'Webinar, workshop' },
];

export default function TwoQuestionsSection() {
  return (
    <section id="concepts" className="py-20 sm:py-28 bg-brand-navy">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            The Two Questions That Matter
          </h2>
          <p className="font-body text-lg text-gray-400 max-w-2xl mx-auto">
            Every effective creative answers these fundamental questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* FEEL Card */}
          <div className="group relative bg-white rounded-2xl border-2 border-gray-100 p-8 flex flex-col hover:border-brand-purple/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-8 -translate-y-1/2">
              <span className="inline-block px-4 py-1 bg-brand-purple text-white font-ui font-bold text-sm rounded-full">
                FEEL
              </span>
            </div>

            <h3 className="font-headline text-xl font-bold text-brand-navy mb-2 mt-2">
              What emotion should your creative evoke?
            </h3>
            <p className="font-body text-sm text-gray-400 mb-6">
              Every scroll-stopping creative triggers an emotional response. Choose the feeling you want to create.
            </p>

            <ul className="space-y-3 flex-1">
              {feelIntents.map((intent) => (
                <li
                  key={intent.label}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-default"
                >
                  <span className="text-2xl flex-shrink-0">{intent.icon}</span>
                  <div>
                    <span className="font-body font-semibold text-gray-800">{intent.label}</span>
                    <span className="font-body text-gray-500"> — {intent.description}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* DO Card */}
          <div className="group relative bg-white rounded-2xl border-2 border-gray-100 p-8 flex flex-col hover:border-brand-blue/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-8 -translate-y-1/2">
              <span className="inline-block px-4 py-1 bg-brand-blue text-white font-ui font-bold text-sm rounded-full">
                DO
              </span>
            </div>

            <h3 className="font-headline text-xl font-bold text-brand-navy mb-2 mt-2">
              What action should they take?
            </h3>
            <p className="font-body text-sm text-gray-400 mb-6">
              This is your Call-to-Action (CTA) — the next step you want the learner to take after seeing your creative.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              {doActions.map((action) => (
                <div
                  key={action.label}
                  className="flex items-start gap-2"
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">{action.icon}</span>
                  <div>
                    <p className="font-body font-semibold text-gray-700 text-sm">{action.label}</p>
                    <p className="font-body text-xs text-gray-400">{action.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
