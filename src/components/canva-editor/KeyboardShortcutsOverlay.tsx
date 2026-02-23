'use client';

interface KeyboardShortcutsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const isMac = typeof navigator !== 'undefined' && /Mac/.test(navigator.userAgent);
const mod = isMac ? '\u2318' : 'Ctrl';

const SHORTCUTS = [
  { category: 'General', items: [
    { keys: `${mod}+Z`, action: 'Undo' },
    { keys: `${mod}+Shift+Z`, action: 'Redo' },
    { keys: `${mod}+Y`, action: 'Redo (alt)' },
    { keys: `${mod}+S`, action: 'Save / Export' },
    { keys: `${mod}+A`, action: 'Select all elements' },
    { keys: 'Escape', action: 'Deselect all / Cancel' },
    { keys: '?', action: 'Toggle this help' },
  ]},
  { category: 'Elements', items: [
    { keys: 'Delete / Backspace', action: 'Delete selected' },
    { keys: `${mod}+C`, action: 'Copy selected' },
    { keys: `${mod}+V`, action: 'Paste' },
    { keys: `${mod}+D`, action: 'Duplicate (+10px offset)' },
    { keys: `${mod}+L`, action: 'Lock/unlock position' },
  ]},
  { category: 'Movement', items: [
    { keys: '\u2190 \u2191 \u2192 \u2193', action: 'Nudge 1px' },
    { keys: 'Shift + Arrow', action: 'Nudge 10px' },
  ]},
  { category: 'Layering', items: [
    { keys: ']', action: 'Bring forward' },
    { keys: '[', action: 'Send backward' },
    { keys: `${mod}+]`, action: 'Bring to front' },
    { keys: `${mod}+[`, action: 'Send to back' },
  ]},
  { category: 'Grouping', items: [
    { keys: `${mod}+G`, action: 'Group selected' },
    { keys: `${mod}+Shift+G`, action: 'Ungroup' },
  ]},
  { category: 'View', items: [
    { keys: `${mod}++`, action: 'Zoom in' },
    { keys: `${mod}+-`, action: 'Zoom out' },
    { keys: `${mod}+0`, action: 'Zoom to fit' },
    { keys: 'Space + Drag', action: 'Pan canvas' },
  ]},
];

export default function KeyboardShortcutsOverlay({ isOpen, onClose }: KeyboardShortcutsOverlayProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#1e1e2e',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.1)',
          padding: '24px 32px',
          maxWidth: 640,
          width: '90vw',
          maxHeight: '80vh',
          overflowY: 'auto',
          boxShadow: '0 16px 64px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: 'Manrope, sans-serif', fontSize: 18, fontWeight: 700, color: '#fff', margin: 0 }}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32, borderRadius: 8,
              border: 'none', backgroundColor: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}
          >
            \u2715
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {SHORTCUTS.map(section => (
            <div key={section.category}>
              <h3 style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 12,
                fontWeight: 700,
                color: '#3B82F6',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: 8,
                margin: 0,
                paddingBottom: 6,
                borderBottom: '1px solid rgba(255,255,255,0.08)',
              }}>
                {section.category}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {section.items.map(item => (
                  <div key={item.action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0' }}>
                    <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                      {item.action}
                    </span>
                    <kbd style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.5)',
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 4,
                      padding: '2px 6px',
                      whiteSpace: 'nowrap',
                    }}>
                      {item.keys}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 20,
          paddingTop: 12,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center',
        }}>
          <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            Press <kbd style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4, padding: '1px 5px', fontSize: 11 }}>?</kbd> to toggle this overlay
          </span>
        </div>
      </div>
    </div>
  );
}
