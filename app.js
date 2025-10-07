import { GameController } from "./GameController.js";
import { GameUI } from "./GameUI.js";
const controller = new GameController({ mode: "local" });

const ui = new GameUI(controller);

// UI subscribed to controller events
controller.onMove = (row, col, symbol) => {
  ui.renderButtonContent(row, col, symbol);
  ui.renderTopText(controller.game);
  controller.game.displayBoardStringBetter();
};
controller.onFinish = (result) => ui.showWinner(result);
controller.onReset = () => ui.resetUI();
controller.onSettingsChanged = () => ui.updateSettings();
