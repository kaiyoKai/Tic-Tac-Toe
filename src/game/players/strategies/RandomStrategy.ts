import type { MoveStrategy } from "./MovesStrategy.js";
import type { Position } from "@shared/Common.js";

export const RandomStrategy: MoveStrategy = {
  async determineMove(game): Promise<Position | undefined> {
    const validMoves = game.getValidMoves();
    if (validMoves.length === 0) return undefined;

    // Kleiner Delay für das "Feeling" (Falls man einen smarten bot macht der viel rechnet besser kein delay)
    await new Promise((resolve) => setTimeout(resolve, 500));

    return validMoves[Math.floor(Math.random() * validMoves.length)];
  },
};
