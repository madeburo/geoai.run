import { H1, H2, Lead, P, IC, UL, LI } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "what-is-geo-specification", title: "What is GEO Specification?", level: 2 },
  { id: "four-layers", title: "The four implementation layers", level: 2 },
  { id: "packages", title: "GEO AI packages", level: 2 },
  { id: "analyzer-compliance", title: "Analyzer compliance", level: 2 },
  { id: "geo-ready", title: "What GEO-ready means", level: 2 },
];

const content = (
  <article>
    <H1>GEO Specification</H1>
    <Lead>
      The canonical implementation model for AI Search Optimization — defining the four layers
      every site must implement to be discoverable by AI search engines.
    </Lead>

    <H2 id="what-is-geo-specification">What is GEO Specification?</H2>
    <P>
      GEO Specification is the formal definition of what it means to optimize a site for AI search
      engines. It describes the four implementation layers, the exact signals each layer produces,
      and the criteria the Analyzer uses to evaluate compliance.
    </P>
    <P>
      Unlike traditional SEO, which targets keyword ranking algorithms, AI Search Optimization
      targets the ingestion pipelines of large language models. AI crawlers — GPTBot, ClaudeBot,
      PerplexityBot, Google-Extended, and others — read structured content, not keyword density.
      GEO Specification defines the structure those crawlers expect.
    </P>
    <Callout type="note" title="Scope">
      This specification covers the four layers implemented by GEO AI packages and evaluated by
      the GEO AI Analyzer. It does not cover general SEO practices or platform-specific
      configuration beyond what the packages generate.
    </Callout>

    <H2 id="four-layers">The four implementation layers</H2>
    <P>
      GEO Specification defines four complementary layers. Each layer targets a different signal
      that AI crawlers use during content discovery and ingestion.
    </P>
    <UL>
      <LI>
        <strong>llms.txt</strong> — A plain-text file at <IC>/llms.txt</IC> that provides AI
        crawlers with a structured index of your site: page titles, URLs, and short descriptions
        in a Markdown format designed for LLM consumption. An extended form at{" "}
        <IC>/llms-full.txt</IC> includes full content for deep indexing.
      </LI>
      <LI>
        <strong>AI metadata</strong> — HTML <IC>&lt;meta&gt;</IC> tags in the page{" "}
        <IC>&lt;head&gt;</IC> that provide critical signals: title, description, Open Graph
        properties, and Twitter card fields. Four fields are critical; nine are supplemental.
      </LI>
      <LI>
        <strong>Crawler rules</strong> — <IC>robots.txt</IC> directives that explicitly allow the
        ten AI crawlers tracked by the Analyzer. Without explicit allow rules, some crawlers treat
        unspecified access as blocked.
      </LI>
      <LI>
        <strong>Structured signals</strong> — JSON-LD Schema.org markup embedded in page HTML.
        The Analyzer recognizes <IC>WebSite</IC>, <IC>Product</IC>, and <IC>Article</IC> types.
        Microdata and RDFa are accepted alternatives; a valid <IC>sitemap.xml</IC> serves as a
        fallback signal.
      </LI>
    </UL>
    <P>
      Each layer is evaluated independently by the Analyzer and contributes equally (25%) to the
      overall AI readiness score. Implementing all four layers is required to achieve a passing
      score.
    </P>

    <H2 id="packages">GEO AI packages</H2>
    <P>
      GEO AI provides four packages that implement the specification for different platforms and
      runtimes:
    </P>
    <UL>
      <LI>
        <strong>@geo-ai/core</strong> — Framework-agnostic Node.js package. Generates{" "}
        <IC>llms.txt</IC>, <IC>llms-full.txt</IC>, AI metadata tags, <IC>robots.txt</IC> crawler
        rules, and JSON-LD structured data from a configuration object.
      </LI>
      <LI>
        <strong>@geo-ai/next</strong> — Next.js App Router integration. Exports route handlers
        for <IC>/llms.txt</IC> and <IC>/llms-full.txt</IC>, metadata helpers for{" "}
        <IC>generateMetadata()</IC>, and JSON-LD script components.
      </LI>
      <LI>
        <strong>@geo-ai/woo</strong> — WordPress WooCommerce plugin. Generates all four layers
        from WooCommerce product and page data with zero configuration.
      </LI>
      <LI>
        <strong>@geo-ai/shopify</strong> — Shopify app. Injects all four layers into Shopify
        storefronts using the Shopify App Bridge and theme extension APIs.
      </LI>
    </UL>
    <P>
      All four packages produce output that conforms to this specification. The Analyzer evaluates
      any site regardless of which package — or no package — was used to implement the layers.
    </P>

    <H2 id="analyzer-compliance">Analyzer compliance</H2>
    <P>
      The GEO AI Analyzer evaluates a live URL against all four layers of the specification. For
      each layer it runs a dedicated checker:
    </P>
    <UL>
      <LI>
        <IC>checkLlmsTxt</IC> — fetches <IC>/llms.txt</IC> and evaluates HTTP status, content
        type, body length, and content quality.
      </LI>
      <LI>
        <IC>checkMetadata</IC> — parses the page <IC>&lt;head&gt;</IC> and evaluates the presence
        of the four critical and nine supplemental metadata fields.
      </LI>
      <LI>
        <IC>checkCrawlerRules</IC> — fetches <IC>/robots.txt</IC> and evaluates allow/disallow
        directives for all ten tracked AI crawlers.
      </LI>
      <LI>
        <IC>checkStructuredSignals</IC> — parses the page HTML for JSON-LD blocks, microdata,
        RDFa, and falls back to checking for a valid <IC>sitemap.xml</IC>.
      </LI>
    </UL>
    <P>
      Each checker returns a <IC>CheckStatus</IC> value (<IC>pass</IC>, <IC>warn</IC>,{" "}
      <IC>fail</IC>, <IC>not_found</IC>, or <IC>unknown</IC>) and a set of actionable
      recommendations. The Analyzer aggregates these into an <IC>AIReadinessReport</IC> with an
      overall score from 0 to 100.
    </P>
    <Callout type="tip" title="Reading the spec pages">
      Each layer has a dedicated specification page that documents the exact pass/warn/fail
      conditions the corresponding checker evaluates. Use those pages as the authoritative
      reference when interpreting Analyzer output.
    </Callout>

    <H2 id="geo-ready">What GEO-ready means</H2>
    <P>
      A site is considered GEO-ready when all four implementation layers are present and each
      checker returns a <IC>pass</IC> status. In practice this means:
    </P>
    <UL>
      <LI>
        <IC>/llms.txt</IC> returns HTTP 200 with <IC>text/plain</IC> content type, a body of at
        least 100 characters, and informative content.
      </LI>
      <LI>
        All four critical metadata fields are present: <IC>&lt;title&gt;</IC>,{" "}
        <IC>meta[name=&quot;description&quot;]</IC>, <IC>meta[property=&quot;og:title&quot;]</IC>,
        and <IC>meta[property=&quot;og:description&quot;]</IC>.
      </LI>
      <LI>
        <IC>/robots.txt</IC> is present, contains no global <IC>Disallow: /</IC> rule, and does
        not block the majority of the ten tracked AI crawlers.
      </LI>
      <LI>
        At least one valid JSON-LD block is present in the page HTML.
      </LI>
    </UL>
    <P>
      A GEO-ready site scores 90 or above in the Analyzer (Excellent grade). Sites that implement
      all four layers but have minor issues — such as thin llms.txt content or missing
      supplemental metadata — typically score in the 75–89 range (Good grade).
    </P>
    <Callout type="success" title="GEO-ready checklist">
      Use the Analyzer at <IC>geoai.run/analyze</IC> to check your site against all four layers
      and get specific recommendations for any gaps.
    </Callout>
  </article>
);

export const SpecificationOverviewPage = { content, toc };
