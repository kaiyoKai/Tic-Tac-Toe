export const RealtimeClientEvent = {
  ListLobbies: "lobby:list",
  CreateLobby: "lobby:create",
  JoinLobby: "lobby:join",
  LeaveLobby: "lobby:leave",
  SetReady: "lobby:ready",
} as const;

export const RealtimeServerEvent = {
  LobbyList: "lobby:list",
  LobbyUpdated: "lobby:updated",
  LobbyJoined: "lobby:joined",
  GameStart: "game:start",
  Error: "lobby:error",
} as const;

export type RealtimeClientEvent =
  (typeof RealtimeClientEvent)[keyof typeof RealtimeClientEvent];
export type RealtimeServerEvent =
  (typeof RealtimeServerEvent)[keyof typeof RealtimeServerEvent];

export interface LobbyPlayer {
  id: string;
  username: string;
  isReady: boolean;
}

export interface LobbySnapshot {
  id: string;
  name: string;
  maxPlayers: number;
  status: "waiting" | "in-game";
  players: LobbyPlayer[];
}

export interface CreateLobbyRequest {
  name: string;
  username: string;
  maxPlayers?: number;
}

export interface JoinLobbyRequest {
  lobbyId: string;
  username: string;
}

export interface LeaveLobbyRequest {
  lobbyId: string;
}

export interface ReadyStateRequest {
  lobbyId: string;
  isReady: boolean;
}

export interface LobbyErrorPayload {
  message: string;
  code:
    | "INVALID_PAYLOAD"
    | "LOBBY_NOT_FOUND"
    | "LOBBY_FULL"
    | "PLAYER_NOT_FOUND";
}

export interface GameStartPayload {
  lobbyId: string;
  startedAt: number;
  playerOrder: string[];
}

export function isCreateLobbyRequest(
  payload: unknown,
): payload is CreateLobbyRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<CreateLobbyRequest>;
  return (
    typeof data.name === "string" &&
    data.name.trim().length > 0 &&
    typeof data.username === "string" &&
    data.username.trim().length > 0 &&
    (typeof data.maxPlayers === "undefined" ||
      (Number.isInteger(data.maxPlayers) &&
        (data.maxPlayers ?? 0) >= 2 &&
        (data.maxPlayers ?? 0) <= 8))
  );
}

export function isJoinLobbyRequest(payload: unknown): payload is JoinLobbyRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<JoinLobbyRequest>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.username === "string" &&
    data.username.trim().length > 0
  );
}

export function isLeaveLobbyRequest(
  payload: unknown,
): payload is LeaveLobbyRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<LeaveLobbyRequest>;
  return typeof data.lobbyId === "string" && data.lobbyId.trim().length > 0;
}

export function isReadyStateRequest(
  payload: unknown,
): payload is ReadyStateRequest {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<ReadyStateRequest>;
  return (
    typeof data.lobbyId === "string" &&
    data.lobbyId.trim().length > 0 &&
    typeof data.isReady === "boolean"
  );
}
