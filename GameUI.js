import { GameSettings } from "./GameSettings.js";

export class GameUI {
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

  sendSettingsFromFormToController() {
    const gamemode = this.gameModeField.value;
    const boardSize = parseInt(this.boardSizeTextField.value);
    const winCon = parseInt(this.winConTextField.value);

    const newSettings = new GameSettings(gamemode, boardSize, winCon);
    this.controller.applySettings(newSettings);
  }

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
  renderButtonContent(row, col, sym) {
    let btn = this.buttons.find(
      (b) => Number(b.dataset.row) === row && Number(b.dataset.col) === col,
    );
    btn.textContent = sym;
  }

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

  showWinner(result) {
    if (result.type === "draw") {
      winnerLabel.textContent = "it's a draw";
    }
    winnerLabel.textContent = result.winner + " Won!";
    this.renderWinLines(result);
  }

  renderTopText() {
    this.turnNumberLabel.textContent =
      this.baseTurnText + (this.controller.getTurn() + 1);
    this.turnPlayerLabel.textContent =
      this.basePlayerText + this.controller.getNextPlayerSymbol();
  }

  renderBoard(buttons, gameBoard) {
    buttons.forEach((b) => renderButtonContent(b, gameBoard));
  }

  resetUI() {
    this.resetBoard();
    this.renderTopText();
    winnerLabel.textContent = "";
  }

  resetBoard() {
    this.buttons.forEach((btn) => {
      btn.textContent = ""; //konnte auch renderBoard aber uberflussig weil sowieso alles null ist bei reset
      btn.classList.remove("win");
    });
  }
}
