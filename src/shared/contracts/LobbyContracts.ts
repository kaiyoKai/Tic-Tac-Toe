import type { ProfileDraft } from "./ProfileContracts.js";
import type { PlayerSymbol } from "@shared/Common.js";

export const LobbyVisibility = {
  Public: "public",
  Private: "private",
} as const;

export type LobbyVisibility =
  (typeof LobbyVisibility)[keyof typeof LobbyVisibility];

export const LobbyMemberRole = {
  Host: "host",
  Player: "player",
  Local: "local",
  Bot: "bot",
} as const;

export type LobbyMemberRole =
  (typeof LobbyMemberRole)[keyof typeof LobbyMemberRole];

export interface LobbySettings {
  maxPlayers: number;
  allowedLocalPlayers: number;
  maxBots: number;
  visibility: LobbyVisibility;
  autoStart: boolean;
}

export interface LobbyMemberSnapshot {
  id: string;
  username: string;
  symbol: PlayerSymbol;
  role: LobbyMemberRole;
  isReady: boolean;
  seatIndex: number;
}

export interface LobbySnapshot {
  id: string;
  name: string;
  hostId: string;
  createdAt: number;
  status: "waiting" | "in-game";
  members: LobbyMemberSnapshot[];
  settings: LobbySettings;
}

export interface CreateLobbyRequest {
  name: string;
  profile: ProfileDraft;
  settings: LobbySettings;
}

export interface JoinLobbyRequest {
  lobbyId: string;
  profile: ProfileDraft;
}

export interface UpdateLobbyRequest {
  lobbyId: string;
  settings: Partial<LobbySettings>;
}

export interface SetReadyRequest {
  lobbyId: string;
  isReady: boolean;
}

export interface LobbyErrorPayload {
  message: string;
  code:
    | "INVALID_PAYLOAD"
    | "LOBBY_NOT_FOUND"
    | "LOBBY_FULL"
    | "PLAYER_NOT_FOUND"
    | "NOT_HOST"
    | "INVALID_SETTINGS"
    | "MESSAGE_NOT_FOUND"
    | "GAME_NOT_STARTED"
    | "NOT_YOUR_TURN"
    | "BOARD_OUT_OF_SYNC";
}

export interface PresencePermissions {
  canManageLobby: boolean;
  canAddLocalPlayers: boolean;
  canAddBots: boolean;
  canChat: boolean;
  canPlay: boolean;
}

export function isLobbySettings(payload: unknown): payload is LobbySettings {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<LobbySettings>;
  return (
    Number.isInteger(data.maxPlayers) &&
    (data.maxPlayers ?? 0) >= 2 &&
    (data.maxPlayers ?? 0) <= 8 &&
    Number.isInteger(data.allowedLocalPlayers) &&
    (data.allowedLocalPlayers ?? 0) >= 0 &&
    (data.allowedLocalPlayers ?? 0) <= (data.maxPlayers ?? 0) &&
    Number.isInteger(data.maxBots) &&
    (data.maxBots ?? 0) >= 0 &&
    (data.maxBots ?? 0) <= 4 &&
    (data.visibility === "public" || data.visibility === "private") &&
    typeof data.autoStart === "boolean"
  );
}
