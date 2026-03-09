import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";
import type { CheckItem, CheckStatus } from "@/lib/analyzer/types";

// ---------------------------------------------------------------------------
// Mock all I/O boundaries before importing the orchestrator
// ---------------------------------------------------------------------------

vi.mock("@/lib/analyzer/fetch-html", () => ({
  fetchHtml: vi.fn(),
  fetchText: vi.fn(),
}));

vi.mock("@/lib/analyzer/checkers/llms-txt", () => ({
  checkLlmsTxt: vi.fn(),
}));

vi.mock("@/lib/analyzer/checkers/metadata", () => ({
  checkMetadata: vi.fn(),
}));

vi.mock("@/lib/analyzer/checkers/crawler-rules", () => ({
  checkCrawlerRules: vi.fn(),
}));

vi.mock("@/lib/analyzer/checkers/signals", () => ({
  checkStructuredSignals: vi.fn(),
}));

import { analyzeSiteForAIReadiness } from "@/lib/analyzer/analyze";
import { fetchHtml } from "@/lib/analyzer/fetch-html";
import { checkLlmsTxt } from "@/lib/analyzer/checkers/llms-txt";
import { checkMetadata } from "@/lib/analyzer/checkers/metadata";
import { checkCrawlerRules } from "@/lib/analyzer/checkers/crawler-rules";
import { checkStructuredSignals } from "@/lib/analyzer/checkers/signals";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeCheck(
  status: CheckStatus,
  overrides: Partial<CheckItem> = {}
): CheckItem {
  return {
    status,
    summary: `${status} summary`,
    details: {},
    issues: overrides.issues ?? [
      { code: `${status.toUpperCase()}_ISSUE`, message: `${status} issue`, severity: "low" },
    ],
    recommendations: overrides.recommendations ?? (status === "pass"
      ? []
      : [
          {
            code: `${status.toUpperCase()}_REC`,
            category: "llmsTxt",
            title: `${status} rec`,
            description: `Fix ${status}`,
          },
        ]),
    ...overrides,
  };
}

const PASS_CHECK = makeCheck("pass", { issues: [], recommendations: [] });
const WARN_CHECK = makeCheck("warn");
const FAIL_CHECK = makeCheck("fail");

const HOMEPAGE_HTML = `<html><head>
  <title>Test Site</title>
  <meta name="description" content="A test site" />
  <meta property="og:title" content="Test Site" />
  <meta property="og:description" content="A test site" />
</head><body></body></html>`;

function mockSuccessfulFetch(html = HOMEPAGE_HTML, finalUrl = "https://example.com/") {
  vi.mocked(fetchHtml).mockResolvedValue({
    ok: true,
    body: html,
    status: 200,
    finalUrl,
    headers: { "content-type": "text/html" },
  });
}

function mockFailedFetch() {
  vi.mocked(fetchHtml).mockResolvedValue({
    ok: false,
    kind: "network",
    error: "Connection refused",
  });
}

function mockAllCheckersPassing() {
  vi.mocked(checkLlmsTxt).mockResolvedValue(PASS_CHECK);
  vi.mocked(checkMetadata).mockReturnValue(PASS_CHECK);
  vi.mocked(checkCrawlerRules).mockResolvedValue(PASS_CHECK);
  vi.mocked(checkStructuredSignals).mockResolvedValue(PASS_CHECK);
}

// ---------------------------------------------------------------------------
// Unit / integration tests
// ---------------------------------------------------------------------------

