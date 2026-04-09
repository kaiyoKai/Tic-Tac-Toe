import { Emit, Subscribe } from "@events/Decorators.ts";

import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
import { GameSettings } from "@engine/GameSettings.ts";
import { GameMode, Difficulty } from "@shared/Common.ts";
import "./BaseDialog.js";
import { globalEventBus } from "@events/EventBus.ts";
import { AppEvent, EventActor } from "@events/EventTypes.ts";

@customElement("lobby-dialog")
export class LobbyDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @query("#game-mode") private gameMode!: HTMLSelectElement;
  @query("#difficulty") private difficulty!: HTMLSelectElement;
  @query("#board-size") private boardSize!: HTMLInputElement;
  @query("#win-condition") private winCondition!: HTMLInputElement;

  public show() {
    this.baseDialog.show();
  }

  @Emit(AppEvent.UI.SettingsChangeRequested, EventActor.WebUI)
  private applySettings() {
    const settings = new GameSettings(
      this.gameMode.value as GameMode,
      parseInt(this.boardSize.value),
      parseInt(this.winCondition.value),
      this.difficulty.value as Difficulty,
    );
    this.baseDialog.close();
    return settings;
  }

  static styles = css``;

  render() {
    return html`
      <base-dialog title="Spiel-Einstellungen">
        <div style="display: grid; gap: 1rem; color: var(--text-main);">
          <label
            >Modus:
            <select id="game-mode">
              <option value="${GameMode.Bot}">Mensch vs Bot</option>
              <option value="${GameMode.Local}" selected>Lokal (PvP)</option>
              <option value="${GameMode.Online}">Online</option>
            </select>
          </label>
          <label
            >Schwierigkeit:
            <select id="difficulty">
              <option value="${Difficulty.Easy}">Einfach</option>
              <option value="${Difficulty.Medium}" selected>Mittel</option>
              <option value="${Difficulty.Hard}">Schwer</option>
            </select>
          </label>
          <label
            >Feldgröße:
            <input id="board-size" type="number" value="3" min="3" max="10" />
          </label>
          <label
            >Siegbedingung:
            <input id="win-condition" type="number" value="3" min="3" max="5" />
          </label>
        </div>
        <div slot="footer">
          <button @click="${() => this.baseDialog.close()}">Abbrechen</button>
          <button class="btn primary" @click="${this.applySettings}">
            Speichern
          </button>
        </div>
      </base-dialog>
    `;
  }
}
