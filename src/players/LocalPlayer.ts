import type { Position } from "../types/Common.js";
import type { Player } from "./Player.js";
import EventBus, { type Subscription } from "../services/EventBus.js";
import type { GameEventMap } from "../types/Events.ts";
export class LocalPlayer implements Player {
  constructor(
    public symbol: string,
    public userName: string,
    public userId: number,
    private eventBus: EventBus<GameEventMap>,
  ) {}

  async makeMove(): Promise<Position | null> {
    return new Promise((resolve) => {
      let clickSub: Subscription;
      let resetSub: Subscription;

      const cleanup = () => {
        clickSub.unsubscribe();
        resetSub.unsubscribe();
      };

      clickSub = this.eventBus.on("ui:cell-clicked", (data) => {
        cleanup();
        resolve(data);
      });

      resetSub = this.eventBus.on("ui:reset-requested", () => {
        cleanup();
        resolve(null);
      });
    });
  }
}
