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
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        border: `1px solid ${BRAND.colors.borderCard}`,
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Chat header */}
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
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: 6,
            background: 'linear-gradient(135deg, #10a37f, #1a7f5a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 700 }}>G</span>
        </div>
        <span style={{ color: BRAND.colors.textMuted, fontSize: 12, fontFamily: BRAND.fonts.body }}>
          ChatGPT
        </span>
        <div
          style={{
            marginLeft: 'auto',
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#10a37f',
          }}
        />
      </div>

      {/* Messages */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, overflow: 'hidden' }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '8px 12px',
                borderRadius: msg.role === 'user' ? '10px 10px 2px 10px' : '10px 10px 10px 2px',
                backgroundColor: msg.role === 'user'
                  ? 'rgba(67,97,238,0.2)'
                  : msg.isWarning
                    ? 'rgba(239,68,68,0.1)'
                    : 'rgba(255,255,255,0.05)',
                border: msg.isWarning
                  ? `1px solid ${BRAND.colors.redWarning}`
                  : msg.role === 'user'
                    ? `1px solid rgba(67,97,238,0.3)`
                    : `1px solid ${BRAND.colors.borderSubtle}`,
                fontSize: 11,
                lineHeight: 1.4,
                fontFamily: BRAND.fonts.body,
                color: msg.isWarning ? '#fca5a5' : msg.role === 'user' ? '#c5d0f0' : BRAND.colors.textMuted,
              }}
            >
              {msg.role === 'ai' && (
                <div style={{ fontSize: 8, fontWeight: 700, color: '#ef4444', letterSpacing: '0.1em', marginBottom: 3, textTransform: 'uppercase' as const }}>
                  CHATGPT
                </div>
              )}
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
