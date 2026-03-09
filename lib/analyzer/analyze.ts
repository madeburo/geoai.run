// Main orchestrator for the Site Analysis module

import { normalizeUrl } from "./normalize-url";
import { fetchHtml } from "./fetch-html";
import { checkLlmsTxt } from "./checkers/llms-txt";
import { checkMetadata } from "./checkers/metadata";
import { checkCrawlerRules } from "./checkers/crawler-rules";
import { checkStructuredSignals } from "./checkers/signals";
import { calculateScore } from "./score";
import { createUnknownCheck, createFallbackReport } from "./helpers";
import type { AIReadinessReport, CheckItem } from "./types";

/**
 * Analyzes a website's AI search readiness.
 *
 * Pipeline:
 * 1. Normalize the input URL — on failure, return an all-unknown fallback report.
 * 2. Fetch the homepage — on failure, still run llmsTxt and crawlerRules.
 * 3. Run all four checkers via Promise.allSettled (each wrapped in try/catch).
 * 4. Compute score, aggregate issues/recommendations, assemble report.
 *
 * This function never throws — a top-level try/catch returns a fallback report
 * if something completely unexpected occurs.
 */
export async function analyzeSiteForAIReadiness(
  url: string
): Promise<AIReadinessReport> {
  try {
    // Step 1: Normalize URL
    const normalized = normalizeUrl(url);
    if (!normalized.ok) {
      return createFallbackReport(url, normalized.error);
    }

    const normalizedUrl = normalized.url.toString();
    const origin = normalized.url.origin;

    // Step 2: Fetch homepage
    const homepageResult = await fetchHtml(normalizedUrl);
    const homepageFetched = homepageResult.ok;
    const html = homepageFetched ? homepageResult.body : "";
    const finalUrl = homepageFetched ? homepageResult.finalUrl : normalizedUrl;

    // Step 3: Run checkers — metadata and signals require homepage HTML;
    // llmsTxt and crawlerRules fetch their own resources independently.
    async function safeRun(
      name: string,
      fn: () => Promise<CheckItem>
    ): Promise<CheckItem> {
      try {
        return await fn();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`[analyzer] Unexpected error in ${name} checker:`, err);
        return createUnknownCheck(
          `Unexpected error in ${name} checker: ${message}`
        );
      }
    }

    const [llmsTxtResult, aiMetadataResult, crawlerRulesResult, structuredSignalsResult] =
      await Promise.allSettled([
        safeRun("llmsTxt", () => checkLlmsTxt(origin)),
        homepageFetched
          ? safeRun("aiMetadata", () => Promise.resolve(checkMetadata(html)))
          : Promise.resolve(
              createUnknownCheck("Homepage could not be fetched; metadata check skipped.")
            ),
        safeRun("crawlerRules", () => checkCrawlerRules(origin)),
        homepageFetched
          ? safeRun("structuredSignals", () => checkStructuredSignals(origin, html))
          : Promise.resolve(
              createUnknownCheck("Homepage could not be fetched; structured signals check skipped.")
            ),
      ]);

    // Unwrap allSettled results — safeRun already handles rejections,
    // but allSettled can still reject if the Promise.resolve itself somehow fails.
    function unwrap(result: PromiseSettledResult<CheckItem>, name: string): CheckItem {
      if (result.status === "fulfilled") return result.value;
      const message = result.reason instanceof Error
        ? result.reason.message
        : String(result.reason);
      console.error(`[analyzer] allSettled rejection in ${name}:`, result.reason);
      return createUnknownCheck(`Unexpected failure in ${name} checker: ${message}`);
    }

    const checks = {
      llmsTxt: unwrap(llmsTxtResult, "llmsTxt"),
      aiMetadata: unwrap(aiMetadataResult, "aiMetadata"),
      crawlerRules: unwrap(crawlerRulesResult, "crawlerRules"),
      structuredSignals: unwrap(structuredSignalsResult, "structuredSignals"),
    };

    // Step 4: Score + aggregate
    const score = calculateScore(checks);

    const issues = [
      ...checks.llmsTxt.issues,
      ...checks.aiMetadata.issues,
      ...checks.crawlerRules.issues,
      ...checks.structuredSignals.issues,
    ];

    const recommendations = [
      ...checks.llmsTxt.recommendations,
      ...checks.aiMetadata.recommendations,
      ...checks.crawlerRules.recommendations,
      ...checks.structuredSignals.recommendations,
    ];

    return {
      inputUrl: url,
      normalizedUrl,
      finalUrl,
      timestamp: new Date().toISOString(),
      checks,
      issues,
      recommendations,
      score,
    };
  } catch (err) {
    // Top-level safety net — should never be reached under normal circumstances
    const message = err instanceof Error ? err.message : String(err);
    console.error("[analyzer] Top-level unexpected error:", err);
    return createFallbackReport(url, `Unexpected analysis failure: ${message}`);
  }
}
