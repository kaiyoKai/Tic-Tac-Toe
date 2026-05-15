import { describe, expect, it, vi } from "vitest";
import {
  getAllowedOrigins,
  getServerPort,
  isMultiplayerServerRunning,
} from "@server/ServerConfig.js";

describe("ServerConfig", () => {
  it("parses allowed origins and skips invalid entries", () => {
    expect(
      getAllowedOrigins({
        ALLOWED_ORIGINS:
          "http://localhost:5173, https://game.example.test , not-a-url",
      } as NodeJS.ProcessEnv),
    ).toEqual(["http://localhost:5173", "https://game.example.test"]);
  });

  it("falls back to port 3001 when PORT is missing or invalid", () => {
    expect(getServerPort({} as NodeJS.ProcessEnv)).toBe(3001);
    expect(getServerPort({ PORT: "invalid" } as NodeJS.ProcessEnv)).toBe(3001);
  });

  it("detects an already running multiplayer server via /health", async () => {
    const fetchFn = vi.fn(async () => ({
      ok: true,
      json: async () => ({ ok: true }),
    })) as typeof fetch;

    await expect(isMultiplayerServerRunning(3001, fetchFn)).resolves.toBe(true);
  });

  it("treats other processes on the port as not being the multiplayer server", async () => {
    const fetchFn = vi.fn(async () => ({
      ok: true,
      json: async () => ({ ok: false }),
    })) as typeof fetch;

    await expect(isMultiplayerServerRunning(3001, fetchFn)).resolves.toBe(false);
  });
});
