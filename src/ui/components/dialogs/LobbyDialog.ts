import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { Emit } from "@events/Decorators.js";
import { AppEvent, EventActor } from "@events/EventTypes.js";
import "./BaseDialog.js";
import "@components/primitives/AppButton.js";
import {
  LobbyVisibility,
  type LobbySettings,
} from "@shared/contracts/LobbyContracts.js";

@customElement("lobby-dialog")
export class LobbyDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @query("#max-players") private maxPlayers!: HTMLInputElement;
  @query("#local-players") private localPlayers!: HTMLInputElement;
  @query("#bots") private bots!: HTMLInputElement;
  @query("#visibility") private visibility!: HTMLSelectElement;
  @query("#auto-start") private autoStart!: HTMLInputElement;
  @query("#board-size") private boardSize!: HTMLInputElement;
  @query("#win-con") private winCon!: HTMLInputElement;
  @query("#gravity-enabled") private gravityEnabled!: HTMLInputElement;
  @query("#rotation-enabled") private rotationEnabled!: HTMLInputElement;
  @query("#move-timeout") private moveTimeout!: HTMLInputElement;
  @query("#penalty-mode") private penaltyMode!: HTMLSelectElement;
  @state() private boardSizeLimit = 3;

  public show() {
    this.baseDialog.show();
  }

  @Emit(AppEvent.UI.LobbySettingsChanged, EventActor.WebUI)
  private applySettings() {
    const settings: Partial<LobbySettings> = {
      maxPlayers: parseInt(this.maxPlayers.value),
      allowedLocalPlayers: parseInt(this.localPlayers.value),
      maxBots: parseInt(this.bots.value),
      visibility: this.visibility.value as LobbySettings["visibility"],
      autoStart: this.autoStart.checked,
      boardSize: parseInt(this.boardSize.value),
      winCon: parseInt(this.winCon.value),
      gravityEnabled: this.gravityEnabled.checked,
      rotationEnabled: this.rotationEnabled.checked,
      moveTimeoutMs: parseInt(this.moveTimeout.value || "0"),
      penaltyMode: this.penaltyMode.value as LobbySettings["penaltyMode"],
      presetId: null,
    };

    this.baseDialog.close();
    return settings;
  }

  static styles = css`
    .lobby-grid {
      display: grid;
      gap: 1rem;
      color: var(--text-main);
    }
    label {
      display: grid;
      gap: 0.35rem;
    }
    input,
    select {
      width: 100%;
      padding: 0.5rem;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      color: white;
      border-radius: 4px;
    }
  `;

  render() {
    return html`
      <base-dialog title="Lobby & Host">
      <div class="lobby-grid">
          <label>
            Maximale Spieler
            <input id="max-players" type="number" value="4" min="2" max="8" />
          </label>
          <label>
            Lokale Zusatzspieler
            <input id="local-players" type="number" value="1" min="0" max="7" />
          </label>
          <label>
            Bot-Slots
            <input id="bots" type="number" value="0" min="0" max="4" />
          </label>
          <label>
            Spielfeldgröße
            <input
              id="board-size"
              type="number"
              value="3"
              min="2"
              max="10"
              @input="${(event: Event) => {
                const value = parseInt((event.target as HTMLInputElement).value || "3");
                this.boardSizeLimit = value;
                if (this.winCon && parseInt(this.winCon.value || "3") > value) {
                  this.winCon.value = String(value);
                }
              }}"
            />
          </label>
          <label>
            Gewinnbedingung
            <input
              id="win-con"
              type="number"
              value="3"
              min="2"
              max="${this.boardSizeLimit}"
            />
          </label>
          <label>
            Zugzeitlimit (ms)
            <input id="move-timeout" type="number" value="0" min="0" />
          </label>
          <label>
            Strafmodus
            <select id="penalty-mode">
              <option value="warning">Verwarnung</option>
              <option value="random-move">Zufallszug</option>
              <option value="kick">Kick</option>
            </select>
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="gravity-enabled" type="checkbox" />
            Gravitation
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="rotation-enabled" type="checkbox" />
            Rotation erlauben
          </label>
          <label>
            Sichtbarkeit
            <select id="visibility">
              <option value="${LobbyVisibility.Public}">Öffentlich</option>
              <option value="${LobbyVisibility.Private}">Privat</option>
              <option value="${LobbyVisibility.Local}">Lokal</option>
            </select>
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="auto-start" type="checkbox" />
            Automatisch starten, wenn alle Slots belegt sind
          </label>
        </div>
        <div slot="footer">
          <app-button @click="${() => this.baseDialog.close()}">
            Abbrechen
          </app-button>
          <app-button variant="primary" @click="${this.applySettings}">
            Speichern
          </app-button>
        </div>
      </base-dialog>
    `;
  }
}
