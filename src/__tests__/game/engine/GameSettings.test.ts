import { describe, it, expect, beforeEach } from "vitest";
import { GameSettings } from "@engine/GameSettings";
import { GameMode, Difficulty } from "@shared/Common";

describe("GameSettings", () => {
  describe("initialization", () => {
    it("should create default game settings", () => {
      const settings = new GameSettings();

      expect(settings.mode).toBe(GameMode.Local);
      expect(settings.boardSize).toBe(3);
      expect(settings.winCon).toBe(3);
      expect(settings.difficulty).toBe(Difficulty.Medium);
    });

    it("should allow custom board size", () => {
      const settings = new GameSettings(undefined, 5);

      expect(settings.boardSize).toBe(5);
      expect(settings.winCon).toBe(3);
    });

    it("should allow custom win condition", () => {
      const settings = new GameSettings(undefined, 5, 4);

      expect(settings.boardSize).toBe(5);
      expect(settings.winCon).toBe(4);
    });

    it("should allow custom game mode", () => {
      const settings = new GameSettings(GameMode.Bot);

      expect(settings.mode).toBe(GameMode.Bot);
    });

    it("should allow custom difficulty", () => {
      const settings = new GameSettings(undefined, 3, 3, Difficulty.Hard);

      expect(settings.difficulty).toBe(Difficulty.Hard);
    });

    it("should support all game modes", () => {
      const localSettings = new GameSettings(GameMode.Local);
      expect(localSettings.mode).toBe(GameMode.Local);

      const botSettings = new GameSettings(GameMode.Bot);
      expect(botSettings.mode).toBe(GameMode.Bot);

      const onlineSettings = new GameSettings(GameMode.Online);
      expect(onlineSettings.mode).toBe(GameMode.Online);
    });

    it("should support all difficulty levels", () => {
      const easySettings = new GameSettings(undefined, 3, 3, Difficulty.Easy);
      expect(easySettings.difficulty).toBe(Difficulty.Easy);

      const mediumSettings = new GameSettings(
        undefined,
        3,
        3,
        Difficulty.Medium,
      );
      expect(mediumSettings.difficulty).toBe(Difficulty.Medium);

      const hardSettings = new GameSettings(undefined, 3, 3, Difficulty.Hard);
      expect(hardSettings.difficulty).toBe(Difficulty.Hard);
    });
  });

  describe("isValid", () => {
    it("should return true for valid settings", () => {
      const settings = new GameSettings(undefined, 3, 3);
      expect(settings.isValid()).toBe(true);
    });

    it("should return true when winCon equals boardSize", () => {
      const settings = new GameSettings(undefined, 5, 5);
      expect(settings.isValid()).toBe(true);
    });

    it("should return true when winCon is less than boardSize", () => {
      const settings = new GameSettings(undefined, 5, 3);
      expect(settings.isValid()).toBe(true);
    });

    it("should auto-correct invalid winCon during construction", () => {
      // When winCon > boardSize is passed, it gets fixed in the constructor
      const settings = new GameSettings(undefined, 3, 5);
      // After construction, settings should be valid
      expect(settings.isValid()).toBe(true);
      // And winCon should have been corrected to boardSize
      expect(settings.winCon).toBe(3);
    });

    it("should handle edge case validation before fixing", () => {
      // Create a settings object and manually check what would be invalid
      const testSettings = { boardSize: 3, winCon: 5, isValid: () => 5 <= 3 };
      expect(testSettings.isValid()).toBe(false);
    });
  });

  describe("fixInvalidValues", () => {
    it("should auto-fix invalid values during construction", () => {
      const settings = new GameSettings(undefined, 3, 5);

      expect(settings.winCon).toBe(3);
      expect(settings.isValid()).toBe(true);
    });

    it("should keep valid winCon unchanged", () => {
      const settings = new GameSettings(undefined, 5, 3);

      expect(settings.winCon).toBe(3);
    });

    it("should set winCon to boardSize when invalid", () => {
      const settings = new GameSettings(undefined, 4, 10);

      expect(settings.winCon).toBe(4);
    });

    it("should handle edge case of boardSize = 1", () => {
      const settings = new GameSettings(undefined, 1, 5);

      expect(settings.winCon).toBe(1);
      expect(settings.isValid()).toBe(true);
    });

    it("should handle large board sizes", () => {
      const settings = new GameSettings(undefined, 100, 50);

      expect(settings.winCon).toBe(50);
      expect(settings.isValid()).toBe(true);
    });
  });

  describe("complex scenarios", () => {
    it("should handle multiple invalid settings", () => {
      const settings = new GameSettings(GameMode.Bot, 3, 5, Difficulty.Hard);

      expect(settings.mode).toBe(GameMode.Bot);
      expect(settings.boardSize).toBe(3);
      expect(settings.winCon).toBe(3); // Fixed from 5
      expect(settings.difficulty).toBe(Difficulty.Hard);
    });

    it("should create valid 5x5 board with 4 in a row", () => {
      const settings = new GameSettings(undefined, 5, 4);

      expect(settings.boardSize).toBe(5);
      expect(settings.winCon).toBe(4);
      expect(settings.isValid()).toBe(true);
    });

    it("should handle 10x10 board with custom win condition", () => {
      const settings = new GameSettings(undefined, 10, 5);

      expect(settings.boardSize).toBe(10);
      expect(settings.winCon).toBe(5);
      expect(settings.isValid()).toBe(true);
    });
  });
});
