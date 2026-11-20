const { test, expect } = require('./fixtures');
const { skipIntro } = require('./helpers');

// Analytics is optional. These tests only run when the profile sets site.analytics.goatcounter,
// because only then does the build include analytics.js.
const fs = require('fs');
const analyticsOn = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8').includes('src="analytics.js"');
test.skip(!analyticsOn, 'analytics is not enabled in this profile');

// Replace GoatCounter with a recorder so we can see exactly what a visitor's actions send.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__gc = [];
    window.goatcounter = { count: (o) => window.__gc.push(o) };
  });
});

const sent = (page) => page.evaluate(() => window.__gc.map((o) => o.path));

test('visitor actions are recorded as analytics events', async ({ page }) => {
  await page.goto('/');
  await skipIntro(page);
  await page.locator('.profile[data-id="engineer"]').click();
  await expect.poll(() => sent(page)).toContain('event/profile/engineer');

  await page.locator('#t-projects > *').first().click();
  await expect.poll(async () => (await sent(page)).some((p) => p.startsWith('event/project/'))).toBeTruthy();
  await page.keyboard.press('Escape');

  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect.poll(() => sent(page)).toContain('event/scroll/100pct');
});

test('every event uses the GoatCounter event format', async ({ page }) => {
  await page.goto('/');
  await skipIntro(page);
  await page.locator('.profile[data-id="guest"]').click();
  const all = await page.evaluate(() => window.__gc);
  expect(all.length).toBeGreaterThan(0);
  for (const o of all) {
    expect(o.event).toBe(true);
    expect(o.path).toMatch(/^event\/[a-z0-9/_.\-]+$/);
  }
});

test('normal use triggers no JavaScript-error events', async ({ page }) => {
  await page.goto('/');
  await skipIntro(page);
  await page.locator('.profile[data-id="engineer"]').click();
  await page.locator('#t-projects > *').first().click();
  await page.keyboard.press('Escape');
  await page.waitForTimeout(500);
  const errors = (await sent(page)).filter((p) => p.startsWith('event/js-error'));
  expect(errors).toEqual([]);
});
