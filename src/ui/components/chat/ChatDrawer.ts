import { globalEventBus } from "@events/EventBus.ts";
import { AppEvent, EventActor } from "@events/EventTypes.ts";
import { Subscribe } from "@events/Subscribe.ts";
import { LitElement, html, css } from "lit";
import { customElement, state, query } from "lit/decorators.js";

@customElement("chat-drawer")
export class ChatDrawer extends LitElement {
  @state() private isOpen = false;
  @query(".chat-content") private container!: HTMLElement;
  @query("#chat-input") private input!: HTMLInputElement;
  static styles = css`
    :host {
      width: 0;
      height: 100%;
      background-color: var(--cell-bg);
      border-left: 0 solid transparent;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 100;
    }

    :host([open]) {
      width: 30.75rem;
      border-left: 0.125rem solid var(--border-color);
    }

    .chat-toggle-btn {
      position: fixed;
      right: 1.875rem;
      bottom: 1.875rem;
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 50%;
      background-color: var(--primary-accent);
      color: var(--bg-color);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0.25rem 0.9375rem rgba(0, 0, 0, 0.3);
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 200;
      transition:
        transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.2s;
    }

    :host([open]) .chat-toggle-btn {
      transform: scale(0);
      opacity: 0;
      pointer-events: none;
    }
    .chat-toggle-btn:hover {
      transform: scale(1.1) rotate(-3deg);
      box-shadow: 0 0.375rem 1.25rem var(--glow-core);
    }

    .chat-toggle-btn:active {
      transform: scale(0.9);
    }

    .drawer-header {
      padding: 0.9375rem;
      font-weight: bold;
      border-bottom: 0.0625rem solid var(--border-color);
      background-color: var(--bg-color);
      color: var(--text-main);
      white-space: nowrap;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-main);
      font-weight: bold;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .chat-content {
      flex-grow: 1;
      padding: 0.625rem;
      overflow-y: auto;
      background-color: var(--cell-bg);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .chat-input-area {
      padding: 0.625rem;
      border-top: 0.0625rem solid var(--border-color);
      background-color: var(--bg-color);
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      flex-shrink: 0;
    }

    input {
      flex-grow: 1;
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 0.0625rem solid var(--border-color);
      font-family: inherit;
      background: var(--cell-bg);
      color: var(--text-main);
    }

    button.send-btn {
      padding: 0.5rem 1rem;
      background: var(--primary-accent);
      color: var(--bg-color);
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-weight: bold;
      flex-shrink: 1;
    }

    .message {
      background-color: var(--bg-color);
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: 1px solid var(--border-color);
      word-break: break-word;
    }

    @media (max-width: 37.5rem) {
      :host {
        position: fixed !important;
        top: 0;
        right: 0;
        bottom: 0;
        height: 100dvh;
        border-left: none !important;
        z-index: 2000;
        box-shadow: -0.3125rem 0 1.25rem rgba(0, 0, 0, 0.5);
        background-color: var(--bg-color);
        opacity: 95%;
      }
      :host([open]) {
        width: 100% !important;
      }
      .chat-toggle-btn {
        bottom: 5.3125rem;
        right: 1.25rem;
        width: 3.125rem;
        height: 3.125rem;
        font-size: 1.2rem;
      }
    }
  `;

  public toggle() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.setAttribute("open", "");
    } else {
      this.removeAttribute("open");
    }
  }

  private sendMessage() {
    const msg = this.input.value.trim();
    if (!msg) return;

    globalEventBus.emit(AppEvent.Chat.MessageSent, EventActor.WebUI, {
      message: msg,
    });

    this.input.value = "";
  }

  @Subscribe(AppEvent.Chat.MessageSent, EventActor.WebUI)
  public onChatMessage(data: { message: string; sender?: string }) {
    const senderName = data.sender || "Du";
    this.addMessage(senderName, data.message);
  }

  public addMessage(sender: string, text: string) {
    const msgEl = document.createElement("div");
    msgEl.className = "message";
    msgEl.innerHTML = `<strong>${sender}:</strong> ${text}`;
    this.container.appendChild(msgEl);
    setTimeout(() => {
      this.container.scrollTop = this.container.scrollHeight;
    }, 10);
  }

  render() {
    return html`
      <button
        class="chat-toggle-btn"
        title="Chat öffnen"
        @click="${this.toggle}"
      >
        💬
      </button>

      <div class="drawer-header">
        <span>Global Chat</span>
        <button class="close-btn" @click="${this.toggle}">x</button>
      </div>
      <div class="chat-content"></div>
      <div class="chat-input-area">
        <input
          id="chat-input"
          @keypress="${(e: KeyboardEvent) =>
            e.key === "Enter" && this.sendMessage()}"
          placeholder="Nachricht..."
        />
        <button class="send-btn" @click="${this.sendMessage}">Senden</button>
      </div>
    `;
  }
}
