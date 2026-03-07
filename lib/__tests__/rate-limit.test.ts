import { describe, it, expect, beforeEach, vi } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit()", () => {
  beforeEach(() => {
    // Reset module state between tests
    vi.resetModules();
  });

  it("allows first request", () => {
    const result = rateLimit("test-ip-1");
    expect(result.allowed).toBe(true);
  });

  it("tracks remaining requests", () => {
    const ip = "test-ip-remaining";
    const first = rateLimit(ip);
    expect(first.remaining).toBeLessThanOrEqual(60);

    const second = rateLimit(ip);
    expect(second.remaining).toBeLessThan(first.remaining);
  });

  it("blocks after exceeding limit", () => {
    const ip = "test-ip-block";
    for (let i = 0; i < 60; i++) {
      rateLimit(ip);
    }
    const result = rateLimit(ip);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("returns correct shape", () => {
    const result = rateLimit("test-ip-shape");
    expect(result).toHaveProperty("allowed");
    expect(result).toHaveProperty("remaining");
    expect(typeof result.allowed).toBe("boolean");
    expect(typeof result.remaining).toBe("number");
  });
});
