'use client';

import { CHARACTERS, CharacterKey, getCharacterImage } from '@/data/characters';
import Image from 'next/image';

const characters: {
  key: CharacterKey;
  pose: string;
}[] = [
  { key: 'peter', pose: 'confused' },
  { key: 'tony', pose: 'presenting' },
  { key: 'bruce', pose: 'thinking' },
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
            The Padmini Universe
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {characters.map((entry) => {
            const char = CHARACTERS[entry.key];
            const imageSrc = getCharacterImage(entry.key, entry.pose);

            return (
              <div
                key={entry.key}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:border-transparent transition-all duration-300 hover:-translate-y-1"
              >
                {/* Character Image */}
                <div className="w-[200px] h-[200px] mx-auto mb-6 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={imageSrc}
                    alt={`${char.name} - ${char.title}`}
                    width={200}
                    height={200}
                    className="object-contain w-full h-full"
                  />
                </div>

                <h3 className="font-headline text-xl font-bold text-brand-navy text-center mb-1">
                  {char.name}
                </h3>
                <p className="font-ui font-semibold text-brand-purple text-center mb-2">
                  {char.title}
                </p>
                <p className="font-body text-sm text-gray-500 text-center">
                  {char.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer quote */}
        <p className="font-body text-lg text-gray-400 text-center italic">
          &ldquo;We mock the mistake, not the learner.&rdquo;
        </p>
      </div>
    </section>
  );
}
