import { describe, it, expect } from "vitest";
import { DOC_PAGES, getDocPage } from "@/lib/docs/content";
import { docsNavigation, getPrevNext, flattenNav } from "@/lib/docs/navigation";
import { renderDocPage } from "@/components/docs/pages";

// ─── Constants ────────────────────────────────────────────────────────────────

const SPEC_SLUGS = [
  "specification",
  "specification/llms-txt",
  "specification/ai-metadata",
  "specification/crawler-rules",
  "specification/structured-signals",
  "specification/scoring",
  "specification/recommendations",
] as const;

const LEGACY_CONCEPT_SLUGS = [
  "concepts/llms-txt",
  "concepts/ai-metadata",
  "concepts/crawler-rules",
  "concepts/structured-signals",
] as const;

const EXPECTED_SPEC_NAV_ORDER = [
  { title: "Overview", href: "/docs/specification" },
  { title: "llms.txt", href: "/docs/specification/llms-txt" },
  { title: "AI Metadata", href: "/docs/specification/ai-metadata" },
  { title: "Crawler Rules", href: "/docs/specification/crawler-rules" },
  { title: "Structured Signals", href: "/docs/specification/structured-signals" },
  { title: "Scoring", href: "/docs/specification/scoring" },
  { title: "Recommendations", href: "/docs/specification/recommendations" },
];

// ─── Registry completeness ────────────────────────────────────────────────────

describe("Registry completeness", () => {
  it.each(SPEC_SLUGS)("DOC_PAGES has a non-null entry for '%s'", (slug) => {
    const page = DOC_PAGES[slug];
    expect(page).toBeDefined();
    expect(page.title).toBeTruthy();
    expect(page.description).toBeTruthy();
    expect(page.content).toBeTruthy();
  });
});

// ─── Registry migration ───────────────────────────────────────────────────────

describe("Registry migration — legacy concepts slugs removed", () => {
  it.each(LEGACY_CONCEPT_SLUGS)("DOC_PAGES does NOT contain '%s'", (slug) => {
    expect(DOC_PAGES[slug]).toBeUndefined();
  });
});

// ─── Page map completeness ────────────────────────────────────────────────────

describe("Page map completeness", () => {
  it.each(SPEC_SLUGS)("PAGE_MAP has non-null content and non-empty toc for '%s'", (slug) => {
    const page = DOC_PAGES[slug];
    expect(page).toBeDefined();
    const { content, toc } = renderDocPage(page.content);
    expect(content).not.toBeNull();
    expect(toc.length).toBeGreaterThan(0);
  });
});

// ─── Static params ────────────────────────────────────────────────────────────

describe("generateStaticParams", () => {
  it("includes all seven specification slugs", () => {
    // Replicate the logic from app/docs/[...slug]/page.tsx
    const params = Object.keys(DOC_PAGES)
      .filter((key) => key !== "")
      .map((key) => ({ slug: key.split("/") }));

    const paramStrings = params.map((p) => p.slug.join("/"));

    for (const slug of SPEC_SLUGS) {
      expect(paramStrings).toContain(slug);
    }
  });
});

// ─── Navigation shape ─────────────────────────────────────────────────────────

describe("Navigation shape", () => {
  it("has exactly one 'GEO Specification' section", () => {
    const sections = docsNavigation.filter((s) => s.title === "GEO Specification");
    expect(sections).toHaveLength(1);
  });

  it("'GEO Specification' section is positioned between 'Getting Started' and 'Packages'", () => {
    const titles = docsNavigation.map((s) => s.title);
    const gettingStartedIdx = titles.indexOf("Getting Started");
    const specIdx = titles.indexOf("GEO Specification");
    const packagesIdx = titles.indexOf("Packages");

    expect(gettingStartedIdx).toBeGreaterThanOrEqual(0);
    expect(specIdx).toBeGreaterThanOrEqual(0);
    expect(packagesIdx).toBeGreaterThanOrEqual(0);
    expect(specIdx).toBeGreaterThan(gettingStartedIdx);
    expect(specIdx).toBeLessThan(packagesIdx);
  });

  it("'GEO Specification' section contains exactly seven items in correct order", () => {
    const section = docsNavigation.find((s) => s.title === "GEO Specification");
    expect(section).toBeDefined();
    expect(section!.items).toHaveLength(7);

    section!.items.forEach((item, i) => {
      expect(item.title).toBe(EXPECTED_SPEC_NAV_ORDER[i].title);
      expect(item.href).toBe(EXPECTED_SPEC_NAV_ORDER[i].href);
    });
  });
});

// ─── No concepts hrefs ────────────────────────────────────────────────────────

describe("No legacy /docs/concepts/* hrefs in navigation", () => {
  it("no flattened nav item has an href starting with /docs/concepts/", () => {
    const flat = flattenNav(docsNavigation);
    const conceptItems = flat.filter((item) => item.href.startsWith("/docs/concepts/"));
    expect(conceptItems).toHaveLength(0);
  });
});

// ─── Prev/next boundaries ─────────────────────────────────────────────────────

describe("Prev/next boundaries", () => {
  it("specification overview: next points to /docs/specification/llms-txt", () => {
    const { next } = getPrevNext("/docs/specification");
    expect(next).not.toBeNull();
    expect(next!.href).toBe("/docs/specification/llms-txt");
  });

  it("specification overview: prev points to the last Getting Started item", () => {
    // The flat nav has Getting Started items before the spec section,
    // so prev is the last Getting Started item, not null.
    const { prev } = getPrevNext("/docs/specification");
    expect(prev).not.toBeNull();
    expect(prev!.href).toBe("/docs/getting-started/choose");
  });

  it("specification/recommendations: prev points to /docs/specification/scoring", () => {
    const { prev } = getPrevNext("/docs/specification/recommendations");
    expect(prev).not.toBeNull();
    expect(prev!.href).toBe("/docs/specification/scoring");
  });

  it("specification/recommendations: next points to /docs/packages/core", () => {
    const { next } = getPrevNext("/docs/specification/recommendations");
    expect(next).not.toBeNull();
    expect(next!.href).toBe("/docs/packages/core");
  });
});
