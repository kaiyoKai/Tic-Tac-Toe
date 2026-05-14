import type { Server, Socket } from "socket.io";
import {
  isCreateLobbyRequest,
  isJoinLobbyRequest,
  isLeaveLobbyRequest,
  isReadyStateRequest,
  type LobbyErrorPayload,
  RealtimeClientEvent,
  RealtimeServerEvent,
} from "@shared/contracts/RealtimeContracts.js";
import { LobbyService } from "@server/domain/LobbyService.js";

function emitError(socket: Socket, payload: LobbyErrorPayload): void {
  socket.emit(RealtimeServerEvent.Error, payload);
}

function broadcastLobbyList(io: Server, service: LobbyService): void {
  io.emit(RealtimeServerEvent.LobbyList, service.listLobbies());
}

export function registerLobbyHandlers(io: Server, service: LobbyService): void {
  io.on("connection", (socket) => {
    socket.emit(RealtimeServerEvent.LobbyList, service.listLobbies());

    socket.on(RealtimeClientEvent.ListLobbies, () => {
      socket.emit(RealtimeServerEvent.LobbyList, service.listLobbies());
    });

    socket.on(RealtimeClientEvent.CreateLobby, (payload: unknown) => {
      if (!isCreateLobbyRequest(payload)) {
        emitError(socket, {
          message: "Ungültige Lobby-Creation Payload",
          code: "INVALID_PAYLOAD",
        });
        return;
      }

      const { lobby, startedGame } = service.createLobby(
        socket.id,
        payload.name,
        payload.username,
        payload.maxPlayers,
      );

      socket.join(lobby.id);
      socket.emit(RealtimeServerEvent.LobbyJoined, lobby);
      io.to(lobby.id).emit(RealtimeServerEvent.LobbyUpdated, lobby);
      broadcastLobbyList(io, service);

      if (startedGame) {
        io.to(lobby.id).emit(RealtimeServerEvent.GameStart, startedGame);
      }
    });

    socket.on(RealtimeClientEvent.JoinLobby, (payload: unknown) => {
      if (!isJoinLobbyRequest(payload)) {
        emitError(socket, {
          message: "Ungültige Lobby-Join Payload",
          code: "INVALID_PAYLOAD",
        });
        return;
      }

      const result = service.joinLobby(socket.id, payload.lobbyId, payload.username);
      if (result.error) {
        emitError(socket, {
          message:
            result.error === "LOBBY_FULL"
              ? "Lobby ist voll"
              : "Lobby wurde nicht gefunden",
          code: result.error,
        });
        return;
      }

      socket.join(payload.lobbyId);
      socket.emit(RealtimeServerEvent.LobbyJoined, result.lobby);
      io.to(payload.lobbyId).emit(RealtimeServerEvent.LobbyUpdated, result.lobby);
      broadcastLobbyList(io, service);

      if (result.startedGame) {
        io.to(payload.lobbyId).emit(RealtimeServerEvent.GameStart, result.startedGame);
      }
    });

    socket.on(RealtimeClientEvent.LeaveLobby, (payload: unknown) => {
      if (!isLeaveLobbyRequest(payload)) {
        emitError(socket, {
          message: "Ungültige Lobby-Leave Payload",
          code: "INVALID_PAYLOAD",
        });
        return;
      }

      const result = service.leaveLobby(socket.id, payload.lobbyId);
      if (result.error) {
        emitError(socket, {
          message: "Lobby wurde nicht gefunden",
          code: result.error,
        });
        return;
      }

      socket.leave(payload.lobbyId);
      if (result.lobby) {
        io.to(payload.lobbyId).emit(RealtimeServerEvent.LobbyUpdated, result.lobby);
      }
      broadcastLobbyList(io, service);
    });

    socket.on(RealtimeClientEvent.SetReady, (payload: unknown) => {
      if (!isReadyStateRequest(payload)) {
        emitError(socket, {
          message: "Ungültige Ready-State Payload",
          code: "INVALID_PAYLOAD",
        });
        return;
      }

      const result = service.setReadyState(socket.id, payload.lobbyId, payload.isReady);
      if (result.error) {
        emitError(socket, {
          message:
            result.error === "PLAYER_NOT_FOUND"
              ? "Spieler ist nicht in der Lobby"
              : "Lobby wurde nicht gefunden",
          code: result.error,
        });
        return;
      }

      io.to(payload.lobbyId).emit(RealtimeServerEvent.LobbyUpdated, result.lobby);
      broadcastLobbyList(io, service);

      if (result.startedGame) {
        io.to(payload.lobbyId).emit(RealtimeServerEvent.GameStart, result.startedGame);
      }
    });

    socket.on("disconnect", () => {
      const updatedLobbies = service.removeSocketFromAllLobbies(socket.id);
      for (const lobby of updatedLobbies) {
        io.to(lobby.id).emit(RealtimeServerEvent.LobbyUpdated, lobby);
      }
      broadcastLobbyList(io, service);
    });
  });
}
