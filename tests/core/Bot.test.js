import { describe, it, expect, beforeEach } from "vitest";
import { Bot } from "../../src/players/Bot.js";
import TicTacToe from "../../src/core/TicTacToe.js";

describe("Bot", () => {
  let game;
  let bot;

  beforeEach(() => {
    game = new TicTacToe(3, 3);
    game.createBoard();

    bot = new Bot("easy", "O", game);
  });

  it("should be initialzied correctly", () => {
    expect(bot.symbol).toBe("O");
    expect(bot.difficulty).toBe("easy");
    expect(bot.gameboard).toBeDefined();
    expect(bot.gameboard.size).toBe(3);
  });

  it("should return a valid move (object)", () => {
    const move = bot.getMove();

    expect(move).toBeDefined();

    expect(move).toHaveProperty("row");
    expect(move).toHaveProperty("col");

    expect(typeof move.row).toBe("number");
    expect(typeof move.col).toBe("number");
  });

  it("it should make a move that is valid (meaning inside the boundaries of the board and legal)", () => {
    const move = bot.getMove();

    const isValid = game.isValidMove(move.row, move.col);
    expect(isValid).toBe(true);
  });
});
