/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test'

// 127.0.0.1, not localhost: localhost may resolve to ::1 first on Linux,
// while wrangler listens on IPv4 only.
const host = '127.0.0.1'
const port = 8788

// Tests run against the built site served by `wrangler dev`, which applies
// public/_headers and the same 404 and trailing-slash handling as production.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://${host}:${port}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm build && pnpm exec wrangler dev --port ${port} --ip ${host}`,
    url: `http://${host}:${port}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { WRANGLER_SEND_METRICS: 'false' },
  },
})
