import { XOXOBoard } from "./XOXOBoard.js";
import { GameSettings } from "./GameSettings.js";
import { GameResult } from "./GameResult.js";
import { MoveStatus, WinType, type Position } from "@shared/Common.js";
import { Logger } from "@shared/Logger.js";
import { EventActor } from "@events/EventTypes.js";

export const DIRECTIONS = {
  [WinType.Horizontal]: { dRow: 0, dCol: 1 },
  [WinType.Vertical]: { dRow: 1, dCol: 0 },
  [WinType.DiagonalMain]: { dRow: 1, dCol: 1 },
  [WinType.DiagonalAnti]: { dRow: 1, dCol: -1 },
};

export type DirectionType = Exclude<WinType, typeof WinType.Draw>;

export class XOXOGame {
  public board: XOXOBoard;
  public settings: GameSettings;
  public turn: number = 0;
  public isRunning: boolean = true;
  public result: GameResult | null = null;

  constructor(settings: GameSettings) {
    this.settings = settings;
    this.board = new XOXOBoard(settings.boardSize);
  }

  public makeMove(
    row: number,
    col: number,
    playerId: number,
    playerSymbol: string,
  ): MoveStatus {
    if (!this.isRunning) return MoveStatus.GAME_OVER;

    if (
      !this.board.isInsideBounds(row, col) ||
      this.board.getCell(row, col) !== 0
    ) {
      return MoveStatus.OCCUPIED;
    }

    this.board.setCell(row, col, playerId);
    this.turn++;

    this.result = this.checkWinOrDraw(row, col, playerId, playerSymbol);

    if (this.result !== null) {
      this.isRunning = false;
      return MoveStatus.GAME_OVER;
    }

    return MoveStatus.SUCCESS;
  }

  private checkWinOrDraw(
    row: number,
    col: number,
    playerId: number,
    playerSymbol: string,
  ): GameResult | null {
    for (const type in DIRECTIONS) {
      const result = this.checkDirection(
        row,
        col,
        type as DirectionType,
        playerId,
        playerSymbol,
      );
      if (result) return result;
    }

    if (this.board.isFull()) {
      return GameResult.createDraw();
    }

    return null;
  }

  private checkDirection(
    row: number,
    col: number,
    type: DirectionType,
    playerId: number,
    playerSymbol: string,
  ): GameResult | null {
    const { dRow, dCol } = DIRECTIONS[type];
    const line: Position[] = [{ row, col }];

    let r = row + dRow;
    let c = col + dCol;
    while (
      this.board.isInsideBounds(r, c) &&
      this.board.getCell(r, c) === playerId
    ) {
      line.push({ row: r, col: c });
      r += dRow;
      c += dCol;
    }

    r = row - dRow;
    c = col - dCol;
    while (
      this.board.isInsideBounds(r, c) &&
      this.board.getCell(r, c) === playerId
    ) {
      line.unshift({ row: r, col: c });
      r -= dRow;
      c -= dCol;
    }

    if (line.length >= this.settings.winCon) {
      Logger.log(EventActor.Game, `Win detected for player ${playerId}`);
      return GameResult.createWin(playerSymbol, type as WinType, line);
    }

    return null;
  }

  public getValidMoves(): { row: number; col: number }[] {
    const moves = [];
    for (let row = 0; row < this.board.size; row++) {
      for (let col = 0; col < this.board.size; col++) {
        if (this.board.getCell(row, col) === 0) {
          moves.push({ row, col });
        }
      }
    }
    return moves;
  }

  //(Setzt den Zustand des Boards nach dem check wieder zurück)
  public wouldWin(row: number, col: number, playerId: number): boolean {
    if (this.board.getCell(row, col) !== 0) return false;

    this.board.setCell(row, col, playerId);

    let win = false;
    for (const type in DIRECTIONS) {
      const { dRow, dCol } = DIRECTIONS[type as DirectionType];
      let count = 1;

      for (const factor of [1, -1]) {
        let r = row + dRow * factor;
        let c = col + dCol * factor;
        while (
          this.board.isInsideBounds(r, c) &&
          this.board.getCell(r, c) === playerId
        ) {
          count++;
          r += dRow * factor;
          c += dCol * factor;
        }
      }

      if (count >= this.settings.winCon) {
        win = true;
        break;
      }
    }

    this.board.setCell(row, col, 0);
    return win;
  }

  public getOpponentIds(myId: number): number[] {
    const opponents = new Set<number>();
    for (let i = 0; i < this.board.state.length; i++) {
      const id = this.board.state[i];
      if (id !== 0 && id !== myId) {
        opponents.add(id);
      }
    }
    return Array.from(opponents);
  }
}
