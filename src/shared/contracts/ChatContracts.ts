export interface ChatReactionSnapshot {
  emoji: string;
  userIds: string[];
}

export interface ChatMessageSnapshot {
  id: string;
  lobbyId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: number;
  reactions: ChatReactionSnapshot[];
}

export interface ChatMessageRequest {
  lobbyId: string;
  content: string;
  id?: string;
  senderId?: string;
  senderName?: string;
  createdAt?: number;
}

export interface ChatReactionRequest {
  lobbyId: string;
  messageId: string;
  emoji: string;
}

export interface ChatComposerState {
  content: string;
  emojiPickerOpen: boolean;
  quickReactions: string[];
}
