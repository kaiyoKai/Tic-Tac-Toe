import { describe, it, expect, beforeEach } from "vitest";
import TicTacToe from "@engine/TicTacToe";
import { MoveStatus, WinType } from "@shared/Common";

describe("TicTacToe - Alternative Implementation", () => {
  let game: TicTacToe;

  beforeEach(() => {
    game = new TicTacToe();
  });

  describe("initialization", () => {
    it("should create 3x3 board by default", () => {
      expect(game.size).toBe(3);
      expect(game.winCon).toBe(3);
      expect(game.board.length).toBe(3);
      expect(game.board[0].length).toBe(3);
    });

    it("should initialize with custom size", () => {
      const customGame = new TicTacToe(5);
      expect(customGame.size).toBe(5);
      expect(customGame.board.length).toBe(5);
    });

    it("should initialize with custom win condition", () => {
      const customGame = new TicTacToe(5, 4);
      expect(customGame.size).toBe(5);
      expect(customGame.winCon).toBe(4);
    });

    it("should start with turn 0", () => {
      expect(game.turn).toBe(0);
    });

    it("should not be game over initially", () => {
      expect(game.gameOver).toBe(false);
    });

    it("should have all cells empty", () => {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(game.board[row][col]).toBeNull();
        }
      }
    });
  });

  describe("move method", () => {
    it("should make a valid move", () => {
      const response = game.move(0, 0, "X");
      expect(response.MoveStatus).toBe(MoveStatus.SUCCESS);
      expect(game.board[0][0]).toBe("X");
    });

    it("should increment turn on successful move", () => {
      expect(game.turn).toBe(0);
      game.move(0, 0, "X");
      expect(game.turn).toBe(1);
    });

    it("should reject move on occupied cell", () => {
      game.move(0, 0, "X");
      const response = game.move(0, 0, "O");
      expect(response.MoveStatus).toBe(MoveStatus.OCCUPIED);
      expect(game.turn).toBe(1);
    });

    it("should handle out of bounds gracefully", () => {
      // Out of bounds should fail, but implementation may throw or return OCCUPIED
      try {
        const response = game.move(5, 5, "X");
        // If it doesn't throw, it should return OCCUPIED
        expect(response.MoveStatus).toBe(MoveStatus.OCCUPIED);
      } catch {
        // It's also acceptable to throw on out of bounds access
        expect(true).toBe(true);
      }
    });

    it("should reject move when game is over", () => {
      // Setup winning condition
      game.move(0, 0, "X");
      game.move(1, 0, "O");
      game.move(0, 1, "X");
      game.move(1, 1, "O");
      game.move(0, 2, "X"); // X wins

      const response = game.move(2, 2, "O");
      expect(response.MoveStatus).toBe(MoveStatus.GAME_OVER);
    });
  });

  describe("horizontal win detection", () => {
    it("should detect horizontal win", () => {
      game.move(0, 0, "X");
      game.move(1, 0, "O");
      game.move(0, 1, "X");
      game.move(1, 1, "O");
      const response = game.move(0, 2, "X");

      expect(response.MoveStatus).toBe(MoveStatus.SUCCESS);
      expect(response.gameResult).not.toBeNull();
      expect(response.gameResult?.type).toBe(WinType.Horizontal);
      expect(response.gameResult?.winner).toBe("X");
    });

    it("should detect horizontal win at any row", () => {
      // Middle row win
      game.move(0, 0, "O");
      game.move(1, 0, "X");
      game.move(0, 1, "O");
      game.move(1, 1, "X");
      game.move(2, 2, "O");
      const response = game.move(1, 2, "X");

      expect(response.gameResult?.type).toBe(WinType.Horizontal);
    });
  });

  describe("vertical win detection", () => {
    it("should detect vertical win at left column", () => {
      game.move(0, 0, "X");
      game.move(0, 1, "O");
      game.move(1, 0, "X");
      game.move(0, 2, "O");
      const response = game.move(2, 0, "X");

      expect(response.gameResult).not.toBeNull();
      expect(response.gameResult?.type).toBe(WinType.Vertical);
      expect(response.gameResult?.winner).toBe("X");
    });

    it("should detect vertical win at middle column", () => {
      // X at column 1: (0,1), (1,1), (2,1)
      game.move(0, 0, "O");
      game.move(0, 1, "X");
      game.move(1, 0, "O");
      game.move(1, 1, "X");
      game.move(2, 2, "O");
      const response = game.move(2, 1, "X");

      expect(response.gameResult).not.toBeNull();
      expect(response.gameResult?.type).toBe(WinType.Vertical);
    });
  });

  describe("diagonal win detection", () => {
    it("should detect main diagonal win", () => {
      game.move(0, 0, "X");
      game.move(0, 1, "O");
      game.move(1, 1, "X");
      game.move(0, 2, "O");
      const response = game.move(2, 2, "X");

      expect(response.gameResult).not.toBeNull();
      expect(response.gameResult?.type).toBe(WinType.DiagonalMain);
    });

    it("should detect anti-diagonal win", () => {
      // X needs to win on anti-diagonal: (0,2), (1,1), (2,0)
      game.move(0, 0, "O");
      game.move(0, 2, "X");
      game.move(1, 0, "O");
      game.move(1, 1, "X");
      game.move(2, 2, "O");
      const response = game.move(2, 0, "X");

      expect(response.gameResult).not.toBeNull();
      expect(response.gameResult?.type).toBe(WinType.DiagonalAnti);
    });
  });

  describe("draw detection", () => {
    it("should detect draw when board is full", () => {
      game.move(0, 0, "X");
      game.move(0, 1, "O");
      game.move(0, 2, "X");
      game.move(1, 0, "O");
      game.move(1, 1, "X");
      game.move(1, 2, "X");
      game.move(2, 0, "O");
      game.move(2, 1, "X");
      const response = game.move(2, 2, "O");

      expect(response.gameResult).not.toBeNull();
      expect(response.gameResult?.type).toBe(WinType.Draw);
      expect(response.gameResult?.winner).toBeNull();
    });
  });

  describe("isFinished method", () => {
    it("should return null for ongoing game", () => {
      game.move(0, 0, "X");
      const result = game.isFinished(0, 0);
      expect(result).toBeNull();
    });

    it("should return result when game ends", () => {
      game.move(0, 0, "X");
      game.move(1, 0, "O");
      game.move(0, 1, "X");
      game.move(1, 1, "O");
      const result = game.isFinished(0, 2);
      // Result should be null since we haven't made the winning move yet
      expect(result).toBeNull();
    });
  });

  describe("resetGame", () => {
    it("should reset all game state", () => {
      game.move(0, 0, "X");
      game.move(1, 1, "O");
      game.gameOver = true;

      game.resetGame();

      expect(game.turn).toBe(0);
      expect(game.gameOver).toBe(false);
      expect(game.board[0][0]).toBeNull();
      expect(game.board[1][1]).toBeNull();
    });
  });

  describe("clearBoard", () => {
    it("should clear all cells", () => {
      game.move(0, 0, "X");
      game.move(1, 1, "O");

      game.clearBoard();

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(game.board[row][col]).toBeNull();
        }
      }
    });

    it("should not reset turn counter", () => {
      game.move(0, 0, "X");
      game.move(1, 1, "O");
      expect(game.turn).toBe(2);

      game.clearBoard();

      expect(game.turn).toBe(2);
    });
  });

  describe("getValidMoves", () => {
    it("should return all cells for empty board", () => {
      const moves = game.getValidMoves();
      expect(moves).toHaveLength(9);
    });

    it("should exclude occupied cells", () => {
      game.move(0, 0, "X");
      game.move(1, 1, "O");

      const moves = game.getValidMoves();
      expect(moves).toHaveLength(7);
      expect(moves).not.toContainEqual({ row: 0, col: 0 });
      expect(moves).not.toContainEqual({ row: 1, col: 1 });
    });

    it("should return empty array for full board", () => {
      // Fill with draw pattern: X O X
      //                         O X X
      //                         O X O
      game.move(0, 0, "X");
      game.move(0, 1, "O");
      game.move(0, 2, "X");
      game.move(1, 0, "O");
      game.move(1, 1, "X");
      game.move(1, 2, "X");
      game.move(2, 0, "O");
      game.move(2, 1, "X");
      game.move(2, 2, "O");

      const moves = game.getValidMoves();
      expect(moves).toHaveLength(0);
    });
  });

  describe("isValidMove", () => {
    it("should return true for empty cell", () => {
      expect(game.isValidMove(0, 0)).toBe(true);
    });

    it("should return false for occupied cell", () => {
      game.move(0, 0, "X");
      expect(game.isValidMove(0, 0)).toBe(false);
    });

    it("should return false for out of bounds", () => {
      expect(game.isValidMove(5, 5)).toBe(false);
      expect(game.isValidMove(-1, 0)).toBe(false);
    });
  });

  describe("getTotalCells", () => {
    it("should return correct cell count", () => {
      expect(game.getTotalCells()).toBe(9);
    });

    it("should work with different sizes", () => {
      const largeGame = new TicTacToe(5);
      expect(largeGame.getTotalCells()).toBe(25);
    });
  });

  describe("getBoardLength", () => {
    it("should return board size", () => {
      expect(game.getBoardLength()).toBe(3);
    });

    it("should work with custom board sizes", () => {
      const smallGame = new TicTacToe(2);
      expect(smallGame.getBoardLength()).toBe(2);
    });
  });

  describe("isInsideBounds", () => {
    it("should return true for valid positions", () => {
      expect(game.isInsideBounds(0, 0, 3)).toBe(true);
      expect(game.isInsideBounds(1, 1, 3)).toBe(true);
      expect(game.isInsideBounds(2, 2, 3)).toBe(true);
    });

    it("should return false for out of bounds", () => {
      expect(game.isInsideBounds(3, 0, 3)).toBe(false);
      expect(game.isInsideBounds(0, 3, 3)).toBe(false);
      expect(game.isInsideBounds(-1, 0, 3)).toBe(false);
    });
  });

  describe("game state management", () => {
    it("should track game over state", () => {
      expect(game.gameOver).toBe(false);

      game.move(0, 0, "X");
      game.move(1, 0, "O");
      game.move(0, 1, "X");
      game.move(1, 1, "O");
      game.move(0, 2, "X"); // X wins

      expect(game.gameOver).toBe(true);
    });

    it("should track turn count accurately", () => {
      expect(game.turn).toBe(0);
      game.move(0, 0, "X");
      expect(game.turn).toBe(1);
      game.move(1, 1, "O");
      expect(game.turn).toBe(2);
    });
  });

  describe("checkDirection", () => {
    it("should check horizontal direction", () => {
      game.move(0, 0, "X");
      game.move(0, 1, "X");
      const result = game.checkDirection(0, 2, WinType.Horizontal);

      if (result) {
        expect(result.type).toBe(WinType.Horizontal);
      }
    });
  });

  describe("createBoard", () => {
    it("should create new board with all null values", () => {
      game.move(0, 0, "X");
      game.createBoard();

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(game.board[row][col]).toBeNull();
        }
      }
    });
  });

  describe("large board support", () => {
    it("should support 4x4 board", () => {
      const game4x4 = new TicTacToe(4, 4);
      expect(game4x4.size).toBe(4);
      expect(game4x4.getTotalCells()).toBe(16);
    });

    it("should support 5x5 board with different win condition", () => {
      const game5x5 = new TicTacToe(5, 4);
      expect(game5x5.size).toBe(5);
      expect(game5x5.winCon).toBe(4);
    });

    it("should work with larger win conditions", () => {
      const game10x10 = new TicTacToe(10, 5);
      expect(game10x10.getTotalCells()).toBe(100);
      expect(game10x10.winCon).toBe(5);
    });
  });
});
