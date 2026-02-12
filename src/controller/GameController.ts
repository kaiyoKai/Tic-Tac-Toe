import TicTacToe from "../core/TicTacToe.js";
import { Bot } from "../players/Bot.js";
import { GameSettings } from "../core/GameSettings.js";
import { MoveStatus, PlayerType } from "../types/Common.js";
import { Difficulty, GameMode } from "../types/Common.js";
import type { Player } from "../players/Player.ts";
import type EventBus from "../services/EventBus.ts";
import type { GameEventMap } from "../types/Events.ts";
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

    const resetSubscriber = this.eventBus.on("ui:reset-requested", () =>
      this.handleReset(),
    );
    const settingsChangedSubscriber = this.eventBus.on(
      "ui:settings-change-requested",
      (data) => {
        this.applySettings(data);
        this.handleReset();
        this.eventBus.emit("game:settings-changed", this.gameSettings);
      },
    );
  }
  private handleReset() {
    this.activeGameId++;
    this.eventBus.emit("game:reset", {
      turn: this.getTurn(),
      nextPlayerSymbol: this.getNextPlayerSymbol(),
    });
    this.initNewGame();
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
        this.eventBus.emit("game:move-made", {
          row: move.row,
          col: move.col,
          symbol: currentPlayer.symbol,
          turn: this.getTurn(),
          nextPlayerSymbol: this.getNextPlayerSymbol(),
        });

        if (moveResult.gameResult) {
          this.eventBus.emit("game:finished", moveResult.gameResult);
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
    this.activeGameId++;
    this.initNewGame();
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

  getNextPlayerSymbol(): string {
    let nextPlayerIndex = 1 - this.currentIndex;
    return this.players[nextPlayerIndex].symbol;
  }

  setupPlayersByMode() {
    this.players = [];
    const mode = this.gameSettings.mode;

    if (mode === GameMode.Local) {
      this.addPlayer(PlayerType.Human, "X", "Niklas");
      this.addPlayer(PlayerType.Human, "O", "Kai");
    } else if (mode === GameMode.Bot) {
      this.addPlayer(PlayerType.Human, "X");
      this.addPlayer(PlayerType.Bot, "O");
    } else if (mode === GameMode.Online) {
      this.addPlayer(PlayerType.Human, "X");
      this.addPlayer(PlayerType.Remote, "O");
    }
  }

  isGameOver(): boolean {
    return this.game.gameOver;
  }

  addPlayer(
    type: PlayerType = PlayerType.Human,
    symbol: string = "X",
    userName = "Test",
  ) {
    if (type === PlayerType.Bot) {
      this.players.push(
        new Bot(
          this.getDifficulty(),
          symbol,
          userName + `Bot ${this.getDifficulty()}`,
          this.handNewId(),
          this.game,
        ),
      );
    } else {
      this.players.push(
        new LocalPlayer(symbol, userName, this.handNewId(), this.eventBus),
      );
    }
    console.log(`Added player: Name:${userName} Type:${type}`);
  }

  getCurrentPlayer(): Player | Bot {
    return this.players[this.currentIndex];
  }

  togglePlayer() {
    this.currentIndex = 1 - this.currentIndex;
  }

  getDifficulty(): Difficulty {
    for (const player of this.players) {
      if (player instanceof Bot) return player.difficulty;
    }
    return "medium"; // Fallback
  }

  async resetGame() {
    this.game.resetGame();
    this.currentIndex = 0;
  }
}
