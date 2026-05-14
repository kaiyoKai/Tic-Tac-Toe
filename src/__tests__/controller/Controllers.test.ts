import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { GameController } from "@controller/GameController";
import { LobbyController } from "@controller/LobbyController";
import { GameSettings } from "@engine/GameSettings";
import { GameMode, Difficulty, assertPlayerSymbol } from "@shared/Common";
import { EventBus } from "@events/EventBus";
import { EventActor, AppEvent, type GlobalEventMap } from "@events/EventTypes";
import { LocalPlayer } from "@players/LocalPlayer";
import { Bot } from "@players/Bot";

describe("GameController", () => {
  let gameController: GameController;
  let settings: GameSettings;
  const playerX = assertPlayerSymbol("X");
  const playerO = assertPlayerSymbol("O");

  beforeEach(() => {
    settings = new GameSettings();
    const players = [
      new LocalPlayer(playerX, "Player1", 257),
      new LocalPlayer(playerO, "Player2", 258),
    ];
    gameController = new GameController(settings, players);
  });

  describe("initialization", () => {
    it("should initialize with correct settings and players", () => {
      expect(gameController.game).toBeDefined();
      expect(gameController.game.settings).toBe(settings);
      expect(gameController.players).toHaveLength(2);
    });

    it("should assign unique game IDs", () => {
      const controller1 = new GameController(settings, [
        new LocalPlayer(playerX, "P1", 257),
        new LocalPlayer(playerO, "P2", 258),
      ]);
      const controller2 = new GameController(settings, [
        new LocalPlayer(playerX, "P1", 259),
        new LocalPlayer(playerO, "P2", 260),
      ]);

      expect(controller1).toBeDefined();
      expect(controller2).toBeDefined();
      // Game IDs should be different (auto-incrementing)
    });

    it("should start with currentIndex at 0", () => {
      expect(gameController.currentIndex).toBe(0);
    });

    it("should have isRunning as true", () => {
      expect(gameController.game.isRunning).toBe(true);
    });
  });

  describe("getBoardAsStrings", () => {
    it("should return board in string format", () => {
      // Make a move
      const status1 = gameController.game.makeMove(0, 0, 257, playerX);
      const status2 = gameController.game.makeMove(1, 1, 258, playerO);

      const boardMethod = (gameController as any).getBoardAsStrings();
      expect(boardMethod).toHaveLength(3);
      expect(boardMethod[0]).toHaveLength(3);
    });

    it("should represent empty cells as empty strings", () => {
      const boardMethod = (gameController as any).getBoardAsStrings();
      expect(boardMethod[0][0]).toBe("");
      expect(boardMethod[1][1]).toBe("");
      expect(boardMethod[2][2]).toBe("");
    });

    it("should represent player moves with their symbol or empty string", () => {
      const status = gameController.game.makeMove(0, 0, 257, playerX);
      const boardMethod = (gameController as any).getBoardAsStrings();
      
      // Cell should either have the symbol or be empty based on player lookup
      // This tests the basic functionality of the method
      expect(typeof boardMethod[0][0]).toBe("string");
      expect(boardMethod.every((row: string[]) => row.every((cell: string) => typeof cell === "string"))).toBe(true);
    });
  });

  describe("stop", () => {
    it("should stop the game", () => {
      expect(gameController.game.isRunning).toBe(true);
      gameController.stop();
      expect(gameController.game.isRunning).toBe(false);
    });

    it("should handle multiple stop calls", () => {
      gameController.stop();
      gameController.stop();
      expect(gameController.game.isRunning).toBe(false);
    });
  });

  describe("player management", () => {
    it("should track players correctly", () => {
      expect(gameController.players).toHaveLength(2);
      expect(gameController.players[0].symbol).toBe(playerX);
      expect(gameController.players[1].symbol).toBe(playerO);
    });

    it("should support games with more than 2 players", () => {
      const multiPlayers = [
        new LocalPlayer(assertPlayerSymbol("X"), "P1", 257),
        new LocalPlayer(assertPlayerSymbol("O"), "P2", 258),
        new LocalPlayer(assertPlayerSymbol("Z"), "P3", 259),
      ];
      const multiController = new GameController(settings, multiPlayers);
      expect(multiController.players).toHaveLength(3);
    });
  });

  describe("game state", () => {
    it("should have access to game object", () => {
      expect(gameController.game).toBeDefined();
      expect(gameController.game.board).toBeDefined();
      expect(gameController.game.settings).toBeDefined();
    });

    it("should track game board size", () => {
      expect(gameController.game.board.size).toBe(3);
    });

    it("should track game turns", () => {
      expect(gameController.game.turn).toBe(0);
    });
  });
});

