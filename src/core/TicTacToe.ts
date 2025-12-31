import { MoveStatus, WinType } from "../types/Common.js";
import { GameResult } from "./GameResult.js";

export const DIRECTIONS = {
  [WinType.Horizontal]: { dRow: 0, dCol: 1 },
  [WinType.Vertical]: { dRow: 1, dCol: 0 },
  [WinType.DiagonalMain]: { dRow: 1, dCol: 1 },
  [WinType.DiagonalAnti]: { dRow: 1, dCol: -1 },
};

export type DirectionType = Exclude<WinType, typeof WinType.Draw>;

export interface MoveResponse {
  MoveStatus: MoveStatus;
  gameResult: GameResult | null;
}

export default class TicTacToe {
  public size: number;
  public turn: number;
  public gameOver: boolean;
  public winCon: number;
  public board: (string | null)[][];

  constructor(size: number = 3, winCon: number = 3) {
    this.size = size;
    this.winCon = winCon;
    this.turn = 0;
    this.gameOver = false;
    this.board = [];
    this.createBoard();
  }

  createBoard() {
    this.board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(null),
    );
  }

  move(row: number, col: number, symbol: string): MoveResponse {
    if (this.gameOver) {
      return { MoveStatus: MoveStatus.GAME_OVER, gameResult: null };
    }
    if (this.board[row][col] !== null) {
      return { MoveStatus: MoveStatus.OCCUPIED, gameResult: null };
    }

    this.board[row][col] = symbol;
    this.turn++;

    const matchResult = this.isFinished(row, col);

    if (matchResult !== null) {
      this.gameOver = true;
      return {
        MoveStatus: MoveStatus.SUCCESS,
        gameResult: matchResult,
      };
    }

    return {
      MoveStatus: MoveStatus.SUCCESS,
      gameResult: null,
    };
  }
  isFinished(row: number, col: number): GameResult | null {
    for (const type in DIRECTIONS) {
      const result = this.checkDirection(row, col, type as DirectionType);

      if (result) return result;
    }

    if (this.turn >= this.getTotalCells()) {
      return GameResult.createDraw();
    }

    return null;
  }

  checkDirection(
    row: number,
    col: number,
    type: DirectionType,
  ): GameResult | null {
    const { dRow, dCol } = DIRECTIONS[type];

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
      return GameResult.createWin(symbol, type as WinType, line);
    }

    return null;
  }

  public resetGame() {
    this.createBoard();
    this.turn = 0;
    this.gameOver = false;
  }

  public clearBoard() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = null;
      }
    }
  }
  public displayBoardString() {
    let boardString = "";
    for (let row = 0; row < this.board.length; row++) {
      boardString += "\n";
      for (let col = 0; col < this.board[row].length; col++) {
        boardString += "  [" + this.board[row][col] + "]  ";
      }
    }
    console.log("Board Test:");
    console.log("Current turn:" + this.turn);
    console.log(boardString);
  }

  public displayBoardStringBetter() {
    console.log("Board Test:");
    console.log("Current turn:" + this.turn);
    console.table(this.board);
  }

  public getTotalCells(): number {
    return this.board.length * this.board.length;
  }

  public getBoardLength(): number {
    return this.board.length;
  }
  public getValidMoves(): { row: number; col: number }[] {
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
  public isValidMove(row: number, col: number): boolean {
    return this.board[row]?.[col] === null;
  }
}
