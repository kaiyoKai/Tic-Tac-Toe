import { WinType, type Position } from "../types/Common.js";

export class GameResult {
  private constructor(
    public readonly winner: string | null,
    public readonly type: WinType,
    public readonly positions: Position[],
  ) {
    this.winner = winner;
    this.type = type;
    this.positions = positions;
    Object.freeze(this);
  }

  static createWin(
    winner: string,
    type: WinType,
    positions: Position[],
  ): GameResult {
    return new GameResult(winner, type, positions);
  }

  static createDraw(): GameResult {
    return new GameResult(null, WinType.Draw, []);
  }
}
