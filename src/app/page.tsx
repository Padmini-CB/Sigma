export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-dark">
      <main className="container mx-auto px-6 py-16">
        {/* Header */}
        <header className="mb-16">
          <h1 className="font-headline text-5xl font-bold text-white mb-4">
            SIGMA
          </h1>
          <p className="font-body text-xl text-brand-gray">
            Strategic Image Generation for Marketing Assets
          </p>
        </header>

        {/* Brand Colors Demo */}
        <section className="mb-16">
          <h2 className="font-headline text-2xl font-semibold text-white mb-6">
            Brand Colors
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-brand-blue mb-2"></div>
              <span className="font-ui text-sm text-white">Blue</span>
              <span className="font-ui text-xs text-brand-gray">#3B82F6</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-brand-purple mb-2"></div>
              <span className="font-ui text-sm text-white">Purple</span>
              <span className="font-ui text-xs text-brand-gray">#6F53C1</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-brand-navy border border-white/20 mb-2"></div>
              <span className="font-ui text-sm text-white">Navy</span>
              <span className="font-ui text-xs text-brand-gray">#181830</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-brand-lime mb-2"></div>
              <span className="font-ui text-sm text-white">Lime</span>
              <span className="font-ui text-xs text-brand-gray">#D7EF3F</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-white mb-2"></div>
              <span className="font-ui text-sm text-white">White</span>
              <span className="font-ui text-xs text-brand-gray">#FFFFFF</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-lg bg-brand-gray mb-2"></div>
              <span className="font-ui text-sm text-white">Gray</span>
              <span className="font-ui text-xs text-brand-gray">#F3F4F6</span>
            </div>
          </div>
        </section>

        {/* Typography Demo */}
        <section className="mb-16">
          <h2 className="font-headline text-2xl font-semibold text-white mb-6">
            Typography
          </h2>
          <div className="space-y-6">
            <div>
              <span className="font-ui text-xs text-brand-gray block mb-2">Saira Condensed - Headlines</span>
              <p className="font-headline text-4xl font-bold text-white">
                Build Skills That Get Jobs
              </p>
            </div>
            <div>
              <span className="font-ui text-xs text-brand-gray block mb-2">Kanit - Body Text</span>
              <p className="font-body text-lg text-brand-gray">
                Not toy datasets — enterprise-grade systems with millions of records.
                Industry-simulated learning environment.
              </p>
            </div>
            <div>
              <span className="font-ui text-xs text-brand-gray block mb-2">Manrope - UI Elements</span>
              <p className="font-ui text-base text-white">
                1.4M+ YouTube Subscribers • 44K+ Paid Learners • 4.9 Rating
              </p>
            </div>
          </div>
        </section>

        {/* CTA Demo */}
        <section>
          <h2 className="font-headline text-2xl font-semibold text-white mb-6">
            Call to Action
          </h2>
          <button className="btn-cta">
            Start Learning Today
          </button>
        </section>
      </main>
    </div>
  );
}
