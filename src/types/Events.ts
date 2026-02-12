import type { GameResult } from "../core/GameResult.ts";
import type { GameSettings } from "../core/GameSettings.ts";
import type { Difficulty, Position } from "./Common.js";

export interface GameEventMap {
  "ui:cell-clicked": Position;
  "ui:reset-requested": void;
  "ui:settings-change-requested": GameSettings;
  "ui:difficulty-changed": Difficulty;

  "game:board-state": { grid: (string | null)[][] };
  "game:move-made": {
    row: number;
    col: number;
    symbol: string;
    turn: number;
    nextPlayerSymbol: string;
  };
  "game:finished": GameResult;
  "game:reset": { turn: number; nextPlayerSymbol: string };
  "game:settings-changed": GameSettings;

  "sys:error": { message: string; code?: number };
}
