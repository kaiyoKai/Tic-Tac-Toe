import { describe, expect, it } from "vitest";
import { Difficulty, GameMode } from "@shared/Common.js";
import { GameSettings } from "@engine/GameSettings.js";
import { LobbyPenaltyMode, LobbyVisibility } from "@shared/contracts/LobbyContracts.js";
import { mapLobbySettingsToGameSettings } from "@client/lobby/LobbySettingsAdapter.js";

describe("mapLobbySettingsToGameSettings", () => {
  it("maps lobby board rules into game settings", () => {
    const nextSettings = mapLobbySettingsToGameSettings({
      boardSize: 6,
      winCon: 4,
      gravityEnabled: true,
      rotationEnabled: true,
      moveTimeoutMs: 12000,
      maxPlayers: 4,
      allowedLocalPlayers: 1,
      maxBots: 1,
      visibility: LobbyVisibility.Public,
      autoStart: false,
      penaltyMode: LobbyPenaltyMode.Warning,
      presetId: null,
    });

    expect(nextSettings.boardSize).toBe(6);
    expect(nextSettings.winCon).toBe(4);
    expect(nextSettings.gravityEnabled).toBe(true);
    expect(nextSettings.rotationEnabled).toBe(true);
    expect(nextSettings.moveTimeoutMs).toBe(12000);
  });

  it("preserves unrelated local game settings from the provided base settings", () => {
    const baseSettings = new GameSettings(GameMode.Bot, 3, 3, Difficulty.Hard);
    const nextSettings = mapLobbySettingsToGameSettings(
      {
        boardSize: 5,
        winCon: 4,
      },
      baseSettings,
    );

    expect(nextSettings.mode).toBe(GameMode.Bot);
    expect(nextSettings.difficulty).toBe(Difficulty.Hard);
    expect(nextSettings.boardSize).toBe(5);
    expect(nextSettings.winCon).toBe(4);
  });
});
