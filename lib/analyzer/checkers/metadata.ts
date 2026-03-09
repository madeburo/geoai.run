// AI metadata checker for the Site Analysis module

import * as cheerio from "cheerio";
import type { CheckItem, Issue, Recommendation } from "../types";

interface ExtractedMetadata {
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogUrl: string | null;
  ogType: string | null;
  ogImage: string | null;
  twitterCard: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
}

const CRITICAL_TAGS = ["title", "description", "ogTitle", "ogDescription"] as const;
type CriticalTag = (typeof CRITICAL_TAGS)[number];

const CRITICAL_LABELS: Record<CriticalTag, string> = {
  title: "<title>",
  description: 'meta[name="description"]',
  ogTitle: 'meta[property="og:title"]',
  ogDescription: 'meta[property="og:description"]',
};

const NON_CRITICAL_LABELS: Record<
  keyof Omit<ExtractedMetadata, CriticalTag>,
  string
> = {
  canonical: 'link[rel="canonical"]',
  robots: 'meta[name="robots"]',
  ogUrl: 'meta[property="og:url"]',
  ogType: 'meta[property="og:type"]',
  ogImage: 'meta[property="og:image"]',
  twitterCard: 'meta[name="twitter:card"]',
  twitterTitle: 'meta[name="twitter:title"]',
  twitterDescription: 'meta[name="twitter:description"]',
  twitterImage: 'meta[name="twitter:image"]',
};

function extractMetadata(html: string): ExtractedMetadata | null {
  if (!html || html.trim().length === 0) return null;

  let $: cheerio.CheerioAPI;
  try {
    $ = cheerio.load(html);
  } catch {
    return null;
  }

  const head = $("head");
  // If there's no head element at all, treat as unparseable
  if (head.length === 0) return null;

  return {
    title: $("head title").first().text().trim() || null,
    description:
      $('head meta[name="description"]').attr("content")?.trim() || null,
    canonical: $('head link[rel="canonical"]').attr("href")?.trim() || null,
    robots: $('head meta[name="robots"]').attr("content")?.trim() || null,
    ogTitle:
      $('head meta[property="og:title"]').attr("content")?.trim() || null,
    ogDescription:
      $('head meta[property="og:description"]').attr("content")?.trim() ||
      null,
    ogUrl: $('head meta[property="og:url"]').attr("content")?.trim() || null,
    ogType: $('head meta[property="og:type"]').attr("content")?.trim() || null,
    ogImage:
      $('head meta[property="og:image"]').attr("content")?.trim() || null,
    twitterCard:
      $('head meta[name="twitter:card"]').attr("content")?.trim() || null,
    twitterTitle:
      $('head meta[name="twitter:title"]').attr("content")?.trim() || null,
    twitterDescription:
      $('head meta[name="twitter:description"]').attr("content")?.trim() ||
      null,
    twitterImage:
      $('head meta[name="twitter:image"]').attr("content")?.trim() || null,
  };
}

/**
 * Checks the homepage HTML for AI-discoverability metadata tags.
 *
 * Status logic:
 * - Empty/unparseable HTML → unknown (early return)
 * - All four critical tags present (title, meta description, og:title, og:description) → pass
 * - At least one critical present but not all → warn
 * - All critical tags absent → fail
 * Non-critical gaps are reported as issues but do NOT affect status.
 */
export function checkMetadata(html: string): CheckItem {
  const meta = extractMetadata(html);

  if (meta === null) {
    return {
      status: "unknown",
      summary: "Could not parse HTML to extract metadata.",
      details: { extracted: null },
      issues: [
        {
          code: "METADATA_PARSE_FAILURE",
          message: "The provided HTML is empty or could not be parsed.",
          severity: "medium",
        },
      ],
      recommendations: [],
    };
  }

  const issues: Issue[] = [];
  const recommendations: Recommendation[] = [];
  const missingFields: string[] = [];

  // Evaluate critical tags
  const presentCritical = CRITICAL_TAGS.filter((tag) => meta[tag] !== null);
  const missingCritical = CRITICAL_TAGS.filter((tag) => meta[tag] === null);

  for (const tag of missingCritical) {
    missingFields.push(CRITICAL_LABELS[tag]);
    issues.push({
      code: `MISSING_${tag.replace(/([A-Z])/g, "_$1").toUpperCase()}`,
      message: `Missing critical metadata tag: ${CRITICAL_LABELS[tag]}`,
      severity: "high",
    });
  }

  // Evaluate non-critical tags — issues only, no status impact
  for (const [key, label] of Object.entries(NON_CRITICAL_LABELS)) {
    const k = key as keyof typeof NON_CRITICAL_LABELS;
    if (meta[k] === null) {
      missingFields.push(label);
      issues.push({
        code: `MISSING_${key.replace(/([A-Z])/g, "_$1").toUpperCase()}`,
        message: `Missing non-critical metadata tag: ${label}`,
        severity: "low",
      });
    }
  }

  // Determine status
  let status: CheckItem["status"];
  let summary: string;

  if (missingCritical.length === 0) {
    status = "pass";
    summary = "All critical metadata tags are present.";
  } else if (presentCritical.length > 0) {
    status = "warn";
    summary = `Some critical metadata tags are missing: ${missingCritical.map((t) => CRITICAL_LABELS[t]).join(", ")}.`;
    recommendations.push({
      code: "COMPLETE_CRITICAL_METADATA",
      category: "aiMetadata",
      title: "Add missing critical metadata tags",
      description: `Add the following missing tags to your <head>: ${missingCritical.map((t) => CRITICAL_LABELS[t]).join(", ")}. These are essential for AI search engines to understand and index your page.`,
    });
  } else {
    status = "fail";
    summary = "All critical metadata tags are absent.";
    recommendations.push({
      code: "ADD_CRITICAL_METADATA",
      category: "aiMetadata",
      title: "Add essential metadata tags",
      description:
        "Your page is missing all critical metadata tags (title, meta description, og:title, og:description). Add these to your <head> to improve AI search engine discoverability.",
    });
  }

  // Non-critical recommendation (only if there are non-critical gaps and status is warn)
  const missingNonCritical = Object.keys(NON_CRITICAL_LABELS).filter(
    (k) => meta[k as keyof typeof NON_CRITICAL_LABELS] === null
  );
  if (missingNonCritical.length > 0 && status === "warn") {
    recommendations.push({
      code: "IMPROVE_SUPPLEMENTAL_METADATA",
      category: "aiMetadata",
      title: "Add supplemental metadata tags",
      description: `Consider adding the following optional but beneficial tags: ${missingNonCritical.map((k) => NON_CRITICAL_LABELS[k as keyof typeof NON_CRITICAL_LABELS]).join(", ")}.`,
    });
  }

  return {
    status,
    summary,
    details: {
      extracted: meta,
      missingFields,
      criticalPresent: presentCritical.length,
      criticalTotal: CRITICAL_TAGS.length,
    },
    issues,
    recommendations,
  };
}
