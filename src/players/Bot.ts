import TicTacToe from "../core/TicTacToe.js";
import type { MoveStrategy } from "./strategies/MovesStrategy.ts";
import { RandomStrategy } from "./strategies/RandomStrategy.js";

export const Difficulty = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
} as const;

export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

const StrategyMap: Record<Difficulty, new () => MoveStrategy> = {
  [Difficulty.Easy]: RandomStrategy,
  [Difficulty.Medium]: RandomStrategy, // Hier später anpassen
  [Difficulty.Hard]: RandomStrategy, // Hier später z.B. MinimaxStrategy kai (:
};

export class Bot {
  public readonly type = "bot" as const;
  private strategy: MoveStrategy;

  constructor(
    public difficulty: Difficulty,
    public symbol: string,
    private game: TicTacToe,
  ) {
    const StrategyClass = StrategyMap[difficulty];
    this.strategy = new StrategyClass();
  }

  public getMove() {
    return this.strategy.determineMove(this.game, this.symbol);
  }
}
