import type { PlayerSymbol, Position } from "@shared/Common.js";
import { XOXOGame } from "@engine/XOXOGame.js";

export type PlayerAction =
  | { kind: "place"; position: Position }
  | { kind: "rotate"; degrees: 90 | 180 | 270 };

export interface Player {
  symbol: PlayerSymbol;
  userName: string;
  userId: number;

  makeMove(game: XOXOGame): Promise<PlayerAction | null>;
}
