/// <reference types="vitest" />

import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://kuhree.github.io/searchspring-demo",
  define: {
    "import.meta.vitest": "undefined",
  },
  plugins: [preact()],
  test: {
    environment: "happy-dom",
    setupFiles: ["./__tests__/_setup.ts"],
    includeSource: ["src/**/*.{ts,tsx}"],
    mockReset: true,
    restoreMocks: true,
    coverage: {
      provider: "c8",
      reporter: ["text-summary", "text"],
    },
  },
});
