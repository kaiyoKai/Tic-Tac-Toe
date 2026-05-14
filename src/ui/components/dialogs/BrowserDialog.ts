import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { globalEventBus } from "@events/EventBus.js";
import { EventActor, AppEvent } from "@events/EventTypes.js";
import "@components/primitives/AppButton.js";
import "./CreateLobbyDialog.js";

@customElement("browser-dialog")
export class BrowserDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @query("create-lobby-dialog") private createDialog!: any;

  @state() private lobbies: any[] = [];

  constructor() {
    super();
    globalEventBus.on(
      "ui:lobbies-updated" as any,
      EventActor.WebUI,
      (data: any[]) => {
        this.lobbies = data;
      },
    );
  }

  public show() {
    this.baseDialog.show();
    this.refresh();
  }

  private refresh() {
    globalEventBus.emit(
      "ui:lobby-list-refresh-requested" as any,
      EventActor.WebUI,
    );
  }

  private openCreateModal() {
    this.createDialog.show();
  }

  private joinLobby(id: string) {
    globalEventBus.emit("ui:lobby-join-requested" as any, EventActor.WebUI, {
      lobbyId: id,
      username: "Kai",
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
                          Spieler: ${l.players?.length || 0}/${l.maxPlayers}
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
