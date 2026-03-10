import { H1, H2, H3, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "installation", title: "Installation", level: 2 },
  { id: "quick-start", title: "Quick start", level: 2 },
  { id: "content-provider", title: "ContentProvider", level: 2 },
  { id: "caching", title: "Caching", level: 2 },
  { id: "crawl-tracking", title: "Crawl tracking", level: 2 },
  { id: "ai-descriptions", title: "AI descriptions", level: 2 },
  { id: "entry-points", title: "Entry points", level: 2 },
  { id: "requirements", title: "Requirements", level: 2 },
];

const content = (
  <article>
    <H1>GEO AI Core</H1>
    <Lead>
      Universal TypeScript engine for AI Search Optimization. Zero dependencies. Works with any
      Node.js 20+ framework.
    </Lead>

    <div className="my-6 flex flex-wrap gap-2">
      <a
        href="https://npmjs.com/package/geo-ai-core"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-mono text-muted-foreground transition-colors hover:text-foreground"
      >
        npm install geo-ai-core
      </a>
      <a
        href="https://github.com/madeburo/GEO-AI"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
      >
        GitHub ↗
      </a>
    </div>

    <H2 id="installation">Installation</H2>
    <CodeBlock language="bash" code={`npm install geo-ai-core`} />

    <H2 id="quick-start">Quick start</H2>
    <CodeBlock
      language="typescript"
      code={`import { createGeoAI } from 'geo-ai-core';

const geo = createGeoAI({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: {
    Pages: [
      { title: 'Home', url: '/', description: 'Welcome' },
      { title: 'About', url: '/about', description: 'About us' },
    ],
    Products: [
      {
        title: 'Widget Pro',
        url: '/products/widget-pro',
        description: 'Our flagship widget',
        price: '$29.99',
        available: true,
      },
    ],
  },
  crawlers: 'all',
});

// Generate llms.txt / llms-full.txt
const llmsTxt = await geo.generateLlms(false);
const llmsFullTxt = await geo.generateLlms(true);

// robots.txt block
const robotsTxt = geo.generateRobotsTxt();

// SEO signals
const metaTags = geo.generateMetaTags();
const linkHeader = geo.generateLinkHeader();
const jsonLd = geo.generateJsonLd();`}
    />

    <H2 id="content-provider">ContentProvider</H2>
    <P>
      For dynamic data sources, implement the <IC>ContentProvider</IC> interface. The{" "}
      <IC>getSections()</IC> method is called each time GEO AI generates content.
    </P>
    <CodeBlock
      language="typescript"
      code={`import { createGeoAI, type ContentProvider, type Section } from 'geo-ai-core';

class StrapiProvider implements ContentProvider {
  async getSections(options?: { locale?: string }): Promise<Section[]> {
    const products = await fetchProducts(options?.locale);
    const posts = await fetchPosts(options?.locale);

    return [
      {
        name: 'Products',
        type: 'product',
        resources: products.map((p) => ({
          title: p.name,
          url: p.slug,
          description: p.summary,
          price: p.price,
          available: p.inStock,
        })),
      },
      {
        name: 'Blog',
        type: 'article',
        resources: posts.map((p) => ({
          title: p.title,
          url: p.slug,
          description: p.excerpt,
          content: p.body,
        })),
      },
    ];
  }
}

const geo = createGeoAI({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: new StrapiProvider(),
  cache: '24h',
  crawlTracking: true,
});`}
    />

    <H2 id="caching">Caching</H2>
    <P>
      GEO AI supports pluggable caching via the <IC>CacheAdapter</IC> interface. Two built-in
      adapters are included:
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Adapter</TH>
          <TH>Description</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>MemoryCacheAdapter</TD>
          <TD>In-memory with TTL and automatic eviction. Default 1,000 max entries.</TD>
        </TR>
        <TR>
          <TD mono>FileCacheAdapter</TD>
          <TD>File-based with JSON metadata. Good for build-time caching.</TD>
        </TR>
      </TBody>
    </DocTable>
    <P>
      Pass a duration string as a shorthand — GEO AI creates a <IC>MemoryCacheAdapter</IC>{" "}
      automatically:
    </P>
    <CodeBlock
      language="typescript"
      code={`// Shorthand duration strings
cache: '1h'   // 1 hour
cache: '24h'  // 24 hours
cache: '7d'   // 7 days

// Or pass a custom adapter
import { FileCacheAdapter } from 'geo-ai-core';
cache: new FileCacheAdapter({ dir: '.cache/geo-ai' })`}
    />

    <H2 id="crawl-tracking">Crawl tracking</H2>
    <P>
      GDPR-compliant bot visit logging with SHA-256 IP anonymization. Uses the Web Crypto API —
      compatible with Edge Runtime.
    </P>
    <CodeBlock
      language="typescript"
      code={`const geo = createGeoAI({
  // ...
  crawlTracking: true,  // uses built-in MemoryCrawlStore (10,000 max entries)

  // Or with custom store and secret:
  crawlTracking: {
    store: new MyCustomStore(),
    secret: process.env.CRAWL_SECRET,
  },
});`}
    />

    <H2 id="ai-descriptions">AI descriptions</H2>
    <P>
      Optional module for generating AI-optimized descriptions via Claude or OpenAI. Imported from
      a separate entry point — fully tree-shakeable.
    </P>
    <CodeBlock
      language="typescript"
      code={`import { AiGenerator } from 'geo-ai-core/ai';

const ai = new AiGenerator({
  provider: 'anthropic',
  apiKey: process.env.ANTHROPIC_API_KEY!,
  model: 'claude-sonnet-4-20250514',
});

// Single item
const description = await ai.generate({
  title: 'Widget Pro',
  content: 'A high-quality widget made from premium materials...',
  type: 'product',
  price: '$29.99',
});

// Bulk generation (up to 50 items, batched by 5)
const results = await ai.bulkGenerate(items, {
  batchSize: 5,
  maxItems: 50,
  onProgress: (completed, total) => {
    console.log(\`\${completed}/\${total}\`);
  },
});`}
    />

    <Callout type="note">
      The AI generator uses a sliding window rate limiter (default 10 req/min) and classifies
      errors by type — auth, rate limit, server, network — for clean error handling.
    </Callout>

    <H2 id="entry-points">Entry points</H2>
    <DocTable>
      <THead>
        <TR>
          <TH>Entry</TH>
          <TH>Import</TH>
          <TH>Contents</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>Main</TD>
          <TD mono>geo-ai-core</TD>
          <TD>
            <IC>createGeoAI</IC>, <IC>BotRulesEngine</IC>, <IC>CrawlTracker</IC>,{" "}
            <IC>SeoGenerator</IC>, cache adapters, all types
          </TD>
        </TR>
        <TR>
          <TD>AI</TD>
          <TD mono>geo-ai-core/ai</TD>
          <TD>
            <IC>AiGenerator</IC>, <IC>RateLimiter</IC>, <IC>buildPrompt</IC>,{" "}
            <IC>classifyAiError</IC>
          </TD>
        </TR>
      </TBody>
    </DocTable>

    <H2 id="requirements">Requirements</H2>
    <UL>
      <LI>Node.js 20 or higher</LI>
      <LI>TypeScript 5.5+ (recommended — ships .d.ts)</LI>
    </UL>
  </article>
);

export const CorePackagePage = { content, toc };
