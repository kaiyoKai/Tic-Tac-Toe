import { GameSettings } from "@engine/GameSettings.js";
import type { LobbySettings } from "@shared/contracts/LobbyContracts.js";

export function mapLobbySettingsToGameSettings(
  lobbySettings: Partial<LobbySettings>,
  baseSettings: GameSettings = new GameSettings(),
): GameSettings {
  const nextSettings = Object.assign(new GameSettings(), baseSettings, {
    boardSize: lobbySettings.boardSize ?? baseSettings.boardSize,
    winCon: lobbySettings.winCon ?? baseSettings.winCon,
    gravityEnabled:
      lobbySettings.gravityEnabled ?? baseSettings.gravityEnabled,
    rotationEnabled:
      lobbySettings.rotationEnabled ?? baseSettings.rotationEnabled,
    moveTimeoutMs: lobbySettings.moveTimeoutMs ?? baseSettings.moveTimeoutMs,
  });

  nextSettings.fixInvalidValues();
  return nextSettings;
}
