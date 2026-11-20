const { test, expect } = require('./fixtures');
const AxeBuilder = require('@axe-core/playwright').default;
const { enterSite } = require('./helpers');

test('no critical accessibility problems', async ({ page }, info) => {
  await enterSite(page);
  await page.waitForTimeout(800);
  const res = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  // Everything is attached to the report; only "critical" fails the build so it stays useful, not noisy.
  await info.attach('axe-results.json', { body: JSON.stringify(res.violations, null, 2), contentType: 'application/json' });
  const critical = res.violations.filter((v) => v.impact === 'critical');
  expect(critical.map((v) => `${v.id}: ${v.help} (${v.nodes.length} elements)`)).toEqual([]);
});
