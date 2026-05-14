import { describe, it, expect } from "vitest";
import { GameResult } from "@engine/GameResult";
import { WinType, assertPlayerSymbol } from "@shared/Common";

describe("GameResult", () => {
  describe("createWin", () => {
    it("should create a win result with winner", () => {
      const playerX = assertPlayerSymbol("X");
      const positions = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ];

      const result = GameResult.createWin(playerX, WinType.Horizontal, positions);

      expect(result.winner).toBe(playerX);
      expect(result.type).toBe(WinType.Horizontal);
      expect(result.positions).toEqual(positions);
    });

    it("should work with all win types", () => {
      const playerX = assertPlayerSymbol("X");
      const positions = [{ row: 0, col: 0 }];

      const horizontalWin = GameResult.createWin(
        playerX,
        WinType.Horizontal,
        positions,
      );
      expect(horizontalWin.type).toBe(WinType.Horizontal);

      const verticalWin = GameResult.createWin(
        playerX,
        WinType.Vertical,
        positions,
      );
      expect(verticalWin.type).toBe(WinType.Vertical);

      const diagonalMainWin = GameResult.createWin(
        playerX,
        WinType.DiagonalMain,
        positions,
      );
      expect(diagonalMainWin.type).toBe(WinType.DiagonalMain);

      const diagonalAntiWin = GameResult.createWin(
        playerX,
        WinType.DiagonalAnti,
        positions,
      );
      expect(diagonalAntiWin.type).toBe(WinType.DiagonalAnti);
    });

    it("should store all winning positions", () => {
      const playerX = assertPlayerSymbol("X");
      const positions = [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
      ];

      const result = GameResult.createWin(playerX, WinType.DiagonalMain, positions);

      expect(result.positions).toHaveLength(3);
      expect(result.positions).toContainEqual({ row: 0, col: 0 });
      expect(result.positions).toContainEqual({ row: 1, col: 1 });
      expect(result.positions).toContainEqual({ row: 2, col: 2 });
    });
  });

  describe("createDraw", () => {
    it("should create a draw result", () => {
      const result = GameResult.createDraw();

      expect(result.winner).toBe(null);
      expect(result.type).toBe(WinType.Draw);
      expect(result.positions).toEqual([]);
    });

    it("should have no winner in draw", () => {
      const result = GameResult.createDraw();
      expect(result.winner).toBeNull();
    });
  });

  describe("immutability", () => {
    it("should be frozen after creation (win)", () => {
      const playerX = assertPlayerSymbol("X");
      const result = GameResult.createWin(playerX, WinType.Horizontal, []);

      expect(Object.isFrozen(result)).toBe(true);
    });

    it("should be frozen after creation (draw)", () => {
      const result = GameResult.createDraw();
      expect(Object.isFrozen(result)).toBe(true);
    });

    it("should not allow property modification", () => {
      const playerX = assertPlayerSymbol("X");
      const result = GameResult.createWin(playerX, WinType.Horizontal, []);

      expect(() => {
        // @ts-ignore - testing immutability
        result.winner = assertPlayerSymbol("O");
      }).toThrow();
    });
  });

  describe("edge cases", () => {
    it("should handle empty positions array", () => {
      const playerX = assertPlayerSymbol("X");
      const result = GameResult.createWin(playerX, WinType.Horizontal, []);

      expect(result.positions).toEqual([]);
    });

    it("should handle different emoji symbols as winners", () => {
      const emojiX = assertPlayerSymbol("❌");
      const emojiO = assertPlayerSymbol("⭕");

      const resultX = GameResult.createWin(emojiX, WinType.Horizontal, []);
      const resultO = GameResult.createWin(emojiO, WinType.Vertical, []);

      expect(resultX.winner).toBe(emojiX);
      expect(resultO.winner).toBe(emojiO);
    });
  });
});
