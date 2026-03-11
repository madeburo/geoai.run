export interface DocPage {
  title: string;
  description?: string;
  content: string;
}

export type DocSlug = string[];

// Map slug arrays to doc page data
export function getDocPage(slug: DocSlug): DocPage | null {
  const key = slug.join("/");
  return DOC_PAGES[key] ?? null;
}

export function getDocPageByKey(key: string): DocPage | null {
  return DOC_PAGES[key] ?? null;
}

export const DOC_PAGES: Record<string, DocPage> = {
  "": {
    title: "GEO AI Documentation",
    description: "Everything you need to make your site visible to AI search engines.",
    content: "index",
  },
  "getting-started": {
    title: "Quick Start",
    description: "Get GEO AI running in your project in under 5 minutes.",
    content: "getting-started",
  },
  "getting-started/choose": {
    title: "Choose Your Package",
    description: "Pick the right GEO AI package for your stack.",
    content: "getting-started/choose",
  },
  "specification": {
    title: "GEO Specification",
    description: "The canonical implementation model for AI Search Optimization.",
    content: "specification",
  },
  "specification/llms-txt": {
    title: "llms.txt Specification",
    description: "File location, format, required fields, and Analyzer checks for llms.txt.",
    content: "specification/llms-txt",
  },
  "specification/ai-metadata": {
    title: "AI Metadata Specification",
    description: "Critical and non-critical metadata fields, selectors, and Analyzer checks.",
    content: "specification/ai-metadata",
  },
  "specification/crawler-rules": {
    title: "Crawler Rules Specification",
    description: "AI crawler user-agents, robots.txt directives, and Analyzer checks.",
    content: "specification/crawler-rules",
  },
  "specification/structured-signals": {
    title: "Structured Signals Specification",
    description: "JSON-LD schema types, required fields, and Analyzer checks.",
    content: "specification/structured-signals",
  },
  "specification/scoring": {
    title: "Scoring Specification",
    description: "CheckStatus weights, category contributions, and score formula.",
    content: "specification/scoring",
  },
  "specification/recommendations": {
    title: "Recommendations Specification",
    description: "Recommendation codes, categories, and prioritization guidance.",
    content: "specification/recommendations",
  },
  "packages/core": {
    title: "GEO AI Core",
    description: "Universal TypeScript engine for AI Search Optimization.",
    content: "packages/core",
  },
  "packages/next": {
    title: "GEO AI Next",
    description: "Next.js integration — static generation, middleware, route handler.",
    content: "packages/next",
  },
  "packages/woo": {
    title: "GEO AI Woo",
    description: "WordPress & WooCommerce plugin for AI Search Optimization.",
    content: "packages/woo",
  },
  "packages/shopify": {
    title: "GEO AI Shopify",
    description: "Shopify app for AI Search Optimization.",
    content: "packages/shopify",
  },
  "analyzer": {
    title: "Analyzer",
    description: "Check your site's AI search visibility score.",
    content: "analyzer",
  },
  "analyzer/scoring": {
    title: "Scoring",
    description: "How the GEO AI analyzer scores your site.",
    content: "analyzer/scoring",
  },
  "analyzer/recommendations": {
    title: "Recommendations",
    description: "Actionable fixes from the GEO AI analyzer.",
    content: "analyzer/recommendations",
  },
  "integrations/cli": {
    title: "GEO AI CLI",
    description: "Generate and validate llms.txt / llms-full.txt from the command line. Works with any Node.js project.",
    content: "integrations/cli",
  },
  "integrations/nestjs": {
    title: "NestJS",
    description: "NestJS integration for GEO AI — coming soon.",
    content: "integrations/nestjs",
  },
  "integrations/laravel": {
    title: "Laravel",
    description: "Laravel integration for GEO AI — coming soon.",
    content: "integrations/laravel",
  },
  "reference/configuration": {
    title: "Configuration Reference",
    description: "Full GeoAIConfig options reference.",
    content: "reference/configuration",
  },
  "reference/api": {
    title: "API Reference",
    description: "Full API reference for geo-ai-core and geo-ai-next.",
    content: "reference/api",
  },
  "faq": {
    title: "FAQ",
    description: "Frequently asked questions about GEO AI.",
    content: "faq",
  },
};
