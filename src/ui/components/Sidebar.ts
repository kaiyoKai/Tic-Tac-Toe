import { LitElement, html, css, type TemplateResult } from "lit";
import { customElement, state } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import { Icons } from "./SideBarIcons.js";

interface NavItem {
  id: string;
  label: string;
  icon: any;
  dialog?: string;
  children?: NavItem[];
}

const NAV_CONFIG: NavItem[] = [
  { id: "game", label: "Spiel", icon: Icons.Home },
  {
    id: "lobby",
    label: "Lobby",
    icon: Icons.Lobby,
    children: [
      {
        id: "lobby-browser",
        label: "Lobby Liste",
        icon: Icons.Browser,
        dialog: "browser-dialog",
      },
      {
        id: "lobby-settings",
        label: "Einstellungen",
        icon: Icons.Settings,
        dialog: "lobby-dialog",
      },
    ],
  },
  {
    id: "profile",
    label: "Profil",
    icon: Icons.Profile,
    dialog: "profile-dialog",
  },
];

@customElement("side-bar")
export class SideBar extends LitElement {
  @state() private collapsed = false;
  @state() private openDropdown: string | null = null;
  @state() private activeTab = "game";

  static styles = css`
    :host {
      --sidebar-width: 14rem;
      --sidebar-collapsed-width: 4rem;
      --anim-speed: 300ms;

      display: flex;
      flex-direction: column;
      width: var(--sidebar-width);
      height: 100dvh;
      padding: 0.5rem;
      background-color: var(--cell-bg, #1a1a1a);
      border-right: 1px solid var(--border-color, #333);
      transition: width var(--anim-speed) ease-in-out;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
      white-space: nowrap;
      flex-shrink: 0;
      z-index: 200;
    }

    :host([collapsed]) {
      width: var(--sidebar-collapsed-width);
    }

    nav {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 0.25rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 0 0.5rem;
    }

    .icon {
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
      fill: var(--text-main, #fff);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-item {
      border-radius: 0.5rem;
      padding: 0.5rem;
      color: var(--text-main, #fff);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition:
        background-color 0.2s,
        color 0.2s;
      user-select: none;
      overflow: hidden;
    }

    .menu-item:hover {
      background-color: var(--cell-hover, rgba(255, 255, 255, 0.1));
    }
    .menu-item.active {
      color: var(--primary-accent, #007bff);
      background-color: color-mix(
        in srgb,
        var(--primary-accent) 15%,
        transparent
      );
    }
    .menu-item.active .icon {
      fill: var(--primary-accent, #007bff);
    }

    .label {
      flex-grow: 1;
      opacity: 1;
      max-width: 10rem;
      transition:
        opacity var(--anim-speed),
        max-width var(--anim-speed);
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.9rem;
    }

    .sub-menu {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows var(--anim-speed) ease,
        opacity var(--anim-speed) ease;
    }
    .sub-menu.show {
      grid-template-rows: 1fr;
      opacity: 1;
    }
    .sub-menu-inner {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .sub-item {
      padding-left: 2.5rem;
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .chevron {
      display: flex;
      flex-shrink: 0;
      transition:
        transform var(--anim-speed) ease,
        opacity var(--anim-speed);
    }
    .chevron.open {
      transform: rotate(180deg);
    }

    button.toggle-btn {
      background: transparent;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    button.toggle-btn:hover {
      background-color: var(--cell-hover);
    }

    :host([collapsed]) .label,
    :host([collapsed]) .chevron {
      opacity: 0;
      max-width: 0;
      margin: 0;
    }
    :host([collapsed]) .sub-menu {
      display: none;
    }
    :host([collapsed]) button.toggle-btn svg {
      transform: rotate(180deg);
    }

    /* --- MOBILE --- */
    @media (max-width: 37.5rem) {
      :host {
        width: 100%;
        height: 3.5rem;
        bottom: 0;
        top: auto;
        position: fixed;
        border-right: none;
        border-top: 1px solid var(--border-color);
        padding: 0;
        flex-direction: row;
        z-index: 1000;
        overflow-y: visible;
      }
      nav {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0;
        gap: 0;
      }
      .header {
        display: none;
      }
      .menu-item {
        flex-direction: column;
        gap: 0.15rem;
        border-radius: 0;
        padding: 0;
        justify-content: center;
        align-items: center;
        flex: 1;
        min-width: 0;
        height: 100%;
      }
      .icon {
        width: 1.1rem;
        height: 1.1rem;
      }
      .icon svg {
        transform: scale(1);
      }
      .label {
        font-size: 0.65rem;
        display: block;
        max-width: 100%;
        opacity: 1;
        text-align: center;
      }
      .sub-menu {
        position: absolute;
        bottom: 3.5rem;
        left: 0;
        width: 100%;
        background: var(--cell-bg, #1a1a1a);
        border-top: 1px solid var(--border-color);
        box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
      }
      .sub-menu.show {
        display: block;
      }
      .sub-item {
        padding: 0.75rem;
        justify-content: center;
        border-bottom: 1px solid var(--border-color);
        font-size: 0.85rem;
      }
      .chevron {
        display: none !important;
      }
    }
  `;

  private handleNav(item: NavItem) {
    if (this.collapsed) this.toggleCollapse(false);
    if (item.children) {
      this.openDropdown = this.openDropdown === item.id ? null : item.id;
    } else {
      this.activeTab = item.id;
      if (item.dialog) {
        this.dispatchEvent(
          new CustomEvent("ui-action", {
            detail: { action: "open-dialog", payload: item.dialog },
            bubbles: true,
            composed: true,
          }),
        );
      }
    }
  }

  private toggleCollapse(force?: boolean) {
    this.collapsed = force !== undefined ? force : !this.collapsed;
    if (this.collapsed) this.setAttribute("collapsed", "");
    else this.removeAttribute("collapsed");
  }

  private renderMenuItem(item: NavItem, isSubItem = false): TemplateResult {
    const isActive = this.activeTab === item.id;
    const hasChildren = !!item.children;
    const isOpen = this.openDropdown === item.id;

    return html`
      <div
        class="menu-item ${isSubItem ? "sub-item" : ""} ${isActive
          ? "active"
          : ""}"
        @click="${() => this.handleNav(item)}"
      >
        ${item.icon ? html`<span class="icon">${item.icon}</span>` : ""}
        <span class="label">${item.label}</span>
        ${hasChildren
          ? html`<span class="chevron ${isOpen ? "open" : ""}"
              >${Icons.Chevron}</span
            >`
          : ""}
      </div>
      ${hasChildren
        ? html`<div class="sub-menu ${isOpen ? "show" : ""}">
            <div class="sub-menu-inner">
              ${item.children!.map((child) => this.renderMenuItem(child, true))}
            </div>
          </div>`
        : ""}
    `;
  }

  render() {
    return html`
      <nav>
        <div class="header">
          <span class="icon">${Icons.Logo}</span>
          <button class="toggle-btn" @click="${() => this.toggleCollapse()}">
            ${Icons.Toggle}
          </button>
        </div>
        ${map(NAV_CONFIG, (item) => this.renderMenuItem(item))}
      </nav>
    `;
  }
}
