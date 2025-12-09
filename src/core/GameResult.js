export class GameResult {
  static TYPES = {
    HORIZONTAL: "horizontal",
    VERTICAL: "vertical",
    DIAGONAL_MAIN: "diag-main",
    DIAGONAL_ANTI: "diag-anti",
    DRAW: "draw",
  };

  /*
   *
   * @param {string|null} winner
   * @param {string} type
   * @param {Array<{row:number,col:number}>} positions
   */
  constructor(winner, type, positions = []) {
    this.winner = winner;
    this.type = type;
    this.positions = positions;
    Object.freeze(this);
  }

  static createWin(winner, type, positions) {
    return new GameResult(winner, type, positions);
  }

  static createDraw() {
    return new GameResult(null, GameResult.TYPES.DRAW, []);
  }
}
