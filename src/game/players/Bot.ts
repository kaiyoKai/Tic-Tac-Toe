import TicTacToe from "@engine/TicTacToe.js";
import { Logger } from "@shared/Logger.js";
import {
  Difficulty,
  type PlayerSymbol,
  type Position,
} from "@shared/Common.js";
import { EventActor } from "@events/EventTypes.js";
import type { Player } from "@players/Player.ts";
import type { MoveStrategy } from "@players/strategies/MovesStrategy.js";
import { RandomStrategy } from "@players/strategies/RandomStrategy.js";
import { ShortSightedStrategy } from "@players/strategies/ShortSightedStrategy.js";

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
