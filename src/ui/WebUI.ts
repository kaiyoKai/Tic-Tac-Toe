import { ThemeMap, type ThemeKey } from "./Colors.js";
import EventBus from "../services/EventBus.ts";
import { EventActor, type GameEventMap } from "../types/Events.ts";

import "../components/GameBoard.js";
import "../components/Sidebar.js";
import "../components/ChatDrawer.js";
import "../components/ProfileDialog.js";
import "../components/LobbyDialog.js";
import "../components/BrowserDialog.js";

export class WebUI {
  private currentThemeName: ThemeKey = "Catppuccin";

  constructor(private eventBus: EventBus<GameEventMap>) {
    this.initializeUIState();
    this.autoWireComponents();
  }

  private autoWireComponents() {
    const selectors = [
      "game-board",
      "side-bar",
      "chat-drawer",
      "profile-dialog",
      "lobby-dialog",
      "browser-dialog",
    ];

    selectors.forEach((tag) => {
      const el = document.querySelector(tag);
      if (!el) return;
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
              if (typeof (el as any)[method as string] === "function") {
                (el as any)[method as string](data);
              }
            },
          );
        });
      }

      el.addEventListener("ui-action", (e: any) => {
        const { action, payload } = e.detail;
        if (action === "open-dialog")
          (document.querySelector(payload) as any)?.show?.();
        if (action === "apply-theme") this.changeTheme(payload as ThemeKey);
      });
    });

    document
      .getElementById("chat-toggle-btn")
      ?.addEventListener("click", () => {
        (document.querySelector("chat-drawer") as any)?.toggle();
      });
  }

  private changeTheme(themeName: ThemeKey): void {
    const theme = ThemeMap[themeName];
    if (!theme || !document.startViewTransition) return;
    document.startViewTransition(() => {
      Object.entries(theme).forEach(([p, v]) =>
        document.documentElement.style.setProperty(`--${p}`, v as string),
      );
      document.body.classList.replace(
        this.currentThemeName.toLowerCase(),
        themeName.toLowerCase(),
      );
      this.currentThemeName = themeName;
      localStorage.setItem("user-theme", themeName);
    });
  }

  private initializeUIState(): void {
    const saved =
      (localStorage.getItem("user-theme") as ThemeKey) || "Catppuccin";
    document.body.classList.add(saved.toLowerCase());
    this.changeTheme(saved);
  }
}
