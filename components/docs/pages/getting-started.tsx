import { H1, H2, H3, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "installation", title: "Installation", level: 2 },
  { id: "next-js", title: "Next.js setup", level: 2 },
  { id: "config-file", title: "Config file", level: 3 },
  { id: "build-script", title: "Build script", level: 3 },
  { id: "verify", title: "Verify", level: 3 },
  { id: "node-js", title: "Node.js / other frameworks", level: 2 },
  { id: "next-steps", title: "Next steps", level: 2 },
];

const content = (
  <article>
    <H1>Quick Start</H1>
    <Lead>Get GEO AI running in your project in under 5 minutes.</Lead>

    <H2 id="installation">Installation</H2>
    <P>Pick the package that matches your stack:</P>
    <DocTable>
      <THead>
        <TR>
          <TH>Stack</TH>
          <TH>Package</TH>
          <TH>Install</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>Next.js</TD>
          <TD mono>geo-ai-next</TD>
          <TD mono>npm install geo-ai-next</TD>
        </TR>
        <TR>
          <TD>Any Node.js</TD>
          <TD mono>geo-ai-core</TD>
          <TD mono>npm install geo-ai-core</TD>
        </TR>
        <TR>
          <TD>WordPress / WooCommerce</TD>
          <TD mono>geo-ai-woo</TD>
          <TD>Download plugin from GitHub</TD>
        </TR>
        <TR>
          <TD>Shopify</TD>
          <TD mono>geo-ai-shopify</TD>
          <TD>Install from Shopify Partner dashboard</TD>
        </TR>
      </TBody>
    </DocTable>

    <H2 id="next-js">Next.js setup</H2>
    <P>
      The recommended production approach is static file generation — generate <IC>llms.txt</IC> and{" "}
      <IC>llms-full.txt</IC> before <IC>next build</IC>. Next.js serves them from <IC>public/</IC>{" "}
      automatically with no middleware needed.
    </P>

    <H3 id="config-file">1. Create geo-ai.config.mjs</H3>
    <CodeBlock
      filename="geo-ai.config.mjs"
      language="js"
      code={`// @ts-check
/** @type {import('geo-ai-next').GenerateLlmsFilesConfig} */
export default {
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  siteDescription: 'A short description for AI crawlers',
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

    <H3 id="build-script">2. Add the build script</H3>
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

    <Callout type="tip" title="How it works">
      <IC>geo-ai-generate</IC> reads your config, writes <IC>public/llms.txt</IC> and{" "}
      <IC>public/llms-full.txt</IC>, then <IC>next build</IC> picks them up as static assets.
    </Callout>

    <H3 id="verify">3. Run and verify</H3>
    <CodeBlock
      language="bash"
      code={`npm run build

# Verify the files were generated
ls public/llms.txt public/llms-full.txt

# Check the output
curl https://yoursite.com/llms.txt`}
    />

    <P>
      Both files return <IC>200 OK</IC> with <IC>text/plain</IC> content. No middleware, no route
      handler needed for the static approach.
    </P>

    <H2 id="node-js">Node.js / other frameworks</H2>
    <P>
      Use <IC>geo-ai-core</IC> directly with any Node.js framework — Express, Fastify, Hono, etc.
    </P>
    <CodeBlock
      language="typescript"
      code={`import { createGeoAI } from 'geo-ai-core';

const geo = createGeoAI({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: {
    Pages: [
      { title: 'Home', url: '/', description: 'Welcome' },
    ],
  },
});

// Generate llms.txt content
const llmsTxt = await geo.generateLlms(false);
const llmsFullTxt = await geo.generateLlms(true);

// Generate robots.txt block
const robotsTxt = geo.generateRobotsTxt();

// SEO signals
const metaTags = geo.generateMetaTags();
const linkHeader = geo.generateLinkHeader();
const jsonLd = geo.generateJsonLd();`}
    />

    <H2 id="next-steps">Next steps</H2>
    <UL>
      <LI>
        Read the <IC>geo-ai-core</IC> docs for the full API — caching, crawl tracking, AI description
        generation.
      </LI>
      <LI>
        Read the <IC>geo-ai-next</IC> docs for middleware and route handler options.
      </LI>
      <LI>Check the GEO Specification to understand what llms.txt and AI metadata actually do.</LI>
      <LI>Run the Analyzer on your site to see your current AI visibility score.</LI>
    </UL>
  </article>
);

export const GettingStartedPage = { content, toc };
