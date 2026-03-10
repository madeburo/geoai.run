import { H1, H2, Lead, P, IC, UL, LI, DocTable, THead, TBody, TR, TH, TD } from "@/components/docs/doc-heading";
import { Callout } from "@/components/docs/callout";
import { CodeBlock } from "@/components/docs/code-block";
import { type TocItem } from "@/components/docs/doc-toc";

const toc: TocItem[] = [
  { id: "ai-crawlers", title: "AI crawlers", level: 2 },
  { id: "robots-txt-format", title: "robots.txt format", level: 2 },
  { id: "crawler-classification", title: "Crawler classification", level: 2 },
  { id: "analyzer-checks", title: "Analyzer checks", level: 2 },
  { id: "common-mistakes", title: "Common mistakes", level: 2 },
];

const content = (
  <article>
    <H1>Crawler Rules Specification</H1>
    <Lead>
      The <IC>robots.txt</IC> directives that control which AI search engines can crawl your
      site — ten known AI crawlers, their user-agent strings, and the access posture the
      Analyzer expects.
    </Lead>

    <H2 id="ai-crawlers">AI crawlers</H2>
    <P>
      The Analyzer tracks ten AI crawlers across the major AI search platforms. Each crawler is
      identified by its <IC>User-agent</IC> string in <IC>robots.txt</IC>. The table below lists
      all ten with their provider and the AI engine they serve.
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>User-agent</TH>
          <TH>Provider</TH>
          <TH>AI Engine</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>GPTBot</TD>
          <TD>OpenAI</TD>
          <TD>ChatGPT / GPT-4o</TD>
        </TR>
        <TR>
          <TD mono>ChatGPT-User</TD>
          <TD>OpenAI</TD>
          <TD>ChatGPT browsing</TD>
        </TR>
        <TR>
          <TD mono>ClaudeBot</TD>
          <TD>Anthropic</TD>
          <TD>Claude</TD>
        </TR>
        <TR>
          <TD mono>Claude-Web</TD>
          <TD>Anthropic</TD>
          <TD>Claude web search</TD>
        </TR>
        <TR>
          <TD mono>PerplexityBot</TD>
          <TD>Perplexity AI</TD>
          <TD>Perplexity</TD>
        </TR>
        <TR>
          <TD mono>Google-Extended</TD>
          <TD>Google</TD>
          <TD>Gemini / AI Overviews</TD>
        </TR>
        <TR>
          <TD mono>CCBot</TD>
          <TD>Common Crawl</TD>
          <TD>Training data (multiple)</TD>
        </TR>
        <TR>
          <TD mono>Bytespider</TD>
          <TD>ByteDance</TD>
          <TD>Doubao / Grok training</TD>
        </TR>
        <TR>
          <TD mono>Amazonbot</TD>
          <TD>Amazon</TD>
          <TD>Alexa / Amazon Q</TD>
        </TR>
        <TR>
          <TD mono>meta-externalagent</TD>
          <TD>Meta</TD>
          <TD>Meta AI</TD>
        </TR>
      </TBody>
    </DocTable>
    <Callout type="note" title="User-agent matching is case-insensitive">
      The Analyzer normalizes user-agent strings to lowercase before matching. A{" "}
      <IC>robots.txt</IC> entry for <IC>GPTBot</IC>, <IC>gptbot</IC>, or <IC>Gptbot</IC> all
      match the same crawler.
    </Callout>

    <H2 id="robots-txt-format">robots.txt format</H2>
    <P>
      To explicitly allow all ten AI crawlers, add a <IC>User-agent</IC> block for each one
      with an <IC>Allow: /</IC> directive. Place these blocks before any wildcard{" "}
      <IC>User-agent: *</IC> block to ensure they take precedence.
    </P>
    <CodeBlock
      filename="robots.txt"
      language="text"
      code={`User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: CCBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: meta-externalagent
Allow: /

User-agent: *
Disallow: /admin/
Disallow: /private/`}
    />
    <Callout type="tip" title="Allow: / is explicit, not required">
      If your <IC>robots.txt</IC> has no <IC>Disallow: /</IC> rule for a crawler, access is
      implicitly allowed. Explicit <IC>Allow: /</IC> rules are recommended because they make
      your intent unambiguous and are easier to audit.
    </Callout>

    <H2 id="crawler-classification">Crawler classification</H2>
    <P>
      The Analyzer classifies each of the ten crawlers into one of three states based on the
      parsed <IC>robots.txt</IC> rules:
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Classification</TH>
          <TH>Definition</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD mono>allowed</TD>
          <TD>
            An explicit <IC>Allow: /</IC> rule exists for this crawler, or a{" "}
            <IC>Disallow: /</IC> rule exists but is overridden by <IC>Allow: /</IC> in the same
            block.
          </TD>
        </TR>
        <TR>
          <TD mono>blocked</TD>
          <TD>
            A <IC>Disallow: /</IC> rule exists for this crawler with no overriding{" "}
            <IC>Allow: /</IC> rule, or the wildcard block has <IC>Disallow: /</IC> and no
            exact block exists for this crawler.
          </TD>
        </TR>
        <TR>
          <TD mono>unspecified</TD>
          <TD>
            No block exists for this crawler and the wildcard block (if present) does not have a{" "}
            <IC>Disallow: /</IC> rule. Access is implicitly permitted but not explicitly stated.
          </TD>
        </TR>
      </TBody>
    </DocTable>
    <P>
      Precedence rules: an exact <IC>User-agent</IC> block takes priority over the wildcard{" "}
      <IC>User-agent: *</IC> block. Within a block, <IC>Allow</IC> rules can override{" "}
      <IC>Disallow</IC> rules.
    </P>

    <H2 id="analyzer-checks">Analyzer checks</H2>
    <P>
      The <IC>checkCrawlerRules</IC> function fetches <IC>{"{origin}/robots.txt"}</IC>, parses
      it into blocks, and classifies each of the ten AI crawlers:
    </P>
    <DocTable>
      <THead>
        <TR>
          <TH>Condition</TH>
          <TH>Status</TH>
          <TH>Recommendation code</TH>
        </TR>
      </THead>
      <TBody>
        <TR>
          <TD>
            <IC>robots.txt</IC> present, no global block, majority of crawlers not blocked
          </TD>
          <TD mono>pass</TD>
          <TD>—</TD>
        </TR>
        <TR>
          <TD>
            <IC>robots.txt</IC> returns HTTP 404
          </TD>
          <TD mono>warn</TD>
          <TD mono>ADD_ROBOTS_TXT</TD>
        </TR>
        <TR>
          <TD>Majority (≥6 of 10) of AI crawlers blocked</TD>
          <TD mono>warn</TD>
          <TD mono>REVIEW_AI_CRAWLER_ACCESS</TD>
        </TR>
        <TR>
          <TD>
            Global <IC>Disallow: /</IC> in wildcard block, OR all 10 crawlers explicitly blocked
          </TD>
          <TD mono>fail</TD>
          <TD mono>ALLOW_AI_CRAWLERS</TD>
        </TR>
        <TR>
          <TD>Network error fetching <IC>robots.txt</IC></TD>
          <TD mono>unknown</TD>
          <TD>—</TD>
        </TR>
      </TBody>
    </DocTable>
    <P>
      A global block is defined as a <IC>User-agent: *</IC> block with <IC>Disallow: /</IC> and
      no overriding <IC>Allow: /</IC>. This blocks all crawlers — including AI search engines —
      regardless of any other rules in the file.
    </P>

    <H2 id="common-mistakes">Common mistakes</H2>
    <UL>
      <LI>
        <strong>Global Disallow: / with no AI-specific Allow rules.</strong> A{" "}
        <IC>User-agent: *</IC> block with <IC>Disallow: /</IC> blocks every crawler that does
        not have its own explicit block. If you need to restrict general crawlers but allow AI
        engines, add individual <IC>User-agent</IC> blocks for each AI crawler above the
        wildcard block.
      </LI>
      <LI>
        <strong>Blocking crawlers by provider instead of user-agent.</strong> Some sites block
        entire IP ranges or use firewall rules to block crawlers. The Analyzer only reads{" "}
        <IC>robots.txt</IC> — network-level blocks are not visible to it, but they still prevent
        AI engines from accessing your content.
      </LI>
      <LI>
        <strong>Missing robots.txt entirely.</strong> Without a <IC>robots.txt</IC> file, AI
        crawlers have no explicit guidance. The Analyzer returns <IC>warn</IC> and recommends
        creating the file. While implicit access is permitted, an explicit file signals that you
        have considered AI crawler access.
      </LI>
      <LI>
        <strong>Blocking training crawlers but not search crawlers.</strong>{" "}
        <IC>CCBot</IC> and <IC>Bytespider</IC> are primarily used for training data collection.
        Blocking them is a reasonable choice, but blocking <IC>GPTBot</IC>,{" "}
        <IC>ClaudeBot</IC>, or <IC>PerplexityBot</IC> also prevents those engines from indexing
        your site for search results. Distinguish between training and search crawlers when
        writing your rules.
      </LI>
      <LI>
        <strong>Incorrect user-agent casing in the file.</strong> While the Analyzer normalizes
        casing, some robots.txt parsers are case-sensitive. Use the exact casing shown in the
        table above (<IC>GPTBot</IC>, not <IC>gptbot</IC>) to ensure compatibility across all
        parsers.
      </LI>
    </UL>
  </article>
);

export const SpecCrawlerRulesPage = { content, toc };
