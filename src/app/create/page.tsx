'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BootcampStep from '@/components/create/BootcampStep';
import RecentDesignsGallery from '@/components/recent-designs/RecentDesignsGallery';

export default function CreatePage() {
  const router = useRouter();

  const handleBootcampSelect = (bootcamp: string) => {
    // Navigate directly to editor with bootcamp filter — templates panel will show only matching templates
    router.push(`/editor/meta-feed-square?bootcamp=${encodeURIComponent(bootcamp)}`);
  };

  return (
    <div className="min-h-screen bg-brand-navy">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-brand-navy/90 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <h1 className="font-headline text-2xl font-bold text-white">
                SIGMA
              </h1>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-24 pb-16 px-6">
        <div className="container mx-auto">
          {/* Recent Designs Gallery */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: '24px 28px',
            marginBottom: 32,
            maxWidth: '56rem',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            <RecentDesignsGallery />
          </div>

          <div className="animate-fade-in">
            <BootcampStep
              onSelect={handleBootcampSelect}
              onBack={() => router.push('/')}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-brand-navy/90 backdrop-blur-md border-t border-white/10 py-3 px-6">
        <div className="container mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-ui text-sm text-gray-400 hover:text-white transition-colors"
          >
            &larr; Back to Home
          </Link>
          <Link
            href="/thumbnail-maker"
            className="font-ui text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            YouTube Thumbnail Maker &rarr;
          </Link>
        </div>
      </footer>
    </div>
  );
}
