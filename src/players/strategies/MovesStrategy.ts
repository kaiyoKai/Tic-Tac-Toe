import type TicTacToe from "../../core/TicTacToe.ts";

export interface MoveStrategy {
  determineMove(
    game: TicTacToe,
    symbol: string,
  ): { row: number; col: number } | undefined;
}
