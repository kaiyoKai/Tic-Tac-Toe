import { GameController } from "./controller/GameController.js";
import { Logger } from "@shared/Logger.js";
import { WebUI } from "./ui/WebUI.js";
import { EventActor } from "@events/EventTypes.ts";

Logger.isDebug = true;
Logger.setScopeAll();

Logger.log(EventActor.Anonymous, "⚠️ MAIN.TS WIRD AUSGEFÜHRT ⚠️");

async function init() {
  await Promise.all([
    customElements.whenDefined("game-board"),
    customElements.whenDefined("side-bar"),
  ]);
  const webUI = new WebUI();
  const controller = new GameController();
}

init();
Logger.log(EventActor.Anonymous, " Intit! ");
