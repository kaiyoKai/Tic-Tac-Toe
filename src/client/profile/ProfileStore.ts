import { assertPlayerSymbol, type PlayerSymbol } from "@shared/Common.js";
import {
  ProfileStorageKey,
  ProfileButtonRadius,
  type ProfileDraft,
  type ProfilePreferences,
  type UserProfile,
} from "@shared/contracts/ProfileContracts.js";

const DEFAULT_PREFERENCES: ProfilePreferences = {
  themeName: "Catppuccin",
  buttonRadius: ProfileButtonRadius.Square,
  chatOpenByDefault: false,
};

export class ProfileStore {
  load(): UserProfile | null {
    const raw = localStorage.getItem(ProfileStorageKey.Profile);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as UserProfile;
      if (!parsed?.username || !parsed?.symbol) return null;
      return this.normalize(parsed);
    } catch {
      return null;
    }
  }

  save(draft: ProfileDraft): UserProfile {
    const profile = this.normalize({
      id: this.load()?.id ?? crypto.randomUUID(),
      username: draft.username.trim(),
      symbol: draft.symbol,
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...draft.preferences,
      },
      updatedAt: Date.now(),
    });

    localStorage.setItem(ProfileStorageKey.Profile, JSON.stringify(profile));
    localStorage.setItem(
      ProfileStorageKey.Theme,
      profile.preferences.themeName,
    );
    localStorage.setItem(
      ProfileStorageKey.ButtonRadius,
      profile.preferences.buttonRadius,
    );

    return profile;
  }

  clear(): void {
    localStorage.removeItem(ProfileStorageKey.Profile);
  }

  ensure(): UserProfile {
    return this.load() ?? this.save(this.getDefaultDraft());
  }

  isComplete(): boolean {
    return this.load() !== null;
  }

  updatePreferences(preferences: Partial<ProfilePreferences>): UserProfile {
    const current = this.ensure();
    return this.save({
      username: current.username,
      symbol: current.symbol,
      preferences: {
        ...current.preferences,
        ...preferences,
      },
    });
  }

  getDefaultDraft(): ProfileDraft {
    return {
      username: "Kai",
      symbol: this.getSavedSymbol() ?? this.defaultSymbol(),
      preferences: {
        themeName: localStorage.getItem(ProfileStorageKey.Theme) ?? "Catppuccin",
        buttonRadius:
          (localStorage.getItem(ProfileStorageKey.ButtonRadius) as
            | "50%"
            | "5%"
            | null) ?? ProfileButtonRadius.Square,
      },
    };
  }

  getSavedSymbol(): PlayerSymbol | null {
    const profile = this.load();
    return profile?.symbol ?? null;
  }

  private defaultSymbol(): PlayerSymbol {
    return assertPlayerSymbol("X");
  }

  private normalize(profile: UserProfile): UserProfile {
    return {
      ...profile,
      username: profile.username.trim(),
      symbol: assertPlayerSymbol(profile.symbol),
      preferences: {
        ...DEFAULT_PREFERENCES,
        ...profile.preferences,
      },
      updatedAt: profile.updatedAt || Date.now(),
    };
  }
}

export const profileStore = new ProfileStore();
