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
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Order confirmed — No. ${claim.no} of 99</title>
</head>
<body bgcolor="#EDE8DF" style="margin:0;padding:0;background-color:#EDE8DF;font-family:Georgia,'Times New Roman',Times,serif;">
<style>
body,.ebg{background-color:#EDE8DF !important}
.nc{background-color:#122040 !important}
.ib{background-color:#0A1930 !important}
.ct{color:#EDE8DF !important}
.mt{color:#6B82A0 !important}
.dt{color:#4A6A90 !important}
.it{color:#1A2B40 !important}
[data-ogsc] body,[data-ogsc] .ebg{background-color:#EDE8DF !important}
[data-ogsc] .nc{background-color:#122040 !important}
[data-ogsc] .ib{background-color:#0A1930 !important}
[data-ogsc] .ct{color:#EDE8DF !important}
[data-ogsc] .mt{color:#6B82A0 !important}
[data-ogsc] .dt{color:#4A6A90 !important}
[data-ogsc] .it{color:#1A2B40 !important}
[data-ogsb] .ebg{background-color:#EDE8DF !important}
[data-ogsb] .nc{background-color:#122040 !important}
[data-ogsb] .ib{background-color:#0A1930 !important}
[data-ogsb] .ct{color:#EDE8DF !important}
</style>
<table class="ebg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#EDE8DF" style="background-color:#EDE8DF;">
<tr><td align="center" style="padding:48px 16px 56px;">
  <table width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;">
    <tr>
      <td align="center" style="padding:0 0 32px;">
        <p class="it" style="margin:0;font-size:13px;letter-spacing:0.06em;color:#1A2B40;font-family:Georgia,'Times New Roman',serif;font-style:italic;">the Collection</p>
        <p class="mt" style="margin:5px 0 0;font-size:9px;letter-spacing:0.25em;color:#6B82A0;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">UAE &nbsp;&middot;&nbsp; Limited editions of 99</p>
      </td>
    </tr>
    <tr>
      <td class="nc" bgcolor="#122040" style="background-color:#122040;border-radius:22px;overflow:hidden;mso-border-radius:22px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td height="44" style="font-size:0;line-height:0;">&nbsp;</td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td style="padding:0 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #2D5282;border-radius:14px;">
                <tr>
                  <td class="ib" align="center" style="padding:28px 32px 22px;background-color:#0A1930;border-radius:14px;">
                    <p class="mt" style="margin:0;font-size:9px;letter-spacing:0.3em;color:#6B82A0;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">Edition</p>
                    <p class="ct" style="margin:10px 0 6px;font-size:72px;line-height:1;color:#EDE8DF;font-family:Georgia,'Times New Roman',serif;letter-spacing:-0.01em;font-style:italic;">No.&nbsp;${claim.no}</p>
                    <p class="mt" style="margin:0 0 12px;font-size:10px;letter-spacing:0.22em;color:#6B82A0;font-family:'Courier New',Courier,monospace;">of 99</p>
                    <table width="80%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 14px;">
                      <tr><td height="1" bgcolor="#2D5282" style="background-color:#2D5282;font-size:0;line-height:0;">&nbsp;</td></tr>
                    </table>
                    <p class="ct" style="margin:0;font-size:22px;color:#EDE8DF;font-family:Georgia,'Times New Roman',serif;font-style:italic;">${claim.product}</p>
                    <p class="mt" style="margin:7px 0 0;font-size:9px;letter-spacing:0.22em;color:#6B82A0;text-transform:uppercase;font-family:'Courier New',Courier,monospace;">Order confirmed</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:0 40px;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="#1E3A5F" style="background-color:#1E3A5F;font-size:0;line-height:0;">&nbsp;</td></tr></table></td></tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="padding:26px 48px 44px;">
              <p class="mt" style="margin:0;font-size:14px;line-height:1.85;color:#8AA0BC;font-family:Georgia,'Times New Roman',serif;">
                <strong class="ct" style="color:#EDE8DF;font-weight:normal;">${claim.product} No. ${claim.no} of 99</strong> is yours.<br>
                We will reach out on <strong class="ct" style="color:#EDE8DF;font-weight:normal;">${phone}</strong> to coordinate delivery.<br>
                Ships within 5 business days from Dubai.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:28px 16px 0;">
        <p class="dt" style="margin:0;font-size:10px;color:#4A6A90;letter-spacing:0.12em;font-family:'Courier New',Courier,monospace;">Ships within 5 business days from Dubai</p>
      </td>
    </tr>
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
