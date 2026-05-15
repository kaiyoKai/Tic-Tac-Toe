import express, { type Request, type Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { LobbyService } from "@server/domain/LobbyService.js";
import {
  getAllowedOrigins,
  getServerPort,
  isMultiplayerServerRunning,
} from "@server/ServerConfig.js";
import { registerLobbyHandlers } from "@server/socket/registerLobbyHandlers.js";

const app = express();
const httpServer = createServer(app);
const allowedOrigins = getAllowedOrigins();

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
  },
});

const lobbyService = new LobbyService();
registerLobbyHandlers(io, lobbyService);

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ ok: true });
});

const port = getServerPort();

httpServer.on("error", (error: NodeJS.ErrnoException) => {
  void handleServerStartupError(error);
});

httpServer.listen(port, () => {
  console.log(`[multiplayer-server] running on :${port}`);
});

async function handleServerStartupError(error: NodeJS.ErrnoException) {
  if (error.code === "EADDRINUSE") {
    const alreadyRunning = await isMultiplayerServerRunning(port);

    if (alreadyRunning) {
      console.log(
        `[multiplayer-server] already running on :${port} (existing server reused).`,
      );
      process.exit(0);
      return;
    }

    console.error(
      `[multiplayer-server] port ${port} is already in use. Stop the other process or run with PORT=<free-port>.`,
    );
    process.exit(1);
    return;
  }

  console.error("[multiplayer-server] failed to start", error);
  process.exit(1);
}
