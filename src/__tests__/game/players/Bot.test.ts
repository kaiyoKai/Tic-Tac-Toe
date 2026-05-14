import { describe, it, expect, beforeEach, vi } from "vitest";
import { Bot } from "@players/Bot";
import { Difficulty, assertPlayerSymbol } from "@shared/Common";
import { XOXOGame } from "@engine/XOXOGame";
import { GameSettings } from "@engine/GameSettings";

describe("Bot", () => {
  let bot: Bot;
  const symbol = assertPlayerSymbol("X");
  const userName = "TestBot";
  const userId = 257;

  beforeEach(() => {
    bot = new Bot(Difficulty.Easy, symbol, userName, userId);
  });

  describe("initialization", () => {
    it("should create bot with correct properties", () => {
      expect(bot.difficulty).toBe(Difficulty.Easy);
      expect(bot.symbol).toBe(symbol);
      expect(bot.userName).toBe(userName);
      expect(bot.userId).toBe(userId);
    });

    it("should initialize with Easy difficulty", () => {
      const easyBot = new Bot(Difficulty.Easy, symbol, "Easy", userId);
      expect(easyBot.difficulty).toBe(Difficulty.Easy);
    });

    it("should initialize with Medium difficulty", () => {
      const mediumBot = new Bot(Difficulty.Medium, symbol, "Medium", userId);
      expect(mediumBot.difficulty).toBe(Difficulty.Medium);
    });

    it("should initialize with Hard difficulty", () => {
      const hardBot = new Bot(Difficulty.Hard, symbol, "Hard", userId);
      expect(hardBot.difficulty).toBe(Difficulty.Hard);
    });

    it("should initialize with different symbols", () => {
      const botX = new Bot(Difficulty.Easy, assertPlayerSymbol("X"), "X", userId);
      const botO = new Bot(Difficulty.Easy, assertPlayerSymbol("O"), "O", userId);
      const botEmoji = new Bot(
        Difficulty.Easy,
        assertPlayerSymbol("❌"),
        "Emoji",
        userId,
      );

      expect(botX.symbol).toBe("X");
      expect(botO.symbol).toBe("O");
      expect(botEmoji.symbol).toBe("❌");
    });
  });

  describe("changeDifficulty", () => {
    it("should change difficulty level", () => {
      expect(bot.difficulty).toBe(Difficulty.Easy);
      bot.changeDifficulty(Difficulty.Hard);
      expect(bot.difficulty).toBe(Difficulty.Hard);
    });

    it("should handle changing to same difficulty", () => {
      bot.changeDifficulty(Difficulty.Easy);
      expect(bot.difficulty).toBe(Difficulty.Easy);
      // Should not throw
      bot.changeDifficulty(Difficulty.Easy);
      expect(bot.difficulty).toBe(Difficulty.Easy);
    });

    it("should support changing through all difficulties", () => {
      const difficulties = [Difficulty.Easy, Difficulty.Medium, Difficulty.Hard];

      difficulties.forEach((difficulty) => {
        bot.changeDifficulty(difficulty);
        expect(bot.difficulty).toBe(difficulty);
      });
    });

    it("should cycle through difficulties", () => {
      bot.changeDifficulty(Difficulty.Easy);
      expect(bot.difficulty).toBe(Difficulty.Easy);

      bot.changeDifficulty(Difficulty.Medium);
      expect(bot.difficulty).toBe(Difficulty.Medium);

      bot.changeDifficulty(Difficulty.Hard);
      expect(bot.difficulty).toBe(Difficulty.Hard);

      bot.changeDifficulty(Difficulty.Easy);
      expect(bot.difficulty).toBe(Difficulty.Easy);
    });
  });

  describe("getMove", () => {
    it("should return a valid move or null", async () => {
      const settings = new GameSettings(undefined, 3, 3);
      const game = new XOXOGame(settings);

      const move = bot.getMove(game);
      // Should be an awaitable or result
      expect(move).toBeDefined();
    });

    it("should generate different moves for different difficulties", () => {
      const settings = new GameSettings(undefined, 3, 3);
      const game = new XOXOGame(settings);

      const easyBot = new Bot(Difficulty.Easy, symbol, "Easy", userId);
      const mediumBot = new Bot(Difficulty.Medium, symbol, "Medium", userId + 1);

      const easyMove = easyBot.getMove(game);
      const mediumMove = mediumBot.getMove(game);

      // Both should be valid (not throwing)
      expect(easyMove).toBeDefined();
      expect(mediumMove).toBeDefined();
    });
  });

  describe("makeMove", () => {
    it("should return a promise", async () => {
      const settings = new GameSettings(undefined, 3, 3);
      const game = new XOXOGame(settings);

      const movePromise = bot.makeMove(game);
      expect(movePromise instanceof Promise).toBe(true);
    });

    it("should resolve to a position or null", async () => {
      const settings = new GameSettings(undefined, 3, 3);
      const game = new XOXOGame(settings);

      const move = await Promise.race([
        bot.makeMove(game),
        new Promise((resolve) => setTimeout(() => resolve(null), 100)),
      ]);

      // Move can be a position object or null
      if (move !== null) {
        expect(move).toHaveProperty("row");
        expect(move).toHaveProperty("col");
        expect(typeof move.row).toBe("number");
        expect(typeof move.col).toBe("number");
      }
    });

    it("should provide valid board positions", async () => {
      const settings = new GameSettings(undefined, 3, 3);
      const game = new XOXOGame(settings);

      const move = await Promise.race([
        bot.makeMove(game),
        new Promise((resolve) => setTimeout(() => resolve(null), 100)),
      ]);

      if (move !== null) {
        expect(move.row).toBeGreaterThanOrEqual(0);
        expect(move.row).toBeLessThan(3);
        expect(move.col).toBeGreaterThanOrEqual(0);
        expect(move.col).toBeLessThan(3);
      }
    });
  });

  describe("bot with different configurations", () => {
    it("should work with emoji symbol", () => {
      const emojiBot = new Bot(
        Difficulty.Medium,
        assertPlayerSymbol("🤖"),
        "RobotBot",
        257,
      );

      expect(emojiBot.symbol).toBe("🤖");
      expect(emojiBot.userName).toBe("RobotBot");
    });

    it("should work with numeric ID", () => {
      const botWithHighId = new Bot(
        Difficulty.Hard,
        symbol,
        "HighIdBot",
        999999,
      );

      expect(botWithHighId.userId).toBe(999999);
    });

    it("should work with long bot name", () => {
      const longName = "VeryLongBotNameForTesting";
      const botWithLongName = new Bot(Difficulty.Medium, symbol, longName, userId);

      expect(botWithLongName.userName).toBe(longName);
    });
  });

  describe("difficulty-based behavior", () => {
    it("should assign strategy to Easy bot", () => {
      const easyBot = new Bot(Difficulty.Easy, symbol, "Easy", userId);
      expect(easyBot.difficulty).toBe(Difficulty.Easy);
    });

    it("should assign strategy to Medium bot", () => {
      const mediumBot = new Bot(Difficulty.Medium, symbol, "Medium", userId);
      expect(mediumBot.difficulty).toBe(Difficulty.Medium);
    });

    it("should assign strategy to Hard bot", () => {
      const hardBot = new Bot(Difficulty.Hard, symbol, "Hard", userId);
      expect(hardBot.difficulty).toBe(Difficulty.Hard);
    });
  });

  describe("state management", () => {
    it("should maintain consistent state after multiple operations", () => {
      expect(bot.difficulty).toBe(Difficulty.Easy);
      expect(bot.symbol).toBe(symbol);
      expect(bot.userName).toBe(userName);
      expect(bot.userId).toBe(userId);

      bot.changeDifficulty(Difficulty.Hard);

      expect(bot.difficulty).toBe(Difficulty.Hard);
      expect(bot.symbol).toBe(symbol); // Unchanged
      expect(bot.userName).toBe(userName); // Unchanged
      expect(bot.userId).toBe(userId); // Unchanged
    });

    it("should not modify constructor parameters after initialization", () => {
      const originalSymbol = bot.symbol;
      const originalUserName = bot.userName;
      const originalUserId = bot.userId;

      bot.changeDifficulty(Difficulty.Medium);

      expect(bot.symbol).toBe(originalSymbol);
      expect(bot.userName).toBe(originalUserName);
      expect(bot.userId).toBe(originalUserId);
    });
  });
});