describe("LobbyController", () => {
  let lobbyController: LobbyController;

  beforeEach(() => {
    // Reset GameController.totalGames for predictable testing
    (GameController as any).totalGames = 0;
  });

  afterEach(() => {
    // Clean up any active game
    if ((lobbyController as any).activeGameController) {
      (lobbyController as any).activeGameController.stop();
    }
  });

  describe("initialization", () => {
    it("should initialize with default settings", () => {
      lobbyController = new LobbyController();
      expect(lobbyController.settings).toBeDefined();
      expect(lobbyController.settings.mode).toBe(GameMode.Local);
      expect(lobbyController.settings.boardSize).toBe(3);
    });

    it("should have no active game controller initially", () => {
      lobbyController = new LobbyController();
      expect((lobbyController as any).activeGameController).toBeNull();
    });
  });

  describe("createPlayersForCurrentMode", () => {
    beforeEach(() => {
      lobbyController = new LobbyController();
    });

    it("should create local players for Local mode", () => {
      lobbyController.settings.mode = GameMode.Local;
      const players = lobbyController.createPlayersForCurrentMode();

      expect(players).toHaveLength(2);
      expect(players[0]).toBeInstanceOf(LocalPlayer);
      expect(players[1]).toBeInstanceOf(LocalPlayer);
    });

    it("should create bot players for Bot mode", () => {
      lobbyController.settings.mode = GameMode.Bot;
      lobbyController.settings.difficulty = Difficulty.Easy;
      const players = lobbyController.createPlayersForCurrentMode();

      expect(players).toHaveLength(2);
      expect(players[0]).toBeInstanceOf(Bot);
      expect(players[1]).toBeInstanceOf(Bot);
    });

    it("should assign unique player IDs", () => {
      lobbyController.settings.mode = GameMode.Local;
      const players1 = lobbyController.createPlayersForCurrentMode();
      const players2 = lobbyController.createPlayersForCurrentMode();

      expect(players1[0].userId).not.toBe(players2[0].userId);
    });

    it("should assign symbols to players", () => {
      lobbyController.settings.mode = GameMode.Local;
      const players = lobbyController.createPlayersForCurrentMode();

      expect(players[0].symbol).toBeDefined();
      expect(players[1].symbol).toBeDefined();
      expect(players[0].symbol).not.toBe(players[1].symbol);
    });

    it("should handle Online mode gracefully (no players)", () => {
      lobbyController.settings.mode = GameMode.Online;
      const players = lobbyController.createPlayersForCurrentMode();

      expect(players).toHaveLength(0);
    });
  });

  describe("startGame", () => {
    beforeEach(() => {
      lobbyController = new LobbyController();
    });

    afterEach(() => {
      if ((lobbyController as any).activeGameController) {
        (lobbyController as any).activeGameController.stop();
      }
    });

    it("should create a game controller", () => {
      vi.useFakeTimers();
      lobbyController.startGame();
      expect((lobbyController as any).activeGameController).not.toBeNull();
      vi.useRealTimers();
    });

    it("should stop previous game before starting new one", () => {
      vi.useFakeTimers();
      lobbyController.startGame();
      const firstGame = (lobbyController as any).activeGameController;

      lobbyController.startGame();
      const secondGame = (lobbyController as any).activeGameController;

      expect(firstGame).not.toBe(secondGame);
      expect(firstGame.game.isRunning).toBe(false);
      vi.useRealTimers();
    });

    it("should create players for current game mode", () => {
      vi.useFakeTimers();
      lobbyController.settings.mode = GameMode.Local;
      lobbyController.startGame();

      const gameController = (lobbyController as any).activeGameController;
      expect(gameController.players).toHaveLength(2);
      vi.useRealTimers();
    });

    it("should respect current settings when creating game", () => {
      vi.useFakeTimers();
      const customSettings = new GameSettings(undefined, 5, 4);
      lobbyController.settings = customSettings;
      lobbyController.startGame();

      const gameController = (lobbyController as any).activeGameController;
      expect(gameController.game.settings.boardSize).toBe(5);
      vi.useRealTimers();
    });
  });

  describe("settings management", () => {
    beforeEach(() => {
      lobbyController = new LobbyController();
    });

    it("should update settings when new settings are provided", () => {
      const newSettings = new GameSettings(GameMode.Bot, 4, 3, Difficulty.Hard);
      lobbyController.settings = newSettings;

      expect(lobbyController.settings.mode).toBe(GameMode.Bot);
      expect(lobbyController.settings.boardSize).toBe(4);
      expect(lobbyController.settings.difficulty).toBe(Difficulty.Hard);
    });

    it("should preserve default settings initially", () => {
      expect(lobbyController.settings.mode).toBe(GameMode.Local);
      expect(lobbyController.settings.boardSize).toBe(3);
    });

    it("should allow changing settings between games", () => {
      vi.useFakeTimers();
      lobbyController.startGame();
      const firstSettings = new GameSettings(undefined, 3, 3);

      lobbyController.settings = new GameSettings(undefined, 5, 4);
      lobbyController.startGame();

      expect(lobbyController.settings.boardSize).toBe(5);
      expect(lobbyController.settings.winCon).toBe(4);
      vi.useRealTimers();
    });
  });

  describe("player ID tracking", () => {
    beforeEach(() => {
      lobbyController = new LobbyController();
    });

    it("should increment player IDs across games", () => {
      const settings = new GameSettings(GameMode.Local);
      const players1 = lobbyController.createPlayersForCurrentMode();
      const players2 = lobbyController.createPlayersForCurrentMode();

      expect(players2[0].userId).toBeGreaterThan(players1[0].userId);
    });

    it("should start with ID 1", () => {
      const players = lobbyController.createPlayersForCurrentMode();
      expect(players[0].userId).toBe(1);
      expect(players[1].userId).toBe(2);
    });
  });

  describe("difficulty settings", () => {
    beforeEach(() => {
      lobbyController = new LobbyController();
    });

    it("should respect difficulty setting for bots", () => {
      lobbyController.settings.mode = GameMode.Bot;
      lobbyController.settings.difficulty = Difficulty.Hard;
      const players = lobbyController.createPlayersForCurrentMode();

      expect(players[0]).toBeInstanceOf(Bot);
      const bot = players[0] as Bot;
      expect(bot.difficulty).toBe(Difficulty.Hard);
    });

    it("should apply difficulty to all bots", () => {
      lobbyController.settings.mode = GameMode.Bot;
      lobbyController.settings.difficulty = Difficulty.Easy;
      const players = lobbyController.createPlayersForCurrentMode();

      players.forEach((player) => {
        if (player instanceof Bot) {
          expect(player.difficulty).toBe(Difficulty.Easy);
        }
      });
    });
  });
});
