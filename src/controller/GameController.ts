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
  public players: Player[] = [];
  public currentIndex: number = 0;
  private eventBus: EventBus<GameEventMap>;
  private currentId = 0;

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
    console.log(`Initialisiere Spiel Nr. ${this.activeGameId}`);

    this.game = new TicTacToe(
      this.gameSettings.boardSize,
      this.gameSettings.winCon,
    );

    this.currentIndex = 0;
    this.setupPlayersByMode();
    this.startGameLoop(this.activeGameId);
  }

  handNewId(): number {
    return this.currentId++;
  }

  public async startGameLoop(myGameId = 0) {
    console.log(`Loop ${myGameId} gestartet.`);
    while (!this.game.gameOver && myGameId === this.activeGameId) {
      const currentPlayer = this.getCurrentPlayer();

      const move = await currentPlayer.makeMove();

      if (myGameId !== this.activeGameId) {
        console.log(`Loop ${myGameId} gestorben. (Reset war schneller)`);
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
    let nextPlayerIndex = 1 - this.currentIndex;
    return this.players[nextPlayerIndex].symbol;
  }

  setupPlayersByMode() {
    this.players = [];
    const mode = this.gameSettings.mode;

    if (mode === GameMode.Local) {
      const p1 = this.createPlayer(PlayerType.Human, "🎃", "Niklas");
      const p2 = this.createPlayer(PlayerType.Human, "🈲", "Kai");
      this.addPlayers(p1, p2);
    } else if (mode === GameMode.Bot) {
      const p1 = this.createPlayer(PlayerType.Human, "🫃", "Kai");
      const p2 = this.createPlayer(PlayerType.Bot, "🚀", "Terminator");
      this.addPlayers(p1, p2);
    }

    this.players.forEach((p) => this.game.addParticipant(p.symbol));
  }
  addPlayers(...players: Player[]) {
    this.players.push(...players);
  }
  createPlayer(
    type: PlayerType = PlayerType.Human,
    symbolInput: PlayerSymbol | string = "X",
    userName = "Test",
  ) {
    const symbol =
      typeof symbolInput === "string"
        ? assertPlayerSymbol(symbolInput)
        : symbolInput;

    if (type === PlayerType.Bot) {
      return new Bot(
        this.getSettings().difficulty,
        symbol,
        (userName += `(Bot) ${this.getSettings().difficulty}`),
        this.handNewId(),
        this.game,
      );
    } else {
      return new LocalPlayer(symbol, userName, this.handNewId(), this.eventBus);
    }
  }
  isGameOver(): boolean {
    return this.game.gameOver;
  }

  getCurrentPlayer(): Player | Bot {
    return this.players[this.currentIndex];
  }

  togglePlayer() {
    this.currentIndex = 1 - this.currentIndex;
  }

  getDifficulty(): Difficulty {
    return this.getSettings().difficulty;
  }

  async resetGame() {
    this.game.resetGame();
    this.currentIndex = 0;
  }
}
