import TicTacToe from "../core/TicTacToe.js";
import type { Difficulty } from "./Bot.ts";

export const PlayerType = {
  Local: "human",
  Bot: "bot",
  Remote: "remote",
} as const;

export type PlayerType = (typeof PlayerType)[keyof typeof PlayerType];

export interface IPlayer {
  symbol: string;
  type: PlayerType;
}

export interface IBot extends IPlayer {
  difficulty: Difficulty;
  game: TicTacToe;
  getMove(): { row: number; col: number } | undefined;
}
