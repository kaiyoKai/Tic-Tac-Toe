import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  esbuild: {
    target: "es2022",
  },
});
