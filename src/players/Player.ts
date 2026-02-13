import type { PlayerSymbol, Position } from "../types/Common.ts";

export interface Player {
  symbol: PlayerSymbol;
  userName: string;
  userId: number;
  makeMove(): Promise<Position> | undefined;
}
