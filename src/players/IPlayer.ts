import TicTacToe from "../core/TicTacToe.js";

export interface IPlayer {
  symbol: string;
  type: "human" | "bot" | "remote";
}

export interface IBot extends IPlayer {
  difficulty: "easy" | "normal" | "hard";
  gameboard: TicTacToe;
  getMove(): { row: number; col: number } | undefined;
}
