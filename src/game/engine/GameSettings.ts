import { Difficulty, GameMode } from "@shared/Common.js";

export class GameSettings {
  constructor(
    public mode: GameMode = GameMode.Local,
    public boardSize: number = 3,
    public winCon: number = 3,
    public difficulty: Difficulty = Difficulty.Medium,
    public gravityEnabled: boolean = false,
    public rotationEnabled: boolean = false,
    public moveTimeoutMs: number = 0,
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
    if (!Number.isInteger(this.moveTimeoutMs) || this.moveTimeoutMs < 0) {
      this.moveTimeoutMs = 0;
    }
  }
}
