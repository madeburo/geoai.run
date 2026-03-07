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
            url: "/core",
            description:
              "Universal TypeScript engine for AI search optimization",
          },
          {
            title: "GEO AI Next",
            url: "/next",
            description:
              "Next.js middleware & route handler for GEO AI",
          },
          {
            title: "GEO AI Woo",
            url: "/woo",
            description:
              "WordPress & WooCommerce plugin for AI search optimization",
          },
          {
            title: "GEO AI Shopify",
            url: "/shopify",
            description: "Shopify app for AI search optimization",
          },
        ],
      },
      {
        name: "Tools",
        type: "page" as const,
        resources: [
          {
            title: "GEO Analyzer",
            url: "/analyze",
            description:
              "Free tool to check your site's AI search visibility",
          },
        ],
      },
      // TODO: Add blog section when posts are available
    ];
  }
}
