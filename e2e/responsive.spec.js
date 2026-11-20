const { test, expect } = require('./fixtures');
const { enterSite } = require('./helpers');

test('no sideways scrolling on this screen size', async ({ page }) => {
  await enterSite(page);
  await page.waitForTimeout(500);
  const { sw, cw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }));
  expect(sw, `page is ${sw}px wide in a ${cw}px window`).toBeLessThanOrEqual(cw + 1);
});

test('hero heading and navigation are visible without scrolling', async ({ page }) => {
  await enterSite(page);
  const first = await page.evaluate(() => site.firstName);
  await expect(page.locator('h1', { hasText: first })).toBeInViewport();
});

test('rows of cards can be scrolled sideways and the first card is reachable', async ({ page }) => {
  await enterSite(page);
  const first = page.locator('#t-projects > *').first();
  await first.scrollIntoViewIfNeeded();
  await expect(first).toBeVisible();
});

test('text is not clipped inside project cards', async ({ page }) => {
  await enterSite(page);
  const clipped = await page.evaluate(() =>
    [...document.querySelectorAll('#t-projects .label b')].filter((b) => b.scrollWidth > b.clientWidth + 2).map((b) => b.textContent));
  expect(clipped).toEqual([]);
});
