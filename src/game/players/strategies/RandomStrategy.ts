import type TicTacToe from "@engine/TicTacToe.js";
import type { MoveStrategy } from "./MovesStrategy.js";
import type { Position, PlayerSymbol } from "@shared/Common.js";

export const RandomStrategy: MoveStrategy = {
  async determineMove(game: TicTacToe): Promise<Position | undefined> {
    const validMoves = game.getValidMoves();
    if (validMoves.length === 0) return undefined;

    const randomIndex = Math.floor(Math.random() * validMoves.length);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return validMoves[randomIndex];
  },
};
