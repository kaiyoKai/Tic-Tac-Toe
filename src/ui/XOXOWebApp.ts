import { LitElement, html, css, type PropertyValues } from "lit";
import { customElement, state } from "lit/decorators.js";
import { ThemeMap, type ThemeKey } from "@ui/Theme.ts";
import { AppEvent, EventActor } from "@events/EventTypes.ts";
import { Emit, Subscribe } from "@events/Decorators.ts";

import "@components/layout/Sidebar.js";
import "@components/game/GameBoard.js";
import "@components/chat/ChatDrawer.js";
import "@components/dialogs/ProfileDialog.js";
import "@components/dialogs/LobbyDialog.js";
import "@components/dialogs/BrowserDialog.js";

@customElement("xoxo-web-app")
export class XoxoWebApp extends LitElement {
  @state() private currentThemeName: ThemeKey = "Catppuccin";

  constructor() {
    super();
    this.initializeUIState();
  }

  static styles = css`
    :host {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg-color);
    }

    main {
      flex-grow: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
  `;

  @Subscribe(AppEvent.UI.DialogOpenRequested, EventActor.WebUI)
  public handleDialogOpen(dialogTag: string) {
    const dialogElement = this.shadowRoot?.querySelector(dialogTag) as any;
    if (dialogElement && typeof dialogElement.show === "function") {
      dialogElement.show();
    } else {
      console.warn(
        `RootApp konnte Dialog <${dialogTag}> nicht finden oder öffnen.`,
      );
    }
  }
  @Subscribe(AppEvent.UI.ButtonShapeChanged, EventActor.WebUI)
  public saveButtonShape(cellRadiusPercent: string) {
    document.documentElement.style.setProperty(
      "--cell-radius",
      cellRadiusPercent,
    );

    localStorage.setItem("btn-shape-radius", cellRadiusPercent);
    const shapeName = cellRadiusPercent === "50%" ? "rounded" : "square";
    localStorage.setItem("btn-shape", shapeName);
  }
  @Subscribe(AppEvent.UI.ThemeChanged, EventActor.WebUI)
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

  @Emit(AppEvent.UI.ButtonShapeChanged, EventActor.WebUI)
  private initializeButtonState() {
    return localStorage.getItem("btn-shape-radius") || "5%";
  }

  private initializeUIState(): void {
    const saved =
      (localStorage.getItem("user-theme") as ThemeKey) || "Catppuccin";
    this.changeTheme(saved, true);
  }

  render() {
    return html`
      <side-bar></side-bar>

      <main>
        <game-board></game-board>
      </main>

      <chat-drawer></chat-drawer>

      <profile-dialog></profile-dialog>
      <lobby-dialog></lobby-dialog>
      <browser-dialog></browser-dialog>
    `;
  }
  protected firstUpdated() {
    this.initializeButtonState();
  }
}
