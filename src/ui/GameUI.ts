import { GameSettings } from "../core/GameSettings.js";
import { GameResult } from "../core/GameResult.js";
import { WinType } from "../types/Common.js";
import { GameController } from "../controller/GameController.js";
import { GameMode } from "../types/Common.js";
import type { Difficulty } from "../types/Common.js";
import { ThemeMap, type ThemeType } from "./Colors.ts";

export class GameUI {
  private root: HTMLElement;
  private buttons: HTMLButtonElement[] = [];

  private turnPlayerLabel: HTMLElement;
  private turnNumberLabel: HTMLElement;
  private winnerLabel: HTMLElement;
  private resetButton: HTMLElement;

  private gameModeField: HTMLSelectElement;
  private difficultyField: HTMLSelectElement;
  private difficultyLabel: HTMLElement;

  private boardSizeTextField: HTMLInputElement;
  private winConTextField: HTMLInputElement;
  private applyButton: HTMLElement;

  private baseTurnText: string;
  private basePlayerText: string;

  constructor(private controller: GameController) {
    this.root = document.getElementById("grid")!;

    this.root.addEventListener("click", (event) => {
      const target = (event.target as HTMLElement).closest("button");

      if (!target || this.controller.isGameOver()) return;

      const row = parseInt(target.dataset.row || "");
      const col = parseInt(target.dataset.col || "");

      if (!isNaN(row) && !isNaN(col)) {
        this.controller.makeMove(row, col);
      }
    });

    this.createBoard();

    this.turnPlayerLabel = document.getElementById("turnplayerlabel")!;
    this.turnNumberLabel = document.getElementById("turnnumlabel")!;
    this.winnerLabel = document.getElementById("winnerLabel")!;
    this.resetButton = document.getElementById("reset")!;

    this.gameModeField = document.getElementById("mode") as HTMLSelectElement;

    this.difficultyField = document.getElementById(
      "difficulty",
    ) as HTMLSelectElement;
    this.difficultyLabel = document.getElementById("difficulty-label")!;

    this.boardSizeTextField = document.getElementById(
      "boardsize",
    ) as HTMLInputElement;
    this.winConTextField = document.getElementById(
      "wincon",
    ) as HTMLInputElement;
    this.applyButton = document.getElementById("apply")!;

    this.baseTurnText = this.turnNumberLabel.textContent || "";
    this.basePlayerText = this.turnPlayerLabel.textContent || "";

    this.renderTopText();

    this.resetButton.addEventListener("click", () => {
      this.controller.resetGame();
    });

    this.applyButton.addEventListener("click", () => {
      this.sendSettingsFromFormToController();
    });

    this.handleDifficultyVisibility();

    this.gameModeField.addEventListener("change", () => {
      this.handleDifficultyVisibility();
    });
    this.initThemeSelector();
  }

  private handleDifficultyVisibility(): void {
    if (this.gameModeField.value === "bot") {
      this.unHideElement(this.difficultyField);
      this.unHideElement(this.difficultyLabel);
    } else {
      this.hideElement(this.difficultyField);
      this.hideElement(this.difficultyLabel);
    }
  }

  sendSettingsFromFormToController() {
    const gamemode = this.gameModeField.value as GameMode;
    const boardSize = parseInt(this.boardSizeTextField.value);
    const winCon = parseInt(this.winConTextField.value);
    const difficulty = this.difficultyField.value as Difficulty;

    const newSettings = new GameSettings(
      gamemode,
      boardSize,
      winCon,
      difficulty,
    );
    this.controller.applySettings(newSettings);
  }

  updateSettings() {
    const mode = this.controller.getMode();
    this.gameModeField.value = mode;

    this.boardSizeTextField.value = this.controller.getBoardSize().toString();
    this.winConTextField.value = this.controller.getWinCon().toString();
    this.difficultyField.value = this.controller.getSettings().difficulty;

    const size = this.controller.getBoardSize();
    this.root.style.setProperty("--boardsize", size.toString());

    this.root.replaceChildren();
    this.createBoard();

    this.renderTopText();
  }

  hideElement(element: HTMLElement) {
    element.classList.add("hideable");
  }

  unHideElement(element: HTMLElement) {
    element.classList.remove("hideable");
  }

  createBoard() {
    const size = this.controller.getBoardSize();
    this.root.style.setProperty("--boardsize", size.toString());

    this.buttons = [];

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const button = document.createElement("button");
        // FIX 8: setAttribute erwartet Strings
        button.setAttribute("data-row", i.toString());
        button.setAttribute("data-col", j.toString());

        this.root.appendChild(button);
        this.buttons.push(button);
      }
    }
  }

  renderButtonContent(row: number, col: number, sym: string) {
    const btn = this.buttons.find(
      (b) => Number(b.dataset.row) === row && Number(b.dataset.col) === col,
    );
    if (btn) btn.textContent = sym;
  }

  renderWinLines(result: GameResult) {
    console.log(result);
    if (result.type === WinType.Draw) return;

    const angle = this.determineAngle(result);

    if (result.positions) {
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
  }

  determineAngle(result: GameResult): string {
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

  showWinner(result: GameResult) {
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

  private changeTheme(theme: ThemeType) {
    const allThemes = Object.values(ThemeMap);
    document.body.classList.remove(...allThemes);
    document.body.classList.add(theme);
  }
  private initThemeSelector() {
    const selectElement = document.getElementById(
      "colors",
    ) as HTMLSelectElement;

    selectElement.innerHTML = "";
    Object.entries(ThemeMap).forEach(([displayName, cssClass]) => {
      const option = document.createElement("option");
      option.value = cssClass;
      option.textContent = displayName;
      selectElement.appendChild(option);
    });
    selectElement.addEventListener("change", (event) => {
      const target = event.target as HTMLSelectElement;
      this.changeTheme(target.value as ThemeType);
    });
  }
}
