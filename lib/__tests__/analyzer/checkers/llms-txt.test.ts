import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { checkLlmsTxt } from "@/lib/analyzer/checkers/llms-txt";
import * as fetchModule from "@/lib/analyzer/fetch-html";
import type { FetchResult } from "@/lib/analyzer/types";

function okResult(
  body: string,
  status = 200,
  contentType = "text/plain"
): FetchResult {
  return {
    ok: true,
    body,
    status,
    finalUrl: "https://example.com/llms.txt",
    headers: { "content-type": contentType },
  };
}

function networkError(error = "DNS resolution failed"): FetchResult {
  return { ok: false, kind: "network", error };
}

// A body that satisfies all pass conditions: ≥100 chars, text/plain, has a URL
const PASS_BODY =
  "# Example Site\n\nThis is Example Site, a platform for developers.\n\nhttps://example.com/docs\nhttps://example.com/api\nhttps://example.com/blog\n";

describe("checkLlmsTxt — unit tests", () => {
  beforeEach(() => {
    vi.spyOn(fetchModule, "fetchText");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns pass when HTTP 200, text content type, body ≥100 chars, and informative content", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(PASS_BODY));

    const result = await checkLlmsTxt("https://example.com");

    expect(result.status).toBe("pass");
    expect(result.issues).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });

  it("returns not_found when HTTP 404", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult("", 404));

    const result = await checkLlmsTxt("https://example.com");

    expect(result.status).toBe("not_found");
    expect(result.issues.some((i) => i.code === "LLMS_TXT_NOT_FOUND")).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns unknown on network error", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(networkError());

    const result = await checkLlmsTxt("https://example.com");

    expect(result.status).toBe("unknown");
    expect(result.issues.some((i) => i.code === "LLMS_TXT_NETWORK_ERROR")).toBe(true);
  });

  it("returns warn when body is empty", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(""));

    const result = await checkLlmsTxt("https://example.com");

    expect(result.status).toBe("warn");
    expect(result.issues.some((i) => i.code === "LLMS_TXT_EMPTY")).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns warn when body is whitespace only", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult("   \n  "));

    const result = await checkLlmsTxt("https://example.com");

    expect(result.status).toBe("warn");
    expect(result.issues.some((i) => i.code === "LLMS_TXT_EMPTY")).toBe(true);
  });

  it("returns warn when body is thin (< 100 chars)", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult("short content"));

    const result = await checkLlmsTxt("https://example.com");

    expect(result.status).toBe("warn");
    expect(result.issues.some((i) => i.code === "LLMS_TXT_THIN_CONTENT")).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns warn when body ≥100 chars but lacks informative signals", async () => {
    // 100+ chars but no URLs, paths, or brand description
    const thinBody = "a".repeat(100);
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(thinBody));

    const result = await checkLlmsTxt("https://example.com");

    expect(result.status).toBe("warn");
    expect(result.issues.some((i) => i.code === "LLMS_TXT_THIN_CONTENT")).toBe(true);
  });

  it("returns warn when content type is not text-based", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(
      okResult(PASS_BODY, 200, "application/octet-stream")
    );

    const result = await checkLlmsTxt("https://example.com");

    expect(result.status).toBe("warn");
    expect(result.issues.some((i) => i.code === "LLMS_TXT_WRONG_CONTENT_TYPE")).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("truncates content preview to 500 chars", async () => {
    const longBody = "https://example.com/page\n" + "x".repeat(600);
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(longBody));

    const result = await checkLlmsTxt("https://example.com");

    const preview = result.details["contentPreview"] as string;
    expect(preview).toBeDefined();
    expect(preview.length).toBeLessThanOrEqual(500);
  });

  it("includes full content preview when body is ≤500 chars", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(PASS_BODY));

    const result = await checkLlmsTxt("https://example.com");

    const preview = result.details["contentPreview"] as string;
    expect(preview).toBe(PASS_BODY.slice(0, 500));
  });

  it("fetches from {origin}/llms.txt", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(PASS_BODY));

    await checkLlmsTxt("https://example.com");

    expect(fetchModule.fetchText).toHaveBeenCalledWith("https://example.com/llms.txt");
  });

  it("returns warn for unexpected HTTP status (e.g. 403)", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult("Forbidden", 403));

    const result = await checkLlmsTxt("https://example.com");

    expect(result.status).toBe("warn");
    expect(result.issues.some((i) => i.code === "LLMS_TXT_UNEXPECTED_STATUS")).toBe(true);
  });

  it("includes a summary string in all result cases", async () => {
    const cases: FetchResult[] = [
      okResult(PASS_BODY),
      okResult("", 404),
      networkError(),
      okResult(""),
      okResult("short"),
    ];

    for (const fetchResult of cases) {
      vi.mocked(fetchModule.fetchText).mockResolvedValue(fetchResult);
      const result = await checkLlmsTxt("https://example.com");
      expect(typeof result.summary).toBe("string");
      expect(result.summary.length).toBeGreaterThan(0);
    }
  });
});

describe("checkLlmsTxt — property-based tests", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Feature: site-analysis, Property 6: llms.txt status from response characteristics
  it("Property 6: status is determined by response characteristics", async () => {
    vi.spyOn(fetchModule, "fetchText");

    // Subproperty: network error always → unknown
    await fc.assert(
      fc.asyncProperty(fc.string({ minLength: 1 }), async (errMsg) => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(networkError(errMsg));
        const result = await checkLlmsTxt("https://example.com");
        expect(result.status).toBe("unknown");
      }),
      { numRuns: 20 }
    );

    // Subproperty: HTTP 404 always → not_found
    await fc.assert(
      fc.asyncProperty(fc.constant(null), async () => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult("", 404));
        const result = await checkLlmsTxt("https://example.com");
        expect(result.status).toBe("not_found");
      }),
      { numRuns: 10 }
    );

    // Subproperty: HTTP 200 + text/plain + body ≥100 chars + URL in body → pass
    const informativeBodyArb = fc
      .string({ minLength: 50, maxLength: 200 })
      .map((s) => `https://example.com/page\n${s}\nhttps://example.com/docs`);

    await fc.assert(
      fc.asyncProperty(informativeBodyArb, async (body) => {
        // Ensure body is long enough
        const paddedBody = body.length < 100 ? body + " ".repeat(100 - body.length) + "https://x.com" : body;
        vi.mocked(fetchModule.fetchText).mockResolvedValue(
          okResult(paddedBody, 200, "text/plain")
        );
        const result = await checkLlmsTxt("https://example.com");
        expect(result.status).toBe("pass");
      }),
      { numRuns: 20 }
    );

    // Subproperty: HTTP 200 + empty body → warn
    await fc.assert(
      fc.asyncProperty(fc.constant(""), async (body) => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(okResult(body));
        const result = await checkLlmsTxt("https://example.com");
        expect(result.status).toBe("warn");
      }),
      { numRuns: 10 }
    );

    // Subproperty: content preview is always ≤500 chars when present
    const anyBodyArb = fc.string({ minLength: 0, maxLength: 2000 });
    await fc.assert(
      fc.asyncProperty(anyBodyArb, async (body) => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(
          okResult(body, 200, "text/plain")
        );
        const result = await checkLlmsTxt("https://example.com");
        const preview = result.details["contentPreview"];
        if (preview !== null && preview !== undefined) {
          expect((preview as string).length).toBeLessThanOrEqual(500);
        }
      }),
      { numRuns: 25 }
    );
  });
});
