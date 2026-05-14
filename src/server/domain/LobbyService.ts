import { randomUUID } from "node:crypto";
import type {
  GameStartPayload,
  LobbySnapshot,
} from "@shared/contracts/RealtimeContracts.js";

interface LobbyEntity {
  id: string;
  name: string;
  maxPlayers: number;
  status: "waiting" | "in-game";
  players: Map<string, { username: string; isReady: boolean }>;
}

export class LobbyService {
  private readonly lobbies = new Map<string, LobbyEntity>();

  listLobbies(): LobbySnapshot[] {
    return [...this.lobbies.values()].map((lobby) => this.toSnapshot(lobby));
  }

  createLobby(ownerSocketId: string, name: string, username: string, maxPlayers = 2) {
    const lobby: LobbyEntity = {
      id: randomUUID(),
      name,
      maxPlayers: Math.min(Math.max(maxPlayers, 2), 8),
      status: "waiting",
      players: new Map([[ownerSocketId, { username, isReady: false }]]),
    };

    this.lobbies.set(lobby.id, lobby);

    return {
      lobby: this.toSnapshot(lobby),
      startedGame: this.tryStartGame(lobby),
    };
  }

  joinLobby(socketId: string, lobbyId: string, username: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { error: "LOBBY_NOT_FOUND" as const };

    if (lobby.players.size >= lobby.maxPlayers) {
      return { error: "LOBBY_FULL" as const };
    }

    lobby.players.set(socketId, { username, isReady: false });

    return {
      lobby: this.toSnapshot(lobby),
      startedGame: this.tryStartGame(lobby),
    };
  }

  leaveLobby(socketId: string, lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { error: "LOBBY_NOT_FOUND" as const };

    lobby.players.delete(socketId);

    if (lobby.players.size === 0) {
      this.lobbies.delete(lobbyId);
      return { lobby: null };
    }

    if (lobby.status === "in-game") {
      lobby.status = "waiting";
      for (const player of lobby.players.values()) {
        player.isReady = false;
      }
    }

    return { lobby: this.toSnapshot(lobby) };
  }

  setReadyState(socketId: string, lobbyId: string, isReady: boolean) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { error: "LOBBY_NOT_FOUND" as const };

    const player = lobby.players.get(socketId);
    if (!player) return { error: "PLAYER_NOT_FOUND" as const };

    player.isReady = isReady;

    return {
      lobby: this.toSnapshot(lobby),
      startedGame: this.tryStartGame(lobby),
    };
  }

  removeSocketFromAllLobbies(socketId: string): LobbySnapshot[] {
    const updated: LobbySnapshot[] = [];

    for (const [lobbyId, lobby] of this.lobbies.entries()) {
      if (!lobby.players.has(socketId)) continue;

      lobby.players.delete(socketId);

      if (lobby.players.size === 0) {
        this.lobbies.delete(lobbyId);
        continue;
      }

      if (lobby.status === "in-game") {
        lobby.status = "waiting";
        for (const p of lobby.players.values()) {
          p.isReady = false;
        }
      }

      updated.push(this.toSnapshot(lobby));
    }

    return updated;
  }

  private tryStartGame(lobby: LobbyEntity): GameStartPayload | null {
    const everyoneJoined = lobby.players.size === lobby.maxPlayers;
    const everyoneReady = [...lobby.players.values()].every((p) => p.isReady);

    if (!everyoneJoined || !everyoneReady) {
      if (lobby.status === "in-game") {
        lobby.status = "waiting";
      }
      return null;
    }

    lobby.status = "in-game";

    return {
      lobbyId: lobby.id,
      startedAt: Date.now(),
      playerOrder: [...lobby.players.keys()],
    };
  }

  private toSnapshot(lobby: LobbyEntity): LobbySnapshot {
    return {
      id: lobby.id,
      name: lobby.name,
      maxPlayers: lobby.maxPlayers,
      status: lobby.status,
      players: [...lobby.players.entries()].map(([id, player]) => ({
        id,
        username: player.username,
        isReady: player.isReady,
      })),
    };
  }
}
