// api/ai.js  ← place at ROOT of your project (not inside /src or /app)
// Vercel Pages Router serverless function — CommonJS, no bundler needed
// Add GEMINI_API_KEY in Vercel Dashboard → Settings → Environment Variables

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const KEY = process.env.GEMINI_API_KEY;
  if (!KEY) return res.status(500).json({
    error: 'GEMINI_API_KEY missing. Add it in Vercel → Settings → Environment Variables.'
  });

  // Coerce context to string; guard history type
  const { message = '', context = '', history = [] } = req.body || {};
  const contextStr = typeof context === 'string'
    ? context
    : JSON.stringify(context) || 'No trade data yet.';

  if (!String(message).trim()) return res.status(400).json({ error: 'message is required' });

  const system = `You are NT AI, an elite trading coach inside the NQTRT journal.
You have the trader's real data below. Reference their actual numbers. Max 180 words.
TRADER DATA:
${contextStr}`;

  // Build history correctly, then always append the new message separately
  const contents = [];

  for (const m of (Array.isArray(history) ? history.slice(-10) : [])) {
    if (!m?.role || !m?.content) continue;
    // Normalize both 'assistant' and 'model' → 'model' for Gemini
    const role = (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user';
    contents.push({ role, parts: [{ text: String(m.content) }] });
  }

  // Always push the new user message — never rely on history to carry it.
  // If the last turn is already 'user', merge to avoid consecutive user turns
  // (Gemini rejects those).
  if (contents.length && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts[0].text += '\n' + String(message);
  } else {
    contents.push({ role: 'user', parts: [{ text: String(message) }] });
  }

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents,
          generationConfig: { maxOutputTokens: 600, temperature: 0.7, topP: 0.9 }
        })
      }
    );

    const data = await r.json();

    if (!r.ok) return res.status(r.status).json({
      error: data?.error?.message || 'Gemini API error'
    });

    // Guard against missing candidates
    const candidate = data?.candidates?.[0];
    if (!candidate) return res.status(502).json({ error: 'Gemini returned no candidates.' });

    const reply = candidate.content?.parts?.map(p => p.text ?? '').join('') || 'No response.';
    return res.status(200).json({ reply });

  } catch (e) {
    return res.status(500).json({ error: e.message || 'Internal server error' });
  }
};
