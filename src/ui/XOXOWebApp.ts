import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ThemeMap, type ThemeKey } from "@ui/Theme.ts";
import { AppEvent, EventActor } from "@events/EventTypes.ts";
import { Emit, Subscribe } from "@events/Decorators.ts";

import "@components/layout/Sidebar.js";
import "@components/game/GameBoard.js";
import "@components/game/GameLogo.js";
import "@components/chat/ChatDrawer.js";
import "@components/dialogs/ProfileDialog.js";
import "@components/dialogs/LobbyDialog.js";
import "@components/dialogs/BrowserDialog.js";
import "@components/toast/ToastManager.js";
import { GameSettings } from "@game/engine/GameSettings.ts";
import { globalEventBus } from "@events/EventBus.ts";

@customElement("xoxo-web-app")
export class XoxoWebApp extends LitElement {
  @state() private activeSettings: GameSettings = new GameSettings();
  @state() private currentThemeName: ThemeKey = "Catppuccin";
  @state() private isPlaying = false;
  @state() private savedRadius: string = "5%";

  constructor() {
    super();
    this.initializeUIState();
  }

  static styles = css`
    /* Deine Styles bleiben unverändert... */
    :host {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg-color, #1e1e2e);
      color: var(--text-main, #cdd6f4);
      font-family: sans-serif;
    }
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      min-width: 0;
      transition: all 0.5s ease-in-out;
    }
    main.is-playing {
      justify-content: flex-start;
      padding-top: 1rem;
    }
    game-logo {
      filter: drop-shadow(0 0 1rem var(--glow-core));
      display: block;
      height: clamp(20rem, 18vh, 15rem);
      width: auto;
      margin-bottom: 2rem;
      transition: all 0.5s ease;
    }
    main.is-playing game-logo {
      height: 90px;
      margin-bottom: 0.5rem;
    }
    .board-wrapper {
      width: 100%;
      flex: 1;
      min-height: 0;
      display: flex;
      justify-content: center;
      align-items: stretch;
    }
    game-board {
      display: block;
      width: 100%;
      height: 100%;
    }
    .start-btn {
      padding: 1rem 2.5rem;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      border-radius: 12px;
      border: 2px solid var(--primary-accent, #fab387);
      background: transparent;
      color: var(--primary-accent, #fab387);
      transition: 0.2s;
      filter: drop-shadow(0 0 1rem var(--glow-core));
    }
    .start-btn:hover {
      background: var(--primary-accent, #fab387);
      color: var(--bg-color);
    }
  `;

  @Subscribe(AppEvent.UI.DialogOpenRequested, EventActor.WebUI)
  public handleDialogOpen(dialogTag: string) {
    const dialogElement = this.shadowRoot?.querySelector(dialogTag) as any;
    if (dialogElement && typeof dialogElement.show === "function") {
      dialogElement.show();
    }
  }

  @Subscribe(AppEvent.UI.ButtonShapeChanged, EventActor.WebUI)
  public saveButtonShape(cellRadiusPercent: string) {
    // State aktualisieren, damit das Board beim Rendern den neuen Wert bekommt
    this.savedRadius = cellRadiusPercent;
    localStorage.setItem("btn-shape-radius", cellRadiusPercent);
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

  @Subscribe(AppEvent.UI.AppEndRequested, EventActor.WebUI)
  endApp() {
    this.isPlaying = false;
  }

  private initializeUIState(): void {
    const savedTheme =
      (localStorage.getItem("user-theme") as ThemeKey) || "Catppuccin";
    this.changeTheme(savedTheme, true);

    this.savedRadius = localStorage.getItem("btn-shape-radius") || "5%";
  }
  @Subscribe(AppEvent.Game.Start, EventActor.Controller)
  public OnStartGame(data?: any) {
    if (data?.settings) {
      this.activeSettings = Object.assign(new GameSettings(), data.settings);
      this.isPlaying = true;
      this.requestUpdate();
    }
  }
  @Subscribe(AppEvent.UI.SettingsChangeRequested, EventActor.WebUI)
  public syncSettingsFromDialog(newSettings: GameSettings) {
    this.activeSettings = Object.assign(new GameSettings(), newSettings);
  }

  public requestGameStart() {
    globalEventBus.emit(
      AppEvent.UI.GameStartRequested,
      EventActor.WebUI,
      this.activeSettings,
    );
  }
  render() {
    return html`
      <side-bar></side-bar>
      <main class="${classMap({ "is-playing": this.isPlaying })}">
        <game-logo></game-logo>

        ${this.isPlaying
          ? html`
              <div class="board-wrapper">
                <game-board
                  .settings="${this.activeSettings}"
                  .cellRadius="${this.savedRadius}"
                ></game-board>
              </div>
            `
          : html`
              <button class="start-btn" @click="${this.requestGameStart}">
                SPIEL STARTEN
              </button>
            `}
      </main>
      <chat-drawer></chat-drawer>
      <profile-dialog></profile-dialog>
      <toast-manager></toast-manager>
      <lobby-dialog></lobby-dialog>
      <browser-dialog></browser-dialog>
    `;
  }

  @Emit(AppEvent.UI.ButtonShapeChanged, EventActor.WebUI)
  private initializeButtonState() {
    return this.savedRadius;
  }

  protected firstUpdated() {
    this.initializeButtonState();
  }
}
