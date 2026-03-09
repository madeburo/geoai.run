import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import { checkMetadata } from "@/lib/analyzer/checkers/metadata";

// Helpers to build HTML strings
function buildHtml({
  title,
  description,
  canonical,
  robots,
  ogTitle,
  ogDescription,
  ogUrl,
  ogType,
  ogImage,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
}: {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogType?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
}): string {
  const tags: string[] = [];
  if (title !== undefined) tags.push(`<title>${title}</title>`);
  if (description !== undefined)
    tags.push(`<meta name="description" content="${description}">`);
  if (canonical !== undefined)
    tags.push(`<link rel="canonical" href="${canonical}">`);
  if (robots !== undefined)
    tags.push(`<meta name="robots" content="${robots}">`);
  if (ogTitle !== undefined)
    tags.push(`<meta property="og:title" content="${ogTitle}">`);
  if (ogDescription !== undefined)
    tags.push(`<meta property="og:description" content="${ogDescription}">`);
  if (ogUrl !== undefined)
    tags.push(`<meta property="og:url" content="${ogUrl}">`);
  if (ogType !== undefined)
    tags.push(`<meta property="og:type" content="${ogType}">`);
  if (ogImage !== undefined)
    tags.push(`<meta property="og:image" content="${ogImage}">`);
  if (twitterCard !== undefined)
    tags.push(`<meta name="twitter:card" content="${twitterCard}">`);
  if (twitterTitle !== undefined)
    tags.push(`<meta name="twitter:title" content="${twitterTitle}">`);
  if (twitterDescription !== undefined)
    tags.push(
      `<meta name="twitter:description" content="${twitterDescription}">`
    );
  if (twitterImage !== undefined)
    tags.push(`<meta name="twitter:image" content="${twitterImage}">`);

  return `<!DOCTYPE html><html><head>${tags.join("\n")}</head><body></body></html>`;
}

const ALL_CRITICAL = {
  title: "My Site",
  description: "A great site",
  ogTitle: "My Site OG",
  ogDescription: "A great site for OG",
};

const ALL_TAGS = {
  ...ALL_CRITICAL,
  canonical: "https://example.com/",
  robots: "index, follow",
  ogUrl: "https://example.com/",
  ogType: "website",
  ogImage: "https://example.com/og.png",
  twitterCard: "summary_large_image",
  twitterTitle: "My Site Twitter",
  twitterDescription: "A great site on Twitter",
  twitterImage: "https://example.com/twitter.png",
};

