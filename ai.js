/* ════════════════════════════════════════════════════════
   /api/ai.js — Vercel Serverless Function
   Gemini AI proxy — keeps API key server-side only
   Deploy: push to GitHub → Vercel auto-deploys
   Add env var: GEMINI_API_KEY in Vercel dashboard
   ════════════════════════════════════════════════════════ */

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_KEY) return res.status(500).json({ error: 'GEMINI_API_KEY not set in Vercel environment variables.' });

  const { message, context, history = [], system = '', maxTokens = 600 } = req.body || {};
  if (!message) return res.status(400).json({ error: 'message is required' });

  // ── Build Gemini request ─────────────────────────────
  const systemPrompt = system ||
    `You are NT AI, an elite professional trading coach embedded in the NQTRT trading journal.
You have direct access to the trader's real performance data below.
Be specific — reference their actual numbers, patterns, and habits.
Keep responses concise (under 180 words), actionable, and professional.
Use bold (**text**) for key metrics and insights.

TRADER DATA:
${context || 'No trade data yet.'}`;

  // Convert chat history to Gemini format
  const contents = [];
  // Add history
  (history || []).slice(-10).forEach(m => {
    if (m.role === 'user' || m.role === 'assistant') {
      contents.push({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }]
      });
    }
  });
  // Ensure last message is the current one
  if (!contents.length || contents[contents.length-1].role !== 'user') {
    contents.push({ role: 'user', parts: [{ text: message }] });
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

  try {
    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
          topP: 0.9,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
      })
    });

    if (!geminiRes.ok) {
      const errData = await geminiRes.json().catch(() => ({}));
      const msg = errData?.error?.message || 'Gemini API error ' + geminiRes.status;
      return res.status(geminiRes.status).json({ error: msg });
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
      || data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('')
      || 'No response from Gemini.';

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('[/api/ai] Error:', err);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
}
