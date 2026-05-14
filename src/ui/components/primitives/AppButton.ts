import { LitElement, css, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

@customElement("app-button")
export class AppButton extends LitElement {
  @property() variant: "primary" | "ghost" = "ghost";
  @property({ type: Boolean, reflect: true }) disabled = false;

  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      padding: var(--ui-space-sm) var(--ui-space-lg);
      border-radius: var(--ui-radius-md);
      font-size: var(--ui-font-size-md);
      font-weight: 700;
      border: 2px solid var(--primary-accent);
      cursor: pointer;
      transition:
        background-color var(--ui-transition-fast),
        color var(--ui-transition-fast),
        transform var(--ui-transition-fast),
        opacity var(--ui-transition-fast);
      background: transparent;
      color: var(--primary-accent);
    }

    button.primary {
      background: var(--primary-accent);
      color: var(--bg-color);
    }

    button.ghost:hover {
      background: var(--primary-accent);
      color: var(--bg-color);
    }

    button.primary:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  `;

  render() {
    return html`
      <button
        type="button"
        ?disabled=${this.disabled}
        class=${classMap({
          primary: this.variant === "primary",
          ghost: this.variant === "ghost",
        })}
      >
        <slot></slot>
      </button>
    `;
  }
}
