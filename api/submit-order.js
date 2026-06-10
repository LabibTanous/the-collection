const crypto = require('crypto');

function verifyToken(token) {
  const SECRET = process.env.CLAIM_SECRET || 'tc-secret-change-me';
  const [payload, sig] = (token || '').split('.');
  if (!payload || !sig) throw new Error('malformed');

  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  if (sig !== expected) throw new Error('invalid');

  const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  if (Date.now() > data.exp) throw new Error('expired');

  return data;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { token, fname, lname, phone, address, city, emirate, country } = req.body || {};

  if (!token || !fname || !lname || !phone || !address || !city) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  let claim;
  try {
    claim = verifyToken(token);
  } catch (e) {
    if (e.message === 'expired') return res.status(410).json({ error: 'Link expired. Please claim your edition again.' });
    return res.status(400).json({ error: 'Invalid or expired link.' });
  }

  const RESEND_KEY = process.env.RESEND_API_KEY || '';
  const OWNER = process.env.OWNER_EMAIL || '';

  const ownerHtml = `<table style="font-family:Georgia,serif;font-size:14px;color:#333;border-collapse:collapse;">
    <tr><td colspan="2" style="padding:0 0 16px;font-size:16px;font-weight:bold;">New order — No. ${claim.no} of 99</td></tr>
    <tr><td style="padding:6px 20px 6px 0;color:#666;">Product</td><td>${claim.product}</td></tr>
    <tr><td style="padding:6px 20px 6px 0;color:#666;">Edition</td><td>No. ${claim.no} of 99</td></tr>
    <tr><td style="padding:6px 20px 6px 0;color:#666;">Email</td><td>${claim.email}</td></tr>
    <tr><td style="padding:6px 20px 6px 0;color:#666;">Name</td><td>${fname} ${lname}</td></tr>
    <tr><td style="padding:6px 20px 6px 0;color:#666;">Phone</td><td>${phone}</td></tr>
    <tr><td style="padding:6px 20px 6px 0;color:#666;">Address</td><td>${address}</td></tr>
    <tr><td style="padding:6px 20px 6px 0;color:#666;">City</td><td>${city}</td></tr>
    <tr><td style="padding:6px 20px 6px 0;color:#666;">Emirate</td><td>${emirate || '—'}</td></tr>
    <tr><td style="padding:6px 20px 6px 0;color:#666;">Country</td><td>${country}</td></tr>
  </table>`;

  const confirmHtml = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#080604;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#080604" style="background:#080604;">
<tr><td align="center" style="padding:40px 16px;">
  <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
    <tr><td height="3" bgcolor="#C9A24B" style="background:linear-gradient(90deg,#6B4F12,#C9A24B,#E8C97A,#C9A24B,#6B4F12);font-size:0;">&nbsp;</td></tr>
    <tr><td bgcolor="#0D1B2E" style="background:#0D1B2E;border-left:1px solid #1C3050;border-right:1px solid #1C3050;padding:44px 48px;">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.3em;color:#C9A24B;text-transform:uppercase;font-family:'Courier New',monospace;">the Collection</p>
      <p style="margin:32px 0 12px;font-size:24px;color:#E2D5C4;letter-spacing:0.04em;">Order confirmed</p>
      <p style="margin:0;font-size:14px;color:#567090;line-height:1.85;">
        <strong style="color:#E2D5C4;font-weight:normal;">${claim.product} No. ${claim.no} of 99</strong> is yours.<br>
        We have your shipping details and will dispatch within 5 business days from Dubai.
      </p>
      <p style="margin:24px 0 0;font-size:13px;color:#567090;line-height:1.8;">
        We will reach out on <strong style="color:#E2D5C4;font-weight:normal;">${phone}</strong> to coordinate delivery.
      </p>
    </td></tr>
    <tr><td height="3" bgcolor="#C9A24B" style="background:linear-gradient(90deg,#6B4F12,#C9A24B,#E8C97A,#C9A24B,#6B4F12);font-size:0;">&nbsp;</td></tr>
    <tr><td align="center" bgcolor="#080604" style="padding:24px;background:#080604;">
      <p style="margin:0;font-size:9px;color:#1C3050;letter-spacing:0.1em;font-family:'Courier New',monospace;">Ships from Dubai &nbsp;&middot;&nbsp; 5 business days</p>
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;

  if (RESEND_KEY) {
    const send = (to, subject, html) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'the Collection <onboarding@resend.dev>', to, subject, html })
      }).catch(() => {});

    await Promise.all([
      send(claim.email, `Order confirmed — No. ${claim.no} of 99`, confirmHtml),
      OWNER ? send(OWNER, `[Order] No. ${claim.no} — ${claim.product} · ${fname} ${lname} · ${phone}`, ownerHtml) : Promise.resolve()
    ]);
  }

  res.status(200).json({ ok: true });
};
