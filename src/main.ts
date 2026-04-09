import { Logger } from "@shared/Logger.js";
import "@ui/XOXOWebApp.ts";
import { LobbyController } from "./controller/LobbyController.ts";

Logger.isDebug = true;
Logger.setScopeAll();

const lobby = new LobbyController();
lobby.startGame();
