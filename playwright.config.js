// Uses NODE_PATH=~/.local/share/playwright-test/node_modules at runtime
// so this project doesn't ship its own node_modules (per repo convention).
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:4829' },
  webServer: {
    command: 'python3 -m http.server 4829',
    port: 4829,
    reuseExistingServer: false,
  },
});
