import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import { checkStructuredSignals } from "@/lib/analyzer/checkers/signals";
import * as fetchModule from "@/lib/analyzer/fetch-html";
import type { FetchResult } from "@/lib/analyzer/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function xmlSitemapResult(body = "<urlset></urlset>"): FetchResult {
  return {
    ok: true,
    body,
    status: 200,
    finalUrl: "https://example.com/sitemap.xml",
    headers: { "content-type": "application/xml" },
  };
}

function htmlSitemapResult(): FetchResult {
  return {
    ok: true,
    body: "<!DOCTYPE html><html><body>Sitemap page</body></html>",
    status: 200,
    finalUrl: "https://example.com/sitemap.xml",
    headers: { "content-type": "text/html; charset=utf-8" },
  };
}

function notFoundResult(): FetchResult {
  return {
    ok: true,
    body: "",
    status: 404,
    finalUrl: "https://example.com/sitemap.xml",
    headers: { "content-type": "text/html" },
  };
}

function networkError(error = "DNS resolution failed"): FetchResult {
  return { ok: false, kind: "network", error };
}

// HTML snippets
const HTML_WITH_VALID_JSONLD = `
<html>
<head>
  <script type="application/ld+json">
    {"@context":"https://schema.org","@type":"Organization","name":"Example"}
  </script>
</head>
<body></body>
</html>
`;

const HTML_WITH_INVALID_JSONLD = `
<html>
<head>
  <script type="application/ld+json">
    {invalid json here
  </script>
</head>
<body></body>
</html>
`;

const HTML_WITH_MICRODATA = `
<html>
<body>
  <div itemscope itemtype="https://schema.org/Person">
    <span itemprop="name">John Doe</span>
  </div>
</body>
</html>
`;

const HTML_WITH_RDFA = `
<html>
<body>
  <div typeof="schema:Organization" vocab="https://schema.org/">
    <span property="name">Example Corp</span>
  </div>
</body>
</html>
`;

const HTML_EMPTY = "";

const HTML_NO_STRUCTURED_DATA = `
<html>
<head><title>Example</title></head>
<body><p>Hello world</p></body>
</html>
`;

// ---------------------------------------------------------------------------
// Unit tests
// ---------------------------------------------------------------------------

