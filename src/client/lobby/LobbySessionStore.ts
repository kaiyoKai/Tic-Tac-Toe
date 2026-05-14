const SESSION_KEY = "xoxo.current-lobby";

export class LobbySessionStore {
  getCurrentLobbyId(): string | null {
    return localStorage.getItem(SESSION_KEY);
  }

  setCurrentLobbyId(lobbyId: string | null): void {
    if (!lobbyId) {
      localStorage.removeItem(SESSION_KEY);
      return;
    }

    localStorage.setItem(SESSION_KEY, lobbyId);
  }

  isActive(): boolean {
    return this.getCurrentLobbyId() !== null;
  }
}

export const lobbySessionStore = new LobbySessionStore();
