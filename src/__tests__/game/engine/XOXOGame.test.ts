import { describe, it, expect, beforeEach } from "vitest";
import { XOXOGame } from "@engine/XOXOGame";
import { GameSettings } from "@engine/GameSettings";
import { MoveStatus, WinType } from "@shared/Common";
import { assertPlayerSymbol } from "@shared/Common";

describe("XOXOGame", () => {
  let game: XOXOGame;
  const settings = new GameSettings();
  const playerX = assertPlayerSymbol("X");
  const playerO = assertPlayerSymbol("O");

  beforeEach(() => {
    game = new XOXOGame(settings);
  });

  describe("initialization", () => {
    it("should initialize with correct settings", () => {
      expect(game.settings).toBe(settings);
      expect(game.board.size).toBe(3);
      expect(game.turn).toBe(0);
      expect(game.isRunning).toBe(true);
      expect(game.result).toBe(null);
    });

    it("should create a board matching settings", () => {
      const customSettings = new GameSettings(
        undefined,
        5,
        5,
      );
      const customGame = new XOXOGame(customSettings);
      expect(customGame.board.size).toBe(5);
    });
  });

  describe("makeMove", () => {
    it("should make a valid move", () => {
      const status = game.makeMove(0, 0, 1, playerX);
      expect(status).toBe(MoveStatus.SUCCESS);
      expect(game.board.getCell(0, 0)).toBe(1);
      expect(game.turn).toBe(1);
    });

    it("should reject move on occupied cell", () => {
      game.makeMove(1, 1, 1, playerX);
      const status = game.makeMove(1, 1, 2, playerO);
      expect(status).toBe(MoveStatus.OCCUPIED);
      expect(game.turn).toBe(1); // Turn doesn't increase
    });

    it("should reject move outside bounds", () => {
      const status = game.makeMove(-1, 0, 1, playerX);
      expect(status).toBe(MoveStatus.OCCUPIED);
      expect(game.turn).toBe(0);
    });

    it("should reject move outside upper bounds", () => {
      const status = game.makeMove(3, 3, 1, playerX);
      expect(status).toBe(MoveStatus.OCCUPIED);
    });

    it("should reject move when game is over", () => {
      // Setup a win condition
      game.makeMove(0, 0, 1, playerX);
      game.makeMove(1, 0, 2, playerO);
      game.makeMove(0, 1, 1, playerX);
      game.makeMove(1, 1, 2, playerO);
      game.makeMove(0, 2, 1, playerX); // X wins horizontally

      const status = game.makeMove(2, 2, 2, playerO);
      expect(status).toBe(MoveStatus.GAME_OVER);
    });
  });

  describe("horizontal win detection", () => {
    it("should detect horizontal win at top row", () => {
      game.makeMove(0, 0, 1, playerX);
      game.makeMove(1, 0, 2, playerO);
      game.makeMove(0, 1, 1, playerX);
      game.makeMove(1, 1, 2, playerO);
      const status = game.makeMove(0, 2, 1, playerX);

      expect(status).toBe(MoveStatus.GAME_OVER);
      expect(game.isRunning).toBe(false);
      expect(game.result).not.toBe(null);
      expect(game.result?.winner).toBe(playerX);
      expect(game.result?.type).toBe(WinType.Horizontal);
    });

    it("should detect horizontal win at middle row", () => {
      game.makeMove(0, 0, 2, playerO);
      game.makeMove(1, 0, 1, playerX);
      game.makeMove(0, 1, 2, playerO);
      game.makeMove(1, 1, 1, playerX);
      game.makeMove(2, 2, 2, playerO);
      const status = game.makeMove(1, 2, 1, playerX);

      expect(status).toBe(MoveStatus.GAME_OVER);
      expect(game.result?.type).toBe(WinType.Horizontal);
    });

    it("should detect horizontal win at bottom row", () => {
      game.makeMove(0, 0, 2, playerO);
      game.makeMove(2, 0, 1, playerX);
      game.makeMove(0, 1, 2, playerO);
      game.makeMove(2, 1, 1, playerX);
      game.makeMove(0, 2, 2, playerO);
      const status = game.makeMove(2, 2, 1, playerX);

      expect(status).toBe(MoveStatus.GAME_OVER);
      expect(game.result?.type).toBe(WinType.Horizontal);
    });
  });

  describe("vertical win detection", () => {
    it("should detect vertical win at left column", () => {
      game.makeMove(0, 0, 1, playerX);
      game.makeMove(0, 1, 2, playerO);
      game.makeMove(1, 0, 1, playerX);
      game.makeMove(0, 2, 2, playerO);
      const status = game.makeMove(2, 0, 1, playerX);

      expect(status).toBe(MoveStatus.GAME_OVER);
      expect(game.result?.type).toBe(WinType.Vertical);
    });

    it("should detect vertical win at middle column", () => {
      game.makeMove(0, 0, 2, playerO);
      game.makeMove(0, 1, 1, playerX);
      game.makeMove(0, 2, 2, playerO);
      game.makeMove(1, 1, 1, playerX);
      game.makeMove(1, 0, 2, playerO);
      const status = game.makeMove(2, 1, 1, playerX);

      expect(status).toBe(MoveStatus.GAME_OVER);
      expect(game.result?.type).toBe(WinType.Vertical);
    });

    it("should detect vertical win at right column", () => {
      // Vertical win on right column (column 2): (0,2), (1,2), (2,2) for player 1
      game.makeMove(0, 0, 2, playerO); // Player 2 at (0,0)
      game.makeMove(0, 2, 1, playerX); // Player 1 at (0,2)
      game.makeMove(1, 0, 2, playerO); // Player 2 at (1,0)
      game.makeMove(1, 2, 1, playerX); // Player 1 at (1,2)
      game.makeMove(2, 0, 2, playerO); // Player 2 at (2,0)
      const status = game.makeMove(2, 2, 1, playerX); // Player 1 at (2,2) - wins vertically

      expect(status).toBe(MoveStatus.GAME_OVER);
      expect(game.result?.type).toBe(WinType.Vertical);
    });
  });

  describe("diagonal win detection", () => {
    it("should detect main diagonal win (top-left to bottom-right)", () => {
      game.makeMove(0, 0, 1, playerX);
      game.makeMove(0, 1, 2, playerO);
      game.makeMove(1, 1, 1, playerX);
      game.makeMove(0, 2, 2, playerO);
      const status = game.makeMove(2, 2, 1, playerX);

      expect(status).toBe(MoveStatus.GAME_OVER);
      expect(game.result?.type).toBe(WinType.DiagonalMain);
    });

    it("should detect anti-diagonal win (top-right to bottom-left)", () => {
      // Anti-diagonal for player 1: (0,2), (1,1), (2,0)
      game.makeMove(0, 0, 2, playerO);
      game.makeMove(0, 2, 1, playerX);
      game.makeMove(1, 0, 2, playerO);
      game.makeMove(1, 1, 1, playerX);
      game.makeMove(2, 2, 2, playerO);
      const status = game.makeMove(2, 0, 1, playerX);

      expect(status).toBe(MoveStatus.GAME_OVER);
      expect(game.result?.type).toBe(WinType.DiagonalAnti);
    });
  });

  describe("draw detection", () => {
    it("should detect draw when board is full with no winner", () => {
      // Pattern: X O X
      //          O X X
      //          O X O
      game.makeMove(0, 0, 1, playerX);
      game.makeMove(0, 1, 2, playerO);
      game.makeMove(0, 2, 1, playerX);
      game.makeMove(1, 0, 2, playerO);
      game.makeMove(1, 1, 1, playerX);
      game.makeMove(1, 2, 1, playerX);
      game.makeMove(2, 0, 2, playerO);
      game.makeMove(2, 1, 1, playerX);
      const status = game.makeMove(2, 2, 2, playerO);

      expect(status).toBe(MoveStatus.GAME_OVER);
      expect(game.result?.type).toBe(WinType.Draw);
      expect(game.result?.winner).toBe(null);
    });
  });

  describe("getValidMoves", () => {
    it("should return all cells for empty board", () => {
      const moves = game.getValidMoves();
      expect(moves).toHaveLength(9);
    });

    it("should exclude occupied cells", () => {
      game.makeMove(0, 0, 1, playerX);
      game.makeMove(1, 1, 2, playerO);
      const moves = game.getValidMoves();

      expect(moves).toHaveLength(7);
      expect(moves).not.toContainEqual({ row: 0, col: 0 });
      expect(moves).not.toContainEqual({ row: 1, col: 1 });
    });

    it("should return empty array for full board", () => {
      // Fill the board carefully to reach a draw state without triggering a win
      // Pattern: 1 2 1
      //          2 1 1
      //          2 1 2
      game.makeMove(0, 0, 1, playerX);
      game.makeMove(0, 1, 2, playerO);
      game.makeMove(0, 2, 1, playerX);
      game.makeMove(1, 0, 2, playerO);
      game.makeMove(1, 1, 1, playerX);
      game.makeMove(1, 2, 1, playerX);
      game.makeMove(2, 0, 2, playerO);
      game.makeMove(2, 1, 1, playerX);
      const lastMove = game.makeMove(2, 2, 2, playerO);

      // After filling all cells, no valid moves should exist
      const moves = game.getValidMoves();
      expect(moves).toHaveLength(0);
    });
  });

  describe("wouldWin", () => {
    it("should return true if move would result in win", () => {
      game.makeMove(0, 0, 1, playerX);
      game.makeMove(0, 1, 2, playerO);
      game.makeMove(1, 1, 1, playerX);
      game.makeMove(0, 2, 2, playerO);

      const wouldWin = game.wouldWin(2, 2, 1);
      expect(wouldWin).toBe(true);
    });

    it("should return false if move would not result in win", () => {
      game.makeMove(0, 0, 1, playerX);
      const wouldWin = game.wouldWin(2, 2, 2);
      expect(wouldWin).toBe(false);
    });

    it("should not modify board state", () => {
      game.makeMove(0, 0, 1, playerX);
      game.makeMove(1, 1, 1, playerX);
      const boardStateBefore = new Uint8Array(game.board.state);

      game.wouldWin(2, 2, 1);

      expect(game.board.state).toEqual(boardStateBefore);
    });

    it("should return false for occupied cell", () => {
      game.makeMove(0, 0, 1, playerX);
      const wouldWin = game.wouldWin(0, 0, 2);
      expect(wouldWin).toBe(false);
    });
  });

  describe("getOpponentIds", () => {
    it("should return empty array when no opponents", () => {
      game.makeMove(0, 0, 1, playerX);
      const opponents = game.getOpponentIds(1);
      expect(opponents).toEqual([]);
    });

    it("should return array of opponent IDs", () => {
      game.makeMove(0, 0, 1, playerX);
      game.makeMove(1, 1, 2, playerO);
      game.makeMove(2, 2, 3, assertPlayerSymbol("Z"));

      const opponents = game.getOpponentIds(1);
      expect(opponents).toContain(2);
      expect(opponents).toContain(3);
      expect(opponents).not.toContain(1);
    });

    it("should handle duplicate opponent IDs", () => {
      game.makeMove(0, 0, 2, playerO);
      game.makeMove(1, 1, 2, playerO);
      game.makeMove(2, 2, 1, playerX);

      const opponents = game.getOpponentIds(1);
      expect(opponents).toEqual([2]);
    });
  });

  describe("turn tracking", () => {
    it("should increment turn on each move", () => {
      expect(game.turn).toBe(0);
      game.makeMove(0, 0, 1, playerX);
      expect(game.turn).toBe(1);
      game.makeMove(1, 1, 2, playerO);
      expect(game.turn).toBe(2);
    });

    it("should not increment turn on invalid move", () => {
      game.makeMove(0, 0, 1, playerX);
      expect(game.turn).toBe(1);
      game.makeMove(0, 0, 2, playerO); // Same cell, invalid
      expect(game.turn).toBe(1);
    });
  });

  describe("gravity and rotation", () => {
    it("should apply gravity after moves when enabled", () => {
      const gravityGame = new XOXOGame(
        Object.assign(new GameSettings(), {
          gravityEnabled: true,
        }),
      );

      gravityGame.makeMove(0, 0, 1, playerX);
      expect(gravityGame.board.getCell(2, 0)).toBe(1);
      expect(gravityGame.board.getCell(0, 0)).toBe(0);
    });

    it("should stack moves in gravity mode", () => {
      const gravityGame = new XOXOGame(
        Object.assign(new GameSettings(), {
          gravityEnabled: true,
        }),
      );

      gravityGame.makeMove(0, 0, 1, playerX);
      gravityGame.makeMove(0, 1, 2, playerO);
      const status = gravityGame.makeMove(0, 2, 1, playerX);

      expect(status).toBe(MoveStatus.SUCCESS);
      expect(gravityGame.board.getCell(2, 0)).toBe(1);
      expect(gravityGame.board.getCell(2, 1)).toBe(2);
      expect(gravityGame.board.getCell(2, 2)).toBe(1);
    });

    it("should rotate and reapply gravity", () => {
      const transformGame = new XOXOGame(
        Object.assign(new GameSettings(undefined, 3, 3), {
          gravityEnabled: true,
          rotationEnabled: true,
        }),
      );

      transformGame.board.setCell(0, 0, 1);
      transformGame.board.setCell(1, 1, 2);
      transformGame.board.setCell(2, 0, 1);

      const status = transformGame.rotateBoard(90);

      expect(status).toBe(MoveStatus.SUCCESS);
      expect(transformGame.turn).toBe(1);
      expect(transformGame.board.getCell(2, 1)).toBe(2);
      expect(transformGame.board.getCell(2, 0)).toBe(1);
      expect(transformGame.board.getCell(2, 2)).toBe(1);
    });
  });
});
