// llms.txt checker for the Site Analysis module

import { fetchText } from "../fetch-html";
import type { CheckItem, Issue, Recommendation } from "../types";

const CONTENT_PREVIEW_MAX = 500;

/** Returns true if the content type header indicates a text-based response */
function isTextContentType(contentType: string): boolean {
  return contentType.startsWith("text/") || contentType.includes("json");
}

/**
 * Returns true if the body contains informative signals:
 * - At least one URL or resource path (e.g. https://... or /some/path)
 * - Or a brand/site description pattern (e.g. "# SiteName" or "SiteName is a ...")
 */
function hasInformativeContent(body: string): boolean {
  const hasUrl = /https?:\/\/\S+/.test(body);
  const hasPath = /\/[\w\-./]+/.test(body);
  const hasBrandDescription = /^#\s+\S+|[A-Z][a-z]+\s+is\s+a\s+/m.test(body);
  return hasUrl || hasPath || hasBrandDescription;
}

/**
 * Checks whether the site publishes a valid llms.txt file at {origin}/llms.txt.
 *
 * Status logic:
 * - HTTP 200 + text content type + body ≥ 100 chars + informative content → pass
 * - HTTP 200 + empty body → warn
 * - HTTP 200 + non-text content type → warn
 * - HTTP 200 + body < 100 chars or no informative signals → warn
 * - HTTP 404 → not_found
 * - Network error → unknown
 */
export async function checkLlmsTxt(origin: string): Promise<CheckItem> {
  const url = `${origin}/llms.txt`;
  const result = await fetchText(url);

  if (!result.ok) {
    return {
      status: "unknown",
      summary: "Could not reach llms.txt due to a network error.",
      details: { url, contentPreview: null },
      issues: [
        {
          code: "LLMS_TXT_NETWORK_ERROR",
          message: `Network error fetching ${url}: ${result.error}`,
          severity: "medium",
        },
      ],
      recommendations: [],
    };
  }

  const { status, body, headers } = result;
  const contentType = headers["content-type"] ?? "";
  const contentPreview = body.slice(0, CONTENT_PREVIEW_MAX);

  if (status === 404) {
    const issues: Issue[] = [
      {
        code: "LLMS_TXT_NOT_FOUND",
        message: "No llms.txt file found at the site root.",
        severity: "high",
      },
    ];
    const recommendations: Recommendation[] = [
      {
        code: "ADD_LLMS_TXT",
        category: "llmsTxt",
        title: "Create an llms.txt file",
        description:
          "Add an llms.txt file at your site root (e.g. https://example.com/llms.txt) to help AI models discover structured information about your site. See https://llmstxt.org for the specification.",
      },
    ];
    return {
      status: "not_found",
      summary: "llms.txt not found (HTTP 404).",
      details: { url, contentPreview: null },
      issues,
      recommendations,
    };
  }

  if (status === 200) {
    // Empty body
    if (body.trim().length === 0) {
      return {
        status: "warn",
        summary: "llms.txt exists but the file is empty.",
        details: { url, contentPreview: null },
        issues: [
          {
            code: "LLMS_TXT_EMPTY",
            message: "llms.txt was found but contains no content.",
            severity: "high",
          },
        ],
        recommendations: [
          {
            code: "POPULATE_LLMS_TXT",
            category: "llmsTxt",
            title: "Add content to your llms.txt file",
            description:
              "Your llms.txt file exists but is empty. Populate it with a description of your site, key URLs, and resources to help AI models understand your content.",
          },
        ],
      };
    }

    // Non-text content type
    if (!isTextContentType(contentType)) {
      return {
        status: "warn",
        summary: `llms.txt returned an unexpected content type: ${contentType || "unknown"}.`,
        details: { url, contentPreview, contentType },
        issues: [
          {
            code: "LLMS_TXT_WRONG_CONTENT_TYPE",
            message: `llms.txt should be served as text/plain but got: ${contentType || "unknown"}.`,
            severity: "medium",
          },
        ],
        recommendations: [
          {
            code: "FIX_LLMS_TXT_CONTENT_TYPE",
            category: "llmsTxt",
            title: "Serve llms.txt as text/plain",
            description:
              "Configure your server to serve llms.txt with a text/plain content type so AI crawlers can reliably parse it.",
          },
        ],
      };
    }

    // Thin or non-informative content
    if (body.length < 100 || !hasInformativeContent(body)) {
      return {
        status: "warn",
        summary: "llms.txt exists but the content appears insufficient.",
        details: { url, contentPreview, contentType },
        issues: [
          {
            code: "LLMS_TXT_THIN_CONTENT",
            message:
              body.length < 100
                ? `llms.txt content is too short (${body.length} chars). At least 100 characters with informative content are recommended.`
                : "llms.txt content lacks informative signals (no URLs, paths, or site description found).",
            severity: "medium",
          },
        ],
        recommendations: [
          {
            code: "IMPROVE_LLMS_TXT",
            category: "llmsTxt",
            title: "Improve your llms.txt content",
            description:
              "Expand your llms.txt to include a site description, key page URLs, and resource paths. This helps AI models build a richer understanding of your site.",
          },
        ],
      };
    }

    // All checks passed
    return {
      status: "pass",
      summary: "llms.txt is present and contains informative content.",
      details: { url, contentPreview, contentType },
      issues: [],
      recommendations: [],
    };
  }

  // Any other HTTP status (e.g. 403, 500)
  return {
    status: "warn",
    summary: `llms.txt returned an unexpected HTTP status: ${status}.`,
    details: { url, contentPreview: body.length > 0 ? contentPreview : null, httpStatus: status },
    issues: [
      {
        code: "LLMS_TXT_UNEXPECTED_STATUS",
        message: `Unexpected HTTP ${status} when fetching llms.txt.`,
        severity: "medium",
      },
    ],
    recommendations: [
      {
        code: "FIX_LLMS_TXT_ACCESS",
        category: "llmsTxt",
        title: "Ensure llms.txt is publicly accessible",
        description:
          "Make sure your llms.txt file is publicly accessible and returns HTTP 200. Check server configuration for access restrictions.",
      },
    ],
  };
}
