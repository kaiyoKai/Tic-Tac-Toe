// src/players/PlayerConfig.ts
import { Difficulty } from "./Bot.js";

// Dein Enum ist perfekt!
export const PlayerType = {
  Human: "human",
  Bot: "bot",
  Remote: "remote",
} as const;
export type PlayerType = (typeof PlayerType)[keyof typeof PlayerType];

// Das hier nutzt die UI und der Controller-Constructor
export interface PlayerConfig {
  name?: string; // Optional: "Kai", "Terminator"
  symbol: string; // "X", "O"
  type: PlayerType;
  difficulty?: Difficulty; // Nur relevant, wenn type === 'bot'
}
