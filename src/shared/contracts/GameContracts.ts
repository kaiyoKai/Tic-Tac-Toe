export interface BoardSnapshot {
  size: number;
  state: number[];
  updatedAt: number;
}

export const BoardTransformDegrees = {
  Ninety: 90,
  OneEighty: 180,
  TwoSeventy: 270,
} as const;

export type BoardTransformDegrees =
  (typeof BoardTransformDegrees)[keyof typeof BoardTransformDegrees];

export interface MoveRequest {
  lobbyId: string;
  playerId: string;
  board: BoardSnapshot;
  action?: "place";
  row: number;
  col: number;
}

export interface RotateBoardRequest {
  lobbyId: string;
  playerId: string;
  board: BoardSnapshot;
  action: "rotate";
  degrees: BoardTransformDegrees;
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
