import { describe, it, expect, vi, beforeEach } from "vitest";
import { GameSettings } from "../src/game/engine/GameSettings.ts";
import { LocalPlayer } from "../src/game/players/LocalPlayer.ts";
import { assertPlayerSymbol, GameMode } from "../src/shared/Common.ts";
import { LocalGameControllerImpl } from "@game/controllers/LocalGameController.ts";

describe("LocalGameController (TDD Stub Tests)", () => {
  let mockHost: any;
  let settings: GameSettings;
  let players: any[];

  beforeEach(() => {
    // Mock Lit ReactiveControllerHost
    mockHost = {
      addController: vi.fn(),
      removeController: vi.fn(),
      requestUpdate: vi.fn(),
    };

    settings = new GameSettings(GameMode.Local, 3, 3);
    players = [
      new LocalPlayer(assertPlayerSymbol("X"), "Niklas", 1),
      new LocalPlayer(assertPlayerSymbol("O"), "Michi", 2),
    ];
  });

  it("should register controller and instantiate XOXOGame in constructor", () => {
    const controller = new LocalGameControllerImpl();

    // Test TODO 1
    expect(mockHost.addController).toHaveBeenCalledWith(controller);

    // Test TODO 2
    expect(controller.game).toBeDefined();
    expect(controller.game.board.size).toBe(3);
    expect(controller.players).toEqual(players);
  });

  it("should set active flag and initialize correctly on hostConnected", () => {
    const controller = new LocalGameControllerImpl();
    controller.hostConnected();

    // Test TODO 3
    expect(controller.currentIndex).toBe(0);
  });

  it("should complete a valid move, switch player, increment turn and call requestUpdate", () => {
    const controller = new LocalGameControllerImpl();
    controller.hostConnected();

    // Test TODO 5
    const success = controller.makeMove(0, 0); // Player 1 (X) moves to 0,0
    expect(success).toBe(true);
    expect(controller.game.board.getCell(0, 0)).toBe(1); // Player ID 1
    expect(controller.currentIndex).toBe(1); // Switched to Player 2
    expect(mockHost.requestUpdate).toHaveBeenCalled();
  });

  it("should reject illegal move on occupied cell", () => {
    const controller = new LocalGameControllerImpl();
    controller.hostConnected();

    controller.makeMove(0, 0); // X moves to 0,0
    mockHost.requestUpdate.mockClear();

    const success = controller.makeMove(0, 0); // O tries to move to 0,0
    expect(success).toBe(false);
    expect(controller.currentIndex).toBe(1); // Still Player 2's turn
    expect(mockHost.requestUpdate).not.toHaveBeenCalled();
  });

  it("should detect win, stop game and call requestUpdate", () => {
    const controller = new LocalGameControllerImpl(mockHost, settings, players);
    controller.hostConnected();

    // Moves sequence for vertical win:
    // P1 (0,0) -> P2 (0,1)
    // P1 (1,0) -> P2 (1,1)
    // P1 (2,0) -> win for P1
    controller.makeMove(0, 0);
    controller.makeMove(0, 1);
    controller.makeMove(1, 0);
    controller.makeMove(1, 1);

    mockHost.requestUpdate.mockClear();
    const success = controller.makeMove(2, 0);

    expect(success).toBe(true);
    expect(controller.game.isRunning).toBe(false);
    expect(controller.game.result).not.toBeNull();
    expect(controller.game.result?.winner).toBe("X");
    expect(mockHost.requestUpdate).toHaveBeenCalled();
  });
});
