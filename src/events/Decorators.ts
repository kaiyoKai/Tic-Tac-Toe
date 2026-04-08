import { EventActor, type GlobalEventMap } from "@events/EventTypes.ts";
import { globalEventBus } from "@events/EventBus.ts";

export function Subscribe<K extends keyof GlobalEventMap>(
  eventName: K,
  actor: EventActor = EventActor.WebUI,
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalConnected = target.connectedCallback;
    const originalDisconnected = target.disconnectedCallback;

    const subscriptionKey = Symbol(`sub_${propertyKey}`);

    target.connectedCallback = function () {
      if (originalConnected) {
        originalConnected.call(this);
      }
      const boundMethod = descriptor.value.bind(this);
      this[subscriptionKey] = globalEventBus.on(eventName, actor, boundMethod);
    };

    target.disconnectedCallback = function () {
      if (this[subscriptionKey]) {
        this[subscriptionKey].unsubscribe();
      }
      if (originalDisconnected) {
        originalDisconnected.call(this);
      }
    };
  };
}

export function Emit<K extends keyof GlobalEventMap>(
  eventName: K,
  actor: EventActor = EventActor.WebUI,
) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const result = originalMethod.apply(this, args);

      if (result instanceof Promise) {
        result.then((_resolvedValue) => {
          // TypeScript  mit Array-Spread austricksen, weil der Compiler dynamischen Typen sonst nicht schluckt (Magie die ich nur halb verstehe)
          globalEventBus.emit(eventName, actor, ...([result] as any));
        });
      } else {
        globalEventBus.emit(eventName, actor, ...([result] as any));
      }

      return result;
    };

    return descriptor;
  };
}
