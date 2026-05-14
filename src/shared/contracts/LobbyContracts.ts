import type { ProfileDraft } from "./ProfileContracts.js";
import type { PlayerSymbol } from "@shared/Common.js";

export const LobbyVisibility = {
  Public: "public",
  Private: "private",
  Local: "local",
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

export const LobbyPenaltyMode = {
  RandomMove: "random-move",
  Warning: "warning",
  Kick: "kick",
} as const;

export type LobbyPenaltyMode =
  (typeof LobbyPenaltyMode)[keyof typeof LobbyPenaltyMode];

export const LobbySettingRequestStatus = {
  Pending: "pending",
  Accepted: "accepted",
  Rejected: "rejected",
} as const;

export type LobbySettingRequestStatus =
  (typeof LobbySettingRequestStatus)[keyof typeof LobbySettingRequestStatus];

export interface LobbySettings {
  maxPlayers: number;
  allowedLocalPlayers: number;
  maxBots: number;
  visibility: LobbyVisibility;
  autoStart: boolean;
  boardSize: number;
  winCon: number;
  gravityEnabled: boolean;
  rotationEnabled: boolean;
  moveTimeoutMs: number;
  penaltyMode: LobbyPenaltyMode;
  presetId: string | null;
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
  /** Unix timestamp in milliseconds. */
  createdAt: number;
  status: "waiting" | "in-game";
  members: LobbyMemberSnapshot[];
  settings: LobbySettings;
  pendingSettingRequests: LobbySettingRequest[];
}

export interface LobbyPreset {
  id: string;
  name: string;
  settings: LobbySettings;
  builtIn: boolean;
  /** Unix timestamp in milliseconds. */
  createdAt: number;
  /** Unix timestamp in milliseconds. */
  updatedAt: number;
}

export interface LobbySettingRequest {
  id: string;
  lobbyId: string;
  requesterId: string;
  requesterName: string;
  targetSetting: keyof LobbySettings;
  proposedValue: string | number | boolean | null;
  reason: string;
  status: LobbySettingRequestStatus;
  /** Unix timestamp in milliseconds. */
  createdAt: number;
}

export interface LobbySettingDecisionRequest {
  lobbyId: string;
  requestId: string;
  decision: "accept" | "reject";
}

export interface HostTransferRequest {
  lobbyId: string;
  nextHostId: string;
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

export interface RequestLobbySettingChange {
  lobbyId: string;
  requesterId: string;
  requesterName: string;
  targetSetting: keyof LobbySettings;
  proposedValue: string | number | boolean | null;
  reason?: string;
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
    | "GAME_ALREADY_RUNNING"
    | "MESSAGE_NOT_FOUND"
    | "GAME_NOT_STARTED"
    | "NOT_YOUR_TURN"
    | "BOARD_OUT_OF_SYNC"
    | "SETTING_REQUEST_NOT_FOUND";
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
    (data.allowedLocalPlayers ?? 0) <=
      Math.max(0, (data.maxPlayers ?? 0) - 1) &&
    Number.isInteger(data.maxBots) &&
    (data.maxBots ?? 0) >= 0 &&
    (data.maxBots ?? 0) <= 4 &&
    (data.visibility === "public" ||
      data.visibility === "private" ||
      data.visibility === "local") &&
    typeof data.autoStart === "boolean" &&
    Number.isInteger(data.boardSize) &&
    (data.boardSize ?? 0) >= 2 &&
    (data.boardSize ?? 0) <= 10 &&
    Number.isInteger(data.winCon) &&
    (data.winCon ?? 0) >= 2 &&
    (data.winCon ?? 0) <= (data.boardSize ?? 0) &&
    typeof data.gravityEnabled === "boolean" &&
    typeof data.rotationEnabled === "boolean" &&
    Number.isInteger(data.moveTimeoutMs) &&
    (data.moveTimeoutMs ?? 0) >= 0 &&
    (data.penaltyMode === "random-move" ||
      data.penaltyMode === "warning" ||
      data.penaltyMode === "kick") &&
    (data.presetId === null || typeof data.presetId === "string")
  );
}

export function isLobbySettingRequest(
  payload: unknown,
): payload is RequestLobbySettingChange {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<RequestLobbySettingChange>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.requesterId === "string" &&
    data.requesterId.trim().length > 0 &&
    typeof data.requesterName === "string" &&
    data.requesterName.trim().length > 0 &&
    typeof data.targetSetting === "string" &&
    (data.reason === undefined ||
      (typeof data.reason === "string" && data.reason.trim().length > 0))
  );
}

export function isLobbySettingDecisionRequest(
  payload: unknown,
): payload is LobbySettingDecisionRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<LobbySettingDecisionRequest>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.requestId === "string" &&
    data.requestId.trim().length > 0 &&
    (data.decision === "accept" || data.decision === "reject")
  );
}

export function isHostTransferRequest(
  payload: unknown,
): payload is HostTransferRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<HostTransferRequest>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.nextHostId === "string" &&
    data.nextHostId.trim().length > 0
  );
}
