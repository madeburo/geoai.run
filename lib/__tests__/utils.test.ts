import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { cn } from "@/lib/utils";

describe("cn()", () => {
  it("merges class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("deduplicates conflicting Tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("", undefined, null)).toBe("");
  });

  it("handles arrays", () => {
    expect(cn(["px-2", "py-1"])).toBe("px-2 py-1");
  });

  it("property: always returns a string", () => {
    fc.assert(
      fc.property(
        fc.array(fc.oneof(fc.string(), fc.constant(undefined), fc.constant(null), fc.constant(false))),
        (inputs) => {
          const result = cn(...inputs);
          expect(typeof result).toBe("string");
        },
      ),
    );
  });

  it("property: result never has leading/trailing whitespace", () => {
    fc.assert(
      fc.property(fc.array(fc.string()), (inputs) => {
        const result = cn(...inputs);
        expect(result).toBe(result.trim());
      }),
    );
  });
});
