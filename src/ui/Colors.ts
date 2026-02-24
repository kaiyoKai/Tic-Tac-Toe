export const ThemeMap = {
  Catppuccin: "catppuccin",
  Dracula: "dracula",
  Gruvbox: "gruvbox",
  Dark: "dark",
  Light: "light",
  Sakura: "sakura",
  Matcha: "matcha",
  Lavender: "lavender",
} as const;

export type ThemeType = (typeof ThemeMap)[keyof typeof ThemeMap];
