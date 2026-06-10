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
<title>No. ${no} of 99 — Reserved</title>
</head>
<body style="margin:0;padding:0;background-color:#080604;font-family:Georgia,'Times New Roman',Times,serif;">

<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#080604" style="background-color:#080604;">
<tr><td align="center" style="padding:40px 16px 48px;">

  <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

    <!-- Gold top bar -->
    <tr><td height="3" bgcolor="#C9A24B" style="background:linear-gradient(90deg,#6B4F12 0%,#C9A24B 35%,#E8C97A 50%,#C9A24B 65%,#6B4F12 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

    <!-- Main card -->
    <tr>
      <td bgcolor="#0D1B2E" style="background-color:#0D1B2E;border-left:1px solid #1C3050;border-right:1px solid #1C3050;">

        <!-- Brand -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding:44px 48px 36px;">
              <p style="margin:0;font-size:10px;letter-spacing:0.35em;color:#C9A24B;text-transform:uppercase;font-family:Georgia,serif;">the Collection</p>
              <p style="margin:7px 0 0;font-size:9px;letter-spacing:0.2em;color:#223650;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">UAE &nbsp;&middot;&nbsp; LIMITED EDITIONS OF 99</p>
            </td>
          </tr>
        </table>

        <!-- Rule -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:0 48px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="#1C3050" style="background-color:#1C3050;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
        </table>

        <!-- Edition box -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding:44px 48px 36px;">
              <table cellpadding="0" cellspacing="0" border="0" style="border:1px solid #1C3050;">
                <tr>
                  <td align="center" bgcolor="#080F1A" style="background-color:#080F1A;padding:32px 64px;">
                    <p style="margin:0;font-size:9px;letter-spacing:0.3em;color:#223650;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">EDITION</p>
                    <p style="margin:12px 0 4px;font-size:72px;line-height:1;color:#C9A24B;font-family:Georgia,serif;letter-spacing:-0.01em;">No.&nbsp;${no}</p>
                    <p style="margin:0;font-size:10px;letter-spacing:0.2em;color:#223650;font-family:'Courier New',Courier,monospace;">of 99</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Product name -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding:0 48px 36px;">
              <p style="margin:0;font-size:22px;color:#E2D5C4;letter-spacing:0.04em;font-family:Georgia,serif;">${product}</p>
              <p style="margin:9px 0 0;font-size:10px;color:#223650;letter-spacing:0.18em;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">Reserved in your name</p>
            </td>
          </tr>
        </table>

        <!-- Rule -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:0 48px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="#1C3050" style="background-color:#1C3050;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
        </table>

        <!-- Urgency -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding:32px 48px 28px;">
              <p style="margin:0;font-size:14px;line-height:1.85;color:#567090;font-family:Georgia,serif;">Your number is held for <strong style="color:#E2D5C4;font-weight:normal;">5&nbsp;minutes</strong> only.<br>Complete your order before your edition is released.</p>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding:0 48px 52px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="#C9A24B" style="background-color:#C9A24B;">
                    <a href="${checkoutUrl}" target="_blank" style="display:inline-block;padding:17px 60px;font-family:'Courier New',Courier,monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#080604;text-decoration:none;font-weight:700;">Complete your order &rarr;</a>
                  </td>
                </tr>
              </table>
              <p style="margin:15px 0 0;font-size:9px;color:#1C3050;letter-spacing:0.12em;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">One-time link &nbsp;&middot;&nbsp; Expires in 5 minutes</p>
            </td>
          </tr>
        </table>

      </td>
    </tr>

    <!-- Gold bottom bar -->
    <tr><td height="3" bgcolor="#C9A24B" style="background:linear-gradient(90deg,#6B4F12 0%,#C9A24B 35%,#E8C97A 50%,#C9A24B 65%,#6B4F12 100%);font-size:0;line-height:0;">&nbsp;</td></tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="padding:28px 48px 0;background-color:#080604;" bgcolor="#080604">
        <p style="margin:0;font-size:10px;color:#1C3050;letter-spacing:0.1em;font-family:'Courier New',Courier,monospace;">Ships within 5 business days from Dubai</p>
        <p style="margin:8px 0 0;font-size:9px;color:#0F1D2E;font-family:Georgia,serif;">If you did not request this reservation, you may ignore this email.</p>
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

  if (RESEND_KEY) {
    const send = (to, subject, html) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: 'the Collection <onboarding@resend.dev>', to, subject, html })
      }).catch(() => {});

    await send(
      email,
      `No. ${no} of 99 — your edition is reserved`,
      buildEmail(no, product || key, checkoutUrl)
    );

    if (OWNER) {
      await send(
        OWNER,
        `[Claim] No. ${no} — ${product || key} (${email})`,
        `<table style="font-family:Georgia,serif;font-size:14px;color:#333;padding:24px;border-collapse:collapse;">
          <tr><td colspan="2" style="padding-bottom:16px;font-size:16px;font-weight:bold;">New claim received</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#666;">Product:</td><td>${product || key}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#666;">Edition:</td><td>No. ${no} of 99</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#666;">Email:</td><td>${email}</td></tr>
          <tr><td style="padding:4px 16px 4px 0;color:#666;">Checkout:</td><td><a href="${checkoutUrl}">link (5 min expiry)</a></td></tr>
        </table>`
      );
    }
  }

  res.status(200).json({ ok: true });
};
