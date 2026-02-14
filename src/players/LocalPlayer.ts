import type { PlayerSymbol, Position } from "../types/Common.js";
import type { Player } from "./Player.js";
import EventBus, { type Subscription } from "../services/EventBus.js";
import { EventActor, type GameEventMap } from "../types/Events.ts";
export class LocalPlayer implements Player {
  constructor(
    public symbol: PlayerSymbol,
    public userName: string,
    public userId: number,
    private eventBus: EventBus<GameEventMap>,
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

      clickSub = this.eventBus.on(
        "ui:cell-clicked",
        EventActor.LocalPlayer,
        (data) => {
          cleanup();
          resolve(data);
        },
      );

      resetSub = this.eventBus.on(
        "ui:reset-requested",
        EventActor.LocalPlayer,
        () => {
          cleanup();
          resolve(null);
        },
      );

      settingsSub = this.eventBus.on(
        "ui:settings-change-requested",
        EventActor.LocalPlayer,
        () => {
          cleanup();
          resolve(null);
        },
      );
    });
  }
}
