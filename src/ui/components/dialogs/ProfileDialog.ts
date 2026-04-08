import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { ThemeMap, type ThemeKey } from "@ui/Theme.ts";
import { assertPlayerSymbol } from "@shared/Common.ts";
import "emoji-picker-element";
import "./BaseDialog.js";
import { globalEventBus } from "@events/EventBus.ts";
import { AppEvent, EventActor } from "@events/EventTypes.ts";

@customElement("profile-dialog")
export class ProfileDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @state() public selectedThemeName: ThemeKey =
    (localStorage.getItem("user-theme") as ThemeKey) || "Catppuccin";
  @state() private buttonShape: string =
    localStorage.getItem("btn-shape") || "square";

  @state() private username: string = "Kai";
  @state() private symbol: string = "X";
  @state() private symbolError: string = "";
  @state() private showEmojiPicker: boolean = false;

  static styles = css`
    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 1.5rem;
      align-items: center;
    }
    .radio-group {
      display: flex;
      gap: 1rem;
    }
    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    select,
    input[type="text"] {
      padding: 0.5rem;
      border-radius: 8px;
      background: var(--bg-color);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      width: 100%;
    }
  `;

  public show() {
    this.baseDialog.show();
  }

  private handleThemeChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const theme = select.value as ThemeKey;
    this.selectedThemeName = theme;

    globalEventBus.emit(AppEvent.UI.ThemeChanged, EventActor.WebUI, theme);
  }

  private handleShapeChange(shape: "rounded" | "square") {
    this.buttonShape = shape;
    const radius = shape === "rounded" ? "50%" : "5%";

    globalEventBus.emit(
      AppEvent.UI.ButtonShapeChanged,
      EventActor.WebUI,
      radius,
    );
  }

  private saveAndClose() {
    const user = {
      username: this.username,
      symbol: assertPlayerSymbol(this.symbol),
    };

    globalEventBus.emit(
      AppEvent.UI.ProfileChangeRequested,
      EventActor.WebUI,
      user,
    );
    this.baseDialog.close();
  }

  render() {
    return html`
      <base-dialog title="Profil & Design">
        <div class="settings-grid">
          <label>Benutzername:</label>
          <input
            type="text"
            .value="${this.username}"
            @input="${(e: any) => (this.username = e.target.value)}"
          />

          <hr
            style="grid-column: 1 / -1; width: 100%; border: 0; border-top: 1px solid var(--border-color); margin: 0.5rem 0;"
          />

          <label>Farbschema:</label>
          <select @change="${this.handleThemeChange}">
            ${(Object.keys(ThemeMap) as ThemeKey[]).map(
              (key) => html`
                <option
                  value="${key}"
                  ?selected="${key === this.selectedThemeName}"
                >
                  ${key}
                </option>
              `,
            )}
          </select>

          <label>Button-Stil:</label>
          <div class="radio-group">
            <label class="radio-option">
              <input
                type="radio"
                name="shape"
                ?checked="${this.buttonShape === "rounded"}"
                @change="${() => this.handleShapeChange("rounded")}"
              />
              Rund
            </label>
            <label class="radio-option">
              <input
                type="radio"
                name="shape"
                ?checked="${this.buttonShape === "square"}"
                @change="${() => this.handleShapeChange("square")}"
              />
              Eckig
            </label>
          </div>
        </div>

        <div slot="footer">
          <button
            class="btn primary"
            @click="${this.saveAndClose}"
            ?disabled="${!!this.symbolError}"
          >
            Fertig
          </button>
        </div>
      </base-dialog>
    `;
  }
}
