// api/ai.js  ← place at ROOT of your project (not inside /src or /app)
// Vercel Pages Router serverless function — CommonJS, no bundler needed
// Add GEMINI_API_KEY in Vercel Dashboard → Settings → Environment Variables

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  const KEY = process.env.GEMINI_API_KEY; console.log("Gemini Key:", key);` 
  if (!KEY) return res.status(500).json({
    error: 'GEMINI_API_KEY missing. Add it in Vercel → Settings → Environment Variables.'
  });

  const { message = '', context = '', history = [] } = req.body || {};

  // Safely coerce context to string regardless of what the client sends
  const contextStr =
    typeof context === 'string'
      ? context || 'No trade data yet.'
      : (JSON.stringify(context) ?? 'No trade data yet.');

  const messageStr = String(message).trim();
  if (!messageStr) return res.status(400).json({ error: 'message is required' });

  const system = `You are NT AI, an elite trading coach inside the NQTRT journal.
You have the trader's real data below. Reference their actual numbers. Max 180 words.
TRADER DATA:
${contextStr}`;

  // Build Gemini contents array from history
  const contents = [];

  for (const m of (Array.isArray(history) ? history.slice(-10) : [])) {
    if (!m?.role || !m?.content) continue;

    // Normalize 'assistant' → 'model' for Gemini; everything else → 'user'
    const role = (m.role === 'assistant' || m.role === 'model') ? 'model' : 'user';

    // Handle content that may be an OpenAI-style array or a plain string
    const text = Array.isArray(m.content)
      ? m.content.map(c => (typeof c === 'string' ? c : c?.text ?? '')).join('\n')
      : String(m.content);

    if (!text.trim()) continue; // skip empty turns
    contents.push({ role, parts: [{ text }] });
  }

  // Always append the new user message as a fresh part.
  // Gemini rejects two consecutive 'user' turns — merge into parts[] instead.
  if (contents.length && contents[contents.length - 1].role === 'user') {
    contents[contents.length - 1].parts.push({ text: messageStr });
  } else {
    contents.push({ role: 'user', parts: [{ text: messageStr }] });
  }

  // Abort fetch after 25 s — Vercel functions time out at 30 s by default
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          system_instruction: { parts: [{ text: system }] },
          contents,
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.7,
            topP: 0.9
          }
        })
      }
    );

    clearTimeout(timeout);
    const data = await r.json();

    if (!r.ok) {
      // Cap forwarded status to a safe range (100–599); Gemini can return
      // non-standard codes that would crash Vercel's res.status()
      const safeStatus = (r.status >= 100 && r.status <= 599) ? r.status : 502;
      return res.status(safeStatus).json({
        error: data?.error?.message || `Gemini API error (HTTP ${r.status})`
      });
    }

    const candidate = data?.candidates?.[0];

    // candidate.content can be undefined when Gemini safety-filters the response
    if (!candidate || !candidate.content) {
      const reason = candidate?.finishReason || 'UNKNOWN';
      return res.status(502).json({
        error: `Gemini returned no content. Finish reason: ${reason}`
      });
    }

    // Use ?. on .parts — candidate.content is confirmed above but parts could
    // theoretically be missing on a malformed response
    const reply = candidate.content.parts
      ?.map(p => p.text ?? '')
      .join('')
      .trim() || 'No response.';

    return res.status(200).json({ reply });

  } catch (e) {
    clearTimeout(timeout);
    if (e.name === 'AbortError') {
      return res.status(504).json({ error: 'Gemini request timed out after 25 s.' });
    }
    return res.status(500).json({ error: e.message || 'Internal server error' });
  }
};
