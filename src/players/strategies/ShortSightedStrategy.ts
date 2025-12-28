import type { MoveStrategy } from "./MovesStrategy.ts";
import type TicTacToe from "../../core/TicTacToe.ts";
import type { Position } from "../../core/IPosition.ts";

export const ShortSightedStrategy: MoveStrategy = {
  determineMove(
    game: TicTacToe,
    mySymbol: string,
    allSymbols: string[] = ["X", "O"],
  ): { row: number; col: number } | undefined {
    const validMoves = game.getValidMoves();
    if (validMoves.length === 0) return undefined;
    const blockingMoves: Position[] = [];

    for (const move of validMoves) {
      for (const symbol of allSymbols) {
        game.board[move.row][move.col] = symbol;
        const wins = game.isFinished(move.row, move.col);
        game.board[move.row][move.col] = null;

        if (wins) {
          if (symbol === mySymbol) {
            return move;
          } else {
            blockingMoves.push(move);
          }
        }
      }
    }

    if (blockingMoves.length > 0) {
      return blockingMoves[Math.floor(Math.random() * blockingMoves.length)];
    }

    return validMoves[0];
  },
};
