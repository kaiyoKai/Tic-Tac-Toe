import { GameSettings } from "../core/GameSettings.js";
import { GameResult } from "../core/GameResult.js";
import {
  WinType,
  GameMode,
  type Difficulty,
  assertPlayerSymbol,
} from "../types/Common.js";
import { ThemeMap, type ThemeType } from "./Colors.ts";
import type EventBus from "../services/EventBus.ts";
import { EventActor, type GameEventMap } from "../types/Events.ts";
import { DOM_ID, CSS_CLASS, CSS_VAR } from "./DomConstants.ts";
import { Logger } from "../services/Logger.ts";

export class WebUI {
  private currentAnimationId: number = 0;
  private root: HTMLElement;
  private buttonGrid: HTMLButtonElement[][] = [];

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
        this.eventBus.emit("ui:cell-clicked", EventActor.WebUI, { row, col });
      }
    });

    this.resetButton.addEventListener("click", () => {
      this.eventBus.emit("ui:reset-requested", EventActor.WebUI);
    });

    this.applyButton.addEventListener("click", () => {
      this.eventBus.emit(
        "ui:settings-change-requested",
        EventActor.WebUI,
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
    this.eventBus.on("game:move-made", EventActor.WebUI, (data) => {
      const playerSym = assertPlayerSymbol(data.symbol);
      const nextPlayerSym = assertPlayerSymbol(data.nextPlayerSymbol);

      this.renderButtonContent(data.row, data.col, playerSym);
      this.renderTopText(data.turn, nextPlayerSym);
    });

    this.eventBus.on("game:finished", EventActor.WebUI, (result) =>
      this.showWinner(result),
    );

    this.eventBus.on("game:reset", EventActor.WebUI, (data) => {
      this.currentAnimationId++;
      const nextPlayerSym = assertPlayerSymbol(data.nextPlayerSymbol);
      this.resetUI(data.turn, nextPlayerSym);
    });

    this.eventBus.on("game:settings-changed", EventActor.WebUI, (settings) =>
      this.updateSettings(settings),
    );
  }

  private initializeUIState(): void {
    this.loadGameModes();
    this.initThemeOptions();
    this.handleDifficultyVisibility();
    this.createBoard(3);
    this.renderTopText(0, "");

    document.body.classList.add(this.currentTheme);
  }

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
    this.buttonGrid = [];

    for (let i = 0; i < size; i++) {
      this.buttonGrid[i] = [];
      for (let j = 0; j < size; j++) {
        const button = document.createElement("button");
        button.dataset.row = i.toString();
        button.dataset.col = j.toString();

        this.root.appendChild(button);
        this.buttonGrid[i][j] = button;
      }
    }
  }

  private renderButtonContent(row: number, col: number, sym: string): void {
    const btn = this.buttonGrid[row]?.[col];
    if (btn) {
      btn.textContent = sym;
    } else {
      Logger.error(EventActor.WebUI, "Button nicht gefunden im Grid", row, col);
    }
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

  private getLineConfig(type: WinType) {
    switch (type) {
      case WinType.Horizontal:
        return { top: "50%", left: "0%", angle: "0deg" };
      case WinType.Vertical:
        return { top: "0%", left: "50%", angle: "90deg" };
      case WinType.DiagonalMain:
        return { top: "0%", left: "0%", angle: "45deg" };
      case WinType.DiagonalAnti:
        return { top: "100%", left: "0%", angle: "-45deg" };
      default:
        return { top: "50%", left: "0%", angle: "0deg" };
    }
  }
  private async renderWinLines(result: GameResult): Promise<void> {
    if (result.type === WinType.Draw || !result.positions) return;

    if (result.type === WinType.DiagonalAnti) {
      //It works this way so i won't touch it (:
      result.positions.sort((a, b) => b.row - a.row);
    }
    const config = this.getLineConfig(result.type as WinType);
    const winningButtons = result.positions
      .map((pos) => this.buttonGrid[pos.row]?.[pos.col])
      .filter((btn): btn is HTMLButtonElement => !!btn);

    const spinPromises = winningButtons.map((btn) => {
      btn.classList.add(CSS_CLASS.WIN, CSS_CLASS.SPIN);
      return this.waitForEvent(btn, "animationend");
    });

    await Promise.all(spinPromises);

    winningButtons.forEach((btn) => {
      btn.style.setProperty("--line-top", config.top);
      btn.style.setProperty("--line-left", config.left);
      btn.style.setProperty(CSS_VAR.ANGLE, config.angle);
      btn.style.setProperty("--after-width", "200%");
    });

    await this.delay(200);
    await new Promise((resolve) => requestAnimationFrame(resolve));

    for (const btn of winningButtons) {
      btn.classList.add(CSS_CLASS.DRAW_LINE);

      await this.waitForEvent(btn, "transitionend");
    }
  }
  private waitForEvent(element: HTMLElement, eventName: string): Promise<void> {
    return new Promise((resolve) => {
      const handler = (event: Event) => {
        if (event.target !== element) return;

        element.removeEventListener(eventName, handler);
        resolve();
      };
      element.addEventListener(eventName, handler);
      setTimeout(resolve, 2000); //fallback
    });
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
    if (!document.body.classList.contains(this.currentTheme)) {
      document.body.classList.add(theme);
    } else {
      document.body.classList.replace(this.currentTheme, theme);
    }
    this.currentTheme = theme;
  }

  private loadGameModes(): void {
    this.populateSelect(this.gameModeField, GameMode);
  }

  private initThemeOptions(): void {
    this.populateSelect(this.themeSelector, ThemeMap);
  }

  private populateSelect(
    selectElement: HTMLSelectElement,
    data: Record<string, string>,
    ...stylingClasses: string[]
  ) {
    const options = Object.entries(data).map(([label, value]) => {
      const option = document.createElement("option");

      if (stylingClasses.length > 0) option.classList.add(...stylingClasses);

      option.textContent = label;
      option.value = value;

      return option;
    });
    selectElement.replaceChildren(...options);
  }

  private resetUI(turn: number, nextSymbol: string): void {
    this.createBoard(this.buttonGrid.length);

    this.renderTopText(turn, nextSymbol);
    this.winnerLabel.textContent = "";
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
