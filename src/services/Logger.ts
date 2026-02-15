import { EventActor } from "../types/Events.ts";

const LogStyles = {
  [EventActor.Controller]: "color: #ff00ff; font-weight: bold;", // Magenta
  [EventActor.WebUI]: "color: #00ffff; font-weight: bold;", // Cyan
  [EventActor.LocalPlayer]: "color: #00ff00; font-weight: bold;", // Grün
  [EventActor.Anonymous]: "color: #ffffff;", // Weiß
  [EventActor.Game]: "color: #ff8800; font-weight: bold;", // Orange
  [EventActor.Bus]: "color: #aaaaaa; font-style: italic;", // Grau
  reset: "color: inherit;",
} as const;
export class Logger {
  static isDebug = true;
  private static registeredScopes = new Set<EventActor>();

  private constructor() {}

  static register(actor: EventActor) {
    this.registeredScopes.add(actor);
  }

  static unregister(actor: EventActor) {
    this.registeredScopes.delete(actor);
  }

  static setScopeAll() {
    const actors = Object.values(EventActor) as EventActor[];
    actors.forEach((actor) => this.register(actor));
  }
  static setScopeNone() {
    this.registeredScopes.clear();
  }

  private static formatAndLog(
    level: "log" | "info" | "warn" | "table" | "error",
    owner: EventActor,
    ...data: any[]
  ) {
    if (this.isDebug && this.registeredScopes.has(owner)) {
      const style = LogStyles[owner] || LogStyles.reset;

      console[level](`%c[${owner}]`, style, ...data);
    }
  }
  static log(owner: EventActor, ...data: any[]) {
    this.formatAndLog("log", owner, ...data);
  }
  static info(owner: EventActor, ...data: any[]) {
    this.formatAndLog("info", owner, ...data);
  }
  static warn(owner: EventActor, ...data: any[]) {
    this.formatAndLog("warn", owner, ...data);
  }

  static table(owner: EventActor, ...data: any[]) {
    this.formatAndLog("table", owner, ...data);
  }
  static error(owner: EventActor, ...data: any[]) {
    this.formatAndLog("error", owner, ...data);
  }
}
