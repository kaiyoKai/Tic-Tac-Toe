import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { Logger } from "@shared/Logger";
import { EventActor } from "@events/EventTypes";

describe("Logger", () => {
  beforeEach(() => {
    Logger.setScopeNone();
    Logger.isDebug = false;
    vi.clearAllMocks();
  });

  afterEach(() => {
    Logger.setScopeNone();
    Logger.isDebug = false;
  });

  describe("initialization", () => {
    it("should have isDebug disabled by default", () => {
      expect(Logger.isDebug).toBe(false);
    });

    it("should have empty registered scopes initially", () => {
      expect(Logger.registeredScopes.size).toBe(0);
    });

    it("should be a static utility class with static methods only", () => {
      // Logger should only have static methods
      expect(typeof Logger.log).toBe("function");
      expect(typeof Logger.info).toBe("function");
      expect(typeof Logger.warn).toBe("function");
      expect(typeof Logger.error).toBe("function");
      expect(typeof Logger.table).toBe("function");
    });
  });

  describe("scope registration", () => {
    it("should register a scope", () => {
      Logger.register(EventActor.Controller);
      expect(Logger.registeredScopes.has(EventActor.Controller)).toBe(true);
    });

    it("should unregister a scope", () => {
      Logger.register(EventActor.Controller);
      Logger.unregister(EventActor.Controller);
      expect(Logger.registeredScopes.has(EventActor.Controller)).toBe(false);
    });

    it("should handle multiple scope registrations", () => {
      Logger.register(EventActor.Controller);
      Logger.register(EventActor.Bot);
      Logger.register(EventActor.Game);

      expect(Logger.registeredScopes.has(EventActor.Controller)).toBe(true);
      expect(Logger.registeredScopes.has(EventActor.Bot)).toBe(true);
      expect(Logger.registeredScopes.has(EventActor.Game)).toBe(true);
    });

    it("should not double-register the same scope", () => {
      Logger.register(EventActor.Controller);
      Logger.register(EventActor.Controller);
      expect(Logger.registeredScopes.size).toBe(1);
    });
  });

  describe("setScopeAll", () => {
    it("should register all scopes", () => {
      Logger.setScopeAll();
      const allActors = Object.values(EventActor) as EventActor[];
      allActors.forEach((actor) => {
        expect(Logger.registeredScopes.has(actor)).toBe(true);
      });
    });

    it("should register multiple scopes", () => {
      Logger.setScopeAll();
      expect(Logger.registeredScopes.size).toBeGreaterThan(0);
    });
  });

  describe("setScopeNone", () => {
    it("should clear all registered scopes", () => {
      Logger.setScopeAll();
      Logger.setScopeNone();
      expect(Logger.registeredScopes.size).toBe(0);
    });

    it("should be callable multiple times", () => {
      Logger.setScopeNone();
      Logger.setScopeNone();
      expect(Logger.registeredScopes.size).toBe(0);
    });
  });

  describe("logging methods", () => {
    beforeEach(() => {
      vi.spyOn(console, "log").mockImplementation(() => {});
      vi.spyOn(console, "info").mockImplementation(() => {});
      vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should not log when debug is disabled", () => {
      Logger.isDebug = false;
      Logger.register(EventActor.Controller);
      Logger.log(EventActor.Controller, "test message");

      expect(console.log).not.toHaveBeenCalled();
    });

    it("should not log when scope is not registered", () => {
      Logger.isDebug = true;
      Logger.log(EventActor.Controller, "test message");

      expect(console.log).not.toHaveBeenCalled();
    });

    it("should log when debug is enabled and scope is registered", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Controller);
      Logger.log(EventActor.Controller, "test message");

      expect(console.log).toHaveBeenCalled();
    });

    it("should support info logging", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Bot);
      Logger.info(EventActor.Bot, "info message");

      expect(console.info).toHaveBeenCalled();
    });

    it("should support warn logging", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Game);
      Logger.warn(EventActor.Game, "warning message");

      expect(console.warn).toHaveBeenCalled();
    });

    it("should support error logging", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Bus);
      Logger.error(EventActor.Bus, "error message");

      expect(console.error).toHaveBeenCalled();
    });

    it("should handle multiple log arguments", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Controller);
      Logger.log(EventActor.Controller, "message", { data: "test" }, 42);

      expect(console.log).toHaveBeenCalled();
    });
  });

  describe("table logging", () => {
    beforeEach(() => {
      vi.spyOn(console, "table").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should log tables when debug is enabled", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Game);
      const tableData = [
        { col1: "a", col2: "b" },
        { col1: "c", col2: "d" },
      ];

      Logger.table(EventActor.Game, tableData);
      expect(console.table).toHaveBeenCalled();
    });

    it("should not log tables when debug is disabled", () => {
      Logger.isDebug = false;
      Logger.register(EventActor.Game);
      Logger.table(EventActor.Game, {});

      expect(console.table).not.toHaveBeenCalled();
    });

    it("should not log tables when scope is not registered", () => {
      Logger.isDebug = true;
      Logger.table(EventActor.Controller, {});

      expect(console.table).not.toHaveBeenCalled();
    });
  });

  describe("multiple actor logging", () => {
    beforeEach(() => {
      vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should handle logging from different actors", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Controller);
      Logger.register(EventActor.Bot);

      Logger.log(EventActor.Controller, "from controller");
      Logger.log(EventActor.Bot, "from bot");

      expect(console.log).toHaveBeenCalledTimes(2);
    });

    it("should handle mixed log levels", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Game);

      vi.spyOn(console, "info").mockImplementation(() => {});
      vi.spyOn(console, "warn").mockImplementation(() => {});

      Logger.log(EventActor.Game, "log");
      Logger.info(EventActor.Game, "info");
      Logger.warn(EventActor.Game, "warn");

      expect(console.log).toHaveBeenCalled();
      expect(console.info).toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    beforeEach(() => {
      vi.spyOn(console, "log").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should handle empty log messages", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Controller);
      Logger.log(EventActor.Controller);

      expect(console.log).toHaveBeenCalled();
    });

    it("should handle null and undefined values", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Bot);
      Logger.log(EventActor.Bot, null, undefined);

      expect(console.log).toHaveBeenCalled();
    });

    it("should handle complex objects", () => {
      Logger.isDebug = true;
      Logger.register(EventActor.Game);
      const complexObj = {
        nested: {
          deeply: {
            value: "test",
          },
        },
        array: [1, 2, 3],
      };

      Logger.log(EventActor.Game, complexObj);
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe("scope persistence", () => {
    it("should preserve registered scopes across calls", () => {
      Logger.register(EventActor.Controller);
      Logger.register(EventActor.Bot);

      expect(Logger.registeredScopes.has(EventActor.Controller)).toBe(true);
      expect(Logger.registeredScopes.has(EventActor.Bot)).toBe(true);

      Logger.log(EventActor.Game, "test");

      expect(Logger.registeredScopes.has(EventActor.Controller)).toBe(true);
      expect(Logger.registeredScopes.has(EventActor.Bot)).toBe(true);
    });

    it("should allow dynamic scope changes", () => {
      Logger.register(EventActor.Controller);
      Logger.unregister(EventActor.Controller);
      Logger.register(EventActor.Bot);

      expect(Logger.registeredScopes.has(EventActor.Controller)).toBe(false);
      expect(Logger.registeredScopes.has(EventActor.Bot)).toBe(true);
    });
  });
});