describe("checkStructuredSignals — unit tests", () => {
  beforeEach(() => {
    vi.spyOn(fetchModule, "fetchText");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns pass when valid JSON-LD is present", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_WITH_VALID_JSONLD
    );
    expect(result.status).toBe("pass");
    expect(result.issues).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });

  it("returns warn when only microdata is present (no JSON-LD)", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_WITH_MICRODATA
    );
    expect(result.status).toBe("warn");
    expect(
      result.issues.some((i) => i.code === "NO_JSONLD_STRUCTURED_DATA")
    ).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns warn when only RDFa is present (no JSON-LD)", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_WITH_RDFA
    );
    expect(result.status).toBe("warn");
    expect(
      result.issues.some((i) => i.code === "NO_JSONLD_STRUCTURED_DATA")
    ).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns warn when no structured data but valid sitemap exists", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(xmlSitemapResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_NO_STRUCTURED_DATA
    );
    expect(result.status).toBe("warn");
    expect(result.issues.some((i) => i.code === "NO_STRUCTURED_DATA")).toBe(
      true
    );
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns fail when no structured data and no valid sitemap", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_NO_STRUCTURED_DATA
    );
    expect(result.status).toBe("fail");
    expect(result.issues.some((i) => i.code === "NO_STRUCTURED_DATA")).toBe(
      true
    );
    expect(result.issues.some((i) => i.code === "NO_SITEMAP")).toBe(true);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns fail when HTML is empty and no valid sitemap", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_EMPTY
    );
    expect(result.status).toBe("fail");
  });

  it("increments invalid count and records issue for each invalid JSON-LD block", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_WITH_INVALID_JSONLD
    );
    expect(result.details["jsonLdInvalid"]).toBe(1);
    expect(
      result.issues.some((i) => i.code === "JSONLD_INVALID_JSON")
    ).toBe(true);
  });

  it("does not count HTML page at /sitemap.xml as a valid sitemap", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(htmlSitemapResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_NO_STRUCTURED_DATA
    );
    // HTML content type → not a valid sitemap → should fail (no structured data, no valid sitemap)
    expect(result.status).toBe("fail");
    expect(result.details["sitemapPresent"]).toBe(false);
  });

  it("extracts @type values from valid JSON-LD blocks", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_WITH_VALID_JSONLD
    );
    const schemaTypes = result.details["schemaTypes"] as string[];
    expect(schemaTypes).toContain("Organization");
  });

  it("extracts multiple @type values from multiple JSON-LD blocks", async () => {
    const html = `
      <html><head>
        <script type="application/ld+json">{"@type":"Organization","name":"Acme"}</script>
        <script type="application/ld+json">{"@type":"WebSite","url":"https://example.com"}</script>
      </head></html>
    `;
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals("https://example.com", html);
    const schemaTypes = result.details["schemaTypes"] as string[];
    expect(schemaTypes).toContain("Organization");
    expect(schemaTypes).toContain("WebSite");
    expect(result.details["jsonLdCount"]).toBe(2);
    expect(result.details["jsonLdValid"]).toBe(2);
  });

  it("counts both valid and invalid JSON-LD blocks correctly", async () => {
    const html = `
      <html><head>
        <script type="application/ld+json">{"@type":"Organization"}</script>
        <script type="application/ld+json">{invalid}</script>
        <script type="application/ld+json">{"@type":"WebSite"}</script>
      </head></html>
    `;
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals("https://example.com", html);
    expect(result.details["jsonLdCount"]).toBe(3);
    expect(result.details["jsonLdValid"]).toBe(2);
    expect(result.details["jsonLdInvalid"]).toBe(1);
    // 2 valid JSON-LD → pass
    expect(result.status).toBe("pass");
    // 1 invalid issue recorded
    expect(
      result.issues.filter((i) => i.code === "JSONLD_INVALID_JSON")
    ).toHaveLength(1);
  });

  it("returns sitemapPresent: true for valid XML sitemap with <urlset>", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(
      xmlSitemapResult(
        '<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>'
      )
    );
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_NO_STRUCTURED_DATA
    );
    expect(result.details["sitemapPresent"]).toBe(true);
  });

  it("returns sitemapPresent: true for valid XML sitemap with <sitemapindex>", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue({
      ok: true,
      body: '<?xml version="1.0"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></sitemapindex>',
      status: 200,
      finalUrl: "https://example.com/sitemap.xml",
      headers: { "content-type": "application/xml" },
    });
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_NO_STRUCTURED_DATA
    );
    expect(result.details["sitemapPresent"]).toBe(true);
  });

  it("returns sitemapPresent: false when sitemap fetch returns network error", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(networkError());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_NO_STRUCTURED_DATA
    );
    expect(result.details["sitemapPresent"]).toBe(false);
  });

  it("fetches sitemap from {origin}/sitemap.xml", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    await checkStructuredSignals("https://example.com", HTML_WITH_VALID_JSONLD);
    expect(fetchModule.fetchText).toHaveBeenCalledWith(
      "https://example.com/sitemap.xml"
    );
  });

  it("returns microdataPresent: true when itemscope attribute is present", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_WITH_MICRODATA
    );
    expect(result.details["microdataPresent"]).toBe(true);
  });

  it("returns rdfaPresent: true when typeof attribute is present", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_WITH_RDFA
    );
    expect(result.details["rdfaPresent"]).toBe(true);
  });

  it("returns microdataPresent: false and rdfaPresent: false for plain HTML", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_NO_STRUCTURED_DATA
    );
    expect(result.details["microdataPresent"]).toBe(false);
    expect(result.details["rdfaPresent"]).toBe(false);
  });

  it("pass status has no recommendations when no invalid JSON-LD", async () => {
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals(
      "https://example.com",
      HTML_WITH_VALID_JSONLD
    );
    expect(result.status).toBe("pass");
    expect(result.recommendations).toHaveLength(0);
  });

  it("adds FIX_INVALID_JSONLD recommendation when invalid blocks exist alongside valid ones", async () => {
    const html = `
      <html><head>
        <script type="application/ld+json">{"@type":"Organization"}</script>
        <script type="application/ld+json">{bad json}</script>
      </head></html>
    `;
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
    const result = await checkStructuredSignals("https://example.com", html);
    expect(result.status).toBe("pass");
    expect(
      result.recommendations.some((r) => r.code === "FIX_INVALID_JSONLD")
    ).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Property-based tests
// ---------------------------------------------------------------------------

describe("checkStructuredSignals — property-based tests", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Feature: site-analysis, Property 12: JSON-LD block counting
  it("Property 12: JSON-LD block counting — total count, valid/invalid categorization, and issue recording", async () => {
    vi.spyOn(fetchModule, "fetchText");
    vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());

    // Generator: produce HTML with N valid and M invalid JSON-LD blocks
    const jsonLdBlocksArb = fc
      .tuple(
        fc.integer({ min: 0, max: 5 }), // valid count
        fc.integer({ min: 0, max: 5 })  // invalid count
      )
      .map(([validN, invalidN]) => {
        const validBlocks = Array.from({ length: validN }, (_, i) =>
          `<script type="application/ld+json">{"@type":"Thing","name":"Item${i}"}</script>`
        );
        const invalidBlocks = Array.from({ length: invalidN }, (_, i) =>
          `<script type="application/ld+json">{invalid json block ${i}</script>`
        );
        const allBlocks = [...validBlocks, ...invalidBlocks].join("\n");
        return {
          html: `<html><head>${allBlocks}</head><body></body></html>`,
          expectedValid: validN,
          expectedInvalid: invalidN,
          expectedTotal: validN + invalidN,
        };
      });

    // Feature: site-analysis, Property 12: JSON-LD block counting
    await fc.assert(
      fc.asyncProperty(jsonLdBlocksArb, async ({ html, expectedValid, expectedInvalid, expectedTotal }) => {
        const result = await checkStructuredSignals("https://example.com", html);

        // Total count must equal valid + invalid
        expect(result.details["jsonLdCount"]).toBe(expectedTotal);
        expect(result.details["jsonLdValid"]).toBe(expectedValid);
        expect(result.details["jsonLdInvalid"]).toBe(expectedInvalid);

        // Each invalid block must produce exactly one JSONLD_INVALID_JSON issue
        const invalidIssues = result.issues.filter(
          (i) => i.code === "JSONLD_INVALID_JSON"
        );
        expect(invalidIssues).toHaveLength(expectedInvalid);
      }),
      { numRuns: 25 }
    );
  });

  // Feature: site-analysis, Property 14: Signals status from structured data and sitemap presence
  it("Property 14: status is determined by structured data presence and sitemap availability", async () => {
    vi.spyOn(fetchModule, "fetchText");

    // Subproperty: at least one valid JSON-LD block → pass (regardless of sitemap)
    const validJsonLdHtmlArb = fc
      .integer({ min: 1, max: 5 })
      .map((n) => {
        const blocks = Array.from(
          { length: n },
          (_, i) => `<script type="application/ld+json">{"@type":"Thing","name":"Item${i}"}</script>`
        ).join("\n");
        return `<html><head>${blocks}</head></html>`;
      });

    await fc.assert(
      fc.asyncProperty(
        validJsonLdHtmlArb,
        fc.boolean(), // sitemap present or not
        async (html, sitemapPresent) => {
          vi.mocked(fetchModule.fetchText).mockResolvedValue(
            sitemapPresent ? xmlSitemapResult() : notFoundResult()
          );
          const result = await checkStructuredSignals("https://example.com", html);
          expect(result.status).toBe("pass");
        }
      ),
      { numRuns: 25 }
    );

    // Subproperty: no JSON-LD but microdata present → warn
    const microdataHtmlArb = fc.constant(
      `<html><body><div itemscope itemtype="https://schema.org/Person"><span itemprop="name">Test</span></div></body></html>`
    );

    await fc.assert(
      fc.asyncProperty(microdataHtmlArb, async (html) => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
        const result = await checkStructuredSignals("https://example.com", html);
        expect(result.status).toBe("warn");
      }),
      { numRuns: 20 }
    );

    // Subproperty: no JSON-LD but RDFa present → warn
    const rdfaHtmlArb = fc.constant(
      `<html><body><div typeof="schema:Organization" vocab="https://schema.org/"><span property="name">Test</span></div></body></html>`
    );

    await fc.assert(
      fc.asyncProperty(rdfaHtmlArb, async (html) => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
        const result = await checkStructuredSignals("https://example.com", html);
        expect(result.status).toBe("warn");
      }),
      { numRuns: 20 }
    );

    // Subproperty: no structured data but valid sitemap → warn
    await fc.assert(
      fc.asyncProperty(fc.constant(HTML_NO_STRUCTURED_DATA), async (html) => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(xmlSitemapResult());
        const result = await checkStructuredSignals("https://example.com", html);
        expect(result.status).toBe("warn");
      }),
      { numRuns: 20 }
    );

    // Subproperty: no structured data and no valid sitemap → fail
    await fc.assert(
      fc.asyncProperty(fc.constant(HTML_NO_STRUCTURED_DATA), async (html) => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(notFoundResult());
        const result = await checkStructuredSignals("https://example.com", html);
        expect(result.status).toBe("fail");
      }),
      { numRuns: 20 }
    );

    // Subproperty: HTML page at /sitemap.xml does NOT count as valid sitemap
    await fc.assert(
      fc.asyncProperty(fc.constant(HTML_NO_STRUCTURED_DATA), async (html) => {
        vi.mocked(fetchModule.fetchText).mockResolvedValue(htmlSitemapResult());
        const result = await checkStructuredSignals("https://example.com", html);
        // HTML content type → not valid → fail (no structured data either)
        expect(result.status).toBe("fail");
        expect(result.details["sitemapPresent"]).toBe(false);
      }),
      { numRuns: 20 }
    );
  });
});
