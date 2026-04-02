import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
import "./BaseDialog.js";

@customElement("lobby-dialog")
export class LobbyDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @query("#game-mode") private gameMode!: HTMLSelectElement;
  @query("#difficulty") private difficulty!: HTMLSelectElement;
  @query("#board-size") private boardSize!: HTMLInputElement;
  @query("#win-condition") private winCondition!: HTMLInputElement; // Neu

  public show() {
    this.baseDialog.show();
  }

  private applySettings() {
    const settings = {
      mode: this.gameMode.value,
      difficulty: this.difficulty.value,
      size: parseInt(this.boardSize.value),
      winCondition: parseInt(this.winCondition.value), // Neu
    };

    this.dispatchEvent(
      new CustomEvent("settings-changed", {
        detail: settings,
        bubbles: true,
        composed: true,
      }),
    );

    this.baseDialog.close();
  }

  render() {
    return html`
      <base-dialog title="Spiel-Einstellungen">
        <div class="settings-grid" style="display: grid; gap: 1rem;">
          <label
            >Modus:
            <select id="game-mode">
              <option value="pve">Mensch vs Bot</option>
              <option value="pvp" selected>Lokal (PvP)</option>
              <option value="online">Online</option>
            </select>
          </label>

          <label
            >Schwierigkeit:
            <select id="difficulty">
              <option value="easy">Einfach</option>
              <option value="medium" selected>Mittel</option>
              <option value="hard">Unmöglich</option>
            </select>
          </label>

          <label
            >Feldgröße (3-10):
            <input id="board-size" type="number" value="3" min="3" max="10" />
          </label>

          <label
            >Sieg-Bedingung (In einer Reihe):
            <input id="win-condition" type="number" value="3" min="3" max="5" />
          </label>
        </div>

        <div slot="footer">
          <button @click="${() => this.baseDialog.close()}">Abbrechen</button>
          <button class="primary" @click="${this.applySettings}">
            Übernehmen
          </button>
        </div>
      </base-dialog>
    `;
  }
}
