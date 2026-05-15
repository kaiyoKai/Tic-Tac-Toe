export function getAllowedOrigins(
  env: NodeJS.ProcessEnv = process.env,
): string[] {
  return (env.ALLOWED_ORIGINS ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => {
      if (!origin) return false;
      try {
        new URL(origin);
        return true;
      } catch {
        console.warn(
          `[multiplayer-server] ignoring invalid ALLOWED_ORIGINS entry: ${origin}`,
        );
        return false;
      }
    });
}

export function getServerPort(env: NodeJS.ProcessEnv = process.env): number {
  const parsedPort = Number(env.PORT ?? 3001);
  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3001;
}

export async function isMultiplayerServerRunning(
  port: number,
  fetchFn: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const response = await fetchFn(`http://127.0.0.1:${port}/health`);
    if (!response.ok) {
      return false;
    }

    const payload = (await response.json()) as { ok?: boolean };
    return payload?.ok === true;
  } catch {
    return false;
  }
}
