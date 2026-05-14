import { describe, it, expect, beforeEach } from "vitest";
import { XOXOBoard } from "@engine/XOXOBoard";

describe("XOXOBoard", () => {
  let board: XOXOBoard;

  beforeEach(() => {
    board = new XOXOBoard();
  });

  describe("initialization", () => {
    it("should create a 3x3 board by default", () => {
      expect(board.size).toBe(3);
      expect(board.state.length).toBe(9);
    });

    it("should create a board with custom size", () => {
      const largeBoard = new XOXOBoard(5);
      expect(largeBoard.size).toBe(5);
      expect(largeBoard.state.length).toBe(25);
    });

    it("should initialize all cells as empty (0)", () => {
      for (let i = 0; i < board.state.length; i++) {
        expect(board.state[i]).toBe(0);
      }
    });
  });

  describe("getCell", () => {
    it("should return 0 for empty cell", () => {
      expect(board.getCell(0, 0)).toBe(0);
    });

    it("should return the player ID when set", () => {
      board.setCell(0, 0, 1);
      expect(board.getCell(0, 0)).toBe(1);
    });

    it("should correctly handle all positions on 3x3 board", () => {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          board.setCell(row, col, row * 3 + col + 1);
          expect(board.getCell(row, col)).toBe(row * 3 + col + 1);
        }
      }
    });
  });

  describe("setCell", () => {
    it("should set a cell with player ID", () => {
      board.setCell(0, 0, 1);
      expect(board.getCell(0, 0)).toBe(1);
    });

    it("should overwrite existing cell value", () => {
      board.setCell(1, 1, 1);
      expect(board.getCell(1, 1)).toBe(1);
      board.setCell(1, 1, 2);
      expect(board.getCell(1, 1)).toBe(2);
    });

    it("should allow setting multiple cells", () => {
      board.setCell(0, 0, 1);
      board.setCell(1, 1, 2);
      board.setCell(2, 2, 1);
      expect(board.getCell(0, 0)).toBe(1);
      expect(board.getCell(1, 1)).toBe(2);
      expect(board.getCell(2, 2)).toBe(1);
    });
  });

  describe("clear", () => {
    it("should reset all cells to 0", () => {
      board.setCell(0, 0, 1);
      board.setCell(1, 1, 2);
      board.setCell(2, 2, 1);

      board.clear();

      for (let i = 0; i < board.state.length; i++) {
        expect(board.state[i]).toBe(0);
      }
    });
  });

  describe("isFull", () => {
    it("should return false for empty board", () => {
      expect(board.isFull()).toBe(false);
    });

    it("should return false with partial fill", () => {
      board.setCell(0, 0, 1);
      board.setCell(1, 1, 2);
      expect(board.isFull()).toBe(false);
    });

    it("should return true when board is completely filled", () => {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          board.setCell(row, col, 1);
        }
      }
      expect(board.isFull()).toBe(true);
    });

    it("should work correctly on larger boards", () => {
      const largeBoard = new XOXOBoard(4);
      expect(largeBoard.isFull()).toBe(false);

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          largeBoard.setCell(row, col, 1);
        }
      }
      expect(largeBoard.isFull()).toBe(true);
    });
  });

  describe("isInsideBounds", () => {
    it("should return true for valid positions", () => {
      expect(board.isInsideBounds(0, 0)).toBe(true);
      expect(board.isInsideBounds(1, 1)).toBe(true);
      expect(board.isInsideBounds(2, 2)).toBe(true);
    });

    it("should return false for negative indices", () => {
      expect(board.isInsideBounds(-1, 0)).toBe(false);
      expect(board.isInsideBounds(0, -1)).toBe(false);
      expect(board.isInsideBounds(-1, -1)).toBe(false);
    });

    it("should return false for out of bounds indices", () => {
      expect(board.isInsideBounds(3, 0)).toBe(false);
      expect(board.isInsideBounds(0, 3)).toBe(false);
      expect(board.isInsideBounds(3, 3)).toBe(false);
    });

    it("should work with different board sizes", () => {
      const largeBoard = new XOXOBoard(5);
      expect(largeBoard.isInsideBounds(0, 0)).toBe(true);
      expect(largeBoard.isInsideBounds(4, 4)).toBe(true);
      expect(largeBoard.isInsideBounds(5, 0)).toBe(false);
      expect(largeBoard.isInsideBounds(0, 5)).toBe(false);
    });
  });

  describe("copy", () => {
    it("should create an independent copy", () => {
      board.setCell(0, 0, 1);
      board.setCell(1, 1, 2);

      const copy = board.copy();

      expect(copy.size).toBe(board.size);
      expect(copy.getCell(0, 0)).toBe(1);
      expect(copy.getCell(1, 1)).toBe(2);
    });

    it("should not share state with original", () => {
      board.setCell(0, 0, 1);
      const copy = board.copy();

      copy.setCell(0, 0, 2);

      expect(board.getCell(0, 0)).toBe(1);
      expect(copy.getCell(0, 0)).toBe(2);
    });

    it("should preserve all cell values", () => {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          board.setCell(row, col, row + col);
        }
      }

      const copy = board.copy();

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          expect(copy.getCell(row, col)).toBe(row + col);
        }
      }
    });
  });
});
