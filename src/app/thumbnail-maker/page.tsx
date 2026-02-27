'use client';

import { useRouter } from 'next/navigation';

export default function ThumbnailMakerPage() {
  const router = useRouter();

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Back button overlay */}
      <button
        onClick={() => router.push('/create')}
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 16px',
          background: 'rgba(13, 17, 23, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '8px',
          color: '#FFFFFF',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'Poppins, sans-serif',
          cursor: 'pointer',
          transition: 'all 0.2s',
          letterSpacing: '0.3px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.8)';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(13, 17, 23, 0.85)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        }}
      >
        ← Back to Sigma
      </button>

      {/* Thumbnail Maker iframe */}
      <iframe
        src="/thumbnail-maker/index.html"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        allow="clipboard-read; clipboard-write; download"
        sandbox="allow-scripts allow-same-origin allow-downloads allow-popups allow-forms allow-modals"
        title="YouTube Thumbnail Maker"
      />
    </div>
  );
}
