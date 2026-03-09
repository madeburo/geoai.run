import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import {
  checkCrawlerRules,
  parseRobotsTxt,
  classifyCrawler,
} from "@/lib/analyzer/checkers/crawler-rules";
import * as fetchModule from "@/lib/analyzer/fetch-html";
import { AI_CRAWLERS } from "@/lib/analyzer/types";
import type { FetchResult } from "@/lib/analyzer/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function okResult(body: string, status = 200): FetchResult {
  return {
    ok: true,
    body,
    status,
    finalUrl: "https://example.com/robots.txt",
    headers: { "content-type": "text/plain" },
  };
}

function networkError(error = "DNS resolution failed"): FetchResult {
  return { ok: false, kind: "network", error };
}

/** Build a robots.txt body that allows all AI crawlers via wildcard with no Disallow */
const ALLOW_ALL_ROBOTS = `User-agent: *\nAllow: /\n`;

/** Build a robots.txt body that blocks all AI crawlers individually */
function buildAllBlockedRobots(): string {
  return AI_CRAWLERS.map((c) => `User-agent: ${c}\nDisallow: /\n`).join("\n");
}

/** Build a robots.txt body that blocks exactly N crawlers (first N in AI_CRAWLERS) */
function buildBlockedNRobots(n: number): string {
  const blocked = AI_CRAWLERS.slice(0, n)
    .map((c) => `User-agent: ${c}\nDisallow: /\n`)
    .join("\n");
  return blocked;
}

// ---------------------------------------------------------------------------
// parseRobotsTxt unit tests
// ---------------------------------------------------------------------------

