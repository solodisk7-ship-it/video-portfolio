import { defineConfig } from '@playwright/test'

// Read-only remote checks are separate from local UI tests and require an explicit command.
export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/media.spec.ts',
  workers: 1,
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  reporter: 'list',
})
