import { BRAND } from '@/styles/brand-constants';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  isWarning?: boolean;
}

interface ChatMockupProps {
  messages: ChatMessage[];
}

export function ChatMockup({ messages }: ChatMockupProps) {
  return (
    <div
      style={{
        backgroundColor: BRAND.colors.bgCard,
        borderRadius: 12,
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        border: `1px solid ${BRAND.colors.borderSubtle}`,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          paddingBottom: 10,
          borderBottom: `1px solid ${BRAND.colors.borderSubtle}`,
          flexShrink: 0,
        }}
      >
        <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(135deg, #10a37f, #1a7f5a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>G</span>
        </div>
        <span style={{ color: BRAND.colors.textMuted, fontSize: 14, fontWeight: 600, fontFamily: BRAND.fonts.body }}>ChatGPT</span>
        <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10a37f' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflow: 'hidden' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              style={{
                maxWidth: '88%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                backgroundColor: msg.role === 'user' ? 'rgba(67,97,238,0.15)' : msg.isWarning ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.04)',
                border: msg.isWarning ? `2px solid ${BRAND.colors.redWarning}` : msg.role === 'user' ? '1px solid rgba(67,97,238,0.25)' : `1px solid ${BRAND.colors.borderSubtle}`,
                fontSize: 13,
                lineHeight: 1.4,
                fontFamily: BRAND.fonts.body,
                color: msg.isWarning ? '#fca5a5' : msg.role === 'user' ? '#c5d0f0' : BRAND.colors.textMuted,
              }}
            >
              {msg.role === 'ai' && (
                <div style={{ fontSize: 9, fontWeight: 700, color: '#ef4444', letterSpacing: '0.1em', marginBottom: 4, textTransform: 'uppercase' as const }}>CHATGPT</div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
