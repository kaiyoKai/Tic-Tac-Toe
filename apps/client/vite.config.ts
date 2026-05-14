import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "node:path";

export default defineConfig({
  root: resolve(import.meta.dirname, "../../"),
  plugins: [tsconfigPaths({ projects: [resolve(import.meta.dirname, "../../tsconfig.json")] })],
  test: {
    globals: true,
    environment: "node",
  },
});
