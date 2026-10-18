import type { PlayerSymbol, Position } from "@shared/Common.js";
import type { Player } from "./Player";
import type { XOXOGame } from "@game/engine/XOXOGame";

export class LocalPlayer implements Player {
  constructor(
    public symbol: PlayerSymbol,
    public userName: string,
    public userId: number,
  ) {}
  makeMove(game: XOXOGame): Promise<Position | null> {
    throw new Error("Method not implemented.");
  }
}
