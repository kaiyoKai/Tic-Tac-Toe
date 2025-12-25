export enum WinType {
  Horizontal = "horizontal",
  Vertical = "vertical",
  DiagonalMain = "diag-main",
  DiagonalAnti = "diag-anti",
  Draw = "draw",
}

export interface Position {
  row: number;
  col: number;
}

export class GameResult {
  public readonly winner: string | null;
  public readonly type: WinType;
  public readonly positions: Position[];

  private constructor(
    winner: string | null,
    type: WinType,
    positions: Position[] = [],
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
