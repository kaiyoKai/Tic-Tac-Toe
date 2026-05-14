import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
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

@customElement("create-lobby-dialog")
export class CreateLobbyDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @query("#lobby-name") private nameInput!: HTMLInputElement;
  @query("#max-players") private playersInput!: HTMLSelectElement;
  @query("#local-players") private localPlayersInput!: HTMLInputElement;
  @query("#bot-slots") private botSlotsInput!: HTMLInputElement;
  @query("#visibility") private visibilityInput!: HTMLSelectElement;
  @query("#auto-start") private autoStartInput!: HTMLInputElement;

  public show() {
    this.baseDialog.show();
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
    const settings: LobbySettings = {
      maxPlayers: parseInt(this.playersInput.value),
      allowedLocalPlayers: parseInt(this.localPlayersInput.value),
      maxBots: parseInt(this.botSlotsInput.value),
      visibility: this.visibilityInput.value as LobbySettings["visibility"],
      autoStart: this.autoStartInput.checked,
    };

    const lobbyData: CreateLobbyRequest = {
      name: this.nameInput.value || "Neue Lobby",
      profile: {
        username: profile.username,
        symbol: profile.symbol,
        preferences: profile.preferences,
      },
      settings,
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
            </select>
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="auto-start" type="checkbox" />
            Automatisch starten, sobald alle Slots belegt sind
          </label>
        </div>
        <div slot="footer">
          <app-button @click="${() => this.baseDialog.close()}"
            >Abbrechen</app-button
          >
          <app-button variant="primary" @click="${this.requestCreation}"
            >Erstellen & Starten</app-button
          >
        </div>
      </base-dialog>
    `;
  }
}
