'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      accessCode,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D1117',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Poppins, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        padding: '48px 40px',
        background: '#161B22',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            fontSize: '32px',
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '2px',
            marginBottom: '4px',
          }}>
            SIGMA
          </div>
          <div style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 400,
          }}>
            Creative Editor by Codebasics
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@codebasics.io"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0D1117',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontFamily: 'Poppins, sans-serif',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Access Code Field */}
          <div style={{ marginBottom: '28px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.5)',
              marginBottom: '8px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Team Access Code
            </label>
            <input
              type="password"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="Enter team access code"
              required
              style={{
                width: '100%',
                padding: '12px 16px',
                background: '#0D1117',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#FFFFFF',
                fontSize: '14px',
                fontFamily: 'Poppins, sans-serif',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px',
              color: '#ef4444',
              fontSize: '13px',
              marginBottom: '20px',
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: loading ? '#1e3a5f' : '#3b82f6',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 700,
              fontFamily: 'Poppins, sans-serif',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'background 0.2s',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#2563eb')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#3b82f6')}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          marginTop: '28px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.25)',
        }}>
          Only @codebasics.io emails are authorized
        </div>
      </div>
    </div>
  );
}
