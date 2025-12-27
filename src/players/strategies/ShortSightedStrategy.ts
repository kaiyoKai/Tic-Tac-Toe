import type { MoveStrategy } from "./MovesStrategy.ts";
import type TicTacToe from "../../core/TicTacToe.ts";

export const ShortSightedStrategy: MoveStrategy = {
  determineMove(
    game: TicTacToe,
    mySymbol: string,
    allSymbols: string[] = ["X", "O"],
  ): { row: number; col: number } | undefined {
    const validMoves = game.getValidMoves();
    if (validMoves.length === 0) return undefined;

    for (const move of validMoves) {
      for (const currentSymbol of allSymbols) {
        game.board[move.row][move.col] = currentSymbol;
        const result = game.isFinished(move.row, move.col);

        game.board[move.row][move.col] = null;

        if (result) {
          if (currentSymbol === mySymbol) {
            return move;
          }
          return move;
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * validMoves.length);
    return validMoves[randomIndex];
  },
};