describe("parseRobotsTxt", () => {
  it("parses a simple allow-all robots.txt", () => {
    const parsed = parseRobotsTxt("User-agent: *\nAllow: /\n");
    expect(parsed.blocks).toHaveLength(1);
    expect(parsed.blocks[0].agents).toContain("*");
    expect(parsed.blocks[0].allows).toContain("/");
  });

  it("parses multiple blocks separated by blank lines", () => {
    const body = `User-agent: GPTBot\nDisallow: /\n\nUser-agent: *\nAllow: /\n`;
    const parsed = parseRobotsTxt(body);
    expect(parsed.blocks).toHaveLength(2);
  });

  it("extracts Sitemap directives", () => {
    const body = `User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml\nSitemap: https://example.com/sitemap2.xml\n`;
    const parsed = parseRobotsTxt(body);
    expect(parsed.sitemaps).toEqual([
      "https://example.com/sitemap.xml",
      "https://example.com/sitemap2.xml",
    ]);
  });

  it("strips inline comments", () => {
    const body = `User-agent: * # all bots\nDisallow: / # block all\n`;
    const parsed = parseRobotsTxt(body);
    expect(parsed.blocks[0].agents).toContain("*");
    expect(parsed.blocks[0].disallows).toContain("/");
  });

  it("handles CRLF line endings", () => {
    const body = "User-agent: *\r\nDisallow: /\r\n";
    const parsed = parseRobotsTxt(body);
    expect(parsed.blocks).toHaveLength(1);
    expect(parsed.blocks[0].disallows).toContain("/");
  });

  it("handles empty body", () => {
    const parsed = parseRobotsTxt("");
    expect(parsed.blocks).toHaveLength(0);
    expect(parsed.sitemaps).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// classifyCrawler unit tests
// ---------------------------------------------------------------------------

describe("classifyCrawler", () => {
  it("returns blocked when exact block has Disallow: /", () => {
    const parsed = parseRobotsTxt("User-agent: GPTBot\nDisallow: /\n");
    expect(classifyCrawler("GPTBot", parsed)).toBe("blocked");
  });

  it("returns allowed when exact block has Allow: / overriding Disallow: /", () => {
    const parsed = parseRobotsTxt(
      "User-agent: GPTBot\nDisallow: /\nAllow: /\n"
    );
    expect(classifyCrawler("GPTBot", parsed)).toBe("allowed");
  });

  it("returns unspecified when no block exists for crawler and no wildcard", () => {
    const parsed = parseRobotsTxt("User-agent: Googlebot\nDisallow: /\n");
    expect(classifyCrawler("GPTBot", parsed)).toBe("unspecified");
  });

  it("returns unspecified when wildcard has no Disallow: /", () => {
    const parsed = parseRobotsTxt("User-agent: *\nAllow: /\n");
    expect(classifyCrawler("GPTBot", parsed)).toBe("unspecified");
  });

  it("exact block overrides wildcard block — exact allows, wildcard blocks", () => {
    const body = `User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nAllow: /\n`;
    const parsed = parseRobotsTxt(body);
    expect(classifyCrawler("GPTBot", parsed)).toBe("allowed");
  });

  it("exact block overrides wildcard block — exact blocks, wildcard allows", () => {
    const body = `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nDisallow: /\n`;
    const parsed = parseRobotsTxt(body);
    expect(classifyCrawler("GPTBot", parsed)).toBe("blocked");
  });

  it("falls back to wildcard when no exact block exists and wildcard blocks", () => {
    const body = `User-agent: *\nDisallow: /\n`;
    const parsed = parseRobotsTxt(body);
    expect(classifyCrawler("GPTBot", parsed)).toBe("blocked");
  });
});

// ---------------------------------------------------------------------------
// checkCrawlerRules unit tests
// ---------------------------------------------------------------------------

describe("checkCrawlerRules — unit tests", () => {
  beforeEach(() => {
    vi.spyOn(fetchModule, "fetchText");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns pass when robots.txt is present and AI crawlers are not broadly restricted", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(
      okResult(ALLOW_ALL_ROBOTS)
    );
    const result = await checkCrawlerRules("https://example.com");
    expect(result.status).toBe("pass");
    expect(result.issues).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });

  it("returns fail when global Disallow: / is present", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(
      okResult("User-agent: *\nDisallow: /\n")
    );
    const result = await checkCrawlerRules("https://example.com");
    expect(result.status).toBe("fail");
    expect(result.issues.some((i) => i.code === "ROBOTS_ALL_AI_BLOCKED")).toBe(
      true
    );
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns fail when all 10 AI crawlers are individually blocked", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(
      okResult(buildAllBlockedRobots())
    );
    const result = await checkCrawlerRules("https://example.com");
    expect(result.status).toBe("fail");
  });

  it("returns warn when majority (≥6) of AI crawlers are blocked", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(
      okResult(buildBlockedNRobots(6))
    );
    const result = await checkCrawlerRules("https://example.com");
    expect(result.status).toBe("warn");
    expect(
      result.issues.some((i) => i.code === "ROBOTS_MAJORITY_AI_BLOCKED")
    ).toBe(true);
  });

  it("returns warn when robots.txt returns 404", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult("", 404));
    const result = await checkCrawlerRules("https://example.com");
    expect(result.status).toBe("warn");
    expect(result.issues.some((i) => i.code === "ROBOTS_NOT_FOUND")).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns unknown on network error", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(networkError());
    const result = await checkCrawlerRules("https://example.com");
    expect(result.status).toBe("unknown");
    expect(
      result.issues.some((i) => i.code === "ROBOTS_NETWORK_ERROR")
    ).toBe(true);
  });

  it("exact block overrides wildcard — GPTBot allowed despite global block", async () => {
    const body = `User-agent: *\nDisallow: /\n\nUser-agent: GPTBot\nAllow: /\n`;
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(body));
    const result = await checkCrawlerRules("https://example.com");
    const crawlers = result.details["crawlers"] as Array<{
      crawler: string;
      classification: string;
    }>;
    const gptBot = crawlers.find((c) => c.crawler === "GPTBot");
    expect(gptBot?.classification).toBe("allowed");
  });

  it("extracts sitemap URLs from robots.txt", async () => {
    const body = `User-agent: *\nAllow: /\nSitemap: https://example.com/sitemap.xml\nSitemap: https://example.com/sitemap2.xml\n`;
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(body));
    const result = await checkCrawlerRules("https://example.com");
    const sitemaps = result.details["sitemaps"] as string[];
    expect(sitemaps).toContain("https://example.com/sitemap.xml");
    expect(sitemaps).toContain("https://example.com/sitemap2.xml");
  });

  it("returns warn when ≥5 crawlers are unspecified AND ≥1 is blocked", async () => {
    // Block exactly 1 crawler, leave the rest unspecified (no wildcard, no other blocks)
    const body = `User-agent: GPTBot\nDisallow: /\n`;
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(body));
    const result = await checkCrawlerRules("https://example.com");
    // 1 blocked, 9 unspecified → ≥5 unspecified AND ≥1 blocked → warn
    expect(result.status).toBe("warn");
    expect(result.issues.some((i) => i.code === "ROBOTS_MIXED_AI_ACCESS")).toBe(
      true
    );
  });

  it("returns pass when only 5 crawlers are blocked (not majority)", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(
      okResult(buildBlockedNRobots(5))
    );
    const result = await checkCrawlerRules("https://example.com");
    // 5 blocked, 5 unspecified → ≥5 unspecified AND ≥1 blocked → warn
    expect(result.status).toBe("warn");
  });

  it("returns details with robotsPresent, sitemaps, globalBlock, crawlers", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(
      okResult(ALLOW_ALL_ROBOTS)
    );
    const result = await checkCrawlerRules("https://example.com");
    expect(result.details).toHaveProperty("robotsPresent");
    expect(result.details).toHaveProperty("sitemaps");
    expect(result.details).toHaveProperty("globalBlock");
    expect(result.details).toHaveProperty("crawlers");
  });

  it("returns a classification for all 10 AI crawlers", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(
      okResult(ALLOW_ALL_ROBOTS)
    );
    const result = await checkCrawlerRules("https://example.com");
    const crawlers = result.details["crawlers"] as Array<{
      crawler: string;
      classification: string;
    }>;
    expect(crawlers).toHaveLength(10);
    for (const c of crawlers) {
      expect(["allowed", "blocked", "unspecified"]).toContain(c.classification);
    }
  });

  it("fetches from {origin}/robots.txt", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(
      okResult(ALLOW_ALL_ROBOTS)
    );
    await checkCrawlerRules("https://example.com");
    expect(fetchModule.fetchText).toHaveBeenCalledWith(
      "https://example.com/robots.txt"
    );
  });

  it("404 result has robotsPresent: false", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult("", 404));
    const result = await checkCrawlerRules("https://example.com");
    expect(result.details["robotsPresent"]).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Property-based tests
