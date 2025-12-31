export const ThemeMap = {
  Dark: "dark",
  Dracula: "dracula",
  Gruvbox: "gruvbox",
  Catppuccin: "catppuccin",
  Light: "light",
  Sakura: "sakura",
  Matcha: "matcha",
  Lavender: "lavender",
} as const;

export type ThemeType = (typeof ThemeMap)[keyof typeof ThemeMap];
