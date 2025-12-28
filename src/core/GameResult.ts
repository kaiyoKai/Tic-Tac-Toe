import type { Position } from "./IPosition.ts";
export const WinType = {
  Horizontal: "horizontal",
  Vertical: "vertical",
  DiagonalMain: "diag-main",
  DiagonalAnti: "diag-anti",
  Draw: "draw",
} as const;

export type WinType = (typeof WinType)[keyof typeof WinType];

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
