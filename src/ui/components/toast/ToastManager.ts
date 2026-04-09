import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { AppEvent, EventActor } from "@events/EventTypes.js";
import { Subscribe } from "@events/Decorators.js";

@customElement("toast-manager")
export class ToastManager extends LitElement {
  @state() private messages: { id: number; text: string; type: string }[] = [];
  private counter = 0;

  @Subscribe(AppEvent.UI.ToastRequested, EventActor.WebUI)
  onToast(data: { message: string; type?: string }) {
    const id = this.counter++;
    const type = data.type || "info";
    this.messages = [...this.messages, { id, text: data.message, type }];

    setTimeout(() => {
      this.messages = this.messages.filter((m) => m.id !== id);
    }, 4000);
  }

  static styles = css`
    :host {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: auto;
      pointer-events: none; /* Klicks gehen durch den Hintergrund durch */
    }

    .toast {
      pointer-events: auto; /* Klicks auf den Toast selbst erlauben */
      background: var(--cell-bg);
      color: var(--text-main);
      padding: 14px 24px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      /* Dynamische Border-Farbe basierend auf dem Typ */
      border-left: 6px solid var(--primary-accent);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      font-weight: 500;
      min-width: 300px;
      max-width: 500px;
      text-align: center;
      animation: slideDown 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    /* Varianten basierend auf dem Typ */
    .toast.error {
      border-left-color: var(--color-error);
    }
    .toast.success {
      border-left-color: var(--color-win);
    }
    .toast.info {
      border-left-color: var(--primary-accent);
    }

    /* Mobile Version */
    @media (max-width: 600px) {
      :host {
        top: 10px;
        width: 90%;
      }
      .toast {
        min-width: unset;
        width: 100%;
        padding: 12px 16px;
        font-size: 0.9rem;
      }
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;

  render() {
    return html`
      ${this.messages.map(
        (m) => html` <div class="toast ${m.type}">${m.text}</div> `,
      )}
    `;
  }
}
