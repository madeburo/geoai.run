import { H1, H2, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "format-preference", title: "Format preference", level: 2 },
  { id: "schema-types", title: "Schema types", level: 2 },
  { id: "website-example", title: "WebSite example", level: 2 },
  { id: "product-example", title: "Product example", level: 2 },
  { id: "article-example", title: "Article example", level: 2 },
  { id: "sitemap-fallback", title: "Sitemap fallback", level: 2 },
  { id: "analyzer-checks", title: "Analyzer checks", level: 2 },
  { id: "common-mistakes", title: "Common mistakes", level: 2 },
];

const content = (
  <article>
    <H1>Structured Signals Specification</H1>
    <Lead>
      Machine-readable markup embedded in your pages that tells AI search engines what your
      content is — its type, properties, and relationships — using a shared vocabulary from{" "}
      <IC>schema.org</IC>.
    </Lead>

    <H2 id="format-preference">Format preference</H2>
    <P>
      The Analyzer recognizes three structured data formats: JSON-LD, microdata, and RDFa.
      JSON-LD is the preferred format. It is injected as a{" "}
      <IC>{"<script type=\"application/ld+json\">"}</IC> block in the page <IC>{"<head>"}</IC> or{" "}
      <IC>{"<body>"}</IC> and does not require modifying existing HTML attributes.
    </P>
    <P>
      Microdata and RDFa are accepted alternatives. They embed structured data directly in HTML
      attributes (<IC>itemscope</IC>, <IC>itemtype</IC>, <IC>itemprop</IC> for microdata;{" "}
      <IC>typeof</IC>, <IC>property</IC>, <IC>vocab</IC> for RDFa). Both formats are detected by
      the Analyzer but produce a <IC>warn</IC> status rather than <IC>pass</IC> because JSON-LD
      is more reliably parsed by AI crawlers.
    </P>
    <Callout type="note" title="Why JSON-LD is preferred">
      JSON-LD is decoupled from your HTML structure. You can add, update, or remove it without
      touching the visible markup. It is also the format recommended by Google and supported by
      all major AI search engines.
    </Callout>

    <H2 id="schema-types">Schema types</H2>
    <P>
      GEO AI packages generate three primary <IC>schema.org</IC> types. The Analyzer detects any
      valid JSON-LD regardless of type, but these three cover the most common site categories.
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Type</TH>
          <TH>Use case</TH>
          <TH>Key fields</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>WebSite</TD>
          <TD>Any site — provides a site-level identity signal</TD>
          <TD mono>name, url, description, potentialAction</TD>
        </TR>
        <TR>
          <TD mono>Product</TD>
          <TD>E-commerce product pages</TD>
          <TD mono>name, description, offers, image, sku</TD>
        </TR>
        <TR>
          <TD mono>Article</TD>
          <TD>Blog posts, news articles, documentation</TD>
          <TD mono>headline, author, datePublished, publisher</TD>
        </TR>
      </TBody>
    </DocTable>
    <P>
      Other <IC>schema.org</IC> types — <IC>Organization</IC>, <IC>BreadcrumbList</IC>,{" "}
      <IC>FAQPage</IC>, and so on — are valid and detected by the Analyzer. Use whichever types
      best describe your content.
    </P>

    <H2 id="website-example">WebSite example</H2>
    <P>
      A <IC>WebSite</IC> block provides a site-level identity signal. Include it on every page,
      or at minimum on the homepage. The <IC>potentialAction</IC> field adds a sitelinks search
      box to Google results and helps AI engines understand that your site has a search feature.
    </P>
    <CodeBlock
      filename="index.html (JSON-LD)"
      language="html"
      code={`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Example Site",
  "url": "https://example.com",
  "description": "Example Site helps developers build faster with modern tooling.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://example.com/search?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
</script>`}
    />

    <H2 id="product-example">Product example</H2>
    <P>
      A <IC>Product</IC> block with an <IC>Offer</IC> object gives AI search engines the price,
      availability, and currency of a product. This enables AI engines to answer pricing
      questions and include your product in comparison results.
    </P>
    <CodeBlock
      filename="product-page.html (JSON-LD)"
      language="html"
      code={`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Widget Pro",
  "description": "Professional-grade widget for modern development teams.",
  "image": "https://example.com/images/widget-pro.jpg",
  "sku": "WGT-PRO-001",
  "brand": {
    "@type": "Brand",
    "name": "Example Site"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/widget-pro",
    "priceCurrency": "USD",
    "price": "29.99",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Example Site"
    }
  }
}
</script>`}
    />
    <Callout type="tip" title="Availability values">
      Use the full <IC>schema.org</IC> URL for availability:{" "}
      <IC>https://schema.org/InStock</IC>, <IC>https://schema.org/OutOfStock</IC>, or{" "}
      <IC>https://schema.org/PreOrder</IC>. Shorthand values like <IC>InStock</IC> are accepted
      by some parsers but not all.
    </Callout>

    <H2 id="article-example">Article example</H2>
    <P>
      An <IC>Article</IC> block with a <IC>publisher</IC> object helps AI engines attribute
      content correctly and include it in topic-based answers. The <IC>datePublished</IC> and{" "}
      <IC>dateModified</IC> fields help AI engines assess content freshness.
    </P>
    <CodeBlock
      filename="blog-post.html (JSON-LD)"
      language="html"
      code={`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Getting Started with Widget Pro",
  "description": "How to set up Widget Pro in a fresh project in five minutes.",
  "image": "https://example.com/images/getting-started.jpg",
  "datePublished": "2024-11-01T09:00:00Z",
  "dateModified": "2024-12-15T14:30:00Z",
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "url": "https://example.com/authors/jane-smith"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example Site",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/images/logo.png"
    }
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://example.com/blog/getting-started"
  }
}
</script>`}
    />

    <H2 id="sitemap-fallback">Sitemap fallback</H2>
    <P>
      When no structured data markup is present on the homepage, the Analyzer checks for a valid{" "}
      <IC>sitemap.xml</IC> at <IC>{"{origin}/sitemap.xml"}</IC>. A valid sitemap is an XML
      document containing a <IC>{"<urlset>"}</IC> or <IC>{"<sitemapindex>"}</IC> element served
      with an XML-compatible content type.
    </P>
    <P>
      A valid sitemap produces a <IC>warn</IC> status rather than <IC>fail</IC>. It signals that
      the site has a discoverable URL inventory, but it does not provide the semantic richness of
      structured data markup. The Analyzer will recommend adding JSON-LD in addition to the
      sitemap.
    </P>
    <Callout type="warning" title="Sitemap is a fallback, not a substitute">
      A sitemap tells AI crawlers which URLs exist. Structured data tells them what those URLs
      contain. Sites that rely only on a sitemap will score lower than sites with JSON-LD because
      AI engines have less context to work with when generating answers.
    </Callout>

    <H2 id="analyzer-checks">Analyzer checks</H2>
    <P>
      The <IC>checkStructuredSignals</IC> function scans the homepage HTML for structured data
      and fetches <IC>{"{origin}/sitemap.xml"}</IC> as a fallback signal:
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Condition</TH>
          <TH>Status</TH>
          <TH>Recommendation code</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>At least one valid JSON-LD block found</TD>
          <TD mono>pass</TD>
          <TD>—</TD>
        </TR>
        <TR>
          <TD>No JSON-LD, but microdata or RDFa attributes present</TD>
          <TD mono>warn</TD>
          <TD mono>ADD_JSONLD</TD>
        </TR>
        <TR>
          <TD>No structured data markup, but valid <IC>sitemap.xml</IC> found</TD>
          <TD mono>warn</TD>
          <TD mono>ADD_STRUCTURED_DATA</TD>
        </TR>
        <TR>
          <TD>No structured data and no valid <IC>sitemap.xml</IC></TD>
          <TD mono>fail</TD>
          <TD mono>ADD_STRUCTURED_DATA, ADD_SITEMAP</TD>
        </TR>
        <TR>
          <TD>JSON-LD blocks present but contain invalid JSON</TD>
          <TD mono>pass (with issues)</TD>
          <TD mono>FIX_INVALID_JSONLD</TD>
        </TR>
      </TBody>
    </DocTable>
    <P>
      Invalid JSON-LD blocks are counted separately. If at least one valid block exists alongside
      invalid ones, the status is still <IC>pass</IC>, but the <IC>FIX_INVALID_JSONLD</IC>{" "}
      recommendation is added to the report.
    </P>

    <H2 id="common-mistakes">Common mistakes</H2>
    <UL>
      <LI>
        <strong>Invalid JSON in the script block.</strong> A missing comma, trailing comma, or
        unescaped quote inside a JSON-LD block causes a parse error. The Analyzer counts the
        block as invalid and emits <IC>FIX_INVALID_JSONLD</IC>. Validate your JSON-LD with{" "}
        Google&apos;s Rich Results Test before deploying.
      </LI>
      <LI>
        <strong>Using microdata or RDFa instead of JSON-LD.</strong> Both formats are detected,
        but they produce a <IC>warn</IC> rather than <IC>pass</IC>. Migrating to JSON-LD is the
        fastest way to move from <IC>warn</IC> to <IC>pass</IC> on this category.
      </LI>
      <LI>
        <strong>Structured data only on inner pages, not the homepage.</strong> The Analyzer
        checks the homepage HTML. If your product or article JSON-LD is only on product and blog
        pages, the homepage check will return <IC>warn</IC> or <IC>fail</IC>. Add at least a{" "}
        <IC>WebSite</IC> block to the homepage.
      </LI>
      <LI>
        <strong>Injecting JSON-LD only via JavaScript.</strong> The Analyzer fetches raw HTML
        before client-side rendering. JSON-LD added by React, Vue, or other frameworks after
        hydration is not visible to the checker. Use server-side rendering or a{" "}
        <IC>{"<script>"}</IC> tag in the static HTML output.
      </LI>
      <LI>
        <strong>Mismatched <IC>@type</IC> and fields.</strong> Using a <IC>Product</IC> type
        without an <IC>offers</IC> field, or an <IC>Article</IC> type without a{" "}
        <IC>publisher</IC>, produces valid JSON-LD that passes the Analyzer but generates
        low-quality structured data. AI engines use these fields to answer specific questions —
        missing them reduces the value of the markup.
      </LI>
    </UL>
  </article>
);

export const SpecStructuredSignalsPage = { content, toc };
