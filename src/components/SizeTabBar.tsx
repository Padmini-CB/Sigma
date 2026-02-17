'use client';

import { AD_SIZES, type AdSize } from '@/config/adSizes';

interface SizeTabBarProps {
  activeSize: AdSize;
  onSizeChange: (size: AdSize) => void;
  onDownload: () => void;
  onDownloadAll: () => void;
  isExporting: boolean;
  isExportingAll: boolean;
}

export default function SizeTabBar({
  activeSize,
  onSizeChange,
  onDownload,
  onDownloadAll,
  isExporting,
  isExportingAll,
}: SizeTabBarProps) {
  const anyBusy = isExporting || isExportingAll;

  return (
    <div
      className="flex-shrink-0 flex items-center justify-between gap-2 px-3 sm:px-5 overflow-x-auto"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Size tabs */}
      <div className="flex items-center gap-0 min-w-0 overflow-x-auto hide-scrollbar">
        {AD_SIZES.map(size => {
          const isActive = size.id === activeSize.id;
          return (
            <button
              key={size.id}
              onClick={() => onSizeChange(size)}
              className="relative flex-shrink-0 flex flex-col items-center px-3 sm:px-4 py-2.5 transition-colors"
              style={{
                color: isActive ? '#3B82F6' : 'rgba(255,255,255,0.5)',
                borderBottom: isActive ? '2px solid #3B82F6' : '2px solid transparent',
              }}
            >
              <span
                className="font-headline"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                {size.label}
              </span>
              <span
                className="font-body"
                style={{
                  fontSize: 10,
                  opacity: isActive ? 0.8 : 0.5,
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}
              >
                {size.width} &times; {size.height}
              </span>
            </button>
          );
        })}
      </div>

      {/* Download buttons */}
      <div className="flex items-center gap-2 flex-shrink-0 py-2">
        {/* Download current size */}
        <button
          onClick={onDownload}
          disabled={anyBusy}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: '#ffffff',
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 600,
            fontSize: 12,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-opacity disabled:opacity-40 hover:opacity-80 whitespace-nowrap"
        >
          {isExporting ? (
            <Spinner />
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          Download
        </button>

        {/* Download all sizes */}
        <button
          onClick={onDownloadAll}
          disabled={anyBusy}
          style={{
            background: '#D7EF3F',
            color: '#181830',
            fontFamily: "'Saira Condensed', sans-serif",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: '1px',
            textTransform: 'uppercase',
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-opacity disabled:opacity-40 hover:opacity-90 whitespace-nowrap"
        >
          {isExportingAll ? (
            <>
              <Spinner dark />
              <span>Generating {AD_SIZES.length} sizes&hellip;</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download All Sizes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Spinner({ dark }: { dark?: boolean }) {
  const color = dark ? '#181830' : '#ffffff';
  return (
    <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke={color} strokeWidth="4" />
      <path className="opacity-75" fill={color} d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
