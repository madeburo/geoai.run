import { H1, H2, H3, Lead, P, IC, UL, LI } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "json-ld", title: "JSON-LD schemas", level: 2 },
  { id: "website", title: "WebSite", level: 3 },
  { id: "product", title: "Product", level: 3 },
  { id: "article", title: "Article", level: 3 },
  { id: "generating", title: "Generating with GEO AI", level: 2 },
];

const content = (
  <article>
    <H1>Structured Signals</H1>
    <Lead>
      JSON-LD Schema.org markup that AI search engines use to understand your content type,
      relationships, and attributes.
    </Lead>

    <H2 id="json-ld">JSON-LD schemas</H2>
    <P>
      GEO AI generates three Schema.org types depending on your content. These are injected as{" "}
      <IC>&lt;script type=&quot;application/ld+json&quot;&gt;</IC> tags in your page{" "}
      <IC>&lt;head&gt;</IC>.
    </P>

    <H3 id="website">WebSite</H3>
    <P>Generated for every page — provides site-level context:</P>
    <CodeBlock
      language="json"
      code={`{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "My Site",
  "url": "https://example.com",
  "description": "A short description of the site"
}`}
    />

    <H3 id="product">Product</H3>
    <P>Generated for product resources — includes pricing and availability:</P>
    <CodeBlock
      language="json"
      code={`{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Widget Pro",
  "url": "https://example.com/products/widget-pro",
  "description": "Our flagship widget",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}`}
    />

    <H3 id="article">Article</H3>
    <P>Generated for blog posts and editorial content:</P>
    <CodeBlock
      language="json"
      code={`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Getting Started with Widgets",
  "url": "https://example.com/blog/getting-started",
  "description": "A beginner's guide to widgets",
  "publisher": {
    "@type": "Organization",
    "name": "My Site",
    "url": "https://example.com"
  }
}`}
    />

    <H2 id="generating">Generating with GEO AI</H2>
    <CodeBlock
      language="typescript"
      code={`import { createGeoAI } from 'geo-ai-core';

const geo = createGeoAI({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: { /* ... */ },
});

// Returns a JSON-LD object (or array of objects)
const jsonLd = geo.generateJsonLd();

// In Next.js layout.tsx:
// <script
//   type="application/ld+json"
//   dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
// />`}
    />

    <P>
      The schema type is determined by the <IC>type</IC> field on each section in your{" "}
      <IC>ContentProvider</IC>:
    </P>
    <UL>
      <LI>
        <IC>type: &apos;product&apos;</IC> → <IC>Product</IC> schema with offers
      </LI>
      <LI>
        <IC>type: &apos;article&apos;</IC> → <IC>Article</IC> schema with publisher
      </LI>
      <LI>
        <IC>type: &apos;page&apos;</IC> → <IC>WebPage</IC> schema
      </LI>
    </UL>
  </article>
);

export const StructuredSignalsPage = { content, toc };
