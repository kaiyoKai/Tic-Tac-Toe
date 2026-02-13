import { GameSettings } from "../core/GameSettings.js";
import { GameResult } from "../core/GameResult.js";
import { WinType, GameMode, type Difficulty } from "../types/Common.js";
import { ThemeMap, type ThemeType } from "./Colors.ts";
import type EventBus from "../services/EventBus.ts";
import type { GameEventMap } from "../types/Events.ts";
import { DOM_ID, CSS_CLASS, CSS_VAR } from "./DomConstants.ts";

export class WebUI {
  private root: HTMLElement;
  private buttons: HTMLButtonElement[] = [];

  private turnPlayerLabel!: HTMLElement;
  private turnNumberLabel!: HTMLElement;
  private winnerLabel!: HTMLElement;
  private resetButton!: HTMLElement;

  private gameModeField!: HTMLSelectElement;
  private difficultyField!: HTMLSelectElement;
  private difficultyLabel!: HTMLElement;

  private boardSizeTextField!: HTMLInputElement;
  private winConTextField!: HTMLInputElement;
  private applyButton!: HTMLElement;
  private themeSelector!: HTMLSelectElement;

  private baseTurnText: string = "";
  private basePlayerText: string = "";
  private currentTheme: ThemeType = ThemeMap.Dark;

  constructor(private eventBus: EventBus<GameEventMap>) {
    // Verwendung der Konstanten bei der Initialisierung
    this.root = document.getElementById(DOM_ID.GRID)!;

    this.initializeElements();
    this.setupEventListeners();
    this.setupBusSubscriptions();
    this.initializeUIState();
  }

  private initializeElements(): void {
    this.turnPlayerLabel = document.getElementById(DOM_ID.TURN_PLAYER)!;
    this.turnNumberLabel = document.getElementById(DOM_ID.TURN_NUMBER)!;
    this.winnerLabel = document.getElementById(DOM_ID.WINNER_LABEL)!;
    this.resetButton = document.getElementById(DOM_ID.RESET_BTN)!;
    this.gameModeField = document.getElementById(
      DOM_ID.MODE_SELECT,
    ) as HTMLSelectElement;
    this.difficultyField = document.getElementById(
      DOM_ID.DIFFICULTY_SELECT,
    ) as HTMLSelectElement;
    this.difficultyLabel = document.getElementById(DOM_ID.DIFFICULTY_LABEL)!;
    this.boardSizeTextField = document.getElementById(
      DOM_ID.BOARD_SIZE,
    ) as HTMLInputElement;
    this.winConTextField = document.getElementById(
      DOM_ID.WIN_CON,
    ) as HTMLInputElement;
    this.applyButton = document.getElementById(DOM_ID.APPLY_BTN)!;
    this.themeSelector = document.getElementById(
      DOM_ID.THEME_SELECT,
    ) as HTMLSelectElement;

    this.baseTurnText = this.turnNumberLabel.textContent || "";
    this.basePlayerText = this.turnPlayerLabel.textContent || "";
  }

  private setupEventListeners(): void {
    this.root.addEventListener("click", (event) => {
      const target = (event.target as HTMLElement).closest("button");
      if (!target) return;

      const row = parseInt(target.dataset.row || "");
      const col = parseInt(target.dataset.col || "");

      if (!isNaN(row) && !isNaN(col)) {
        this.eventBus.emit("ui:cell-clicked", { row, col });
      }
    });

    this.resetButton.addEventListener("click", () => {
      this.eventBus.emit("ui:reset-requested");
    });

    this.applyButton.addEventListener("click", () => {
      this.eventBus.emit(
        "ui:settings-change-requested",
        this.getSettingsFromForm(),
      );
    });

    this.gameModeField.addEventListener("change", () =>
      this.handleDifficultyVisibility(),
    );

    this.themeSelector.addEventListener("change", (e) => {
      this.changeTheme((e.target as HTMLSelectElement).value as ThemeType);
    });
  }

  private setupBusSubscriptions(): void {
    this.eventBus.on("game:move-made", (data) => {
      this.renderButtonContent(data.row, data.col, data.symbol);
      this.renderTopText(data.turn, data.nextPlayerSymbol);
    });

    this.eventBus.on("game:finished", (result) => this.showWinner(result));
    this.eventBus.on("game:reset", (data) =>
      this.resetUI(data.turn, data.nextPlayerSymbol),
    );
    this.eventBus.on("game:settings-changed", (settings) =>
      this.updateSettings(settings),
    );
  }

  private initializeUIState(): void {
    this.loadGameModes();
    this.initThemeOptions();
    this.handleDifficultyVisibility();
    this.createBoard(3);
    this.renderTopText(0, "O");

    document.body.classList.add(this.currentTheme);
  }

