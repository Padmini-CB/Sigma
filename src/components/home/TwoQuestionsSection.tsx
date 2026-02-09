'use client';

export default function TwoQuestionsSection() {
  return (
    <section id="concepts" className="py-20 bg-[#0f0f23]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white font-['Saira_Condensed']">
            The Two Questions That Matter
          </h2>
          <p className="text-lg text-white/60 mt-4">
            Before you design anything, answer these for your <span className="text-[#D6EF3F]">learner</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* FEEL Card */}
          <div className="bg-white rounded-2xl p-8 h-full">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-bold rounded-full mb-4">
              FEEL
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              What should the learner <span className="text-purple-600">feel</span>?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Every scroll-stopping creative triggers an emotional response.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏛️</span>
                <div>
                  <span className="font-semibold text-gray-800">Trust</span>
                  <span className="text-gray-500"> — &ldquo;I can rely on these people&rdquo;</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌟</span>
                <div>
                  <span className="font-semibold text-gray-800">Possibility</span>
                  <span className="text-gray-500"> — &ldquo;Someone like me achieved this&rdquo;</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🛡️</span>
                <div>
                  <span className="font-semibold text-gray-800">Relief</span>
                  <span className="text-gray-500"> — &ldquo;My fear has been addressed&rdquo;</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <span className="font-semibold text-gray-800">Clarity</span>
                  <span className="text-gray-500"> — &ldquo;Now I understand&rdquo;</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🪞</span>
                <div>
                  <span className="font-semibold text-gray-800">Recognition</span>
                  <span className="text-gray-500"> — &ldquo;Wait, that&apos;s me!&rdquo;</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🤝</span>
                <div>
                  <span className="font-semibold text-gray-800">Belonging</span>
                  <span className="text-gray-500"> — &ldquo;I&apos;m part of something&rdquo;</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <div>
                  <span className="font-semibold text-gray-800">Momentum</span>
                  <span className="text-gray-500"> — &ldquo;I need to act now&rdquo;</span>
                </div>
              </div>
            </div>
          </div>

          {/* DO Card */}
          <div className="bg-white rounded-2xl p-8 h-full">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full mb-4">
              DO
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              What should the learner <span className="text-blue-600">do</span>?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              This is your Call-to-Action — the next step after seeing your creative.
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <span className="text-xl">💬</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Engage Here</p>
                  <p className="text-xs text-gray-500">Like, comment, save</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🔍</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Explore Content</p>
                  <p className="text-xs text-gray-500">YouTube, blog</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">📖</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Learn More</p>
                  <p className="text-xs text-gray-500">Curriculum, landing page</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">✅</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Enroll Now</p>
                  <p className="text-xs text-gray-500">Direct conversion</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">📥</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Download</p>
                  <p className="text-xs text-gray-500">PDFs, brochures</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🧭</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Career Assessment</p>
                  <p className="text-xs text-gray-500">Suitability test</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">📐</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Career Roadmap</p>
                  <p className="text-xs text-gray-500">Path calculator</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xl">🎯</span>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">Join Live Event</p>
                  <p className="text-xs text-gray-500">Webinar, workshop</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
