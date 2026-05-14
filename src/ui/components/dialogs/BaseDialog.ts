import { LitElement, html, css } from "lit";
import { customElement, property, query } from "lit/decorators.js";

@customElement("base-dialog")
export class BaseDialog extends LitElement {
  @property({ type: String }) title = "";

  @query("dialog") private dialogElement!: HTMLDialogElement;

  static styles = css`
    :host {
      display: block;
    }

    dialog {
      border: none;
      border-radius: var(--ui-radius-md);
      padding: 0;
      background: var(--bg-color);
      color: var(--text-main);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      border: 1px solid var(--border-color);
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--ui-space-md) var(--ui-space-lg);
      border-bottom: 1px solid var(--border-color);
      background: var(--cell-bg);
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-main);
      cursor: pointer;
      line-height: 1;
    }

    .dialog-content {
      padding: var(--ui-space-lg);
    }

    .dialog-footer {
      padding: var(--ui-space-md) var(--ui-space-lg);
      display: flex;
      justify-content: flex-end;
      gap: var(--ui-space-sm);
      border-top: 1px solid var(--border-color);
    }
  `;

  public show() {
    this.dialogElement.showModal();
  }

  public close() {
    this.dialogElement.close();
  }

  render() {
    return html`
      <dialog
        @click="${(e: MouseEvent) =>
          e.target === this.dialogElement && this.close()}"
      >
        <div class="dialog-header">
          <h3>${this.title}</h3>
          <button class="close-btn" @click="${this.close}">&times;</button>
        </div>

        <div class="dialog-content">
          <slot></slot>
        </div>

        <div class="dialog-footer">
          <slot name="footer"></slot>
        </div>
      </dialog>
    `;
  }
}
