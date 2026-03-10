import { H1, H2, Lead, P, IC, UL, LI } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "meta-tags", title: "Meta tags", level: 2 },
  { id: "link-header", title: "Link header", level: 2 },
  { id: "generating", title: "Generating with GEO AI", level: 2 },
  { id: "next-js", title: "Next.js integration", level: 2 },
];

const content = (
  <article>
    <H1>AI Metadata</H1>
    <Lead>
      Meta tags and HTTP headers that help AI crawlers discover your llms.txt files and understand
      your content.
    </Lead>

    <H2 id="meta-tags">Meta tags</H2>
    <P>
      Add these tags to your page <IC>&lt;head&gt;</IC> to signal AI content discovery endpoints:
    </P>
    <CodeBlock
      language="html"
      code={`<!-- Point to your llms.txt files -->
<meta name="llms" content="https://example.com/llms.txt" />
<meta name="llms-full" content="https://example.com/llms-full.txt" />

<!-- Optional: per-page AI description -->
<meta name="ai-description" content="A concise summary of this page for LLMs" />`}
    />
    <P>
      The <IC>llms</IC> and <IC>llms-full</IC> meta tags are the primary discovery mechanism. AI
      crawlers that parse HTML will find these and fetch the referenced files.
    </P>

    <H2 id="link-header">Link header</H2>
    <P>
      The HTTP <IC>Link</IC> header provides the same signal for crawlers that don&apos;t parse
      HTML — they read response headers directly:
    </P>
    <CodeBlock
      language="http"
      code={`Link: <https://example.com/llms.txt>; rel="ai-content-index"`}
    />
    <P>
      GEO AI can inject this header automatically via middleware (Next.js) or you can set it
      manually in your server configuration.
    </P>

    <Callout type="tip" title="Use both">
      Implement both meta tags and the Link header. Different AI crawlers use different discovery
      methods — covering both maximizes your reach.
    </Callout>

    <H2 id="generating">Generating with GEO AI</H2>
    <CodeBlock
      language="typescript"
      code={`import { createGeoAI } from 'geo-ai-core';

const geo = createGeoAI({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: { /* ... */ },
});

// Returns array of { name, content } objects
const metaTags = geo.generateMetaTags();
// [
//   { name: 'llms', content: 'https://example.com/llms.txt' },
//   { name: 'llms-full', content: 'https://example.com/llms-full.txt' },
// ]

// Returns the Link header value string
const linkHeader = geo.generateLinkHeader();
// '<https://example.com/llms.txt>; rel="ai-content-index"'`}
    />

    <H2 id="next-js">Next.js integration</H2>
    <P>
      In Next.js, add the meta tags to your root layout and optionally inject the Link header via
      middleware:
    </P>
    <CodeBlock
      filename="app/layout.tsx"
      language="tsx"
      code={`// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta name="llms" content="https://example.com/llms.txt" />
        <meta name="llms-full" content="https://example.com/llms-full.txt" />
      </head>
      <body>{children}</body>
    </html>
  );
}`}
    />
    <P>
      To inject the <IC>Link</IC> header on all responses, use <IC>geoAIMiddleware</IC> with{" "}
      <IC>injectLinkHeader: true</IC>:
    </P>
    <CodeBlock
      filename="middleware.ts"
      language="typescript"
      code={`import { geoAIMiddleware } from 'geo-ai-next';

export default geoAIMiddleware({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: new MyProvider(),
  injectLinkHeader: true,
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`}
    />

    <UL>
      <LI>
        <IC>injectLinkHeader: true</IC> adds the <IC>Link</IC> header to every response passing
        through the middleware
      </LI>
      <LI>
        The middleware also intercepts <IC>/llms.txt</IC> and <IC>/llms-full.txt</IC> requests and
        serves them dynamically
      </LI>
      <LI>
        For static sites, use the CLI to generate the files and set the Link header in your CDN or
        server config
      </LI>
    </UL>
  </article>
);

export const AiMetadataPage = { content, toc };
