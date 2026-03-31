import { EventActor } from "../types/Events.ts";
const LogStyles: Record<EventActor, string> & { reset: string } = {
  [EventActor.Controller]: "color: #ff00ff; font-weight: bold;",
  [EventActor.WebUI]: "color: #00ffff; font-weight: bold;",
  [EventActor.LocalPlayer]: "color: #00ff00; font-weight: bold;",
  [EventActor.Anonymous]: "color: #ffffff;",
  [EventActor.Game]: "color: #ff8800; font-weight: bold;",
  [EventActor.Bus]: "color: #aaaaaa; font-style: italic;",
  [EventActor.Bot]: "color: #ff0000;",
  reset: "color: inherit;",
};
export class Logger {
  static isDebug = false;
  public static registeredScopes = new Set<EventActor>();

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
    level: "log" | "info" | "warn" | "error",
    owner: EventActor,
    ...data: any[]
  ) {
    if (this.isDebug && this.registeredScopes.has(owner)) {
      const style = LogStyles[owner] || LogStyles.reset;
      console[level](`%c[${owner}]%c`, style, LogStyles.reset, ...data);
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
  static table(owner: EventActor, tabularData: any) {
    if (this.isDebug && this.registeredScopes.has(owner)) {
      this.info(owner, "Table:");
      console.table(tabularData);
    }
  }
  static error(owner: EventActor, ...data: any[]) {
    this.formatAndLog("error", owner, ...data);
  }
}
