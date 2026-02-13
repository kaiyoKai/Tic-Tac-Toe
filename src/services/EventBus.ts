export interface Subscription {
  unsubscribe(): void;
}

export default class EventBus<T> {
  private listeners: Map<keyof T, Function[]> = new Map();

  on<K extends keyof T>(
    event: K,
    callBack: (data: T[K]) => void,
  ): Subscription {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    const eventFnList = this.listeners.get(event)!;
    eventFnList.push(callBack);

    console.log(
      `[Bus] Event: ${String(event)} | Listener Registriert: ${eventFnList.length}`,
    );

    return {
      unsubscribe: () => this.off(event, callBack),
    };
  }

  off<K extends keyof T>(event: K, callBack: Function): void {
    const eventFnList = this.listeners.get(event);
    if (!eventFnList) return;

    const filtered = eventFnList.filter((fn) => fn !== callBack);

    if (filtered.length === 0) {
      this.listeners.delete(event);
    } else {
      this.listeners.set(event, filtered);
    }
  }

  emit<K extends keyof T>(
    event: K,
    ...args: T[K] extends void ? [] : [T[K]] //args are optionals because some events dont need any
  ): void {
    const data = args[0] as T[K];
    const eventFnList = this.listeners.get(event) || [];

    console.log(
      `[Bus] Event: ${String(event)} | Versendet: ${eventFnList.length}`,
    );

    if (eventFnList.length === 0) {
      console.warn(`[Bus] Warnung: Niemand hört auf "${String(event)}"!`);
      return;
    }

    [...eventFnList].forEach((callBack) => callBack(data));
  }
  once<K extends keyof T>(event: K, callBack: (data: T[K]) => void): void {
    const handler = (data: T[K]) => {
      this.off(event, handler);
      callBack(data);
    };
    this.on(event, handler);
  }
}
