import type { Position } from "../types/Common.ts";

export interface Player {
  symbol: string;
  userName: string;
  userId: number;
  makeMove(): Promise<Position> | undefined;
}
