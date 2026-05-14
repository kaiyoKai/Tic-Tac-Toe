import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { LobbyService } from "@server/domain/LobbyService.js";
import { registerLobbyHandlers } from "@server/socket/registerLobbyHandlers.js";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

const lobbyService = new LobbyService();
registerLobbyHandlers(io, lobbyService);

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const port = Number(process.env.PORT ?? 3001);
httpServer.listen(port, () => {
  console.log(`[multiplayer-server] running on :${port}`);
});
