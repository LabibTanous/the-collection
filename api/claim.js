const crypto = require('crypto');

function generateToken(data) {
  const SECRET = process.env.CLAIM_SECRET || 'tc-secret-change-me';
  const payload = Buffer.from(JSON.stringify({
    ...data,
    exp: Date.now() + 5 * 60 * 1000
  })).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

function buildEmail(no, product, checkoutUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="only light">
<meta name="supported-color-schemes" content="light">
<title>No. ${no} of 99 — Reserved</title>
</head>
<body bgcolor="#EDE8DF" style="margin:0;padding:0;background-color:#EDE8DF !important;font-family:Georgia,'Times New Roman',Times,serif;">
<style>
  :root, html, body { color-scheme: only light !important; }
  body { background-color: #EDE8DF !important; }
  [data-ogsc] body,
  [data-ogsc] .email-bg { background-color: #EDE8DF !important; color: #1A2B40 !important; }
  [data-ogsc] .navy-card { background-color: #122040 !important; }
  [data-ogsc] .cream-text { color: #EDE8DF !important; }
  [data-ogsc] .muted-text { color: #6B82A0 !important; }
  [data-ogsc] .dim-text { color: #8AA0BC !important; }
  [data-ogsc] .ink-text { color: #1A2B40 !important; }
  [data-ogsc] .cta-btn { background-color: #EDE8DF !important; color: #1A2B40 !important; }
  @media (prefers-color-scheme: dark) {
    body, .email-bg { background-color: #EDE8DF !important; color: #1A2B40 !important; }
    .navy-card { background-color: #122040 !important; }
    .cream-text { color: #EDE8DF !important; }
    .muted-text { color: #6B82A0 !important; }
    .dim-text { color: #8AA0BC !important; }
    .ink-text { color: #1A2B40 !important; }
    .cta-btn { background-color: #EDE8DF !important; color: #1A2B40 !important; }
  }
</style>

<table class="email-bg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EDE8DF" style="background-color:#EDE8DF !important;">
<tr><td align="center" style="padding:48px 16px 56px;background-color:#EDE8DF !important;">

  <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">

    <!-- Brand header on cream -->
    <tr>
      <td align="center" style="padding:0 0 32px;">
        <p style="margin:0;font-size:13px;letter-spacing:0.06em;color:#1A2B40;font-family:Georgia,'Times New Roman',serif;font-style:italic;">the Collection</p>
        <p style="margin:5px 0 0;font-size:9px;letter-spacing:0.25em;color:#6B82A0;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">UAE &nbsp;&middot;&nbsp; Limited editions of 99</p>
      </td>
    </tr>

    <!-- Navy card -->
    <tr>
      <td class="navy-card" bgcolor="#122040" style="background-color:#122040 !important;border-radius:22px;overflow:hidden;mso-border-radius:22px;">

        <!-- Card inner padding top -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td height="44" style="font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>

        <!-- Edition block: inner box -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:0 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #2D5282;border-radius:14px;">
                <tr>
                  <td align="center" style="padding:28px 32px 22px;">
                    <p class="muted-text" style="margin:0;font-size:9px;letter-spacing:0.3em;color:#6B82A0 !important;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">Edition</p>
                    <p class="cream-text" style="margin:10px 0 6px;font-size:72px;line-height:1;color:#EDE8DF !important;font-family:Georgia,'Times New Roman',serif;letter-spacing:-0.01em;font-style:italic;">No.&nbsp;${no}</p>
                    <p class="muted-text" style="margin:0 0 12px;font-size:10px;letter-spacing:0.22em;color:#6B82A0 !important;font-family:'Courier New',Courier,monospace;">of 99</p>
                    <table width="80%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 14px;">
                      <tr><td height="1" bgcolor="#2D5282" style="background-color:#2D5282;font-size:0;line-height:0;">&nbsp;</td></tr>
                    </table>
                    <p class="cream-text" style="margin:0;font-size:22px;color:#EDE8DF !important;font-family:Georgia,'Times New Roman',serif;font-style:italic;">${product}</p>
                    <p class="muted-text" style="margin:7px 0 0;font-size:9px;letter-spacing:0.22em;color:#6B82A0 !important;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">Reserved in your name</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Thin separator -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:0 40px 0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="#2D5282" style="background-color:#2D5282;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
        </table>

        <!-- Urgency text -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding:26px 48px 22px;">
              <p class="dim-text" style="margin:0;font-size:14px;line-height:1.85;color:#8AA0BC !important;font-family:Georgia,'Times New Roman',serif;">Your number is held for <strong class="cream-text" style="color:#EDE8DF !important;font-weight:normal;">5&nbsp;minutes</strong> only.<br>Complete your order before it is released.</p>
            </td>
          </tr>
        </table>

        <!-- CTA button -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding:0 40px 44px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:16px;overflow:hidden;mso-border-radius:16px;">
                <tr>
                  <td class="cta-btn" align="center" bgcolor="#EDE8DF" style="background-color:#EDE8DF !important;border-radius:16px;mso-border-radius:16px;">
                    <a href="${checkoutUrl}" target="_blank" style="display:block;padding:17px 32px;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#1A2B40 !important;text-decoration:none;font-weight:700;">Complete your order &rarr;</a>
                  </td>
                </tr>
              </table>
              <p style="margin:13px 0 0;font-size:9px;color:#4A6A90;letter-spacing:0.16em;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">One-time link &nbsp;&middot;&nbsp; Expires in 5 minutes</p>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Footer on cream -->
    <tr>
      <td align="center" style="padding:28px 16px 0;">
        <p style="margin:0;font-size:10px;color:#9BAABB;letter-spacing:0.12em;font-family:'Courier New',Courier,monospace;">Ships within 5 business days from Dubai</p>
        <p style="margin:8px 0 0;font-size:10px;color:#B0B8C4;font-family:Georgia,'Times New Roman',serif;">If you did not request this, you may ignore this email.</p>
      </td>
    </tr>

  </table>

</td></tr>
</table>

</body>
</html>`;
}

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

  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'the-collection.vercel.app';
  const siteUrl = process.env.SITE_URL || `${proto}://${host}`;
  const token = generateToken({ email, no, product, key });
  const checkoutUrl = `${siteUrl}/checkout.html?t=${token}`;

  if (N8N_URL) {
    try {
      await fetch(`${N8N_URL}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, no, email, product, timestamp: new Date().toISOString() })
      });
    } catch (_) {}
  }

  if (!RESEND_KEY) console.error('[claim] RESEND_API_KEY not set');

  if (RESEND_KEY) {
    const send = async (to, subject, html) => {
      try {
        const r = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: 'the Collection <onboarding@resend.dev>', to, subject, html })
        });
        const b = await r.json().catch(() => ({}));
        if (!r.ok) console.error('[claim] Resend error', r.status, JSON.stringify(b));
        else console.log('[claim] sent to', to, 'id', b.id);
      } catch (e) { console.error('[claim] fetch failed', e.message); }
    };

    await send(
      email,
      `No. ${no} of 99 — your edition is reserved`,
      buildEmail(no, product || key, checkoutUrl)
    );

  }

  res.status(200).json({ ok: true });
};
