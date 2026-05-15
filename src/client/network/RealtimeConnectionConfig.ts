interface RealtimeConnectionConfigOptions {
  env?: Record<string, string | undefined>;
  windowOrigin?: string;
}

export function resolveRealtimeServerUrl(
  options: RealtimeConnectionConfigOptions = {},
): string {
  const env =
    options.env ??
    ((typeof import.meta !== "undefined" ? import.meta.env : undefined) as
      | Record<string, string | undefined>
      | undefined) ??
    {};

  const explicitUrl = env.VITE_SERVER_URL?.trim();
  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, "");
  }

  const port = env.VITE_SERVER_PORT?.trim() || "3001";
  const windowOrigin =
    options.windowOrigin ??
    (typeof window !== "undefined" ? window.location.origin : undefined);

  if (!windowOrigin) {
    return `http://localhost:${port}`;
  }

  const resolvedUrl = new URL(windowOrigin);
  resolvedUrl.port = port;
  return resolvedUrl.toString().replace(/\/$/, "");
}
