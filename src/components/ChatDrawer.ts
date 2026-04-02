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
      transition: right 0.3s ease;
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
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .input-area {
      padding: 1rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: 0.5rem;
    }
    input {
      flex: 1;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 0.5rem;
      border-radius: 4px;
    }
  `;

  public toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) this.setAttribute("open", "");
    else this.removeAttribute("open");
  }

  private sendMessage() {
    const msg = this.input.value.trim();
    if (!msg) return;

    this.dispatchEvent(new CustomEvent("send-chat", { detail: msg }));
    this.input.value = "";
  }

  public addMessage(sender: string, text: string) {
    const msgEl = document.createElement("div");
    msgEl.innerHTML = `<strong>${sender}:</strong> ${text}`;
    this.container.appendChild(msgEl);
    this.container.scrollTop = this.container.scrollHeight;
  }

  render() {
    return html`
      <div class="header">Chat</div>
      <div class="messages-container"></div>
      <div class="input-area">
        <input
          id="chat-input"
          @keypress="${(e: KeyboardEvent) =>
            e.key === "Enter" && this.sendMessage()}"
          placeholder="Nachricht..."
        />
        <button @click="${this.sendMessage}">Send</button>
      </div>
    `;
  }
}
