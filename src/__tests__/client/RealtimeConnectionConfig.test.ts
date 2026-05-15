import { describe, expect, it } from "vitest";
import { resolveRealtimeServerUrl } from "@client/network/RealtimeConnectionConfig.js";

describe("resolveRealtimeServerUrl", () => {
  it("prefers the explicit VITE_SERVER_URL", () => {
    expect(
      resolveRealtimeServerUrl({
        env: {
          VITE_SERVER_URL: "https://example.test/socket",
          VITE_SERVER_PORT: "3999",
        },
      }),
    ).toBe("https://example.test/socket");
  });

  it("reuses the browser origin host with a custom port", () => {
    expect(
      resolveRealtimeServerUrl({
        env: {
          VITE_SERVER_PORT: "4555",
        },
        windowOrigin: "http://192.168.1.40:5173",
      }),
    ).toBe("http://192.168.1.40:4555");
  });

  it("falls back to localhost:3001 when no environment is provided", () => {
    expect(resolveRealtimeServerUrl({ env: {}, windowOrigin: undefined })).toBe(
      "http://localhost:3001",
    );
  });
});
