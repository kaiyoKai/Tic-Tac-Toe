import { Logger } from "@shared/Logger.js";
import "@ui/XOXOWebApp.ts";
import { LobbyController } from "@client/controllers/LobbyController.js";

Logger.isDebug = true;
Logger.setScopeAll();

export const lobbyController = new LobbyController();
