module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { key, no, email, product } = req.body || {};
  if (!email || !key) { res.status(400).json({ error: 'Missing required fields' }); return; }

  const OWNER = process.env.OWNER_EMAIL || '';
  const RESEND_KEY = process.env.RESEND_API_KEY || '';
  const N8N_URL = process.env.N8N_WEBHOOK_URL || '';

  // Forward to n8n if configured
  if (N8N_URL) {
    try {
      await fetch(`${N8N_URL}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, no, email, product, timestamp: new Date().toISOString() })
      });
    } catch (_) {}
  }

  // Send emails via Resend if configured
  if (RESEND_KEY) {
    const send = (to, subject, html) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'the Collection <noreply@thecollection.ae>', to, subject, html })
      }).catch(() => {});

    await send(
      email,
      `No. ${no} of 99 — reserved in your name`,
      `<p style="font-family:Georgia,serif;color:#1A2B40">Your edition is held.</p>
<p style="font-family:Georgia,serif;color:#1A2B40">
  <strong>${product || 'Your piece'} — No. ${no} of 99</strong> is reserved in your name.
  We will be in touch shortly with payment and delivery details.
</p>
<p style="font-family:Georgia,serif;color:#6B82A0;font-size:13px">
  the Collection &mdash; UAE numbered editions of 99
</p>`
    );

    if (OWNER) {
      await send(
        OWNER,
        `[the Collection] Claim — No. ${no} ${product || key} (${email})`,
        `<p>New claim received:</p>
<ul>
  <li>Product: ${product || key}</li>
  <li>Edition No: ${no}</li>
  <li>Email: ${email}</li>
  <li>Key: ${key}</li>
</ul>`
      );
    }
  }

  res.status(200).json({ ok: true });
};
