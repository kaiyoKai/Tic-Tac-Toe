import { Difficulty, GameMode } from "../types/Common.js";

export class GameSettings {
  constructor(
    public mode: GameMode = GameMode.Local,
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
