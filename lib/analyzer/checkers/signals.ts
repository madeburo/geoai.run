// Structured data signals checker for the Site Analysis module

import * as cheerio from "cheerio";
import { fetchText } from "../fetch-html";
import type { CheckItem, Issue, Recommendation } from "../types";

// ---------------------------------------------------------------------------
// HTML scanning helpers
// ---------------------------------------------------------------------------

interface JsonLdScanResult {
  totalCount: number;
  validCount: number;
  invalidCount: number;
  schemaTypes: string[];
  invalidIssues: Issue[];
}

/** Scans HTML for <script type="application/ld+json"> elements and parses each one. */
function scanJsonLd(html: string): JsonLdScanResult {
  const $ = cheerio.load(html);
  const scripts = $('script[type="application/ld+json"]');

  let validCount = 0;
  let invalidCount = 0;
  const schemaTypes: string[] = [];
  const invalidIssues: Issue[] = [];

  scripts.each((index, el) => {
    const raw = $(el).html() ?? "";
    try {
      const parsed = JSON.parse(raw) as unknown;
      validCount++;
      // Extract @type — could be a string or array
      if (parsed && typeof parsed === "object") {
        const obj = parsed as Record<string, unknown>;
        const type = obj["@type"];
        if (typeof type === "string" && type.length > 0) {
          schemaTypes.push(type);
        } else if (Array.isArray(type)) {
          for (const t of type) {
            if (typeof t === "string" && t.length > 0) {
              schemaTypes.push(t);
            }
          }
        }
      }
    } catch {
      invalidCount++;
      invalidIssues.push({
        code: "JSONLD_INVALID_JSON",
        message: `JSON-LD block #${index + 1} contains invalid JSON and cannot be parsed.`,
        severity: "medium",
      });
    }
  });

  return {
    totalCount: validCount + invalidCount,
    validCount,
    invalidCount,
    schemaTypes,
    invalidIssues,
  };
}

/** Returns true if the HTML contains any microdata attributes. */
function hasMicrodata(html: string): boolean {
  const $ = cheerio.load(html);
  return (
    $("[itemscope]").length > 0 ||
    $("[itemtype]").length > 0 ||
    $("[itemprop]").length > 0
  );
}

/** Returns true if the HTML contains any RDFa attributes. */
function hasRdfa(html: string): boolean {
  const $ = cheerio.load(html);
  return (
    $("[typeof]").length > 0 ||
    $("[property]").length > 0 ||
    $("[vocab]").length > 0
  );
}

// ---------------------------------------------------------------------------
// Sitemap validation
// ---------------------------------------------------------------------------

/** Returns true if the sitemap response is a valid XML sitemap (not an HTML page). */
function isValidSitemap(
  contentType: string,
  body: string
): boolean {
  const isXmlContentType =
    contentType.includes("xml") ||
    contentType.includes("text/plain") ||
    contentType === "";

  if (!isXmlContentType) return false;

  const hasUrlset = body.includes("<urlset");
  const hasSitemapIndex = body.includes("<sitemapindex");
  return hasUrlset || hasSitemapIndex;
}

// ---------------------------------------------------------------------------
// Main checker
// ---------------------------------------------------------------------------

/**
 * Checks the homepage HTML for structured data signals and validates sitemap.xml.
 *
 * Status logic:
 * - At least one valid JSON-LD block → pass
 * - No JSON-LD but microdata or RDFa present → warn
 * - No structured data markup but valid sitemap exists → warn
 * - No structured data and no valid sitemap → fail
 */
