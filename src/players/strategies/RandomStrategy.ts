import type TicTacToe from "../../core/TicTacToe.js";
import type { MoveStrategy } from "./MovesStrategy.js";

export const RandomStrategy: MoveStrategy = {
  determineMove(
    game: TicTacToe,
    _symbol,
  ): { row: number; col: number } | undefined {
    const validMoves = game.getValidMoves();
    if (validMoves.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  },
};
