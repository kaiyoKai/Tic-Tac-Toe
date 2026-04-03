import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Icons } from "./SideBarIcons.js";

@customElement("side-bar")
export class SideBar extends LitElement {
  @state() private collapsed = false;
  @state() private openDropdown: string | null = null;
  @state() private activeTab = "game";

  private navigationMap: Record<string, string> = {
    "lobby-settings": "lobby-dialog",
    profile: "profile-dialog",
    "lobby-browser": "browser-dialog",
  };

  static styles = css`
    :host {
      display: block;
      width: 15.625rem;
      height: 100vh;
      padding: 0.3125rem 1em;
      background-color: var(--cell-bg);
      border-right: 0.0625rem solid var(--border-color);
      transition: 300ms ease-in-out;
      overflow-x: hidden;
      white-space: nowrap;
      flex-shrink: 0;
      z-index: 200;
    }
    :host([collapsed]) {
      padding: 0.3125rem;
      width: 4.5rem;
    }
    nav {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .header {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-bottom: 1rem;
    }
    .icon {
      flex-shrink: 0;
      fill: var(--text-main);
      display: flex;
      align-items: center;
    }
    .menu-item {
      border-radius: 0.5em;
      padding: 0.85em;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 1em;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .menu-item:hover {
      background-color: var(--cell-hover);
    }
    .menu-item.active {
      color: var(--primary-accent);
      background-color: color-mix(
        in srgb,
        var(--primary-accent),
        transparent 90%
      );
    }
    .menu-item.active .icon {
      fill: var(--primary-accent);
    }
    .label {
      transition: opacity 0.2s;
    }
    :host([collapsed]) .label,
    :host([collapsed]) .chevron {
      display: none;
    }
    .chevron {
      margin-left: auto;
      transition: transform 200ms ease;
    }
    .chevron.open {
      transform: rotate(180deg);
    }
    .sub-menu {
      height: 0;
      opacity: 0;
      visibility: hidden;
      overflow: hidden;
      transition:
        height 300ms ease-in-out,
        opacity 300ms ease,
        visibility 300ms;
    }
    .sub-menu.show {
      height: auto;
      opacity: 1;
      visibility: visible;
    }
    .sub-item {
      padding-left: 3.5em;
      font-size: 0.9em;
      opacity: 0.8;
    }
    button.toggle-btn {
      background: transparent;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      padding: 0.3125rem;
      border-radius: 4px;
    }
    button.toggle-btn:hover {
      background-color: var(--cell-hover);
    }
    button.toggle-btn svg {
      transition: transform 300ms ease;
    }
    :host([collapsed]) button.toggle-btn svg {
      transform: rotate(180deg);
    }

    /* Mobile Styles aus deiner originalen CSS */
    @media (max-width: 37.5rem) {
      :host {
        width: 100%;
        height: 3.75rem;
        bottom: 0;
        top: auto;
        position: fixed;
        border-right: none;
        border-top: 0.0625rem solid var(--border-color);
        padding: 0;
        z-index: 1000;
      }
      nav {
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        height: 100%;
      }
      .header,
      .label,
      .chevron {
        display: none;
      }
      .menu-item {
        flex: 1;
        justify-content: center;
        padding: 0;
      }
      .icon svg {
        transform: scale(1.1);
      }
      .sub-menu {
        position: absolute;
        bottom: 3.75rem;
        left: 0;
        width: 100%;
        background: var(--bg-color);
        border-top: 0.0625rem solid var(--border-color);
        box-shadow: 0 -0.3125rem 1.25rem rgba(0, 0, 0, 0.3);
      }
      .sub-menu.show {
        height: auto;
      }
      .sub-item {
        padding: 0.9375rem;
        justify-content: center;
        border-bottom: 0.0625rem solid var(--border-color);
      }
    }
  `;

  private handleNav(id: string, hasChildren: boolean) {
    if (this.collapsed) {
      this.collapsed = false;
      this.removeAttribute("collapsed");
    }

    if (hasChildren) {
      this.openDropdown = this.openDropdown === id ? null : id;
    } else {
      this.activeTab = id;

      const target = this.navigationMap[id];
      if (target) {
        // WICHTIG: bubbles und composed, damit die WebUI es hören kann!
        this.dispatchEvent(
          new CustomEvent("ui-action", {
            detail: { action: "open-dialog", payload: target },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  }

  render() {
    return html`
      <nav>
        <div class="header">
          <span class="icon">${Icons.Logo}</span>
          <button
            class="toggle-btn"
            @click="${() => {
              this.collapsed = !this.collapsed;
              this.collapsed
                ? this.setAttribute("collapsed", "")
                : this.removeAttribute("collapsed");
            }}"
          >
            ${Icons.Toggle}
          </button>
        </div>

        <div
          class="menu-item ${this.activeTab === "game" ? "active" : ""}"
          @click="${() => this.handleNav("game", false)}"
        >
          <span class="icon">${Icons.Home}</span>
          <span class="label">Spiel</span>
        </div>

        <div class="menu-item" @click="${() => this.handleNav("lobby", true)}">
          <span class="icon">${Icons.Lobby}</span>
          <span class="label">Lobby</span>
          <span class="chevron ${this.openDropdown === "lobby" ? "open" : ""}"
            >${Icons.Chevron}</span
          >
        </div>

        <div class="sub-menu ${this.openDropdown === "lobby" ? "show" : ""}">
          <div
            class="menu-item sub-item"
            @click="${() => this.handleNav("lobby-browser", false)}"
          >
            <span class="label">Server Liste</span>
          </div>
          <div
            class="menu-item sub-item"
            @click="${() => this.handleNav("lobby-settings", false)}"
          >
            <span class="label">Einstellungen</span>
          </div>
        </div>

        <div
          class="menu-item ${this.activeTab === "profile" ? "active" : ""}"
          @click="${() => this.handleNav("profile", false)}"
        >
          <span class="icon">${Icons.Profile}</span>
          <span class="label">Profil</span>
        </div>
      </nav>
    `;
  }
}
