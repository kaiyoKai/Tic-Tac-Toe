import TicTacToe from "../core/TicTacToe.js";
import { Difficulty, PlayerType } from "../types/Common.js";

export interface IPlayer {
  symbol: string;
  type: PlayerType;
}

export interface IBot extends IPlayer {
  difficulty: Difficulty;
  game: TicTacToe;
  getMove(): { row: number; col: number } | undefined;
}
