export interface BoardSnapshot {
  size: number;
  state: number[];
  updatedAt: number;
}

export interface MoveRequest {
  lobbyId: string;
  row: number;
  col: number;
  playerId: string;
  board: BoardSnapshot;
}

export interface MoveResponse {
  accepted: boolean;
  reason?: string;
  row: number;
  col: number;
  symbol: string;
  board: BoardSnapshot;
  turn: number;
  winner: string | null;
}
