import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

// ES module 中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载 .env 文件
dotenv.config({ path: resolve(__dirname, ".env") });
const port = 5173
const PREFIX_PATH = process.env.VITE_PREFIX_PATH || "";
const BASE_URL = `http://localhost:${port}${PREFIX_PATH}`;
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  timeout: 15000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless: true,
    actionTimeout: 5000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${port}`,
    url: `${BASE_URL}/`,
    reuseExistingServer: true,
    timeout: 120 * 1000,
  },
});
