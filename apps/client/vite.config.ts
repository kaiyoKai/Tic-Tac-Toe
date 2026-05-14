import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "node:path";

export default defineConfig({
  root: resolve(import.meta.dirname, "../../"),
  plugins: [tsconfigPaths()],
});
