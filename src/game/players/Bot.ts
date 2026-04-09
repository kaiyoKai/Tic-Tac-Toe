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
import { XOXOGame } from "@engine/XOXOGame.js";

const StrategyMap: Record<Difficulty, MoveStrategy> = {
  [Difficulty.Easy]: RandomStrategy,
  [Difficulty.Medium]: ShortSightedStrategy,
  [Difficulty.Hard]: ShortSightedStrategy, //Hier gerne weitere hinzufügen (:
};

export class Bot implements Player {
  private strategy: MoveStrategy;

  constructor(
    public difficulty: Difficulty,
    public symbol: PlayerSymbol,
    public userName: string,
    public userId: number,
  ) {
    this.strategy = StrategyMap[difficulty];
  }

  public changeDifficulty(difficulty: Difficulty): void {
    if (this.difficulty === difficulty) return;
    this.difficulty = difficulty;
    this.strategy = StrategyMap[difficulty];
    Logger.log(EventActor.Bot, `Bot Strategy changed to: ${difficulty}`);
  }

  public getMove(game: XOXOGame) {
    return this.strategy.determineMove(game, this.userId);
  }

  async makeMove(game: XOXOGame): Promise<Position | null> {
    const move = await this.getMove(game);
    return move ? move : null;
  }
}
