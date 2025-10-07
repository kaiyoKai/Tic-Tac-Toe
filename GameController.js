import TicTacToe from "./TicTacToe.js";
import { Bot } from "./Bot.js";
import { Player } from "./Player.js";
import { GameSettings } from "./GameSettings.js";
export class GameController {
  /**
   * @param {string} mode
   * @param {number} boardSize
   * @param {number} winCon
   */
  constructor({ mode = "local", boardSize = 3, winCon = 3 } = {}) {
    this.gameSettings = new GameSettings(mode, boardSize, winCon);

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

    this.onMove = null;
    this.onFinish = null;
    this.onReset = null;
    this.onSettingsChanged = null;
  }

  // --- SETTINGS ---

  /**
   * Wendet neue Einstellungen an (z. B. aus UI).
   * @param {GameSettings} newSettings
   */
  applySettings(newSettings) {
    if (!newSettings.isValid()) {
      newSettings.fixInvalidValues();
    }

    this.gameSettings = newSettings;
    this.game = new TicTacToe(newSettings.boardSize, newSettings.winCon);

    this.setupPlayersByMode();

    if (this.onSettingsChanged) {
      this.onSettingsChanged(this.gameSettings);
    }
  }

  getSettings() {
    return this.gameSettings;
  }

  // --- SPIELSTEUERUNG ---

  getBoard() {
    return this.game.board;
  }

  getBoardSize() {
    return this.game.getBoardLength();
  }

  getWinCon() {
    return this.gameSettings.winCon;
  }

  getMode() {
    return this.gameSettings.mode;
  }

  getTurn() {
    return this.game.turn;
  }

  getNextPlayerSymbol() {
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
    } else if (mode === "online") {
      this.addPlayer("human", "X");
      this.addPlayer("remote", "O");
    }
  }

  isGameOver() {
    return this.game.gameOver;
  }

  addPlayer(type = "human", symbol = "X") {
    if (type === "bot") {
      this.players.push(new Bot(symbol));
    } else {
      this.players.push(new Player(type, symbol));
    }
  }

  getCurrentPlayer() {
    return this.players[this.currentIndex];
  }

  togglePlayer() {
    this.currentIndex = 1 - this.currentIndex;
  }

  makeMove(row, col) {
    const player = this.getCurrentPlayer();

    if (!this.game.isValidMove(row, col)) return;

    const result = this.game.move(row, col, player.symbol);

    if (this.onMove) this.onMove(row, col, player.symbol);

    if (result) {
      if (this.onFinish) this.onFinish(result);
      return;
    }

    this.togglePlayer();

    const next = this.getCurrentPlayer();
    if (next.type === "bot") {
      setTimeout(() => {
        const [r, c] = next.getMove(this.game);
        this.makeMove(r, c);
      }, 400);
    }
  }

  resetGame() {
    this.game.resetGame();
    this.currentIndex = 0;
    if (this.onReset) this.onReset();
  }
}
