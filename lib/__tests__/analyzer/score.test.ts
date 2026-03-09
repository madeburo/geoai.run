import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { calculateScore } from "@/lib/analyzer/score";
import {
  STATUS_SCORES,
  type AnalysisCategory,
  type CheckItem,
  type CheckStatus,
} from "@/lib/analyzer/types";

// Helper: build a minimal CheckItem with a given status
function makeCheck(status: CheckStatus): CheckItem {
  return {
    status,
    summary: "",
    details: {},
    issues: [],
    recommendations: [],
  };
}

// Helper: build a uniform checks record
function allChecks(status: CheckStatus): Record<AnalysisCategory, CheckItem> {
  return {
    llmsTxt: makeCheck(status),
    aiMetadata: makeCheck(status),
    crawlerRules: makeCheck(status),
    structuredSignals: makeCheck(status),
  };
}

describe("calculateScore — unit tests", () => {
  it("all-pass → overall 100", () => {
    const result = calculateScore(allChecks("pass"));
    expect(result.overall).toBe(100);
  });

  it("all-fail → overall 20", () => {
    const result = calculateScore(allChecks("fail"));
    expect(result.overall).toBe(20);
  });

  it("all-warn → overall 65", () => {
    const result = calculateScore(allChecks("warn"));
    expect(result.overall).toBe(65);
  });

  it("all-not_found → overall 10", () => {
    const result = calculateScore(allChecks("not_found"));
    expect(result.overall).toBe(10);
  });

  it("all-unknown → overall 40", () => {
    const result = calculateScore(allChecks("unknown"));
    expect(result.overall).toBe(40);
  });

  it("mixed statuses produce correct average", () => {
    // pass=100, warn=65, fail=20, not_found=10 → avg = 195/4 = 48.75 → rounds to 49
    const checks: Record<AnalysisCategory, CheckItem> = {
      llmsTxt: makeCheck("pass"),
      aiMetadata: makeCheck("warn"),
      crawlerRules: makeCheck("fail"),
      structuredSignals: makeCheck("not_found"),
    };
    const result = calculateScore(checks);
    expect(result.overall).toBe(49);
  });

  it("returns per-category scores matching STATUS_SCORES", () => {
    const checks: Record<AnalysisCategory, CheckItem> = {
      llmsTxt: makeCheck("pass"),
      aiMetadata: makeCheck("warn"),
      crawlerRules: makeCheck("fail"),
      structuredSignals: makeCheck("unknown"),
    };
    const result = calculateScore(checks);
    expect(result.categories.llmsTxt).toBe(100);
    expect(result.categories.aiMetadata).toBe(65);
    expect(result.categories.crawlerRules).toBe(20);
    expect(result.categories.structuredSignals).toBe(40);
  });

  it("overall is a rounded integer", () => {
    // pass=100, warn=65, fail=20, unknown=40 → avg = 225/4 = 56.25 → rounds to 56
    const checks: Record<AnalysisCategory, CheckItem> = {
      llmsTxt: makeCheck("pass"),
      aiMetadata: makeCheck("warn"),
      crawlerRules: makeCheck("fail"),
      structuredSignals: makeCheck("unknown"),
    };
    const result = calculateScore(checks);
    expect(Number.isInteger(result.overall)).toBe(true);
    expect(result.overall).toBe(56);
  });
});

describe("calculateScore — property-based tests", () => {
  const statusArb = fc.constantFrom<CheckStatus>(
    "pass",
    "warn",
    "fail",
    "not_found",
    "unknown"
  );

  // Property 15: Score calculation correctness and idempotence
  it("Property 15: overall equals rounded average of STATUS_SCORES, and is idempotent", () => {
    // Feature: site-analysis, Property 15: score calculation correctness and idempotence
    fc.assert(
      fc.property(
        statusArb,
        statusArb,
        statusArb,
        statusArb,
        (s1, s2, s3, s4) => {
          const checks: Record<AnalysisCategory, CheckItem> = {
            llmsTxt: makeCheck(s1),
            aiMetadata: makeCheck(s2),
            crawlerRules: makeCheck(s3),
            structuredSignals: makeCheck(s4),
          };

          const result1 = calculateScore(checks);
          const result2 = calculateScore(checks);

          // Correctness: overall must equal rounded average of STATUS_SCORES
          const expected = Math.round(
            (STATUS_SCORES[s1] +
              STATUS_SCORES[s2] +
              STATUS_SCORES[s3] +
              STATUS_SCORES[s4]) /
              4
          );
          expect(result1.overall).toBe(expected);

          // Idempotence: same inputs produce same outputs
          expect(result1.overall).toBe(result2.overall);
          expect(result1.categories).toEqual(result2.categories);

          // Per-category scores match STATUS_SCORES
          expect(result1.categories.llmsTxt).toBe(STATUS_SCORES[s1]);
          expect(result1.categories.aiMetadata).toBe(STATUS_SCORES[s2]);
          expect(result1.categories.crawlerRules).toBe(STATUS_SCORES[s3]);
          expect(result1.categories.structuredSignals).toBe(STATUS_SCORES[s4]);
        }
      ),
      { numRuns: 25 }
    );
  });
});
