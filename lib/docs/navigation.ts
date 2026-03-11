export interface DocNavItem {
  title: string;
  href: string;
  badge?: "new" | "soon";
  items?: DocNavItem[];
}

export interface DocNavSection {
  title: string;
  items: DocNavItem[];
}

export const docsNavigation: DocNavSection[] = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Quick Start", href: "/docs/getting-started" },
      { title: "Choose Your Package", href: "/docs/getting-started/choose" },
    ],
  },
  {
    title: "GEO Specification",
    items: [
      { title: "Overview", href: "/docs/specification" },
      { title: "llms.txt", href: "/docs/specification/llms-txt" },
      { title: "AI Metadata", href: "/docs/specification/ai-metadata" },
      { title: "Crawler Rules", href: "/docs/specification/crawler-rules" },
      { title: "Structured Signals", href: "/docs/specification/structured-signals" },
      { title: "Scoring", href: "/docs/specification/scoring" },
      { title: "Recommendations", href: "/docs/specification/recommendations" },
    ],
  },
  {
    title: "Packages",
    items: [
      { title: "GEO AI Core", href: "/docs/packages/core" },
      { title: "GEO AI Next", href: "/docs/packages/next" },
      { title: "GEO AI Woo", href: "/docs/packages/woo" },
      { title: "GEO AI Shopify", href: "/docs/packages/shopify" },
    ],
  },
  {
    title: "Analyzer",
    items: [
      { title: "Overview", href: "/docs/analyzer" },
      { title: "Scoring", href: "/docs/analyzer/scoring" },
      { title: "Recommendations", href: "/docs/analyzer/recommendations" },
    ],
  },
  {
    title: "CLI",
    items: [
      { title: "GEO AI CLI", href: "/docs/integrations/cli" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { title: "NestJS", href: "/docs/integrations/nestjs", badge: "soon" },
      { title: "Laravel", href: "/docs/integrations/laravel", badge: "soon" },
    ],
  },
  {
    title: "Reference",
    items: [
      { title: "Configuration", href: "/docs/reference/configuration" },
      { title: "API Reference", href: "/docs/reference/api" },
      { title: "FAQ", href: "/docs/faq" },
    ],
  },
];

export function flattenNav(sections: DocNavSection[]): DocNavItem[] {
  return sections.flatMap((s) =>
    s.items.flatMap((item) => [item, ...(item.items ?? [])])
  );
}

export function getPrevNext(href: string): {
  prev: DocNavItem | null;
  next: DocNavItem | null;
} {
  const flat = flattenNav(docsNavigation);
  const idx = flat.findIndex((item) => item.href === href);
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
}
