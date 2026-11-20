const { test, expect } = require('./fixtures');
const { enterSite } = require('./helpers');

test.describe('print view', () => {
  test.beforeEach(async ({ page }) => {
    await enterSite(page);
    await page.emulateMedia({ media: 'print' });
  });

  test('screen-only things are hidden and the text is dark on white', async ({ page }) => {
    for (const sel of ['#picker', 'header.top', '.arrow', '#beyond', '#contact']) {
      await expect(page.locator(sel).first()).toBeHidden();
    }
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(255, 255, 255)');
    const light = await page.evaluate(() => {
      const lum = (c) => { const m = c.match(/\d+/g).map(Number); return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255; };
      return [...document.querySelectorAll('#t-projects .card .label b, #t-projects .card .hov p, .ep h4, .ep p, .repo b, .about p')]
        .filter((el) => lum(getComputedStyle(el).color) > 0.5).map((el) => el.textContent.slice(0, 30));
    });
    expect(light, 'text that would print too light').toEqual([]);
  });

  test('no dark cards or huge tiles are left', async ({ page }) => {
    const bad = await page.evaluate(() => {
      const dark = (c) => { const m = c.match(/\d+/g).map(Number); return m.length < 4 || m[3] > 0 ? (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255 < 0.3 : false; };
      return [...document.querySelectorAll('#t-projects .card, .repo, .top10 .tile, .ep, .about, .recap, .episodes')]
        .filter((el) => dark(getComputedStyle(el).backgroundColor)).map((el) => el.className);
    });
    expect(bad).toEqual([]);
    const tallest = await page.evaluate(() => Math.max(...[...document.querySelectorAll('.top10 .tile')].map((t) => t.getBoundingClientRect().height)));
    expect(tallest, 'skill tags should be small chips, not tall tiles').toBeLessThan(40);
  });

  test('prints on at most 3 A4 pages with the key sections present', async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'PDF export is only available in Chromium');
    const pdf = await page.pdf({ format: 'A4', printBackground: false });
    const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page\b(?!s)/g) || []).length;
    expect(pages).toBeGreaterThan(0);
    expect(pages, `prints on ${pages} pages`).toBeLessThanOrEqual(3);
    for (const sel of ['#episodes', '#projects', '#skills', '#github', '#about']) if (await page.locator(sel).count()) await expect(page.locator(sel)).toBeVisible();
  });
});
