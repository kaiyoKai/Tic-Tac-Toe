import { GameController } from "./controller/GameController.js";
import { Logger } from "@shared/Logger.js";
import { EventActor } from "@events/EventTypes.ts";
import "@ui/XOXOWebApp.ts";

Logger.isDebug = true;
Logger.setScopeAll();

const controller = new GameController();
