import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { globalEventBus } from "@events/EventBus.js";
import { AppEvent, EventActor } from "@events/EventTypes.js";
import "@components/primitives/AppButton.js";
import "./CreateLobbyDialog.js";
import { profileStore } from "@client/profile/ProfileStore.js";
import type { LobbySnapshot } from "@shared/contracts/LobbyContracts.js";

@customElement("browser-dialog")
export class BrowserDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @query("create-lobby-dialog") private createDialog!: any;

  @state() private lobbies: LobbySnapshot[] = [];

  constructor() {
    super();
    globalEventBus.on(AppEvent.UI.LobbiesUpdated, EventActor.WebUI, (data) => {
      this.lobbies = data;
    });
  }

  public show() {
    this.baseDialog.show();
    this.refresh();
  }

  private refresh() {
    globalEventBus.emit(AppEvent.UI.LobbyListRefreshRequested, EventActor.WebUI);
  }

  private openCreateModal() {
    this.createDialog.show();
  }

  private joinLobby(id: string) {
    const profile = profileStore.load();
    if (!profile) {
      globalEventBus.emit(
        AppEvent.UI.DialogOpenRequested,
        EventActor.WebUI,
        "profile-dialog",
      );
      return;
    }
    globalEventBus.emit(AppEvent.UI.LobbyJoinRequested, EventActor.WebUI, {
      lobbyId: id,
      profile: {
        username: profile.username,
        symbol: profile.symbol,
        preferences: profile.preferences,
      },
    });
    this.baseDialog.close();
  }

  static styles = css`
    .browser-layout {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .lobby-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 400px;
      overflow-y: auto;
    }
    .lobby-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--cell-bg, #2a2a3a);
      border: 1px solid var(--border-color, #444);
      border-radius: 8px;
    }
    .lobby-name {
      font-weight: bold;
      color: var(--text-main);
    }
    .lobby-meta {
      font-size: 0.8rem;
      color: #888;
    }
    .lobby-badges {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
      margin-top: 0.35rem;
    }
    .badge {
      padding: 0.2rem 0.45rem;
      border-radius: 999px;
      background: var(--bg-color, #181825);
      border: 1px solid var(--border-color, #444);
      font-size: 0.75rem;
    }
  `;

  render() {
    return html`
      <base-dialog title="Lobby Browser">
        <div class="browser-layout">
          <div class="toolbar">
            <app-button @click="${this.refresh}">🔄 Aktualisieren</app-button>
            <app-button variant="primary" @click="${this.openCreateModal}"
              >+ Neue Lobby</app-button
            >
          </div>

          <div class="lobby-list">
            ${this.lobbies.length === 0
              ? html`<p style="text-align: center; color: #666; margin: 2rem;">
                  Keine offenen Lobbys gefunden...
                </p>`
              : this.lobbies.map(
                  (l) => html`
                    <div class="lobby-item">
                      <div>
                        <div class="lobby-name">${l.name}</div>
                        <div class="lobby-meta">
                          Mitglieder: ${l.members.length}/${l.settings.maxPlayers}
                        </div>
                        <div class="lobby-badges">
                          <span class="badge">${l.settings.visibility}</span>
                          <span class="badge">${l.settings.allowedLocalPlayers} lokal</span>
                          <span class="badge">${l.settings.maxBots} bots</span>
                          <span class="badge">${l.settings.boardSize}x${l.settings.boardSize}</span>
                          <span class="badge">Win: ${l.settings.winCon}</span>
                          <span class="badge">${l.settings.gravityEnabled ? "Gravity" : "No Gravity"}</span>
                          <span class="badge">${l.settings.rotationEnabled ? "Rotate" : "Static"}</span>
                          <span class="badge">${l.pendingSettingRequests.length} requests</span>
                        </div>
                      </div>
                      <app-button
                        variant="primary"
                        @click="${() => this.joinLobby(l.id)}"
                        >Beitreten</app-button
                      >
                    </div>
                  `,
                )}
          </div>
        </div>
      </base-dialog>

      <create-lobby-dialog></create-lobby-dialog>
    `;
  }
}
