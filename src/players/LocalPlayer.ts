import type { Position } from "../types/Common.js";
import type { Player } from "./Player.js";
import EventBus from "../services/EventBus.js";
import type { GameEventMap } from "../types/Events.ts";
export class LocalPlayer implements Player {
  constructor(
    public symbol: string,
    public userName: string,
    public userId: number,
    private eventBus: EventBus<GameEventMap>,
  ) {}

  async makeMove(): Promise<Position> {
    return new Promise((resolve) => {
      this.eventBus.on("ui:cell-clicked", (data) => {
        resolve(data);
      });
    });
  }
}
