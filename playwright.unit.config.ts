import { defineConfig } from "@playwright/test";

// Pure-function specs: no browser page, no Next server.
export default defineConfig({ testDir: "./tests/unit", timeout: 10_000 });
