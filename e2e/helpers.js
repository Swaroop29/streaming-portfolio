const { expect } = require('@playwright/test');

// Collects anything that would look broken to a visitor: script errors, console errors, failed requests.
function watchProblems(page) {
  const problems = [];
  page.on('pageerror', (e) => problems.push('script error: ' + e.message));
  page.on('console', (m) => {
    // Third-party scripts (analytics) are outside our control, so only our own errors count.
    const from = m.location().url || '';
    if (m.type() === 'error' && (from === '' || from.startsWith('http://localhost'))) problems.push('console error: ' + m.text());
  });
  page.on('requestfailed', (r) => {
    const u = r.url();
    if (u.startsWith('http://localhost')) problems.push('failed request: ' + u);
  });
  page.on('response', (r) => {
    if (r.url().startsWith('http://localhost') && r.status() >= 400) problems.push(`HTTP ${r.status()}: ${r.url()}`);
  });
  return problems;
}

// The intro animation covers the picker for a few seconds; a visitor can click to skip it.
async function skipIntro(page) {
  await page.locator('#intro.play').click({ force: true, timeout: 3000 }).catch(() => {});
  await expect(page.locator('#intro')).not.toHaveClass(/play/, { timeout: 15_000 });
}

// Open the site and get past the intro and profile picker like a visitor would.
async function enterSite(page, profile = 'engineer') {
  await page.goto('/');
  await skipIntro(page);
  await page.locator(`.profile[data-id="${profile}"]`).click();
  await expect(page.locator('#picker')).toHaveClass(/gone/);
}

module.exports = { watchProblems, enterSite, skipIntro };
