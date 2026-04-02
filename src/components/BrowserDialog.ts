import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import "./BaseDialog.js";

@customElement("browser-dialog")
export class BrowserDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @state() private servers = [
    { id: 1, name: "GTA 6", players: "1/2", ping: "24ms" },
    { id: 2, name: "Wer das liest ist cool", players: "0/5", ping: "42ms" },
  ];

  static styles = css`
    .server-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .server-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.8rem;
      background: var(--cell-bg);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      cursor: pointer;
    }
    .server-item:hover {
      background: var(--cell-hover);
    }
    .server-info {
      display: flex;
      flex-direction: column;
    }
    .server-name {
      font-weight: bold;
    }
    .server-stats {
      font-size: 0.8rem;
      opacity: 0.7;
    }
  `;

  public show() {
    this.baseDialog.show();
  }

  private joinServer(id: number) {
    this.dispatchEvent(
      new CustomEvent("join-server", {
        detail: { serverId: id },
        bubbles: true,
        composed: true,
      }),
    );
    this.baseDialog.close();
  }

  render() {
    return html`
      <base-dialog title="Server Browser">
        <div class="server-list">
          ${this.servers.map(
            (s) => html`
              <div class="server-item" @click="${() => this.joinServer(s.id)}">
                <div class="server-info">
                  <span class="server-name">${s.name}</span>
                  <span class="server-stats"
                    >Spieler: ${s.players} | Ping: ${s.ping}</span
                  >
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
