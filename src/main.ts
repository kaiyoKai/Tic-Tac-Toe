import { GameController } from "./controller/GameController.js";
import EventBus from "./services/EventBus.ts";
import type { GameEventMap } from "./types/Events.ts";
import { GameUI } from "./ui/GameUI.js";

const eventBus = new EventBus<GameEventMap>();
const controller = new GameController({ bus: eventBus });
const ui = new GameUI(eventBus);
controller.startGameLoop();