  // --- UI Logik ---

  public updateSettings(settings: GameSettings): void {
    this.gameModeField.value = settings.mode;
    this.boardSizeTextField.value = settings.boardSize.toString();
    this.winConTextField.value = settings.winCon.toString();

    this.createBoard(settings.boardSize);
    this.renderTopText(0, "O");
  }

  public createBoard(size: number): void {
    this.root.style.setProperty(CSS_VAR.BOARD_SIZE, size.toString());
    this.root.replaceChildren();
    this.buttons = [];

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const button = document.createElement("button");
        button.dataset.row = i.toString();
        button.dataset.col = j.toString();
        this.root.appendChild(button);
        this.buttons.push(button);
      }
    }
  }

  private renderButtonContent(row: number, col: number, sym: string): void {
    const btn = this.buttons.find(
      (b) => Number(b.dataset.row) === row && Number(b.dataset.col) === col,
    );
    if (btn) btn.textContent = sym;
  }

  private renderTopText(turn: number, nextSymbol: string): void {
    this.turnNumberLabel.textContent = `${this.baseTurnText}${turn + 1}`;
    this.turnPlayerLabel.textContent = `${this.basePlayerText}${nextSymbol}`;
  }

  private async showWinner(result: GameResult): Promise<void> {
    if (result.type === WinType.Draw) {
      this.winnerLabel.textContent = "It's a draw!";
      return;
    }

    this.winnerLabel.textContent = `${result.winner} Won!`;
    await this.renderWinLines(result);
  }

  private async renderWinLines(result: GameResult): Promise<void> {
    if (result.type === WinType.Draw || !result.positions) return;

    const angle = this.determineAngle(result.type);
    const isDiagonal =
      result.type === WinType.DiagonalMain ||
      result.type === WinType.DiagonalAnti;
    const lineLength = isDiagonal ? "142%" : "102%";

    const winningButtons = result.positions
      .map((pos) =>
        this.buttons.find(
          (b) =>
            Number(b.dataset.row) === pos.row &&
            Number(b.dataset.col) === pos.col,
        ),
      )
      .filter((btn): btn is HTMLButtonElement => !!btn);

    winningButtons.forEach((btn) => {
      btn.classList.add(CSS_CLASS.SPIN, CSS_CLASS.WIN);
      btn.style.setProperty(CSS_VAR.ANGLE, angle);
      btn.style.setProperty(CSS_VAR.LINE_LENGTH, lineLength);
    });

    await this.delay(700);

    for (const btn of winningButtons) {
      btn.classList.add(CSS_CLASS.DRAW_LINE);
      await this.delay(250);
    }
  }

  private getSettingsFromForm(): GameSettings {
    return new GameSettings(
      this.gameModeField.value as GameMode,
      parseInt(this.boardSizeTextField.value),
      parseInt(this.winConTextField.value),
      this.difficultyField.value as Difficulty,
    );
  }

  private handleDifficultyVisibility(): void {
    const isBot = this.gameModeField.value === "bot";
    this.toggleElement(this.difficultyField, isBot);
    this.toggleElement(this.difficultyLabel, isBot);
  }

  private toggleElement(el: HTMLElement, show: boolean): void {
    el.classList.toggle(CSS_CLASS.HIDEABLE, !show);
  }

  private changeTheme(theme: ThemeType): void {
    document.body.classList.replace(this.currentTheme, theme);
    this.currentTheme = theme;
  }

  private determineAngle(type: WinType): string {
    const angles: Record<string, string> = {
      [WinType.DiagonalMain]: "45deg",
      [WinType.DiagonalAnti]: "-45deg",
      [WinType.Horizontal]: "0deg",
      [WinType.Vertical]: "90deg",
    };
    return angles[type] || "0deg";
  }

  private loadGameModes(): void {
    this.gameModeField.innerHTML = Object.entries(GameMode)
      .map(([key, val]) => `<option value="${val}">${key}</option>`)
      .join("");
  }

  private initThemeOptions(): void {
    this.themeSelector.innerHTML = Object.entries(ThemeMap)
      .map(([name, css]) => `<option value="${css}">${name}</option>`)
      .join("");
  }

  private resetUI(turn: number, nextSymbol: string): void {
    this.buttons.forEach((btn) => {
      btn.textContent = "";
      btn.classList.remove(CSS_CLASS.WIN, CSS_CLASS.SPIN, CSS_CLASS.DRAW_LINE);
      btn.style.removeProperty(CSS_VAR.ANGLE);
      btn.style.removeProperty(CSS_VAR.LINE_LENGTH);
    });
    this.renderTopText(turn, nextSymbol);
    this.winnerLabel.textContent = "";
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
