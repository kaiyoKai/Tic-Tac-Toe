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

export type ThemeKey = keyof typeof ThemeMap;

export type ThemeValue = (typeof ThemeMap)[ThemeKey];
