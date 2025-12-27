import type TicTacToe from "../../core/TicTacToe.ts";
import type { MoveStrategy } from "./MovesStrategy.ts";

export const RandomStrategy: MoveStrategy = {
  determineMove(
    game: TicTacToe,
    _symbol: string,
  ): { row: number; col: number } | undefined {
    const validMoves = game.getValidMoves();
    if (validMoves.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  },
};
