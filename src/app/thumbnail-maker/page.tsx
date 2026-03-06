'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import YouTubePreviewPanel from '@/components/thumbnail-maker/YouTubePreviewPanel';

export default function ThumbnailMakerPage() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden', display: 'flex' }}>
      {/* Main area */}
      <div style={{
        flex: 1,
        position: 'relative',
        transition: 'margin-right 0.3s ease',
        marginRight: showPreview ? '480px' : '0',
      }}>
        {/* Back button */}
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

        {/* YouTube Preview toggle button */}
        <button
          onClick={() => setShowPreview(!showPreview)}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            background: showPreview ? 'rgba(255, 0, 0, 0.8)' : 'rgba(13, 17, 23, 0.85)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${showPreview ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255,255,255,0.15)'}`,
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
            if (!showPreview) {
              e.currentTarget.style.background = 'rgba(255, 0, 0, 0.7)';
              e.currentTarget.style.borderColor = 'rgba(255, 0, 0, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!showPreview) {
              e.currentTarget.style.background = 'rgba(13, 17, 23, 0.85)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
            }
          }}
        >
          <svg width="16" height="12" viewBox="0 0 24 17" fill="#FF0000">
            <path d="M23.498 2.186A3.016 3.016 0 0 0 21.376.05C19.505-.455 12-.455 12-.455s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 2.186C0 4.07 0 8 0 8s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 11.93 24 8 24 8s0-3.93-.502-5.814zM9.545 11.568V4.432L15.818 8l-6.273 3.568z" />
          </svg>
          {showPreview ? 'Close Preview' : 'YouTube Preview'}
        </button>

        {/* Thumbnail Maker iframe */}
        <iframe
          ref={iframeRef}
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

      {/* YouTube Preview Panel */}
      <YouTubePreviewPanel
        iframeRef={iframeRef}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </div>
  );
}
