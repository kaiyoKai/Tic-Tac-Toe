import { Difficulty } from "../players/Bot.ts";
import type { Position } from "./IPosition.ts";
export type Mode = "local" | "bot" | "online";

export class GameSettings {
  constructor(
    public mode: Mode = "local",
    public boardSize: number = 3,
    public winCon: number = 3,
    public difficulty: Difficulty = Difficulty.Medium,
  ) {
    this.fixInvalidValues();
  }

  isValid(): boolean {
    return this.winCon <= this.boardSize;
  }

  fixInvalidValues(): void {
    if (!this.isValid()) {
      this.winCon = this.boardSize;
    }
  }
}
