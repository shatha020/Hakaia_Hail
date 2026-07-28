/**
 * Vercel Serverless — Gemini chat proxy
 * Set GEMINI_API_KEY in Vercel → Settings → Environment Variables
 */

const GEMINI_MODELS = [
  'gemini-2.5-flash-lite',
  'gemini-flash-lite-latest',
  'gemini-2.5-flash',
  'gemini-flash-latest',
];

function extractText(data) {
  const parts = data?.candidates?.[0]?.content?.parts || [];
  const chunks = parts.filter(p => p.text && !p.thought).map(p => p.text);
  const all = chunks.length ? chunks : parts.map(p => p.text).filter(Boolean);
  return all.join('').trim() || null;
}

async function callGemini(systemInstruction, question, apiKey) {
  const payload = {
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: [{ role: 'user', parts: [{ text: question }] }],
    generationConfig: { temperature: 0.75, maxOutputTokens: 1024 },
  };

  let lastError = null;
  for (const model of GEMINI_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      const text = extractText(data);
      if (text) return text;
      continue;
    }

    const errBody = await res.text();
    lastError = new Error(`Gemini HTTP ${res.status}: ${errBody.slice(0, 300)}`);
    if ([429, 404, 503].includes(res.status)) continue;
    throw lastError;
  }

  throw lastError || new Error('Empty Gemini response');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not configured on server' });
  }

  try {
    const { question, systemInstruction } = req.body || {};
    if (!question?.trim()) return res.status(400).json({ error: 'question required' });
    if (!systemInstruction?.trim()) return res.status(400).json({ error: 'systemInstruction required' });

    const reply = await callGemini(systemInstruction.trim(), question.trim(), apiKey);
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('[api/chat]', err.message);
    return res.status(502).json({ error: err.message || 'Chat failed' });
  }
}
