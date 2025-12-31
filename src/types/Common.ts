export interface Position {
  row: number;
  col: number;
}

export const Difficulty = {
  Easy: "easy",
  Medium: "medium",
  Hard: "hard",
} as const;
export type Difficulty = (typeof Difficulty)[keyof typeof Difficulty];

export const WinType = {
  Horizontal: "horizontal",
  Vertical: "vertical",
  DiagonalMain: "diag-main",
  DiagonalAnti: "diag-anti",
  Draw: "draw",
} as const;
export type WinType = (typeof WinType)[keyof typeof WinType];

export const PlayerType = {
  Human: "human",
  Bot: "bot",
  Remote: "remote",
} as const;
export type PlayerType = (typeof PlayerType)[keyof typeof PlayerType];

export const GameMode = {
  Local: "local",
  Bot: "bot",
  Online: "online",
} as const;
export type GameMode = (typeof GameMode)[keyof typeof GameMode];

export const MoveStatus = {
  SUCCESS: "SUCCESS",
  OCCUPIED: "OCCUPIED",
  GAME_OVER: "GAME_OVER",
} as const;
export type MoveStatus = (typeof MoveStatus)[keyof typeof MoveStatus];

export interface PlayerConfig {
  name?: string;
  symbol: string;
  type: PlayerType;
  difficulty?: Difficulty;
}
export interface MoveResponse {
  status: MoveStatus;
  gameResult: IGameResult | null;
}

export interface IGameResult {
  winner: string | null;
  type: WinType;
  positions: Position[];
}
