import type { LobbyPreset, LobbySettings } from "@shared/contracts/LobbyContracts.js";

const STORAGE_KEY = "xoxo.lobby-presets";

const BUILT_IN_PRESETS: LobbyPreset[] = [
  {
    id: "tic-tac-toe",
    name: "Tic-Tac-Toe",
    builtIn: true,
    createdAt: 0,
    updatedAt: 0,
    settings: {
      maxPlayers: 4,
      allowedLocalPlayers: 1,
      maxBots: 0,
      visibility: "public",
      autoStart: false,
      boardSize: 3,
      winCon: 3,
      gravityEnabled: false,
      rotationEnabled: false,
      moveTimeoutMs: 0,
      penaltyMode: "warning",
      presetId: "tic-tac-toe",
    },
  },
  {
    id: "connect-four",
    name: "Connect Four",
    builtIn: true,
    createdAt: 0,
    updatedAt: 0,
    settings: {
      maxPlayers: 4,
      allowedLocalPlayers: 1,
      maxBots: 0,
      visibility: "public",
      autoStart: false,
      boardSize: 6,
      winCon: 4,
      gravityEnabled: true,
      rotationEnabled: false,
      moveTimeoutMs: 0,
      penaltyMode: "warning",
      presetId: "connect-four",
    },
  },
];

export class LobbyPresetStore {
  list(): LobbyPreset[] {
    return [...BUILT_IN_PRESETS, ...this.loadCustomPresets()];
  }

  get(presetId: string | null | undefined): LobbyPreset | null {
    if (!presetId) return null;
    return this.list().find((preset) => preset.id === presetId) ?? null;
  }

  save(name: string, settings: LobbySettings): LobbyPreset {
    const preset: LobbyPreset = {
      id: crypto.randomUUID(),
      name: name.trim() || "Custom Preset",
      builtIn: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      settings: {
        ...settings,
        presetId: null,
      },
    };

    const customPresets = this.loadCustomPresets();
    customPresets.push(preset);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
    return preset;
  }

  delete(presetId: string): void {
    const customPresets = this.loadCustomPresets().filter(
      (preset) => preset.id !== presetId,
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customPresets));
  }

  private loadCustomPresets(): LobbyPreset[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as LobbyPreset[];
      return parsed.filter((preset) => !preset.builtIn);
    } catch {
      return [];
    }
  }
}

export const lobbyPresetStore = new LobbyPresetStore();
