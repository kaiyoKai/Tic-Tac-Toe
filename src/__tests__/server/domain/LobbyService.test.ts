import { describe, expect, it } from "vitest";
import { LobbyService } from "@server/domain/LobbyService";
import { assertPlayerSymbol } from "@shared/Common";

function createProfile(username: string, symbol: string) {
  return {
    username,
    symbol: assertPlayerSymbol(symbol),
    preferences: {
      themeName: "Catppuccin",
      buttonRadius: "5%" as const,
      chatOpenByDefault: false,
    },
  };
}

const baseSettings = {
  maxPlayers: 4,
  allowedLocalPlayers: 1,
  maxBots: 0,
  visibility: "public" as const,
  autoStart: false,
  boardSize: 3,
  winCon: 3,
  gravityEnabled: false,
  rotationEnabled: false,
  moveTimeoutMs: 0,
  penaltyMode: "warning" as const,
  presetId: "tic-tac-toe",
};

describe("LobbyService", () => {
  it("should create a lobby with extended settings", () => {
    const service = new LobbyService();

    const result = service.createLobby("socket-1", {
      name: "Test Lobby",
      profile: createProfile("Host", "X"),
      settings: baseSettings,
    });

    expect(result.lobby.settings.boardSize).toBe(3);
    expect(result.lobby.settings.gravityEnabled).toBe(false);
    expect(result.lobby.pendingSettingRequests).toHaveLength(0);
    expect(result.startedGame).toBeNull();
  });

  it("should transfer host ownership and keep lobby snapshots in sync", () => {
    const service = new LobbyService();
    const created = service.createLobby("socket-1", {
      name: "Transfer Lobby",
      profile: createProfile("Host", "X"),
      settings: baseSettings,
    });

    service.joinLobby("socket-2", {
      lobbyId: created.lobby.id,
      profile: createProfile("Guest", "O"),
    });

    const transfer = service.transferHost("socket-1", {
      lobbyId: created.lobby.id,
      nextHostId: "socket-2",
    });

    expect(transfer.lobby.hostId).toBe("socket-2");
    expect(transfer.transferred.nextHostId).toBe("socket-2");
    expect(transfer.lobby.members.find((member) => member.id === "socket-2")?.role).toBe("host");
  });

  it("should collect and resolve lobby setting requests", () => {
    const service = new LobbyService();
    const created = service.createLobby("socket-1", {
      name: "Settings Lobby",
      profile: createProfile("Host", "X"),
      settings: baseSettings,
    });

    service.joinLobby("socket-2", {
      lobbyId: created.lobby.id,
      profile: createProfile("Guest", "O"),
    });

    const request = service.requestSettingChange("socket-2", {
      lobbyId: created.lobby.id,
      requesterId: "socket-2",
      requesterName: "Guest",
      targetSetting: "boardSize",
      proposedValue: 6,
      reason: "Mehr Platz für das Board",
    });

    expect(request.lobby.pendingSettingRequests).toHaveLength(1);
    expect(request.request.status).toBe("pending");

    const transferred = service.transferHost("socket-1", {
      lobbyId: created.lobby.id,
      nextHostId: "socket-2",
    });
    expect(transferred.lobby.hostId).toBe("socket-2");

    const decision = service.resolveSettingRequest("socket-2", {
      lobbyId: created.lobby.id,
      requestId: request.request.id,
      decision: "accept",
    });

    expect(decision.request.status).toBe("accepted");
    expect(decision.lobby.settings.boardSize).toBe(6);
  });
});
