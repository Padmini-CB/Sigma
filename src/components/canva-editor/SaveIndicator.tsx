'use client';

import React from 'react';
import type { SaveStatus } from './useAutoSave';

interface SaveIndicatorProps {
  status: SaveStatus;
  conflictWarning?: boolean;
  onDismissConflict?: () => void;
}

export default function SaveIndicator({ status, conflictWarning, onDismissConflict }: SaveIndicatorProps) {
  if (status === 'idle' && !conflictWarning) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 56,
          right: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          borderRadius: 8,
          backgroundColor: 'rgba(30, 30, 46, 0.9)',
          border: '1px solid rgba(255,255,255,0.08)',
          zIndex: 200,
          fontFamily: 'Manrope, sans-serif',
          fontSize: 12,
          fontWeight: 500,
          animation: 'fadeIn 150ms ease-out',
          backdropFilter: 'blur(8px)',
        }}
      >
        {status === 'saving' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#3B82F6" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Saving...</span>
          </>
        )}
        {status === 'saved' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>All changes saved</span>
          </>
        )}
        {status === 'error' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ color: '#F59E0B' }}>Save failed — retrying...</span>
          </>
        )}
        {status === 'offline' && (
          <>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="1" y1="1" x2="23" y2="23" />
              <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
              <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
              <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
              <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
              <line x1="12" y1="20" x2="12.01" y2="20" />
            </svg>
            <span style={{ color: '#F59E0B' }}>Offline — changes will be saved when you reconnect</span>
          </>
        )}
      </div>

      {/* Conflict warning banner */}
      {conflictWarning && (
        <div
          style={{
            position: 'fixed',
            top: 56,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 16px',
            borderRadius: 8,
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            zIndex: 200,
            fontFamily: 'Manrope, sans-serif',
            fontSize: 12,
            fontWeight: 500,
            color: '#F59E0B',
            animation: 'fadeIn 150ms ease-out',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          <span>This creative was modified by someone else. Your latest changes have been saved.</span>
          <button
            onClick={onDismissConflict}
            style={{
              background: 'none',
              border: 'none',
              color: '#F59E0B',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 14,
              padding: '0 4px',
            }}
          >
            &times;
          </button>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
