import { LitElement, html, css } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { ThemeMap } from "../ui/Colors.js";
import "./BaseDialog.js";

@customElement("profile-dialog")
export class ProfileDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;

  @state() private selectedTheme = "Catppuccin";
  @state() private buttonShape: "rounded" | "square" = "rounded";

  static styles = css`
    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 1.5rem;
      align-items: center;
    }

    label {
      font-weight: 500;
      color: var(--text-main);
    }

    select,
    .radio-group {
      padding: 0.5rem;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      background: var(--cell-bg);
      color: var(--text-main);
      font-family: inherit;
    }

    .radio-group {
      display: flex;
      gap: 1rem;
      border: none;
      padding: 0;
    }

    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    input[type="radio"] {
      accent-color: var(--primary-accent);
    }
  `;

  public show() {
    this.baseDialog.show();
  }

  private handleThemeChange(e: Event) {
    const target = e.target as HTMLSelectElement;
    this.selectedTheme = target.value;
    this.dispatchSetting("theme-changed", target.value);
  }

  private handleShapeChange(shape: "rounded" | "square") {
    this.buttonShape = shape;
    this.dispatchSetting("shape-changed", shape);
  }

  private dispatchSetting(eventName: string, value: string) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        detail: { value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  render() {
    return html`
      <base-dialog title="Einstellungen & Profil">
        <div class="settings-grid">
          <label for="theme-select">Farbschema:</label>
          <select
            id="theme-select"
            .value="${this.selectedTheme}"
            @change="${this.handleThemeChange}"
          >
            ${Object.keys(ThemeMap).map(
              (theme) => html` <option value="${theme}">${theme}</option> `,
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
