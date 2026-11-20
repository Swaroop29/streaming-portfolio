// Tests must never talk to the real analytics service: it would count robot visits as real visitors,
// and its script replaces the test recorder (window.goatcounter) that the analytics tests rely on.
const base = require('@playwright/test');

const test = base.test.extend({
  page: async ({ page }, use) => {
    await page.route(/gc\.zgo\.at|goatcounter\.com/, (route) => route.abort());
    await use(page);
  },
});

module.exports = { test, expect: base.expect };
