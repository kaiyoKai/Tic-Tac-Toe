import { ThemeMap, type ThemeKey } from "@ui/Theme.ts";
import { AppEvent, EventActor } from "@events/EventTypes.ts";
import "@components/game/GameBoard.js";
import "@components/layout/Sidebar.js";
import "@components/chat/ChatDrawer.js";
import "@components/dialogs/ProfileDialog.ts";
import "./components/dialogs/LobbyDialog.js";
import "./components/dialogs/BrowserDialog.js";

// ✅ NEU: Wir brauchen den globalen Bus hier direkt
import { globalEventBus } from "@events/EventBus.ts";

export class WebUI {
  private currentThemeName: ThemeKey = "Catppuccin";

  constructor() {
    this.initializeUIState();
    this.initializeButtonState();

    // ✅ NEU: Da dies keine Lit-Komponente ist, abonnieren wir manuell im Konstruktor.
    // WICHTIG: Arrow-Functions () => nutzen, damit 'this' auf die Klasse zeigt!
    globalEventBus.on(
      AppEvent.UI.ButtonShapeChanged,
      EventActor.WebUI,
      (radius: string) => {
        this.changeButtonShape(radius);
      },
    );

    globalEventBus.on(
      AppEvent.UI.ThemeChanged,
      EventActor.WebUI,
      (theme: ThemeKey) => {
        this.changeTheme(theme);
      },
    );
  }

  // ❌ ERKLÄRUNG: Die @Subscribe Decorators wurden hier entfernt!
  public changeButtonShape(cellRadiusPercent: string) {
    const board = document.querySelector("game-board") as any;
    if (board) board.cellRadius = cellRadiusPercent;

    document.documentElement.style.setProperty(
      "--cell-radius",
      cellRadiusPercent,
    );

    localStorage.setItem("btn-shape-radius", cellRadiusPercent);
    const shapeName = cellRadiusPercent === "50%" ? "rounded" : "square";
    localStorage.setItem("btn-shape", shapeName);
  }

  private initializeButtonState(): void {
    const saved = localStorage.getItem("btn-shape-radius") || "5%";
    this.changeButtonShape(saved);
  }

  // ❌ ERKLÄRUNG: Die @Subscribe Decorators wurden hier entfernt!
  public changeTheme(themeName: ThemeKey, skipTransition = false): void {
    const theme = ThemeMap[themeName];
    if (!theme) return;

    const performUpdate = () => {
      Object.entries(theme).forEach(([p, v]) =>
        document.documentElement.style.setProperty(`--${p}`, v as string),
      );
      document.body.className = themeName.toLowerCase();
      this.currentThemeName = themeName;
      localStorage.setItem("user-theme", themeName);
    };

    if (skipTransition || !document.startViewTransition) {
      performUpdate();
      return;
    }

    try {
      document.startViewTransition(() => performUpdate());
    } catch (e) {
      performUpdate();
    }
  }

  private initializeUIState(): void {
    const saved =
      (localStorage.getItem("user-theme") as ThemeKey) || "Catppuccin";
    this.changeTheme(saved, true);
  }
}
