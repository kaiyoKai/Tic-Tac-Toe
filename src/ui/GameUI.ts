import { GameSettings } from "../core/GameSettings.js";
import { GameResult } from "../core/GameResult.js";
import { WinType } from "../types/Common.js";
import { GameMode } from "../types/Common.js";
import type { Difficulty } from "../types/Common.js";
import { ThemeMap, type ThemeType } from "./Colors.ts";
import type EventBus from "../services/EventBus.ts";
import type { GameEventMap } from "../types/Events.ts";

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
  private currentTheme: ThemeType;

  constructor(private eventBus: EventBus<GameEventMap>) {
    this.root = document.getElementById("grid")!;

    this.root.addEventListener("click", (event) => {
      const target = (event.target as HTMLElement).closest("button");

      if (!target) return;

      const row = parseInt(target.dataset.row || undefined);
      const col = parseInt(target.dataset.col || undefined);

      if (!isNaN(row) && !isNaN(col)) {
        this.eventBus.emit("ui:cell-clicked", { row, col });
        console.log(`row:${row} col:${col}`);
      }
    });

    this.createBoard(3);

    this.eventBus.on("game:move-made", (data) => {
      this.renderButtonContent(data.row, data.col, data.symbol);
      this.renderTopText(data.turn, data.nextPlayerSymbol);
    });

    this.eventBus.on("game:finished", (result) => this.showWinner(result));
    this.eventBus.on("game:reset", (data) =>
      this.resetUI(data.turn, data.nextPlayerSymbol),
    );
    this.eventBus.on("game:settings-changed", (settings) => {
      console.log("Ich habe diese Settings erhalten:", settings);

      this.updateSettings(settings);
    });
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

    this.renderTopText(0, "O");

    this.resetButton.addEventListener("click", () => {
      this.eventBus.emit("ui:reset-requested");
    });

    this.applyButton.addEventListener("click", () => {
      this.eventBus.emit(
        "ui:settings-change-requested",
        this.getSettingsFromForm(),
      );
    });

    this.handleDifficultyVisibility();

    this.gameModeField.addEventListener("change", () => {
      this.handleDifficultyVisibility();
    });

    this.initThemeSelector();
    this.loadGameModes();

    // Standard theme :
    this.currentTheme = ThemeMap.Dark;
    document.body.classList.add(this.currentTheme);
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

  private getSettingsFromForm(): GameSettings {
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
    return newSettings;
  }

  updateSettings(settings: GameSettings) {
    this.gameModeField.value = settings.mode;

    this.boardSizeTextField.value = settings.boardSize.toString();
    this.boardSizeTextField.value = settings.boardSize.toString();
    this.winConTextField.value = settings.winCon.toString();

    this.root.style.setProperty("--boardsize", settings.boardSize.toString());
    this.createBoard(settings.boardSize);

    this.renderTopText(0, "O"); //the settings will later include player informations
  }

  hideElement(element: HTMLElement) {
    element.classList.add("hideable");
  }

  unHideElement(element: HTMLElement) {
    element.classList.remove("hideable");
  }

  createBoard(size: number) {
    this.root.style.setProperty("--boardsize", size.toString());
    this.root.replaceChildren();
    this.buttons = [];
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const button = document.createElement("button");
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

  renderTopText(turn = 0, nextSymbol: string) {
    this.turnNumberLabel.textContent = this.baseTurnText + (turn + 1);
    this.turnPlayerLabel.textContent = this.basePlayerText + nextSymbol;
  }

  resetUI(turn = 0, nextSymbol: string) {
    this.resetBoard();
    this.renderTopText(turn, nextSymbol);
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
    document.body.classList.replace(this.currentTheme, theme);
    this.currentTheme = theme;
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
  private loadGameModes() {
    const selectElement = document.getElementById("mode") as HTMLSelectElement;
    selectElement.innerHTML = "";
    Object.entries(GameMode).forEach(([key, val]) => {
      const option = document.createElement("option");
      option.value = val;
      option.textContent = key;
      selectElement.appendChild(option);
    });
  }
}
