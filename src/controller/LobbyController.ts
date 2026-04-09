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
      this.GameSettings = data;
    });

    globalEventBus.on(AppEvent.UI.ResetRequested, actor, () => {
      this.startGame();
    });

    globalEventBus.on(AppEvent.UI.GameStartRequested, actor, () => {
      this.startGame();
    });
  }

  public startGame() {
    const players = this.createPlayersForCurrentMode();
    this.activeGameController = new GameController(this.settings, players);
    this.activeGameController.startGameLoop();
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
