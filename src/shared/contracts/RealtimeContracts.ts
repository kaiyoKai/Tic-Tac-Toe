import type {
  ChatMessageRequest,
  ChatMessageSnapshot,
  ChatReactionRequest,
} from "./ChatContracts.js";
import type {
  BoardSnapshot,
  MoveRequest,
  MoveResponse,
} from "./GameContracts.js";
import type {
  CreateLobbyRequest,
  HostTransferRequest,
  JoinLobbyRequest,
  LobbyErrorPayload,
  LobbyPreset,
  LobbySettingDecisionRequest,
  LobbySettingRequest,
  LobbySettingRequestStatus,
  LobbySnapshot,
  SetReadyRequest,
  UpdateLobbyRequest,
  RequestLobbySettingChange,
} from "./LobbyContracts.js";
import type { ProfileDraft, UserProfile } from "./ProfileContracts.js";
import {
  isHostTransferRequest,
  isLobbySettingDecisionRequest,
  isLobbySettingRequest,
  isLobbySettings,
} from "./LobbyContracts.js";
import { isProfileDraft } from "./ProfileContracts.js";
import type { RotateBoardRequest } from "./GameContracts.js";

export const RealtimeClientEvent = {
  ListLobbies: "lobby:list",
  CreateLobby: "lobby:create",
  JoinLobby: "lobby:join",
  LeaveLobby: "lobby:leave",
  SetReady: "lobby:ready",
  UpdateLobby: "lobby:update",
  UpdateProfile: "profile:update",
  SendMessage: "chat:message",
  ReactToMessage: "chat:reaction",
  SubmitMove: "game:move",
  RotateBoard: "game:rotate",
  TransferHost: "lobby:transfer-host",
  RequestLobbySettingChange: "lobby:setting-request",
  DecideLobbySettingChange: "lobby:setting-request-decision",
} as const;

export const RealtimeServerEvent = {
  LobbyList: "lobby:list",
  LobbyUpdated: "lobby:updated",
  LobbyJoined: "lobby:joined",
  GameStart: "game:start",
  ChatMessage: "chat:message",
  ChatReaction: "chat:reaction",
  MoveAccepted: "game:move-accepted",
  MoveRejected: "game:move-rejected",
  BoardRotated: "game:board-rotated",
  Error: "lobby:error",
  ProfileUpdated: "profile:updated",
  HostTransferred: "lobby:host-transferred",
  LobbySettingRequested: "lobby:setting-requested",
  LobbySettingDecided: "lobby:setting-decided",
} as const;

export type RealtimeClientEvent =
  (typeof RealtimeClientEvent)[keyof typeof RealtimeClientEvent];
export type RealtimeServerEvent =
  (typeof RealtimeServerEvent)[keyof typeof RealtimeServerEvent];

export {
  type LobbyErrorPayload,
  type LobbySnapshot,
  type CreateLobbyRequest,
  type JoinLobbyRequest,
  type SetReadyRequest,
  type UpdateLobbyRequest,
  type ChatMessageRequest,
  type ChatMessageSnapshot,
  type ChatReactionRequest,
  type BoardSnapshot,
  type MoveRequest,
  type RotateBoardRequest,
  type MoveResponse,
  type ProfileDraft,
  type UserProfile,
  type LobbyPreset,
  type LobbySettingRequest,
  type LobbySettingDecisionRequest,
  type HostTransferRequest,
  type RequestLobbySettingChange,
  type LobbySettingRequestStatus,
  isHostTransferRequest,
  isLobbySettingDecisionRequest,
  isLobbySettingRequest,
};

export { isProfileDraft };

export function isCreateLobbyRequest(
  payload: unknown,
): payload is CreateLobbyRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<CreateLobbyRequest>;
  return (
    typeof data.name === "string" &&
    data.name.trim().length > 0 &&
    isProfileDraft(data.profile) &&
    isLobbySettings(data.settings)
  );
}

export function isJoinLobbyRequest(payload: unknown): payload is JoinLobbyRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<JoinLobbyRequest>;
  return typeof data.lobbyId === "string" && isProfileDraft(data.profile);
}

export function isLeaveLobbyRequest(
  payload: unknown,
): payload is { lobbyId: string } {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as { lobbyId?: unknown };
  return typeof data.lobbyId === "string" && data.lobbyId.trim().length > 0;
}

export function isReadyStateRequest(
  payload: unknown,
): payload is SetReadyRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<SetReadyRequest>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.isReady === "boolean"
  );
}

export function isUpdateLobbyRequest(
  payload: unknown,
): payload is UpdateLobbyRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<UpdateLobbyRequest>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.settings === "object"
  );
}

export function isSendMessageRequest(
  payload: unknown,
): payload is ChatMessageRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<ChatMessageRequest>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.content === "string" &&
    data.content.trim().length > 0
  );
}

export function isReactionRequest(
  payload: unknown,
): payload is ChatReactionRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<ChatReactionRequest>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.messageId === "string" &&
    data.messageId.trim().length > 0 &&
    typeof data.emoji === "string" &&
    data.emoji.trim().length > 0
  );
}

export function isMoveRequest(payload: unknown): payload is MoveRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<MoveRequest>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.playerId === "string" &&
    data.playerId.trim().length > 0 &&
    Number.isInteger(data.row) &&
    Number.isInteger(data.col) &&
    !!data.board &&
    typeof data.board === "object" &&
    Number.isInteger(data.board.size) &&
    Array.isArray(data.board.state)
  );
}

export function isRotateBoardRequest(
  payload: unknown,
): payload is RotateBoardRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<RotateBoardRequest>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.playerId === "string" &&
    data.playerId.trim().length > 0 &&
    data.action === "rotate" &&
    (data.degrees === 90 || data.degrees === 180 || data.degrees === 270) &&
    !!data.board &&
    typeof data.board === "object" &&
    Number.isInteger(data.board.size) &&
    Array.isArray(data.board.state)
  );
}
