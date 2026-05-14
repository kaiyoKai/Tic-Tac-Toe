// src/client/main.ts
import { Logger } from "@shared/Logger.js";
import "@ui/XOXOWebApp.ts";
import { LobbyController } from "@client/controllers/LobbyController.js";
import { NetworkService } from "src/services/NetworkService.ts";

Logger.isDebug = true;
Logger.setScopeAll();

export const lobbyController = new LobbyController();
export const networkService = new NetworkService();
