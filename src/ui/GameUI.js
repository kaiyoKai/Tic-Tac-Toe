import { GameSettings } from "../core/GameSettings.js";

/**
 * Handles DOM interactions and rendering for the Tic-Tac-Toe interface.
 */
export class GameUI {
  /**
   * @param {import("../controller/GameController.js").GameController} controller
   */
  constructor(controller) {
    this.controller = controller;
    this.root = document.getElementById("grid");
    console.log(this.controller.getBoardSize);
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

    this.buttons = [];
    this.attachButtonListeners();
    this.renderTopText();

    this.resetButton.addEventListener("click", () => {
      controller.resetGame();
    });

    this.applyButton.addEventListener("click", () => {
      this.sendSettingsFromFormToController();
    });
  }

  /**
   * Collects all grid buttons and attaches click handlers for moves.
   */
  attachButtonListeners() {
    this.buttons = Array.from(document.querySelectorAll(".grid button"));

    this.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        if (this.controller.isGameOver()) return;
        const row = parseInt(button.dataset.row);
        const col = parseInt(button.dataset.col);
        this.controller.makeMove(row, col);
      });
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
    this.attachButtonListeners();

    this.renderTopText(this.controller.getBoard());
  }

  /**
   * Creates the grid buttons for the current board size.
   */
  createBoard() {
    const size = this.controller.getBoardSize();
    this.root.style.setProperty("--boardsize", size);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const button = document.createElement("button");
        button.setAttribute("data-row", i);
        button.setAttribute("data-col", j);
        this.root.appendChild(button);
      }
    }
  }
  /**
   * Updates the displayed symbol on a specific grid cell.
   * @param {number} row
   * @param {number} col
   * @param {string} sym
   */
  renderButtonContent(row, col, sym) {
    let btn = this.buttons.find(
      (b) => Number(b.dataset.row) === row && Number(b.dataset.col) === col,
    );
    btn.textContent = sym;
  }

  /**
   * Highlights winning positions with visual cues.
   * @param {{type: string, winner: string, positions: Array<{row:number,col:number}>}} result
   */
  renderWinLines(result) {
    console.log(result);
    if (result.type === "draw") return;
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
  /**
   * Determines the highlight angle for a winning line.
   * @param {{type: string}} result
   * @returns {string}
   */
  determineAngle(result) {
    let angle = result.type;
    switch (angle) {
      case "diagLeft":
        return "-45deg";
      case "diagRight":
        return "45deg";
      case "row":
        return "0deg";
      case "col":
        return "90deg";
      default:
        return "0deg";
    }
  }

  /**
   * Displays the winner or draw message and highlights the board.
   * @param {{type: string, winner: string, positions: Array<{row:number,col:number}>}} result
   */
  showWinner(result) {
    if (result.type === "draw") {
      winnerLabel.textContent = "it's a draw";
    }
    winnerLabel.textContent = result.winner + " Won!";
    this.renderWinLines(result);
  }

  /**
   * Renders the player turn indicators.
   */
  renderTopText() {
    this.turnNumberLabel.textContent =
      this.baseTurnText + (this.controller.getTurn() + 1);
    this.turnPlayerLabel.textContent =
      this.basePlayerText + this.controller.getNextPlayerSymbol();
  }

  /**
   * Applies provided board state to the rendered buttons.
   * @param {HTMLButtonElement[]} buttons
   * @param {(string|null)[][]} gameBoard
   */
  renderBoard(buttons, gameBoard) {
    buttons.forEach((b) => renderButtonContent(b, gameBoard));
  }

  /**
   * Resets the UI to the initial state.
   */
  resetUI() {
    this.resetBoard();
    this.renderTopText();
    winnerLabel.textContent = "";
  }

  /**
   * Clears all symbols and highlights from the grid.
   */
  resetBoard() {
    this.buttons.forEach((btn) => {
      btn.textContent = "";
      btn.classList.remove("win");
    });
  }
}
