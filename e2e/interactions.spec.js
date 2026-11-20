const { test, expect } = require('./fixtures');
const { enterSite } = require('./helpers');

test('project card opens a modal with details and closes again', async ({ page }) => {
  await enterSite(page);
  await page.locator('#t-projects > *').first().click();
  await expect(page.locator('#modal')).toBeVisible();
  await expect(page.locator('#m-title')).not.toBeEmpty();
  await page.locator('#m-x').click();
  await expect(page.locator('#modal')).toBeHidden();
});

test('every project modal shows the links from the profile', async ({ page }) => {
  await enterSite(page);
  const list = await page.evaluate(() => projects.map((p) => ({ t: p.t, urls: [p.live, p.src, p.blog].concat((p.extra || []).map((x) => x.u)).filter(Boolean) })));
  for (let i = 0; i < list.length; i++) {
    await page.locator('#t-projects > *').nth(i).click();
    const links = await page.locator('#m-links a').evaluateAll((a) => a.map((x) => x.href));
    for (const u of list[i].urls) expect(links.some((l) => l === u || l === u + '/'), `${list[i].t}: missing link ${u}`).toBeTruthy();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal')).toBeHidden();
  }
});

test('every project opens without errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await enterSite(page);
  const n = await page.locator('#t-projects > *').count();
  for (let i = 0; i < n; i++) {
    await page.locator('#t-projects > *').nth(i).click();
    await expect(page.locator('#modal')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal')).toBeHidden();
  }
  expect(errors).toEqual([]);
});

test('GitHub section links to every repo in the profile', async ({ page }) => {
  await enterSite(page);
  const urls = await page.evaluate(() => repos.map((r) => r.u));
  for (const u of urls) await expect(page.locator('#t-repos a[href="' + u + '"]')).toBeAttached();
});

test('flip cards: tapping shows the back face and hides the front (mobile mirrored-text regression)', async ({ page }) => {
  await enterSite(page);
  test.skip((await page.locator('.bey').count()) === 0, 'this profile has no "Beyond code" cards');
  const card = page.locator('.bey').first();
  await card.scrollIntoViewIfNeeded();
  const vis = (sel) => card.locator(sel).evaluate((el) => getComputedStyle(el).visibility);
  expect(await vis('.bf.front')).toBe('visible');
  expect(await vis('.bf.back')).toBe('hidden');
  await card.click();
  await expect(card).toHaveClass(/flip/);
  await expect.poll(() => vis('.bf.back')).toBe('visible');
  await expect.poll(() => vis('.bf.front')).toBe('hidden');
  await card.click();
  await expect.poll(() => vis('.bf.front')).toBe('visible');
  await expect.poll(() => vis('.bf.back')).toBe('hidden');
});

test('education timeline expands a stop', async ({ page }) => {
  await enterSite(page);
  test.skip((await page.locator('#edu').count()) === 0, 'this profile has no education');
  await page.locator('#edu').scrollIntoViewIfNeeded();
  await expect(page.locator('#edu .stop').first()).toBeVisible();
});
