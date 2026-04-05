import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { ThemeMap, type ThemeKey, type ThemeValue } from "../ui/Colors.js";
import "./BaseDialog.js";

@customElement("profile-dialog")
export class ProfileDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @state() private selectedThemeName: ThemeKey = "Catppuccin";
  @state() private buttonShape: "rounded" | "square" = "rounded";

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
    select {
      padding: 0.5rem;
      border-radius: 8px;
      background: var(--cell-bg);
      color: var(--text-main);
      border: 1px solid var(--border-color);
    }
  `;

  public show() {
    this.baseDialog.show();
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
  render() {
    return html`
      <base-dialog title="Profil & Design">
        <div class="settings-grid">
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
          <button class="btn primary" @click="${() => this.baseDialog.close()}">
            Fertig
          </button>
        </div>
      </base-dialog>
    `;
  }
}
