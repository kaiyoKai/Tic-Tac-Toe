import { io, type Socket } from "socket.io-client";
import { globalEventBus } from "@events/EventBus.ts";
import { AppEvent, EventActor } from "@events/EventTypes.ts";
import { GameSettings } from "@engine/GameSettings.js";
import { mapLobbySettingsToGameSettings } from "@client/lobby/LobbySettingsAdapter.js";
import {
  RealtimeClientEvent,
  RealtimeServerEvent,
  type ChatMessageRequest,
  type ChatMessageSnapshot,
  type ChatReactionRequest,
  type CreateLobbyRequest,
  type JoinLobbyRequest,
  type LobbySnapshot,
  type MoveRequest,
  type MoveResponse,
  type ProfileDraft,
  type RotateBoardRequest,
  type UpdateLobbyRequest,
} from "@shared/contracts/RealtimeContracts.js";
import type { LobbySettings } from "@shared/contracts/LobbyContracts.js";
import { lobbySessionStore } from "@client/lobby/LobbySessionStore.js";
import { resolveRealtimeServerUrl } from "@client/network/RealtimeConnectionConfig.js";
import { profileStore } from "@client/profile/ProfileStore.js";

export class NetworkService {
  private socket: Socket;
  private currentLobby: LobbySnapshot | null = null;

  constructor() {
    this.socket = io(resolveRealtimeServerUrl());
    this.setupListeners();
  }

