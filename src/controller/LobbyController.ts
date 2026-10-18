import { GameSettings } from "@engine/GameSettings.js";
import { GameController } from "./GameController.js";
import { LocalPlayer } from "@players/LocalPlayer.js";
import { Bot } from "@players/Bot.js";
import { type Player } from "@players/Player.js";
import { GameMode, assertPlayerSymbol } from "@shared/Common.js";

export class LobbyController {
  public settings: GameSettings;
  private activeGameController: GameController | null = null;
  private nextUserId = 1;

  public startGame() {
    throw new Error("TODO: Zeug implementieren");
  }

  public createPlayersForCurrentMode(): Player[] {
    const players: Player[] = [];

    if (this.settings.mode === GameMode.Local) {
      players.push(new LocalPlayer(assertPlayerSymbol("😴"), "Niklas", this.nextUserId++));
      players.push(new LocalPlayer(assertPlayerSymbol("🥺"), "Michi", this.nextUserId++));
    } else if (this.settings.mode === GameMode.Bot) {
      players.push(
        new Bot(this.settings.difficulty, assertPlayerSymbol("😊"), "Kai", this.nextUserId++),
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
