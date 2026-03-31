import { GameSettings } from "../core/GameSettings.js";
import { GameResult } from "../core/GameResult.js";
import {
  WinType,
  GameMode,
  type Difficulty,
  assertPlayerSymbol,
  type PlayerSymbol,
  dummyPlayerSymbol,
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
  private shapeRadioGroup!: NodeListOf<HTMLInputElement>;

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
  private currentTheme: ThemeType = ThemeMap.Catppuccin;

  constructor(private eventBus: EventBus<GameEventMap>) {
    this.root = document.getElementById(DOM_ID.GRID)!;

    this.initializeElements();
    this.setupEventListeners();
    this.setupBusSubscriptions();
    this.initializeUIState();

    this.setupSidebarLogic();
    this.setupChatLogic();
    this.setupDialogs();
    this.setupDropdowns();
  }

  private setupSidebarLogic(): void {
    const sidebar = document.getElementById(DOM_ID.SIDEBAR);
    const toggleBtn = document.getElementById(DOM_ID.SIDEBAR_TOGGLE);

    toggleBtn?.addEventListener("click", () => {
      sidebar?.classList.toggle(CSS_CLASS.CLOSE);
      this.closeAllSubMenus();
    });
  }

  private setupDropdowns(): void {
    const dropdowns = document.querySelectorAll(`.${CSS_CLASS.DROPDOWN_BTN}`);

    dropdowns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const button = e.currentTarget as HTMLElement;
        const sidebar = document.getElementById(DOM_ID.SIDEBAR);

        if (sidebar?.classList.contains(CSS_CLASS.CLOSE)) {
          sidebar.classList.remove(CSS_CLASS.CLOSE);
        }

        const subMenu = button.nextElementSibling as HTMLElement;

        if (subMenu && subMenu.classList.contains(CSS_CLASS.SUB_MENU)) {
          subMenu.classList.toggle(CSS_CLASS.SHOW);
          button.classList.toggle(CSS_CLASS.ROTATE);
        }
      });
    });
  }
  private closeAllSubMenus(): void {
    document
      .querySelectorAll(`.${CSS_CLASS.SUB_MENU}.${CSS_CLASS.SHOW}`)
      .forEach((menu) => {
        menu.classList.remove(CSS_CLASS.SHOW);
      });

    document
      .querySelectorAll(`.${CSS_CLASS.DROPDOWN_BTN}.${CSS_CLASS.ROTATE}`)
      .forEach((btn) => {
        btn.classList.remove(CSS_CLASS.ROTATE);
      });
  }

  private setupChatLogic(): void {
    const chatSidebar = document.getElementById(DOM_ID.CHAT_SIDEBAR);
    const chatToggleBtn = document.getElementById(DOM_ID.CHAT_TOGGLE);
    const chatCloseBtn = chatSidebar?.querySelector(".drawer-header button");

    const toggleChat = () => {
      chatSidebar?.classList.toggle(CSS_CLASS.OPEN);
    };

    if (chatToggleBtn) chatToggleBtn.addEventListener("click", toggleChat);
    if (chatCloseBtn) chatCloseBtn.addEventListener("click", toggleChat);
  }

  private setupDialogs(): void {
    const bindModal = (triggerId: string, dialogId: string) => {
      const trigger = document.getElementById(triggerId);
      const dialog = document.getElementById(dialogId) as HTMLDialogElement;

      if (trigger && dialog) {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          dialog.showModal();
        });

        const closeButtons = dialog.querySelectorAll(
          `.${CSS_CLASS.CLOSE_BTN}, #${DOM_ID.CLOSE_LOBBY}, #${DOM_ID.CLOSE_PROFILE}`,
        );
        closeButtons.forEach((btn) => {
          btn.addEventListener("click", () => dialog.close());
        });
      }
    };

    bindModal(DOM_ID.OPEN_SETTINGS, DOM_ID.LOBBY_DIALOG);
    bindModal(DOM_ID.OPEN_PROFILE, DOM_ID.PROFILE_DIALOG);
    bindModal(DOM_ID.OPEN_BROWSER, DOM_ID.BROWSER_DIALOG);
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

    this.applyButton = document.getElementById(DOM_ID.APPLY_SETTINGS)!;
    this.themeSelector = document.getElementById(
      DOM_ID.THEME_SELECT,
    ) as HTMLSelectElement;

    this.baseTurnText = this.turnNumberLabel?.textContent || "";
    this.basePlayerText = this.turnPlayerLabel?.textContent || "";
    this.shapeRadioGroup = document.querySelectorAll<HTMLInputElement>(
      DOM_ID.SHAPE_OPTIONS,
    );
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
      (
        document.getElementById(DOM_ID.LOBBY_DIALOG) as HTMLDialogElement
      )?.close();
    });

    this.gameModeField.addEventListener("change", () =>
      this.handleDifficultyVisibility(),
    );

    this.themeSelector.addEventListener("change", (e) => {
      this.changeTheme((e.target as HTMLSelectElement).value as ThemeType);
    });

    this.setupShapeListeners();
  }

  private changeButtonShape(shapeValue: string) {
    if (shapeValue !== undefined) {
      this.root.style.setProperty("--cell-radius", shapeValue);
    }
  }

  private setupShapeListeners(): void {
    this.shapeRadioGroup.forEach((radio) => {
      Logger.log(EventActor.WebUI, "Radio Listener registriert");
      radio.addEventListener("change", () => {
        if (radio.checked) {
          this.changeButtonShape(radio.value);
          Logger.log(EventActor.WebUI, `Radio value:${radio.value}`);
        }
      });
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
    this.renderTopText(0, dummyPlayerSymbol);
    document.body.classList.add(this.currentTheme);
  }

  public updateSettings(settings: GameSettings): void {
    this.gameModeField.value = settings.mode;
    this.boardSizeTextField.value = settings.boardSize.toString();
    this.winConTextField.value = settings.winCon.toString();

    this.createBoard(settings.boardSize);
    this.renderTopText(0, dummyPlayerSymbol);
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

  private renderButtonContent(
    row: number,
    col: number,
    sym: PlayerSymbol,
  ): void {
    const btn = this.buttonGrid[row]?.[col];
    if (btn) {
      btn.textContent = sym;
    } else {
      Logger.error(EventActor.WebUI, "Button nicht gefunden im Grid", row, col);
    }
  }

  private renderTopText(turn: number, nextSymbol: PlayerSymbol): void {
    if (this.turnNumberLabel)
      this.turnNumberLabel.textContent = `${this.baseTurnText}${turn + 1}`;
    if (this.turnPlayerLabel)
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

  private getButtonShape() {
    return this.root.style.getPropertyValue("--cell-radius");
  }

  private getLineConfig(type: WinType) {
    let widthMult = 1;
    if (this.getButtonShape() === "100%") {
      widthMult = 1.3;
    }
    switch (type) {
      case WinType.Horizontal:
        return { top: "50%", left: "0%", angle: "0deg", width: "100%" };
      case WinType.Vertical:
        return { top: "0%", left: "50%", angle: "90deg", width: "100%" };
      case WinType.DiagonalMain:
        return {
          top: "0%",
          left: "0%",
          angle: "45deg",
          width: `${widthMult * 141}%`,
        };
      case WinType.DiagonalAnti:
        return {
          top: "100%",
          left: "0%",
          angle: "-45deg",
          width: `${widthMult * 141}%`,
        };
      default:
        return { top: "50%", left: "0%", angle: "0deg", width: "100%" };
    }
  }
  private async renderWinLines(result: GameResult): Promise<void> {
    if (result.type === WinType.Draw || !result.positions) return;

    if (result.type === WinType.DiagonalAnti) {
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
      btn.style.setProperty(CSS_VAR.AFTER_WIDTH, config.width);
      btn.style.setProperty(CSS_VAR.LINE_TOP, config.top);
      btn.style.setProperty(CSS_VAR.LINE_LEFT, config.left);
      btn.style.setProperty(CSS_VAR.ANGLE, config.angle);
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
      setTimeout(resolve, 2000); // fallback
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
    if (el) el.classList.toggle(CSS_CLASS.HIDEABLE, !show);
    Logger.log(EventActor.WebUI, `Showing Bot Difficulty?:${show}`);
  }

  private changeTheme(theme: ThemeType): void {
    if (!document.startViewTransition) {
      document.body.classList.replace(this.currentTheme, theme);
      this.currentTheme = theme;
      return;
    }

    document.startViewTransition(() => {
      document.body.classList.replace(this.currentTheme, theme);
      this.currentTheme = theme;
      Logger.log(EventActor.WebUI, this.currentTheme, theme);
    });
  }

  private loadGameModes(): void {
    this.populateSelect(this.gameModeField, GameMode);
  }

  private initThemeOptions(): void {
    this.populateSelect(this.themeSelector, ThemeMap, (a, b) =>
      a[0].localeCompare(b[0]),
    );
  }

  private populateSelect(
    selectElement: HTMLSelectElement,
    data: Record<string, string>,
    sortedBy?: (a: [string, string], b: [string, string]) => number,
    ...stylingClasses: string[]
  ) {
    if (!selectElement) return;

    let entries = Object.entries(data);
    if (typeof sortedBy === "function") {
      entries = entries.sort((a, b) => sortedBy(a, b));
    }

    const options = entries.map(([label, value]) => {
      const option = document.createElement("option");
      if (stylingClasses.length > 0) option.classList.add(...stylingClasses);
      option.textContent = label;
      option.value = value;
      return option;
    });
    selectElement.replaceChildren(...options);
  }

  private resetUI(turn: number, nextSymbol: PlayerSymbol): void {
    this.createBoard(this.buttonGrid.length);
    this.renderTopText(turn, nextSymbol);
    this.winnerLabel.textContent = "";
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
