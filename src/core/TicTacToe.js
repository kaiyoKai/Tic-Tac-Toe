import { GameResult } from "../core/GameResult.js";
/**
 * Core Tic-Tac-Toe board logic including move validation and win detection.
 */
export default class TicTacToe {
  /**
   * @param {number} [size]
   * @param {number} [winCon]
   */
  constructor(size = 3, winCon = 3) {
    this.size = size;
    this.createBoard();
    this.turn = 0;
    this.gameOver = false;
    this.winCon = winCon;
  }

  static MOVE_STATUS = {
    SUCCESS: "SUCCESS",
    OCCUPIED: "OCCUPIED",
    GAME_OVER: "GAME_OVER",
    NOT_YOUR_TURN: "NOT_YOUR_TURN", // Falls du das später brauchst
  };

  /**
   * Builds the board matrix with null entries.
   */
  createBoard() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null),
    );
  }

  /**
   * Applies a move on the board and checks for a winning state.
   * @param {number} row
   * @param {number} col
   * @param {string} symbol
   * @returns {GameResult|null|undefined}
   */
  move(row, col, symbol) {
    if (this.gameOver) {
      return { status: TicTacToe.MOVE_STATUS.GAME_OVER, gameResult: null };
    }
    if (this.board[row][col] !== null) {
      return { status: TicTacToe.MOVE_STATUS.OCCUPIED, gameResult: null };
    }

    this.board[row][col] = symbol;
    this.turn++;

    const matchResult = this.isFinished(row, col);

    // Fall A: Spiel ist vorbei (Sieg oder Draw)
    if (matchResult !== null) {
      this.gameOver = true;
      return {
        status: TicTacToe.MOVE_STATUS.SUCCESS,
        gameResult: matchResult,
      };
    }

    // Fall B: Spiel geht weiter
    return {
      status: TicTacToe.MOVE_STATUS.SUCCESS,
      gameResult: null,
    };
  }
  // TicTacToe.js

  static DIRECTIONS = {
    [GameResult.TYPES.HORIZONTAL]: { dRow: 0, dCol: 1 },
    [GameResult.TYPES.VERTICAL]: { dRow: 1, dCol: 0 },
    [GameResult.TYPES.DIAGONAL_MAIN]: { dRow: 1, dCol: 1 },
    [GameResult.TYPES.DIAGONAL_ANTI]: { dRow: 1, dCol: -1 },
  };

  isFinished(row, col) {
    // Wir gehen alle definierten Typen durch
    for (const type in TicTacToe.DIRECTIONS) {
      // Und rufen die Prüfung nur mit dem Namen auf
      const result = this.checkDirection(row, col, type);

      if (result) return result;
    }

    if (this.turn >= this.getTotalCells()) {
      return GameResult.createDraw();
    }

    return null;
  }
  checkDirection(row, col, type) {
    const { dRow, dCol } = TicTacToe.DIRECTIONS[type];

    const symbol = this.board[row][col];
    if (!symbol) return null;

    const line = [{ row, col }];
    const boardLength = this.getBoardLength();

    // forwards
    let r = row + dRow;
    let c = col + dCol;
    while (
      r >= 0 &&
      r < boardLength &&
      c >= 0 &&
      c < boardLength &&
      this.board[r][c] === symbol
    ) {
      line.push({ row: r, col: c });
      r += dRow;
      c += dCol;
    }

    // backwards
    r = row - dRow;
    c = col - dCol;
    while (
      r >= 0 &&
      r < boardLength &&
      c >= 0 &&
      c < boardLength &&
      this.board[r][c] === symbol
    ) {
      line.unshift({ row: r, col: c });
      r -= dRow;
      c -= dCol;
    }

    if (line.length >= this.winCon) {
      return GameResult.createWin(symbol, type, line);
    }

    return null;
  }

  /**
   * Restores the board to start a new game without changing settings.
   */
  resetGame() {
    this.createBoard();
    this.turn = 0;
    this.gameOver = false;
  }

  /**
   * Clears every cell to null while keeping the current board object.
   */
  clearBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = null;
      }
    }
  }

  /**
   * Logs the board state as a formatted string.
   */
  displayBoardString() {
    let boardString = "";
    for (let row = 0; row < this.board.length; row++) {
      boardString += "\n";
      for (let col = 0; col < this.board[row].length; col++) {
        boardString += "  [" + this.board[row][col] + "]  ";
      }
    }
    console.log("Bord Test:");
    console.log("Current turn:" + this.turn);
    console.log(boardString);
  }

  /**
   * Logs the board with console.table for easier debugging.
   */
  displayBoardStringBetter() {
    console.log("Bord Test:");
    console.log("Current turn:" + this.turn);
    console.table(this.board);
  }

  /**
   * Computes the total number of cells on the board.
   * @returns {number}
   */
  getTotalCells() {
    return this.board.length * this.board.length;
  }

  /**
   * Returns the board length (size) dimension.
   * @returns {number}
   */
  getBoardLength() {
    return this.board.length;
  }

  /**
   * Lists coordinates that are still available for play.
   * @returns {Array<{row: number, col: number}>}
   */
  getValidMoves() {
    const moves = [];
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === null) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  /**
   * Checks whether a move can be placed at the given coordinates.
   * @param {number} row
   * @param {number} col
   * @returns {boolean}
   */
  isValidMove(row, col) {
    return this.board[row][col] === null;
  }
}
