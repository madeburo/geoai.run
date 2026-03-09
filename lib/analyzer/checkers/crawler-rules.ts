// Crawler rules checker for the Site Analysis module

import { fetchText } from "../fetch-html";
import { AI_CRAWLERS } from "../types";
import type {
  CheckItem,
  CrawlerClassification,
  CrawlerRuleResult,
  Issue,
  Recommendation,
} from "../types";

interface RobotsBlock {
  agents: string[]; // User-agent values (lowercased for matching)
  disallows: string[];
  allows: string[];
}

interface ParsedRobots {
  blocks: RobotsBlock[];
  sitemaps: string[];
}

// ---------------------------------------------------------------------------
// robots.txt parser
// ---------------------------------------------------------------------------

/**
 * Parses a robots.txt body into structured blocks.
 * Each block groups one or more User-agent directives with their Disallow/Allow rules.
 * Sitemap directives are collected globally.
 */
export function parseRobotsTxt(body: string): ParsedRobots {
  const lines = body.split(/\r?\n/);
  const blocks: RobotsBlock[] = [];
  const sitemaps: string[] = [];

  let currentBlock: RobotsBlock | null = null;

  for (const rawLine of lines) {
    // Strip inline comments and trim
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) {
      // Blank line ends the current block
      if (currentBlock) {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const directive = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();

    if (directive === "user-agent") {
      if (!currentBlock) {
        currentBlock = { agents: [], disallows: [], allows: [] };
      }
      currentBlock.agents.push(value.toLowerCase());
    } else if (directive === "disallow") {
      if (currentBlock) currentBlock.disallows.push(value);
    } else if (directive === "allow") {
      if (currentBlock) currentBlock.allows.push(value);
    } else if (directive === "sitemap") {
      if (value) sitemaps.push(value);
    }
  }

  // Push the last block if file doesn't end with a blank line
  if (currentBlock) blocks.push(currentBlock);

  return { blocks, sitemaps };
}

// ---------------------------------------------------------------------------
// Per-crawler classification
// ---------------------------------------------------------------------------

/**
 * Classifies a single crawler against the parsed robots.txt.
 *
 * Precedence rules:
 * 1. Exact User-agent block takes priority over wildcard (*).
 * 2. Within a block, Allow rules can override Disallow rules.
 * 3. Disallow: / means blocked (unless overridden by Allow: /).
 * 4. No specific block and wildcard has no Disallow: / → unspecified.
 */
export function classifyCrawler(
  crawlerName: string,
  parsed: ParsedRobots
): CrawlerClassification {
  const nameLower = crawlerName.toLowerCase();

  // Find exact block for this crawler
  const exactBlock = parsed.blocks.find((b) => b.agents.includes(nameLower));
  // Find wildcard block
  const wildcardBlock = parsed.blocks.find((b) => b.agents.includes("*"));

  const block = exactBlock ?? wildcardBlock;
  if (!block) return "unspecified";

  // If using wildcard block and no exact block exists, check if wildcard has Disallow: /
  // If wildcard has no Disallow: / and there's no exact block → unspecified
  if (!exactBlock && wildcardBlock) {
    const wildcardBlocked = isBlockedByRules(wildcardBlock);
    if (!wildcardBlocked) return "unspecified";
  }

  return isBlockedByRules(block) ? "blocked" : "allowed";
}

/**
 * Returns true if the block's rules result in the crawler being blocked from /.
 * Allow rules can override Disallow within the same block.
 */
function isBlockedByRules(block: RobotsBlock): boolean {
  const hasDisallowRoot = block.disallows.some((d) => d === "/");
  if (!hasDisallowRoot) return false;

  // Check if Allow: / overrides the Disallow: /
  const hasAllowRoot = block.allows.some((a) => a === "/" || a === "");
  return !hasAllowRoot;
}

/**
 * Returns true if the wildcard block has a global Disallow: / (with no Allow override).
 */
function hasGlobalBlock(parsed: ParsedRobots): boolean {
  const wildcardBlock = parsed.blocks.find((b) => b.agents.includes("*"));
  if (!wildcardBlock) return false;
  return isBlockedByRules(wildcardBlock);
}

// ---------------------------------------------------------------------------
// Main checker
// ---------------------------------------------------------------------------

/**
 * Checks the site's robots.txt for AI crawler access rules.
 *
 * Status logic:
 * - Global block (User-agent: * with Disallow: /) OR all 10 AI crawlers blocked → fail
 * - Majority (≥6 of 10) blocked OR robots.txt 404 OR (≥5 unspecified AND ≥1 blocked) → warn
 * - Robots present, no global block, majority not blocked → pass
 * - Network error → unknown
 */
export async function checkCrawlerRules(origin: string): Promise<CheckItem> {
  const url = `${origin}/robots.txt`;
  const result = await fetchText(url);

  // Network error
  if (!result.ok) {
    return {
      status: "unknown",
      summary: "Could not reach robots.txt due to a network error.",
      details: {
        robotsPresent: false,
        sitemaps: [],
        globalBlock: false,
        crawlers: [],
      },
      issues: [
        {
          code: "ROBOTS_NETWORK_ERROR",
          message: `Network error fetching ${url}: ${result.error}`,
          severity: "medium",
        },
      ],
      recommendations: [],
    };
  }

  const { status, body } = result;

  // robots.txt not found (404)
  if (status === 404) {
    const crawlers: CrawlerRuleResult[] = AI_CRAWLERS.map((c) => ({
      crawler: c,
      classification: "unspecified" as CrawlerClassification,
    }));

    return {
      status: "warn",
      summary: "robots.txt not found (HTTP 404). AI crawlers are unspecified.",
      details: {
        robotsPresent: false,
        sitemaps: [],
        globalBlock: false,
        crawlers,
      },
      issues: [
        {
          code: "ROBOTS_NOT_FOUND",
          message:
            "No robots.txt file found. Without it, AI crawlers have no explicit guidance.",
          severity: "medium",
        },
      ],
      recommendations: [
        {
          code: "ADD_ROBOTS_TXT",
          category: "crawlerRules",
          title: "Create a robots.txt file",
          description:
            "Add a robots.txt file at your site root to explicitly allow AI crawlers. This gives you control over which AI services can access your content.",
        },
      ],
    };
  }

  // Parse the robots.txt body
  const parsed = parseRobotsTxt(body);
  const globalBlock = hasGlobalBlock(parsed);

  // Classify each AI crawler
  const crawlers: CrawlerRuleResult[] = AI_CRAWLERS.map((c) => ({
    crawler: c,
    classification: classifyCrawler(c, parsed),
  }));

  const blockedCount = crawlers.filter(
    (c) => c.classification === "blocked"
  ).length;
  const unspecifiedCount = crawlers.filter(
    (c) => c.classification === "unspecified"
  ).length;
  const totalCrawlers = AI_CRAWLERS.length; // 10

  const issues: Issue[] = [];
  const recommendations: Recommendation[] = [];

  // Determine status
  let checkStatus: CheckItem["status"];
  let summary: string;

  if (globalBlock || blockedCount === totalCrawlers) {
    checkStatus = "fail";
    summary = globalBlock
      ? "robots.txt has a global Disallow: / blocking all crawlers including AI."
      : "All AI crawlers are explicitly blocked in robots.txt.";

    issues.push({
      code: "ROBOTS_ALL_AI_BLOCKED",
      message: globalBlock
        ? "A global Disallow: / rule blocks all crawlers, including AI search engines."
        : "All known AI crawlers are explicitly blocked in robots.txt.",
      severity: "high",
    });
    recommendations.push({
      code: "ALLOW_AI_CRAWLERS",
      category: "crawlerRules",
      title: "Allow AI crawlers in robots.txt",
      description:
        "Remove the global Disallow: / rule or add explicit Allow rules for AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) to improve your AI search visibility.",
    });
  } else if (
    blockedCount >= Math.ceil(totalCrawlers / 2) + 1 || // majority = >50% = ≥6
    (unspecifiedCount >= 5 && blockedCount >= 1)
  ) {
    checkStatus = "warn";
    const blockedNames = crawlers
      .filter((c) => c.classification === "blocked")
      .map((c) => c.crawler);

    if (blockedCount >= Math.ceil(totalCrawlers / 2) + 1) {
      summary = `Majority of AI crawlers (${blockedCount}/${totalCrawlers}) are blocked.`;
      issues.push({
        code: "ROBOTS_MAJORITY_AI_BLOCKED",
        message: `${blockedCount} of ${totalCrawlers} AI crawlers are blocked: ${blockedNames.join(", ")}.`,
        severity: "high",
      });
    } else {
      summary = `${unspecifiedCount} AI crawlers are unspecified and ${blockedCount} are blocked.`;
      issues.push({
        code: "ROBOTS_MIXED_AI_ACCESS",
        message: `${unspecifiedCount} AI crawlers have no explicit rules and ${blockedCount} are blocked: ${blockedNames.join(", ")}.`,
        severity: "medium",
      });
    }

    recommendations.push({
      code: "REVIEW_AI_CRAWLER_ACCESS",
      category: "crawlerRules",
      title: "Review AI crawler access policies",
      description:
        "Consider explicitly allowing key AI crawlers in your robots.txt to improve AI search visibility. Add User-agent blocks for GPTBot, ClaudeBot, PerplexityBot, and others.",
    });
  } else {
    checkStatus = "pass";
    summary = `robots.txt is present and AI crawlers are not broadly restricted.`;
  }

  // Report individually blocked crawlers as issues (if not already covered by fail)
  if (checkStatus !== "fail" && blockedCount > 0) {
    const blockedNames = crawlers
      .filter((c) => c.classification === "blocked")
      .map((c) => c.crawler);
    issues.push({
      code: "ROBOTS_SOME_AI_BLOCKED",
      message: `The following AI crawlers are blocked: ${blockedNames.join(", ")}.`,
      severity: "medium",
    });
  }

  return {
    status: checkStatus,
    summary,
    details: {
      robotsPresent: true,
      sitemaps: parsed.sitemaps,
      globalBlock,
      crawlers,
    },
    issues,
    recommendations,
  };
}
