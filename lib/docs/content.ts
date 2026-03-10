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
    description: "The open specification for AI Search Optimization.",
    content: "specification",
  },
  "concepts/llms-txt": {
    title: "llms.txt",
    description: "The structured file that tells AI systems about your site.",
    content: "concepts/llms-txt",
  },
  "concepts/ai-metadata": {
    title: "AI Metadata",
    description: "Meta tags and HTTP headers for AI content discovery.",
    content: "concepts/ai-metadata",
  },
  "concepts/crawler-rules": {
    title: "Crawler Rules",
    description: "Per-bot allow/disallow rules for 16+ AI crawlers.",
    content: "concepts/crawler-rules",
  },
  "concepts/structured-signals": {
    title: "Structured Signals",
    description: "JSON-LD and Schema.org signals for AI search engines.",
    content: "concepts/structured-signals",
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
    title: "CLI",
    description: "The geo-ai-generate command-line tool.",
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
