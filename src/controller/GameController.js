import TicTacToe from "../core/TicTacToe.js";
import { Bot } from "../players/Bot.js";
import { Player } from "../players/Player.js";
import { GameSettings } from "../core/GameSettings.js";

/**
 * Coordinates game state, settings, and players for a Tic-Tac-Toe match.
 */
export class GameController {
  /**
   * @param {{mode?: string, boardSize?: number, winCon?: number}} [options]
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

  /**
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

  /**
   * Returns currently active game settings.
   * @returns {GameSettings}
   */
  getSettings() {
    return this.gameSettings;
  }

  /**
   * Returns the board matrix for direct inspection.
   * @returns {(string|null)[][]}
   */
  getBoard() {
    return this.game.board;
  }

  /**
   * Returns the current board dimension.
   * @returns {number}
   */
  getBoardSize() {
    return this.game.getBoardLength();
  }

  /**
   * Returns required symbol count in a row to win.
   * @returns {number}
   */
  getWinCon() {
    return this.gameSettings.winCon;
  }

  /**
   * Returns the current gameplay mode.
   * @returns {string}
   */
  getMode() {
    return this.gameSettings.mode;
  }

  /**
   * Returns the current turn index.
   * @returns {number}
   */
  getTurn() {
    return this.game.turn;
  }

  /**
   * Returns the symbol of the next player in rotation.
   * @returns {string}
   */
  getNextPlayerSymbol() {
    let nextPlayerIndex = 1 - this.currentIndex;
    return this.players[nextPlayerIndex].symbol;
  }

  /**
   * Initializes players according to the selected mode.
   */
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

  /**
   * Indicates whether the game has finished.
   * @returns {boolean}
   */
  isGameOver() {
    return this.game.gameOver;
  }
  /**
   * Adds a new player instance for the current match.
   * @param {"human"|"bot"|"remote"} [type]
   * @param {string} [symbol]
   */
  addPlayer(type = "human", symbol = "X") {
    if (type === "bot") {
      this.players.push(new Bot("easy", symbol, this.game));
    } else {
      this.players.push(new Player(type, symbol));
    }
  } /**
   * Returns the player whose turn it currently is.
   * @returns {Player|Bot}
   */
  getCurrentPlayer() {
    for (let i = 0; i < this.players.length; i++) {
      console.log(`Player number ${i}: ${this.players[i].type}`);
    }
    const currentPlayer = this.players[this.currentIndex];
    console.log(`The current player is ${currentPlayer.type}`);
    return currentPlayer;
  }

  /**
   * Advances the internal player index.
   */
  togglePlayer() {
    this.currentIndex = 1 - this.currentIndex;
  }
  makeMove(row, col) {
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
    if (next.type === "bot") {
      setTimeout(() => {
        const move = next.getMove();
        if (move) {
          this.makeMove(move.row, move.col);
        }
      }, 400);
    }
  }

  /**
   * Resets the match to its starting state.
   */
  resetGame() {
    this.game.resetGame();
    this.currentIndex = 0;
    if (this.onReset) this.onReset();
  }
}
