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
    if (this.gameOver) return;
    if (this.board[row][col] !== null) return; // do nothing since field is already occupied :)
    this.board[row][col] = symbol;
    this.turn++;

    const result = this.isFinished(row, col);
    if (result !== null) {
      this.gameOver = true;
      return result;
    }

    return null;
  }

  /** @type {Record<string, {dRow: number, dCol: number}>} */
  static directions = {
    row: { dRow: 0, dCol: 1 },
    col: { dRow: 1, dCol: 0 },
    diagRight: { dRow: 1, dCol: 1 },
    diagLeft: { dRow: 1, dCol: -1 },
  };

  /**
   * Evaluates whether the last move ended the game.
   * @param {number} row
   * @param {number} col
   * @returns {GameResult|null}
   */
  isFinished(row, col) {
    for (const key in TicTacToe.directions) {
      const result = this.checkDirection(row, col, key);
      if (result) return result;
    }
    if (this.turn >= this.getTotalCells()) {
      return new GameResult(null, "draw", []);
    }

    return null;
  }

  /**
   * Checks contiguous tiles in a direction to find a win.
   * @param {number} row
   * @param {number} col
   * @param {keyof typeof TicTacToe.directions} directionKey
   * @returns {GameResult|false|undefined}
   */
  checkDirection(row, col, directionKey) {
    const symbol = this.board[row][col];
    if (!symbol) return false;

    const { dRow, dCol } = TicTacToe.directions[directionKey];

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
      return new GameResult(symbol, directionKey, line);
    }
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

/**
 * Represents the outcome of a completed game sequence.
 */
class GameResult {
  /**
   * @param {string|null} winner
   * @param {string} type
   * @param {Array<{row:number,col:number}>} positions
   */
  constructor(winner, type, positions) {
    this.winner = winner;
    this.type = type;
    this.positions = positions;
  }
}
