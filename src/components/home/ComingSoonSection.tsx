'use client';

const comingSoonItems = [
  {
    icon: '🎬',
    title: 'Reels & Shorts',
    description: 'Vertical video templates for Instagram and YouTube Shorts',
  },
  {
    icon: '✂️',
    title: 'Video Edits',
    description: 'Quick cuts and motion graphics for course promos',
  },
  {
    icon: '📊',
    title: 'Career Calculator',
    description: 'Help learners find their perfect data career path',
  },
];

export default function ComingSoonSection() {
  return (
    <section className="py-20 sm:py-28 bg-[#F8F9FA]">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy mb-4">
            Coming Soon
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-xl mx-auto">
            New tools and templates on the horizon
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {comingSoonItems.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-headline text-xl font-bold text-brand-navy mb-2">
                {item.title}
              </h3>
              <p className="font-body text-gray-600 text-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
