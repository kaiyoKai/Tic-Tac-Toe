import TicTacToe from "../../core/TicTacToe.js";
import type { PlayerSymbol, Position } from "../../types/Common.ts";

export interface MoveStrategy {
  determineMove(
    game: TicTacToe,
    symbol: PlayerSymbol,
    allSymbols?: PlayerSymbol[],
  ): Promise<Position | undefined>;
}
