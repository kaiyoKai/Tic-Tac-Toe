import { Difficulty } from "./Bot.js";

export const PlayerType = {
  Human: "human",
  Bot: "bot",
  Remote: "remote",
} as const;
export type PlayerType = (typeof PlayerType)[keyof typeof PlayerType];

export interface PlayerConfig {
  name?: string;
  symbol: string;
  type: PlayerType;
  difficulty?: Difficulty;
}
