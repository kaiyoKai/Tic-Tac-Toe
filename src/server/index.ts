import express, { type Request, type Response } from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { LobbyService } from "@server/domain/LobbyService.js";
import { registerLobbyHandlers } from "@server/socket/registerLobbyHandlers.js";

const app = express();
const httpServer = createServer(app);
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

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

const port = Number(process.env.PORT ?? 3001);
httpServer.listen(port, () => {
  console.log(`[multiplayer-server] running on :${port}`);
});
