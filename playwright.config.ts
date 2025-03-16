import { defineConfig } from "playwright/test";

export default defineConfig({
  testIgnore: [
    "**/*.test.{ts,js}", // vitest tests
  ],
});
