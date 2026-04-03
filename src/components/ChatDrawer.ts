import { LitElement, html, css } from "lit";
import { customElement, state, query } from "lit/decorators.js";

@customElement("chat-drawer")
export class ChatDrawer extends LitElement {
  @state() private isOpen = false;
  @query(".messages-container") private container!: HTMLElement;
  @query("#chat-input") private input!: HTMLInputElement;

  static styles = css`
    :host {
      position: fixed;
      right: -350px;
      top: 0;
      width: 350px;
      height: 100vh;
      background: var(--cell-bg);
      border-left: 1px solid var(--border-color);
      transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      display: flex;
      flex-direction: column;
      z-index: 1000;
    }
    :host([open]) {
      right: 0;
    }
    .header {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      font-weight: bold;
    }
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }
    .input-area {
      padding: 1rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: 0.5rem;
    }
    input {
      flex: 1;
      padding: 0.5rem;
      border-radius: 4px;
      border: 1px solid var(--border-color);
      background: var(--bg-color);
      color: var(--text-main);
    }
  `;

  public toggle() {
    this.isOpen = !this.isOpen;
    this.isOpen ? this.setAttribute("open", "") : this.removeAttribute("open");
  }

  private sendMessage() {
    const msg = this.input.value.trim();
    if (msg) {
      this.dispatchEvent(
        new CustomEvent("send-chat", {
          detail: { message: msg },
          bubbles: true,
          composed: true,
        }),
      );
      this.input.value = "";
    }
  }

  render() {
    return html`
      <div class="header">Chat</div>
      <div class="messages-container"></div>
      <div class="input-area">
        <input
          id="chat-input"
          @keypress="${(e: any) => e.key === "Enter" && this.sendMessage()}"
          placeholder="Nachricht..."
        />
        <button @click="${this.sendMessage}">Senden</button>
      </div>
    `;
  }
}
