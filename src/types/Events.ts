import type { GameResult } from "../core/GameResult.ts";
import type { GameSettings } from "../core/GameSettings.ts";
import type { Difficulty, PlayerSymbol, Position } from "./Common.js";

export interface GameEventMap {
  "ui:cell-clicked": Position;
  "ui:reset-requested": void;
  "ui:settings-change-requested": GameSettings;
  "ui:difficulty-changed": Difficulty;

  "game:board-state": { grid: (string | null)[][] };
  "game:move-made": {
    row: number;
    col: number;
    symbol: PlayerSymbol;
    turn: number;
    nextPlayerSymbol: PlayerSymbol;
  };
  "game:finished": GameResult;
  "game:reset": { turn: number; nextPlayerSymbol: PlayerSymbol };
  "game:settings-changed": GameSettings;

  "sys:error": { message: string; code?: number };
}
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
