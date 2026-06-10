module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { message, system } = req.body || {};
  if (!message) { res.status(400).json({ error: 'Missing message' }); return; }

  const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
  const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b';

  try {
    const ollamaRes = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        system: system || 'You are a helpful assistant for a UAE luxury brand.',
        prompt: message,
        stream: false,
        options: { temperature: 0.7, num_predict: 200 }
      }),
      signal: AbortSignal.timeout(15000)
    });

    if (!ollamaRes.ok) throw new Error(`Ollama ${ollamaRes.status}`);
    const data = await ollamaRes.json();
    res.status(200).json({ response: data.response || '' });
  } catch (_) {
    res.status(200).json({
      response: 'I\'m not available right now — please check the materials & details drawer below for full product information.',
      offline: true
    });
  }
};
