import TicTacToe from "../core/TicTacToe.js";
import { Bot } from "../players/Bot.js";
import { Player } from "../players/Player.js";

import { GameSettings, Mode } from "../core/GameSettings.js";
import { Difficulty } from "../players/Bot.js";
import { PlayerType } from "../players/IPlayer.ts";

interface GameControllerOptions {
  mode?: Mode;
  boardSize?: number;
  winCon?: number;
  difficulty?: Difficulty;
}

export class GameController {
  public gameSettings: GameSettings;
  public game: TicTacToe;
  public players: (Player | Bot)[] = [];
  public currentIndex: number = 0;

  public onMove: ((row: number, col: number, symbol: string) => void) | null =
    null;
  public onFinish: ((result: any) => void) | null = null;
  public onReset: (() => void) | null = null;
  public onSettingsChanged: ((settings: GameSettings) => void) | null = null;

  constructor({
    mode = "local",
    boardSize = 3,
    winCon = 3,
    difficulty = "medium",
  }: GameControllerOptions = {}) {
    this.gameSettings = new GameSettings(mode, boardSize, winCon, difficulty);
    if (!this.gameSettings.isValid()) {
      this.gameSettings.fixInvalidValues();
    }
    this.game = new TicTacToe(
      this.gameSettings.boardSize,
      this.gameSettings.winCon,
    );

    this.players = [];
    this.currentIndex = 0;
    this.setupPlayersByMode();
  }

  public applySettings(newSettings: GameSettings) {
    if (!newSettings.isValid()) {
      newSettings.fixInvalidValues();
    }

    this.gameSettings = newSettings;
    this.game = new TicTacToe(newSettings.boardSize, newSettings.winCon);

    this.setupPlayersByMode();

    this.currentIndex = 0;
    if (newSettings.mode === Mode.Bot) {
      for (const player of this.players) {
        if (player instanceof Bot) {
          //Assumes there is only one bot or all bots have the same difficulty
          player.changeDifficulty(newSettings.difficulty);
          break;
        }
      }
    }

    if (this.onSettingsChanged) {
      this.onSettingsChanged(this.gameSettings);
    }
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

  getMode(): Mode {
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

    if (mode === "local") {
      this.addPlayer("human", "X");
      this.addPlayer("human", "O");
    } else if (mode === "bot") {
      this.addPlayer("human", "X");
      this.addPlayer("bot", "O");
      console.log("Bot Mode!!!");
    } else if (mode === "online") {
      this.addPlayer("human", "X");
      this.addPlayer("remote", "O");
    }
  }

  isGameOver(): boolean {
    return this.game.gameOver;
  }

  addPlayer(type: PlayerType = "human", symbol: string = "X") {
    if (type === "bot") {
      this.players.push(new Bot("easy", symbol, this.game));
    } else {
      this.players.push(new Player(type, symbol));
    }
  }

  getCurrentPlayer(): Player | Bot {
    for (let i = 0; i < this.players.length; i++) {
      console.log(`Player number ${i}: ${this.players[i].type}`);
    }
    const currentPlayer = this.players[this.currentIndex];
    console.log(`The current player is ${currentPlayer.type}`);
    return currentPlayer;
  }

  togglePlayer() {
    this.currentIndex = 1 - this.currentIndex;
  }

  makeMove(row: number, col: number) {
    const player = this.getCurrentPlayer();

    if (!this.game.isValidMove(row, col)) return;

    const moveResult = this.game.move(row, col, player.symbol);

    if (this.onMove) this.onMove(row, col, player.symbol);

    if (
      moveResult.MoveStatus !== "SUCCESS" &&
      moveResult.MoveStatus !== "GAME_OVER"
    ) {
      console.warn("Ungültiger Zug:", moveResult.MoveStatus);
      return;
    }
    if (moveResult.gameResult !== null) {
      if (this.onFinish) this.onFinish(moveResult.gameResult);
      return;
    }

    this.togglePlayer();

    const next = this.getCurrentPlayer();
    if (next instanceof Bot) {
      setTimeout(() => {
        const move = next.getMove();
        if (move) {
          this.makeMove(move.row, move.col);
        }
      }, 400);
    }
  }
  //Assumes there is only one bot or all bots have the same difficulty
  getDifficulty(): Difficulty {
    for (const player of this.players) {
      if (player instanceof Bot) {
        console.log(player.difficulty);
        return player.difficulty;
      }
    }
  }

  resetGame() {
    this.game.resetGame();
    this.currentIndex = 0;
    if (this.onReset) this.onReset();
  }
}
