import { randomUUID } from "node:crypto";
import { Difficulty, GameMode, MoveStatus } from "@shared/Common.js";
import { XOXOGame } from "@engine/XOXOGame.js";
import { GameSettings } from "@engine/GameSettings.js";
import type { BoardSnapshot, MoveRequest, MoveResponse } from "@shared/contracts/GameContracts.js";
import type {
  ChatMessageRequest,
  ChatMessageSnapshot,
  ChatReactionRequest,
} from "@shared/contracts/ChatContracts.js";
import type {
  CreateLobbyRequest,
  JoinLobbyRequest,
  LobbyMemberSnapshot,
  LobbySettings,
  LobbySnapshot,
  UpdateLobbyRequest,
} from "@shared/contracts/LobbyContracts.js";
import type { ProfileDraft, UserProfile } from "@shared/contracts/ProfileContracts.js";

interface LobbyMemberEntity extends LobbyMemberSnapshot {
  profile: UserProfile;
}

interface GameState {
  game: XOXOGame;
  playerOrder: string[];
  startedAt: number;
}

interface LobbyEntity {
  id: string;
  name: string;
  hostId: string;
  createdAt: number;
  status: "waiting" | "in-game";
  settings: LobbySettings;
  members: Map<string, LobbyMemberEntity>;
  messages: Map<string, ChatMessageSnapshot>;
  gameState: GameState | null;
}

const DEFAULT_SETTINGS: LobbySettings = {
  maxPlayers: 4,
  allowedLocalPlayers: 1,
  maxBots: 0,
  visibility: "public",
  autoStart: false,
};

export class LobbyService {
  private readonly lobbies = new Map<string, LobbyEntity>();

  listLobbies(): LobbySnapshot[] {
    return [...this.lobbies.values()].map((lobby) => this.toSnapshot(lobby));
  }

  createLobby(ownerSocketId: string, request: CreateLobbyRequest) {
    const lobby: LobbyEntity = {
      id: randomUUID(),
      name: request.name.trim(),
      hostId: ownerSocketId,
      createdAt: Date.now(),
      status: "waiting",
      settings: this.normalizeSettings(request.settings),
      members: new Map(),
      messages: new Map(),
      gameState: null,
    };

    lobby.members.set(
      ownerSocketId,
      this.createMember(ownerSocketId, request.profile, "host", 0),
    );
    this.lobbies.set(lobby.id, lobby);

    return {
      lobby: this.toSnapshot(lobby),
      startedGame: this.tryStartGame(lobby),
    };
  }

  joinLobby(socketId: string, request: JoinLobbyRequest) {
    const lobby = this.lobbies.get(request.lobbyId);
    if (!lobby) return { error: "LOBBY_NOT_FOUND" as const };

    if (lobby.members.size >= lobby.settings.maxPlayers) {
      return { error: "LOBBY_FULL" as const };
    }

    lobby.members.set(
      socketId,
      this.createMember(socketId, request.profile, "player", lobby.members.size),
    );

    return {
      lobby: this.toSnapshot(lobby),
      startedGame: this.tryStartGame(lobby),
    };
  }

  updateLobby(socketId: string, request: UpdateLobbyRequest) {
    const lobby = this.lobbies.get(request.lobbyId);
    if (!lobby) return { error: "LOBBY_NOT_FOUND" as const };
    if (lobby.hostId !== socketId) return { error: "NOT_HOST" as const };

    lobby.settings = this.normalizeSettings({
      ...lobby.settings,
      ...request.settings,
    });

    return {
      lobby: this.toSnapshot(lobby),
      startedGame: this.tryStartGame(lobby),
    };
  }

  leaveLobby(socketId: string, lobbyId: string) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { error: "LOBBY_NOT_FOUND" as const };

    lobby.members.delete(socketId);

    if (lobby.members.size === 0) {
      this.lobbies.delete(lobbyId);
      return { lobby: null };
    }

    if (lobby.hostId === socketId) {
      lobby.hostId = [...lobby.members.keys()][0]!;
    }

    if (lobby.status === "in-game") {
      lobby.status = "waiting";
      lobby.gameState = null;
      for (const member of lobby.members.values()) {
        member.isReady = false;
      }
    }

