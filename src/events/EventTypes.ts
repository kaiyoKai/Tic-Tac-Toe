import type { GameResult } from "@engine/GameResult.ts";
import type { GameSettings } from "@engine/GameSettings.ts";
import type {
  Difficulty,
  PlayerSymbol,
  Position,
  User,
} from "@shared/Common.js";
import type { ThemeKey } from "@ui/Theme.ts";

export const AppEvent = {
  UI: {
    CellClicked: "ui:cell-clicked",
    ResetRequested: "ui:reset-requested",
    SettingsChangeRequested: "ui:settings-change-requested",
    DifficultyChanged: "ui:difficulty-changed",
    ThemeChanged: "ui:theme-changed",
    ButtonShapeChanged: "ui:shape-changed",
    ProfileChangeRequested: "ui:profile-changeRequested",
  },
  Game: {
    BoardState: "game:board-state",
    MoveMade: "game:move-made",
    Finished: "game:finished",
    Reset: "game:reset",
    SettingsChanged: "game:settings-changed",
  },
  Sys: {
    Error: "sys:error",
  },
  Chat: {
    MessageSent: "chat:message-sent",
  },
} as const;

export interface UIEventMap {
  [AppEvent.UI.CellClicked]: Position;
  [AppEvent.UI.ResetRequested]: void;
  [AppEvent.UI.SettingsChangeRequested]: GameSettings;
  [AppEvent.UI.DifficultyChanged]: Difficulty;
  [AppEvent.UI.ThemeChanged]: ThemeKey;
  [AppEvent.UI.ButtonShapeChanged]: "50%" | "5%";
  [AppEvent.UI.ProfileChangeRequested]: User;
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
  [AppEvent.Game.Finished]: GameResult;
  [AppEvent.Game.Reset]: { turn: number; nextPlayerSymbol: PlayerSymbol };
  [AppEvent.Game.SettingsChanged]: GameSettings;
}

export type GlobalEventMap = UIEventMap &
  GameEventMap & {
    [AppEvent.Sys.Error]: { message: string; code?: number };
    [AppEvent.Chat.MessageSent]: { message: string };
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
