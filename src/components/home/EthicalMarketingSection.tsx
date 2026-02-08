'use client';

const dos = [
  { text: 'Show real transformations', detail: 'Actual learners, actual outcomes' },
  { text: 'Address genuine fears', detail: 'Career anxiety is real, we acknowledge it' },
  { text: 'Educate before selling', detail: '80% of our content is free' },
  { text: 'Use real scarcity only', detail: 'Batch limits exist because mentorship is limited' },
  { text: 'Mock the mistake, not the learner', detail: 'Tony Sharma is a cautionary tale, not a target' },
];

const donts = [
  { text: 'Fake urgency', detail: 'No "Only 2 seats left!" when there are 200' },
  { text: 'Strikethrough pricing', detail: 'We don\'t inflate prices to show "discounts"' },
  { text: 'Fear-based manipulation', detail: 'We don\'t threaten, we inform' },
  { text: 'Fake testimonials', detail: 'Every story is verifiable on LinkedIn' },
  { text: 'Guarantee outcomes', detail: 'We guarantee effort, not jobs' },
];

export default function EthicalMarketingSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-purple-600 text-sm font-bold uppercase tracking-wider">Our Philosophy</span>
          <h2 className="text-4xl font-bold text-[#181830] mt-4 font-['Saira_Condensed']">
            Ethical Marketing Matters
          </h2>
          <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
            Sigma is built on the belief that great marketing doesn&apos;t manipulate — it resonates.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* DO's */}
          <div className="bg-green-50 rounded-2xl p-8 border border-green-200">
            <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
              <span>✅</span> What We Do
            </h3>
            <ul className="mt-6 space-y-4 text-gray-700">
              {dos.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span><strong>{item.text}</strong> — {item.detail}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* DON'Ts */}
          <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
            <h3 className="text-xl font-bold text-red-700 flex items-center gap-2">
              <span>🚫</span> What We Never Do
            </h3>
            <ul className="mt-6 space-y-4 text-gray-700">
              {donts.map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">•</span>
                  <span><strong>{item.text}</strong> — {item.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 italic">
            &ldquo;Marketing should feel like a conversation with a trusted friend, not a sales pitch from a stranger.&rdquo;
          </p>
          <p className="text-gray-400 mt-2">— Padmini, Creator of Sigma</p>
        </div>
      </div>
    </section>
  );
}
