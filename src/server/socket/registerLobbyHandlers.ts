import type { Server, Socket } from "socket.io";
import {
  isCreateLobbyRequest,
  isJoinLobbyRequest,
  isLeaveLobbyRequest,
  isMoveRequest,
  isReactionRequest,
  isProfileDraft,
  isReadyStateRequest,
  isSendMessageRequest,
  isUpdateLobbyRequest,
  RealtimeClientEvent,
  RealtimeServerEvent,
  type LobbyErrorPayload,
  type ProfileDraft,
} from "@shared/contracts/RealtimeContracts.js";
import { LobbyService } from "@server/domain/LobbyService.js";

function emitError(socket: Socket, payload: LobbyErrorPayload): void {
  socket.emit(RealtimeServerEvent.Error, payload);
}

function broadcastLobbyList(io: Server, service: LobbyService): void {
  io.emit(RealtimeServerEvent.LobbyList, service.listLobbies());
}

function emitLobbySnapshot(io: Server, lobbyId: string, service: LobbyService) {
  const lobby = service.listLobbies().find((entry) => entry.id === lobbyId);
  if (!lobby) return;

  io.to(lobbyId).emit(RealtimeServerEvent.LobbyUpdated, lobby);
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
          message: "Ungültige Lobby-Erstellung Payload",
          code: "INVALID_PAYLOAD",
        });
        return;
      }

      const { lobby, startedGame } = service.createLobby(socket.id, payload);

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

      const result = service.joinLobby(socket.id, payload);
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

    socket.on(RealtimeClientEvent.UpdateLobby, (payload: unknown) => {
      if (!isUpdateLobbyRequest(payload)) {
        emitError(socket, {
          message: "Ungültige Lobby-Update Payload",
          code: "INVALID_PAYLOAD",
        });
        return;
      }

      const result = service.updateLobby(socket.id, payload);
      if (result.error) {
        emitError(socket, {
          message:
            result.error === "NOT_HOST"
              ? "Nur der Host darf die Lobby ändern"
              : "Lobby wurde nicht gefunden",
          code: result.error,
        });
        return;
      }

      io.to(payload.lobbyId).emit(RealtimeServerEvent.LobbyUpdated, result.lobby);
      broadcastLobbyList(io, service);
    });

    socket.on(RealtimeClientEvent.UpdateProfile, (payload: unknown) => {
      if (!isProfileDraft(payload)) {
        emitError(socket, {
          message: "Ungültige Profil-Payload",
          code: "INVALID_PAYLOAD",
        });
        return;
      }

      const updatedLobbies = service.updateProfile(socket.id, payload as ProfileDraft);
      for (const lobby of updatedLobbies) {
        io.to(lobby.id).emit(RealtimeServerEvent.LobbyUpdated, lobby);
      }
      if (updatedLobbies.length) {
        socket.emit(RealtimeServerEvent.ProfileUpdated, payload);
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

    socket.on(RealtimeClientEvent.SendMessage, (payload: unknown) => {
      if (!isSendMessageRequest(payload)) {
        emitError(socket, {
          message: "Ungültige Chat Payload",
          code: "INVALID_PAYLOAD",
        });
        return;
      }

      const result = service.sendMessage(socket.id, payload);
      if (result.error) {
        emitError(socket, {
          message: "Lobby oder Spieler wurde nicht gefunden",
          code: result.error,
        });
        return;
      }

      socket.to(payload.lobbyId).emit(RealtimeServerEvent.ChatMessage, result.message);
    });

    socket.on(RealtimeClientEvent.ReactToMessage, (payload: unknown) => {
      if (!isReactionRequest(payload)) {
        emitError(socket, {
          message: "Ungültige Reaktions-Payload",
          code: "INVALID_PAYLOAD",
        });
        return;
      }

      const result = service.reactToMessage(socket.id, payload);
      if (result.error) {
        emitError(socket, {
          message: "Reaktion konnte nicht verarbeitet werden",
          code: result.error,
        });
        return;
      }

      io.to(payload.lobbyId).emit(RealtimeServerEvent.ChatReaction, result.message);
    });

    socket.on(RealtimeClientEvent.SubmitMove, (payload: unknown) => {
      if (!isMoveRequest(payload)) {
        emitError(socket, {
          message: "Ungültige Move-Payload",
          code: "INVALID_PAYLOAD",
        });
        return;
      }

      const result = service.submitMove(socket.id, payload);
      if ("error" in result) {
        emitError(socket, {
          message: "Move konnte nicht validiert werden",
          code: result.error as LobbyErrorPayload["code"],
        });
        socket.emit(RealtimeServerEvent.MoveRejected, {
          accepted: false,
          reason: result.error,
          row: payload.row,
          col: payload.col,
          symbol: "",
          board: payload.board,
          turn: 0,
          winner: null,
        });
        return;
      }

      socket.to(payload.lobbyId).emit(RealtimeServerEvent.MoveAccepted, result);
      socket.emit(RealtimeServerEvent.MoveAccepted, result);

      emitLobbySnapshot(io, payload.lobbyId, service);
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
