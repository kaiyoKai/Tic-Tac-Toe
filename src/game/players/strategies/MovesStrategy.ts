import { XOXOGame } from "@engine/XOXOGame.js";
import type { Position } from "@shared/Common.js";

export interface MoveStrategy {
  determineMove(
    game: XOXOGame,
    myUserId: number,
  ): Promise<Position | undefined>;
}
