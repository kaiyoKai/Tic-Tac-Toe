import type { PlayerSymbol, Position } from "@shared/Common.ts";

export interface Player {
  symbol: PlayerSymbol;
  userName: string;
  userId: number;
  makeMove(): Promise<Position> | undefined;
}
