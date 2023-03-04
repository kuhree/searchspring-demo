/// <reference types="vitest" />

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "https://kuhree.github.io/searchspring-demo",
  define: {
    "import.meta.vitest": "undefined",
  },
  plugins: [react()],
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
