const { defineConfig, devices } = require('@playwright/test');

// Locally the sandbox only has a system Chrome; CI installs real Chromium, Firefox and WebKit.
const localChrome = process.env.PW_CHROME ? { launchOptions: { executablePath: process.env.PW_CHROME } } : {};

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 8_000 },
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['list'], ['html', { open: 'never' }], ['junit', { outputFile: 'test-results/junit.xml' }]]
    : [['list']],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    ...localChrome,
  },
  // When BASE_URL is set (live-site check) we test that address instead of starting a local server.
  webServer: process.env.BASE_URL ? undefined : {
    command: 'npx http-server . -p 4173 -c-1 --silent',
    url: 'http://localhost:4173',
    reuseExistingServer: !process.env.CI,
  },
  // Every device class a visitor is likely to use, across all three browser engines.
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
    { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } } },
    { name: 'desktop-safari', use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } } },
    { name: 'laptop-small', use: { ...devices['Desktop Chrome'], viewport: { width: 1024, height: 700 } } },
    { name: 'ipad', use: { ...devices['iPad (gen 7)'] } },
    { name: 'iphone', use: { ...devices['iPhone 14'] } },
    { name: 'iphone-small', use: { ...devices['iPhone SE'] } },
    { name: 'android', use: { ...devices['Pixel 7'] } },
    { name: 'android-small', use: { ...devices['Galaxy S9+'] } },
  ],
});
