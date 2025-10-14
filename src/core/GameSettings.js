/**
 * Encapsulates game configuration such as mode, board size, and win condition.
 */
export class GameSettings {
  /**
   * @param {"local"|"bot"|"online"} [mode]
   * @param {number} [boardSize]
   * @param {number} [winCon]
   */
  constructor(mode = "local", boardSize = 3, winCon = 3) {
    this.mode = mode;
    this.boardSize = boardSize;
    this.winCon = winCon;
  }

  /**
   * Checks if the current configuration is valid for play.
   * @returns {boolean}
   */
  isValid() {
    return this.winCon <= this.boardSize;
  }
  /**
   * Adjusts invalid values to the nearest valid configuration.
   */
  fixInvalidValues() {
    if (!this.isValid()) this.winCon = this.boardSize;
  }
}