describe("analyzeSiteForAIReadiness — integration tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("successful full analysis returns a complete report with all required fields", async () => {
    mockSuccessfulFetch();
    mockAllCheckersPassing();

    const report = await analyzeSiteForAIReadiness("https://example.com");

    expect(report.inputUrl).toBe("https://example.com");
    expect(report.normalizedUrl).toBe("https://example.com/");
    expect(report.finalUrl).toBe("https://example.com/");
    expect(report.timestamp).toBeTruthy();
    expect(new Date(report.timestamp).toISOString()).toBe(report.timestamp);

    expect(report.checks.llmsTxt).toBeDefined();
    expect(report.checks.aiMetadata).toBeDefined();
    expect(report.checks.crawlerRules).toBeDefined();
    expect(report.checks.structuredSignals).toBeDefined();

    expect(report.score.overall).toBe(100);
    expect(Array.isArray(report.issues)).toBe(true);
    expect(Array.isArray(report.recommendations)).toBe(true);
  });

  it("all four checkers are called on a successful homepage fetch", async () => {
    mockSuccessfulFetch();
    mockAllCheckersPassing();

    await analyzeSiteForAIReadiness("https://example.com");

    expect(checkLlmsTxt).toHaveBeenCalledWith("https://example.com");
    expect(checkMetadata).toHaveBeenCalledWith(HOMEPAGE_HTML);
    expect(checkCrawlerRules).toHaveBeenCalledWith("https://example.com");
    expect(checkStructuredSignals).toHaveBeenCalledWith("https://example.com", HOMEPAGE_HTML);
  });

  it("homepage fetch failure: llmsTxt and crawlerRules still run, metadata and signals are unknown", async () => {
    mockFailedFetch();
    vi.mocked(checkLlmsTxt).mockResolvedValue(WARN_CHECK);
    vi.mocked(checkCrawlerRules).mockResolvedValue(PASS_CHECK);

    const report = await analyzeSiteForAIReadiness("https://example.com");

    expect(checkLlmsTxt).toHaveBeenCalled();
    expect(checkCrawlerRules).toHaveBeenCalled();
    expect(checkMetadata).not.toHaveBeenCalled();
    expect(checkStructuredSignals).not.toHaveBeenCalled();

    expect(report.checks.aiMetadata.status).toBe("unknown");
    expect(report.checks.structuredSignals.status).toBe("unknown");
    expect(report.checks.llmsTxt.status).toBe("warn");
    expect(report.checks.crawlerRules.status).toBe("pass");
  });

  it("invalid URL returns all-unknown report without calling any checkers", async () => {
    const report = await analyzeSiteForAIReadiness("not a url!!!");

    expect(report.inputUrl).toBe("not a url!!!");
    expect(report.normalizedUrl).toBeNull();
    expect(report.finalUrl).toBeNull();
    expect(report.checks.llmsTxt.status).toBe("unknown");
    expect(report.checks.aiMetadata.status).toBe("unknown");
    expect(report.checks.crawlerRules.status).toBe("unknown");
    expect(report.checks.structuredSignals.status).toBe("unknown");

    expect(fetchHtml).not.toHaveBeenCalled();
    expect(checkLlmsTxt).not.toHaveBeenCalled();
    expect(checkMetadata).not.toHaveBeenCalled();
    expect(checkCrawlerRules).not.toHaveBeenCalled();
    expect(checkStructuredSignals).not.toHaveBeenCalled();
  });

  it("one checker throws → that check is unknown, others succeed", async () => {
    mockSuccessfulFetch();
    vi.mocked(checkLlmsTxt).mockRejectedValue(new Error("llms.txt exploded"));
    vi.mocked(checkMetadata).mockReturnValue(PASS_CHECK);
    vi.mocked(checkCrawlerRules).mockResolvedValue(PASS_CHECK);
    vi.mocked(checkStructuredSignals).mockResolvedValue(PASS_CHECK);

    const report = await analyzeSiteForAIReadiness("https://example.com");

    expect(report.checks.llmsTxt.status).toBe("unknown");
    expect(report.checks.aiMetadata.status).toBe("pass");
    expect(report.checks.crawlerRules.status).toBe("pass");
    expect(report.checks.structuredSignals.status).toBe("pass");
  });

  it("aggregated issues equal the union of all check issues", async () => {
    mockSuccessfulFetch();
    const llmsCheck = makeCheck("warn", {
      issues: [{ code: "A", message: "a", severity: "low" }],
      recommendations: [],
    });
    const metaCheck = makeCheck("fail", {
      issues: [{ code: "B", message: "b", severity: "high" }],
      recommendations: [],
    });
    const crawlerCheck = makeCheck("pass", { issues: [], recommendations: [] });
    const signalsCheck = makeCheck("warn", {
      issues: [{ code: "C", message: "c", severity: "medium" }],
      recommendations: [],
    });

    vi.mocked(checkLlmsTxt).mockResolvedValue(llmsCheck);
    vi.mocked(checkMetadata).mockReturnValue(metaCheck);
    vi.mocked(checkCrawlerRules).mockResolvedValue(crawlerCheck);
    vi.mocked(checkStructuredSignals).mockResolvedValue(signalsCheck);

    const report = await analyzeSiteForAIReadiness("https://example.com");

    expect(report.issues).toEqual([
      ...llmsCheck.issues,
      ...metaCheck.issues,
      ...crawlerCheck.issues,
      ...signalsCheck.issues,
    ]);
  });

  it("aggregated recommendations equal the union of all check recommendations", async () => {
    mockSuccessfulFetch();
    const llmsCheck = makeCheck("warn", {
      issues: [],
      recommendations: [
        { code: "R1", category: "llmsTxt", title: "r1", description: "d1" },
      ],
    });
    const metaCheck = makeCheck("fail", {
      issues: [],
      recommendations: [
        { code: "R2", category: "aiMetadata", title: "r2", description: "d2" },
      ],
    });
    const crawlerCheck = makeCheck("pass", { issues: [], recommendations: [] });
    const signalsCheck = makeCheck("pass", { issues: [], recommendations: [] });

    vi.mocked(checkLlmsTxt).mockResolvedValue(llmsCheck);
    vi.mocked(checkMetadata).mockReturnValue(metaCheck);
    vi.mocked(checkCrawlerRules).mockResolvedValue(crawlerCheck);
    vi.mocked(checkStructuredSignals).mockResolvedValue(signalsCheck);

    const report = await analyzeSiteForAIReadiness("https://example.com");

    expect(report.recommendations).toEqual([
      ...llmsCheck.recommendations,
      ...metaCheck.recommendations,
      ...crawlerCheck.recommendations,
      ...signalsCheck.recommendations,
    ]);
  });

  it("report always has all required fields even when all checks fail", async () => {
    mockSuccessfulFetch();
    vi.mocked(checkLlmsTxt).mockResolvedValue(FAIL_CHECK);
    vi.mocked(checkMetadata).mockReturnValue(FAIL_CHECK);
    vi.mocked(checkCrawlerRules).mockResolvedValue(FAIL_CHECK);
    vi.mocked(checkStructuredSignals).mockResolvedValue(FAIL_CHECK);

    const report = await analyzeSiteForAIReadiness("https://example.com");

    expect(report).toMatchObject({
      inputUrl: expect.any(String),
      normalizedUrl: expect.any(String),
      finalUrl: expect.any(String),
      timestamp: expect.any(String),
      checks: {
        llmsTxt: expect.objectContaining({ status: expect.any(String) }),
        aiMetadata: expect.objectContaining({ status: expect.any(String) }),
        crawlerRules: expect.objectContaining({ status: expect.any(String) }),
        structuredSignals: expect.objectContaining({ status: expect.any(String) }),
      },
      issues: expect.any(Array),
      recommendations: expect.any(Array),
      score: {
        overall: expect.any(Number),
        categories: expect.objectContaining({
          llmsTxt: expect.any(Number),
          aiMetadata: expect.any(Number),
          crawlerRules: expect.any(Number),
          structuredSignals: expect.any(Number),
        }),
      },
    });
  });

  it("bare domain input is normalized and checkers receive the correct origin", async () => {
    mockSuccessfulFetch(HOMEPAGE_HTML, "https://example.com/");
    mockAllCheckersPassing();

    await analyzeSiteForAIReadiness("example.com");

    expect(checkLlmsTxt).toHaveBeenCalledWith("https://example.com");
    expect(checkCrawlerRules).toHaveBeenCalledWith("https://example.com");
  });

  it("finalUrl reflects the redirect destination from fetchHtml", async () => {
    vi.mocked(fetchHtml).mockResolvedValue({
      ok: true,
      body: HOMEPAGE_HTML,
      status: 200,
      finalUrl: "https://www.example.com/",
      headers: {},
    });
    mockAllCheckersPassing();

    const report = await analyzeSiteForAIReadiness("https://example.com");
    expect(report.finalUrl).toBe("https://www.example.com/");
  });
});

