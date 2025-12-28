import type { PlayerType } from "./IPlayer.js";

export class Player {
  constructor(
    public type: PlayerType,
    public symbol: string,
  ) {}
}
