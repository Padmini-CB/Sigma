'use client';

import { type SaveStatus } from '@/hooks/useAutoSave';

interface SaveIndicatorProps {
  status: SaveStatus;
}

export default function SaveIndicator({ status }: SaveIndicatorProps) {
  if (status === 'idle') return null;

  return (
    <span
      style={{
        fontFamily: 'Manrope, sans-serif',
        fontSize: 11,
        fontWeight: 400,
        color: '#9DA3A7',
        transition: 'opacity 150ms ease-out',
        opacity: 1,
        whiteSpace: 'nowrap',
        userSelect: 'none',
      }}
    >
      {status === 'saving' && 'Saving...'}
      {status === 'saved' && '\u2713 Saved'}
    </span>
  );
}
