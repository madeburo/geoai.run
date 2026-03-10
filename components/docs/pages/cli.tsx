import { H1, H2, H3, Lead, P, IC, UL, LI } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "usage", title: "Usage", level: 2 },
  { id: "config-file", title: "Config file", level: 2 },
  { id: "options", title: "Options", level: 2 },
  { id: "output", title: "Output", level: 2 },
];

const content = (
  <article>
    <H1>CLI</H1>
    <Lead>
      The <IC>geo-ai-generate</IC> command-line tool — generates static llms.txt files before your
      build.
    </Lead>

    <H2 id="overview">Overview</H2>
    <P>
      The CLI is included in the <IC>geo-ai-next</IC> package. It reads your{" "}
      <IC>geo-ai.config.mjs</IC> and writes <IC>public/llms.txt</IC> and{" "}
      <IC>public/llms-full.txt</IC> to your project.
    </P>
    <P>
      This is the recommended production approach for Next.js projects — static files are served
      directly by Next.js with no middleware overhead.
    </P>

    <H2 id="usage">Usage</H2>
    <CodeBlock
      language="bash"
      code={`# Run directly (reads geo-ai.config.mjs from project root)
npx geo-ai-generate

# Custom config path
npx geo-ai-generate --config ./config/geo-ai.mjs

# Custom output directory
npx geo-ai-generate --out ./static`}
    />

    <P>Add it to your build pipeline in <IC>package.json</IC>:</P>
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

    <H2 id="config-file">Config file</H2>
    <P>
      The CLI reads <IC>geo-ai.config.mjs</IC> from your project root by default. The config file
      must be an ES module with a default export:
    </P>
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
};`}
    />

    <H3 id="dynamic-provider">Dynamic provider in config</H3>
    <P>
      The config file can import and use a <IC>ContentProvider</IC> class — the CLI runs in
      Node.js so async providers work:
    </P>
    <CodeBlock
      filename="geo-ai.config.mjs"
      language="js"
      code={`import { MyProvider } from './lib/my-provider.js';

export default {
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: new MyProvider(),
  crawlers: 'all',
};`}
    />

    <H2 id="options">Options</H2>
    <UL>
      <LI>
        <IC>--config &lt;path&gt;</IC> — path to config file (default: <IC>geo-ai.config.mjs</IC>)
      </LI>
      <LI>
        <IC>--out &lt;dir&gt;</IC> — output directory (default: <IC>public</IC>)
      </LI>
    </UL>

    <H2 id="output">Output</H2>
    <CodeBlock
      code={`[geo-ai] Generating llms files → /your-project/public
[geo-ai] ✓ /your-project/public/llms.txt (843 bytes)
[geo-ai] ✓ /your-project/public/llms-full.txt (1204 bytes)
[geo-ai] Done.`}
    />
  </article>
);

export const CliPage = { content, toc };
