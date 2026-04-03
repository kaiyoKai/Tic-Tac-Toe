import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Icons } from "./SideBarIcons.js";

@customElement("side-bar")
export class SideBar extends LitElement {
  @state() private collapsed = false;
  @state() private openDropdown: string | null = null;
  @state() private activeTab = "game";

  static styles = css`
    :host {
      width: 15.625rem;
      height: 100vh;
      background-color: var(--cell-bg);
      border-right: 1px solid var(--border-color);
      transition: width 0.3s ease;
      flex-shrink: 0;
      z-index: 200;
    }
    :host([collapsed]) {
      width: 5rem;
    }
    nav {
      display: flex;
      flex-direction: column;
      padding: 0.5rem;
      height: 100%;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem;
    }
    .menu-item {
      display: flex;
      align-items: center;
      padding: 0.8rem;
      color: var(--text-main);
      cursor: pointer;
      border-radius: 12px;
      margin-bottom: 0.25rem;
      transition: background 0.2s;
    }
    .menu-item:hover {
      background-color: var(--cell-hover);
    }
    .menu-item.active {
      background-color: rgba(0, 0, 0, 0.05);
      color: var(--primary-accent);
    }
    .icon {
      width: 24px;
      height: 24px;
      margin-right: 1rem;
      flex-shrink: 0;
    }
    :host([collapsed]) .label,
    :host([collapsed]) .chevron {
      display: none;
    }
    .sub-menu {
      margin-left: 2.5rem;
      border-left: 2px solid var(--border-color);
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s;
    }
    .sub-menu.open {
      max-height: 200px;
    }
  `;

  private navigationMap: Record<string, string> = {
    "lobby-settings": "lobby-dialog",
    profile: "profile-dialog",
    "lobby-browser": "browser-dialog",
  };

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
          <span class="icon">${Icons.Home}</span
          ><span class="label">Spiel</span>
        </div>
        <div class="menu-item" @click="${() => this.handleNav("lobby", true)}">
          <span class="icon">${Icons.Lobby}</span
          ><span class="label">Lobby</span>
        </div>
        <div class="sub-menu ${this.openDropdown === "lobby" ? "open" : ""}">
          <div
            class="menu-item"
            @click="${() => this.handleNav("lobby-browser", false)}"
          >
            Server Liste
          </div>
          <div
            class="menu-item"
            @click="${() => this.handleNav("lobby-settings", false)}"
          >
            Settings
          </div>
        </div>
        <div
          class="menu-item ${this.activeTab === "profile" ? "active" : ""}"
          @click="${() => this.handleNav("profile", false)}"
        >
          <span class="icon">${Icons.Profile}</span
          ><span class="label">Profil</span>
        </div>
      </nav>
    `;
  }
}
