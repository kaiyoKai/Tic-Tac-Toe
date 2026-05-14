import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [tsconfigPaths({ projects: ["./tsconfig.json"] })],
  resolve: {
    alias: {
      "@events": resolve(import.meta.dirname, "./src/events"),
      "@game": resolve(import.meta.dirname, "./src/game"),
      "@engine": resolve(import.meta.dirname, "./src/game/engine"),
      "@players": resolve(import.meta.dirname, "./src/game/players"),
      "@shared": resolve(import.meta.dirname, "./src/shared"),
      "@ui": resolve(import.meta.dirname, "./src/ui"),
      "@components": resolve(import.meta.dirname, "./src/ui/components"),
      "@lobby": resolve(import.meta.dirname, "./src/lobby"),
      "@client": resolve(import.meta.dirname, "./src/client"),
      "@core": resolve(import.meta.dirname, "./src/core"),
      "@server": resolve(import.meta.dirname, "./src/server"),
      "@controller": resolve(import.meta.dirname, "./src/controller"),
    },
  },
  test: {
    globals: true,
    environment: "node",
  },
});
