import { io, Socket } from "socket.io-client";
import { globalEventBus } from "@events/EventBus.js";
import { AppEvent, EventActor } from "@events/EventTypes.js";
import {
  RealtimeClientEvent,
  RealtimeServerEvent,
} from "@shared/contracts/RealtimeContracts.js";

export class NetworkService {
  private socket: Socket;

  constructor() {
    this.socket = io("http://localhost:3001");

    this.setupListeners();
  }

  private setupListeners() {
    const actor = EventActor.Controller;

    // 1. Server antwortet -> Wir informieren die UI
    this.socket.on(RealtimeServerEvent.LobbyList, (lobbies) => {
      // (Wir tun mal so, als hätten wir AppEvent.UI.LobbiesUpdated in EventTypes.ts definiert)
      globalEventBus.emit("ui:lobbies-updated" as any, actor, lobbies);
    });

    // 2. UI schickt Befehle -> Wir funken den Server an
    globalEventBus.on(
      "ui:lobby-create-requested" as any,
      actor,
      (data: any) => {
        this.socket.emit(RealtimeClientEvent.CreateLobby, data);
      },
    );

    globalEventBus.on("ui:lobby-join-requested" as any, actor, (data: any) => {
      this.socket.emit(RealtimeClientEvent.JoinLobby, data);
    });

    globalEventBus.on("ui:lobby-list-refresh-requested" as any, actor, () => {
      this.socket.emit(RealtimeClientEvent.ListLobbies);
    });
  }
}
