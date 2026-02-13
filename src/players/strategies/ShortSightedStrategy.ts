import type { MoveStrategy } from "./MovesStrategy.ts";
import type TicTacToe from "../../core/TicTacToe.ts";
import type { Position, PlayerSymbol } from "../../types/Common.js";

export const ShortSightedStrategy: MoveStrategy = {
  determineMove(
    game: TicTacToe,
    mySymbol,
    allSymbols = [],
  ): Position | undefined {
    const validMoves = game.getValidMoves();
    if (validMoves.length === 0) return undefined;

    const virtualBoard = structuredClone(game.board);
    const blockingMoves: Position[] = [];

    for (const move of validMoves) {
      for (const symbol of allSymbols) {
        virtualBoard[move.row][move.col] = symbol;

        const wins = game.checkWinOnBoard(virtualBoard, move.row, move.col);

        virtualBoard[move.row][move.col] = null;

        if (wins) {
          if (symbol === mySymbol) return move;
          blockingMoves.push(move);
        }
      }
    }

    return blockingMoves.length > 0
      ? blockingMoves[Math.floor(Math.random() * blockingMoves.length)]
      : validMoves[Math.floor(Math.random() * validMoves.length)];
  },
};
