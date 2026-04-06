import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { ThemeMap, type ThemeKey } from "../Colors.js";
import { assertPlayerSymbol } from "../../types/Common.ts";
import "emoji-picker-element";
import "./BaseDialog.js";

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
      background: var(--cell-bg);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      width: 100%;
      box-sizing: border-box;
      font-family: inherit;
    }
    .symbol-input-group {
      display: flex;
      gap: 0.5rem;
      position: relative;
    }
    .symbol-input-group input {
      width: 4rem;
      text-align: center;
      font-size: 1.2rem;
    }
    .btn-emoji {
      padding: 0.5rem 0.75rem;
      background: var(--cell-bg);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .btn-emoji:hover {
      filter: brightness(1.1);
    }
    .emoji-picker-container {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 100;
      margin-top: 0.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      border-radius: 8px;
    }
    .error-text {
      color: #ff4444;
      font-size: 0.8rem;
      margin-top: 0.25rem;
      grid-column: 2;
    }
  `;

  public show() {
    this.baseDialog.show();
  }

  private handleUsernameChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.username = target.value;
  }

  private handleSymbolChange(e: Event) {
    const target = e.target as HTMLInputElement;
    this.validateAndSetSymbol(target.value);
  }

  private validateAndSetSymbol(newSymbol: string) {
    try {
      const validSymbol = assertPlayerSymbol(newSymbol);
      this.symbol = validSymbol;
      this.symbolError = "";
    } catch (err: any) {
      this.symbol = newSymbol;
      this.symbolError = err.message;
    }
  }

  private toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  private handleEmojiSelect(e: any) {
    const emoji = e.detail.unicode;
    this.validateAndSetSymbol(emoji);
    this.showEmojiPicker = false;
  }

  private handleThemeChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    const selectedKey = target.value;

    this.dispatchEvent(
      new CustomEvent("ui-action", {
        detail: {
          action: "apply-theme",
          payload: selectedKey,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private handleShapeChange(shape: "rounded" | "square") {
    const radius = shape === "rounded" ? "50%" : "5%";
    this.dispatchEvent(
      new CustomEvent("ui-action", {
        detail: {
          action: "set-cell-radius",
          payload: radius,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private saveAndClose() {
    if (this.symbolError) return;

    this.dispatchEvent(
      new CustomEvent("ui-action", {
        detail: {
          action: "update-profile",
          payload: {
            username: this.username,
            symbol: this.symbol,
          },
        },
        bubbles: true,
        composed: true,
      }),
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
            @input="${this.handleUsernameChange}"
            placeholder="Dein Name"
          />

          <label>Dein Symbol:</label>
          <div>
            <div class="symbol-input-group">
              <input
                type="text"
                .value="${this.symbol}"
                @input="${this.handleSymbolChange}"
                maxlength="5"
              />
              <button
                class="btn-emoji"
                @click="${this.toggleEmojiPicker}"
                title="Emoji auswählen"
              >
                😀
              </button>

              ${this.showEmojiPicker
                ? html`
                    <div class="emoji-picker-container">
                      <emoji-picker
                        @emoji-click="${this.handleEmojiSelect}"
                      ></emoji-picker>
                    </div>
                  `
                : ""}
            </div>
            ${this.symbolError
              ? html`<div class="error-text">${this.symbolError}</div>`
              : ""}
          </div>

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
