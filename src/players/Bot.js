import TicTacToe from "../core/TicTacToe.js";

/**
 * Bot player that selects moves based on the configured difficulty.
 */
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
    this.gameboard = new TicTacToe(testBoard);
  }

  /**
   * Returns the bot's next move based on its difficulty.
   * @returns {{row:number,col:number}|undefined}
   */
  getMove() {
    switch (this.difficulty) {
      case "easy":
        return this.getRandomMove();
      case "normal":
        break;
      case "hard":
        break;
      default:
        return this.getRandomMove();
    }
  }

  /**
   * Picks a random valid move from the current game board.
   * @returns {{row:number,col:number}}
   */
  getRandomMove() {
    validmoves = this.gameboard.getValidMoves();
    randomNum = Math.floor(Math.random() * (validmoves.length - 1));
    return validmoves[randomNum];
  }
}
