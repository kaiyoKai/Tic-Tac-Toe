import type { PlayerSymbol } from "@shared/Common.js";

export const ProfileStorageKey = {
  Profile: "xoxo.profile",
  Theme: "user-theme",
  ButtonRadius: "btn-shape-radius",
} as const;

export const ProfileButtonRadius = {
  Rounded: "50%",
  Square: "5%",
} as const;

export type ProfileButtonRadius =
  (typeof ProfileButtonRadius)[keyof typeof ProfileButtonRadius];

export interface ProfilePreferences {
  themeName: string;
  buttonRadius: ProfileButtonRadius;
  chatOpenByDefault: boolean;
}

export interface UserProfile {
  id: string;
  username: string;
  symbol: PlayerSymbol;
  preferences: ProfilePreferences;
  updatedAt: number;
}

export interface ProfileDraft {
  username: string;
  symbol: PlayerSymbol;
  preferences?: Partial<ProfilePreferences>;
}

export function isProfileDraft(payload: unknown): payload is ProfileDraft {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as Partial<ProfileDraft>;
  return (
    typeof data.username === "string" &&
    data.username.trim().length > 0 &&
    typeof data.symbol === "string"
  );
}
