// Makes assets/og-image.png (the share card shown when the link is posted) from profile.js.
// Run: npm run og   (needs Chromium: npx playwright install chromium)
const path = require('path');
const { chromium } = require('@playwright/test');
const { site } = require(path.resolve(process.env.PORTFOLIO_PROFILE || './profile.js'));
const esc = (s) => String(s || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const html = `<body style="margin:0;width:1200px;height:630px;background:radial-gradient(circle at 20% 20%,#3a0d12,#141414 60%);color:#fff;font-family:Helvetica,Arial,sans-serif;display:flex;flex-direction:column;justify-content:center;padding:0 90px;box-sizing:border-box">
<div style="color:#e50914;font-weight:800;letter-spacing:6px;font-size:28px">PORTFOLIO</div>
<div style="font-size:92px;font-weight:800;margin:18px 0 8px">${esc(site.name)}</div>
<div style="font-size:40px;color:#ddd">${esc(site.role)}</div>
<div style="font-size:26px;color:#aaa;margin-top:28px;max-width:900px;line-height:1.4">${esc(site.tagline)}</div></body>`;
(async () => {
  const browser = await chromium.launch(process.env.PW_CHROME ? { executablePath: process.env.PW_CHROME } : {});
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html);
  await page.screenshot({ path: path.join('assets', 'og-image.png') });
  await browser.close();
  console.log('Wrote assets/og-image.png');
})();
