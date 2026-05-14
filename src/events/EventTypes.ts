import type { GameResult } from "@engine/GameResult.ts";
import type { GameSettings } from "@engine/GameSettings.ts";
import type {
  Difficulty,
  PlayerSymbol,
  Position,
} from "@shared/Common.js";
import type { ThemeKey } from "@ui/Theme.ts";
import type { UserProfile } from "@shared/contracts/ProfileContracts.js";
import type {
  CreateLobbyRequest,
  JoinLobbyRequest,
  LobbySettings,
  LobbySnapshot,
  SetReadyRequest,
  UpdateLobbyRequest,
} from "@shared/contracts/LobbyContracts.js";
import type {
  ChatMessageRequest,
  ChatMessageSnapshot,
  ChatReactionRequest,
} from "@shared/contracts/ChatContracts.js";
import type {
  BoardSnapshot,
  MoveRequest,
  MoveResponse,
} from "@shared/contracts/GameContracts.js";

export const AppEvent = {
  UI: {
    CellClicked: "ui:cell-clicked",
    ResetRequested: "ui:reset-requested",
    SettingsChangeRequested: "ui:settings-change-requested",
    DifficultyChanged: "ui:difficulty-changed",
    ThemeChanged: "ui:theme-changed",
    ButtonShapeChanged: "ui:shape-changed",
    ProfileChangeRequested: "ui:profile-change-requested",
    DialogOpenRequested: "ui:dialog-open-requested",
    GameStartRequested: "ui:game-start-requested",
    AppEndRequested: "ui:app-end-reqeusted",
    ToastRequested: "ui:toast-requested",
    LobbyCreateRequested: "ui:lobby-create-requested",
    LobbyJoinRequested: "ui:lobby-join-requested",
    LobbyListRefreshRequested: "ui:lobby-list-refresh-requested",
    LobbiesUpdated: "ui:lobbies-updated",
    LobbySettingsChanged: "ui:lobby-settings-changed",
  },
  Game: {
    BoardState: "game:board-state",
    MoveMade: "game:move-made",
    MoveRequested: "game:move-requested",
    MoveApplied: "game:move-applied",
    MoveRejected: "game:move-rejected",
    Finished: "game:finished",
    Reset: "game:reset",
    SettingsChanged: "game:settings-changed",
    Start: "game:start",
    BoardSnapshotUpdated: "game:board-snapshot-updated",
  },
  Sys: {
    Error: "sys:error",
  },
  Chat: {
    MessageSent: "chat:message-sent",
    MessageReceived: "chat:message-received",
    MessageReactionRequested: "chat:reaction-requested",
    MessageReactionReceived: "chat:reaction-received",
  },
} as const;

export interface UIEventMap {
  [AppEvent.UI.CellClicked]: Position;
  [AppEvent.UI.ResetRequested]: void;
  [AppEvent.UI.SettingsChangeRequested]: GameSettings;
  [AppEvent.UI.DifficultyChanged]: Difficulty;
  [AppEvent.UI.ThemeChanged]: ThemeKey;
  [AppEvent.UI.ButtonShapeChanged]: "50%" | "5%";
  [AppEvent.UI.ProfileChangeRequested]: UserProfile;
  [AppEvent.UI.DialogOpenRequested]: string;
  [AppEvent.UI.GameStartRequested]: GameSettings;
  [AppEvent.UI.AppEndRequested]: void;
  [AppEvent.UI.ToastRequested]: {
    message: string;
    type?: "info" | "warning" | "success";
  };
  [AppEvent.UI.LobbyCreateRequested]: CreateLobbyRequest;
  [AppEvent.UI.LobbyJoinRequested]: JoinLobbyRequest;
  [AppEvent.UI.LobbyListRefreshRequested]: void;
  [AppEvent.UI.LobbiesUpdated]: LobbySnapshot[];
  [AppEvent.UI.LobbySettingsChanged]: Partial<LobbySettings>;
}

export interface GameEventMap {
  [AppEvent.Game.BoardState]: { grid: (string | null)[][] };
  [AppEvent.Game.MoveMade]: {
    row: number;
    col: number;
    symbol: PlayerSymbol;
    turn: number;
    nextPlayerSymbol: PlayerSymbol;
    grid: (string | null)[][];
  };
  [AppEvent.Game.MoveRequested]: MoveRequest;
  [AppEvent.Game.MoveApplied]: MoveResponse;
  [AppEvent.Game.MoveRejected]: MoveResponse;
  [AppEvent.Game.Finished]: GameResult;
  [AppEvent.Game.Reset]: {
    turn: number;
    nextPlayerSymbol: PlayerSymbol;
    settings: GameSettings;
  };
  [AppEvent.Game.SettingsChanged]: GameSettings;
  [AppEvent.Game.Start]: {
    turn: number;
    nextPlayerSymbol: PlayerSymbol;
    settings: GameSettings;
  };
  [AppEvent.Game.BoardSnapshotUpdated]: BoardSnapshot;
}

export type GlobalEventMap = UIEventMap &
  GameEventMap & {
    [AppEvent.Sys.Error]: { message: string; code?: number };
    [AppEvent.Chat.MessageSent]: ChatMessageSnapshot;
    [AppEvent.Chat.MessageReceived]: ChatMessageSnapshot;
    [AppEvent.Chat.MessageReactionRequested]: ChatReactionRequest;
    [AppEvent.Chat.MessageReactionReceived]: ChatMessageSnapshot;
  };

export const EventActor = {
  Controller: "controller",
  WebUI: "webui",
  LocalPlayer: "localPlayer",
  Game: "game",
  Anonymous: "anonymous",
  Bot: "bot",
  Bus: "bus",
} as const;

export type EventActor = (typeof EventActor)[keyof typeof EventActor];
