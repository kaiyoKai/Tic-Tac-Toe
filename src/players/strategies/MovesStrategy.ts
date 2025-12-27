import TicTacToe from "../../core/TicTacToe.js";

export interface MoveStrategy {
  determineMove(
    game: TicTacToe,
    _symbol: string,
    _allSymbols?: string[],
  ): { row: number; col: number } | undefined;
}
