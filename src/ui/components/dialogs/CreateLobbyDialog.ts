import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { globalEventBus } from "@events/EventBus.js";
import { AppEvent, EventActor } from "@events/EventTypes.js";
import "./BaseDialog.js";
import "@components/primitives/AppButton.js";
import { profileStore } from "@client/profile/ProfileStore.js";
import {
  LobbyVisibility,
  type CreateLobbyRequest,
  type LobbySettings,
} from "@shared/contracts/LobbyContracts.js";
import { lobbyPresetStore } from "@client/lobby/LobbyPresetStore.js";

@customElement("create-lobby-dialog")
export class CreateLobbyDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @query("#lobby-name") private nameInput!: HTMLInputElement;
  @query("#max-players") private playersInput!: HTMLSelectElement;
  @query("#local-players") private localPlayersInput!: HTMLInputElement;
  @query("#bot-slots") private botSlotsInput!: HTMLInputElement;
  @query("#visibility") private visibilityInput!: HTMLSelectElement;
  @query("#auto-start") private autoStartInput!: HTMLInputElement;
  @query("#board-size") private boardSizeInput!: HTMLInputElement;
  @query("#win-con") private winConInput!: HTMLInputElement;
  @query("#gravity-enabled") private gravityInput!: HTMLInputElement;
  @query("#rotation-enabled") private rotationInput!: HTMLInputElement;
  @query("#move-timeout") private moveTimeoutInput!: HTMLInputElement;
  @query("#penalty-mode") private penaltyModeInput!: HTMLSelectElement;
  @query("#preset-select") private presetSelect!: HTMLSelectElement;
  @query("#preset-name") private presetNameInput!: HTMLInputElement;

  @state() private presets = lobbyPresetStore.list();
  @state() private boardSizeLimit = 3;

  public show() {
    this.baseDialog.show();
    this.applyPresetToForm(this.getSelectedPresetId());
  }

  private getSelectedPresetId(): string {
    return this.presetSelect?.value || "tic-tac-toe";
  }

  private applyPresetToForm(presetId: string) {
    const preset = lobbyPresetStore.get(presetId);
    if (!preset) return;

    const settings = preset.settings;
    if (this.playersInput) this.playersInput.value = String(settings.maxPlayers);
    if (this.localPlayersInput)
      this.localPlayersInput.value = String(settings.allowedLocalPlayers);
    if (this.botSlotsInput) this.botSlotsInput.value = String(settings.maxBots);
    if (this.visibilityInput) this.visibilityInput.value = settings.visibility;
    if (this.autoStartInput) this.autoStartInput.checked = settings.autoStart;
    if (this.boardSizeInput) this.boardSizeInput.value = String(settings.boardSize);
    this.boardSizeLimit = settings.boardSize;
    if (this.winConInput) this.winConInput.value = String(settings.winCon);
    if (this.gravityInput) this.gravityInput.checked = settings.gravityEnabled;
    if (this.rotationInput) this.rotationInput.checked = settings.rotationEnabled;
    if (this.moveTimeoutInput)
      this.moveTimeoutInput.value = String(settings.moveTimeoutMs);
    if (this.penaltyModeInput) this.penaltyModeInput.value = settings.penaltyMode;
  }

  private refreshPresets() {
    this.presets = lobbyPresetStore.list();
  }

  private handlePresetChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.applyPresetToForm(select.value);
  }

  private readSettings(): LobbySettings {
    return {
      maxPlayers: parseInt(this.playersInput.value),
      allowedLocalPlayers: parseInt(this.localPlayersInput.value),
      maxBots: parseInt(this.botSlotsInput.value),
      visibility: this.visibilityInput.value as LobbySettings["visibility"],
      autoStart: this.autoStartInput.checked,
      boardSize: parseInt(this.boardSizeInput.value),
      winCon: parseInt(this.winConInput.value),
      gravityEnabled: this.gravityInput.checked,
      rotationEnabled: this.rotationInput.checked,
      moveTimeoutMs: parseInt(this.moveTimeoutInput.value || "0"),
      penaltyMode: this.penaltyModeInput.value as LobbySettings["penaltyMode"],
      presetId: this.getSelectedPresetId(),
    };
  }

  private savePresetFromCurrentForm() {
    const presetName = this.presetNameInput.value.trim();
    const preset = lobbyPresetStore.save(presetName, this.readSettings());
    this.refreshPresets();
    this.requestUpdate();
    this.presetSelect.value = preset.id;
  }

  private requestCreation() {
    const profile = profileStore.load();
    if (!profile) {
      globalEventBus.emit(
        AppEvent.UI.DialogOpenRequested,
        EventActor.WebUI,
        "profile-dialog",
      );
      return;
    }

    const lobbyData: CreateLobbyRequest = {
      name: this.nameInput.value || "Neue Lobby",
      profile: {
        username: profile.username,
        symbol: profile.symbol,
        preferences: profile.preferences,
      },
      settings: this.readSettings(),
    };

    globalEventBus.emit(AppEvent.UI.LobbyCreateRequested, EventActor.WebUI, lobbyData);
    this.baseDialog.close();
  }

  private getDefaultLocalPlayers(maxPlayers: number): number {
    return Math.min(1, Math.max(0, maxPlayers - 1));
  }

  render() {
    const maxPlayers = Number(this.playersInput?.value || 4);
    return html`
      <base-dialog title="Neue Lobby erstellen">
        <div style="display: grid; gap: 1rem; color: var(--text-main);">
          <label>
            Preset:
            <select
              id="preset-select"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
              @change="${this.handlePresetChange}"
            >
              ${this.presets.map(
                (preset) => html`
                  <option value="${preset.id}">${preset.name}</option>
                `,
              )}
            </select>
          </label>
          <label>
            Eigene Preset-Bezeichnung:
            <input
              id="preset-name"
              type="text"
              placeholder="Mein Connect-Four"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Name der Lobby:
            <input
              id="lobby-name"
              type="text"
              placeholder="Kais Arena..."
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Maximale Spieler:
            <select
              id="max-players"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            >
              <option value="2">2 Spieler</option>
              <option value="4">4 Spieler</option>
              <option value="6">6 Spieler</option>
              <option value="8">8 Spieler</option>
            </select>
          </label>
          <label>
            Lokale Zusatzspieler:
            <input
              id="local-players"
              type="number"
              min="0"
              max="${Math.max(0, maxPlayers - 1)}"
              value="${this.getDefaultLocalPlayers(maxPlayers)}"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Bots:
            <input
              id="bot-slots"
              type="number"
              min="0"
              max="4"
              value="0"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Sichtbarkeit:
            <select
              id="visibility"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            >
              <option value="${LobbyVisibility.Public}" selected>Öffentlich</option>
              <option value="${LobbyVisibility.Private}">Privat</option>
              <option value="${LobbyVisibility.Local}">Lokal</option>
            </select>
          </label>
          <label>
            Spielfeldgröße:
            <input
              id="board-size"
              type="number"
              min="2"
              max="10"
              value="3"
              @input="${(event: Event) => {
                const value = parseInt((event.target as HTMLInputElement).value || "3");
                this.boardSizeLimit = value;
                if (this.winConInput && parseInt(this.winConInput.value || "3") > value) {
                  this.winConInput.value = String(value);
                }
              }}"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Gewinnbedingung:
            <input
              id="win-con"
              type="number"
              min="2"
              max="${this.boardSizeLimit}"
              value="3"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Zugzeitlimit (ms):
            <input
              id="move-timeout"
              type="number"
              min="0"
              value="0"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Strafmodus:
            <select
              id="penalty-mode"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            >
              <option value="warning">Verwarnung</option>
              <option value="random-move">Zufallszug</option>
              <option value="kick">Kick</option>
            </select>
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="gravity-enabled" type="checkbox" />
            Gravitation nach jedem Zug
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="rotation-enabled" type="checkbox" />
            Board-Rotation erlauben
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="auto-start" type="checkbox" />
            Automatisch starten, sobald alle Slots belegt sind
          </label>
        </div>
        <div slot="footer">
          <app-button @click="${() => this.baseDialog.close()}">Abbrechen</app-button>
          <app-button @click="${() => this.savePresetFromCurrentForm()}">
            Preset speichern
          </app-button>
          <app-button variant="primary" @click="${this.requestCreation}"
            >Erstellen & Starten</app-button
          >
        </div>
      </base-dialog>
    `;
  }
}
