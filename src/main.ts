import { GameController } from "./controller/GameController.js";
import EventBus from "./services/EventBus.ts";
import { Logger } from "./services/Logger.ts";
import { EventActor, type GameEventMap } from "./types/Events.ts";
import { WebUI } from "./ui/WebUI.js";

Logger.isDebug = true;
Logger.setScopeAll();

Logger.log(EventActor.Anonymous, "⚠️ MAIN.TS WIRD AUSGEFÜHRT ⚠️");

const eventBus = new EventBus<GameEventMap>();
const controller = new GameController({ bus: eventBus });
const webUI = new WebUI(eventBus);