    return { lobby: this.toSnapshot(lobby) };
  }

  setReadyState(socketId: string, lobbyId: string, isReady: boolean) {
    const lobby = this.lobbies.get(lobbyId);
    if (!lobby) return { error: "LOBBY_NOT_FOUND" as const };

    const member = lobby.members.get(socketId);
    if (!member) return { error: "PLAYER_NOT_FOUND" as const };

    member.isReady = isReady;

    return {
      lobby: this.toSnapshot(lobby),
      startedGame: this.tryStartGame(lobby),
    };
  }

  updateProfile(socketId: string, profile: ProfileDraft) {
    const updated: LobbySnapshot[] = [];

    for (const lobby of this.lobbies.values()) {
      const member = lobby.members.get(socketId);
      if (!member) continue;

      member.username = profile.username.trim();
      member.symbol = profile.symbol;
      member.profile = {
        ...member.profile,
        username: member.username,
        symbol: member.symbol,
        preferences: {
          ...member.profile.preferences,
          ...(profile.preferences ?? {}),
        },
        updatedAt: Date.now(),
      };
      updated.push(this.toSnapshot(lobby));
    }

    return updated;
  }

  sendMessage(socketId: string, request: ChatMessageRequest) {
    const lobby = this.lobbies.get(request.lobbyId);
    if (!lobby) return { error: "LOBBY_NOT_FOUND" as const };

    const member = lobby.members.get(socketId);
    if (!member) return { error: "PLAYER_NOT_FOUND" as const };

    const message: ChatMessageSnapshot = {
      id: request.id ?? randomUUID(),
      lobbyId: request.lobbyId,
      senderId: member.id,
      senderName: member.username,
      content: request.content.trim(),
      createdAt: request.createdAt ?? Date.now(),
      reactions: [],
    };

    lobby.messages.set(message.id, message);
    return { message };
  }

  reactToMessage(socketId: string, request: ChatReactionRequest) {
    const lobby = this.lobbies.get(request.lobbyId);
    if (!lobby) return { error: "LOBBY_NOT_FOUND" as const };

    const member = lobby.members.get(socketId);
    if (!member) return { error: "PLAYER_NOT_FOUND" as const };

    const message = lobby.messages.get(request.messageId);
    if (!message) return { error: "MESSAGE_NOT_FOUND" as const };

    const reaction = message.reactions.find(
      (entry) => entry.emoji === request.emoji,
    );
    if (reaction) {
      if (!reaction.userIds.includes(member.id)) {
        reaction.userIds.push(member.id);
      }
    } else {
      message.reactions.push({
        emoji: request.emoji,
        userIds: [member.id],
      });
    }

    return { message };
  }

  submitMove(socketId: string, request: MoveRequest): MoveResponse | { error: string } {
    const lobby = this.lobbies.get(request.lobbyId);
    if (!lobby) return { error: "LOBBY_NOT_FOUND" as const };
    if (!lobby.gameState) return { error: "GAME_NOT_STARTED" as const };

    const member = lobby.members.get(socketId);
    if (!member) return { error: "PLAYER_NOT_FOUND" as const };

    const { game, playerOrder } = lobby.gameState;
    const activePlayerId = playerOrder[game.turn % playerOrder.length];
    if (activePlayerId !== socketId) {
      return { error: "NOT_YOUR_TURN" as const };
    }

    if (request.board.state.length !== game.board.state.length) {
      return { error: "BOARD_OUT_OF_SYNC" as const };
    }

    const playerId = member.seatIndex + 1;
    const moveStatus = game.makeMove(
      request.row,
      request.col,
      playerId,
      member.symbol,
    );

    const board = this.toBoardSnapshot(game);

    if (moveStatus === MoveStatus.OCCUPIED) {
      return {
        accepted: false,
        reason: "CELL_OCCUPIED",
        row: request.row,
        col: request.col,
        symbol: member.symbol,
        board,
        turn: game.turn,
        winner: game.result?.winner ?? null,
      };
    }

    if (moveStatus === MoveStatus.GAME_OVER) {
      lobby.status = "waiting";
      lobby.gameState = null;
      return {
        accepted: true,
        row: request.row,
        col: request.col,
        symbol: member.symbol,
        board,
        turn: game.turn,
        winner: game.result?.winner ?? null,
      };
    }

    return {
      accepted: true,
      row: request.row,
      col: request.col,
      symbol: member.symbol,
      board,
      turn: game.turn,
      winner: null,
    };
  }

  removeSocketFromAllLobbies(socketId: string): LobbySnapshot[] {
    const updated: LobbySnapshot[] = [];

    for (const [lobbyId, lobby] of this.lobbies.entries()) {
      if (!lobby.members.has(socketId)) continue;

      lobby.members.delete(socketId);

      if (lobby.members.size === 0) {
        this.lobbies.delete(lobbyId);
        continue;
      }

      if (lobby.hostId === socketId) {
        lobby.hostId = [...lobby.members.keys()][0]!;
      }

      if (lobby.status === "in-game") {
        lobby.status = "waiting";
        lobby.gameState = null;
        for (const member of lobby.members.values()) {
          member.isReady = false;
        }
      }

      updated.push(this.toSnapshot(lobby));
    }

    return updated;
  }

  private tryStartGame(lobby: LobbyEntity): { lobbyId: string; startedAt: number; playerOrder: string[] } | null {
    const everyoneJoined = lobby.members.size >= 2;
    const everyoneReady = [...lobby.members.values()].every((member) => member.isReady);

    if (!everyoneJoined || !everyoneReady) {
      if (lobby.status === "in-game") {
        lobby.status = "waiting";
        lobby.gameState = null;
      }
      return null;
    }

    if (!lobby.gameState) {
      const settings = new GameSettings(
        GameMode.Online,
        3,
        3,
        Difficulty.Medium,
      );
      lobby.gameState = {
        game: new XOXOGame(settings),
        playerOrder: [...lobby.members.keys()],
        startedAt: Date.now(),
      };
    }

    lobby.status = "in-game";

    return {
      lobbyId: lobby.id,
      startedAt: lobby.gameState.startedAt,
      playerOrder: lobby.gameState.playerOrder,
    };
  }

  private toSnapshot(lobby: LobbyEntity): LobbySnapshot {
    return {
      id: lobby.id,
      name: lobby.name,
      hostId: lobby.hostId,
      createdAt: lobby.createdAt,
      status: lobby.status,
      settings: lobby.settings,
      members: [...lobby.members.values()].map((member) => ({
        id: member.id,
        username: member.username,
        symbol: member.symbol,
        role: member.role,
        isReady: member.isReady,
        seatIndex: member.seatIndex,
      })),
    };
  }

  private createMember(
    id: string,
    profile: ProfileDraft,
    role: LobbyMemberSnapshot["role"],
    seatIndex: number,
  ): LobbyMemberEntity {
    const username = profile.username.trim();
    const symbol = profile.symbol;
    const userProfile: UserProfile = {
      id: randomUUID(),
      username,
      symbol,
      preferences: {
        themeName: profile.preferences?.themeName ?? "Catppuccin",
        buttonRadius: profile.preferences?.buttonRadius ?? "5%",
        chatOpenByDefault: profile.preferences?.chatOpenByDefault ?? false,
      },
      updatedAt: Date.now(),
    };

    return {
      id,
      username,
      symbol,
      role,
      isReady: false,
      seatIndex,
      profile: userProfile,
    };
  }

  private normalizeSettings(settings: LobbySettings): LobbySettings {
    return {
      maxPlayers: Math.min(Math.max(settings.maxPlayers, 2), 8),
      allowedLocalPlayers: Math.min(
        Math.max(settings.allowedLocalPlayers, 0),
        Math.max(2, settings.maxPlayers),
      ),
      maxBots: Math.min(Math.max(settings.maxBots, 0), 4),
      visibility: settings.visibility,
      autoStart: settings.autoStart,
    };
  }

  private toBoardSnapshot(game: XOXOGame): BoardSnapshot {
    return {
      size: game.board.size,
      state: Array.from(game.board.state),
      updatedAt: Date.now(),
    };
  }
}
