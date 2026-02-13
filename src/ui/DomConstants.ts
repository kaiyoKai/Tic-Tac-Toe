export const DOM_ID = {
  GRID: "grid",
  TURN_PLAYER: "turnplayerlabel",
  TURN_NUMBER: "turnnumlabel",
  WINNER_LABEL: "winnerLabel",
  RESET_BTN: "reset",
  MODE_SELECT: "mode",
  DIFFICULTY_SELECT: "difficulty",
  DIFFICULTY_LABEL: "difficulty-label",
  BOARD_SIZE: "boardsize",
  WIN_CON: "wincon",
  APPLY_BTN: "apply",
  THEME_SELECT: "colors",
} as const;

export const CSS_CLASS = {
  HIDEABLE: "hideable",
  WIN: "win",
  SPIN: "spin",
  DRAW_LINE: "draw-line",
} as const;

export const CSS_VAR = {
  BOARD_SIZE: "--boardsize",
  ANGLE: "--angle",
  LINE_LENGTH: "--line-length",
} as const;
