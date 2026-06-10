import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 1,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  timeout: 60000,
  expect: {
    timeout: 15000,
  },

  globalSetup: './tests/e2e/global-setup.ts',

  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    actionTimeout: 20000,
    navigationTimeout: 45000,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
