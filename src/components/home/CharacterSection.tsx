'use client';

import { CharacterImage } from '@/components/elements/CharacterImage';
import { CharacterKey } from '@/data/characters';

const characters: {
  key: CharacterKey;
  pose: string;
  name: string;
  role: string;
  subtitle: string;
  color: string;
  initials: string;
}[] = [
  {
    key: 'peter',
    pose: 'confused',
    name: 'Peter Pandey',
    initials: 'PP',
    role: 'The Confused Beginner',
    subtitle: 'Asks the questions we\'re all thinking',
    color: 'from-brand-blue to-cyan-500',
  },
  {
    key: 'tony',
    pose: 'presenting',
    name: 'Tony Sharma',
    initials: 'TS',
    role: 'The Shortcut Guy',
    subtitle: 'Takes the easy path (don\'t be Tony)',
    color: 'from-orange-500 to-red-500',
  },
  {
    key: 'bruce',
    pose: 'thinking',
    name: 'Bruce Haryali',
    initials: 'BH',
    role: 'The Overthinker',
    subtitle: 'Analyzes until paralysis',
    color: 'from-brand-purple to-pink-500',
  },
];

export default function CharacterSection() {
  return (
    <section className="py-20 sm:py-28 bg-brand-navy">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            The Characters That Bring Our Brand to Life
          </h2>
          <p className="font-body text-lg text-gray-400 max-w-2xl mx-auto">
            The Codebasics Universe
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {characters.map((character) => (
            <div
              key={character.name}
              className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1"
            >
              {/* Character Image */}
              <div className="w-[200px] h-[200px] mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                <CharacterImage
                  character={character.key}
                  pose={character.pose}
                  width={200}
                  height={200}
                />
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
        <p className="font-body text-lg text-gray-400 text-center italic">
          &ldquo;We mock the mistake, not the learner.&rdquo;
        </p>
      </div>
    </section>
  );
}
