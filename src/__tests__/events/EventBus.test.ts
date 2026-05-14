import { describe, it, expect, beforeEach, vi } from "vitest";
import { EventBus } from "@events/EventBus";
import { EventActor } from "@events/EventTypes";

interface TestEventMap {
  "test:event1": string;
  "test:event2": { value: number };
  "test:event3": void;
}

describe("EventBus", () => {
  let eventBus: EventBus<TestEventMap>;

  beforeEach(() => {
    eventBus = new EventBus<TestEventMap>();
  });

  describe("on", () => {
    it("should register a listener", () => {
      const callback = vi.fn();
      const subscription = eventBus.on("test:event1", EventActor.Anonymous, callback);
      
      expect(subscription).toBeDefined();
      expect(subscription.unsubscribe).toBeDefined();
    });

    it("should call listener when event is emitted", () => {
      const callback = vi.fn();
      eventBus.on("test:event1", EventActor.Anonymous, callback);
      
      eventBus.emit("test:event1", EventActor.Anonymous, "test data");
      
      expect(callback).toHaveBeenCalledWith("test data");
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it("should support multiple listeners for same event", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      eventBus.on("test:event1", EventActor.Anonymous, callback1);
      eventBus.on("test:event1", EventActor.Anonymous, callback2);
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data");
      
      expect(callback1).toHaveBeenCalledWith("data");
      expect(callback2).toHaveBeenCalledWith("data");
    });

    it("should handle complex data types", () => {
      const callback = vi.fn();
      eventBus.on("test:event2", EventActor.Anonymous, callback);
      
      const data = { value: 42 };
      eventBus.emit("test:event2", EventActor.Anonymous, data);
      
      expect(callback).toHaveBeenCalledWith(data);
    });

    it("should handle void events", () => {
      const callback = vi.fn();
      eventBus.on("test:event3", EventActor.Anonymous, callback);
      
      eventBus.emit("test:event3", EventActor.Anonymous);
      
      expect(callback).toHaveBeenCalledWith(undefined);
    });
  });

  describe("off", () => {
    it("should unsubscribe a listener", () => {
      const callback = vi.fn();
      eventBus.on("test:event1", EventActor.Anonymous, callback);
      eventBus.off("test:event1", callback);
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data");
      
      expect(callback).not.toHaveBeenCalled();
    });

    it("should support unsubscribe method on subscription", () => {
      const callback = vi.fn();
      const subscription = eventBus.on("test:event1", EventActor.Anonymous, callback);
      
      subscription.unsubscribe();
      eventBus.emit("test:event1", EventActor.Anonymous, "data");
      
      expect(callback).not.toHaveBeenCalled();
    });

    it("should only unsubscribe specific callback", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      eventBus.on("test:event1", EventActor.Anonymous, callback1);
      eventBus.on("test:event1", EventActor.Anonymous, callback2);
      eventBus.off("test:event1", callback1);
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data");
      
      expect(callback1).not.toHaveBeenCalled();
      expect(callback2).toHaveBeenCalledWith("data");
    });
  });

  describe("once", () => {
    it("should call listener only once", () => {
      const callback = vi.fn();
      eventBus.once("test:event1", EventActor.Anonymous, callback);
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data1");
      eventBus.emit("test:event1", EventActor.Anonymous, "data2");
      
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith("data1");
    });

    it("should not call listener after first emission", () => {
      const callback = vi.fn();
      eventBus.once("test:event1", EventActor.Anonymous, callback);
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data1");
      expect(callback).toHaveBeenCalledTimes(1);
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data2");
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  describe("emit", () => {
    it("should emit event with correct actor name", () => {
      const callback = vi.fn();
      eventBus.on("test:event1", EventActor.Anonymous, callback);
      
      eventBus.emit("test:event1", EventActor.Controller, "data");
      
      expect(callback).toHaveBeenCalledWith("data");
    });

    it("should not throw when no listeners are registered", () => {
      expect(() => {
        eventBus.emit("test:event1", EventActor.Anonymous, "data");
      }).not.toThrow();
    });

    it("should call all listeners sequentially", () => {
      const callOrder: number[] = [];
      
      eventBus.on("test:event1", EventActor.Anonymous, () => {
        callOrder.push(1);
      });
      eventBus.on("test:event1", EventActor.Anonymous, () => {
        callOrder.push(2);
      });
      eventBus.on("test:event1", EventActor.Anonymous, () => {
        callOrder.push(3);
      });
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data");
      
      expect(callOrder).toEqual([1, 2, 3]);
    });
  });

  describe("complex scenarios", () => {
    it("should handle multiple event types", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();
      
      eventBus.on("test:event1", EventActor.Anonymous, callback1);
      eventBus.on("test:event2", EventActor.Anonymous, callback2);
      eventBus.on("test:event3", EventActor.Anonymous, callback3);
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data1");
      eventBus.emit("test:event2", EventActor.Anonymous, { value: 42 });
      eventBus.emit("test:event3", EventActor.Anonymous);
      
      expect(callback1).toHaveBeenCalledWith("data1");
      expect(callback2).toHaveBeenCalledWith({ value: 42 });
      expect(callback3).toHaveBeenCalledWith(undefined);
    });

    it("should handle listener modification during emission", () => {
      const callback1 = vi.fn();
      const subscription = eventBus.on("test:event1", EventActor.Anonymous, callback1);
      
      eventBus.on("test:event1", EventActor.Anonymous, () => {
        subscription.unsubscribe();
      });
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data");
      eventBus.emit("test:event1", EventActor.Anonymous, "data");
      
      expect(callback1).toHaveBeenCalledTimes(1);
    });

    it("should allow re-subscribing after unsubscribe", () => {
      const callback = vi.fn();
      const subscription = eventBus.on("test:event1", EventActor.Anonymous, callback);
      
      subscription.unsubscribe();
      eventBus.emit("test:event1", EventActor.Anonymous, "data1");
      expect(callback).not.toHaveBeenCalled();
      
      eventBus.on("test:event1", EventActor.Anonymous, callback);
      eventBus.emit("test:event1", EventActor.Anonymous, "data2");
      expect(callback).toHaveBeenCalledWith("data2");
    });
  });

  describe("subscriber tracking", () => {
    it("should track different subscriber actors", () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      
      eventBus.on("test:event1", EventActor.Controller, callback1);
      eventBus.on("test:event1", EventActor.Bot, callback2);
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data");
      
      expect(callback1).toHaveBeenCalledWith("data");
      expect(callback2).toHaveBeenCalledWith("data");
    });

    it("should support anonymous actor", () => {
      const callback = vi.fn();
      eventBus.on("test:event1", EventActor.Anonymous, callback);
      
      eventBus.emit("test:event1", EventActor.Anonymous, "data");
      
      expect(callback).toHaveBeenCalledWith("data");
    });
  });
});
