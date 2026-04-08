import type { PlayerSymbol, Position } from "@shared/Common.js";
import type { Player } from "./Player.js";
import { type Subscription } from "@events/EventBus.js";
import { globalEventBus } from "@events/EventBus.ts";
import { AppEvent, EventActor } from "@events/EventTypes.ts";
export class LocalPlayer implements Player {
  constructor(
    public symbol: PlayerSymbol,
    public userName: string,
    public userId: number,
  ) {}

  async makeMove(): Promise<Position | null> {
    return new Promise((resolve) => {
      let clickSub: Subscription;
      let resetSub: Subscription;
      let settingsSub: Subscription;

      const cleanup = () => {
        clickSub.unsubscribe();
        resetSub.unsubscribe();
        settingsSub.unsubscribe();
      };

      clickSub = globalEventBus.on(
        AppEvent.UI.CellClicked,
        EventActor.LocalPlayer,
        (data) => {
          cleanup();
          resolve(data);
        },
      );

      resetSub = globalEventBus.on(
        AppEvent.UI.ResetRequested,
        EventActor.LocalPlayer,
        () => {
          cleanup();
          resolve(null);
        },
      );

      settingsSub = globalEventBus.on(
        AppEvent.UI.SettingsChangeRequested,
        EventActor.LocalPlayer,
        () => {
          cleanup();
          resolve(null);
        },
      );
    });
  }
}
