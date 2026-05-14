import { LitElement, html, css } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ThemeMap, type ThemeKey } from "@ui/Theme.ts";
import { assertPlayerSymbol } from "@shared/Common.ts";
import "emoji-picker-element";
import "./BaseDialog.js";
import { globalEventBus } from "@events/EventBus.ts";
import { AppEvent, EventActor } from "@events/EventTypes.ts";
import { Emit } from "@events/Decorators.ts";
import {
  ProfileButtonRadius,
  type ProfileDraft,
  type UserProfile,
} from "@shared/contracts/ProfileContracts.js";
import { profileStore } from "@client/profile/ProfileStore.js";

@customElement("profile-dialog")
export class ProfileDialog extends LitElement {
  @query("base-dialog") private baseDialog!: any;
  @state() public selectedThemeName: ThemeKey =
    (localStorage.getItem("user-theme") as ThemeKey) || "Catppuccin";
  @state() private buttonShape: "rounded" | "square" =
    localStorage.getItem("btn-shape-radius") === "50%" ? "rounded" : "square";

  @state() private username = "";
  @state() private symbol = "X";
  @state() private symbolError: string = "";
  @state() private showEmojiPicker: boolean = false;

  static styles = css`
    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 1.5rem;
      align-items: center;
    }
    .emoji-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .emoji-picker-wrap {
      position: relative;
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
    emoji-picker {
      position: absolute;
      inset-inline-start: 0;
      top: 2.75rem;
      z-index: 20;
    }
  `;

  constructor() {
    super();
    const stored = profileStore.load();
    const draft = stored ?? profileStore.getDefaultDraft();
    this.username = draft.username;
    this.symbol = draft.symbol;
    this.selectedThemeName =
      (draft.preferences?.themeName as ThemeKey) ||
      (localStorage.getItem("user-theme") as ThemeKey) ||
      "Catppuccin";
    this.buttonShape =
      draft.preferences?.buttonRadius === ProfileButtonRadius.Rounded
        ? "rounded"
        : "square";
  }

  public show() {
    this.baseDialog.show();
  }

  private handleThemeChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    const theme = select.value as ThemeKey;
    this.selectedThemeName = theme;

    globalEventBus.emit(AppEvent.UI.ThemeChanged, EventActor.WebUI, theme);
  }

  @Emit(AppEvent.UI.ButtonShapeChanged, EventActor.WebUI)
  private handleShapeChange(shape: "rounded" | "square") {
    this.buttonShape = shape;
    const radius =
      shape === "rounded"
        ? ProfileButtonRadius.Rounded
        : ProfileButtonRadius.Square;
    return radius;
  }

  @Emit(AppEvent.UI.ProfileChangeRequested, EventActor.WebUI)
  private saveAndClose(): UserProfile {
    try {
      const profile: ProfileDraft = {
        username: this.username,
        symbol: assertPlayerSymbol(this.symbol),
        preferences: {
          themeName: this.selectedThemeName,
          buttonRadius:
            this.buttonShape === "rounded"
              ? ProfileButtonRadius.Rounded
              : ProfileButtonRadius.Square,
        },
      };

      const saved = profileStore.save(profile);
      this.symbolError = "";
      this.baseDialog.close();
      return saved;
    } catch (error) {
      this.symbolError =
        error instanceof Error ? error.message : "Ungültiges Symbol";
      throw error;
    }
  }

  private onEmojiClick(event: CustomEvent<any>) {
    this.symbol = assertPlayerSymbol(event.detail?.unicode ?? "😀");
    this.symbolError = "";
    this.showEmojiPicker = false;
  }

  render() {
    return html`
      <base-dialog title="Profil & Design">
        <div class="settings-grid">
          <label>Benutzername:</label>
          <input
            type="text"
            .value="${this.username}"
            @input="${(e: any) => {
              this.username = e.target.value;
              this.symbolError = "";
            }}"
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

          <label>Symbol:</label>
          <div class="emoji-row">
            <input
              type="text"
              .value="${this.symbol}"
              maxlength="2"
              @input="${(e: Event) => {
                this.symbol = (e.target as HTMLInputElement).value;
                this.symbolError = "";
              }}"
            />
            <div class="emoji-picker-wrap">
              <button
                class="btn"
                @click="${() => (this.showEmojiPicker = !this.showEmojiPicker)}"
                type="button"
              >
                😀
              </button>
              ${this.showEmojiPicker
                ? html`<emoji-picker @emoji-click="${this.onEmojiClick}"></emoji-picker>`
                : null}
            </div>
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
