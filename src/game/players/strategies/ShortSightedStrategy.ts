import type { MoveStrategy } from "./MovesStrategy.ts";
import type TicTacToe from "@engine/TicTacToe.ts";
import type { Position, PlayerSymbol } from "@shared/Common.ts";

export const ShortSightedStrategy: MoveStrategy = {
  async determineMove(
    game: TicTacToe,
    mySymbol,
    allSymbols = [],
  ): Promise<Position | undefined> {
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
    await new Promise((resolve) => setTimeout(resolve, 500));
    const move =
      blockingMoves.length > 0
        ? blockingMoves[Math.floor(Math.random() * blockingMoves.length)]
        : validMoves[Math.floor(Math.random() * validMoves.length)];

    return move;
  },
};
