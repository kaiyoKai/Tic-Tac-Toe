import { GameMode, Difficulty } from "../types/Common.js";
import { GameSettings } from "../core/GameSettings.js";
import { ThemeMap, type ThemeType } from "./Colors.js";
import EventBus from "../services/EventBus.ts";
import { EventActor, type GameEventMap } from "../types/Events.ts";
import type { GameResult } from "../core/GameResult.ts";

import { GameBoard } from "../components/GameBoard.ts";
import { SideBar } from "../components/Sidebar.ts";
import { ChatDrawer } from "../components/ChatDrawer.ts";
import { ProfileDialog } from "../components/ProfileDialog.ts";
import { LobbyDialog } from "../components/LobbyDialog.ts";
import { BrowserDialog } from "../components/BrowserDialog.ts";

export class WebUI {
  private boardComponent!: GameBoard;
  private sidebarComponent!: SideBar;
  private chatComponent!: ChatDrawer;
  private profileDialog!: ProfileDialog;
  private lobbyDialog!: LobbyDialog;
  private browserDialog!: BrowserDialog;

  private currentThemeName: ThemeType = "Catppuccin";

  constructor(private eventBus: EventBus<GameEventMap>) {
    this.initializeElements();
    this.setupComponentListeners();
    this.setupBusSubscriptions();
    this.initializeUIState();
  }

  private initializeElements(): void {
    this.boardComponent = document.querySelector("game-board") as GameBoard;
    this.sidebarComponent = document.querySelector("side-bar") as SideBar;
    this.chatComponent = document.querySelector("chat-drawer") as ChatDrawer;
    this.profileDialog = document.querySelector(
      "profile-dialog",
    ) as ProfileDialog;
    this.lobbyDialog = document.querySelector("lobby-dialog") as LobbyDialog;
    this.browserDialog = document.querySelector(
      "browser-dialog",
    ) as BrowserDialog;
  }

  private setupComponentListeners(): void {
    this.sidebarComponent.addEventListener("navigation-change", (e: any) => {
      const target = e.detail.target;
      if (target === "lobby-settings") this.lobbyDialog.show();
      if (target === "profile") this.profileDialog.show();
      if (target === "lobby-browser") this.browserDialog.show();
    });

    document
      .getElementById("chat-toggle-btn")
      ?.addEventListener("click", () => {
        this.chatComponent.toggle();
      });

    this.chatComponent.addEventListener("send-chat", (e: any) => {
      this.eventBus.emit("chat:message-sent", EventActor.WebUI, {
        message: e.detail,
      });
    });

    this.profileDialog.addEventListener("theme-changed", (e: any) => {
      this.applyTheme(e.detail.value as ThemeType);
    });

    this.profileDialog.addEventListener("shape-changed", (e: any) => {
      const radius = e.detail.value === "rounded" ? "50%" : "5%";
      this.boardComponent.cellRadius = radius;
      document.documentElement.style.setProperty("--cell-radius", radius);
    });

    this.lobbyDialog.addEventListener("settings-changed", (e: any) => {
      const { mode, difficulty, size, winCondition } = e.detail;

      const parsedSize = parseInt(size, 10);
      const parsedWinCon = winCondition ? parseInt(winCondition, 10) : 3;

      this.boardComponent.boardSize = parsedSize;

      const settings = new GameSettings(
        mode as GameMode,
        parsedSize,
        parsedWinCon,
        difficulty as Difficulty,
      );

      this.eventBus.emit(
        "ui:settings-change-requested",
        EventActor.WebUI,
        settings,
      );
    });

    this.browserDialog.addEventListener("join-server", (e: any) => {
      const serverId = e.detail.serverId;
      console.log(`Versuche Server ${serverId} beizutreten...`);

      this.eventBus.emit("chat:message-sent", EventActor.WebUI, {
        message: `System: Verbinde mit Server #${serverId}...`,
      });
    });
  }

  private setupBusSubscriptions(): void {
    this.eventBus.on("chat:message-sent", EventActor.Bus, (data) => {
      this.chatComponent.addMessage("System", data.message);
    });

    this.eventBus.on("game:board-state", EventActor.Game, (data) => {
      // @ts-ignore //I will change that later xD (nothing is more permanent than a temporary fix)
      this.boardComponent.cells = data.grid;
    });

    this.eventBus.on("game:move-made", EventActor.Game, (data) => {
      this.boardComponent.turnNumber = data.turn;
      this.boardComponent.currentPlayer = data.nextPlayerSymbol;
    });

    this.eventBus.on("game:finished", EventActor.Game, (result: GameResult) => {
      const msg = result.winner
        ? `Spieler ${result.winner} gewinnt!`
        : "Unentschieden!";
      this.boardComponent.winnerMessage = msg;
    });

    this.eventBus.on("sys:error", EventActor.Game, (err) => {
      console.error(`[Error ${err.code}]: ${err.message}`);
    });
  }

  private applyTheme(themeName: ThemeType): void {
    const theme = ThemeMap[themeName];
    if (!theme) return;

    this.currentThemeName = themeName;
    const root = document.documentElement;

    Object.entries(theme).forEach(([prop, value]) => {
      root.style.setProperty(`--${prop}`, value as string);
    });
  }

  private initializeUIState(): void {
    this.applyTheme(this.currentThemeName);
  }
}
