import type { PlayerSymbol } from "@shared/Common.js";

export const ConnectionStatus = {
  Offline: "offline",
  Pending: "pending",
  ConnectedGlobal: "connected_global",
  InOnlineLobby: "in_online_lobby",
} as const;

export type ConnectionStatus =
  (typeof ConnectionStatus)[keyof typeof ConnectionStatus];

export const LobbyParticipantRole = {
  Host: "host",
  Player: "player",
  Local: "local",
  Bot: "bot",
  Spectator: "spectator",
} as const;

export type LobbyParticipantRole =
  (typeof LobbyParticipantRole)[keyof typeof LobbyParticipantRole];

export interface LobbyParticipantBase {
  id: string;
  username: string;
  symbol: PlayerSymbol;
  seatIndex: number;
  isReady: boolean;
}

export interface LobbyPlayer extends LobbyParticipantBase {
  role:
    | typeof LobbyParticipantRole.Host
    | typeof LobbyParticipantRole.Player
    | typeof LobbyParticipantRole.Local;
}

export interface LobbyBot extends LobbyParticipantBase {
  role: typeof LobbyParticipantRole.Bot;
}

export interface LobbySpectator extends LobbyParticipantBase {
  role: typeof LobbyParticipantRole.Spectator;
}

export type LobbyParticipant = LobbyPlayer | LobbyBot | LobbySpectator;

export interface ConnectionStateSnapshot {
  status: ConnectionStatus;
  activeLobbyId: string | null;
  hasConnectedOnce: boolean;
  canUseOnlineActions: boolean;
  chatLabel: string;
}

export const ToastScope = {
  Connection: "connection",
  GlobalChat: "global_chat",
  Lobby: "lobby",
} as const;

export type ToastScope = (typeof ToastScope)[keyof typeof ToastScope];

export const ToastEvent = {
  FirstConnected: "first_connected",
  UserJoined: "user_joined",
  UserLeft: "user_left",
  SelfJoined: "self_joined",
} as const;

export type ToastEvent = (typeof ToastEvent)[keyof typeof ToastEvent];
