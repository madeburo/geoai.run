import { H1, H2, H3, Lead, P, IC, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "create-geo-ai", title: "createGeoAI()", level: 2 },
  { id: "geo-instance", title: "GeoAI instance methods", level: 2 },
  { id: "generate-llms-files", title: "generateLlmsFiles()", level: 2 },
  { id: "middleware", title: "geoAIMiddleware()", level: 2 },
  { id: "route-handler", title: "createLlmsHandler()", level: 2 },
  { id: "ai-generator", title: "AiGenerator", level: 2 },
];

const content = (
  <article>
    <H1>API Reference</H1>
    <Lead>Full API reference for geo-ai-core and geo-ai-next.</Lead>

    <H2 id="create-geo-ai">createGeoAI(config)</H2>
    <P>
      Creates a GeoAI instance. Accepts a <IC>GeoAIConfig</IC> object. Returns a{" "}
      <IC>GeoAI</IC> instance with methods for generating all GEO AI outputs.
    </P>
    <CodeBlock
      language="typescript"
      code={`import { createGeoAI } from 'geo-ai-core';

const geo = createGeoAI({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: { Pages: [{ title: 'Home', url: '/', description: 'Welcome' }] },
});`}
    />

    <H2 id="geo-instance">GeoAI instance methods</H2>
    <DocTable>
      <THead>
        <TR>
          <TH>Method</TH>
          <TH>Returns</TH>
          <TH>Description</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>generateLlms(full)</TD>
          <TD mono>Promise&lt;string&gt;</TD>
          <TD>Generate llms.txt (false) or llms-full.txt (true) content</TD>
        </TR>
        <TR>
          <TD mono>generateRobotsTxt()</TD>
          <TD mono>string</TD>
          <TD>Generate robots.txt block for all configured crawlers</TD>
        </TR>
        <TR>
          <TD mono>generateMetaTags()</TD>
          <TD mono>MetaTag[]</TD>
          <TD>Generate meta tag objects for page head</TD>
        </TR>
        <TR>
          <TD mono>generateLinkHeader()</TD>
          <TD mono>string</TD>
          <TD>Generate Link header value string</TD>
        </TR>
        <TR>
          <TD mono>generateJsonLd()</TD>
          <TD mono>object | object[]</TD>
          <TD>Generate JSON-LD Schema.org object(s)</TD>
        </TR>
      </TBody>
    </DocTable>

    <H3 id="generate-llms">generateLlms(full)</H3>
    <CodeBlock
      language="typescript"
      code={`// llms.txt — concise index
const llmsTxt = await geo.generateLlms(false);

// llms-full.txt — extended with full content
const llmsFullTxt = await geo.generateLlms(true);`}
    />

    <H3 id="generate-meta-tags">generateMetaTags()</H3>
    <CodeBlock
      language="typescript"
      code={`const tags = geo.generateMetaTags();
// Returns:
// [
//   { name: 'llms', content: 'https://example.com/llms.txt' },
//   { name: 'llms-full', content: 'https://example.com/llms-full.txt' },
// ]`}
    />

    <H2 id="generate-llms-files">generateLlmsFiles(config)</H2>
    <P>
      From <IC>geo-ai-next</IC>. Writes <IC>llms.txt</IC> and <IC>llms-full.txt</IC> to the
      output directory. Used by the CLI and can be called directly in build scripts.
    </P>
    <CodeBlock
      language="typescript"
      code={`import { generateLlmsFiles } from 'geo-ai-next';

await generateLlmsFiles({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: new MyProvider(),
  outDir: 'public',   // default
  crawlers: 'all',
});`}
    />

    <H2 id="middleware">geoAIMiddleware(config)</H2>
    <P>
      From <IC>geo-ai-next</IC>. Returns a Next.js middleware function. Intercepts{" "}
      <IC>/llms.txt</IC> and <IC>/llms-full.txt</IC> requests and optionally injects the Link
      header on all responses.
    </P>
    <CodeBlock
      language="typescript"
      code={`import { geoAIMiddleware } from 'geo-ai-next';

export default geoAIMiddleware({
  // All GeoAIConfig options +
  cacheMaxAge: 3600,       // Cache-Control max-age (seconds)
  injectLinkHeader: true,  // Inject Link header on all responses
});`}
    />

    <H2 id="route-handler">createLlmsHandler(config)</H2>
    <P>
      From <IC>geo-ai-next</IC>. Returns a <IC>{"{ GET }"}</IC> object for use as an App Router
      route handler.
    </P>
    <CodeBlock
      language="typescript"
      code={`import { createLlmsHandler } from 'geo-ai-next';

export const { GET } = createLlmsHandler({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: new MyProvider(),
  cacheMaxAge: 3600,
});`}
    />

    <H2 id="ai-generator">AiGenerator</H2>
    <P>
      From <IC>geo-ai-core/ai</IC>. Generates AI-optimized descriptions via Claude or OpenAI.
    </P>
    <CodeBlock
      language="typescript"
      code={`import { AiGenerator } from 'geo-ai-core/ai';

const ai = new AiGenerator({
  provider: 'anthropic' | 'openai',
  apiKey: string,
  model?: string,
  promptTemplate?: string, // supports {title}, {content}, {type}, {price}, {category}
  rateLimit?: number,      // requests per minute, default 10
});

// Single generation
const description = await ai.generate({
  title: string,
  content?: string,
  type?: string,
  price?: string,
  category?: string,
});

// Bulk generation
const results = await ai.bulkGenerate(items, {
  batchSize?: number,   // default 5
  maxItems?: number,    // default 50
  onProgress?: (completed: number, total: number) => void,
});`}
    />
  </article>
);

export const ApiReferencePage = { content, toc };
