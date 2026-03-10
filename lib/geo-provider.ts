import { type ContentProvider } from "geo-ai-core";

export class GeoAIRunProvider implements ContentProvider {
  async getSections() {
    return [
      {
        name: "Products",
        type: "product" as const,
        resources: [
          {
            title: "GEO AI Core",
            url: "https://www.geoai.run/core",
            description:
              "Universal TypeScript engine for AI search optimization — generate llms.txt, crawler rules, and AI metadata for any Node.js project",
            keywords: "typescript, node.js, llms.txt, ai optimization, npm package",
            content:
              "GEO AI Core is the foundation library powering all GEO AI integrations. It generates llms.txt and llms-full.txt files, robots.txt AI crawler directives, and semantic meta tags. Install via npm: npm install geo-ai-core. Supports static content providers and dynamic ContentProvider interface for custom data sources.",
          },
          {
            title: "GEO AI Next",
            url: "https://www.geoai.run/next",
            description:
              "Next.js middleware and App Router route handler for GEO AI — serve llms.txt and llms-full.txt with zero config",
            keywords: "next.js, middleware, app router, llms.txt, server components",
            content:
              "GEO AI Next wraps GEO AI Core for Next.js 13+ App Router. Provides createLlmsHandler() for route handlers and geoAIMiddleware() for edge middleware. Automatically serves /llms.txt and /llms-full.txt with configurable cache headers. Install via npm: npm install geo-ai-next.",
          },
          {
            title: "GEO AI Woo",
            url: "https://www.geoai.run/woo",
            description:
              "WordPress and WooCommerce plugin for AI search optimization — auto-generates llms.txt and AI metadata from your store",
            keywords: "wordpress, woocommerce, plugin, llms.txt, ai seo",
            content:
              "GEO AI Woo is a WordPress plugin that automatically generates llms.txt, configures AI crawler rules in robots.txt, and injects AI-optimized meta tags. Works with WooCommerce product catalogs to expose structured product data to AI search engines like ChatGPT, Perplexity, and Claude.",
          },
          {
            title: "GEO AI Shopify",
            url: "https://www.geoai.run/shopify",
            description:
              "Shopify app for AI search visibility — generate llms.txt and AI metadata directly from your Shopify store",
            keywords: "shopify, ecommerce, llms.txt, ai visibility, app",
            content:
              "GEO AI Shopify integrates directly with the Shopify Admin API to generate llms.txt files from your product catalog, collections, and pages. Automatically keeps AI context files in sync as your store changes. Helps your Shopify store appear in AI-powered shopping recommendations.",
          },
        ],
      },
      {
        name: "Tools",
        type: "page" as const,
        resources: [
          {
            title: "GEO Analyzer",
            url: "https://www.geoai.run/analyze",
            description:
              "Free tool to check your site's AI search visibility — analyzes llms.txt, crawler rules, metadata, and structured signals",
            keywords: "analyzer, ai readiness, score, audit, free tool",
            content:
              "The GEO Analyzer checks four dimensions of AI search readiness: presence and quality of llms.txt, AI metadata tags (title, description, og:title, og:description), crawler rules for AI bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.), and structured signals (JSON-LD schema). Returns a 0–100 readiness score with per-category status and actionable recommendations.",
          },
        ],
      },
      {
        name: "Documentation",
        type: "page" as const,
        resources: [
          {
            title: "Getting Started",
            url: "https://github.com/madeburo/GEO-AI/blob/main/README.md",
            description:
              "Installation guide and quick-start examples for GEO AI Core and Next.js integration",
            keywords: "documentation, getting started, installation, quickstart",
            content:
              "Step-by-step guide to integrating GEO AI into your project. Covers npm installation, configuring the ContentProvider, setting up the Next.js route handler, and verifying your llms.txt output. Includes code examples for static and dynamic content providers.",
          },
          {
            title: "GEO Specification",
            url: "https://github.com/madeburo/GEO-AI/blob/main/SPEC.md",
            description:
              "The GEO specification — structured signals that make websites visible to AI search engines",
            keywords: "specification, geo spec, llms.txt format, ai signals, standard",
            content:
              "The GEO specification defines the full set of structured signals for AI search optimization: llms.txt file format and schema, AI crawler directives in robots.txt, required and recommended HTML meta tags, and JSON-LD structured data patterns. Reference this spec when implementing GEO AI in custom environments.",
          },
        ],
      },
    ];
  }
}
