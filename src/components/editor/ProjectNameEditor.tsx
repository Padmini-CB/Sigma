'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface ProjectNameEditorProps {
  name: string;
  onChange: (name: string) => void;
}

export default function ProjectNameEditor({ name, onChange }: ProjectNameEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep editValue synced with name prop when not editing
  useEffect(() => {
    if (!isEditing) {
      setEditValue(name);
    }
  }, [name, isEditing]);

  const handleStartEdit = useCallback(() => {
    setIsEditing(true);
    setEditValue(name);
    // Focus input after render
    setTimeout(() => inputRef.current?.select(), 0);
  }, [name]);

  const handleFinish = useCallback(() => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== name) {
      onChange(trimmed);
    } else {
      setEditValue(name);
    }
    setIsEditing(false);
  }, [editValue, name, onChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFinish();
    } else if (e.key === 'Escape') {
      setEditValue(name);
      setIsEditing(false);
    }
  }, [handleFinish, name]);

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleFinish}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{
          fontFamily: 'Manrope, sans-serif',
          fontSize: 14,
          fontWeight: 700,
          color: '#fff',
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(59,130,246,0.4)',
          borderRadius: 4,
          padding: '2px 8px',
          outline: 'none',
          minWidth: 120,
          maxWidth: 280,
        }}
      />
    );
  }

  return (
    <span
      onClick={handleStartEdit}
      title="Click to rename project"
      style={{
        fontFamily: 'Manrope, sans-serif',
        fontSize: 14,
        fontWeight: 700,
        color: '#fff',
        cursor: 'text',
        padding: '2px 6px',
        borderRadius: 4,
        transition: 'background-color 150ms ease-out',
        maxWidth: 280,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => { (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)'; }}
      onMouseLeave={(e) => { (e.target as HTMLElement).style.backgroundColor = 'transparent'; }}
    >
      {name}
    </span>
  );
}
