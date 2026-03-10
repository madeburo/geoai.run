import { H1, H2, H3, Lead, P, IC, UL, LI } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "what-is-geo", title: "What is GEO?", level: 2 },
  { id: "the-four-pillars", title: "The four pillars", level: 2 },
  { id: "llms-txt", title: "llms.txt", level: 3 },
  { id: "ai-metadata", title: "AI metadata", level: 3 },
  { id: "crawler-rules", title: "Crawler rules", level: 3 },
  { id: "structured-signals", title: "Structured signals", level: 3 },
  { id: "how-ai-crawlers-work", title: "How AI crawlers work", level: 2 },
];

const content = (
  <article>
    <H1>GEO Specification</H1>
    <Lead>
      The open specification for AI Search Optimization — what it is, why it matters, and how the
      four pillars work together.
    </Lead>

    <H2 id="what-is-geo">What is GEO?</H2>
    <P>
      GEO stands for <strong>Generative Engine Optimization</strong>. Traditional SEO targets
      keyword-based search engines like Google. AI search engines — ChatGPT, Claude, Gemini,
      Perplexity, Grok — work differently. They read structured content, not meta keywords.
    </P>
    <P>
      GEO AI provides the infrastructure to make your site readable and discoverable by these
      engines. It does this through four complementary mechanisms.
    </P>

    <Callout type="note" title="Why this matters now">
      AI search engines are increasingly the first point of contact between users and information.
      Sites that aren&apos;t structured for AI crawlers are invisible to a growing share of search
      traffic.
    </Callout>

    <H2 id="the-four-pillars">The four pillars</H2>

    <H3 id="llms-txt">1. llms.txt</H3>
    <P>
      A plain-text file at <IC>/llms.txt</IC> that gives AI crawlers a structured index of your
      site. Think of it as a sitemap for LLMs — it lists your pages, products, and content with
      titles, URLs, and short descriptions.
    </P>
    <P>
      <IC>/llms-full.txt</IC> is the extended version — it includes full content, pricing,
      availability, and variants for deep indexing.
    </P>
    <CodeBlock
      filename="/llms.txt (example)"
      code={`# My Site

> A short description of what this site is about.

## Pages

- [Home](https://example.com/): Welcome page
- [About](https://example.com/about): About us

## Products

- [Widget Pro](https://example.com/products/widget-pro): Our flagship widget — $29.99`}
    />

    <H3 id="ai-metadata">2. AI metadata</H3>
    <P>
      Meta tags and HTTP headers that tell AI crawlers where to find your llms.txt files. These go
      in your page <IC>&lt;head&gt;</IC>:
    </P>
    <CodeBlock
      language="html"
      code={`<meta name="llms" content="https://example.com/llms.txt" />
<meta name="llms-full" content="https://example.com/llms-full.txt" />
<meta name="ai-description" content="A concise summary for LLMs" />`}
    />
    <P>
      The HTTP <IC>Link</IC> header provides the same discovery signal for crawlers that don&apos;t
      parse HTML:
    </P>
    <CodeBlock
      language="http"
      code={`Link: <https://example.com/llms.txt>; rel="ai-content-index"`}
    />

    <H3 id="crawler-rules">3. Crawler rules</H3>
    <P>
      Per-bot allow/disallow rules for 16+ AI crawlers. GEO AI generates the correct{" "}
      <IC>robots.txt</IC> directives for each bot — GPTBot, ClaudeBot, Google-Extended,
      PerplexityBot, and more.
    </P>
    <CodeBlock
      filename="robots.txt (generated block)"
      code={`User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /`}
    />

    <H3 id="structured-signals">4. Structured signals</H3>
    <P>
      JSON-LD Schema.org markup that AI search engines use to understand your content type,
      relationships, and attributes. GEO AI generates <IC>WebSite</IC>, <IC>Product</IC>, and{" "}
      <IC>Article</IC> schemas automatically.
    </P>
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

    <H2 id="how-ai-crawlers-work">How AI crawlers work</H2>
    <P>
      AI crawlers like GPTBot and ClaudeBot follow a predictable discovery sequence:
    </P>
    <UL>
      <LI>Check <IC>robots.txt</IC> for allow/disallow rules</LI>
      <LI>
        Look for <IC>&lt;meta name=&quot;llms&quot;&gt;</IC> or <IC>Link</IC> header to find{" "}
        <IC>llms.txt</IC>
      </LI>
      <LI>
        Fetch <IC>/llms.txt</IC> for a structured content index
      </LI>
      <LI>
        Fetch <IC>/llms-full.txt</IC> when deeper content is needed (e.g. product details for a
        shopping query)
      </LI>
      <LI>Parse JSON-LD for structured entity data</LI>
    </UL>
    <P>
      GEO AI handles all four steps. Each pillar reinforces the others — a site with all four
      implemented scores significantly higher in the Analyzer than one with only partial coverage.
    </P>
  </article>
);

export const SpecificationPage = { content, toc };
