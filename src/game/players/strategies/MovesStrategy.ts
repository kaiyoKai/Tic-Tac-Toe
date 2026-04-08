import TicTacToe from "@engine/TicTacToe.js";
import type { PlayerSymbol, Position } from "@shared/Common.js";

export interface MoveStrategy {
  determineMove(
    game: TicTacToe,
    symbol: PlayerSymbol,
    allSymbols?: PlayerSymbol[],
  ): Promise<Position | undefined>;
}
