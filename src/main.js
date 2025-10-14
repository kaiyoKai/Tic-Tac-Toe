import { GameController } from "./controller/GameController.js";
import { GameUI } from "./ui/GameUI.js";

/** Coordinates the game controller and UI wiring for the Tic-Tac-Toe app. */
const controller = new GameController({ mode: "local" });

const ui = new GameUI(controller);

/**
 * Responds to a successful move by updating the UI and diagnostics.
 * @param {number} row
 * @param {number} col
 * @param {string} symbol
 */
controller.onMove = (row, col, symbol) => {
  ui.renderButtonContent(row, col, symbol);
  ui.renderTopText(controller.game);
  controller.game.displayBoardStringBetter();
};
/**
 * Shows the end-of-game state when the controller finishes.
 * @param {{type: string, winner: string, positions: Array<{row:number,col:number}>}} result
 */
controller.onFinish = (result) => ui.showWinner(result);
/** Resets visual state when the controller restarts the match. */
controller.onReset = () => ui.resetUI();
/** Refreshes UI controls when the controller settings change. */
controller.onSettingsChanged = () => ui.updateSettings();
