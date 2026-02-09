import { NextResponse } from 'next/server';

// Demo responses for when API is unavailable
const DEMO_RESPONSES: Record<string, object> = {
  tony: {
    headline: "Certificates Don't Write Code.",
    subheadline: "You Do.",
    bodyText: "7 Business Projects • Virtual Internship • Job Assistance",
    character: {
      name: "tony",
      pose: "presenting",
      position: "left",
      size: 300
    },
    cta: "Build Real Skills",
    jesterLine: "Tony's certificate is collecting dust. Your GitHub portfolio won't."
  },
  peter: {
    headline: "From Confused to Confident.",
    subheadline: "Your Data Journey Starts Here.",
    bodyText: "Beginner-Friendly • No Prerequisites • Learn by Doing",
    character: {
      name: "peter",
      pose: "victory",
      position: "left",
      size: 320
    },
    cta: "Start Learning",
    jesterLine: "Peter asked 47 questions. Now he answers them."
  },
  bruce: {
    headline: "Stop Overthinking. Start Building.",
    subheadline: "Analysis Paralysis Ends Today.",
    bodyText: "Structured Curriculum • Clear Roadmap • No More Confusion",
    character: {
      name: "bruce",
      pose: "thinking",
      position: "left",
      size: 300
    },
    cta: "Get the Roadmap",
    jesterLine: "Bruce compared 12 bootcamps. He should've just started."
  },
  dhaval: {
    headline: "Learn from Engineers Who Built at Scale.",
    subheadline: "Not from people who just read about it.",
    bodyText: "Ex-NVIDIA • 10+ Years Experience • 1.4M+ YouTube Subscribers",
    founder: {
      name: "Dhaval Patel",
      position: "left"
    },
    cta: "Meet Your Instructor",
    jesterLine: "Dhaval debugged production at 3 AM. Your instructor should have war stories."
  },
  both: {
    headline: "Two Industry Veterans. One Mission.",
    subheadline: "Making Data Careers Accessible.",
    bodyText: "Ex-NVIDIA • Ex-Tiger Analytics • 44K+ Learners Trained",
    founder: {
      name: "Both Founders",
      position: "left"
    },
    cta: "Join the Bootcamp",
    jesterLine: "They left FAANG to teach. That says something."
  },
  certificates: {
    headline: "Certificates Don't Impress Recruiters.",
    subheadline: "GitHub Portfolios Do.",
    bodyText: "7 Real Projects • Code Reviews • Portfolio Website",
    character: {
      name: "tony",
      pose: "attitude",
      position: "left",
      size: 280
    },
    cta: "Build Your Portfolio",
    jesterLine: "HR can't run your certificate. They can run your code."
  },
  skills: {
    headline: "Real Skills Beat Paper Credentials.",
    subheadline: "Every. Single. Time.",
    bodyText: "Hands-on Projects • Industry Tools • Job-Ready Skills",
    character: {
      name: "peter",
      pose: "working",
      position: "right",
      size: 300
    },
    cta: "Start Building",
    jesterLine: "The best developers we know? Self-taught with real projects."
  }
};

function getDemoResponse(prompt: string): object {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('tony') || lowerPrompt.includes('shortcut') || lowerPrompt.includes('brag')) {
    return DEMO_RESPONSES.tony;
  }
  if (lowerPrompt.includes('peter') || lowerPrompt.includes('confused') || lowerPrompt.includes('beginner') || lowerPrompt.includes('pipeline')) {
    return DEMO_RESPONSES.peter;
  }
  if (lowerPrompt.includes('bruce') || lowerPrompt.includes('overthink')) {
    return DEMO_RESPONSES.bruce;
  }
  if (lowerPrompt.includes('dhaval') && !lowerPrompt.includes('hemanand') && !lowerPrompt.includes('both')) {
    return DEMO_RESPONSES.dhaval;
  }
  if (lowerPrompt.includes('both') || lowerPrompt.includes('founders') || (lowerPrompt.includes('dhaval') && lowerPrompt.includes('hemanand'))) {
    return DEMO_RESPONSES.both;
  }
  if (lowerPrompt.includes('hemanand')) {
    return { ...DEMO_RESPONSES.dhaval, founder: { name: 'Hemanand Vadivel', position: 'left' } };
  }
  if (lowerPrompt.includes('certificate')) {
    return DEMO_RESPONSES.certificates;
  }
  if (lowerPrompt.includes('skill')) {
    return DEMO_RESPONSES.skills;
  }

  // Default response
  return DEMO_RESPONSES.peter;
}

export async function POST(request: Request) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt required' }, { status: 400 });
    }

    // If no API key or demo mode requested, return demo response
    if (!apiKey || apiKey === 'demo' || apiKey.length < 10) {
      const demoResponse = getDemoResponse(prompt);
      return NextResponse.json({ ...demoResponse, isDemo: true });
    }

    // Try real API call
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: `You are Sigma, an AI creative assistant for Codebasics. Generate marketing creatives that are ethical and effective.

CHARACTERS: tony (shortcut guy), peter (confused beginner), bruce (overthinker)
FOUNDERS: Dhaval Patel, Hemanand Vadivel
POSES - Tony: attitude, explaining, presenting, seeing, talking, talkingonphone, thinking
POSES - Peter: confused, frustrated, idea, victory, working
POSES - Bruce: talkingonphone, thinking, working

BANNED WORDS: Magic, Instant, Easy, Guaranteed, Ninja, Guru, Master (in 7 days), 100% Placement, Shortcut, Hack, Rockstar
LOVED WORDS: Pipeline, Architecture, Project, Portfolio, Debug, Build, Real-World, Production, Scale, Competence, Skills, Practical, Enterprise-grade, Hands-on

Return ONLY valid JSON:
{
  "headline": "string",
  "subheadline": "string",
  "bodyText": "string",
  "character": { "name": "tony|peter|bruce", "pose": "string", "position": "left|right|bottom", "size": 250 } OR null,
  "founder": { "name": "Dhaval Patel|Hemanand Vadivel", "position": "left|right" } OR null,
  "cta": "string",
  "jesterLine": "A witty Sage+Jester quip"
}

Only include character OR founder, not both. Omit both if neither fits.`,
          messages: [{ role: 'user', content: `Create a creative for: "${prompt}"` }]
        })
      });

      if (!response.ok) {
        // If API error (like no credits), fall back to demo
        const demoResponse = getDemoResponse(prompt);
        return NextResponse.json({ ...demoResponse, isDemo: true });
      }

      const data = await response.json();
      const text = data.content[0]?.text || '';

      // Parse JSON from response
      let jsonStr = text.trim();
      if (jsonStr.startsWith('```')) {
        jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
      }

      const creative = JSON.parse(jsonStr);
      return NextResponse.json({ ...creative, isDemo: false });

    } catch {
      // Any API error, fall back to demo
      const demoResponse = getDemoResponse(prompt);
      return NextResponse.json({ ...demoResponse, isDemo: true });
    }

  } catch {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
