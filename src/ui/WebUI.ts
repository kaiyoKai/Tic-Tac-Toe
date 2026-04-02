import { GameSettings } from "../core/GameSettings.js";
import {
  WinType,
  GameMode,
  Difficulty,
  assertPlayerSymbol,
  type PlayerSymbol,
  dummyPlayerSymbol,
} from "../types/Common.js";
import { ThemeMap, type ThemeType } from "./Colors.ts";
import type EventBus from "../services/EventBus.ts";
import { EventActor, type GameEventMap } from "../types/Events.ts";
import { DOM_ID, CSS_CLASS } from "./DomConstants.ts";
import { Logger } from "../services/Logger.ts";
import { GameBoard } from "../components/GameBoard.ts";

export class WebUI {
  private boardComponent!: GameBoard;

  private gameModeField!: HTMLSelectElement;
  private difficultyField!: HTMLSelectElement;
  private difficultyLabel!: HTMLElement;
  private boardSizeTextField!: HTMLInputElement;
  private winConTextField!: HTMLInputElement;
  private applyButton!: HTMLElement;
  private themeSelector!: HTMLSelectElement;
  private shapeRadioGroup!: NodeListOf<HTMLInputElement>;

  private currentTheme: ThemeType = ThemeMap.Catppuccin;

  constructor(private eventBus: EventBus<GameEventMap>) {
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
    this.boardComponent = document.getElementById(DOM_ID.GRID) as GameBoard;

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

    this.shapeRadioGroup = document.querySelectorAll<HTMLInputElement>(
      DOM_ID.SHAPE_OPTIONS,
    );
  }

  private setupEventListeners(): void {
    this.boardComponent.addEventListener("cell-clicked", (event: any) => {
      this.eventBus.emit("ui:cell-clicked", EventActor.WebUI, event.detail);
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

    this.themeSelector.addEventListener("change", (e) =>
      this.changeTheme((e.target as HTMLSelectElement).value as ThemeType),
    );

    this.shapeRadioGroup.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.checked) {
          this.boardComponent.cellRadius = radio.value;
          Logger.log(EventActor.WebUI, `Radio value:${radio.value}`);
        }
      });
    });
  }

  private setupBusSubscriptions(): void {
    this.eventBus.on("game:move-made", EventActor.WebUI, (data) => {
      this.boardComponent.updateCell(
        data.row,
        data.col,
        assertPlayerSymbol(data.symbol),
      );
      this.boardComponent.turnNumber = data.turn + 1;
      this.boardComponent.currentPlayer = assertPlayerSymbol(
        data.nextPlayerSymbol,
      );
    });

    this.eventBus.on("game:finished", EventActor.WebUI, async (result) => {
      if (result.type === WinType.Draw) {
        this.boardComponent.winnerMessage = "It's a draw!";
      } else {
        this.boardComponent.winnerMessage = `${result.winner} Won!`;
        await this.boardComponent.showWinAnimation(result);
      }
    });

    this.eventBus.on("game:reset", EventActor.WebUI, (data) => {
      this.boardComponent.resetBoard();
      this.boardComponent.turnNumber = data.turn + 1;
      this.boardComponent.currentPlayer = assertPlayerSymbol(
        data.nextPlayerSymbol,
      );
    });

    this.eventBus.on("game:settings-changed", EventActor.WebUI, (settings) => {
      this.gameModeField.value = settings.mode;
      this.boardSizeTextField.value = settings.boardSize.toString();
      this.winConTextField.value = settings.winCon.toString();

      this.boardComponent.boardSize = settings.boardSize;
      this.boardComponent.turnNumber = 1;
      this.boardComponent.currentPlayer = dummyPlayerSymbol;
    });
  }

  private initializeUIState(): void {
    this.loadGameModes();
    this.initThemeOptions();
    this.handleDifficultyVisibility();

    this.boardComponent.boardSize = 3;
    this.boardComponent.turnNumber = 1;
    this.boardComponent.currentPlayer = dummyPlayerSymbol;
    document.body.classList.add(this.currentTheme);
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
    if (this.difficultyField)
      this.difficultyField.classList.toggle(CSS_CLASS.HIDEABLE, !isBot);
    if (this.difficultyLabel)
      this.difficultyLabel.classList.toggle(CSS_CLASS.HIDEABLE, !isBot);
    Logger.log(EventActor.WebUI, `Showing Bot Difficulty?:${isBot}`);
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
}