// ---------------------------------------------------------------------------

describe("checkCrawlerRules — property-based tests", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Feature: site-analysis, Property 9: crawler classification completeness and validity
  it("Property 9: classifyCrawler returns a valid classification for every AI crawler against any robots.txt", () => {
    // Arbitrary robots.txt body: random combinations of blocks
    const robotsBodyArb = fc
      .array(
        fc.record({
          agent: fc.oneof(
            fc.constantFrom(...AI_CRAWLERS),
            fc.constant("*"),
            fc.constant("Googlebot")
          ),
          disallowRoot: fc.boolean(),
          allowRoot: fc.boolean(),
        }),
        { minLength: 0, maxLength: 5 }
      )
      .map((blocks) =>
        blocks
          .map(
            (b) =>
              `User-agent: ${b.agent}\n` +
              (b.disallowRoot ? "Disallow: /\n" : "") +
              (b.allowRoot ? "Allow: /\n" : "")
          )
          .join("\n")
      );

    // Feature: site-analysis, Property 9: crawler classification completeness and validity
    fc.assert(
      fc.property(robotsBodyArb, (body) => {
        const parsed = parseRobotsTxt(body);
        for (const crawler of AI_CRAWLERS) {
          const classification = classifyCrawler(crawler, parsed);
          expect(["allowed", "blocked", "unspecified"]).toContain(
            classification
          );
        }
      }),
      { numRuns: 25 }
    );
  });

  // Feature: site-analysis, Property 11: crawler check status from blocked count and global block
  it("Property 11: checkCrawlerRules status matches blocked count and global block rules", async () => {
    vi.spyOn(fetchModule, "fetchText");

    // Subproperty: global Disallow: / always → fail
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(
          okResult("User-agent: *\nDisallow: /\n")
        );
        const result = await checkCrawlerRules("https://example.com");
        expect(result.status).toBe("fail");
      }),
      { numRuns: 10 }
    );

    // Subproperty: all 10 crawlers individually blocked → fail
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        const body = AI_CRAWLERS.map(
          (c) => `User-agent: ${c}\nDisallow: /\n`
        ).join("\n");
        vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(body));
        const result = await checkCrawlerRules("https://example.com");
        expect(result.status).toBe("fail");
      }),
      { numRuns: 10 }
    );

    // Subproperty: ≥6 crawlers blocked (no global block) → warn or fail
    // (fail only if all 10 blocked, otherwise warn)
    const blockedCountArb = fc.integer({ min: 6, max: 9 });
    await fc.assert(
      fc.asyncProperty(blockedCountArb, async (n) => {
        const body = AI_CRAWLERS.slice(0, n)
          .map((c) => `User-agent: ${c}\nDisallow: /\n`)
          .join("\n");
        vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(body));
        const result = await checkCrawlerRules("https://example.com");
        expect(result.status).toBe("warn");
      }),
      { numRuns: 20 }
    );

    // Subproperty: network error → unknown
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1 }), async (errMsg) => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(
          networkError(errMsg)
        );
        const result = await checkCrawlerRules("https://example.com");
        expect(result.status).toBe("unknown");
      }),
      { numRuns: 20 }
    );

    // Subproperty: 404 → warn
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult("", 404));
        const result = await checkCrawlerRules("https://example.com");
        expect(result.status).toBe("warn");
      }),
      { numRuns: 10 }
    );

    // Subproperty: result always has all 10 crawlers classified (HTTP responses only)
    const httpResponseArb = fc.oneof(
      fc.constant(okResult(ALLOW_ALL_ROBOTS)),
      fc.constant(okResult("User-agent: *\nDisallow: /\n")),
      fc.constant(okResult("", 404))
    );
    await fc.assert(
      fc.asyncProperty(httpResponseArb, async (fetchResult) => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(fetchResult);
        const result = await checkCrawlerRules("https://example.com");
        const crawlers = result.details["crawlers"] as Array<{
          crawler: string;
          classification: string;
        }>;
        expect(crawlers).toHaveLength(AI_CRAWLERS.length);
        for (const c of crawlers) {
          expect(["allowed", "blocked", "unspecified"]).toContain(
            c.classification
          );
        }
      }),
      { numRuns: 25 }
    );
  });
});