export async function checkStructuredSignals(
  origin: string,
  html: string
): Promise<CheckItem> {
  // Scan HTML for structured data
  const jsonLd = scanJsonLd(html);
  const microdataPresent = hasMicrodata(html);
  const rdfaPresent = hasRdfa(html);

  // Fetch and validate sitemap.xml
  const sitemapUrl = `${origin}/sitemap.xml`;
  const sitemapResult = await fetchText(sitemapUrl);

  let sitemapPresent = false;
  if (sitemapResult.ok && sitemapResult.status === 200) {
    const contentType = sitemapResult.headers["content-type"] ?? "";
    sitemapPresent = isValidSitemap(contentType, sitemapResult.body);
  }

  // Collect issues
  const issues: Issue[] = [...jsonLd.invalidIssues];
  const recommendations: Recommendation[] = [];

  // Determine status
  let status: CheckItem["status"];
  let summary: string;

  if (jsonLd.validCount > 0) {
    status = "pass";
    summary = `Found ${jsonLd.validCount} valid JSON-LD block${jsonLd.validCount !== 1 ? "s" : ""} with structured data.`;
  } else if (microdataPresent || rdfaPresent) {
    status = "warn";
    const types: string[] = [];
    if (microdataPresent) types.push("microdata");
    if (rdfaPresent) types.push("RDFa");
    summary = `No JSON-LD found, but ${types.join(" and ")} markup detected.`;

    issues.push({
      code: "NO_JSONLD_STRUCTURED_DATA",
      message:
        "No JSON-LD structured data found. Consider adding JSON-LD as it is the preferred format for AI search engines.",
      severity: "medium",
    });
    recommendations.push({
      code: "ADD_JSONLD",
      category: "structuredSignals",
      title: "Add JSON-LD structured data",
      description:
        "While microdata or RDFa is present, JSON-LD is the preferred format for structured data. Add <script type=\"application/ld+json\"> blocks to your pages for better AI search engine compatibility.",
    });
  } else if (sitemapPresent) {
    status = "warn";
    summary = "No structured data markup found, but a valid sitemap.xml exists.";

    issues.push({
      code: "NO_STRUCTURED_DATA",
      message:
        "No structured data markup (JSON-LD, microdata, or RDFa) found on the homepage.",
      severity: "high",
    });
    recommendations.push({
      code: "ADD_STRUCTURED_DATA",
      category: "structuredSignals",
      title: "Add structured data markup",
      description:
        "Add JSON-LD structured data to your homepage to help AI search engines understand your content. Use Schema.org types like Organization, WebSite, or Product.",
    });
  } else {
    status = "fail";
    summary =
      "No structured data markup and no valid sitemap.xml found.";

    issues.push({
      code: "NO_STRUCTURED_DATA",
      message:
        "No structured data markup (JSON-LD, microdata, or RDFa) found on the homepage.",
      severity: "high",
    });
    issues.push({
      code: "NO_SITEMAP",
      message: "No valid sitemap.xml found at the site root.",
      severity: "medium",
    });
    recommendations.push({
      code: "ADD_STRUCTURED_DATA",
      category: "structuredSignals",
      title: "Add structured data markup",
      description:
        "Add JSON-LD structured data to your homepage to help AI search engines understand your content. Use Schema.org types like Organization, WebSite, or Product.",
    });
    recommendations.push({
      code: "ADD_SITEMAP",
      category: "structuredSignals",
      title: "Create a sitemap.xml",
      description:
        "Add a sitemap.xml at your site root to help AI crawlers discover all your pages. Submit it to search engines for better indexing.",
    });
  }

  // Add recommendation for invalid JSON-LD blocks (if any)
  if (jsonLd.invalidCount > 0) {
    recommendations.push({
      code: "FIX_INVALID_JSONLD",
      category: "structuredSignals",
      title: "Fix invalid JSON-LD blocks",
      description: `${jsonLd.invalidCount} JSON-LD block${jsonLd.invalidCount !== 1 ? "s" : ""} contain invalid JSON. Validate and fix them using Google's Rich Results Test or Schema.org validator.`,
    });
  }

  return {
    status,
    summary,
    details: {
      jsonLdCount: jsonLd.totalCount,
      jsonLdValid: jsonLd.validCount,
      jsonLdInvalid: jsonLd.invalidCount,
      schemaTypes: jsonLd.schemaTypes,
      microdataPresent,
      rdfaPresent,
      sitemapPresent,
    },
    issues,
    recommendations,
  };
}
