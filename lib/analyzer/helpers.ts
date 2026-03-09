// Fallback report and check factory utilities
import type { AIReadinessReport, CheckItem } from "./types";
import { STATUS_SCORES } from "./types";

/**
 * Creates a CheckItem with status "unknown" for use when a checker
 * cannot run or throws an unexpected error.
 */
export function createUnknownCheck(message: string): CheckItem {
  return {
    status: "unknown",
    summary: message,
    details: {},
    issues: [{ code: "UNKNOWN_ERROR", message, severity: "medium" }],
    recommendations: [],
  };
}

/**
 * Creates a complete AIReadinessReport with all checks set to "unknown".
 * Used when URL normalization fails or a catastrophic error occurs.
 */
export function createFallbackReport(
  inputUrl: string,
  error: string
): AIReadinessReport {
  const unknownScore = STATUS_SCORES["unknown"];
  const unknownCheck = createUnknownCheck(error);

  return {
    inputUrl,
    normalizedUrl: null,
    finalUrl: null,
    timestamp: new Date().toISOString(),
    checks: {
      llmsTxt: unknownCheck,
      aiMetadata: unknownCheck,
      crawlerRules: unknownCheck,
      structuredSignals: unknownCheck,
    },
    issues: [{ code: "ANALYSIS_FAILED", message: error, severity: "high" }],
    recommendations: [],
    score: {
      overall: unknownScore,
      categories: {
        llmsTxt: unknownScore,
        aiMetadata: unknownScore,
        crawlerRules: unknownScore,
        structuredSignals: unknownScore,
      },
    },
  };
}
