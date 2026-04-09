import { GameSettings } from "@engine/GameSettings.js";
import { GameController } from "./GameController.js";
import { LocalPlayer } from "@players/LocalPlayer.js";
import { Bot } from "@players/Bot.js";
import { type Player } from "@players/Player.js";
import { GameMode, assertPlayerSymbol } from "@shared/Common.js";
import { globalEventBus } from "@events/EventBus.js";
import { AppEvent, EventActor } from "@events/EventTypes.js";

export class LobbyController {
  public settings: GameSettings;
  private activeGameController: GameController | null = null;
  private nextUserId = 1;

  constructor() {
    this.settings = new GameSettings();
    const actor = EventActor.Controller;

    globalEventBus.on(AppEvent.UI.SettingsChangeRequested, actor, (data) => {
      this.settings = data;
    });

    globalEventBus.on(AppEvent.UI.ResetRequested, actor, () => {
      this.startGame();
    });

    globalEventBus.on(AppEvent.UI.GameStartRequested, actor, (data) => {
      this.settings = Object.assign(new GameSettings(), data);
      this.startGame();
    });
    globalEventBus.on(AppEvent.UI.SettingsChangeRequested, actor, (data) => {
      this.settings = data;

      globalEventBus.emit(AppEvent.UI.ToastRequested, EventActor.Controller, {
        message:
          "Einstellungen geändert – wird ab der nächsten Runde angewendet!",
        type: "info",
      });
    });
  }

  public startGame() {
    if (this.activeGameController) {
      this.activeGameController.stop();
    }

    const players = this.createPlayersForCurrentMode();
    this.activeGameController = new GameController(this.settings, players);

    globalEventBus.emit(AppEvent.Game.Start, EventActor.Controller, {
      settings: Object.assign(new GameSettings(), { ...this.settings }),
      turn: 1,
      nextPlayerSymbol: players[0].symbol,
    });
    setTimeout(() => {
      this.activeGameController?.startGameLoop();
    }, 50);
  }
  public createPlayersForCurrentMode(): Player[] {
    const players: Player[] = [];

    if (this.settings.mode === GameMode.Local) {
      players.push(
        new LocalPlayer(assertPlayerSymbol("😴"), "Niklas", this.nextUserId++),
      );
      players.push(
        new LocalPlayer(assertPlayerSymbol("🥺"), "Michi", this.nextUserId++),
      );
    } else if (this.settings.mode === GameMode.Bot) {
      players.push(
        new Bot(
          this.settings.difficulty,
          assertPlayerSymbol("😊"),
          "Kai",
          this.nextUserId++,
        ),
      );
      players.push(
        new Bot(
          this.settings.difficulty,
          assertPlayerSymbol("🇺🇲"),
          "Donald-Trump",
          this.nextUserId++,
        ),
      );
    }

    return players;
  }
}
