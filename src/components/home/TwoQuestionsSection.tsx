'use client';

const feelIntents = [
  { icon: '🏛️', label: 'Build Trust' },
  { icon: '🌟', label: 'Show What\'s Possible' },
  { icon: '🛡️', label: 'Resolve a Fear' },
  { icon: '💡', label: 'Open Their Eyes' },
  { icon: '🪞', label: 'Spark Recognition' },
  { icon: '🤝', label: 'Create Belonging' },
  { icon: '🚀', label: 'Create Momentum' },
];

const doActions = [
  { icon: '💬', label: 'Engage Here', subtitle: 'value in the post itself' },
  { icon: '🔍', label: 'Explore Deep Value', subtitle: 'YouTube, blog, free resources' },
  { icon: '📖', label: 'Learn More', subtitle: 'landing page, curriculum details' },
  { icon: '✅', label: 'Enroll Now', subtitle: 'direct conversion' },
];

export default function TwoQuestionsSection() {
  return (
    <section id="concepts" className="py-20 sm:py-28 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy mb-4">
            The Two Questions That Matter
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            Every effective creative answers these fundamental questions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* FEEL Card */}
          <div className="group relative bg-white rounded-2xl border-2 border-gray-100 p-8 hover:border-brand-purple/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-8 -translate-y-1/2">
              <span className="inline-block px-4 py-1 bg-brand-purple text-white font-ui font-bold text-sm rounded-full">
                FEEL
              </span>
            </div>

            <h3 className="font-headline text-xl font-bold text-brand-navy mb-6 mt-2">
              What should the learner feel?
            </h3>

            <ul className="space-y-4">
              {feelIntents.map((intent) => (
                <li
                  key={intent.label}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-default"
                >
                  <span className="text-2xl">{intent.icon}</span>
                  <span className="font-body text-gray-700">{intent.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DO Card */}
          <div className="group relative bg-white rounded-2xl border-2 border-gray-100 p-8 hover:border-brand-blue/30 hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 left-8 -translate-y-1/2">
              <span className="inline-block px-4 py-1 bg-brand-blue text-white font-ui font-bold text-sm rounded-full">
                DO
              </span>
            </div>

            <h3 className="font-headline text-xl font-bold text-brand-navy mb-6 mt-2">
              What should they do next?
            </h3>

            <ul className="space-y-4">
              {doActions.map((action) => (
                <li
                  key={action.label}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-default"
                >
                  <span className="text-2xl">{action.icon}</span>
                  <div>
                    <span className="font-body text-gray-700">{action.label}</span>
                    {action.subtitle && (
                      <span className="font-body text-sm text-gray-400 ml-2">({action.subtitle})</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
