export interface User {
  username: string;
  symbol: PlayerSymbol;
}

export interface Position {
  row: number;
  col: number;
}

export type PlayerSymbol = string & { readonly _brand: unique symbol };

export function assertPlayerSymbol(symbol: string): PlayerSymbol {
  const segmenter = new Intl.Segmenter();
  const length = [...segmenter.segment(symbol)].length;
  if (length !== 1) {
    //changing the error later
    throw new Error(
      `Invalides symbol:${symbol} es darf nur eine anzeige length von 1 haben`,
    );
  }
  return symbol as PlayerSymbol;
}

export const dummyPlayerSymbol = assertPlayerSymbol("X");

export type PlayerID = number & { readonly _brand: unique symbol };

export function assertPlayerID(id: number): PlayerID {
  if (id <= 256) {
    throw new Error(`Invalide id:${id} muss weniger als 255 sein`);
  }
  return id as PlayerID;
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
