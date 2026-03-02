import TicTacToe from "../core/TicTacToe.js";
import { Logger } from "../services/Logger.ts";
import {
  Difficulty,
  type PlayerSymbol,
  type Position,
} from "../types/Common.js";
import { EventActor } from "../types/Events.ts";
import type { Player } from "./Player.ts";
import type { MoveStrategy } from "./strategies/MovesStrategy.js";
import { RandomStrategy } from "./strategies/RandomStrategy.js";
import { ShortSightedStrategy } from "./strategies/ShortSightedStrategy.js";

const StrategyMap: Record<Difficulty, MoveStrategy> = {
  [Difficulty.Easy]: RandomStrategy,
  [Difficulty.Medium]: ShortSightedStrategy,
  [Difficulty.Hard]: ShortSightedStrategy,
};

export class Bot implements Player {
  private strategy: MoveStrategy;
  constructor(
    public difficulty: Difficulty,
    public symbol: PlayerSymbol,
    public userName: string,
    public userId: number,
    private game: TicTacToe,
    private participant: Map<number, Player>,
  ) {
    this.strategy = StrategyMap[difficulty];
  }

  public changeDifficulty(difficulty: Difficulty): void {
    if (this.difficulty === difficulty) return;
    this.difficulty = difficulty;
    this.strategy = StrategyMap[difficulty];
    Logger.log(
      EventActor.Bot,
      `Bot Strategy changed to: ${difficulty} (${this.strategy})`,
    );
  }

  public getMove() {
    const allSymbols = Array.from(
      this.participant.values(),
      (player) => player.symbol,
    );
    return this.strategy.determineMove(this.game, this.symbol, allSymbols);
  }

  async makeMove(): Promise<Position> | undefined {
    return this.getMove();
  }
}
