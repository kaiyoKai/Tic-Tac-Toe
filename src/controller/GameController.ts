import TicTacToe from "../core/TicTacToe.js";
import { Bot } from "../players/Bot.js";
import { GameSettings } from "../core/GameSettings.js";
import {
  assertPlayerSymbol,
  MoveStatus,
  PlayerType,
  type PlayerSymbol,
} from "../types/Common.js";
import { Difficulty, GameMode } from "../types/Common.js";
import type { Player } from "../players/Player.ts";
import type EventBus from "../services/EventBus.ts";
import { EventActor, type GameEventMap } from "../types/Events.ts";
import { LocalPlayer } from "../players/LocalPlayer.ts";
import { Logger } from "../services/Logger.ts";

interface GameControllerOptions {
  bus: EventBus<GameEventMap>;
  mode?: GameMode;
  boardSize?: number;
  winCon?: number;
  difficulty?: Difficulty;
}

export class GameController {
  public gameSettings: GameSettings;
  public game: TicTacToe;

  public players: Map<number, Player> = new Map();
  private playerOrder: number[] = [];

  public currentIndex: number = 0;
  private eventBus: EventBus<GameEventMap>;
  private currentPlayerId = 0;

  private activeGameId = 0;
  constructor({
    bus,
    mode = "local",
    boardSize = 3,
    winCon = 3,
    difficulty = "medium",
  }: GameControllerOptions) {
    this.eventBus = bus;
    this.gameSettings = new GameSettings(mode, boardSize, winCon, difficulty);

    this.initNewGame();

    this.eventBus.on("ui:reset-requested", EventActor.Controller, () =>
      this.handleReset(),
    );

    this.eventBus.on(
      "ui:settings-change-requested",
      EventActor.Controller,
      (data) => {
        this.applySettings(data);
        this.handleReset();
        this.eventBus.emit(
          "game:settings-changed",
          EventActor.Controller,
          this.gameSettings,
        );
      },
    );
  }

  private handleReset() {
    this.activeGameId++;
    //Damit die listener im localplayer objekt sich rechtzeitig abmelden
    setTimeout(() => {
      this.initNewGame();
      this.eventBus.emit("game:reset", EventActor.Controller, {
        turn: this.getTurn(),
        nextPlayerSymbol: this.getNextPlayerSymbol(),
      });
    }, 0);
  }
  private initNewGame() {
    Logger.log(
      EventActor.Controller,
      `Initialisiere Spiel Nr. ${this.activeGameId}`,
    );

    this.game = new TicTacToe(
      this.gameSettings.boardSize,
      this.gameSettings.winCon,
    );

    this.currentIndex = 0;
    this.setupPlayersByMode();
    this.startGameLoop(this.activeGameId);
  }

  getNewPlayerID(): number {
    return this.currentPlayerId++;
  }

  public async startGameLoop(myGameId = 0) {
    Logger.log(EventActor.Controller, `Loop ${myGameId} gestartet.`);
    while (!this.game.gameOver && myGameId === this.activeGameId) {
      const currentPlayer = this.getCurrentPlayer();

      const move = await currentPlayer.makeMove();
      if (myGameId !== this.activeGameId) {
        Logger.log(
          EventActor.Controller,
          `Loop ${myGameId} gestorben. (Reset war schneller)`,
        );
        return;
      }

      const moveResult = this.game.move(
        move.row,
        move.col,
        currentPlayer.symbol,
      );

      if (
        moveResult.MoveStatus === MoveStatus.SUCCESS ||
        moveResult.MoveStatus === MoveStatus.GAME_OVER
      ) {
        this.eventBus.emit("game:move-made", EventActor.Controller, {
          row: move.row,
          col: move.col,
          symbol: currentPlayer.symbol,
          turn: this.getTurn(),
          nextPlayerSymbol: this.getNextPlayerSymbol(),
        });

        if (moveResult.gameResult) {
          this.eventBus.emit(
            "game:finished",
            EventActor.Controller,
            moveResult.gameResult,
          );
        } else {
          this.togglePlayer();
        }
      }
    }
  }

  public applySettings(newSettings: GameSettings) {
    if (!newSettings.isValid()) {
      newSettings.fixInvalidValues();
    }
    this.gameSettings = newSettings;
  }
  getSettings(): GameSettings {
    return this.gameSettings;
  }
  getBoard(): (string | null)[][] {
    return this.game.board;
  }
  getBoardSize(): number {
    return this.game.getBoardLength();
  }
  getWinCon(): number {
    return this.gameSettings.winCon;
  }
  getMode(): GameMode {
    return this.gameSettings.mode;
  }
  getTurn(): number {
    return this.game.turn;
  }
  getNextPlayerSymbol(): PlayerSymbol {
    const nextIdx = (this.currentIndex + 1) % this.playerOrder.length;
    const nextPlayerId = this.playerOrder[nextIdx];
    return this.players.get(nextPlayerId)!.symbol;
  }

  setupPlayersByMode() {
    const mode = this.gameSettings.mode;

    this.currentPlayerId = 0;
    this.playerOrder = [];
    this.players.clear();

    if (mode === GameMode.Local) {
      this.addPlayer(this.createPlayer(PlayerType.Human, "🎮️", "Niklas"));
      this.addPlayer(this.createPlayer(PlayerType.Human, "🫐", "Kai"));
      this.addPlayer(this.createPlayer(PlayerType.Human, "❤️", "Nico"));
    } else if (mode === GameMode.Bot) {
      this.addPlayer(this.createPlayer(PlayerType.Bot, "🎁", "Niklas"));
      this.addPlayer(this.createPlayer(PlayerType.Bot, "🫐", "Kai"));
      this.addPlayer(this.createPlayer(PlayerType.Bot, "🦅", "Adrian"));
      this.addPlayer(this.createPlayer(PlayerType.Bot, "🇺🇲", "Donald Trump"));
    }
  }

  addPlayer(player: Player) {
    const id = player.userId;
    this.players.set(id, player);
    this.playerOrder.push(id);
  }
  createPlayer(type: PlayerType, symbolInput: string, userName: string) {
    const id = this.getNewPlayerID();
    const symbol = assertPlayerSymbol(symbolInput);

    if (type === PlayerType.Bot) {
      return new Bot(
        this.gameSettings.difficulty,
        symbol,
        userName,
        id,
        this.game,
        this.players,
      );
    } else {
      return new LocalPlayer(symbol, userName, id, this.eventBus);
    }
  }
  isGameOver(): boolean {
    return this.game.gameOver;
  }

  getCurrentPlayer(): Player {
    const currentPlayerID = this.playerOrder[this.currentIndex];
    return this.players.get(currentPlayerID);
  }
  togglePlayer() {
    if (this.playerOrder.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.playerOrder.length;

    const activeId = this.playerOrder[this.currentIndex];

    Logger.log(EventActor.Controller, `Spieler mit ID ${activeId} ist am Zug.`);
  }

  getDifficulty(): Difficulty {
    return this.getSettings().difficulty;
  }

  async resetGame() {
    this.game.resetGame();
    this.currentIndex = 0;
  }
}
