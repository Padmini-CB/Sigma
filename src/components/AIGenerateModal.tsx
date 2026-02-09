'use client';

import { useState, useEffect, useRef } from 'react';

export interface GeneratedCreative {
  headline: string;
  subheadline: string;
  bodyText: string;
  cta: string;
  jesterLine?: string;
  character?: {
    name: string;
    pose: string;
    position: 'left' | 'right' | 'bottom';
    size: number;
  };
  founder?: {
    name: string;
    position: 'left' | 'right' | 'bottom';
  };
}

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (result: GeneratedCreative) => void;
}

const API_KEY_STORAGE_KEY = 'sigma_anthropic_api_key';

const SYSTEM_PROMPT = `You are a creative director for Codebasics, an ed-tech brand. You generate ad creatives that follow these brand guidelines:

BRAND VOICE: Sage archetype — clear, trustworthy, practical. Add a touch of Jester personality for warmth.

CHARACTERS AVAILABLE:
- Tony Sharma (key: "tony") — "The Shortcut Guy" who takes the easy path. Poses: attitude, explaining, presenting, seeing, talking, talkingonphone, thinking
- Peter Pandey (key: "peter") — "The Confused Beginner" who asks questions we all think. Poses: confused, frustrated, idea, victory, working
- Bruce Haryali (key: "bruce") — "The Overthinker" who analyzes until paralysis. Poses: talkingonphone, thinking, working

FOUNDERS AVAILABLE:
- Dhaval Patel — Founder & CEO
- Hemanand Vadivel — Co-Founder & CTO

BANNED WORDS: Magic, Instant, Easy, Guaranteed, Ninja, Guru, Master (in 7 days), 100% Placement, Shortcut, Hack, Rockstar

LOVED WORDS: Pipeline, Architecture, Project, Portfolio, Debug, Build, Real-World, Production, Scale, Competence, Skills, Practical, Enterprise-grade, Hands-on

You must respond with ONLY valid JSON (no markdown, no code fences) in this exact format:
{
  "headline": "Short punchy headline (max 8 words)",
  "subheadline": "Supporting line with specifics",
  "bodyText": "Features or benefits (use bullet separator •)",
  "cta": "Action-oriented CTA button text",
  "jesterLine": "A witty one-liner that adds Sage+Jester personality",
  "character": {
    "name": "tony|peter|bruce (or omit if no character fits)",
    "pose": "one of the available poses for that character",
    "position": "left|right|bottom",
    "size": 250
  }
}

If a founder is more appropriate than a character, replace "character" with:
"founder": {
  "name": "Dhaval Patel|Hemanand Vadivel",
  "position": "left|right"
}

Only include character OR founder, not both. Omit both if neither fits.`;

export function AIGenerateModal({ isOpen, onClose, onGenerate }: AIGenerateModalProps) {
  const [prompt, setPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load API key from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (stored) setApiKey(stored);
  }, []);

  // Focus textarea when modal opens
  useEffect(() => {
    if (isOpen && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Save API key to localStorage when it changes
  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem(API_KEY_STORAGE_KEY, value);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt describing what you want to create.');
      return;
    }
    if (!apiKey.trim()) {
      setError('Please enter your Anthropic API key.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Anthropic API key.');
        }
        throw new Error(`API error (${response.status}): ${errorBody}`);
      }

      const data = await response.json();
      const textContent = data.content?.find((c: { type: string }) => c.type === 'text');
      if (!textContent?.text) {
        throw new Error('No text response from API.');
      }

      const result: GeneratedCreative = JSON.parse(textContent.text);

      onGenerate(result);
      onClose();
      setPrompt('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-lg pointer-events-auto animate-fade-in"
          role="dialog"
          aria-label="Generate with AI"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h2 className="font-headline text-lg font-bold text-brand-navy">Generate with AI</h2>
                <p className="font-ui text-xs text-gray-500">Powered by Claude API</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            {/* API Key */}
            <div className="space-y-1.5">
              <label htmlFor="ai-api-key" className="block font-ui text-sm font-semibold text-brand-navy">
                Anthropic API Key
              </label>
              <div className="relative">
                <input
                  id="ai-api-key"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="sk-ant-..."
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-gray-300 font-body text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                  aria-label={showApiKey ? 'Hide API key' : 'Show API key'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showApiKey ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
              <p className="font-ui text-xs text-gray-400">
                Your key is stored locally in your browser.
              </p>
            </div>

            {/* Prompt */}
            <div className="space-y-1.5">
              <label htmlFor="ai-prompt" className="block font-ui text-sm font-semibold text-brand-navy">
                What do you want to create?
              </label>
              <textarea
                ref={textareaRef}
                id="ai-prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g. "Create a post with Tony being overconfident about certificates"'
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 font-body text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-colors resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleGenerate();
                  }
                }}
              />
              <p className="font-ui text-xs text-gray-400">
                Describe the creative you want. Mention characters, tone, or campaign goals.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="font-ui text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Quick prompts */}
            <div>
              <p className="font-ui text-xs font-semibold text-gray-500 mb-2">Quick ideas:</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Tony brags about skipping fundamentals',
                  'Peter finally builds his first pipeline',
                  'Bruce overthinks which bootcamp to join',
                  'Promote Data Engineering Bootcamp with Dhaval',
                ].map((idea) => (
                  <button
                    key={idea}
                    onClick={() => setPrompt(idea)}
                    className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 font-ui text-xs text-gray-600 transition-colors"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-ui text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim() || !apiKey.trim()}
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-ui text-sm font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Generate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
