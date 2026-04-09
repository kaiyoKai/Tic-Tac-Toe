import type { MoveStrategy } from "./MovesStrategy.ts";
import type { Position } from "@shared/Common.ts";
import { XOXOGame } from "@engine/XOXOGame.js";

//Kleine Erklärung falls man selbst eine Strategy machen will:
export const ShortSightedStrategy: MoveStrategy = {
  async determineMove(
    game: XOXOGame,
    myUserId: number,
  ): Promise<Position | undefined> {
    const validMoves = game.getValidMoves();
    if (validMoves.length === 0) return undefined;

    const opponents = game.getOpponentIds(myUserId);
    const blockingMoves: Position[] = [];

    for (const move of validMoves) {
      // 1. Kann ich selbst gewinnen?
      if (game.wouldWin(move.row, move.col, myUserId)) {
        return move;
      }

      // 2. Muss ich einen Gegner blocken?
      for (const oppId of opponents) {
        if (game.wouldWin(move.row, move.col, oppId)) {
          blockingMoves.push(move);
        }
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    /*
     * Wenn blocken nötig, nimm einen Block-Zug, sonst Random
     * (Bei mehr als 2 spielern sollte man bestenfals den nehmen der von denen eher alsnächstes dran ist)
     */
    return blockingMoves.length > 0
      ? blockingMoves[Math.floor(Math.random() * blockingMoves.length)]
      : validMoves[Math.floor(Math.random() * validMoves.length)];
  },
};
