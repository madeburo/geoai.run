import { H1, H2, H3, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "overview", title: "Overview", level: 2 },
  { id: "installation", title: "Installation", level: 2 },
  { id: "quick-start", title: "Quick start", level: 2 },
  { id: "commands", title: "Commands", level: 2 },
  { id: "cmd-init", title: "geo-ai init", level: 3 },
  { id: "cmd-generate", title: "geo-ai generate", level: 3 },
  { id: "cmd-validate", title: "geo-ai validate", level: 3 },
  { id: "cmd-inspect", title: "geo-ai inspect", level: 3 },
  { id: "config-file", title: "Config file", level: 2 },
  { id: "debug", title: "Debug mode", level: 2 },
  { id: "requirements", title: "Requirements", level: 2 },
];

const content = (
  <article>
    <H1>GEO AI CLI</H1>
    <Lead>
      <IC>geo-ai-cli</IC> — generate and validate <IC>llms.txt</IC> / <IC>llms-full.txt</IC> for
      any Node.js project. Works with any framework. Powered by <IC>geo-ai-core</IC>.
    </Lead>

    <H2 id="overview">Overview</H2>
    <P>
      The CLI is a standalone tool for generating and validating the AI visibility files that GEO AI
      produces. It reads a <IC>geo-ai.config.ts</IC> (or <IC>.js</IC> / <IC>.json</IC>) file and
      writes <IC>llms.txt</IC> and <IC>llms-full.txt</IC> to your output directory.
    </P>
    <P>
      It is framework-agnostic — use it with Next.js, Express, Fastify, or any static site
      generator. Zero runtime dependencies beyond <IC>geo-ai-core</IC>.
    </P>

    <H2 id="installation">Installation</H2>
    <CodeBlock
      language="bash"
      code={`# Local (recommended)
npm install --save-dev geo-ai-cli

# Global
npm install -g geo-ai-cli`}
    />

    <H2 id="quick-start">Quick start</H2>
    <CodeBlock
      language="bash"
      code={`# 1. Scaffold a config file
npx geo-ai init

# 2. Edit geo-ai.config.ts with your site details

# 3. Generate llms.txt and llms-full.txt into ./public
npx geo-ai generate

# 4. Validate the output
npx geo-ai validate`}
    />

    <Callout type="tip" title="Build integration">
      Add <IC>geo-ai generate</IC> to your build script so files are always up to date before
      deployment.
    </Callout>

    <H2 id="commands">Commands</H2>

    <H3 id="cmd-init">geo-ai init</H3>
    <P>
      Scaffolds a <IC>geo-ai.config.ts</IC> starter file in the current directory. Exits safely
      without overwriting if a config already exists.
    </P>
    <CodeBlock language="bash" code={`geo-ai init`} />

    <H3 id="cmd-generate">geo-ai generate</H3>
    <P>
      Generates <IC>llms.txt</IC> and <IC>llms-full.txt</IC> from your config and writes them to
      the output directory (default: <IC>./public</IC>).
    </P>
    <CodeBlock language="bash" code={`geo-ai generate [--config <path>] [--out <path>]`} />
    <DocTable>
      <THead>
        <TR>
          <TH>Flag</TH>
          <TH>Default</TH>
          <TH>Description</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>--config</TD>
          <TD>auto-discover</TD>
          <TD>Path to config file</TD>
        </TR>
        <TR>
          <TD mono>--out</TD>
          <TD mono>./public</TD>
          <TD>Output directory</TD>
        </TR>
      </TBody>
    </DocTable>
    <P>
      Config discovery order: <IC>geo-ai.config.ts</IC> → <IC>geo-ai.config.js</IC> →{" "}
      <IC>geo-ai.config.json</IC>
    </P>

    <H3 id="cmd-validate">geo-ai validate</H3>
    <P>
      Checks that <IC>llms.txt</IC> and <IC>llms-full.txt</IC> are present and have valid content.
      Supports both local files and remote URLs. Exits <IC>1</IC> on any failure.
    </P>
    <CodeBlock language="bash" code={`geo-ai validate [--path <dir>] [--url <url>]`} />
    <DocTable>
      <THead>
        <TR>
          <TH>Flag</TH>
          <TH>Default</TH>
          <TH>Description</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>--path</TD>
          <TD mono>./public</TD>
          <TD>Local directory to check</TD>
        </TR>
        <TR>
          <TD mono>--url</TD>
          <TD>—</TD>
          <TD>Remote base URL (fetches <IC>/llms.txt</IC> and <IC>/llms-full.txt</IC>)</TD>
        </TR>
      </TBody>
    </DocTable>

    <H3 id="cmd-inspect">geo-ai inspect</H3>
    <P>
      Previews your config: site info, crawler rules, resource sections with item counts. Optionally
      fetches and displays remote llms files via <IC>--url</IC>.
    </P>
    <CodeBlock language="bash" code={`geo-ai inspect [--config <path>] [--url <url>]`} />

    <H2 id="config-file">Config file</H2>
    <CodeBlock
      filename="geo-ai.config.ts"
      language="typescript"
      code={`import type { GeoAIConfig } from 'geo-ai-core';

export default {
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  siteDescription: 'A brief description for AI crawlers.',
  crawlers: 'all',
  provider: {
    Pages: [
      { title: 'Home', url: 'https://example.com/', description: 'Welcome page' },
    ],
    Blog: [
      { title: 'Getting Started', url: 'https://example.com/blog/start', description: 'First steps' },
    ],
  },
} satisfies GeoAIConfig;`}
    />
    <P>
      Required fields: <IC>siteName</IC>, <IC>siteUrl</IC>, <IC>provider</IC>.
    </P>

    <H2 id="debug">Debug mode</H2>
    <P>
      Set <IC>DEBUG=geo-ai</IC> to print stack traces to stderr:
    </P>
    <CodeBlock language="bash" code={`DEBUG=geo-ai geo-ai generate`} />

    <H2 id="requirements">Requirements</H2>
    <UL>
      <LI>Node.js &gt;= 20</LI>
    </UL>
  </article>
);

export const CliPage = { content, toc };
