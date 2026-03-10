import { H1, H2, H3, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "installation", title: "Installation", level: 2 },
  { id: "static-generation", title: "Static generation (recommended)", level: 2 },
  { id: "cli", title: "CLI", level: 3 },
  { id: "troubleshooting", title: "Troubleshooting 404s", level: 3 },
  { id: "middleware", title: "Middleware", level: 2 },
  { id: "route-handler", title: "Route handler", level: 2 },
  { id: "re-exports", title: "Re-exports", level: 2 },
  { id: "when-to-use", title: "When to use each approach", level: 2 },
];

const content = (
  <article>
    <H1>GEO AI Next</H1>
    <Lead>
      Next.js integration for geo-ai-core — static file generation, middleware, and App Router
      route handler for llms.txt and llms-full.txt.
    </Lead>

    <div className="my-6 flex flex-wrap gap-2">
      <a
        href="https://npmjs.com/package/geo-ai-next"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-md border border-border/60 bg-card/40 px-3 py-1.5 text-xs font-mono text-muted-foreground transition-colors hover:text-foreground"
      >
        npm install geo-ai-next
      </a>
    </div>

    <H2 id="installation">Installation</H2>
    <CodeBlock language="bash" code={`npm install geo-ai-next`} />
    <P>
      Peer dependency: <IC>next &gt;= 16</IC>. No need to also install <IC>geo-ai-core</IC> —
      everything is re-exported.
    </P>

    <H2 id="static-generation">Static generation (recommended)</H2>
    <P>
      The most reliable production approach. Generates <IC>public/llms.txt</IC> and{" "}
      <IC>public/llms-full.txt</IC> before <IC>next build</IC>. Next.js serves them automatically
      — no middleware needed.
    </P>

    <H3 id="cli">1. Create geo-ai.config.mjs</H3>
    <CodeBlock
      filename="geo-ai.config.mjs"
      language="js"
      code={`// @ts-check
/** @type {import('geo-ai-next').GenerateLlmsFilesConfig} */
export default {
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  siteDescription: 'AI-optimized site description',
  provider: {
    Pages: [
      { title: 'Home', url: '/', description: 'Welcome page' },
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
};`}
    />
    <P>Add the build script to <IC>package.json</IC>:</P>
    <CodeBlock
      filename="package.json"
      language="json"
      code={`{
  "scripts": {
    "geo:generate": "geo-ai-generate",
    "build": "npm run geo:generate && next build"
  }
}`}
    />
    <P>Run the build and verify:</P>
    <CodeBlock
      language="bash"
      code={`npm run build

# Both files should be present
ls public/llms.txt public/llms-full.txt`}
    />

    <Callout type="tip" title="Custom config path">
      By default the CLI reads <IC>geo-ai.config.mjs</IC> from your project root. Pass{" "}
      <IC>--config ./path/to/config.mjs</IC> to use a different location.
    </Callout>

    <H3 id="troubleshooting">Troubleshooting 404s on /llms.txt</H3>
    <UL>
      <LI>
        Make sure <IC>geo-ai-generate</IC> runs before <IC>next build</IC>
      </LI>
      <LI>
        Check that <IC>public/llms.txt</IC> exists after generation
      </LI>
      <LI>Vercel and Netlify serve public/ automatically — no extra config needed</LI>
      <LI>
        For custom servers, ensure static file serving is configured for the <IC>public/</IC>{" "}
        directory
      </LI>
    </UL>

    <H2 id="middleware">Middleware</H2>
    <P>
      Use middleware when you need dynamic content per-request — locale from cookies, A/B testing,
      or content that changes too frequently to regenerate at build time.
    </P>
    <CodeBlock
      filename="middleware.ts"
      language="typescript"
      code={`import { geoAIMiddleware } from 'geo-ai-next';

export default geoAIMiddleware({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: new MyProvider(),
  cache: '24h',
  cacheMaxAge: 3600,       // Cache-Control max-age in seconds
  injectLinkHeader: true,  // Adds Link header to all responses
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`}
    />

    <H2 id="route-handler">Route handler</H2>
    <P>
      For App Router — serves llms content at a custom route. File type is determined by URL path
      or <IC>?type=full</IC> query param.
    </P>
    <CodeBlock
      filename="app/llms/route.ts"
      language="typescript"
      code={`import { createLlmsHandler } from 'geo-ai-next';

export const { GET } = createLlmsHandler({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: new MyProvider(),
  cacheMaxAge: 3600, // optional, default 3600
});`}
    />

    <H2 id="re-exports">Re-exports</H2>
    <P>
      All public API from <IC>geo-ai-core</IC> is re-exported — no need to install both packages:
    </P>
    <CodeBlock
      language="typescript"
      code={`import {
  createGeoAI,
  BotRulesEngine,
  CrawlTracker,
  SeoGenerator,
  AI_BOTS,
  type ContentProvider,
  type Resource,
  type GeoAIConfig,
} from 'geo-ai-next';`}
    />

    <H2 id="when-to-use">When to use each approach</H2>
    <DocTable>
      <THead>
        <TR>
          <TH>Approach</TH>
          <TH>When to use</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>Static generation (CLI)</TD>
          <TD>Production default — works on Vercel, Netlify, any static host</TD>
        </TR>
        <TR>
          <TD>Middleware</TD>
          <TD>Dynamic content per-request, edge locale detection, A/B testing</TD>
        </TR>
        <TR>
          <TD>Route handler</TD>
          <TD>Custom route path, App Router, programmatic control</TD>
        </TR>
      </TBody>
    </DocTable>
  </article>
);

export const NextPackagePage = { content, toc };
