export const DOM_ID = {
  GRID: "grid",
  TURN_PLAYER: "turnplayerlabel",
  TURN_NUMBER: "turnnumlabel",
  WINNER_LABEL: "winnerLabel",
  RESET_BTN: "reset",

  SIDEBAR: "sidebar",
  SIDEBAR_TOGGLE: "toggle-btn",

  CHAT_SIDEBAR: "chat-sidebar",
  CHAT_TOGGLE: "chat-toggle-btn",
  CHAT_MESSAGES: "chat-messages",
  CHAT_INPUT: "nachricht",
  CHAT_SEND: "chat-send",

  LOBBY_DIALOG: "lobby-dialog",
  PROFILE_DIALOG: "profile-dialog",
  BROWSER_DIALOG: "lobby-browser-dialog",

  OPEN_SETTINGS: "open-settings-btn",
  OPEN_PROFILE: "open-profile-btn",
  OPEN_BROWSER: "lobby-browser-btn",

  CLOSE_LOBBY: "close-lobby-btn",
  CLOSE_PROFILE: "close-profile-btn",
  APPLY_SETTINGS: "apply",

  MODE_SELECT: "mode",
  DIFFICULTY_SELECT: "difficulty",
  DIFFICULTY_LABEL: "difficulty-label",
  BOARD_SIZE: "boardsize",
  WIN_CON: "wincon",
  THEME_SELECT: "colors",
  SHAPE_OPTIONS: 'input[name="shape"]',
} as const;

export const CSS_CLASS = {
  HIDEABLE: "hideable",
  SHOW: "show",
  OPEN: "open",
  CLOSE: "close",
  ROTATE: "rotate",
  ACTIVE: "active",

  WIN: "win",
  SPIN: "spin",
  DRAW_LINE: "draw-line",

  // Components
  DROPDOWN_BTN: "dropdown-btn",
  SUB_MENU: "sub-menu",
  CLOSE_BTN: "close-btn",
} as const;

export const CSS_VAR = {
  BOARD_SIZE: "--boardsize",
  ANGLE: "--angle",
  LINE_LENGTH: "--line-length",
  AFTER_WIDTH: "--after-width",
  LINE_TOP: "--line-top",
  LINE_LEFT: "--line-left",
} as const;
