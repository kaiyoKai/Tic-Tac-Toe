import TicTacToe from "./TicTacToe.js";

export class Bot {
  constructor(difficulty, symbol, gameboard) {
    this.difficulty = difficulty;
    this.symbol = symbol;
    this.gameboard = gameboard;
    this.gameboard = new TicTacToe(testBoard);
  }

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

  getRandomMove() {
    validmoves = this.gameboard.getValidMoves();
    randomNum = Math.floor(Math.random() * (validmoves.length - 1));
    return validmoves[randomNum];
  }
}
