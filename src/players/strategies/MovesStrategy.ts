import TicTacToe from "../../core/TicTacToe.js";
import type { PlayerSymbol } from "../../types/Common.ts";

export interface MoveStrategy {
  determineMove(
    game: TicTacToe,
    symbol: PlayerSymbol,
    allSymbols?: PlayerSymbol[],
  ): { row: number; col: number } | undefined;
}
