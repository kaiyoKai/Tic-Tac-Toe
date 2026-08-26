//TODO: Komplett entfernen
import { EventActor, type GlobalEventMap } from "@events/EventTypes.ts";
import { Logger } from "@shared/Logger.ts";

export interface Subscription {
  unsubscribe(): void;
}

interface ListenerEntry {
  callBack: (...args: any[]) => void;
  subscriberName: EventActor;
}

export class EventBus<T> {
  private listeners: Map<keyof T, ListenerEntry[]> = new Map();

  on<K extends keyof T>(
    event: K,
    subscriberName: EventActor = EventActor.Anonymous,
    callBack: (data: T[K]) => void,
  ): Subscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const eventFnList = this.listeners.get(event)!;
    eventFnList.push({ callBack, subscriberName });

    Logger.log(
      EventActor.Bus,
      `On: "${String(event)}" | Registriert von: [${subscriberName}] (Gesamt: ${eventFnList.length})`,
    );

    return {
      unsubscribe: () => this.off(event, callBack),
    };
  }

  off<K extends keyof T>(event: K, callBack: (...args: any[]) => void): void {
    const eventFnList = this.listeners.get(event);
    if (!eventFnList) return;

    const filtered = eventFnList.filter((entry) => entry.callBack !== callBack);
    if (filtered.length === 0) {
      this.listeners.delete(event);
    } else {
      this.listeners.set(event, filtered);
    }
  }

  emit<K extends keyof T>(
    event: K,
    emitterName: EventActor = EventActor.Anonymous,
    ...args: T[K] extends void ? [] : [T[K]]
  ): void {
    const data = args[0] as T[K];
    const eventFnList = this.listeners.get(event) || [];

    Logger.log(
      EventActor.Bus,
      `Emit: "${String(event)}" | Von: [${emitterName}] | Empfänger: ${eventFnList.length}`,
    );

    if (eventFnList.length === 0) {
      Logger.warn(
        EventActor.Bus,
        `[Bus]  Warnung: Niemand hört auf "${String(event)}"!`,
      );
      return;
    }

    [...eventFnList].forEach((entry) => {
      Logger.log(
        EventActor.Bus,
        `==> Zustellung an: [${entry.subscriberName}]`,
      );
      entry.callBack(data);
    });
  }

  once<K extends keyof T>(
    event: K,
    subscriberName: EventActor = EventActor.Anonymous,
    callBack: (data: T[K]) => void,
  ): void {
    const handler = (data: T[K]) => {
      this.off(event, handler);
      callBack(data);
    };
    this.on(event, subscriberName, handler);
  }
}

export const globalEventBus = new EventBus<GlobalEventMap>();
