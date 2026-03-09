import type { AnalysisCategory, CheckItem, ScoreResult } from "./types";
import { STATUS_SCORES } from "./types";

const CATEGORIES: AnalysisCategory[] = [
  "llmsTxt",
  "aiMetadata",
  "crawlerRules",
  "structuredSignals",
];

/**
 * Computes a weighted score from four check results.
 * Each category contributes equally (25%). Status weights come from STATUS_SCORES.
 * Overall score is rounded to the nearest integer.
 */
export function calculateScore(
  checks: Record<AnalysisCategory, CheckItem>
): ScoreResult {
  const categories = {} as Record<AnalysisCategory, number>;

  for (const cat of CATEGORIES) {
    categories[cat] = STATUS_SCORES[checks[cat].status];
  }

  const overall = Math.round(
    CATEGORIES.reduce((sum, cat) => sum + categories[cat], 0) / CATEGORIES.length
  );

  return { overall, categories };
}
