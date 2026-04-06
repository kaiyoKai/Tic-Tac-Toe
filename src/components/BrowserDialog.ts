import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";

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
      name: "Pro Gamer Only",
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
      gap: 0.5rem;
    }
    .lobby-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem;
      background: #2a2a2a;
      border: 1px solid #444;
      border-radius: 8px;
      cursor: pointer;
      transition: 0.2s;
    }
    .lobby-item:hover {
      background: #333;
      border-color: #666;
    }
    .lobby-info {
      display: flex;
      flex-direction: column;
    }
    .lobby-name {
      font-weight: bold;
      color: #fff;
    }
    .lobby-stats {
      font-size: 0.8rem;
      color: #aaa;
    }
  `;

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
                <button class="btn primary">Join</button>
              </div>
            `,
          )}
        </div>
      </base-dialog>
    `;
  }
}
