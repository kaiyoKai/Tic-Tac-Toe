import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Icons } from "../components/SideBarIcons.ts";

@customElement("side-bar")
export class SideBar extends LitElement {
  @state() private collapsed = false;
  @state() private openDropdown: string | null = null;
  @state() private activeTab = "game";

  static styles = css`
    :host {
      --sidebar-width: 15.625rem;
      --sidebar-collapsed-width: 5rem;
      display: block;
      width: var(--sidebar-width);
      height: 100vh;
      background-color: var(--cell-bg);
      border-right: 0.0625rem solid var(--border-color);
      transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
      flex-shrink: 0;
      z-index: 200;
      overflow: hidden;
    }

    :host([collapsed]) {
      width: var(--sidebar-collapsed-width);
    }

    nav {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 0.5rem;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem;
      margin-bottom: 1rem;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: 0.8rem;
      color: var(--text-main);
      cursor: pointer;
      border-radius: 12px;
      margin-bottom: 0.25rem;
      transition: all 0.2s ease;
      white-space: nowrap;
      position: relative;
    }

    .menu-item:hover {
      background-color: var(--cell-hover);
    }

    .menu-item.active {
      background-color: var(--primary-accent);
      color: white;
    }

    .icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 1rem;
    }

    :host([collapsed]) .icon {
      margin-right: 0;
    }

    .label {
      opacity: 1;
      transition: opacity 0.2s ease;
    }

    :host([collapsed]) .label {
      opacity: 0;
      width: 0;
    }

    .chevron {
      margin-left: auto;
      transition: transform 0.3s ease;
    }

    .chevron.open {
      transform: rotate(180deg);
    }

    .sub-menu {
      margin-left: 2.5rem;
      border-left: 2px solid var(--border-color);
      overflow: hidden;
      max-height: 0;
      transition: max-height 0.3s ease-out;
    }

    .sub-menu.open {
      max-height: 200px;
    }

    .toggle-btn {
      background: none;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      padding: 5px;
      display: flex;
      transition: transform 0.3s ease;
    }

    :host([collapsed]) .toggle-btn {
      transform: rotate(180deg);
    }
  `;

  private menuItems = [
    { id: "game", label: "Spiel", icon: Icons.Home },
    {
      id: "lobby",
      label: "Lobby",
      icon: Icons.Lobby,
      children: [
        { id: "lobby-browser", label: "Server Liste" },
        { id: "lobby-settings", label: "Einstellungen" },
      ],
    },
    { id: "profile", label: "Profil", icon: Icons.Profile },
  ];

  private toggleSidebar() {
    this.collapsed = !this.collapsed;
    if (this.collapsed) {
      this.openDropdown = null;
      this.setAttribute("collapsed", "");
    } else {
      this.removeAttribute("collapsed");
    }
  }

  private handleNav(id: string, hasChildren: boolean) {
    if (this.collapsed) this.toggleSidebar();

    if (hasChildren) {
      this.openDropdown = this.openDropdown === id ? null : id;
    } else {
      this.activeTab = id;
      this.dispatchEvent(
        new CustomEvent("navigation-change", {
          detail: { target: id },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  render() {
    return html`
      <nav>
        <div class="header">
          <span class="icon">${Icons.Logo}</span>
          <button class="toggle-btn" @click="${this.toggleSidebar}">
            ${Icons.Toggle}
          </button>
        </div>

        ${this.menuItems.map(
          (item) => html`
            <div class="menu-group">
              <div
                class="menu-item ${this.activeTab === item.id ? "active" : ""}"
                @click="${() => this.handleNav(item.id, !!item.children)}"
              >
                <span class="icon">${item.icon}</span>
                <span class="label">${item.label}</span>
                ${item.children
                  ? html`
                      <span
                        class="chevron ${this.openDropdown === item.id
                          ? "open"
                          : ""}"
                      >
                        ${Icons.Chevron}
                      </span>
                    `
                  : ""}
              </div>

              ${item.children
                ? html`
                    <div
                      class="sub-menu ${this.openDropdown === item.id
                        ? "open"
                        : ""}"
                    >
                      ${item.children.map(
                        (child) => html`
                          <div
                            class="menu-item"
                            @click="${() => this.handleNav(child.id, false)}"
                          >
                            <span class="label">${child.label}</span>
                          </div>
                        `,
                      )}
                    </div>
                  `
                : ""}
            </div>
          `,
        )}
      </nav>
    `;
  }
}
