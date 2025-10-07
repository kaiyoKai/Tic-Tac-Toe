export default class TicTacToe {
  constructor(size = 3, winCon = 3) {
    this.size = size;
    this.createBoard();
    this.turn = 0;
    this.gameOver = false;
    this.winCon = winCon;
  }
  createBoard() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null),
    );
  }

  move(row, col, symbol) {
    if (this.gameOver) return;
    if (this.board[row][col] !== null) {
      return false; //do nothing since field is already occupied :)
    }

    this.board[row][col] = symbol;
    this.turn++;

    let result = this.isFinished(row, col);
    if (result !== null) {
      this.gameOver = true;
      return result;
    }

    return null;
  }
  static directions = {
    row: { dRow: 0, dCol: 1 },
    col: { dRow: 1, dCol: 0 },
    diagRight: { dRow: 1, dCol: 1 },
    diagLeft: { dRow: 1, dCol: -1 },
  };

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

  checkDirection(row, col, directionKey) {
    const symbol = this.board[row][col];
    if (!symbol) return false;

    const { dRow, dCol } = TicTacToe.directions[directionKey];

    let line = [{ row, col }];
    const N = this.getBoardLength();

    // forwards
    let r = row + dRow;
    let c = col + dCol;
    while (r >= 0 && r < N && c >= 0 && c < N && this.board[r][c] === symbol) {
      line.push({ row: r, col: c });
      r += dRow;
      c += dCol;
    }

    // backwards
    r = row - dRow;
    c = col - dCol;
    while (r >= 0 && r < N && c >= 0 && c < N && this.board[r][c] === symbol) {
      line.unshift({ row: r, col: c });
      r -= dRow;
      c -= dCol;
    }

    if (line.length >= this.winCon) {
      return new GameResult(symbol, directionKey, line);
    }
  }
  resetGame() {
    this.createBoard();
    this.turn = 0;
    this.gameOver = false;
  }

  clearBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = null;
      }
    }
  }

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

  //What i did manually before but objectively better <3
  displayBoardStringBetter() {
    console.log("Bord Test:");
    console.log("Current turn:" + this.turn);
    console.table(this.board);
  }

  getTotalCells() {
    return this.board.length * this.board.length;
  }

  getBoardLength() {
    return this.board.length;
  }

  getValidMoves() {
    let moves = [];
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === null) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }
  isValidMove(row, col) {
    return this.board[row][col] === null;
  }
}

class GameResult {
  constructor(winner, type, positions) {
    this.winner = winner;
    this.type = type;
    this.positions = positions;
  }
}
