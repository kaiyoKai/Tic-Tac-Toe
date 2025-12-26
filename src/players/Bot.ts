import TicTacToe from "../core/TicTacToe.js";
import type { MoveStrategy } from "./strategies/MovesStrategy.ts";
import { RandomStrategy } from "./strategies/RandomStrategy.js";

export class Bot {
  public type = "bot" as const;
  public symbol: string;
  public game: TicTacToe;
  private strategy: MoveStrategy;

  constructor(difficulty: "easy" | "hard", symbol: string, game: TicTacToe) {
    this.symbol = symbol;
    this.game = game;

    if (difficulty === "easy") {
      this.strategy = new RandomStrategy();
    } else {
      this.strategy = new RandomStrategy(); // --> hier bitte spaeter hard mode hinzuefugen Kai (:
    }
  }

  getMove() {
    return this.strategy.determineMove(this.game, this.symbol);
  }
}
