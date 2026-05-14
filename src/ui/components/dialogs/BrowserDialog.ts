import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import "@components/primitives/AppButton.js";

interface Lobby {
  id: string;
  name: string;
  currentPlayers: number;
  maxPlayers: number;
  ping: number;
  status: string;
  isPrivate: boolean;
}
@customElement("browser-dialog")
export class BrowserDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;

  static busEvents = {
    "join-lobby": "ui:join-lobby-requested",
  };

  @state() private lobbys: Lobby[] = [
    {
      id: "1",
      name: "Pro Gamers Only",
      currentPlayers: 1,
      maxPlayers: 2,
      ping: 24,
      status: "online",
      isPrivate: true,
    },
    {
      id: "2",
      name: "Wer das liest ist cool",
      currentPlayers: 0,
      maxPlayers: 2,
      ping: 42,
      status: "online",
      isPrivate: false,
    },
  ];

  private createlobby(
    name: string,
    maxPlayers: number = 2,
    ping: number = 0,
    isPrivate: boolean = false,
  ): Lobby {
    return {
      id: crypto.randomUUID(),
      name,
      currentPlayers: 0,
      maxPlayers,
      ping,
      status: "online",
      isPrivate,
    };
  }

  addlobby(name: string, size: number = 2) {
    const newLobby = this.createlobby(name, size);
    this.lobbys = [...this.lobbys, newLobby];
  }

  private joinlobby(id: string) {
    this.dispatchEvent(
      new CustomEvent("join-lobby", {
        detail: { lobbyId: id },
        bubbles: true,
        composed: true,
      }),
    );
    this.baseDialog?.close();
  }

  static styles = css`
    .lobby-list {
      display: flex;
      flex-direction: column;
      gap: var(--ui-space-sm);
    }
    .lobby-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--ui-space-md);
      background: var(--cell-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--ui-radius-sm);
      cursor: pointer;
      transition: var(--ui-transition-fast);
    }
    .lobby-item:hover {
      background: var(--cell-hover);
      border-color: var(--border-color);
      filter: drop-shadow(0 0 1rem var(--glow-core));
    }
    .lobby-info {
      display: flex;
      flex-direction: column;
    }
    .lobby-name {
      font-weight: bold;
      color: var(--text-main);
    }
    .lobby-stats {
      font-size: var(--ui-font-size-sm);
      color: var(--border-color);
    }
  `;
  public show() {
    this.baseDialog.show();
  }

  render() {
    return html`
      <base-dialog title="Lobby Browser">
        <div class="lobby-list">
          ${this.lobbys.map(
            (l) => html`
              <div class="lobby-item" @click="${() => this.joinlobby(l.id)}">
                <div class="lobby-info">
                  <span class="lobby-name">${l.name}</span>
                  <span class="lobby-stats">
                    Spieler: ${l.currentPlayers}/${l.maxPlayers} | Ping:
                    ${l.ping}ms ${l.isPrivate ? "🔒" : "🔓"}
                  </span>
                </div>
                <app-button
                  variant="primary"
                  @click="${(e: Event) => {
                    e.stopPropagation();
                    this.joinlobby(l.id);
                  }}"
                >
                  Beitreten
                </app-button>
              </div>
            `,
          )}
        </div>
      </base-dialog>
    `;
  }
}
