import type { PlayerSymbol, Position } from "@shared/Common.js";
import { XOXOGame } from "@engine/XOXOGame.js";

export interface Player {
  symbol: PlayerSymbol;
  userName: string;
  userId: number;

  makeMove(game: XOXOGame): Promise<Position | null>;
}
