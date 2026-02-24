'use client';

import { useState, useRef } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

interface UploadsPanelProps {
  onDragStart: (dataUrl: string, width: number, height: number, e: React.DragEvent) => void;
  onClickAdd?: (dataUrl: string, width: number, height: number) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp', 'image/gif'];

export default function UploadsPanel({ onDragStart, onClickAdd }: UploadsPanelProps) {
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setError(null);
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/') && !ACCEPTED_TYPES.includes(file.type)) {
        setError(`Unsupported format: ${file.name}`);
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setError(`File too large (max 10MB): ${file.name}`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setUploads(prev => [...prev, {
            id: `upload_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            name: file.name,
            dataUrl,
            width: img.width,
            height: img.height,
          }]);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDelete = (id: string) => {
    setUploads(prev => prev.filter(f => f.id !== id));
  };

  const handleClickAdd = (file: UploadedFile) => {
    if (onClickAdd) {
      onClickAdd(file.dataUrl, file.width, file.height);
    }
  };

  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }}>
      <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Upload Images
      </p>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        style={{
          border: `2px dashed ${isDragOver ? '#3B82F6' : 'rgba(255,255,255,0.15)'}`,
          borderRadius: 12,
          padding: '32px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          cursor: 'pointer',
          transition: 'border-color 150ms, background-color 150ms',
          backgroundColor: isDragOver ? 'rgba(59,130,246,0.05)' : 'transparent',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
          Drop images here or click to upload
        </span>
        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
          PNG, JPG, SVG, WebP, GIF &middot; Max 10MB
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp,image/gif"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => { handleFiles(e.target.files); if (e.target) e.target.value = ''; }}
      />

      {/* Error message */}
      {error && (
        <div style={{
          padding: '8px 12px',
          borderRadius: 6,
          backgroundColor: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
        }}>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: '#ef4444' }}>{error}</span>
        </div>
      )}

      {/* Uploaded files */}
      {uploads.length > 0 && (
        <>
          <p style={{ fontFamily: 'Manrope, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Recently Uploaded
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {uploads.map(file => (
              <div
                key={file.id}
                draggable
                onDragStart={(e) => onDragStart(file.dataUrl, file.width, file.height, e)}
                onClick={() => handleClickAdd(file)}
                style={{
                  position: 'relative',
                  aspectRatio: '1',
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'pointer',
                  backgroundColor: '#0D1117',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.dataUrl}
                  alt={file.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    color: '#fff',
                    fontSize: 12,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1,
                    padding: 0,
                  }}
                  title="Remove from library"
                >
                  &times;
                </button>
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  padding: '16px 6px 4px',
                }}>
                  <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.7)' }}>
                    {file.name.length > 15 ? file.name.slice(0, 12) + '...' : file.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
