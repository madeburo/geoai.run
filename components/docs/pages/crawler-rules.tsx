import { H1, H2, H3, Lead, P, IC, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { CodeBlock } from "@/components/docs/code-block";
import { Callout } from "@/components/docs/callout";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "supported-bots", title: "Supported bots", level: 2 },
  { id: "configuration", title: "Configuration", level: 2 },
  { id: "allow-all", title: "Allow all", level: 3 },
  { id: "per-bot-rules", title: "Per-bot rules", level: 3 },
  { id: "generating", title: "Generating robots.txt", level: 2 },
];

const BOTS = [
  ["GPTBot", "OpenAI / ChatGPT"],
  ["OAI-SearchBot", "OpenAI / Copilot Search"],
  ["ClaudeBot", "Anthropic / Claude"],
  ["claude-web", "Anthropic / Claude Web"],
  ["Google-Extended", "Google / Gemini"],
  ["PerplexityBot", "Perplexity AI"],
  ["DeepSeekBot", "DeepSeek"],
  ["GrokBot", "xAI / Grok"],
  ["meta-externalagent", "Meta / LLaMA"],
  ["PanguBot", "Alibaba / Qwen"],
  ["YandexBot", "Yandex / YandexGPT"],
  ["SputnikBot", "Sber / GigaChat"],
  ["Bytespider", "ByteDance / Douyin"],
  ["Baiduspider", "Baidu / ERNIE"],
  ["Amazonbot", "Amazon / Alexa"],
  ["Applebot", "Apple / Siri & Spotlight"],
];

const content = (
  <article>
    <H1>Crawler Rules</H1>
    <Lead>
      Per-bot allow/disallow rules for 16+ AI crawlers. GEO AI generates the correct robots.txt
      directives for each one.
    </Lead>

    <H2 id="supported-bots">Supported bots</H2>
    <P>GEO AI has a built-in registry of 16 AI crawlers:</P>
    <DocTable>
      <THead>
        <TR>
          <TH>Bot</TH>
          <TH>Provider</TH>
        </TR>
      </THead>
      <TBody>
        {BOTS.map(([bot, provider]) => (
          <TR key={bot}>
            <TD mono>{bot}</TD>
            <TD>{provider}</TD>
          </TR>
        ))}
      </TBody>
    </DocTable>

    <H2 id="configuration">Configuration</H2>

    <H3 id="allow-all">Allow all bots</H3>
    <P>
      Pass <IC>&apos;all&apos;</IC> to allow every registered AI crawler:
    </P>
    <CodeBlock
      language="typescript"
      code={`const geo = createGeoAI({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: { /* ... */ },
  crawlers: 'all',
});`}
    />

    <H3 id="per-bot-rules">Per-bot rules</H3>
    <P>
      Pass a record to set individual allow/disallow rules per bot:
    </P>
    <CodeBlock
      language="typescript"
      code={`const geo = createGeoAI({
  siteName: 'My Site',
  siteUrl: 'https://example.com',
  provider: { /* ... */ },
  crawlers: {
    GPTBot: 'allow',
    ClaudeBot: 'allow',
    'Google-Extended': 'allow',
    PerplexityBot: 'allow',
    Bytespider: 'disallow',   // disallow ByteDance crawler
    Baiduspider: 'disallow',  // disallow Baidu crawler
  },
});`}
    />

    <Callout type="note">
      Bots not listed in your config are neither explicitly allowed nor disallowed — they follow
      your existing <IC>robots.txt</IC> rules.
    </Callout>

    <H2 id="generating">Generating robots.txt</H2>
    <P>
      Call <IC>generateRobotsTxt()</IC> to get the block to append to your{" "}
      <IC>robots.txt</IC>:
    </P>
    <CodeBlock
      language="typescript"
      code={`const robotsTxt = geo.generateRobotsTxt();
console.log(robotsTxt);`}
    />
    <CodeBlock
      filename="Output"
      code={`User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Disallow: /

User-agent: Baiduspider
Disallow: /`}
    />
    <P>
      In Next.js, you can generate this dynamically in <IC>app/robots.ts</IC>:
    </P>
    <CodeBlock
      filename="app/robots.ts"
      language="typescript"
      code={`import { MetadataRoute } from 'next';
import { createGeoAI } from 'geo-ai-core';

const geo = createGeoAI({ /* config */ });

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    // Append the GEO AI block to your existing robots.txt
  };
}`}
    />
  </article>
);

export const CrawlerRulesPage = { content, toc };
