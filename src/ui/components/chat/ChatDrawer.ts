import { repeat } from "lit/directives/repeat.js";
import { globalEventBus } from "@events/EventBus.ts";
import { AppEvent, EventActor } from "@events/EventTypes.ts";
import { Subscribe } from "@events/Decorators.ts";
import { LitElement, html, css, type PropertyValues } from "lit";
import { customElement, state, query, property } from "lit/decorators.js";
import type {
  ChatMessageSnapshot,
  ChatReactionRequest,
} from "@shared/contracts/ChatContracts.js";
import { profileStore } from "@client/profile/ProfileStore.js";
import { lobbySessionStore } from "@client/lobby/LobbySessionStore.js";
import "emoji-picker-element";

const QUICK_REACTIONS = ["👍", "❤️", "😂", "🎉", "😮", "🔥"];

@customElement("chat-drawer")
export class ChatDrawer extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false;
  @state() private messages: ChatMessageSnapshot[] = [];
  @state() private emojiPickerOpen = false;
  @query(".chat-content") private container!: HTMLElement;
  @query("#chat-input") private input!: HTMLTextAreaElement;

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
      position: relative;
    }

    textarea,
    input {
      flex-grow: 1;
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 0.0625rem solid var(--border-color);
      font-family: inherit;
      background: var(--cell-bg);
      color: var(--text-main);
    }

    textarea {
      field-sizing: content;
      resize: none;
      min-height: 1.5em;
      max-height: 150px;
      overflow-y: auto;
    }

    button.send-btn,
    button.emoji-btn,
    button.reaction-btn {
      padding: 0.5rem 0.85rem;
      background: var(--primary-accent);
      color: var(--bg-color);
      border: none;
      border-radius: 0.35rem;
      cursor: pointer;
      font-weight: bold;
      flex-shrink: 0;
    }

    button.emoji-btn {
      min-width: 2.6rem;
    }

    .emoji-picker-wrap {
      position: absolute;
      inset-inline-end: 0.75rem;
      bottom: 4.8rem;
      z-index: 30;
    }

    emoji-picker {
      width: min(100%, 22rem);
      height: 22rem;
    }

    .message {
      background-color: var(--bg-color);
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: 1.5px solid var(--border-color);
      word-break: break-word;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.35rem;
    }

    .time {
      color: var(--primary-accent);
      font-size: 0.8rem;
    }

    .message:hover {
      border: 2px solid var(--border-color);
      filter: drop-shadow(0 0 1rem var(--glow-core));
    }

    .message-actions {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    .reaction-row {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
      margin-top: 0.4rem;
    }

    .reaction-pill {
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-accent) 18%, var(--bg-color));
      border: 1px solid var(--border-color);
      font-size: 0.82rem;
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

  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    }
  }

  protected updated(_changedProperties: PropertyValues) {
    if (_changedProperties.has("messages")) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  public toggle() {
    this.open = !this.open;
  }

  private sendMessage() {
    const messageContent = this.input.value.trim();
    if (!messageContent) return;

    const profile = profileStore.load();
    if (!profile) {
      globalEventBus.emit(
        AppEvent.UI.DialogOpenRequested,
        EventActor.WebUI,
        "profile-dialog",
      );
      return;
    }
    const lobbyId = lobbySessionStore.getCurrentLobbyId() ?? "global";
    const message: ChatMessageSnapshot = {
      id: crypto.randomUUID(),
      lobbyId,
      senderId: profile.id,
      senderName: profile.username,
      content: messageContent,
      createdAt: Date.now(),
      reactions: [],
    };

    this.messages = [...this.messages, message];
    globalEventBus.emit(AppEvent.Chat.MessageSent, EventActor.WebUI, message);

    this.input.value = "";
    this.input.style.height = "auto";
    this.emojiPickerOpen = false;
  }

  private handleReactionRequest(messageId: string, emoji: string) {
    const lobbyId = lobbySessionStore.getCurrentLobbyId() ?? "global";
    const payload: ChatReactionRequest = {
      lobbyId,
      messageId,
      emoji,
    };

    globalEventBus.emit(
      AppEvent.Chat.MessageReactionRequested,
      EventActor.WebUI,
      payload,
    );
  }

  private toggleEmojiPicker() {
    this.emojiPickerOpen = !this.emojiPickerOpen;
  }

  private handleEmojiClick(event: CustomEvent<any>) {
    const unicode = event.detail?.unicode ?? "😀";
    this.input.value = `${this.input.value}${unicode}`;
    this.input.focus();
    this.emojiPickerOpen = false;
  }

  @Subscribe(AppEvent.Chat.MessageReceived, EventActor.WebUI)
  public onChatMessage(message: ChatMessageSnapshot) {
    if (this.messages.some((entry) => entry.id === message.id)) return;

    this.messages = [...this.messages, message];
  }

  @Subscribe(AppEvent.Chat.MessageReactionReceived, EventActor.WebUI)
  public onReaction(message: ChatMessageSnapshot) {
    this.messages = this.messages.map((entry) =>
      entry.id === message.id ? message : entry,
    );
  }

  render() {
    return html`
      <button class="chat-toggle-btn" @click="${this.toggle}">💬</button>

      <div class="drawer-header">
        <span>Lobby Chat</span>
        <button class="close-btn" @click="${this.toggle}">x</button>
      </div>

      <div class="chat-content">
        ${repeat(
          this.messages,
          (m) => m.id,
          (m) => html`
            <div class="message">
              <div class="message-header">
                <strong>${m.senderName}</strong>
                <span class="time">
                  ${new Date(m.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div>${m.content}</div>
              <div class="reaction-row">
                ${m.reactions.map(
                  (reaction) => html`
                    <span class="reaction-pill">
                      ${reaction.emoji} ${reaction.userIds.length}
                    </span>
                  `,
                )}
              </div>
              <div class="message-actions">
                ${QUICK_REACTIONS.map(
                  (emoji) => html`
                    <button
                      class="reaction-btn"
                      title="Reagieren mit ${emoji}"
                      @click="${() => this.handleReactionRequest(m.id, emoji)}"
                    >
                      ${emoji}
                    </button>
                  `,
                )}
              </div>
            </div>
          `,
        )}
      </div>

      <div class="chat-input-area">
        <textarea
          id="chat-input"
          placeholder="Nachricht..."
          rows="1"
          @keydown="${this.handleKeyDown}"
          @input="${(e: Event) => {
            const el = e.target as HTMLTextAreaElement;
            el.style.height = "auto";
            el.style.height = el.scrollHeight + "px";
          }}"
        ></textarea>
        <button
          class="emoji-btn"
          @click="${this.toggleEmojiPicker}"
          title="Emoji einfügen"
        >
          ✨
        </button>
        <button class="send-btn" @click="${this.sendMessage}">Senden</button>
        ${this.emojiPickerOpen
          ? html`
              <div class="emoji-picker-wrap">
                <emoji-picker @emoji-click="${this.handleEmojiClick}"></emoji-picker>
              </div>
            `
          : null}
      </div>
    `;
  }
}
