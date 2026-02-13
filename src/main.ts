import { GameController } from "./controller/GameController.js";
import EventBus from "./services/EventBus.ts";
import type { GameEventMap } from "./types/Events.ts";
import { WebUI } from "./ui/WebUI.js";

const eventBus = new EventBus<GameEventMap>();
const controller = new GameController({ bus: eventBus });
const webUI = new WebUI(eventBus);
controller.startGameLoop();