// ---------------------------------------------------------------------------
// Property-based tests
// ---------------------------------------------------------------------------

describe("analyzeSiteForAIReadiness — property-based tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const statusArb = fc.constantFrom<CheckStatus>(
    "pass",
    "warn",
    "fail",
    "not_found",
    "unknown"
  );

  // Property 18: Checker fault isolation
  it("Property 18: when any checker throws, that check is unknown and others still return results", async () => {
    // Feature: site-analysis, Property 18: checker fault isolation
    mockSuccessfulFetch();

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom("llmsTxt", "aiMetadata", "crawlerRules", "structuredSignals"),
        async (failingChecker) => {
          vi.clearAllMocks();
          mockSuccessfulFetch();

          const goodCheck = makeCheck("pass", { issues: [], recommendations: [] });

          vi.mocked(checkLlmsTxt).mockImplementation(() =>
            failingChecker === "llmsTxt"
              ? Promise.reject(new Error("forced failure"))
              : Promise.resolve(goodCheck)
          );
          vi.mocked(checkMetadata).mockImplementation(() => {
            if (failingChecker === "aiMetadata") throw new Error("forced failure");
            return goodCheck;
          });
          vi.mocked(checkCrawlerRules).mockImplementation(() =>
            failingChecker === "crawlerRules"
              ? Promise.reject(new Error("forced failure"))
              : Promise.resolve(goodCheck)
          );
          vi.mocked(checkStructuredSignals).mockImplementation(() =>
            failingChecker === "structuredSignals"
              ? Promise.reject(new Error("forced failure"))
              : Promise.resolve(goodCheck)
          );

          const report = await analyzeSiteForAIReadiness("https://example.com");

          // The failing checker must be unknown
          expect(report.checks[failingChecker as keyof typeof report.checks].status).toBe("unknown");

          // All other checkers must have succeeded (pass)
          const others = (
            ["llmsTxt", "aiMetadata", "crawlerRules", "structuredSignals"] as const
          ).filter((c) => c !== failingChecker);

          for (const c of others) {
            expect(report.checks[c].status).toBe("pass");
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  // Property 19: Report validity invariant
  it("Property 19: any input string always produces a valid AIReadinessReport with all required fields", async () => {
    // Feature: site-analysis, Property 19: report validity invariant
    const inputArb = fc.oneof(
      fc.constant(""),
      fc.constant("not-a-url"),
      fc.constant("https://example.com"),
      fc.string({ minLength: 0, maxLength: 50 })
    );

    await fc.assert(
      fc.asyncProperty(inputArb, async (input) => {
        vi.clearAllMocks();

        // Mock checkers to return valid results when called
        vi.mocked(fetchHtml).mockResolvedValue({
          ok: true,
          body: HOMEPAGE_HTML,
          status: 200,
          finalUrl: "https://example.com/",
          headers: {},
        });
        vi.mocked(checkLlmsTxt).mockResolvedValue(PASS_CHECK);
        vi.mocked(checkMetadata).mockReturnValue(PASS_CHECK);
        vi.mocked(checkCrawlerRules).mockResolvedValue(PASS_CHECK);
        vi.mocked(checkStructuredSignals).mockResolvedValue(PASS_CHECK);

        const report = await analyzeSiteForAIReadiness(input);

        // All required fields must be present
        expect(typeof report.inputUrl).toBe("string");
        expect(report.normalizedUrl === null || typeof report.normalizedUrl === "string").toBe(true);
        expect(report.finalUrl === null || typeof report.finalUrl === "string").toBe(true);
        expect(typeof report.timestamp).toBe("string");
        expect(new Date(report.timestamp).toISOString()).toBe(report.timestamp);

        expect(report.checks).toBeDefined();
        expect(report.checks.llmsTxt).toBeDefined();
        expect(report.checks.aiMetadata).toBeDefined();
        expect(report.checks.crawlerRules).toBeDefined();
        expect(report.checks.structuredSignals).toBeDefined();

        expect(Array.isArray(report.issues)).toBe(true);
        expect(Array.isArray(report.recommendations)).toBe(true);

        expect(typeof report.score.overall).toBe("number");
        expect(Number.isInteger(report.score.overall)).toBe(true);
        expect(report.score.overall).toBeGreaterThanOrEqual(0);
        expect(report.score.overall).toBeLessThanOrEqual(100);
      }),
      { numRuns: 20 }
    );
  });

  // Property 20: Partial execution on fetch failure
  it("Property 20: when homepage fetch fails, llmsTxt and crawlerRules run, metadata and signals are unknown", async () => {
    // Feature: site-analysis, Property 20: partial execution on fetch failure
    await fc.assert(
      fc.asyncProperty(
        statusArb,
        statusArb,
        async (llmsStatus, crawlerStatus) => {
          vi.clearAllMocks();
          mockFailedFetch();

          const llmsCheck = makeCheck(llmsStatus, { issues: [], recommendations: [] });
          const crawlerCheck = makeCheck(crawlerStatus, { issues: [], recommendations: [] });

          vi.mocked(checkLlmsTxt).mockResolvedValue(llmsCheck);
          vi.mocked(checkCrawlerRules).mockResolvedValue(crawlerCheck);

          const report = await analyzeSiteForAIReadiness("https://example.com");

          // llmsTxt and crawlerRules must have run and returned their actual results
          expect(report.checks.llmsTxt.status).toBe(llmsStatus);
          expect(report.checks.crawlerRules.status).toBe(crawlerStatus);

          // metadata and signals must be unknown (not called)
          expect(report.checks.aiMetadata.status).toBe("unknown");
          expect(report.checks.structuredSignals.status).toBe("unknown");

          expect(checkMetadata).not.toHaveBeenCalled();
          expect(checkStructuredSignals).not.toHaveBeenCalled();
        }
      ),
      { numRuns: 25 }
    );
  });

  // Property 21: URL normalization failure produces all-unknown report
  it("Property 21: any URL that fails normalization produces an all-unknown report", async () => {
    // Feature: site-analysis, Property 21: URL normalization failure produces all-unknown report
    //
    // Strategy: use normalizeUrl as the oracle to filter to inputs that actually fail,
    // then verify the orchestrator returns an all-unknown report for those inputs.
    const { normalizeUrl } = await import("@/lib/analyzer/normalize-url");

    const knownInvalidArb = fc.oneof(
      fc.constant(""),
      fc.constant("   "),
      fc.constant("ftp://example.com"),
      fc.constant("javascript:alert(1)"),
      // Arbitrary strings — filter to those that actually fail normalization
      fc.string({ minLength: 0, maxLength: 40 }).filter((s) => !normalizeUrl(s).ok)
    );

    await fc.assert(
      fc.asyncProperty(knownInvalidArb, async (input) => {
        vi.clearAllMocks();

        const report = await analyzeSiteForAIReadiness(input);

        expect(report.normalizedUrl).toBeNull();
        expect(report.finalUrl).toBeNull();
        expect(report.checks.llmsTxt.status).toBe("unknown");
        expect(report.checks.aiMetadata.status).toBe("unknown");
        expect(report.checks.crawlerRules.status).toBe("unknown");
        expect(report.checks.structuredSignals.status).toBe("unknown");

        // No I/O should have been attempted
        expect(fetchHtml).not.toHaveBeenCalled();
        expect(checkLlmsTxt).not.toHaveBeenCalled();
        expect(checkMetadata).not.toHaveBeenCalled();
        expect(checkCrawlerRules).not.toHaveBeenCalled();
        expect(checkStructuredSignals).not.toHaveBeenCalled();
      }),
      { numRuns: 20 }
    );
  });
});
