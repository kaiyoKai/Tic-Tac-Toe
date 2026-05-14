import { LitElement, html, css } from "lit";
import { customElement, query } from "lit/decorators.js";
import { globalEventBus } from "@events/EventBus.js";
import { EventActor } from "@events/EventTypes.js";
import "./BaseDialog.js";
import "@components/primitives/AppButton.js";

@customElement("create-lobby-dialog")
export class CreateLobbyDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @query("#lobby-name") private nameInput!: HTMLInputElement;
  @query("#max-players") private playersInput!: HTMLSelectElement;

  public show() {
    this.baseDialog.show();
  }

  private requestCreation() {
    const lobbyData = {
      name: this.nameInput.value || "Neue Lobby",
      username: "Kai",
      maxPlayers: parseInt(this.playersInput.value),
    };

    globalEventBus.emit(
      "ui:lobby-create-requested" as any,
      EventActor.WebUI,
      lobbyData,
    );

    this.baseDialog.close();
  }

  render() {
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
            </select>
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
