import { defineConfig, devices } from '@playwright/test';

const PORT = 4322;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${PORT}` },
  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } },
    },
    {
      name: 'mobile',
      use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 } },
    },
    // The owner reviews on Firefox on an iPhone-sized screen.
    {
      name: 'firefox-phone',
      use: { ...devices['Desktop Firefox'], viewport: { width: 402, height: 874 } },
    },
  ],
  webServer: {
    command: 'node scripts/serve-dist.mjs',
    port: PORT,
    reuseExistingServer: !process.env.CI,
  },
});
