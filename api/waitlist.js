module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { email, product } = req.body || {};
  if (!email) { res.status(400).json({ error: 'Missing email' }); return; }

  const OWNER = process.env.OWNER_EMAIL || '';
  const RESEND_KEY = process.env.RESEND_API_KEY || '';
  const N8N_URL = process.env.N8N_WEBHOOK_URL || '';

  if (N8N_URL) {
    try {
      await fetch(`${N8N_URL}/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, product, timestamp: new Date().toISOString() })
      });
    } catch (_) {}
  }

  if (RESEND_KEY) {
    const send = (to, subject, html) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'the Collection <noreply@thecollection.ae>', to, subject, html })
      }).catch(() => {});

    await send(
      email,
      `You're on the waitlist — ${product || 'the Collection'}`,
      `<p style="font-family:Georgia,serif;color:#1A2B40">
  You're on the list${product ? ` for <strong>${product}</strong>` : ''}.
  If a number opens up, you will be first to know.
</p>
<p style="font-family:Georgia,serif;color:#6B82A0;font-size:13px">
  the Collection &mdash; UAE numbered editions of 99
</p>`
    );

    if (OWNER) {
      await send(
        OWNER,
        `[the Collection] Waitlist — ${product || 'unknown'} (${email})`,
        `<p>Waitlist signup:</p><ul><li>Email: ${email}</li><li>Product: ${product || 'unknown'}</li></ul>`
      );
    }
  }

  res.status(200).json({ ok: true });
};
