'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

type PreviewMode = 'desktop' | 'mobile' | 'suggested';

interface YouTubePreviewPanelProps {
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
  isOpen: boolean;
  onClose: () => void;
}

export default function YouTubePreviewPanel({ iframeRef, isOpen, onClose }: YouTubePreviewPanelProps) {
  const [thumbnailSrc, setThumbnailSrc] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('desktop');
  const [videoTitle, setVideoTitle] = useState('Your Video Title Here - Codebasics');
  const [channelName, setChannelName] = useState('codebasics');
  const [timestamp, setTimestamp] = useState('12:45');
  const [isCapturing, setIsCapturing] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const captureThumbnail = useCallback(() => {
    if (!iframeRef.current) return;
    try {
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (!iframeDoc) return;
      const canvas = iframeDoc.getElementById('canvas') as HTMLElement;
      if (!canvas) return;

      const iframeWindow = iframeRef.current.contentWindow;
      if (!iframeWindow || !(iframeWindow as any).html2canvas) return;

      setIsCapturing(true);
      (iframeWindow as any).html2canvas(canvas, {
        scale: 1,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
      }).then((c: HTMLCanvasElement) => {
        setThumbnailSrc(c.toDataURL('image/jpeg', 0.9));
        setIsCapturing(false);
      }).catch(() => setIsCapturing(false));
    } catch {
      // cross-origin or other error
    }
  }, [iframeRef]);

  // Live update: capture every 2 seconds while panel is open
  useEffect(() => {
    if (isOpen) {
      captureThumbnail();
      intervalRef.current = setInterval(captureThumbnail, 2000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isOpen, captureThumbnail]);

  if (!isOpen) return null;

  const modes: { key: PreviewMode; label: string }[] = [
    { key: 'desktop', label: 'Desktop' },
    { key: 'mobile', label: 'Mobile' },
    { key: 'suggested', label: 'Suggested' },
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '480px',
      height: '100vh',
      background: '#0f0f0f',
      borderLeft: '1px solid #272727',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"Roboto", "Arial", sans-serif',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #272727',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <svg width="20" height="14" viewBox="0 0 24 17" fill="#FF0000">
            <path d="M23.498 2.186A3.016 3.016 0 0 0 21.376.05C19.505-.455 12-.455 12-.455s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 2.186C0 4.07 0 8 0 8s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 11.93 24 8 24 8s0-3.93-.502-5.814zM9.545 11.568V4.432L15.818 8l-6.273 3.568z" />
          </svg>
          <span style={{ color: '#fff', fontSize: '15px', fontWeight: 500 }}>YouTube Preview</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={captureThumbnail}
            disabled={isCapturing}
            style={{
              background: '#272727',
              border: '1px solid #3a3a3a',
              borderRadius: '6px',
              color: '#aaa',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            {isCapturing ? '...' : '↻ Refresh'}
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#aaa',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '0 4px',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Mode tabs */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '12px 20px',
        borderBottom: '1px solid #272727',
        flexShrink: 0,
      }}>
        {modes.map(m => (
          <button
            key={m.key}
            onClick={() => setPreviewMode(m.key)}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: '8px',
              border: 'none',
              background: previewMode === m.key ? '#272727' : 'transparent',
              color: previewMode === m.key ? '#fff' : '#888',
              fontSize: '13px',
              fontWeight: previewMode === m.key ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 0.15s',
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Editable fields */}
        <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            value={videoTitle}
            onChange={e => setVideoTitle(e.target.value)}
            placeholder="Video title"
            style={{
              background: '#1a1a1a',
              border: '1px solid #333',
              borderRadius: '6px',
              color: '#fff',
              padding: '8px 12px',
              fontSize: '13px',
              width: '100%',
              outline: 'none',
            }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              value={channelName}
              onChange={e => setChannelName(e.target.value)}
              placeholder="Channel name"
              style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#aaa',
                padding: '6px 10px',
                fontSize: '12px',
                flex: 1,
                outline: 'none',
              }}
            />
            <input
              value={timestamp}
              onChange={e => setTimestamp(e.target.value)}
              placeholder="12:45"
              style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '6px',
                color: '#aaa',
                padding: '6px 10px',
                fontSize: '12px',
                width: '70px',
                textAlign: 'center',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Preview */}
        {previewMode === 'desktop' && (
          <DesktopPreview
            src={thumbnailSrc}
            title={videoTitle}
            channel={channelName}
            timestamp={timestamp}
          />
        )}
        {previewMode === 'mobile' && (
          <MobilePreview
            src={thumbnailSrc}
            title={videoTitle}
            channel={channelName}
            timestamp={timestamp}
          />
        )}
        {previewMode === 'suggested' && (
          <SuggestedPreview
            src={thumbnailSrc}
            title={videoTitle}
            channel={channelName}
            timestamp={timestamp}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Channel avatar ─── */
function ChannelAvatar({ size = 36 }: { size?: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: Math.round(size * 0.4),
      fontWeight: 700,
      flexShrink: 0,
    }}>
      CB
    </div>
  );
}

/* ─── Desktop Preview (Video Card) ─── */
function DesktopPreview({ src, title, channel, timestamp }: {
  src: string | null; title: string; channel: string; timestamp: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div style={{ background: '#0f0f0f' }}>
      <p style={{ color: '#555', fontSize: '11px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Desktop — Home Feed
      </p>
      <div style={{ maxWidth: '440px' }}>
        {/* Thumbnail with 16:9 aspect ratio */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%',
            borderRadius: '12px',
            overflow: 'hidden',
            background: '#1a1a1a',
          }}
        >
          {src ? (
            <img src={src} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}>
              Loading preview...
            </div>
          )}
          {/* Timestamp */}
          <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '12px', fontWeight: 500, padding: '2px 6px', borderRadius: '4px' }}>
            {timestamp}
          </div>
          {/* Progress bar */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)' }}>
            <div style={{ width: '30%', height: '100%', background: '#FF0000' }} />
          </div>
          {/* Watch Later + Menu on hover */}
          {hovered && (
            <div style={{ position: 'absolute', top: '6px', right: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ background: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                </svg>
              </div>
              <div style={{ background: 'rgba(0,0,0,0.7)', borderRadius: '4px', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Video info */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <ChannelAvatar />
          <div style={{ flex: 1 }}>
            <p style={{
              color: '#f1f1f1',
              fontSize: '14px',
              fontWeight: 500,
              lineHeight: '20px',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {title}
            </p>
            <p style={{ color: '#aaa', fontSize: '12px', margin: '4px 0 0', lineHeight: '18px' }}>
              {channel}
            </p>
            <p style={{ color: '#aaa', fontSize: '12px', margin: 0, lineHeight: '18px' }}>
              1.2M views · 2 days ago
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Mobile Preview (Feed) ─── */
function MobilePreview({ src, title, channel, timestamp }: {
  src: string | null; title: string; channel: string; timestamp: string;
}) {
  return (
    <div style={{ background: '#0f0f0f' }}>
      <p style={{ color: '#555', fontSize: '11px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Mobile — Feed
      </p>

      {/* Mobile frame */}
      <div style={{
        maxWidth: '360px',
        margin: '0 auto',
        background: '#0f0f0f',
        borderRadius: '16px',
        border: '2px solid #272727',
        padding: '12px 0',
        overflow: 'hidden',
      }}>
        {/* Status bar mockup */}
        <div style={{ padding: '0 12px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}>9:41</span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <div style={{ width: '16px', height: '10px', border: '1px solid #fff', borderRadius: '2px', padding: '1px' }}>
              <div style={{ width: '70%', height: '100%', background: '#fff', borderRadius: '1px' }} />
            </div>
          </div>
        </div>

        {/* Full-width thumbnail */}
        <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#1a1a1a' }}>
          {src && (
            <img src={src} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
          <div style={{ position: 'absolute', bottom: '6px', right: '6px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '11px', fontWeight: 500, padding: '1px 5px', borderRadius: '3px' }}>
            {timestamp}
          </div>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px', background: 'rgba(255,255,255,0.2)' }}>
            <div style={{ width: '30%', height: '100%', background: '#FF0000' }} />
          </div>
        </div>

        {/* Mobile video info */}
        <div style={{ padding: '10px 12px', display: 'flex', gap: '10px' }}>
          <ChannelAvatar size={32} />
          <div style={{ flex: 1 }}>
            <p style={{
              color: '#f1f1f1',
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: '18px',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {title}
            </p>
            <p style={{ color: '#aaa', fontSize: '11px', margin: '2px 0 0' }}>
              {channel} · 1.2M views · 2 days ago
            </p>
          </div>
          {/* Vertical dots */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#aaa" style={{ flexShrink: 0, marginTop: '2px' }}>
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Suggested Video Preview (Sidebar) ─── */
function SuggestedPreview({ src, title, channel, timestamp }: {
  src: string | null; title: string; channel: string; timestamp: string;
}) {
  return (
    <div style={{ background: '#0f0f0f' }}>
      <p style={{ color: '#555', fontSize: '11px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>
        Desktop — Suggested Sidebar
      </p>

      {/* Multiple suggested items to show context */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '10px',
          opacity: i === 0 ? 1 : 0.5,
        }}>
          {/* Small thumbnail */}
          <div style={{
            position: 'relative',
            width: '168px',
            height: '94px',
            borderRadius: '8px',
            overflow: 'hidden',
            background: '#1a1a1a',
            flexShrink: 0,
          }}>
            {i === 0 && src ? (
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: i === 1 ? '#1e293b' : '#1a1a2e' }} />
            )}
            <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '11px', padding: '1px 4px', borderRadius: '3px' }}>
              {i === 0 ? timestamp : i === 1 ? '8:32' : '15:10'}
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(255,255,255,0.2)' }}>
              <div style={{ width: i === 0 ? '30%' : i === 1 ? '65%' : '10%', height: '100%', background: '#FF0000' }} />
            </div>
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{
              color: i === 0 ? '#f1f1f1' : '#888',
              fontSize: '13px',
              fontWeight: 500,
              lineHeight: '18px',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {i === 0 ? title : i === 1 ? 'SQL Tutorial for Beginners' : 'Power BI Full Course 2024'}
            </p>
            <p style={{ color: '#aaa', fontSize: '11px', margin: '4px 0 0' }}>
              {i === 0 ? channel : 'codebasics'}
            </p>
            <p style={{ color: '#aaa', fontSize: '11px', margin: 0 }}>
              {i === 0 ? '1.2M views · 2 days ago' : i === 1 ? '850K views · 1 month ago' : '2.1M views · 6 months ago'}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