describe("checkMetadata — unit tests", () => {
  it("returns pass when all critical tags are present", () => {
    const result = checkMetadata(buildHtml(ALL_CRITICAL));
    expect(result.status).toBe("pass");
    expect(result.issues.filter((i) => i.severity === "high")).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });

  it("returns pass with all tags present (critical + non-critical)", () => {
    const result = checkMetadata(buildHtml(ALL_TAGS));
    expect(result.status).toBe("pass");
    expect(result.issues).toHaveLength(0);
    expect(result.recommendations).toHaveLength(0);
  });

  it("returns warn when one critical tag is missing", () => {
    const result = checkMetadata(
      buildHtml({ title: "My Site", description: "Desc", ogTitle: "OG Title" })
    );
    expect(result.status).toBe("warn");
    expect(result.issues.some((i) => i.code === "MISSING_OG_DESCRIPTION")).toBe(
      true
    );
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns warn when multiple critical tags are missing but at least one present", () => {
    const result = checkMetadata(buildHtml({ title: "My Site" }));
    expect(result.status).toBe("warn");
    expect(result.issues.filter((i) => i.severity === "high").length).toBeGreaterThan(0);
  });

  it("returns fail when all critical tags are absent", () => {
    const result = checkMetadata(
      buildHtml({ canonical: "https://example.com" })
    );
    expect(result.status).toBe("fail");
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("returns fail when HTML has no metadata at all", () => {
    const result = checkMetadata(
      "<!DOCTYPE html><html><head></head><body></body></html>"
    );
    expect(result.status).toBe("fail");
  });

  it("returns unknown for empty HTML string", () => {
    const result = checkMetadata("");
    expect(result.status).toBe("unknown");
    expect(result.issues.some((i) => i.code === "METADATA_PARSE_FAILURE")).toBe(
      true
    );
    expect(result.recommendations).toHaveLength(0);
  });

  it("returns unknown for whitespace-only HTML", () => {
    const result = checkMetadata("   \n  ");
    expect(result.status).toBe("unknown");
  });

  it("non-critical gaps are reported as issues but do not affect pass status", () => {
    // All critical present, no non-critical
    const result = checkMetadata(buildHtml(ALL_CRITICAL));
    expect(result.status).toBe("pass");
    // Non-critical issues should be present
    const nonCriticalIssues = result.issues.filter(
      (i) => i.severity === "low"
    );
    expect(nonCriticalIssues.length).toBeGreaterThan(0);
  });

  it("non-critical gaps do not affect warn status", () => {
    // One critical missing, no non-critical tags
    const result = checkMetadata(
      buildHtml({ title: "T", description: "D", ogTitle: "OG" })
    );
    expect(result.status).toBe("warn");
    // Should have high-severity issue for missing ogDescription
    expect(result.issues.some((i) => i.severity === "high")).toBe(true);
    // Should also have low-severity issues for non-critical gaps
    expect(result.issues.some((i) => i.severity === "low")).toBe(true);
  });

  it("returns extracted tag values in details", () => {
    const result = checkMetadata(buildHtml(ALL_TAGS));
    const extracted = result.details["extracted"] as Record<string, unknown>;
    expect(extracted.title).toBe("My Site");
    expect(extracted.description).toBe("A great site");
    expect(extracted.ogTitle).toBe("My Site OG");
    expect(extracted.ogDescription).toBe("A great site for OG");
    expect(extracted.canonical).toBe("https://example.com/");
    expect(extracted.robots).toBe("index, follow");
    expect(extracted.ogUrl).toBe("https://example.com/");
    expect(extracted.ogType).toBe("website");
    expect(extracted.ogImage).toBe("https://example.com/og.png");
    expect(extracted.twitterCard).toBe("summary_large_image");
    expect(extracted.twitterTitle).toBe("My Site Twitter");
    expect(extracted.twitterDescription).toBe("A great site on Twitter");
    expect(extracted.twitterImage).toBe("https://example.com/twitter.png");
  });

  it("returns null for absent tags in extracted values", () => {
    const result = checkMetadata(buildHtml(ALL_CRITICAL));
    const extracted = result.details["extracted"] as Record<string, unknown>;
    expect(extracted.canonical).toBeNull();
    expect(extracted.twitterCard).toBeNull();
    expect(extracted.ogImage).toBeNull();
  });

  it("includes missingFields list in details", () => {
    const result = checkMetadata(buildHtml({ title: "T" }));
    const missingFields = result.details["missingFields"] as string[];
    expect(Array.isArray(missingFields)).toBe(true);
    expect(missingFields.length).toBeGreaterThan(0);
  });

  it("includes a non-empty summary string in all cases", () => {
    const cases = [
      buildHtml(ALL_TAGS),
      buildHtml(ALL_CRITICAL),
      buildHtml({ title: "T" }),
      buildHtml({}),
      "",
    ];
    for (const html of cases) {
      const result = checkMetadata(html);
      expect(typeof result.summary).toBe("string");
      expect(result.summary.length).toBeGreaterThan(0);
    }
  });
});

describe("checkMetadata — property-based tests", () => {
  // Feature: site-analysis, Property 7: metadata status determined by critical tag presence
  it("Property 7: status is determined by critical tag presence", () => {
    // Arbitrary for a non-empty tag value
    const tagValueArb = fc.string({ minLength: 1, maxLength: 100 }).filter(
      (s) => s.trim().length > 0 && !s.includes("<") && !s.includes(">") && !s.includes('"')
    );

    // Subproperty: all four critical tags present → pass
    fc.assert(
      fc.property(
        tagValueArb,
        tagValueArb,
        tagValueArb,
        tagValueArb,
        (title, description, ogTitle, ogDescription) => {
          const html = buildHtml({ title, description, ogTitle, ogDescription });
          const result = checkMetadata(html);
          expect(result.status).toBe("pass");
        }
      ),
      { numRuns: 25 }
    );

    // Subproperty: exactly one critical tag present → warn
    fc.assert(
      fc.property(tagValueArb, (title) => {
        const html = buildHtml({ title });
        const result = checkMetadata(html);
        expect(result.status).toBe("warn");
      }),
      { numRuns: 25 }
    );

    // Subproperty: no critical tags → fail
    fc.assert(
      fc.property(
        fc.option(tagValueArb, { nil: undefined }),
        fc.option(tagValueArb, { nil: undefined }),
        (canonical, robots) => {
          const html = buildHtml({ canonical, robots });
          const result = checkMetadata(html);
          expect(result.status).toBe("fail");
        }
      ),
      { numRuns: 25 }
    );

    // Subproperty: non-critical gaps never change status from pass
    fc.assert(
      fc.property(
        tagValueArb,
        tagValueArb,
        tagValueArb,
        tagValueArb,
        (title, description, ogTitle, ogDescription) => {
          // Only critical tags, no non-critical
          const html = buildHtml({ title, description, ogTitle, ogDescription });
          const result = checkMetadata(html);
          expect(result.status).toBe("pass");
          // Non-critical issues should be low severity only
          const highIssues = result.issues.filter((i) => i.severity === "high");
          expect(highIssues).toHaveLength(0);
        }
      ),
      { numRuns: 25 }
    );

    // Subproperty: pass status always has empty recommendations
    fc.assert(
      fc.property(
        tagValueArb,
        tagValueArb,
        tagValueArb,
        tagValueArb,
        (title, description, ogTitle, ogDescription) => {
          const html = buildHtml({ title, description, ogTitle, ogDescription });
          const result = checkMetadata(html);
          if (result.status === "pass") {
            expect(result.recommendations).toHaveLength(0);
          }
        }
      ),
      { numRuns: 25 }
    );

    // Subproperty: warn/fail always have at least one recommendation
    fc.assert(
      fc.property(tagValueArb, (title) => {
        // Only title → warn
        const html = buildHtml({ title });
        const result = checkMetadata(html);
        expect(result.status).toBe("warn");
        expect(result.recommendations.length).toBeGreaterThan(0);
      }),
      { numRuns: 20 }
    );

    // Subproperty: fail always has at least one recommendation
    fc.assert(
      fc.property(fc.constant(null), () => {
        const html = buildHtml({});
        const result = checkMetadata(html);
        expect(result.status).toBe("fail");
        expect(result.recommendations.length).toBeGreaterThan(0);
      }),
      { numRuns: 10 }
    );
  });
});
