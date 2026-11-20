const { test, expect } = require('./fixtures');
const { watchProblems, enterSite, skipIntro } = require('./helpers');

test('page loads with no script errors, console errors or missing files', async ({ page }) => {
  const problems = watchProblems(page);
  await enterSite(page);
  await page.waitForLoadState('networkidle');
  expect(problems).toEqual([]);
});

test('picker shows the four profiles and choosing one enters the site', async ({ page }) => {
  await page.goto('/');
  await skipIntro(page);
  await expect(page.locator('.profile')).toHaveCount(4);
  await page.locator('.profile[data-id="recruiter"]').click();
  await expect(page.locator('#picker')).toHaveClass(/gone/);
});

test('"Just Browsing" works and there is no separate guest button', async ({ page }) => {
  await page.goto('/');
  await skipIntro(page);
  await expect(page.locator('#skip')).toHaveCount(0);
  await page.locator('.profile[data-id="guest"]').click();
  await expect(page.locator('#picker')).toHaveClass(/gone/);
});

test('every section renders its content', async ({ page }) => {
  await enterSite(page);
  const n = await page.evaluate(() => projects.length);
  await expect(page.locator('#t-projects > *')).toHaveCount(n);
  const c = await page.evaluate(() => ({ repos: repos.length, skills: skills.length, edu: education.length, beyond: beyond.length }));
  await expect(page.locator('#t-repos > *')).toHaveCount(c.repos);
  await expect(page.locator('#t-skills > *')).toHaveCount(c.skills);
  await expect(page.locator('#edu')).toHaveCount(c.edu ? 1 : 0);
  await expect(page.locator('.bey')).toHaveCount(c.beyond);
});

test('the status line and its animated dot are present', async ({ page }) => {
  await enterSite(page);
  const status = await page.evaluate(() => site.status);
  test.skip(!status, 'this profile has no status line');
  const now = page.locator('.recap .now');
  await expect(now).toContainText(status);
  const anim = await now.locator('i').evaluate((el) => getComputedStyle(el).animationName);
  expect(anim).not.toBe('none');
});

test('every image on the page actually loaded', async ({ page }) => {
  await enterSite(page);
  await page.waitForLoadState('networkidle');
  const broken = await page.evaluate(() =>
    [...document.images].filter((i) => i.getAttribute('src') && i.complete && i.naturalWidth === 0).map((i) => i.src));
  expect(broken).toEqual([]);
});

test('contact links are correct', async ({ page }) => {
  await enterSite(page);
  const contact = await page.evaluate(() => site.contact);
  await expect(page.locator('a[href^="mailto:' + contact.email + '"]').first()).toBeAttached();
  for (const l of contact.links) await expect(page.locator('a[href="' + l.url + '"]').first()).toBeAttached();
});
