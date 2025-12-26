import { GameSettings } from "../core/GameSettings.js";
import { GameResult, WinType } from "../core/GameResult.js";
/**
 * Handles DOM interactions and rendering for the Tic-Tac-Toe interface.
 */
export class GameUI {
  constructor(controller) {
    this.controller = controller;
    this.root = document.getElementById("grid");

    this.root.addEventListener("click", (event) => {
      const target = event.target.closest("button");

      if (!target || this.controller.isGameOver()) return;

      const row = parseInt(target.dataset.row);
      const col = parseInt(target.dataset.col);

      if (!isNaN(row) && !isNaN(col)) {
        this.controller.makeMove(row, col);
      }
    });

    this.buttons = [];
    this.createBoard();

    this.turnPlayerLabel = document.getElementById("turnplayerlabel");
    this.turnNumberLabel = document.getElementById("turnnumlabel");
    this.winnerLabel = document.getElementById("winnerLabel");
    this.resetButton = document.getElementById("reset");

    this.gameModeField = document.getElementById("mode");
    this.boardSizeTextField = document.getElementById("boardsize");
    this.winConTextField = document.getElementById("wincon");
    this.applyButton = document.getElementById("apply");

    this.baseTurnText = this.turnNumberLabel.textContent;
    this.basePlayerText = this.turnPlayerLabel.textContent;

    this.renderTopText();

    this.resetButton.addEventListener("click", () => {
      controller.resetGame();
    });

    this.applyButton.addEventListener("click", () => {
      this.sendSettingsFromFormToController();
    });
  }

  /**
   * Reads the settings form and forwards values to the controller.
   */
  sendSettingsFromFormToController() {
    const gamemode = this.gameModeField.value;
    const boardSize = parseInt(this.boardSizeTextField.value);
    const winCon = parseInt(this.winConTextField.value);

    const newSettings = new GameSettings(gamemode, boardSize, winCon);
    this.controller.applySettings(newSettings);
  }

  /**
   * Synchronises inputs and board layout after settings change.
   */
  updateSettings() {
    this.gameModeField.value = this.controller.getMode();
    this.boardSizeTextField.value = this.controller.getBoardSize();
    this.winConTextField.value = this.controller.getWinCon();

    const size = this.controller.getBoardSize();
    this.root.style.setProperty("--boardsize", size);

    this.root.replaceChildren();
    this.createBoard();
    this.renderTopText(this.controller.getBoard());
  }

  createBoard() {
    const size = this.controller.getBoardSize();
    this.root.style.setProperty("--boardsize", size);

    this.buttons = [];

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const button = document.createElement("button");
        button.setAttribute("data-row", i);
        button.setAttribute("data-col", j);

        this.root.appendChild(button);
        this.buttons.push(button);
      }
    }
  }
  renderButtonContent(row, col, sym) {
    const btn = this.buttons.find(
      (b) => Number(b.dataset.row) === row && Number(b.dataset.col) === col,
    );
    if (btn) btn.textContent = sym;
  }

  /**
   * Highlights winning positions with visual cues.
   * @param {{type: string, winner: string, positions: Array<{row:number,col:number}>}} result
   */
  renderWinLines(result) {
    console.log(result);
    if (result.type === WinType.Draw) return;
    const angle = this.determineAngle(result);
    result.positions.forEach(({ row, col }) => {
      const btn = this.buttons.find(
        (b) => Number(b.dataset.row) === row && Number(b.dataset.col) === col,
      );
      if (btn) {
        btn.style.setProperty("--angle", angle);
        btn.classList.add("win");
      }
    });
  }

  determineAngle(result) {
    let angle = result.type;
    switch (angle) {
      case WinType.DiagonalMain:
        return "45deg";
      case WinType.DiagonalAnti:
        return "-45deg";
      case WinType.Horizontal:
        return "0deg";
      case WinType.Vertical:
        return "90deg";
      default:
        return "0deg";
    }
  }
  showWinner(result) {
    if (result.type === WinType.Draw) {
      this.winnerLabel.textContent = "It's a draw!";
      return;
    }

    this.winnerLabel.textContent = `${result.winner} Won!`;
    this.renderWinLines(result);
  }

  renderTopText() {
    this.turnNumberLabel.textContent =
      this.baseTurnText + (this.controller.getTurn() + 1);
    this.turnPlayerLabel.textContent =
      this.basePlayerText + this.controller.getNextPlayerSymbol();
  }

  resetUI() {
    this.resetBoard();
    this.renderTopText();
    this.winnerLabel.textContent = "";
  }

  resetBoard() {
    this.buttons.forEach((btn) => {
      btn.textContent = "";
      btn.classList.remove("win");
      btn.style.removeProperty("--angle");
    });
  }
}
