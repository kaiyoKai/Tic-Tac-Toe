import test from "node:test";
import assert from "node:assert/strict";
import TicTacToe from "../../src/core/TicTacToe.js";

test("move() places a symbol on an empty cell", async (t) => {
  // TODO: Implement assertions that a move records the symbol correctly.
});

test("move() rejects moves on occupied cells", async (t) => {
  // TODO: Implement logic to ensure repeated moves on the same spot are ignored.
});

test("isFinished() detects a winning line", async (t) => {
  // TODO: Implement assertions for row/column/diagonal wins.
});

test("isFinished() returns draw when board is full", async (t) => {
  // TODO: Implement a board fill scenario and assert draw result.
});

test("resetGame() clears board state", async (t) => {
  // TODO: Implement to verify board, turn, and gameOver reset.
});
