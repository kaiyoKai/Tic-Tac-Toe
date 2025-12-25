import TicTacToe from "../core/TicTacToe.js";

export class Bot {
  /**
   * @param {"easy"|"normal"|"hard"} difficulty
   * @param {string} symbol
   * @param {TicTacToe} gameboard
   */
  constructor(difficulty, symbol, gameboard) {
    this.difficulty = difficulty;
    this.symbol = symbol;
    this.gameboard = gameboard;
  }

  /**
   * @returns {{row:number,col:number}|undefined}
   */
  getMove() {
    switch (this.difficulty) {
      case "easy":
        return this.getRandomMove();
      case "normal":
        return this.getRandomMove();
      case "hard":
        return this.getRandomMove();
      default:
        return this.getRandomMove();
    }
  }

  getRandomMove() {
    const validmoves = this.gameboard.getValidMoves();

    if (validmoves.length === 0) return undefined;

    const randomNum = Math.floor(Math.random() * validmoves.length);

    return validmoves[randomNum];
  }
}