  private setupListeners() {
    const actor = EventActor.Controller;

    this.socket.on(RealtimeServerEvent.LobbyList, (lobbies: LobbySnapshot[]) => {
      globalEventBus.emit(AppEvent.UI.LobbiesUpdated, actor, lobbies);
    });

    this.socket.on(RealtimeServerEvent.LobbyUpdated, (lobby: LobbySnapshot) => {
      lobbySessionStore.setCurrentLobbyId(lobby.id);
      this.currentLobby = lobby;
      globalEventBus.emit(AppEvent.UI.LobbiesUpdated, actor, [lobby]);
    });

    this.socket.on(RealtimeServerEvent.LobbyJoined, (lobby: LobbySnapshot) => {
      lobbySessionStore.setCurrentLobbyId(lobby.id);
      this.currentLobby = lobby;
      globalEventBus.emit(AppEvent.UI.LobbiesUpdated, actor, [lobby]);
    });

    this.socket.on(RealtimeServerEvent.GameStart, (payload: any) => {
      const settings = Object.assign(new GameSettings(), payload.settings ?? {});
      const nextPlayerSymbol = (this.currentLobby?.members[0]?.symbol ?? "") as any;
      globalEventBus.emit(AppEvent.Game.Start, actor, {
        turn: 0,
        nextPlayerSymbol,
        settings,
      });
      globalEventBus.emit(AppEvent.UI.ToastRequested, actor, {
        message: "Match gestartet.",
        type: "success",
      });
    });

    this.socket.on(
      RealtimeServerEvent.ChatMessage,
      (message: ChatMessageSnapshot) => {
        globalEventBus.emit(AppEvent.Chat.MessageReceived, actor, message);
      },
    );

    this.socket.on(
      RealtimeServerEvent.ChatReaction,
      (message: ChatMessageSnapshot) => {
        globalEventBus.emit(AppEvent.Chat.MessageReactionReceived, actor, message);
      },
    );

    this.socket.on(RealtimeServerEvent.MoveAccepted, (response: MoveResponse) => {
      globalEventBus.emit(AppEvent.Game.MoveApplied, actor, response);
    });

    this.socket.on(RealtimeServerEvent.BoardRotated, (response: MoveResponse) => {
      globalEventBus.emit(AppEvent.Game.MoveApplied, actor, response);
    });

    this.socket.on(RealtimeServerEvent.MoveRejected, (response: MoveResponse) => {
      globalEventBus.emit(AppEvent.Game.MoveRejected, actor, response);
    });

    this.socket.on(RealtimeServerEvent.Error, (error) => {
      globalEventBus.emit(AppEvent.Sys.Error, actor, error);
    });

    this.socket.on(RealtimeServerEvent.HostTransferred, (payload: any) => {
      globalEventBus.emit(AppEvent.UI.ToastRequested, actor, {
        message: `Host gewechselt an ${payload.nextHostId}.`,
        type: "info",
      });
    });

    this.socket.on(RealtimeServerEvent.LobbySettingRequested, (request: any) => {
      globalEventBus.emit(AppEvent.UI.ToastRequested, actor, {
        message: `${request.requesterName} möchte ${request.targetSetting} ändern.`,
        type: "warning",
      });
    });

    this.socket.on(RealtimeServerEvent.LobbySettingDecided, (request: any) => {
      globalEventBus.emit(AppEvent.UI.ToastRequested, actor, {
        message:
          request.status === "accepted"
            ? `Lobby-Änderung für ${request.targetSetting} übernommen.`
            : `Lobby-Änderung für ${request.targetSetting} abgelehnt.`,
        type: request.status === "accepted" ? "success" : "info",
      });
    });

    globalEventBus.on(AppEvent.UI.LobbyCreateRequested, actor, (data: CreateLobbyRequest) => {
      this.socket.emit(RealtimeClientEvent.CreateLobby, data);
    });

    globalEventBus.on(AppEvent.UI.LobbyJoinRequested, actor, (data: JoinLobbyRequest) => {
      this.socket.emit(RealtimeClientEvent.JoinLobby, data);
    });

    globalEventBus.on(AppEvent.UI.LobbyListRefreshRequested, actor, () => {
      this.socket.emit(RealtimeClientEvent.ListLobbies);
    });

    globalEventBus.on(
      AppEvent.UI.LobbySettingsChanged,
      actor,
      (data: Partial<LobbySettings>) => {
        const lobbyId = lobbySessionStore.getCurrentLobbyId();
        if (!lobbyId) {
          globalEventBus.emit(
            AppEvent.UI.SettingsChangeRequested,
            actor,
            mapLobbySettingsToGameSettings(data),
          );
          return;
        }

        const payload: UpdateLobbyRequest = {
          lobbyId,
          settings: data,
        };
        this.socket.emit(RealtimeClientEvent.UpdateLobby, payload);
      },
    );

    globalEventBus.on(AppEvent.UI.ProfileChangeRequested, actor, (profile) => {
      const saved = profileStore.save({
        username: profile.username,
        symbol: profile.symbol,
        preferences: profile.preferences,
      });

      const payload: ProfileDraft = {
        username: saved.username,
        symbol: saved.symbol,
        preferences: saved.preferences,
      };

      this.socket.emit(RealtimeClientEvent.UpdateProfile, payload);
    });

    globalEventBus.on(AppEvent.Chat.MessageSent, actor, (message) => {
      const lobbyId = lobbySessionStore.getCurrentLobbyId();
      if (!lobbyId) return;

      const payload: ChatMessageRequest = {
        lobbyId,
        content: message.content,
        id: message.id,
        senderId: message.senderId,
        senderName: message.senderName,
        createdAt: message.createdAt,
      };
      this.socket.emit(RealtimeClientEvent.SendMessage, payload);
    });

    globalEventBus.on(AppEvent.Chat.MessageReactionRequested, actor, (reaction) => {
      const lobbyId = lobbySessionStore.getCurrentLobbyId();
      if (!lobbyId) return;

      const payload: ChatReactionRequest = {
        lobbyId,
        messageId: reaction.messageId,
        emoji: reaction.emoji,
      };
      this.socket.emit(RealtimeClientEvent.ReactToMessage, payload);
    });

    globalEventBus.on(AppEvent.Game.MoveRequested, actor, (move: MoveRequest) => {
      this.socket.emit(RealtimeClientEvent.SubmitMove, move);
    });

    globalEventBus.on(
      AppEvent.Game.RotateRequested,
      actor,
      (payload: RotateBoardRequest) => {
        this.socket.emit(RealtimeClientEvent.RotateBoard, payload);
      },
    );
  }
}
