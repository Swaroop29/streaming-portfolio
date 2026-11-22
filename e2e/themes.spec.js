// Generic checks that every design (theme) must pass on every device, whatever it looks like.
// The Netflix theme also has its own detailed specs; any new theme is covered here automatically.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { test, expect } = require('@playwright/test');

const root = path.join(__dirname, '..');
const themesDir = path.join(root, 'themes');
const themes = fs.readdirSync(themesDir).filter((n) => n !== 'netflix' && fs.existsSync(path.join(themesDir, n, 'theme.js')));
const previewDir = '.theme-preview';
const profileFile = 'profile.js';
const { site } = require(path.join(root, profileFile));

test.beforeAll(() => {
  for (const id of themes) {
    execFileSync('node', ['build.js'], { cwd: root, stdio: 'pipe', env: { ...process.env, PORTFOLIO_THEME: id, PORTFOLIO_PROFILE: profileFile, PORTFOLIO_OUT: path.join(previewDir, id) } });
  }
});

for (const id of themes) {
  test.describe(`theme "${id}"`, () => {
    const url = `/${previewDir}/${id}/index.html`;

    test('loads with no errors and shows the person', async ({ page }) => {
      const errors = [];
      page.on('pageerror', (e) => errors.push(e.message));
      page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
      await page.goto(url);
      await expect(page.locator('h1').first()).toContainText(site.name);
      await expect(page.locator('html')).toHaveAttribute('lang', /.+/);
      expect(await page.title()).toContain(site.name);
      expect(errors).toEqual([]);
    });

    test('never scrolls sideways on this device', async ({ page }) => {
      await page.goto(url);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(1);
    });

    test('every in-page link goes somewhere and every real link has an address', async ({ page }) => {
      await page.goto(url);
      const bad = await page.evaluate(() => {
        const out = [];
        for (const a of document.querySelectorAll('a[href]')) {
          const h = a.getAttribute('href');
          if (!h || h === '#') out.push('empty link: ' + a.textContent.trim().slice(0, 30));
          else if (h.startsWith('#') && !document.getElementById(h.slice(1))) out.push('missing target ' + h);
        }
        return out;
      });
      expect(bad).toEqual([]);
    });

    test('text is readable: dark enough contrast against its own background', async ({ page }) => {
      await page.goto(url);
      const low = await page.evaluate(() => {
        const rgb = (c) => (c.match(/[\d.]+/g) || [0, 0, 0, 0]).map(Number);
        const lum = ([r, g, b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
        const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const c = rgb(getComputedStyle(e).backgroundColor); if (c.length < 4 || c[3] > 0.5) return c; } return [255, 255, 255]; };
        const out = [];
        for (const el of document.querySelectorAll('main p, main li, main h1, main h2, main h3, header p, header h1')) {
          if (!el.textContent.trim() || el.closest('details:not([open])')) continue;
          const l1 = lum(rgb(getComputedStyle(el).color)), l2 = lum(bgOf(el));
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          if (ratio < 4.5) out.push(el.textContent.trim().slice(0, 30) + ' (' + ratio.toFixed(1) + ')');
        }
        return out.slice(0, 5);
      });
      expect(low, 'text with weak contrast').toEqual([]);
    });

    test('prints as dark text on white', async ({ page }) => {
      await page.goto(url);
      await page.emulateMedia({ media: 'print' });
      const r = await page.evaluate(() => {
        const rgb = (c) => (c.match(/\d+/g) || [0, 0, 0]).map(Number);
        const lum = ([r, g, b]) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
        const light = [...document.querySelectorAll('main p, main li, main h1, main h2, main h3')].filter((e) => e.offsetParent && lum(rgb(getComputedStyle(e).color)) > 0.5).length;
        return { bg: getComputedStyle(document.body).backgroundColor, light };
      });
      expect(r.bg).toBe('rgb(255, 255, 255)');
      expect(r.light).toBe(0);
    });

    test('the plain-text version for search engines is present', async ({ page }) => {
      await page.goto(url);
      await expect(page.locator('#text-version')).toHaveCount(1);
      await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
    });
  });
}
