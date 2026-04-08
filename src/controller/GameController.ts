import TicTacToe from "@engine/TicTacToe.js";
import { Bot } from "@players/Bot.js";
import { GameSettings } from "@engine/GameSettings.js";
import {
  assertPlayerSymbol,
  MoveStatus,
  PlayerType,
  type PlayerSymbol,
} from "@shared/Common.js";
import { Difficulty, GameMode } from "@shared/Common.js";
import type { Player } from "@players/Player.js";

import { globalEventBus } from "@events/EventBus.ts";
import { EventActor, AppEvent } from "@events/EventTypes.js";
import { LocalPlayer } from "@players/LocalPlayer.js";
import { Logger } from "@shared/Logger.js";

interface GameControllerOptions {
  mode?: GameMode;
  boardSize?: number;
  winCon?: number;
  difficulty?: Difficulty;
}

export type PlayerID = number & { readonly _brand: unique symbol };
export function assertPlayerID(id: number): PlayerID {
  if (id >= 256 || id === 0) {
    throw new Error(`Invalide id:${id} muss weniger als 255 sein`);
  }
  return id as PlayerID;
}

export class GameController {
  public gameSettings: GameSettings;
  public game: TicTacToe;

  public players: Map<number, Player> = new Map();
  private playerOrder: number[] = [];

  public currentIndex: number = 0;
  private currentPlayerId = assertPlayerID(1);
  private activeGameId = 0;
  private resetTimeout: number | null = null;

  constructor({
    mode = "local",
    boardSize = 3,
    winCon = 3,
    difficulty = "medium",
  }: GameControllerOptions = {}) {
    this.gameSettings = new GameSettings(mode, boardSize, winCon, difficulty);

    this.initNewGame();

    globalEventBus.on(AppEvent.UI.ResetRequested, EventActor.Controller, () =>
      this.handleReset(),
    );

    globalEventBus.on(
      AppEvent.UI.SettingsChangeRequested,
      EventActor.Controller,
      (data) => {
        this.applySettings(data);
        this.handleReset();

        globalEventBus.emit(
          AppEvent.Game.SettingsChanged,
          EventActor.Controller,
          this.gameSettings,
        );
      },
    );
  }

  private handleReset() {
    this.activeGameId++;

    if (this.resetTimeout !== null) {
      clearTimeout(this.resetTimeout);
    }

    const gameIdForThisReset = this.activeGameId;

    this.resetTimeout = setTimeout(() => {
      if (this.activeGameId !== gameIdForThisReset) return;

      this.initNewGame();
      globalEventBus.emit(AppEvent.Game.Reset, EventActor.Controller, {
        turn: this.getTurn(),
        nextPlayerSymbol: this.getNextPlayerSymbol(),
      });
      this.resetTimeout = null;
    }, 0) as unknown as number;
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

  getNewPlayerID(): PlayerID {
    return assertPlayerID(this.currentPlayerId++);
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

      if (!move) return;

      const moveResult = this.game.move(
        move.row,
        move.col,
        currentPlayer.symbol,
      );

      if (
        moveResult.MoveStatus === MoveStatus.SUCCESS ||
        moveResult.MoveStatus === MoveStatus.GAME_OVER
      ) {
        globalEventBus.emit(AppEvent.Game.MoveMade, EventActor.Controller, {
          row: move.row,
          col: move.col,
          symbol: currentPlayer.symbol,
          turn: this.getTurn(),
          nextPlayerSymbol: this.getNextPlayerSymbol(),
          grid: this.getBoard(),
        });
        if (moveResult.gameResult) {
          globalEventBus.emit(
            AppEvent.Game.Finished,
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

    this.currentPlayerId = assertPlayerID(1);
    this.playerOrder = [];
    this.players.clear();

    if (mode === GameMode.Local) {
      this.addPlayer(this.createPlayer(PlayerType.Human, "🎮️", "Niklas"));
      this.addPlayer(this.createPlayer(PlayerType.Human, "❤️", "Nico"));
    } else if (mode === GameMode.Bot) {
      this.addPlayer(this.createPlayer(PlayerType.Bot, "💅", "Aleyna"));
      this.addPlayer(this.createPlayer(PlayerType.Bot, "🇺🇲", "Donald-Trump"));
    }

    this.playerOrder.map((id, index) =>
      Logger.log(
        EventActor.Controller,
        `Spielzug reihenfolge: PlayerID:${id} UserName:${this.players.get(id).userName} Position:[${index}]`,
      ),
    );
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
      return new LocalPlayer(symbol, userName, id);
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
