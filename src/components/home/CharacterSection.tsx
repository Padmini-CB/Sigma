'use client';

const characters = [
  {
    name: 'Peter Pandey',
    initials: 'PP',
    role: 'The Confused Beginner',
    subtitle: 'Asks the questions we\'re all thinking',
    color: 'from-brand-blue to-cyan-500',
  },
  {
    name: 'Tony Sharma',
    initials: 'TS',
    role: 'The Shortcut Guy',
    subtitle: 'Takes the easy path (don\'t be Tony)',
    color: 'from-orange-500 to-red-500',
  },
  {
    name: 'Bruce Hariyali',
    initials: 'BH',
    role: 'The Overthinker',
    subtitle: 'Analyzes until paralysis',
    color: 'from-brand-purple to-pink-500',
  },
];

export default function CharacterSection() {
  return (
    <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-brand-navy mb-4">
            The Characters That Bring Our Brand to Life
          </h2>
          <p className="font-body text-lg text-gray-600 max-w-2xl mx-auto">
            The Codebasics Universe
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {characters.map((character) => (
            <div
              key={character.name}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1"
            >
              {/* Character placeholder */}
              <div
                className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${character.color} mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <span className="font-headline font-bold text-white text-3xl">
                  {character.initials}
                </span>
              </div>

              <h3 className="font-headline text-xl font-bold text-brand-navy text-center mb-1">
                {character.name}
              </h3>
              <p className="font-ui font-semibold text-brand-purple text-center mb-2">
                {character.role}
              </p>
              <p className="font-body text-sm text-gray-500 text-center">
                {character.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Footer quote */}
        <p className="font-body text-lg text-gray-600 text-center italic">
          &ldquo;We mock the mistake, not the learner.&rdquo;
        </p>
      </div>
    </section>
  );
}
