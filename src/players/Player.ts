import type { PlayerType } from "../types/Common.js";

export class Player {
  constructor(
    public type: PlayerType,
    public symbol: string,
  ) {}
}
