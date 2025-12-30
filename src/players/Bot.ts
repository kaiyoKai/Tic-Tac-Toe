import TicTacToe from "../core/TicTacToe.js";
import { PlayerType } from "./IPlayer.ts";
import type { MoveStrategy } from "./strategies/MovesStrategy.ts";
import { RandomStrategy } from "./strategies/RandomStrategy.js";
import { ShortSightedStrategy } from "./strategies/ShortSightedStrategy.ts";

export const Difficulty = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

const StrategyMap: Record<Difficulty, MoveStrategy> = {
  [Difficulty.Easy]: RandomStrategy,
  [Difficulty.Medium]: ShortSightedStrategy,
  [Difficulty.Hard]: ShortSightedStrategy, // Hier später z.B. MinimaxStrategy kai (:
};

export class Bot {
  public readonly type: PlayerType = PlayerType.Bot;
  private strategy: MoveStrategy;

  constructor(
    public difficulty: Difficulty,
    public symbol: string,
    private game: TicTacToe,
  ) {
    this.strategy = StrategyMap[difficulty];
  }

  public changeDifficulty(difficulty: Difficulty): void {
    if (this.difficulty === difficulty) return;
    this.difficulty = difficulty;
    this.strategy = StrategyMap[difficulty];
    console.log(`Bot Strategy changed to: ${difficulty} (${this.strategy})`);
  }

  public getMove() {
    const allSymbols = ["X", "O"]; // später muss ich hier aber dringend das hardcoding rausnehmen,machste bestimmt oder kai? (:
    return this.strategy.determineMove(this.game, this.symbol, allSymbols);
  }
}
