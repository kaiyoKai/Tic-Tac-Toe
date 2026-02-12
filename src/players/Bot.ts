import TicTacToe from "../core/TicTacToe.js";
import { Difficulty, type Position } from "../types/Common.js";
import { PlayerType } from "../types/Common.js";
import type { Player } from "./Player.ts";
import type { MoveStrategy } from "./strategies/MovesStrategy.js";
import { RandomStrategy } from "./strategies/RandomStrategy.js";
import { ShortSightedStrategy } from "./strategies/ShortSightedStrategy.js";

const StrategyMap: Record<Difficulty, MoveStrategy> = {
  [Difficulty.Easy]: RandomStrategy,
  [Difficulty.Medium]: ShortSightedStrategy,
  [Difficulty.Hard]: ShortSightedStrategy, // Hier später z.B. MinimaxStrategy kai (:
};

export class Bot implements Player {
  private strategy: MoveStrategy;
  constructor(
    public difficulty: Difficulty,
    public symbol: string,
    public userName: string,
    public userId: number,
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

  async makeMove(): Promise<Position> | undefined {
    return await this.getMove();
  }
}
