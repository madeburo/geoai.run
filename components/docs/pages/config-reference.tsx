import { H1, H2, H3, Lead, P, IC, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "geoaiconfig", title: "GeoAIConfig", level: 2 },
  { id: "provider", title: "provider", level: 3 },
  { id: "crawlers", title: "crawlers", level: 3 },
  { id: "cache", title: "cache", level: 3 },
  { id: "crawl-tracking", title: "crawlTracking", level: 3 },
  { id: "crypto", title: "crypto", level: 3 },
  { id: "generate-config", title: "GenerateLlmsFilesConfig", level: 2 },
];

const content = (
  <article>
    <H1>Configuration Reference</H1>
    <Lead>Full reference for GeoAIConfig and GenerateLlmsFilesConfig options.</Lead>

    <H2 id="geoaiconfig">GeoAIConfig</H2>
    <P>
      Passed to <IC>createGeoAI()</IC>. All options from this interface are also accepted by{" "}
      <IC>geoAIMiddleware()</IC>, <IC>createLlmsHandler()</IC>, and the CLI config file.
    </P>

    <DocTable>
      <THead>
        <TR>
          <TH>Option</TH>
          <TH>Type</TH>
          <TH>Required</TH>
          <TH>Description</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>siteName</TD>
          <TD mono>string</TD>
          <TD>Yes</TD>
          <TD>Your site name — used as the H1 in llms.txt</TD>
        </TR>
        <TR>
          <TD mono>siteUrl</TD>
          <TD mono>string</TD>
          <TD>Yes</TD>
          <TD>Canonical site URL — used to build absolute resource URLs</TD>
        </TR>
        <TR>
          <TD mono>provider</TD>
          <TD mono>ContentProvider | Record&lt;string, Resource[]&gt;</TD>
          <TD>Yes</TD>
          <TD>Content source — static object or ContentProvider instance</TD>
        </TR>
        <TR>
          <TD mono>siteDescription</TD>
          <TD mono>string</TD>
          <TD>No</TD>
          <TD>Short site description — used as the blockquote in llms.txt</TD>
        </TR>
        <TR>
          <TD mono>crawlers</TD>
          <TD mono>&apos;all&apos; | Record&lt;string, &apos;allow&apos; | &apos;disallow&apos;&gt;</TD>
          <TD>No</TD>
          <TD>AI crawler rules — &apos;all&apos; allows every registered bot</TD>
        </TR>
        <TR>
          <TD mono>cache</TD>
          <TD mono>CacheAdapter | &apos;1h&apos; | &apos;24h&apos; | &apos;7d&apos;</TD>
          <TD>No</TD>
          <TD>Cache adapter or duration shorthand</TD>
        </TR>
        <TR>
          <TD mono>crawlTracking</TD>
          <TD mono>boolean | CrawlTrackingConfig</TD>
          <TD>No</TD>
          <TD>Enable GDPR-compliant bot visit logging</TD>
        </TR>
        <TR>
          <TD mono>crypto</TD>
          <TD mono>{"{ encryptionKey: string }"}</TD>
          <TD>No</TD>
          <TD>AES-256-GCM encryption key (64-char hex) for API key storage</TD>
        </TR>
      </TBody>
    </DocTable>

    <H3 id="provider">provider</H3>
    <P>
      Either a static object mapping section names to resource arrays, or a class implementing{" "}
      <IC>ContentProvider</IC>:
    </P>
    <CodeBlock
      language="typescript"
      code={`// Static object
provider: {
  Pages: [
    { title: 'Home', url: '/', description: 'Welcome' },
  ],
  Products: [
    { title: 'Widget', url: '/products/widget', description: 'A widget', price: '$29' },
  ],
}

// ContentProvider interface
interface ContentProvider {
  getSections(options?: { locale?: string }): Promise<Section[]>;
}

interface Section {
  name: string;
  type?: 'product' | 'article' | 'page';
  resources: Resource[];
}

interface Resource {
  title: string;
  url: string;
  description?: string;
  content?: string;
  price?: string;
  available?: boolean;
}`}
    />

    <H3 id="crawlers">crawlers</H3>
    <CodeBlock
      language="typescript"
      code={`// Allow all 16 registered AI crawlers
crawlers: 'all'

// Per-bot rules
crawlers: {
  GPTBot: 'allow',
  ClaudeBot: 'allow',
  Bytespider: 'disallow',
}`}
    />

    <H3 id="cache">cache</H3>
    <CodeBlock
      language="typescript"
      code={`// Duration shorthands (creates MemoryCacheAdapter)
cache: '1h'
cache: '24h'
cache: '7d'

// Custom adapter
import { FileCacheAdapter } from 'geo-ai-core';
cache: new FileCacheAdapter({ dir: '.cache/geo-ai' })`}
    />

    <H3 id="crawl-tracking">crawlTracking</H3>
    <CodeBlock
      language="typescript"
      code={`// Simple enable (uses MemoryCrawlStore, 10,000 max entries)
crawlTracking: true

// With custom store and HMAC secret
crawlTracking: {
  store: new MyCustomStore(),
  secret: process.env.CRAWL_SECRET,
}`}
    />

    <H3 id="crypto">crypto</H3>
    <CodeBlock
      language="typescript"
      code={`crypto: {
  encryptionKey: process.env.ENCRYPTION_KEY!, // 64-char hex string
}

// Generate a key:
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`}
    />

    <H2 id="generate-config">GenerateLlmsFilesConfig</H2>
    <P>
      Extends <IC>GeoAIConfig</IC> with two additional options for the CLI and{" "}
      <IC>generateLlmsFiles()</IC>:
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Option</TH>
          <TH>Type</TH>
          <TH>Default</TH>
          <TH>Description</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>outDir</TD>
          <TD mono>string</TD>
          <TD mono>&apos;public&apos;</TD>
          <TD>Output directory relative to cwd</TD>
        </TR>
        <TR>
          <TD mono>locale</TD>
          <TD mono>string</TD>
          <TD>—</TD>
          <TD>Locale passed to ContentProvider.getSections()</TD>
        </TR>
      </TBody>
    </DocTable>

    <Callout type="note">
      All <IC>GeoAIConfig</IC> options are valid in <IC>geo-ai.config.mjs</IC> — the CLI passes
      the entire config object to <IC>generateLlmsFiles()</IC>.
    </Callout>
  </article>
);

export const ConfigReferencePage = { content, toc };
