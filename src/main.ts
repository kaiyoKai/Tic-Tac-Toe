import { GameController } from "./controller/GameController.js";
import EventBus from "./services/EventBus.ts";
import { Logger } from "./services/Logger.ts";
import { EventActor, type GameEventMap } from "./types/Events.ts";
import { WebUI } from "./ui/WebUI.js";

Logger.isDebug = true;
Logger.setScopeAll();

Logger.log(EventActor.Anonymous, "⚠️ MAIN.TS WIRD AUSGEFÜHRT ⚠️");

async function init() {
  const eventBus = new EventBus<GameEventMap>();

  await Promise.all([
    customElements.whenDefined("game-board"),
    customElements.whenDefined("side-bar"),
  ]);
  const webUI = new WebUI(eventBus);

  const controller = new GameController({ bus: eventBus });
  const ui = new WebUI(eventBus);
}

init();
Logger.log(EventActor.Anonymous, " Intit! ");
