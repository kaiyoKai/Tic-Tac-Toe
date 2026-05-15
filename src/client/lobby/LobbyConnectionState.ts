import {
  ConnectionStatus,
  ToastEvent,
  ToastScope,
  type ConnectionStateSnapshot,
  type ToastEvent as ToastEventType,
  type ToastScope as ToastScopeType,
} from "@client/lobby/types.js";

const DEFAULT_SNAPSHOT: ConnectionStateSnapshot = {
  status: ConnectionStatus.Offline,
  activeLobbyId: null,
  hasConnectedOnce: false,
  canUseOnlineActions: false,
  chatLabel: "Lokaler Chat",
};

function toSnapshot(
  status: ConnectionStateSnapshot["status"],
  activeLobbyId: string | null,
  hasConnectedOnce: boolean,
): ConnectionStateSnapshot {
  return {
    status,
    activeLobbyId,
    hasConnectedOnce,
    canUseOnlineActions: status !== ConnectionStatus.Pending,
    chatLabel:
      status === ConnectionStatus.InOnlineLobby
        ? "Lobby Chat"
        : status === ConnectionStatus.ConnectedGlobal
          ? "Globaler Chat"
          : status === ConnectionStatus.Pending
            ? "Verbinde..."
            : "Lokaler Chat",
  };
}

export class LobbyConnectionStateMachine {
  private snapshot: ConnectionStateSnapshot = { ...DEFAULT_SNAPSHOT };

  getSnapshot(): ConnectionStateSnapshot {
    return { ...this.snapshot };
  }

  startConnecting(): ConnectionStateSnapshot {
    this.snapshot = toSnapshot(
      ConnectionStatus.Pending,
      this.snapshot.activeLobbyId,
      this.snapshot.hasConnectedOnce,
    );
    return this.getSnapshot();
  }

  markConnected(): { state: ConnectionStateSnapshot; shouldToast: boolean } {
    const shouldToast = !this.snapshot.hasConnectedOnce;
    this.snapshot = toSnapshot(
      this.snapshot.activeLobbyId
        ? ConnectionStatus.InOnlineLobby
        : ConnectionStatus.ConnectedGlobal,
      this.snapshot.activeLobbyId,
      true,
    );
    return {
      state: this.getSnapshot(),
      shouldToast,
    };
  }

  markDisconnected(): ConnectionStateSnapshot {
    this.snapshot = toSnapshot(
      ConnectionStatus.Offline,
      null,
      this.snapshot.hasConnectedOnce,
    );
    return this.getSnapshot();
  }

  joinLobby(lobbyId: string): ConnectionStateSnapshot {
    if (!lobbyId.trim()) {
      throw new Error("Lobby-ID darf nicht leer sein.");
    }

    this.snapshot = toSnapshot(
      ConnectionStatus.InOnlineLobby,
      lobbyId,
      this.snapshot.hasConnectedOnce,
    );
    return this.getSnapshot();
  }

  leaveLobby(): ConnectionStateSnapshot {
    this.snapshot = toSnapshot(
      this.snapshot.hasConnectedOnce
        ? ConnectionStatus.ConnectedGlobal
        : ConnectionStatus.Offline,
      null,
      this.snapshot.hasConnectedOnce,
    );
    return this.getSnapshot();
  }

  requiresLobbyReplacementConfirmation(nextLobbyId?: string | null): boolean {
    if (!this.snapshot.activeLobbyId) return false;
    if (!nextLobbyId) return true;
    return this.snapshot.activeLobbyId !== nextLobbyId;
  }
}

export function shouldToastForRealtimeEvent(
  scope: ToastScopeType,
  event: ToastEventType,
): boolean {
  if (scope === ToastScope.Connection) {
    return event === ToastEvent.FirstConnected;
  }

  if (scope === ToastScope.GlobalChat) {
    return false;
  }

  return (
    event === ToastEvent.UserJoined ||
    event === ToastEvent.UserLeft ||
    event === ToastEvent.SelfJoined
  );
}

type Listener = (snapshot: ConnectionStateSnapshot) => void;

export class LobbyConnectionStore {
  private readonly machine = new LobbyConnectionStateMachine();
  private readonly listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    listener(this.machine.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  getSnapshot(): ConnectionStateSnapshot {
    return this.machine.getSnapshot();
  }

  startConnecting(): ConnectionStateSnapshot {
    return this.publish(this.machine.startConnecting());
  }

  markConnected(): { state: ConnectionStateSnapshot; shouldToast: boolean } {
    const result = this.machine.markConnected();
    this.publish(result.state);
    return result;
  }

  markDisconnected(): ConnectionStateSnapshot {
    return this.publish(this.machine.markDisconnected());
  }

  joinLobby(lobbyId: string): ConnectionStateSnapshot {
    return this.publish(this.machine.joinLobby(lobbyId));
  }

  leaveLobby(): ConnectionStateSnapshot {
    return this.publish(this.machine.leaveLobby());
  }

  requiresLobbyReplacementConfirmation(nextLobbyId?: string | null): boolean {
    return this.machine.requiresLobbyReplacementConfirmation(nextLobbyId);
  }

  private publish(snapshot: ConnectionStateSnapshot): ConnectionStateSnapshot {
    for (const listener of this.listeners) {
      listener(snapshot);
    }
    return snapshot;
  }
}

export const lobbyConnectionStore = new LobbyConnectionStore();
