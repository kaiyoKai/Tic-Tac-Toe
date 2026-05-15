import { describe, expect, it } from "vitest";
import {
  LobbyConnectionStateMachine,
  shouldToastForRealtimeEvent,
} from "@client/lobby/LobbyConnectionState.js";
import { ConnectionStatus, ToastEvent, ToastScope } from "@client/lobby/types.js";

describe("LobbyConnectionStateMachine", () => {
  it("transitions offline -> pending -> connected_global -> in_online_lobby", () => {
    const machine = new LobbyConnectionStateMachine();

    expect(machine.getSnapshot().status).toBe(ConnectionStatus.Offline);
    expect(machine.startConnecting().status).toBe(ConnectionStatus.Pending);

    const connected = machine.markConnected();
    expect(connected.state.status).toBe(ConnectionStatus.ConnectedGlobal);
    expect(connected.shouldToast).toBe(true);

    expect(machine.joinLobby("lobby-1").status).toBe(ConnectionStatus.InOnlineLobby);
  });

  it("returns to connected_global when leaving an online lobby", () => {
    const machine = new LobbyConnectionStateMachine();
    machine.startConnecting();
    machine.markConnected();
    machine.joinLobby("lobby-1");

    const nextState = machine.leaveLobby();
    expect(nextState.status).toBe(ConnectionStatus.ConnectedGlobal);
    expect(nextState.activeLobbyId).toBeNull();
  });

  it("requires confirmation before replacing an active lobby", () => {
    const machine = new LobbyConnectionStateMachine();
    machine.startConnecting();
    machine.markConnected();
    machine.joinLobby("lobby-1");

    expect(machine.requiresLobbyReplacementConfirmation("lobby-2")).toBe(true);
    expect(machine.requiresLobbyReplacementConfirmation("lobby-1")).toBe(false);
  });
});

describe("shouldToastForRealtimeEvent", () => {
  it("only toasts once for the first successful connection", () => {
    expect(
      shouldToastForRealtimeEvent(
        ToastScope.Connection,
        ToastEvent.FirstConnected,
      ),
    ).toBe(true);
    expect(
      shouldToastForRealtimeEvent(ToastScope.Connection, ToastEvent.UserJoined),
    ).toBe(false);
  });

  it("suppresses join toasts in the global chat", () => {
    expect(
      shouldToastForRealtimeEvent(ToastScope.GlobalChat, ToastEvent.UserJoined),
    ).toBe(false);
  });

  it("keeps lobby join/leave/self-join toasts enabled", () => {
    expect(
      shouldToastForRealtimeEvent(ToastScope.Lobby, ToastEvent.UserJoined),
    ).toBe(true);
    expect(
      shouldToastForRealtimeEvent(ToastScope.Lobby, ToastEvent.UserLeft),
    ).toBe(true);
    expect(
      shouldToastForRealtimeEvent(ToastScope.Lobby, ToastEvent.SelfJoined),
    ).toBe(true);
  });
});
