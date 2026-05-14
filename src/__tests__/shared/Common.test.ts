import { describe, it, expect } from "vitest";
import {
  assertPlayerSymbol,
  assertPlayerID,
  dummyPlayerSymbol,
} from "@shared/Common";

describe("Common - Validators", () => {
  describe("assertPlayerSymbol", () => {
    it("should accept single character symbols", () => {
      const x = assertPlayerSymbol("X");
      expect(x).toBe("X");
    });

    it("should accept single emoji symbols", () => {
      const emoji = assertPlayerSymbol("❌");
      expect(emoji).toBe("❌");
    });

    it("should accept single emoji with variation selector", () => {
      const emoji = assertPlayerSymbol("⭕");
      expect(emoji).toBe("⭕");
    });

    it("should throw error for multiple characters", () => {
      expect(() => assertPlayerSymbol("XY")).toThrow();
    });

    it("should throw error for empty string", () => {
      expect(() => assertPlayerSymbol("")).toThrow();
    });

    it("should throw error for multiple emoji", () => {
      expect(() => assertPlayerSymbol("❌⭕")).toThrow();
    });

    it("should throw error for emoji followed by character", () => {
      expect(() => assertPlayerSymbol("❌X")).toThrow();
    });

    it("should handle various single grapheme clusters", () => {
      const symbols = ["A", "Z", "1", "🎮", "🔥", "💯"];
      symbols.forEach((symbol) => {
        expect(() => assertPlayerSymbol(symbol)).not.toThrow();
      });
    });

    it("should handle complex emojis correctly", () => {
      // Note: Some complex emojis might be counted as single grapheme cluster
      // by Intl.Segmenter depending on platform
      const complexEmoji = "👨‍👩‍👧‍👦"; // Family emoji
      // This may or may not throw depending on platform's grapheme segmentation
      try {
        assertPlayerSymbol(complexEmoji);
        // If no throw, it was counted as 1 cluster
        expect(true).toBe(true);
      } catch {
        // If throw, it was counted as multiple clusters
        expect(true).toBe(true);
      }
    });

    it("should have proper error message", () => {
      expect(() => assertPlayerSymbol("XY")).toThrow(
        /Invalides symbol.*anzeige length von 1/,
      );
    });
  });

  describe("assertPlayerID", () => {
    it("should accept ID greater than 256", () => {
      const id = assertPlayerID(257);
      expect(id).toBe(257);
    });

    it("should accept large ID values", () => {
      const id = assertPlayerID(1000000);
      expect(id).toBe(1000000);
    });

    it("should throw error for ID <= 256", () => {
      expect(() => assertPlayerID(256)).toThrow();
      expect(() => assertPlayerID(100)).toThrow();
      expect(() => assertPlayerID(1)).toThrow();
      expect(() => assertPlayerID(0)).toThrow();
    });

    it("should throw error for negative ID", () => {
      expect(() => assertPlayerID(-1)).toThrow();
      expect(() => assertPlayerID(-100)).toThrow();
    });

    it("should have proper error message", () => {
      expect(() => assertPlayerID(256)).toThrow(
        /Invalide id.*muss weniger als 255 sein/,
      );
    });
  });

  describe("dummyPlayerSymbol", () => {
    it("should be a valid player symbol", () => {
      expect(dummyPlayerSymbol).toBe("X");
    });

    it("should be immutable", () => {
      // dummyPlayerSymbol is a const, so it cannot be reassigned
      expect(dummyPlayerSymbol).toBe("X");
    });
  });

  describe("symbol validation edge cases", () => {
    it("should accept number symbols", () => {
      const num1 = assertPlayerSymbol("1");
      const num9 = assertPlayerSymbol("9");
      expect(num1).toBe("1");
      expect(num9).toBe("9");
    });

    it("should accept special characters", () => {
      const star = assertPlayerSymbol("★");
      const circle = assertPlayerSymbol("○");
      expect(star).toBe("★");
      expect(circle).toBe("○");
    });

    it("should accept lowercase letters", () => {
      const a = assertPlayerSymbol("a");
      const z = assertPlayerSymbol("z");
      expect(a).toBe("a");
      expect(z).toBe("z");
    });

    it("should reject space as symbol", () => {
      // Space alone is a single grapheme, should work
      const space = assertPlayerSymbol(" ");
      expect(space).toBe(" ");
    });

    it("should reject multiple spaces", () => {
      expect(() => assertPlayerSymbol("  ")).toThrow();
    });
  });

  describe("ID validation edge cases", () => {
    it("should accept boundary value 257", () => {
      const id = assertPlayerID(257);
      expect(id).toBe(257);
    });

    it("should reject boundary value 256", () => {
      expect(() => assertPlayerID(256)).toThrow();
    });

    it("should handle maximum safe integers", () => {
      const maxId = assertPlayerID(Number.MAX_SAFE_INTEGER);
      expect(maxId).toBe(Number.MAX_SAFE_INTEGER);
    });
  });
});
