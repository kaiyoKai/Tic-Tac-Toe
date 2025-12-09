import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import TicTacToe from "../../src/core/TicTacToe.js";
import { GameResult } from "../../src/core/GameResult.js";

describe("TicTacToe Core Logic", () => {
  let game;

  beforeEach(() => {
    game = new TicTacToe(3, 3);
  });

  it("should handle a valid move correctly", () => {
    const result = game.move(0, 0, "X");

    assert.equal(result.gameResult, null);

    assert.equal(game.board[0][0], "X");
    assert.equal(game.turn, 1);
  });

  it("should detect a horizontal win", () => {
    game.move(0, 0, "X");
    game.move(1, 0, "O");
    game.move(0, 1, "X");
    game.move(1, 1, "O");

    const result = game.move(0, 2, "X");

    assert.ok(result.gameResult, "Sollte ein GameResult haben");
    assert.equal(result.gameResult.winner, "X");
    assert.equal(result.gameResult.type, GameResult.TYPES.HORIZONTAL);
    assert.equal(result.gameResult.positions.length, 3);
  });

  it("should detect a vertical win", () => {
    game.move(0, 0, "X");
    game.move(0, 1, "O");
    game.move(1, 0, "X");
    game.move(1, 1, "O");

    const result = game.move(2, 0, "X");

    assert.ok(result.gameResult);
    assert.equal(result.gameResult.winner, "X");
    assert.equal(result.gameResult.type, GameResult.TYPES.VERTICAL);
  });

  it("should detect a anti diagonal win", () => {
    game.move(2, 0, "X");
    game.move(0, 0, "O");
    game.move(1, 1, "X");
    game.move(1, 0, "O");

    const result = game.move(0, 2, "X");

    assert.ok(result.gameResult);
    assert.equal(result.gameResult.type, GameResult.TYPES.DIAGONAL_ANTI);
  });

  it("should detect a draw", () => {
    // X O X
    // X O X
    // O X O
    const moves = [
      [0, 0, "X"],
      [0, 1, "O"],
      [0, 2, "X"],
      [1, 0, "X"],
      [1, 1, "O"],
      [1, 2, "X"],
      [2, 0, "O"],
      [2, 1, "X"],
      [2, 2, "O"],
    ];

    let result;
    for (const [r, c, sym] of moves) {
      result = game.move(r, c, sym);
    }

    assert.ok(result.gameResult, "Muss GameResult haben");
    assert.equal(result.gameResult.type, GameResult.TYPES.DRAW);
  });
  it("should properly reset the game", () => {
    game.move(0, 0, "X");
    assert.equal(game.turn, 1);

    game.resetGame();

    assert.equal(game.turn, 0);
    assert.equal(game.board[0][0], null);
    assert.equal(game.gameOver, false);

    const result = game.move(0, 0, "X");
    assert.equal(result.status, TicTacToe.MOVE_STATUS.SUCCESS);
  });
});
