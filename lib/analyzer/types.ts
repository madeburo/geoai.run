// Type definitions for the Site Analysis module

/** Possible outcomes for any individual check */
export type CheckStatus = "pass" | "warn" | "fail" | "not_found" | "unknown";

/** The four analysis categories */
export type AnalysisCategory =
  | "llmsTxt"
  | "aiMetadata"
  | "crawlerRules"
  | "structuredSignals";

/** Classification of a crawler's access based on robots.txt */
export type CrawlerClassification = "allowed" | "blocked" | "unspecified";

/** A specific issue found during analysis */
export interface Issue {
  code: string;
  message: string;
  severity: "low" | "medium" | "high";
}

/** An actionable recommendation to improve AI readiness */
export interface Recommendation {
  code: string;
  category: AnalysisCategory;
  title: string;
  description: string;
}

/** Result of a single checker module */
export interface CheckItem {
  status: CheckStatus;
  summary: string;
  details: Record<string, unknown>;
  issues: Issue[];
  recommendations: Recommendation[];
}

/** Per-crawler robots.txt classification */
export interface CrawlerRuleResult {
  crawler: string;
  classification: CrawlerClassification;
}

/** Score calculation output */
export interface ScoreResult {
  overall: number;
  categories: Record<AnalysisCategory, number>;
}

/** URL normalization result — discriminated union */
export type NormalizeResult =
  | { ok: true; url: URL }
  | { ok: false; error: string };

/** Fetch result — discriminated union.
 *  ok: true  = got an HTTP response (any status code)
 *  ok: false = network-level failure only
 */
export type FetchResult =
  | {
      ok: true;
      body: string;
      status: number;
      finalUrl: string;
      headers: Record<string, string>;
    }
  | { ok: false; kind: "network"; error: string };

/** The top-level analysis report */
export interface AIReadinessReport {
  inputUrl: string;
  normalizedUrl: string | null;
  finalUrl: string | null;
  timestamp: string; // ISO 8601
  checks: {
    llmsTxt: CheckItem;
    aiMetadata: CheckItem;
    crawlerRules: CheckItem;
    structuredSignals: CheckItem;
  };
  issues: Issue[];
  recommendations: Recommendation[];
  score: ScoreResult;
}

/** Known AI search engine crawlers */
export const AI_CRAWLERS = [
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
] as const;

export type AICrawler = (typeof AI_CRAWLERS)[number];

/** Score weights per CheckStatus */
export const STATUS_SCORES: Record<CheckStatus, number> = {
  pass: 100,
  warn: 65,
  fail: 20,
  not_found: 10,
  unknown: 40,
};
