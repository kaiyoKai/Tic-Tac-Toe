import { GameController } from "./controller/GameController.js";
import { GameUI } from "./ui/GameUI.js";

const controller = new GameController({ mode: "local" });

const ui = new GameUI(controller);

controller.onMove = (row, col, symbol) => {
  ui.renderButtonContent(row, col, symbol);
  ui.renderTopText(controller.game);
  controller.game.displayBoardStringBetter();
};

controller.onFinish = (result) => ui.showWinner(result);

controller.onReset = () => ui.resetUI();

controller.onSettingsChanged = () => {
  ui.updateSettings();
  ui.resetUI();
};
