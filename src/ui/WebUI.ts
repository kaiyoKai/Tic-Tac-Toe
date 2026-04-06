import { ThemeMap, type ThemeKey } from "./Colors.js";
import EventBus from "../services/EventBus.ts";
import { EventActor, type GameEventMap } from "../types/Events.ts";

import "./components/GameBoard.js";
import "./components/Sidebar.js";
import "./components/ChatDrawer.js";
import "./components/ProfileDialog.js";
import "./components/LobbyDialog.js";
import "./components/BrowserDialog.js";

interface BusWiredElement extends HTMLElement {
  constructor: {
    busEvents?: Record<string, string>;
    busSubscriptions?: Record<string, string>;
  };
  [key: string]: any;
}
export class WebUI {
  private currentThemeName: ThemeKey = "Catppuccin";

  constructor(private eventBus: EventBus<GameEventMap>) {
    this.initializeUIState();
    this.initializeButtonState();

    this.autoWireComponents();
  }

  private async autoWireComponents() {
    const selectors = [
      "game-board",
      "side-bar",
      "chat-drawer",
      "profile-dialog",
      "lobby-dialog",
      "browser-dialog",
    ];

    await Promise.all(selectors.map((tag) => customElements.whenDefined(tag)));

    selectors.forEach((tag) => {
      const el = document.querySelector(tag) as BusWiredElement;
      if (!el) return;

      if (el.hasAttribute("data-wired")) return;
      el.setAttribute("data-wired", "true");

      const klass = el.constructor as any;

      if (klass.busEvents) {
        Object.entries(klass.busEvents).forEach(([domEv, busEv]) => {
          el.addEventListener(domEv, (e: any) => {
            this.eventBus.emit(
              busEv as keyof GameEventMap,
              EventActor.WebUI,
              e.detail,
            );
          });
        });
      }

      if (klass.busSubscriptions) {
        Object.entries(klass.busSubscriptions).forEach(([busEv, method]) => {
          let targetActor: EventActor = EventActor.Game;
          if (busEv.startsWith("chat:")) targetActor = EventActor.Bus;
          else if (busEv.startsWith("ui:")) targetActor = EventActor.WebUI;

          this.eventBus.on(
            busEv as keyof GameEventMap,
            targetActor,
            (data: any) => {
              if (
                typeof (el as BusWiredElement)[method as string] === "function"
              ) {
                (el as any)[method as string](data);
              }
            },
          );
        });
      }
    });

    document.body.addEventListener("ui-action", async (e: any) => {
      const { action, payload } = e.detail;

      if (action === "open-dialog") {
        const dialog = document.querySelector(payload) as any;
        if (dialog) {
          if (dialog.updateComplete) await dialog.updateComplete;
          dialog.show?.();
        }
      }

      if (action === "apply-theme") {
        this.changeTheme(payload as ThemeKey);
      }

      if (action === "set-cell-radius") {
        this.changeButonnShape(payload);
      }
    });
  }
  changeButonnShape(cellRadiusPercent: string) {
    const board = document.querySelector("game-board") as any;
    if (board) board.cellRadius = cellRadiusPercent;

    document.documentElement.style.setProperty(
      "--cell-radius",
      cellRadiusPercent,
    );

    localStorage.setItem("btn-shape-radius", cellRadiusPercent);
  }

  private initializeButtonState(): void {
    const saved = localStorage.getItem("btn-shape-radius") || "5%";
    this.changeButonnShape(saved);
  }
  private changeTheme(themeName: ThemeKey, skipTransition = false): void {
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
