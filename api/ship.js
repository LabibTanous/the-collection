module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { email, no, product, tracking_url, secret } = req.body || {};

  const SHIP_SECRET = process.env.SHIP_SECRET || '';
  if (SHIP_SECRET && secret !== SHIP_SECRET) {
    res.status(401).json({ error: 'Unauthorized' }); return;
  }
  if (!email) { res.status(400).json({ error: 'Missing email' }); return; }

  const RESEND_KEY = process.env.RESEND_API_KEY || '';
  const N8N_URL = process.env.N8N_WEBHOOK_URL || '';

  if (N8N_URL) {
    try {
      await fetch(`${N8N_URL}/ship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, no, product, tracking_url, timestamp: new Date().toISOString() })
      });
    } catch (_) {}
  }

  if (RESEND_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'the Collection <noreply@thecollection.ae>',
          to: email,
          subject: `No. ${no || ''} — shipped from Dubai`,
          html: `<p style="font-family:Georgia,serif;color:#1A2B40">Your piece is on its way.</p>
<p style="font-family:Georgia,serif;color:#1A2B40">
  <strong>${product || 'Your piece'}${no ? ` — No. ${no} of 99` : ''}</strong> has been dispatched.
  ${tracking_url ? `Track it: <a href="${tracking_url}">${tracking_url}</a>` : 'Tracking details will follow shortly.'}
</p>
<p style="font-family:Georgia,serif;color:#6B82A0;font-size:13px">the Collection &mdash; UAE numbered editions of 99</p>`
        })
      });
    } catch (_) {}
  }

  res.status(200).json({ ok: true });
};
